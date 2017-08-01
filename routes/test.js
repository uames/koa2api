import Rst from '../utils/result';
const {router} = Rst.initRoute({
  prefix:'/test'
});
router.get('/cache.appcache', async (ctx, next) => {
  ctx.response.set('Content-Type', 'text/cache-manifest');
  ctx.body = [
    `CACHE MANIFEST${process.env.UPDATE_MANIFEST}`,
    "/css/test-manifest.css",
    "/js/test-manifest.js"
  ].join("\n");
})

router.post('/json', async (ctx, next) => {
  ctx.body = Rst.suc()
})


module.exports = router
