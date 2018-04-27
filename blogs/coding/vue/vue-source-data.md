---
title: 源码阅读(二)Vue响应式原理
---


# 源码阅读(二) Vue响应式原理
[[toc]]


## 从数据代理开始
在上一篇[源码阅读(一)Vue初始化](/blogs/coding/vue/vue-source-init.html)中主要介绍了init整个过程中执行的几个主要方法,
而建立响应式系统的关键就是initState方法

```js
// Vue-source/src/core/instance/state.js
export function initState(vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */ )
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

接上一篇的例子中,我们只传入了
`data`与`computed`
所以只会执行两个方法,`initData`与`initComputed`

关键代码如下:
```js
// Vue-source/src/core/instance/state.js
function initData(vm: Component) {
  let data = vm.$options.data
  // 当data类型是function的时候,应该是一个getter函数,所以需要data.call(vm)???
  data = vm._data = typeof data === 'function' ?
    getData(data, vm) :
    data || {}
  ...
  // proxy data on instance
  proxy(vm, `_data`, key)
  ...
  // observe data
  observe(data, true /* asRootData */ )
}
```


### 第一个关键代码

```js
data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {}
```

如果`data`是一个函数的时候,调用`getData`方法,从实例上面计算`data`的值,

否则直接发返回`data`
::: tip 划重点
看到这里就明白了官网的**Data must be a Function**
:::
如果`data`不是function则Vue做为一个组件的时候,同一个组件的多个实例将共享同一个`data`

注意:这里同时将`data`赋值给了`vm._data`

### 第二个关键代码

```js
proxy(vm, `_data`, key)
```
`proxy`方法的作用是在实例`this/vm`上面做了一次`data`的数据代理,只有如此我们才可以通过`this.a` 来访问`data.a`
这里的this就是vm
```js
export function proxy(target: Object, sourceKey: string, key: string) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key]
    }
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}
```
结果就是通过`ES5 Object.defineProperty`方法在`vm`上的定义了两个`a,b`属性,而其`getter/setter`方法为
```js
const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: function proxyGetter() {
        return this[_data][a/b]
    },
    set: function proxySetter(val) {
        this[_data][a/b] = val
    }
}
```
从此可以看出当我们在实例上访问属性`this.a`的时候,实际上他的访问路径是
this.a==>vm.a==>**vm._data.a**==>$option.data.a
至此,就完成了Vue的数据代理


## 深入响应式

### data的响应式

关键方法
```js
observe(data, true /* asRootData */ )
```
这是整个响应式的入口

`observe`方法只做了一件事情,就是`new Observer(data)`

建立了一个观察者

```js {10,20}
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data
  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    this.walk(value)
  }
  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
}
```

源码可以看出其实实例化一个`Observer`最终就是遍历`data`的所有属性
并对其调用`defineReactive`方法

```js {11,24}
export function defineReactive(obj: Object,key: string,val: any,customSetter ? : ? Function,shallow ? : boolean) {
  // 每一个响应式的属性都有持有一个依赖Dep
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function reactiveGetter() {
	  // 计算data的值
      const value = getter ? getter.call(obj) : 
	  // 直接访问data的时候Dep.target是空的
	  // 这里的用处后面讲
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val
      // 如果新旧得值没有方法变化则直接返回
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
	  // 调用setter
      setter.call(obj, newVal)
	  // 通过dep的notify发出通知,来执行dom的刷新等操作
      dep.notify()
    }
  })
}
```
通过`defineReactive`这个方法`data`对的属性的响应式系统就已经建立起来了
其中有一个关键的对象
`const dep = new Dep()`
起着依赖收集的作用,它的作用稍后展开,

到此为止`data`的a,b两个属性已经完成了响应式系统的建立,通过修改属性就可以出发依赖的通知去做相应的修改
但是,对于`computed`属性
整个过程并不一样

### computed的响应式

回到`initState`函数中,可以看到`computed`属性会调用`initComputed`方法

```js
function initComputed(vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  for (const key in computed) {
 	const userDef = computed[key]
    let getter = typeof userDef === 'function' ? userDef : userDef.get
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions)
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}
```
该方法为每一个`computed`属性实例化了一个`Watcher`
直接看一下`Watcher`构造函数的源码

```js {14}
/* Watcher的构造函数 */
constructor(vm: Component, expOrFn: string | Function, cb: Function, options ? : Object) {
  this.vm = vm
  vm._watchers.push(this)
  ...
  this.cb = cb
  this.deps = []
  this.newDeps = []
  this.depIds = new Set()
  this.newDepIds = new Set()
  ...
  this.getter = parsePath(expOrFn)
  ...
  this.value = this.lazy ? undefined : this.get()
}
get() {
  // Dep.target = this
  pushTarget(this)
  let value
  const vm = this.vm
  value = this.getter.call(vm, vm)
  // Dep.target = null ... 
  popTarget()
  this.cleanupDeps()
  return value
}
```
`Watcher`定义了一些`Dep`的集合用于收集`reactive data`的`dep`
::: tip 划重点
在完成初始化的最后,执行了`this.get()`
:::

在`get`方法中三个关键的步骤

1. pushTarget(this)
    
    `pushTarget`方法将当前`Watcher`设置为`Dep.target`(全局唯一)
     
2. this.getter.call

    在例子中,该方法就是
    ```js
    c(){
        return this.a+this.b;
    }
    ```
    调用该方法会触发a,b属性的`getter`方法,这时候我们可以回到`data`的响应式中`data`的`getter`方法中那一段函数和其相关联的函数
    ```js
    /*这段在data的get方法中,进行依赖收集*/
    if(Dep.target){
        dep.depend()
    }
    ```
    ```js
    /* Dep.depend 方法,target 就是computed实例化的watcher,也就是调用了watcher.addDep()*/
    depend () {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    ```
    ```js
    /* watcher.addDep 方法,将自己添加到传入的dep实例的sub中去 */
    addDep (dep: Dep) {
        const id = dep.id
        if (!this.newDepIds.has(id)) {
            /*watcher持有了相关的dep*/
            this.newDepIds.add(id)
            this.newDeps.push(dep)
            if (!this.depIds.has(id)) {
                /*dep持有了Watcher*/
                dep.addSub(this)
            }
        }
    }
    ```
    ```js
    /* Dep.addSub方法就是让dep持有了watcher*/
    addSub (sub:Watcher) {
        this.subs.push(sub)
    }
    ```
    整个过程就是
    - => data.a
    - => a.getter()
    - => dep.depend()
    - => **Dep的target(即Watcher).addDep()**
    - => Watcher持有了Dep
    - => **又在Watcher触发了Dep的addSub()**
    - => addSub中Dep也持有了Watcher

    到这里为止,通过`Observer`的`defineReactive`建立的getter

    让`Dep`和`Watcher`相互持有

    所以在之后我们修改data的值的时候会触发`data.setter`中的`dep.notify()`
    而此时`dep`已经持有了`watcher`,便可以通知`watcher`去刷新它的值

3. popTarget

    因为Dep.target并不是一个实例数据,他是Dep函数的静态属性,

    在Dep实例每次收益依赖的时候,收集的都是Dep当前的`target`(即Watcher)

    所以在每次调用get计算的之前会`pushTarget()`收当前的`Watcher`,

    完成取值之后

    还原`Dep.target`

    就需要调用`pushTarget()`


## 画图!

Vue的init过程(图)
![Vue的init过程](~@img/coding/vue/vue-source-data-1.png)
Vue的响应式系统(图)
![Vue的响应式系统](~@img/coding/vue/vue-source-data-2.png)
