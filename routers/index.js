const weixin = require('./weixin');
const router = require('koa-router')();



router.use('/weixin', weixin.routes(), weixin.allowedMethods());


// 默认页面
router.get('/', async (ctx, next) => {
    ctx.state = {
        title: '欢迎'
    };
    await ctx.render('index', ctx.state);
});

module.exports = router;
