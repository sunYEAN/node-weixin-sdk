const fs = require('fs');
const Koa = require('koa');
const path = require('path');
const json = require('koa-json');
const utils = require('./utils/files');
const Router = require('koa-router');
const logger = require('koa-logger');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');
const WxSdk = require('./controller/weixin/sdk');

const TOKEN =path.resolve(__dirname, './saveFiles/token.txt');
const TICKET =path.resolve(__dirname, './saveFiles/ticket.txt');

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


// 自定义
const config = require('./config');
// const routes = require('./routes');

const app = new Koa();
const router = new Router();

// error handler
onerror(app);

// middlewares
app.use(bodyParser())
    .use(json())
    .use(logger())
    .use(require('koa-static')(__dirname + '/public'))
    .use(router.routes())
    .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - $ms`)
});

// 默认文件
router.get('/', async (ctx, next) => {
    // ctx.body = 'Hello World'
    ctx.state = {
        title: '欢迎'
    };
    await ctx.render('index', ctx.state)
});

router.get('/api', async (ctx, next) => {
    // const content = await wxSdk.updateAccessToken();
    ctx.body = {
        status: 200,
        data: 123
    };
});

// routes(router);


app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
});

module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
});
