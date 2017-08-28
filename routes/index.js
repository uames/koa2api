import Rst from '../utils/result';
const {router} = Rst.initRoute({
  prefix:''
});

router.get('/admin', async (ctx, next) => {
  // await ctx.render('admin', {
    // title: 'Hello Koa 2!'
  // })
})
router.post('/index.php/Lecture/Datas/sms', async (ctx, next) => {
  ctx.body = {
    code:8246
  }
})
router.get('/bindphone', async (ctx, next) => {
  await ctx.render('bindPhone')
})


module.exports = router
