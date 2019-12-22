const fs = require('fs');
const config = require('../../config');
const path = require('path');
const $http = require('request-promise');
const resolve = function (_path) {
    return path.resolve(__dirname, _path)
};

const URLS = {
    TOKEN: 'https://api.weixin.qq.com/cgi-bin/token',
    TICKET: ''
};

function parserUrl(url, queries) {
    if (queries.toString() !== '[object Object]') return false;
    const hasQuery = url.indexOf('?') > -1;
    let queryStr = hasQuery ? '&' : '?';
    let queryArr = [];
    for (let i in queries) {
        queryArr.push(`${i}=${queries[i]}`);
    }
    return url + queryStr + (queryArr.join('&'));
}

function WxSdk (opt) {

    this.appId = config.appId;
    this.appSecret = config.appSecret;

    this.options = {};
    Object.assign(this.options, opt);

    // 将AccessToken存起来 {access_token: '', expires_in: ''}
    this.setAccessToken = this.options.setAccessToken;
    this.getAccessToken = this.options.getAccessToken;
    // this.setTicket = this.options.setTicket;
    try {
    // this.getTicket = this.options.getTicket;

    // data:{token: '', expires_in: 7200}
    this.getAccessToken().then(data => {
            data = JSON.parse(data);
        } catch (err) {
            
        }
        // 如果存在数据
        if (!JSON.parse(data)) {

        } else {

        }
        // if (this.isValidateToken(data)) {
        //     // 如果合法，则添加到文件中
        //     this.setAccessToken(data);
        // }
    })
}

// 更新accessToken
WxSdk.prototype.updateAccessToken = function () {
    return $http({
        uri: parserUrl(URLS.TOKEN, {
            appid: this.appId,
            secret: this.appSecret,
            grant_type: 'client_credential',
        }),
        method: 'GET'
    }).then((res) => {
        // setAccessToken
        return this.setAccessToken(res);
    });
};

// 判断有无accessToken并检查是否过期
WxSdk.prototype.isValidateToken = function (content) {

};

module.exports = WxSdk;