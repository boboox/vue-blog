---
title: Promise/A+规范
---

# Promises/A+

## 什么是Prmoises/A+标准

为实现者提供了一种`合理的,可实现的`JavaScript Promise 标准

一个Promise表示异步操作的最终结果。与Promise交互的主要方式是通过它的`then`方法，它注册回调以接收Promise最终值或Promise不能被解决的原因.

该规范详细说明了`then`方法的行为，为所有符合Promise/A+规范的Promise实现提供了一个互操作的基础。因此，规范应被认为是非常稳定的。

核心Promise/A+规范不涉及如何create、fulfill或reject Promise，而是专注于提供一种可互操作的`then`方法。

## 1.术语

1. `Promise`是一个行为符合规范且有一个then方法的对象或者方法
2. `thenable`是一个定义了有then的方法或者对象
3. `value`是任何合法的js值(包括undefined,`thenable`或者`promise`)
4. `exception`是用`throw`抛出的值
5. `reason`,用来指示`promise`为什么被拒绝的一个值

## 2.须知

### 2.1 Promise的状态

一个Promise必须且只能处在下列状态中的一个:

1. `pending` 挂起
    1. 当处在这个状态时,`promise`可以转变到`fulfilled`或者`rejected`状态
2. `fulfilled` 解决
    1. 当处在这个状态时,`promise`不能转变到其他状态
    2. 必须有一个不可改变的`value`被返回
3. `rejected` 拒绝
    1. 当处在这个状态时,`promise`不能转变到其他状态 
    2. 必须有一个不可改变的`reason`被返回

**不可改变**意味着不变的恒等式(例如 ===),但并不是深度不变的

### 2.2 `then`方法

一个`promise`必须提供一个`then`方法去访问它的当前或者最终的`value`或`reason`

`promise`的`then`方法接受两个参数

```js
promise.then(onFulfilled,onRejected)
```

1.  `onFulfilled`与`onRejected`方法都是可选的参数
    1.  如果`onFulfilled`参数不是一个方法,它必须要被忽略
    2.  如果`onRejected`参数不是一个方法,它必须要被忽略 
2.  如果`onFulfilled`是一个方法
    1.  必须要保证它在`promise`被`fulfilled`之后被调用,而且需要有一个`value`做为第一个参数
    2.  它必须不能在`promise`被`fulfilled`之前被调用
    3.  它必须只能被调用一次
3.  如果`onRejected`是一个方法
    1.  必须要保证它在`promise`被`rejected`之后被调用,而且需要有一个`reason`做为第一个参数
    2.  它必须不能在`promise`被`rejected`之前被调用
    3.  它必须只能被调用一次
4. `onFulfilled`或`onRejected`必须只能在`执行上下文`只包含**平台代码**[3.1]的时候被执行
5. `onFulfilled`或`onRejected`必须被做为函数来调用(即不包含它this值)[3.2]
6. `then`可以在一个`promise`中被调用多次
    1. 如果/当一个`prmoise`被`fulfilled`之后,所有`onFulfilled`回调必须要按照其在`then`的注册顺序依次执行
    2. 如果/当一个`prmoise`被`rejected`之后,所有`onRejected`回调必须要按照其在`then`的注册顺序依次执行
7. `then`的执行结果必须是返回一个`promise`[3.3]
    ```js
    promise2 = promise1.then(onFulfilled, onRejected);
    ```
    1. 如果`onFulfilled`或者`onRejected`返回了值`x`,则执行Promise的解析过程`[[Resolve]](promise2, x)`
    2. 如果`onFulfilled`或者`onRejected`抛出了一个异常`e`,则`prmoise2`必须以`e`做为`reason`来执行`rejected`
    3. 如果`onFulfilled`不是一个方法,而且`promise1`被`fulfilled`,则`Promise2`必须以`promise1`相同的`value`被`fulfilled`
    4. 如果`onRejected`不是一个方法,而且`promise1`被`rejected`,则`Promise2`必须以`promise1`相同的`reason`被`rejected`


