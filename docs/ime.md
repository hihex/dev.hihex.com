# 电视输入

- order: 5

---

电视上的输入法，一直是广大 TV app 开发者头疼的问题。使用传统遥控器在电视上输入文字十分困难，对用户造成了很大的使用壁垒。输入用户名密码登录、支付等 PC 和手机上常见的强交互的场景，在 TV 上显得障碍重重。

好连遥控的一个特色功能，就是可以使用手机进行输入，将输入的内容传输到电视上。TV app 在接入了我们的 SDK 后，无需烦恼不同 TV 的兼容性问题，即可实现手机键盘输入，无缝连接电视。

---

## 示例代码

```java
@Override
protected final void onSbrcReady() {
    final SbrcManager manager = getSbrcManager();

    ...

    // 只要对每个输入框注册一次就可以用了！

    final EditText textField1 = (EditText) findViewById(R.id.input1);
    RemoteTextInputMonitor.attach(manager, textField1);

    final EditText textField2 = (EditText) findViewById(R.id.input2);
    RemoteTextInputMonitor.attach(manager, textField2);

    ...
}
```

