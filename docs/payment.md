# 电视支付

- order: 4

---

> More power comes more responsibility. 「 Spider Man 」2012

我相信，只是操控几个游戏一定不是你的追求，我们还要赚钱啊！HexLink 的支付 SDK 可以让你做得更多。

---

游戏开发者在集成电视支付 SDK 前，需[联系 HiHex 团队](mailto:info@hihex.com)进行注册。注册时提供以下信息：

- 开发者名称（个人名称或公司名称均可）
- Email 地址
- 游戏服务器异步通知 URL 地址

HiHex 会提供 `merchantId` 和 `signSecret` 给开发者，开发者在调用 API 时需使用 `signSecret` 进行签名。该参数应保密，不可透露给第三方。

## 支付流程

图 4.1

![payment_image](../static/payment-workflow.png)

## 支付 SDK

游戏需要支付时，请建立一个 PaymentOrderRequest 的 anonymous subclass instance，有结果时会 call 这个 instance 的 onResult() 方法。

```java
private static final long MERCHANT_ID = 1;

...

void createOrderForLife() {
    final String orderCode = "L" + generateUniqueOrderId();
    final JSONObject extraData = new JSONObject("{\"type\":\"life\",\"amount\":1}");
    final StringBuilder queryString =
        PaymentOrderRequest.buildQueryString(/*merchantId*/ MERCHANT_ID,
                                             /*orderCode*/ orderCode,
                                             /*orderType*/ PaymentOrderRequest.Type.kProp,
                                             /*priceRmbCents*/ 300,
                                             /*subject*/ "Revive",
                                             /*remarks*/ "Gain 1 extra life",
                                             /*extraData*/ extraData);
    final String signature = signQueryStringFromYourSecretServer(queryString.toString());
    // ↑ 应执行 `toupper(sha1(queryString + "&signSecret=" + SIGN_SECRET))`
    queryString.append("&signature=");
    queryString.append(signature);

    // 发起支付的异步通信
    SbrcManager.instance.request(deviceId, new PaymentOrderRequest(queryString.toString()) {
        // 有最终结果时会呼叫 onResult()
        @Override
        protected void onResult(int errorCode, PaymentOrderResponse response) {
            switch (errorCode) {
            case kOk:
                // 支付完成，请确定 response 正确无误。
                break;
            case kCanceled:
                // 用户中途取消支付流程。
                break;
            default:
                // 发生错误。
                break;
            }
        }
    });
}
```

`PaymentOrderRequest.buildQueryString` 的参数如下：

表 4.1

| 类型 | 参数 | 描述 | 例子 |
|--:|---|---|---|
| long | **merchantId** | HiHex 提供的 merchantId | 1001 |
| String | **orderCode** | 游戏开发方的订单号 (对应服务器上的 merchantOrderNo) | "SM20150321000000012" |
| PaymentOrderRequest.Type | **orderType** | 订单类型，可选“充值”、“道具”、“会员”等 | PaymentOrderRequest.Type.kProp |
| long | **priceRmbCents** | 订单金额，人民币分 (对应服务器上的 amount) | 150 /* = ¥1.50 */ |
| Non-null String | **subject** | 购买物品描述 | "激光炮" |
| String | **remarks** | 购买物品备注 | "使用激光炮可直接摧毁敌方坦克" |
| JSONObject | **extraData** | 游戏开发者自身需要使用的更多参数，以 JSON 格式传送 | {"serverId":1,"productName":"smTank"} |

此方法会返回一个 StringBuilder。游戏开发商需为其加上签名:

```java
final StringBuilder queryString = PaymentOrderRequest.buildQueryString(...);
final String signature = sha1(queryString + "&signSecret=" + SIGN_SECRET).toUpperCase();
queryString.append("&signature=");
queryString.append(signature);
```

`PaymentOrderRequest.onResult()` 的 errorCode 主要为:

* `AsyncRequest.kOk` (0) — 用户完成了支付，且没有错误。
* `AsyncRequest.kCanceled` (4) — 用户取消了支付。
* `AsyncRequest.kMalformed` (8) — Query的格式不正确。
* `AsyncRequest.kPaymentError` (400) — 支付期间发生的错误。

response 可以是 null，或一个 PaymentOrderResponse instance，栏位如下：

表 4.2

| 类型 | 字段 | 描述 | 例子 |
|--:|---|---|---|
| long | **orderId** | HiHex 方的订单号 | 1001 |
| String | **orderCode** | 游戏开发方的订单号 | "SM20150321000000012" |
| long | **priceRmbCents** | 订单金额，人民币分 | 150 /* = ¥1.50 */ |
| PaymentOrderResponse.Method | **method** | 支付渠道 | PaymentOrderResponse.Method.kAlipay |
| Date | **completionDate** | 订单完成时间（已转换成当地时间） | 2015-03-12 12:34:53 |
| JSONObject | **errorMsg** | 订单不成功时的错误信息，JSON 格式 | {"errorCode":1, "errorMessage":"something wrong"}

## 服务器异步通知

在用户支付成功后，除了 SDK 会即时返回支付结果外，HiHex 还会异步地以主动的方式将相关结果通知给游戏服务器。游戏服务器的异步通知 URL 地址由游戏开发商在 HiHex 注册时提供。通知参数如下

表 4.3

| Field              | Type           | Description                       | Default | Example                    |
|--------------------|----------------|-----------------------------------|---------|----------------------------|
| merchantId         | int(11)        | HiHex 提供的 merchantId            | -       | 1001                       |
| merchantOrderNo    | varchar(255)   | 游戏开发方的订单号                   | NULL    | 'SM20150321000000012'      |
| orderType          | enum           | 订单类型，可选“充值”、“道具”、“会员”等 | NULL    | 'CREDIT','PROP','VIP'      |
| amount             | decimal(10,2)  | 订单金额，人民币元保留两位小数           | 0.00     | 1.50 或 10.00                |
| subject            | varchar(500)   | 购买物品描述                        | NULL    | '激光炮'                    |
| remarks            | varchar(255)   | 购买物品备注                        | NULL    | '使用激光炮可直接摧毁敌方坦克'  |
| extraData          | text           | 游戏开发者自身需要使用的更多参数，以 JSON 字符串格式传送 | NULL    | {'serverId': 1, 'productName': 'smTank'} |
| orderTime          | timestamp      | 订单发起时间                        | NULL    | '2015-03-12 12:34:53'      |
| completeTime       | timestamp      | 订单完成时间                        | NULL    | '2015-03-12 12:34:53'      |
| paymentMethod      | enum           | 支付渠道                           | NULL    | 'SHOUMENG','ALIPAY','WECHAT'  |
| status             | enum           | 订单状态，“成功”、“失败”、“取消”      | NULL    | 'SUCCESS','FAILED','CANCELED'      |
| errorMsg           | text           | 订单不成功时的错误信息，JSON 格式      | NULL    | {errorCode:1, errorMessage:"something wrong"}   |
| signature          | varchar(64)    | 支付请求时提交的 SHA1 摘要 | NULL    | '0355E7F3AF50A06B31B108C8D5EF8A1'|

