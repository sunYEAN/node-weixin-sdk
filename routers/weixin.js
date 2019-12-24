const WxSdk = require('../controller/weixin/sdk');
const router = require('koa-router')();
const {appId, appSecret} = require('../config');

// 创建一个wx实例
const wxSdk = new WxSdk({
    appId,
    appSecret,
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
        console.log(ctx.request.body);
        const {url} = ctx.request.body;
        const ob = await wxSdk.getSignatureOb(url);
        ctx.body = {
            data: ob,
            status: 200,
        }
    });



module.exports = routes;
