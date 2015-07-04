#开始使用

- order: 2
- category: hexlink

---
## SDK 下载

(如使用 Android Studio 毋须下载)

[![download_sdk](../static/download-sdk.png)](../maven/hihex/sbrc/sbrc/1.6.2.954/sbrc-1.6.2.954.aar)

## SDK 环境要求

| 环境要求     |                                                                   |
|-------------:|-------------------------------------------------------------------|
| Android 系统 | Android 4.1（API 15）或更高，使用 x86 或 ARMv7（不支持MIPS）      |
| JDK 版本     | 不低于 1.6                                                        |
| IDE          | Android Studio 1.3 beta 或更高、Eclipse Mars 及 ADT 23.0.6 或更高 |


## 接入 SDK

### 如果您使用 Gradle (Android Studio)

1. 在属于该模块的 `build.gradle` 加上以下代码：

        repositories {
            maven {
                url 'http://dev.hihex.com/maven'
            }
        }
        dependencies {
            compile 'hihex.sbrc:sbrc:1.6.2.954@aar'
        }

2. 点击 “Sync Project with Gradle Files” 让项目与 Gradle 设置同步。

### 如果您使用 Eclipse ADT…

> 亲，Google 已经宣布 [不再支持 Eclipse ADT 了](http://android-developers.blogspot.hk/2015/06/an-update-on-eclipse-android-developer.html)，我们也计划全面转向 Android Studio，请赶紧换 IDE 吧~

1. 先安装 Python 3。
2. [下载 SDK](../maven/hihex/sbrc/sbrc/1.6.2.954/sbrc-1.6.2.954.aar)
3. 下载 `aar-to-eclipse`：

        curl -L -O https://github.com/hihex/aar-to-eclipse/raw/master/aar-to-eclipse.py

4. 利用此程序将 `sbrc.aar` 转换成 Eclipse Android Library：

        ./aar-to-eclipse.py sbrc.aar

5. 在 Eclipse 导入刚才产生的 `sbrc` 文件夹。
6. 在您的项目中的 `project.properties` 加入一行 `manifestmerger.enabled=true`，便可使用此 SDK 库了。

## 一个简单的例子

完整代码请查看我们的 [GitHub repository](https://github.com/hihex/hexlink-demo/tree/e328c2cb1e109c74337bbb27598e1f747813ab70/HelloSbrcActivity)

```java
package hihex.sbrc_samples.hello_sbrc;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.FrameLayout;
import android.widget.TextView;

import java.util.Random;

import hihex.sbrc.Client;
import hihex.sbrc.ClientFactory;
import hihex.sbrc.DisconnectReason;
import hihex.sbrc.Identity;
import hihex.sbrc.SbrcManager;
import hihex.sbrc.StandardClient;
import hihex.sbrc.android.SbrcActivity;
import hihex.sbrc.events.PanState;
import hihex.sbrc.modules.JoystickModule;

// This is a sample Android-based activity. Connect a HexLink client from your cellphone, and drag the color squares.
//
// The SbrcActivity class is provided to simplify initialization of the HexLink server. If you are writing an
// Android-based single-activity application, you should start by subclassing SbrcActivity.
//
public final class HelloSbrcActivity extends SbrcActivity {
    private static final Random sRandom = new Random();
    private FrameLayout mFrameLayout = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // All normal Android initialization stuff goes to here.
        mFrameLayout = new FrameLayout(this);
        setContentView(mFrameLayout);
    }

    // This method is called when the HexLink service is fully functional. All HexLink-related methods should be placed
    // here.
    @Override
    protected void onSbrcReady() {
        final SbrcManager manager = getSbrcManager();

        // HexLink supports multi-user natively. The ClientFactory will create a Client instance for each connected
        // user.
        manager.setClientFactory(new ClientFactory() {
            @Override
            public Client create() {
                return new SampleClient();
            }
        });
    }

    // The basic ingredient of a Client is its touch screen. The StandardClient class provides high-level gesture
    // analysis of these touch events.
    //
    // In a StandardClient, the screen is divided evenly into rectangles called Modules. Each Module define a gesture
    // idiom such as "D-Pad", "Joystick", "Mouse", etc. Combine these Modules together to provide a powerful controlling
    // experience.
    //
    private final class SampleClient extends StandardClient {
        private final TextView mView;

        public SampleClient() {
            // Here we simulate the whole touch screen as a joystick.
            super(/*rows*/1, /*columns*/1, /*isLandscape*/false);

            final JoystickModule module = new JoystickModule() {
                @Override
                protected void onJoystickEvent(final PanState panState, final float relX, final float relY) {
                    if (panState == PanState.kCanceled) {
                        return;
                    }

                    // Move our color box. The `relX` and `relY` describe the displacement from the center. By default
                    // the distance is less than 144 which can be configured using `module.setRadius()`. Note that in
                    // HexLink, all clients' touch screen widths are normalized to 320.
                    //
                    // Note! The callbacks from libsbrc usually aren't run in the main thread. This is a deliberate choice, as
                    // many game engines don't use the main thread as the rendering thread anyway.
                    //
                    // This means if we want to update the Android UI, we should remember to call `runOnUiThread()`:
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            final FrameLayout.LayoutParams params = (FrameLayout.LayoutParams) mView.getLayoutParams();
                            params.leftMargin = 144 + (int) relX;
                            params.topMargin = 144 + (int) relY;
                            mView.setLayoutParams(params);
                        }
                    });
                }
            };

            setModules(module);

            mView = new TextView(HelloSbrcActivity.this);
        }

        // This method is called whenever the user is connected. So let's show our color box.
        @Override
        public void onConnect(final Identity identity) {
            super.onConnect(identity);

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    final int randomColor = Color.HSVToColor(new float[]{sRandom.nextFloat() * 360, 1, 1});
                    mView.setBackgroundColor(randomColor);
                    mView.setTextColor(Color.BLACK);
                    mView.setText(identity.nickname);

                    final FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(200, 50);
                    params.leftMargin = 144;
                    params.topMargin = 144;
                    mFrameLayout.addView(mView, params);
                }
            });
        }

        // This method is called whenever we are sure that the user is disconnected (due to network conditions, this
        // method may not be called at the same time the connection is lost). Here we will remove the color box.
        @Override
        public void onDisconnect(final Identity identity, final DisconnectReason disconnectReason) {
            super.onDisconnect(identity, disconnectReason);

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mFrameLayout.removeView(mView);
                }
            });
        }
    }
}
```

把上述代码复制到一个 MainActivity 文件中，编译后就可以在电视上运行啦。试一下用 [好连遥控](http://www.hihex.com) 手机 app 连接，并控制电视上面的色块运动吧。

---

## 更多手机与电视的交互

以上简单地给出了一个手机操控电视的示例，但是 HexLink 本身不是一个只提供这些功能的解决方案，你还可以使用这一套 SDK 进行 [游戏操控](/docs/control.html)、[电视输入](/docs/ime.html)、[电视支付](/docs/payment.html)。
