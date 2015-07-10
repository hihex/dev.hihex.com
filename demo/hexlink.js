'use strict'

var hexlink = (function () {
  var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent || ''

  function is_ios() {
    var is_iphone = /iphone/i.test(userAgent)
    var is_ipad = /ipad/i.test(userAgent)
    var is_ipod = /ipod/i.test(userAgent)
    return is_iphone || is_ipad || is_ipod
  }

  function is_android () {
    return /android/i.test(userAgent)
  }

  function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      callback(WebViewJavascriptBridge)
    } else {
      document.addEventListener('WebViewJavascriptBridgeReady', function() {
        callback(WebViewJavascriptBridge)
      }, false)
    }
  }

  if (is_ios()) {
    connectWebViewJavascriptBridge(function (bridge) {
      bridge.init(function(message, responseCallback) {
        console.log('JS got a message', message)
        var data = { 'Javascript Responds':'Wee!' }
        console.log('JS responding with', data)
        responseCallback(data)
      })
      bridge.registerHandler('hexlinkInfoHandler', function (data) {
        alert(JSON.stringify(data))
      })
    })

    var installApk = function (obj) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('installApk', obj)
      })
    }

    var cancelInstall = function (obj) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('cancelInstall', obj)
      })
    }

    var castVideo = function (obj) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('castVideo', obj)
      })
    }

    var shareMsg = function (obj) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('shareMsg', obj)
      })
    }

    var showToast = function (obj) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.send(obj)
      })
    }

    var startIntent = function (str) {
      connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler('startIntent', {intent: str})
      })
    }
  } else {
    var installApk = function (obj) {
      _hexlink.installApk(obj.packageName, obj.apkUrl, obj.versionCode)
    }

    var cancelInstall = function (obj) {
      _hexlink.cancelInstall(obj.packageName)
    }

    var castVideo = function (obj) {
      _hexlink.castVideo(obj.videoUrl)
    }

    var shareMsg = function (obj) {
      _hexlink.shareMsg(JSON.stringify(obj))
    }

    var showToast = function (str) {
      _hexlink.showAndroidToast(str)
    }

    var startIntent = function (str) {
      _hexlink.startIntent(str)
    }
  }

  return {
    installApk: installApk,
    cancelInstall: cancelInstall,
    castVideo: castVideo,
    shareMsg: shareMsg,
    showToast: showToast,
    startIntent: startIntent
  }
})()