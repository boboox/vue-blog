---
title: ES6-Generator
---

# 简介

部分内容摘自阮大[generator的语法](http://es6.ruanyifeng.com/#docs/generator)

Generator 函数有多种理解角度。语法上，首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

形式上，Generator 函数是一个普通函数，但是有两个特征。一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yield表达式，定义不同的内部状态（yield在英语里的意思就是“产出”）。

## 功能及用法


在function和函数名之间添加一个`*`号表示该函数是一个generator函数
```javascript
function * foo(){...}
```

在函数内部 使用 `yield`与`return`定义不同的状态
```javascript
function * foo(){
    yield 'first';
    return 'last'
}
```

执行函数返回的是generator的指针对象(Iterator),并不执行函数内部任何代码
```javascript
function * foo(){
    yield 'first';
    return 'last'
}
var f = foo();// 啥也不发生
```

调用指针对象的`next`方法,
可以让generator执行到下一个状态(`yield` 或者 `return`),执行完右侧表达式返回后并停留

`next`函数返回结果包含`value`与`done`两个属性
- `value`为`yield`表达式执行的结果
- `done`为布尔型,表示后续是否还有未执行的`yield`或`return`表达式
    - 执行`return`的时候`done`为`true`,如果没有`return`,则会返回`false`,如果没有后续的`yield`,则返回`true`

```javascript
var f = foo();// 啥也不发生
f.next() // {value:'first',done:false}
```

`next`方法可以传入参数,该参数做为上一个`yield`的返回值,`yield`表达式本身返回`undefined`

也就是说.第一次执行的时候,`next`传入的参数没有作用
```javascript
function* foo() {
    var a = yield;
     // a:100
    console.log('a:' + a);
}
var f = foo();
console.log(f.next()); // { value : undefined, done: false}
console.log(f.next(100));// { value : undefined, done: true}
```

`generator`函数具备记忆功能

```javascript
function* foo(z) {
    var a = yield z;
    var b = yield a;
    return a + z + b
}
var f = foo(99);
console.log(f.next()); // { value : 99, done: false}
console.log(f.next(100)); // { value : 100, done: false}
console.log(f.next(1)) //  { value : 200, done: true}
```

`generator`返回的指针对象包含的方法除了`next`之外还有
- `throw`: 可以在当前状态的位置抛出一个异常,而且在之后会执行一次`next`
    如果错误被内部捕获,则不影响运行
- `return`:强制以`return`函数参数的值做为`value`结束

## generator的异步应用




