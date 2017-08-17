import Rst from '../utils/result';
const {router} = Rst.initRoute({
  prefix:''
});

router.get('/admin', async (ctx, next) => {
  await ctx.render('admin', {
    // title: 'Hello Koa 2!'
  })
})

router.get('/bindphone/:checkpwd', async (ctx, next) => {
  ctx.body = {
    bb:"bb"
  }
})


module.exports = router
