---
title: koa入门
---


[[toc]]

Koa 应用程序是一个包含一组中间件函数的对象，它是按照类似堆栈的方式组织和执行的。
Koa 的体积比express更小因为他不打包任何中间件

# 安装

新起一个目录,koa-demo
```bash
npm init -y
npm install koa --save
```
## 开始

使用node v8以上版本,将很好的支持es6的新特性

新建`index.js`
引入`koa`
写入最简单的一段代码
```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    ctx.body = "hello world"
});

app.listen(8480);

console.log("demo in run")
```
运行index.js后
在浏览器中访问localhost:8480即可看见 hello world

这就是用koa搭建了一个最简单的web服务器

## app


### app.use

将中间件通过use方法添加到应用程序

### next
koa的中间件之间使用`next`方法递交执行权,整个执行的过程按照注册的(use方法)顺序,先进后出(FILO,Fisrt In Last Out)

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log(1);
    next();
    console.log(5);
})

app.use(async (ctx, next) => {
    console.log(2);
    next();
    console.log(4);
})

app.use(async (ctx, next) => {
    console.log(3);
    next();
})
app.use(async ctx => {
    ctx.body = "hello world"
});

app.listen(8480);

console.log("demo in run")
```
上面的代码输入的是
```bash
1
2
3
4
5
```
### app.listen

用这个方法可以监听指定端口并开始提供httpweb服务

其实这个方法的实现就是
``` javascript
http.createServer(app.callback()).listen(3000)
```
所以一个应用程序可以服务多个端口,并且可以使用https

### app.keys

用于cookie的签名密钥

```javascript
app.keys = ['im a newer secret', 'i like turtle'];
```

### app.context

app.context是传入中间件的参数之一ctx的对象原型,
所以,可以通过给context添加属性来为ctx提供更多的功能

### 错误处理

除非app.slient 为true ,默认情况下,应用程序的错误都输出到stderr.
当发生404的时候不会输出错误

要添加自定义错误处理逻辑的时候,可以添加`error`的事件监听

```javascript
app.on('error', (err, ctx) => {
    console.log(err);
})
```

## ctx

context对象是对node中request和reponse的封装,并且提供了很多常用的API,
每一个请求都会创建一个context并且传递给中间件

### API

具体API可以查看相关文档

[KOA Context API](https://github.com/koajs/koa/blob/41257aa91e437149112668dd018aaa2081f98d0d/docs/api/context.md)

[KOA Request API](https://github.com/koajs/koa/blob/41257aa91e437149112668dd018aaa2081f98d0d/docs/api/request.md)

[KOA Response API](https://github.com/koajs/koa/blob/41257aa91e437149112668dd018aaa2081f98d0d/docs/api/response.md)
