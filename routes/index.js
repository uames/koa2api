import Rst from '../utils/result';
const {router} = Rst.initRoute({
  prefix:''
});

router.get('/', async (ctx, next) => {
  ctx.body = {
    title: '你找到我了! Hello Koa 2!'
  }
})

router.post('/json', async (ctx, next) => {
  ctx.body = rst.suc()
})


module.exports = router
