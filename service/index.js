const $http = require('request-promise');

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

const URLS = {
    TOKEN: 'https://api.weixin.qq.com/cgi-bin/token',
    TICKET: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
};

/**
 * {expires_in: 72000} // 包含expires_in字段
 * @param data
 */
function parseEndTime (data) {
    const {expires_in} = data;
    const now = Date.now();
    data.endTime = now + (expires_in - 20) * 1000;
    return data;
}

// api获取微信AccessToken
exports.getWxAccessToken = function (appId, appSecret) {
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
};

// api获取微信Ticket
exports.getWxApiTicket = function (access_token) {
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
};