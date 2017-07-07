import Rst from '../utils/result';
const router = require('koa-router')()
const DIR = process.env.DIR || '';
router.prefix(DIR);

router.get('/', async (ctx, next) => {
  ctx.body = {
    title: '你找到我了! Hello Koa 2!'
  }
  // await ctx.render('index', {
  //   title: 'Hello Koa 2!'
  // })
})

router.post('/json', async (ctx, next) => {
  ctx.body = rst.suc()
})


module.exports = router
