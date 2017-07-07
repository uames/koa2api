import { getAdminBySession, AdminSession } from '../models/admin';
import { getUserBySession, UserSession } from '../models/users';

// 返回当前用户的sid, 先获取管理员的,若未登录管理员帐号则获取普通用户的, 若均未登录返回-1
const getSid = async (cookies)=>{
  var admin = await getAdminBySession(cookies.get(AdminSession))
  if(admin && admin.id){
    return admin.sid;
  }else {
    var user = await getUserBySession(cookies.get(UserSession))
    if(user && user.id){
      return user.sid
    }else {
      return -1;
    }
  }
}
const getQuery = async (ctx)=>{
  var sid = await getSid(ctx.cookies), q=ctx.query;
  // sid 为0 的用户,可以查看所有商品, sid 大于0的用户,可以查看对应的sid和sid==0的商品, sid 为-1的用户,不能查看任何商品
  if(sid>0){
    q.where = {sid: {$in: [0,sid]}} // sid 为0的商品,所有 sid>-1 的用户均可查看
  }else if(sid==-1) { // 用户未登录,不能查看任何商品
    q.where = {sid: {$in: [-999]}}
  }
  return q;
}
module.exports = {
  getQuery
}
// await ctx.render('index', {
//   title: 'Hello Koa 2!'
// })
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
//
// // router.get('/', async (ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="${DIR}/users/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`;
// });

// router.post('/signin', async (ctx, next) => {
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
