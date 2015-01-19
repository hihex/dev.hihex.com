# 游戏操控

- order: 3
- category: hexlink

---

## 一个简单的例子

```java
// Java sample codes here
mGame.sbrcManager.setClientFactory(ClientFactories.singleton(new Client() {    @Override    public void onTap(final TapEvent event) {        System.out.println("onTap点击事件");				   
        System.out.println(event.deviceId.toString()+"此为按下此事件的设备ID，每个设备ID是唯一的");    }    @Override    public void onSwipe(final SwipeEvent event) {        System.out.println("onswipe滑动事件");        System.out.println(event.angle+“此为获取的角度”);    }    @Override    public void onPan(final PanEvent event) {        // TODO Auto-generated method stub        if (event.state == PanState.kBegin) {            System.out.println("down");        } else if (event.state == PanState.kEnd) {            System.out.println("end");        } else if (event.state == PanState.kMove) {            System.out.println("move");        }    }    @Override    public void onConnect(final Identity identity) {        //连接状态，通过参数identity可获取连接的设备ID的信息（设备号，用户昵称）等。    }    @Override    public void onDisconnect(final Identity identity, final DisconnectReason reason) {}        //断开连接状态，通过参数identity可获取连接的设备ID的信息等。    }));
```

把上述代码复制到一个新的 xxx 文件中，然后...

## 就这些？！

就是这么简单！
