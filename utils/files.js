const fs = require('fs');
const crypto = require('crypto');

const sha1 = (str) => {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
};

exports.readFileAsync = function (path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else {
                // return  string
                resolve(data)
            }
        })
    })
};

exports.writeFileAsync = function (path, content) {
    return new Promise((resolve, reject) => {
        let str;
        if (typeof content !== "string") str = JSON.stringify(content);
        fs.writeFile(path, str, (err) => {
            if (err) reject(err);

            // return origin(content)
            else resolve(content);
        })
    })
};


function createTimestamp () {
    return parseInt(new Date().getTime() / 1000) + '';
}
function createNonceStr () {
    return Math.random().toString(36).substr(2, 15);
}

// 将object 转换成 query 的格式
function stringPathQuery(ob) {
    if (!ob) return '';
    let queryArr = [];
    for (let i in ob) {
        queryArr.push(`${i}=${ob[i]}`);
    }
    return queryArr.join('&');
}

//
exports.getSignPackage= function  (ticket, url) {
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
    console.log(queryStr);
    return Object.assign(ob, {
        signature: sha1(queryStr)
    });
};
