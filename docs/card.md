# 内嵌卡片

- order: 6
- category: hexlink

---

好连遥控拥有卡片式的设计，即功能或内容可以集成在一张卡片中展现。这给第三方开发者带来了极大的扩展性，合作伙伴只需要编写简单的移动端网页，或是在原有网页中加入接口，即可通过 JavaScript 调用好连遥控的原生方法与电视交互。

![card_image1](../static/card-1.png)
![card_image2](../static/card-2.png)
![card_image3](../static/card-3.png)

---

## 一个简单的例子

```javascript
<html>
  <head>
    <title>测试页面</title>
    <script src="hexlink.js"></script>
  </head>
  <body>
    好连遥控内嵌卡片 <br/>
    <input type="button" value="点击安装 2048" onClick="hexlink.installApk({packageName: 'naozine.games.tv2048', apkUrl: 'http://apps.hihex.com/tv2048/2048plus-signed.apk', versionCode: 18});" /><br/>
    <div id="content">内容显示</div>
  </body>
</html>
```

上面的例子中，`hexlink.installApk({packageName: string, apkUrl: string, versionCode: int})` 就是我们提供的 API 接口，将好连遥控的原生能力提供给 Mobile Web Page 调用，使第三方可以专注内容提供，非常方便地与电视交互。

###Demo


1. 手机下载安装 [好连遥控-卡片调试专用版](https://apps.hihex.com/demo/HexLink-v1.6.1-webview-debugger.apk)
2. 电视/盒子下载安装 [好连遥控 TV 端](http://apps.hihex.com/hexlink-tv/HexLinkTv.apk)
3. 手机和电视/盒子在同一个 WiFi 下，手机好连遥控连接上 TV 设备
4. 使用第一张卡片输入网址来完成调试
<!--demo: hexlink-android commit 052c3c4, base on v1.3.5 released-->

[HTML 卡片示例](../demo/hexlinkcard.html)（请查看页面源码）

---

## API 列表

###一、应用管理接口

[应用安装页面 Demo](../demo/app-mgt.html)（请查看页面源码）

####1. 安装应用

```javascript
installApk({packageName: string, apkUrl: string, versionCode: int})
```

电视将开始安装从 `apkUrl` 获取的安装包

参数

|参数名|类型|描述|
|--:|---|---|---|
|packageName|**string**|安装包的包名，应与 AndroidManifest 中的相同|
|apkUrl|**string**|安装包所处的网络位置|
|versionCode|**int**|应用的版本号，应与 AndroidManifest 中的相同|

####2. 取消安装

```javascript
cancelInstall({packageName: string})
```

电视将取消 `packageName` 的安装

参数

|参数名|类型|描述|
|--:|---|---|---|
|packageName|**string**|安装包的包名，应与 AndroidManifest 中的相同|


###二、电视交互接口

####1. 投射视频

```javascript
castVideo({videoUrl: string})
```

电视将播放 `videoUrl` 所指定的流媒体

参数

|参数名|类型|描述|
|--:|---|---|---|
| videoUrl|**string**|视频的 URL 地址，该地址应该是支持格式中的一种|

支持的视频格式：`m3u8`

###三、社交接口

####1. 分享到应用

```javascript
shareMsg(shareObj)
```

手机将发起一次信息分享，其中 `shareObj` 参数应为以下格式的 JavaScript 对象

|键名|类型|描述|
|--:|---|---|---|
| ShareType|**int**|分享类型|
| ShareTitle|**string**|分享的标题，显示在微信或其他分享框的标题栏上|
| ShareContent|**string**|分享的内容，作为正文分享到其他应用|
| ShareUrl*(可选)*|**string**|分享到微信朋友圈的链接 URL|
| ShareImage*(可选)*|**string**|分享的图片，以 base64 编码|
| ShareImageUri*(可选)*|**string**|分享的图片，为uri|

ShareType 表

|类型|值|描述|
|--:|---|---|---|
| 网页链接|**0**|以链接的形式分享|
| 图片|**1**|以图片的形式分享|
| 文字|**2**|以纯文本的形式分享|

> *注意*

> 在ShareType 设置为 *1 (图片)* 时，ShareImageUri会优先于ShareImage被解析,因此，仅需二者选一即可
>
> 在提供了 `ShareUrl` 的同时，提供 `ShareImage` 或 `ShareImageUri`，可以修改分享链接到朋友圈的缩略图，实现分享图文到微信朋友圈的效果。
>
> 为了始终提供给用户一个通用的文本分享方式，请务必在必填项 `ShareContent` 填写有效信息，比如描述信息，即使在期望场景中可能不是必须的。


###四、调试接口

####1. 本机信息（仅适用于 Android）

本机信息是如下格式的 JSON，在需要时以 `var os = hexlinkInfo.OS` 的方式获取。

    var hexlinkInfo = {
        "OS": "Android",
        "uuid": "db553224-xxxx-xxxx-xxxx-b2420bdf9802",
        "screenHeight": 1280,
        "screenWidth": 720,
        "Build": {
            "VERSION": {
                "SDK_INT": 17
            },
            "BRAND": "Xiaomi",
            "MODEL": "2014011"
        }
    }

 - `uuid` 为好连遥控用户设备的唯一识别码

 - `Build` 的数据来自于手机系统的 build，后续会根据需求增加，并且会提供更多关于电视的设备信息。

> *注意*

> 此接口需要在 **页面加载完成后** 才能生效，故推荐使用 `window.onload` 或 jQuery 中的方法
> ```
> $(document).ready(function(){
>     var os = hexlinkInfo.OS;
> });
> ```


####2.调试接口

开发者可以通过`showToast(String msg)`来调试javascript interface在手机上是否正常

