const fs = require('fs');
const config = require('../../config');
const crypto = require('crypto');
const {getWxAccessToken, getWxApiTicket} = require('../../service');

const sha1 = (str) => {
    let shasum = crypto.createHash("sha1");
    shasum.update(str);
    str = shasum.digest("hex");
    return str;
};


function WxSdk(opt) {

    this.appId = config.appId;
    this.appSecret = config.appSecret;

    this.options = {};
    Object.assign(this.options, opt);

    // 将AccessToken存起来 {access_token: '', expires_in: ''}
    this.setAccessToken = this.options.setAccessToken;
    this.getAccessToken = this.options.getAccessToken;
    this.setTicket = this.options.setTicket;
    this.getTicket = this.options.getTicket;

    this.updateJsApiTicket();
}

// 更新accessToken
WxSdk.prototype.updateAccessToken = function () {
    // 获取本地的AccessToken
    return this.getAccessToken().then(data => {
        if (!this.isValidate(data)) {
            return getWxAccessToken(this.appId, this.appSecret).then(content => {
                return this.setAccessToken(content);
            });
        } else {
            // 数据内容合法 (有内容、未过期)
            return JSON.parse(data);
        }
    })
};

// 更新票据 jsapi_ticket
WxSdk.prototype.updateJsApiTicket = function () {
    return this.getTicket().then(data => {

        // 不合法的ticket票据 -> 重新获取access_token 并 重新获取ticket
        if (!this.isValidate(data)) {
            return this.updateAccessToken().then(tokenData => {
                const {access_token} = tokenData;
                return getWxApiTicket(access_token);
            }).then(ticketData => {
                return this.setTicket(ticketData);
            });
        } else {
            // 数据内容合法 (有内容、未过期)
            return JSON.parse(data);
        }
    });
};

// 判断有无accessToken或者ticket并检查是否过期
WxSdk.prototype.isValidate = function (content) {
    if (!content) return false;
    content = JSON.parse(content);
    if (!content.endTime) return false;
    const {endTime} = content;
    const now = Date.now();
    return now <= parseInt(endTime);
};

module.exports = WxSdk;