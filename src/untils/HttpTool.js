import {getProtocol} from './Tool';

const delay = ({url, timeout}) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject(url + '请求超时'), timeout * 1000)
    })
}

const get = ({url, params = {}, headers = {}, timeout = 8}) => {
    const paramArr = []
    if (Object.keys(params).length !== 0) {
        for (const key in params) {
            paramArr.push( key + '=' + params[key])
        }
    }
    url = getProtocol().split('//')[0] + url;
    const urlStr = url + '?' + paramArr.join('&');

    console.log(urlStr);
    return Promise.race([fetch(urlStr, {
        method: "GET",
        headers: {
            ...headers
        }
    }), delay({url, timeout})])
}

const post = ({url, params = {}, headers = {}, timeout = 8}) => {
    const paramArr = []
    if (Object.keys(params).length !== 0) {
        for (const key in params) {
            paramArr.push(key + '=' + params[key])
        }
    }
    url = getProtocol().split('//')[0] + url;

    return fetch(url, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: paramArr.join('&')
    }, delay({url, timeout}))
}

export { get, post }