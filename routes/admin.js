import Rst from '../utils/result';
import { login, logout, AdminSession } from '../models/admin';
const router = require('koa-router')()
const DIR = process.env.DIR || '';

router.prefix(DIR + '/admin');

router.post('/login', async (ctx, next) => {
    var account = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    var admin = await login({account, password});
    if(admin && admin.id){
      // const n = ctx.cookies.get('shop-sessionid');
      ctx.cookies.set(AdminSession, admin.id);
      ctx.response.body = Rst.suc()
    }else {
      ctx.response.body = Rst.fail("帐号或密码错误")
    }
});
router.post('/logout', async (ctx, next) => {
  if(logout(ctx)){
    ctx.response.body = Rst.suc()
  }else {
    ctx.response.body = Rst.fail("退出失败")
  }
});
module.exports = router
