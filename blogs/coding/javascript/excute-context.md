---
title: JS的执行上下文
---

# js执行上下文

## 深入执行上下文(Excution Context)

众所周知,每当我们调用一个方法的时候,都会创建一个新的`执行上下文`,
在JavaScript解释器内部,每次创建`执行上下文`都需要两个阶段

- **Creation Stage**创造阶段(发生在方法被调用但是未执行任何代码之前)
    - 创建作用于链
    - 创建变量,方法,参数
    - 定义`this`的值
- **Activation / Code Execution Stage**激活/代码执行阶段
    - 赋值,引用函数,解释/执行代码

`执行上下文`在概念上类似于有3个属性的对象

```js
executionContextObj = {
    'scopeChain': { /* 变量对象 + 父对象的变量对象 */ },
    'variableObject': { /* 方法参数 / 内部变量 + 函数声明 */ },
    'this': {}
}
```

## 活动对象与变量对象

上面提到的`executionContextObj`,是在方法被调用但是方法并未真正执行的时候创建的.即上面提到的`创造阶段`.
在这个阶段,解释器通过扫描方法的参数,内部函数定义和内部变量定义等 创造了`executionContextObj`.这一系列的扫描最后转变成了`executionContextObj`中的`variableObject变量对象`属性

解释器执行这个过程的伪过程大致如下:

1.  找到某些代码去调用一个方法
2.  在执行方法代码前,先创建这个方法的`执行上下文 execution context`
3.  进入`创建阶段 creation stage`
    - 初始化作用域链
    - 创建`变量对象 variableObject`
        - 创建`arguments 对象`:检查上下文中的参数,初始化他们的名称和值并且创建一个引用副本
        - 扫描函数声明的上下文:
            - 对于每个找到的方法,在`变量对象 variableObject`中用其名称为其创建一个属性,这个属性包含了一个指向这个方法在内存中的引用指针
            - 如果方法名已经存在,则指针的值会被覆盖
        - 扫描变量声明的上下文:
            - 对于每个找到的变量声明,同样以其名字在`变量对象 variableObject`为其创建一个变量,同时将其的值初始化为`undefined`
            - 如果变量名已经存在了,则什么都不做,继续扫描下一个
        - 定义在这个当前上下文中`this`的值
4. 进入`激活/代码执行阶段 Activation / Code Execution Stage`
    - 在上下文中逐行 `运行/解释 Run/interpret` 函数代码和变量赋值

示例:

```js
function foo(i) {
    var a = 'hello';
    var b = function privateB() {

    };
    function c() {

    }
}

foo(22);
```

当调用了`foo(22)`之后,`创建阶段 creation stage`看起来大概就是这样子:

```js
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: undefined,
        b: undefined
    },
    this: { ... }
}
```

如上所示,在`创建阶段`,只定义了变量名,并没有对他们赋值.
当`赋值阶段`结束之后,执行流进入方法,方法执行完成之后, `激活/代码执行阶段`就变成了这样子的:
```js
fooExecutionContext = {
    scopeChain: { ... },
    variableObject: {
        arguments: {
            0: 22,
            length: 1
        },
        i: 22,
        c: pointer to function c()
        a: 'hello',
        b: pointer to function privateB()
    },
    this: { ... }
}
```

## Hoisting,关于提升

网上有很多关`变量提升`的文章,解释了`提升`是什么:变量定义会被提升到方法作用域的顶部.但是,都没有解释为什么会发生提升.当理解了解释器如果创建 `activation object`后,就会明白为什么会发生提升了

```js
​(function() {

    console.log(typeof foo); // function pointer
    console.log(typeof bar); // undefined

    var foo = 'hello',
        bar = function() {
            return 'world';
        };

    function foo() {
        return 'hello';
    }

}());​
```

现在我们可以回答一下问题:
-  为什么我们可以在foo定义之前去访问它?
    -  因为在`创建阶段`,`激活/代码执行阶段`之前变量都已经被创建了,在代码开始运行的时候,foo已经在`activation object`中被定义了.是一个指针引用
-  Foo被定义了两次,为什么foo显示的是`function`而不是`undefined`或者`string`
    -  即便foo定义了两次,但是我们知道在`创建阶段`方法在变量之前被创建.所以当`var foo`被扫描到的时候foo已经存在,而且是一个指向function foo()的指针.所以在`创建阶段`变量处理的过程中,遇到已经定义的foo,js什么也不会做.
-  为什么bar是undefined呢?
    -  因为bar实际是一个变量,做了一次匿名函数的赋值,所以bar在`创建阶段`的时候以变量的方式处理,处理为`undefined`
