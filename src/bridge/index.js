/**
 * bridge   桥接原生方法
 * @author barret
 * @data 2018/04/14
 * @param callback
 * @returns {*}
 */
/**
 *
 * @returns {*}
 */
const getTrueSys = () => {
    const ua = navigator.userAgent;
    const lfHybrid = ua.match(/BR/); //webview内核写入
    const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    if (lfHybrid) {
        if (android) {
            return 'Android'
        }
        const iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);
        if (iphone) { //iphone
            return 'IOS';
        } else {
            const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            if (ipad) { //ipad
                return 'IOS';
            }
        }
    }else{
        return 'PC';
    }
}

// 保存常用的变量
const Android = getTrueSys() == 'Android';
const IOS = getTrueSys() == 'IOS';
const PC = getTrueSys() == 'PC';

/**
 * 根据不同的系统调用不同的WebViewJavascriptBridge
 * @param callback
 * @returns {*}
 */
const connectWebViewJavascriptBridge = (callback) => {
    if (Android) {
        //链接安卓Bridge
        if (window.WebViewJavascriptBridge) {
            callback(window.WebViewJavascriptBridge);
        }
        else {
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                //, function () {
                //    callback(WebViewJavascriptBridge);
                //},
                , function () {
                    //define a default handler use init method
                    //这段代码注释掉,抢单/工单处理等页面是不能正常使用.
                    //但如果不注释掉,使用使用了default的处理器,cb中注册处理器将失效.如getPhotoFromApp
                    //mark on 2016/6/20 其实先getUser，再注册handler，就没问题了
                    try {
                        window.WebViewJavascriptBridge.init(function (message, responseCallback) {
                        });
                    } catch (e) {
                        console.log(e);
                    } finally {
                        callback(window.WebViewJavascriptBridge);
                    }
                },
                false
            );
        }
    }
    else if (IOS) {
        //链接ios
        if (window.WebViewJavascriptBridge) {
            return callback(window.WebViewJavascriptBridge);
        }
        if (window.WVJBCallbacks) {
            return window.WVJBCallbacks.push(callback);
        }

        // 第一次调用进入这里
        window.WVJBCallbacks = [callback];
        const WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe)
        }, 10)
    }
}

/**
 * 调用原生方法
 * @param name 方法名
 * @param data 传入的数据
 * @param cb 回调函数
 */
const callAppHandler = (name, data, cb) => {
    console.warn('调用原生方法：');
    console.log(name)
    console.warn('参数：')
    console.log(data);
    const callback = function (bridge) {
        bridge.callHandler(
            name,
            data,
            function (obj) {
                console.warn('获取到的数据：')
                console.log(obj)
                try {
                    obj = JSON.parse(obj);
                }
                catch (err){
                    console.log(obj)
                }
                if(obj == 'true'){
                    obj = true;
                }else if(obj == 'false'){
                    obj = false;
                }
                if (cb) cb(obj);
            }
        );
    };

    connectWebViewJavascriptBridge(callback);
}

/**
 * @desc [注册app可调用的js函数]
 * @param name 函数名 || 多个函数名和函数的对象
 * @param Fn callback函数
 */
const registerHandler = (name, Fn) => {
    let callback = () => {};

    if (name instanceof Object) {
        const opts = name;
        callback = function (bridge) {
            for (var i in opts) {
                bridge.registerHandler(i, opts[i]);
            }
        };
    }
    else {
        callback = function (bridge) {
            bridge.registerHandler(name, Fn)
        }
    }
    connectWebViewJavascriptBridge(callback);
}

/**
 * 关闭当前webview 声明调用原生方法
 * @param cb
 */
export const DoClose = (cb) => {
    if (Android || IOS) {
        callAppHandler('doClose', null, cb);
    }
    else {
        console.warn('假装当前页面已关闭，返回上个页面');
        cb && cb();
    }
}

/**
 * 更改状态 声明原生调用H5方法
 * @param Fn callback函数
 */
//export
export const ChangeStatus = (fn) => {
    registerHandler("changeStatus", (data) => {
        fn && fn(data);
    });
}