---
title: React入门教程
---


# React入门教程
[[toc]]

## jsx

## 类组件

ES6 class写法,
必须返回一个render函数

```js
class Test extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
      </div>
    );
  }
}
```

### state

本地状态`state`
类似于vue中的data函数,
只有在构造函数中可以分配state,
其余地方不应该直接修改state.
而是通过`this.setState({stateProp:'a'})`方法去修改
::: tip 注意
值得注意的是,如果在render方法没有被引用的字段,不应该出现在state中
:::
写法为
```js
 constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```
当一个state的值的更新依赖于他的值的时候
使用`setState`的另一个方法
```js
// preState:前一个状态 ,props:更新时的props
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```
### props

props包含了组件的调用者定义的props

### defaultProps
可以定义为组件类自身的属性,用来设置默认的props
```js
CustomComp.defaultProps={
    text:'默认'
}
```
### displayName
displayName字符串将被用在调试信息中.JSX会自定设置这个值

## 生命周期

### Mounting

当组件实例被创建并将其插入DOM时,这些方法将被调用:
- constructor
- componentWillMount
- render
- componentDidMount

### Updating

改变props或者state可以出发更新事件,在重新渲染组件时,这些方法会被调用

- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

### Unmounting

当一个组件从Dom删除时,这个方法将被删除

- componentWillUnmount

```js
//在组件输出被渲染到DOM之后运行
componentDidMount(){
}

// 
componentWillUnmount(){
}
```

## 事件

```js
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

在jsx中必须注意`this`的指向,
可以
- 在构造函数中绑定:`this.handleClick = this.handleClick.bind(this)`
- 使用`属性初始化语法`(es6语法,将定义绑定到实例上)(推荐)


## 条件渲染

可以在render函数内做逻辑判断
```js
render() {
    const isLoggedIn = this.state.isLoggedIn;

    let button = null;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
```

也可以使用逻辑 %% 内联if的用法
```js
render(){
    {unreadMessages.length > 0 &&
            <h2>
            You have {unreadMessages.length} unread messages.
            </h2>
    }
}
```


## Slot与子元素

默认Slot为 props.childrens
```js
<div>{this.props.children}</div>
```
也可以自定义Slot
在父组件中
```js
 <Slot left={
    <div>左边左边左边</div>
    }
    right={
    <div>右边右边右边</div>
    }></Slot>
```
则可以在组件中用`props.left/right`来获得`slot`的内容,

- 在组件标签的开放闭合标签中的内容都会被传递给`props.children`
- children子元素通常被认为是一个字符串,jsx的表达式,它也可以是一个回调函数
```js
<Slot>
    {(i) => <span>这是children传函数渲染出{i}</span>}
</Slot>
```


## Ref

可以给Dom添加ref属性,这个属性可以接受一个回调函数
这个回调函数在Dom被挂载或卸载的时候会被调用
```js
<input type="text"
ref={(input) => { this.textInput = input; }} />
```
- `componentDidMount`(mounted):会将Dom传入回调
- `componentDidUpdate`(unmounted):会将null传入回调

::: tip 注意
**你不能在函数式组件上使用 ref 属性**，因为它们没有实例:
:::
