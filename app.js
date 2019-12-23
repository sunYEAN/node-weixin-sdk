const Koa = require('koa');
const json = require('koa-json');
const routers = require('./routers');
const logger = require('koa-logger');
const onerror = require('koa-onerror');
const bodyParser = require('koa-bodyparser');


// 配置项
const config = require('./config');

const app = new Koa();

// error handler
onerror(app);

// middlewares
app.use(bodyParser())
    .use(json())
    .use(logger())
    .use(require('koa-static')(__dirname + '/public'))
    .use(routers.routes())
    .use(routers.allowedMethods())

// logger
app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - $ms`)
});


app.on('error', function(err, ctx) {
    console.log(err)
    logger.error('server error', err, ctx)
});

module.exports = app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
});
