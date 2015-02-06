# 内嵌卡片

- order: 5
- category: hexlink

---

好连遥控拥有卡片式的设计，即功能或内容可以集成在一张卡片中展现。这给第三方开发者带来了极大的扩展性，合作伙伴只需要编写简单的移动端网页，即可通过 JavaScript 调用好连遥控的原生方法。

![card_image1](../static/card-1.png)
![card_image2](../static/card-2.png)
![card_image3](../static/card-3.png)

---

## 一个简单的例子

```javascript
<html>
  <head>
    <title>测试页面</title>
  </head>
  <body>
    this is my html <br/>
    <a onClick="window.hexlink.startFunction()">点击调用java代码</a><br/>
    <a onClick="window.hexlink.startFunction('hello world')" >点击调用java代码并传递参数</a>
    <br/>
    <div id="content">内容显示</div>
  </body>
</html>
```

上面的例子中，`startFunction()` 就是我们暴露出来的 API 接口，将好连遥控的原生能力提供给 Mobile Web Page 调用。下面来看看我们有哪些方法可以调用吧~

## API 列表

TODO

