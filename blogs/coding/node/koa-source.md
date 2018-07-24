---
title: koa源码
---

[[toc]]

# koa


从koa的package.json找到,我们require进程序的是
`@/lib/application`文件export出来的内容,
打开对应的文件 第一句代码便是

```javascript
module.exports = class Application extends Emitter
```

由此可知`Application`类继承了`Eimtter`也就是`events`库

`Application`一共就200+行代码
其中包括
- constructor
- listen() 
- toJSON()
    - 返回实例中抽取的`subdomainOffset`,`proxy`,`proxy`属性组成的JSON对象
- inspect()
    - 调用了toJSON()
- **use(fn)**

另外包括了几个私有方法
- callback()
- handleRequest()
- createContext()
- onerror()

`callback`,`handleRequest`,`createContext`,`onerror`等是私有方法,具体功能在介绍相关功能时展开


## use(fn)

koa2 基于ES6,使用了很多ES6的新特性,
其中最重要的就是`generator`,`yield`等特性

```javascript
// 控制参数类型
if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
// 判断是否是Generator生成的方法
if (isGeneratorFunction(fn)) {
    // 将generator生成的函数转化成 调用co函数的函数
    fn = convert(fn);
}
// 将中间件函数放入中间件数组
this.middleware.push(fn);
// 返回实例 =====> 所以支持链式调用
return this;
```

::: tips co函数????
在use方法中的convert函数中,
使用co库将用户传入的fn包装成了一个thunk函数
:::



## listen()

```javascript
// callback方法稍后解释
const server = http.createServer(this.callback());
return server.listen(...args);
```

从源码知道`listen`方法其实就是调用`http.createServer`,然后监听指定端口并创建了一个`web服务`

### callback()

```javascript
  callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);
    const handleRequest = (req, res) => {
      // 通过createContext方法 加工node原生的req和res生成koa的context对象
      const ctx = this.createContext(req, res);
      // 然后交由koa实例的handleRequest处理
      return this.handleRequest(ctx, fn);
    };
    return handleRequest;
  }
```
`fn`方法经由`compose`方法加工后传入handleRequest

callback方法返回了一个入参为`req`,`res`的`handlerRequest`函数
来作为`http.createServer`的参数

#### compose

**为什么koa中next可以实现中间件的链式传递?**

```javascript
 return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      // 如果多次调用next,在第二次调用是,i已经在上一次next中被设置为(i+n)
      // index必然会>i
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      // index记录调用栈的深度
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
          // dispatch最终返回一个promise,
          // app.use(fnRaw)
          // fnRaw = fn(ctx,next) = fn(next,dispatch(i+1)) 
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
```

::: tips compose
将`dispatch(i)`方法做为`next`方法,连同context传入下一个`fn`也就是中间件函数,
所以当注册中间的时候,next方法可以进入到下一个中间件函数中
:::


#### handleRequest 

`handleRequest`方法接受两个参数,一个是上下文`ctx` ,一个是中间件函数`fnMiddleware`
```javascript
  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    // 默认status
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    // 还没看明白这个方法做什么.....
    onFinished(res, onerror);
    return fnMiddleware(ctx).then(handleResponse).catch(onerror);
  }
```

`respond`方法主要处理的是将`ctx.body`的内容通过node原生的response来返回给请求端

在上面的return方法中,只把ctx一个参数塞入`fnMiddleware`但是我们在实际运用中,还有一个`next`方法?

所以整个listen方法大概就是
```javascript
http.createServer((req,res)=>{
    return handleRequest((ctx,fn)=>{
        return fn(ctx).then(respond(ctx)).catch(onerror)
    })
})
```



#### createContext

```javascript
createContext(req,res){
    const context = Object.create(this.context);
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
}
```
`createContext`方法中对context的`req`与`res`对node原生的`request`和`response`做了一层引用
