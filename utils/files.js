const fs = require('fs');
const crypto = require('crypto');

const sha1 = (str) => {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
};

/**
 * 生成当前时间戳
 * @returns {string}
 */
function createTimestamp () {
    return parseInt(new Date().getTime() / 1000) + '';
}

/**
 * 生成nonceStr
 * @returns {string}
 */
function createNonceStr () {
    return Math.random().toString(36).substr(2, 15);
}

/**
 * 转换query
 * @param ob
 * @returns {string}
 */
function stringPathQuery(ob) {
    if (!ob) return '';
    let queryArr = [];
    for (let i in ob) {
        queryArr.push(`${i}=${ob[i]}`);
    }
    return queryArr.join('&');
}

/**
 * 获取签名数据
 * @param ticket
 * @param url
 * @returns {*}
 */
function getSignPackage (ticket, url) {
    if (!ticket || !url) return {
        error: 'url没传或ticket票据没获到'
    };
    const ob = {
        jsapi_ticket: ticket,
        noncestr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    const queryStr = stringPathQuery(ob);
    return Object.assign(ob, {
        signature: sha1(queryStr)
    });
}

/**
 * 读取文件数据
 * @param path
 * @param encoding
 * @returns {Promise<any>}
 */
function readFileAsync (path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else {
                // return  string
                resolve(data)
            }
        })
    })
}

/**
 * 写数据到文件中
 * @param path
 * @param content
 * @returns {Promise<any>}
 */
function writeFileAsync (path, content) {
    return new Promise((resolve, reject) => {
        let str;
        if (typeof content !== "string") str = JSON.stringify(content);
        fs.writeFile(path, str, (err) => {
            if (err) reject(err);

            // return origin(content)
            else resolve(content);
        })
    })
}

module.exports = {
    readFileAsync,
    writeFileAsync,
    getSignPackage,
};
