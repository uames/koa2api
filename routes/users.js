import Rst from '../utils/result';
import { login, logout, UserSession, getUsers } from '../models/users';
const router = require('koa-router')()
const DIR = process.env.DIR || '';

router.prefix(DIR + '/users');

// router.get('/', async (ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="${DIR}/users/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`;
// });

// router.post('/login', async (ctx, next) => {
//     var name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="${DIR}/users">Try again</a></p>`;
//     }
// });
// const rLogin = async (ctx, params)=>{
//   var user = await login(params);
//   if(user && user.id){
//     ctx.cookies.set(UserSession, user.id);
//     ctx.response.body = Rst.suc()
//   }else {
//     ctx.response.body = Rst.fail("帐号或密码错误")
//   }
// }
// 跳转登录需要有三个参数,sign account checkpwd, 缺一不可
router.get('/jumpLogin/:sign/:account/:checkpwd', async (ctx, next) => {
  // await rLogin(ctx,{account: ctx.params.account, checkpwd: ctx.params.checkpwd});
  var user = await login({account: ctx.params.account, checkpwd: ctx.params.checkpwd, sign:ctx.params.sign});
  if(user && user.id){
    ctx.cookies.set(UserSession, user.id);
    ctx.response.body = Rst.suc("跳转登录成功") // TODO 这里就应该跳转进入登录后的页面了
  }else {
    ctx.response.body = Rst.fail("帐号或密码错误",401)
  }
});
router.get('/', async (ctx, next) => {
  var q = ctx.query //await getQuery(ctx)
  ctx.response.body = await getUsers(q); // q.page, q.pSize, q.keyword, q.order
});
router.post('/login', async (ctx, next) => {
    var account = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    var user = await login({account: account, password: password});
    if(user && user.id){
      ctx.cookies.set(UserSession, user.id);
      // ctx.response.body = Rst.suc("登录成功")
      ctx.response.body = user
    }else {
      ctx.response.body = Rst.fail("帐号或密码错误",401)
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
