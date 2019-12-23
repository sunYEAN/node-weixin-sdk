const path = require('path');
const utils = require('../utils/files');
const WxSdk = require('../controller/weixin/sdk');
const router = require('koa-router')();


const TOKEN = path.resolve(__dirname, '../saveFiles/token.txt');
const TICKET = path.resolve(__dirname, '../saveFiles/ticket.txt');


const wxSdk = new WxSdk({

    // 回调函数 设置AccessToken
    setAccessToken: (content) => {
        return utils.writeFileAsync(TOKEN, content);
    },

    // 获取AccessToken
    getAccessToken: () => {
        return utils.readFileAsync(TOKEN, 'UTF-8');
    },

    setTicket: (content) => {
        return utils.writeFileAsync(TICKET, content);
    },

    // 得到jsapi_ticket
    getTicket: () => {
        return utils.readFileAsync(TICKET, 'utf-8');
    },
});


const routes = router
    .get('/jssdk', async (ctx, next) => {
        const {url} = ctx.request.query;
        const ob = await wxSdk.getSignatureOb(url);
        ctx.body = {
            data: ob,
            status: 200,
        }
    })
    .post('/jssdk', async (ctx, next) => {
        console.log(ctx.request.body)
        // const ob = await wxSdk.getSignatureOb(url);
        ctx.body = {
            // data: ob,
            status: 200,
        }
    });



module.exports = routes;
