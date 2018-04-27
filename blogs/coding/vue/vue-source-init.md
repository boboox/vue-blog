---
title: 源码阅读(一)Vue初始化
---

# 源码阅读(一) Vue初始化
[[toc]]

## 从入口开始

1. build/config.js
    从打包的配置文件开始,找到文件入口
2. web/entry-runtime.js
3. web/runtime/index.js
    - 为Vue添加了实例方法$mount
        - query(el)
        - mountComponent(...)
4. core/index.js
    - initGlobalAPI(Vue)
        ::: tip 注意
        Vue 下的静态属性和方法的挂载主要是在 src/core/global-api 目录下的代码处理的
        :::
    -  为Vue添加了只读属性$isServer,$ssrContext
5. core/instance/index.js
    -  定义了Vue构造函数
       ::: tip 注意
       Vue.prototype 下的属性和方法的挂载主要是在 src/core/instance 目录中的代码处理的
       :::
    -  initMixin
        - 调用五个方法:,       在prototype上添加了_init方法
	        init方法中添加了$options属性
            - parent
	        - propsData
	        - _parentVnode
	        - _parentListeners
	        - _renderChildren
	        - _componentTag
	        - _parentElm
	        - _refElm
	        - render
	        - staticRenderFns
    -  stateMixin
        - 在prototye上添加了:`$data get`,`$props get`, `$set`, `$delete`
    -  eventsMixin
        -  在prototye上添加了:`$on` ,`$once`,`$off`,`$emit`
    -  lifecycleMixin
        -  在prototye上添加了:`_update`,`$forceUpdate`,`$destroy`
    -  renderMixin
        -  在prototye上添加了:`$nextTick`,`_render`,`_o = markOnce`,`_n = toNumber`,`_s = toString`,`_l = renderList`,`_t = renderSlot`,`_q = looseEqual`,`_i = looseIndexOf`,`_m = renderStatic`,`_f = resolveFilter`,`_k = checkKeyCodes`,`_b = bindObjectProps`,`_v = createTextVNode`,`_e = createEmptyVNode`,`_u = resolveScopedSlots`,`_g = bindObjectListeners`

##  Vue对象的实例化 new Vue()

- 从[Vue源码阅读()]已经可以知道Vue这个类是如何构造而来,但是Vue核心的响应式系统并未涉及,此文记录Vue源码阅读中对Vue响应式系统的理解

初始化一个简单的Vue对象包含两个data属性和一个计算属性
```js
Vue({
   data(){
      a:1,
      b:2
   },
   computed:{
      c(){
         return this.a+this.b;
      }
   }
})
```

Vue的构造函数
```js
function Vue(options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
***_init方法在init.js的initMixin方法中绑定到Vue的prototype上***

## 实例化的参数 Options

我们所传入Vue()构造函数方法的参数(即options),通过一系列策略处理得到了最后的实例
从上面的构造函数可以知道,实例化最核心的方法就是_init()方法.

init方法中,最核心的几个步骤概括如下
```js
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
}
```


## 初始化函数 this._init()

在我们的例子中因为我们实例化的并不是一个组件,所以走的mergeOptions方法,通过策略合并Options,
策略中针对不同的属性有`不同的处理策略`,大致包含如下
- el,propsData,使用defaultStrat
- data (稍复杂,不展开)
- watch,watcher不合并所以处理成对象包含数组{[],[]},parentVal在前
- methods,props,inject,computed 直接合并子覆盖父
- provide mergeDataOrFn


同时通过遍历`ASSET_TYPES`
添加了component,directive,filter的策略`mergeAssets`

也遍历了`LIFECYCLE_HOOKS`
添加了所有与生命周期函数相关的钩子的策略`mergeHook`


init 过程中为vm实例添加了
```js
vm._renderProxy = vm
vm._self = vm
```

并且经过多个方法处理,如下:

添加生命周期相关属性
```js
initLifecycle(vm)
```
为实例添加了_parentListeners的事件监听
```js
initEvents(vm)
```
主要挂载createElement方法
`_vnode`,`_staticTrees`,`$slots`,`$scopedSlots`,`_c`,`$createElement`
绑定了`_c`,`createElement`方法到实例上,定义了`$attrs`,`$listeners`等属性

```js
initRender(vm)
```
::: warning 注意
**在render之后调用了生命周期钩子`beforeCreate`**
:::

```js
callHook(vm, 'beforeCreate')
```
```js
initInjections(vm) // resolve injections before data/props
```
```js
//对props建立reactive property
//将options绑定到vm实例上 包括 Props Methods Data Computed Watch
//proxy 代理options上的属性到实例上,并对属性的get,set做了一次劫持
initState(vm)
initProvide(vm) // resolve provide after data/props
```
::: warning 注意
**最后调用了生命周期钩子`created`**
:::

::: tip 划重点
因为在created之前并没没有挂载`Dom($mount)`,所以此时`$el`属性并不可见
:::

```js
callHook(vm, 'created')
```

最后

在runtime/index.js中挂载了$mount

query来解析模板 from ‘web/util/index’

```js
// mountComponent  from 'core/instance/lifecycle'
if (vm.$options.el) {
    vm.$mount(vm.$options.el)
}
```
::: tip 划重点
这里说明了为什么如果不传el的话 就需要手动去执行$mount来挂载元素
:::

到此,初始化的大体流程基本上就是这样子了.关于其中一些方法的细节问题在后面的篇幅讨论

