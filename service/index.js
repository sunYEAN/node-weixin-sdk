const $http = require('request-promise');
const {parserUrl} = require('../utils/files');

/**
 * 微信api链接
 * @type {{TICKET: string, TOKEN: string}}
 */
const URLS = {
    TOKEN: 'https://api.weixin.qq.com/cgi-bin/token',
    TICKET: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
};

// methods
/**
 * {expires_in: 72000} // 包含expires_in字段
 * @param data
 */
const parseEndTime = (data) => {
    const {expires_in} = data;
    const now = Date.now();
    data.endTime = now + (expires_in - 20) * 1000;
    return data;
};
// methods end


/**
 * 请求微信AccessToken
 * @param appId
 * @param appSecret
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
function getWxAccessToken (appId, appSecret) {
    return $http({
        uri: parserUrl(URLS.TOKEN, {
            appid: appId,
            secret: appSecret,
            grant_type: 'client_credential',
        }),
        method: 'GET'
    }).then((res) => {
        res = JSON.parse(res);
        return parseEndTime(res);
    });
}

/**
 * 请求微信jsapi_ticket
 * @param access_token
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
function getWxApiTicket (access_token) {
    console.log(access_token, 'access_token');
    return $http({
        uri: parserUrl(URLS.TICKET, {
            type: 'jsapi',
            access_token: access_token,
        }),
        method: 'GET'
    }).then((res) => {
        res = JSON.parse(res);
        return parseEndTime(res);
    });
}

module.exports = {
    getWxApiTicket,
    getWxAccessToken
};
