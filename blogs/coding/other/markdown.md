---
title: MarkDown 使用指南
lang: zh-CN
pageClass: markdown-class
---

# MarkDown 使用指南

[[toc]]

## 概述

Markdown 语法的目标是：成为一种适用于网络的书写语言。

Markdown 不是想要取代 HTML，甚至也没有要和它相近,它的语法种类很少,只对应 HTML 标记的一小部分

Markdown 的理念是,能让文档更容易读写与修改.不在 Markdown 涵盖范围之内的标签，都可以直接在文档里面用 HTML 撰写。不需要额外标注这是 HTML 或是 Markdown；只要直接加标签就可以了.

由于Markdown最终会被转成html标签.所以在文本需要描述一个html标签,

遇到<是需要书写为&lt;

而 & 需要书写为 &amp;

- *,-,+ 3个符号效果都一样,被称为Markdown符号
- 空白行表示另起一个段落
- `表示行内代码,tab 表示 代码段


## 标题设置

一级标题,类似于&lt;h1&gt;,在文字下方使用===标注 (任意数量的=) 

二级标题,类似于&lt;h2&gt;,在文字下方使用---标注
示例:

```
一级标题
===
二级标题
---
```
## 文字

- 斜体: 将需要设置为斜体的文字两端用1个 * 或者 - 包裹起来,就像这样子写:`*斜体*` *斜体*
- 粗体: 将需要设置为粗体的文字两端用2个 * 或者 - 包裹起来,就像这样子写:`**斜体**` **斜体**


## 引用

在段落前使用 > 表示该段文字是一段引用,就像:

`>这里是一段引用`

>这里是一段引用

## 列表

无序列表,在段落之前使用一个markdown符号*,+,-来表示该行是一个列表

```
+ 列表1
+ 列表2
+ 列表3
```

+ 列表1
+ 列表2
+ 列表3

如果需要展示有序列表.则使用数字加.,后面跟上一个空格

```
1. 列表1
2. 列表2
3. 列表3
```

1. 列表1
2. 列表2
3. 列表3

## 代码区块

使用tab制表符或者4个空格表示代码区块

    code
    with
    tab

在头尾用 ` ``` ` 包裹 三个`

```
```包裹
的代码区块
```

还可以在` ``` `后跟上bash/javascript/css/html 等表示不同的着色

```bash
npm run dev
```

```javascript
var a = 1;
```

```css
body {
    height:100%
}
```

```html
<div>
</div>
```
::: tip
不同的模板对着色的样式的都不一样
:::

## 代码

标记一小段行内代码,使用`包裹,例如:

```
使用 `alert()` 方法
```

使用 `alert()` 方法

代码段中的<,&,[ 等都会被自动的转换为HTML实体,例如

代码段中的<div>这里有个DIV</div>[链接](www.bobozhang.com) 都会被自动解析

代码段中的`<div>`,`[链接]` 都会被自动解析

## 分割线

可以在一行中使用 3个markdown标签 来建立一个分割线,例如

```
***
```

***


::: tip
但是注意,标签后面不可以有其他内容
:::


## 链接

使用[]包裹链接锚点,即a标签的内容
使用()包裹超链接,即a标签的href

```
[博客](http://www.bobozhang.com)
```
[博客](http://www.bobozhang.com)

如果还想给链接加上title,在()内用””把title括起来.例如

```
[博客](http://www.bobozhang.com "bobozhang的博客")
```
[博客](http://www.bobozhang.com "bobozhang的博客")

也可以通过如下方式定义参考式的链接,可以放在文件的任何位置

```
[myblog]: http://www.bobozhang.com  "bobozhang的博客"
```
使用的时候按照以下方式
```
[博客][myblog]
```
即可生成同样的效果
[博客][myblog]

## 图片

图片的方式类似超链接,使用!一个叹号开头,[]包裹图片的alt,然后使用()包裹图片地址
```
![头像](/bobozhang.jpg)
```
![头像](/bobozhang.jpg)

> 目前还没有markdown能支持图片宽高的设置,可以使用带参数的图床,或者用img标签
``` html
<img src="/img/bobozhang.jpg" alt="头像" height="50" width="60">
```

<img src="/bobozhang.jpg" alt="头像" height="50" width="60">








[myblog]: http://www.bobozhang.com  "bobozhang的博客"