### 2.3 Promise解析过程

`Promise解析过程` 是以一个`promise`和一个值做为参数的抽象过程，可表示为`[[Resolve]](promise, x)`. 过程如下；
1.  如果`promise` 和 `x` 指向相同的值, 使用 `TypeError`做为原因将`promise`拒绝。
2.  如果`x`是一个`promise`, 采用其状态[3.4]:
    1.  如果`x`是`pending`状态，promise必须保持`pending`走到`x` `fulfilled`或`rejected`
    2.  如果`x`是`fulfilled`状态，将`x`的值用于`fulfill promise`
    3.  如果`x`是`rejected`状态, 将`x`的原因用于`reject promise`
3.  如果`x`是一个对象或者方法
    1.  将`then`赋为`x.then`[3.5]
    2.  如果在取`x.then`值时抛出了异常，则以这个异常做为原因将`promise`拒绝
    3.  如果`then`是一个函数，以`x`为`this`调用`then`函数，且第一个参数是`resolvePromise`，第二个参数是`rejectPromise`
        1.  当 `resolvePromise` 被以 `y`为参数调用, 执行 `[[Resolve]](promise, y)`
        2.  当 `rejectPromise` 被以 `r` 为参数调用, 则以`r`为原因将`promise`拒绝。
        3.  如果 `resolvePromise` 和 `rejectPromise` 都被调用了，或者被调用了多次，则只第一次有效，后面的忽略。
        4.  如果在调用then时抛出了异常，则：
            1.  如果 `resolvePromise` 或 `rejectPromise` 已经被调用了，则忽略它。
            2.  否则, 以`e`为`reason`将 `promise` 拒绝。
    4. 如果 `then`不是一个函数，则 以`x`为值`fulfill promise`。
4. 如果 `x` 不是对象也不是函数，则以x为值` fulfill promise`。 

如果一个`promise`以一个`thenable`被`resolved`并且参与到了一个循环的`thenable`链,这样会导致无线的递归循环.鼓励但并不是必须的,如果检测到此类型的递归,可以以`TypeError`做为理由拒绝这个`promise`[3.6]

## 3.提示

- 3.1 平台代码:js引擎,环境与promise的实现代码.在实践中,此要求确保在调用`then`方法的`event loop`之后,以一个全新的栈异步的执行`onFulfilled`与`onRejected`.这可以用`macro-task 宏任务`(例如:`setTimeout`或`setImmediate`),或`micro-task 微任务`(例如:`MutationObserver`或`process.nextTick`)来实现.由于`Promise`本身本认为是**平台代码**,它可能自身包含了任务调度队列或者被称为那些被调用的处理句柄的`蹦床`
- 3.2 这意思是,在严格模式下,`this`将会是`undefined`,在普通模式下,`this`会指向`global object`(浏览器中是window)
- 3.3 每一份`Promise`的实现可以允许`promise2 === promise1` ,只要该实现满足所有的要求.每一份实现都应该证明其能否支持`promise2 === promise1`,并且是在什么条件下.
- 3.4 通常情况下只,如果x来自于当前的实现,它可以被认为是一个真正的`promise`.这个条款允许我们使用实现指定的方法去采用已知一致性`Promise`的状态.
- 3.5 该过程首先存储对`x`的引用，然后测试该引用，然后调用该引用，从而避免对`x.then`属性的多次访问。这样的预防措施对于确保访问器属性的一致性是重要的，访问者的属性可以在检索之间改变。
- 3.6 实现不应该设置对递归的深度做出限制,超出极限的递归应该被认为是无限递归,只有真正的循环导致一个`TyepError`.如果一个无限循环发生了.那无穷的递归也是正确的做法


原文参考地址: [promise/A+规范][promise-a-plus]

如果需要了解其中每一条的实现可以参考官方[测试代码][test-code]

[promise-a-plus]: https://promisesaplus.com/
[test-code]: https://github.com/promises-aplus/promises-tests/tree/master/lib/tests
