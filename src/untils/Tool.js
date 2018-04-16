/**
 * 2 dimensional array: 转化为二维数组
 * @param originArray 原始的一维数组
 * @param 转化后的二维数组 每一行的长度. 即 a[0]的长度
 */
const IOS = 'IOS',
    ANDROID = 'Android',
    CHROME_VERSION = 37; //支持https 的谷歌版本

/**
 * 返回 https 或 http
 * @returns {string}
 */
export const getProtocol = (url) => {
    const env = getEnv(),
        sys = getSys();
    let chromeVersion = '';

    if (sys == ANDROID && navigator.userAgent.split('Chrome/')[1]) chromeVersion = navigator.userAgent.split('Chrome/')[1].substr(0, 2);
    else if (sys == ANDROID) chromeVersion = 30;

    // 2016/7/16 ios/及选定版本的chrome for android才支持https

    if (url) {
        return (setProtocol() + url.split('://')[1])
    } else {
        return setProtocol()
    }

    function setProtocol() {
        if (location.href.indexOf('https') > -1) {
            if (env == 'app' && sys == ANDROID && chromeVersion < CHROME_VERSION) {
                return 'http://';
            }
            return 'https://';
        }
        else
            return 'http://';
    }
}

/**
 * @desc [判断运行环境是app还是pc]
 * @returns {*}
 */
export const getEnv = () => {
    //真正的app，会带有BR两个关键词 --原生写入
    if (navigator.userAgent.match(/BR/) == null) {
        return 'pc';
    }
    return 'app';
}

/**
 * 获取系统类型
 * @returns {*}
 */
export const getSys = () => {
    let ua = navigator.userAgent;
    if (ua.match(/iPhone|iPod/i) != null || ua.match(/iPad/i) != null) {
        return 'IOS';
    }
    else if (ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1) {
        return 'Android';
    }
    else {
        return 'PC';
    }
}