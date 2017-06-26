'use strict';
var router = require('koa-router')();
const account = require('../tools/account');


router.get('/', async (ctx, next) => {
  if (ctx.session.isNew) {
    await ctx.render('signin');
  }
  else {
    await ctx.redirect('/index');
  }
});

router.post('/', account.login)


router.use(async (ctx, next) => {
  if (ctx.session.isNew) {
    // ctx.throw('you have to login first!');
    await ctx.redirect('/');
  }
  else {
    await next();
  }
});

router.get('/index', async function (ctx, next) {
  await ctx.render('index');
});

router.get('/logout', account.logout);

module.exports = router;
