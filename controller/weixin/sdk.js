const {tokenPath, ticketPath} = require('../../config');
const {getSignPackage, readFileAsync, writeFileAsync} = require('../../utils/files');
const {getWxAccessToken, getWxApiTicket} = require('../../service');

class WxSdk {
    constructor(options) {
        this.appId = options.appId;
        this.appSecret = options.appSecret;

        this.options = {
            /**
             * 写入AccessToken
             * @param content
             * @returns {Promise<any>}
             */
            setAccessToken: (content) => {
                return writeFileAsync(tokenPath, content);
            },

            /**
             * 读取access_token
             * @returns {Promise<any>|*}
             */
            getAccessToken: () => {
                return readFileAsync(tokenPath, 'UTF-8');
            },

            /**
             * 写入ticket
             * @param content
             * @returns {Promise<any>|*}
             */
            setTicket: (content) => {
                return writeFileAsync(ticketPath, content);
            },

            /**
             * 读取ticket
             * @returns {Promise<any>|*}
             */
            getTicket: () => {
                return readFileAsync(ticketPath, 'utf-8');
            },
        };
        Object.assign(this.options, options);

        // 将AccessToken存起来 {access_token: '', expires_in: ''}
        this.setAccessToken = this.options.setAccessToken;
        this.getAccessToken = this.options.getAccessToken;
        this.setTicket = this.options.setTicket;
        this.getTicket = this.options.getTicket;
    }

    /**
     * 验证{expires_in}是否过期
     * @param content
     * @returns {boolean}
     */
    static isValidate (content) {
        if (!content) return false;
        content = JSON.parse(content);
        if (!content.endTime) return false;
        const {endTime} = content;
        const now = Date.now();
        return now <= parseInt(endTime);
    }

    /**
     * 更新票据
     * @returns {Promise<T | never>}
     */
    updateAccessToken () {
        return this.getAccessToken().then(data => {
            if (!WxSdk.isValidate(data)) {
                return getWxAccessToken(this.appId, this.appSecret).then(content => {
                    return this.setAccessToken(content);
                });
            } else {
                // 数据内容合法 (有内容、未过期)
                return JSON.parse(data);
            }
        })
    }

    /**
     * 更新AccessToken
     * @returns {Promise<T | never>}
     */
    updateJsApiTicket () {
        return this.getTicket().then(data => {

            // 不合法的ticket票据 -> 重新获取access_token 并 重新获取ticket
            if (!WxSdk.isValidate(data)) {
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
    }

    /**
     * 获取加密后的签名
     * @param url
     * @returns {Promise<T | never | never>}
     */
    getSignatureOb (url) {
        return this.updateJsApiTicket().then(ticketData => {
            const {ticket} = ticketData;
            const ob = getSignPackage(ticket, url);
            ob.appId = this.appId;
            return ob;
        })
    }

}

module.exports = WxSdk;
