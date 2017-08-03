import { getAdminBySession, AdminSession } from '../models/admin';
import { getUserBySession, UserSession } from '../models/users';
import Rst from '../utils/result';

const getAdmin = async (cookies)=>{
  var admin = await getAdminBySession(cookies.get(AdminSession))
  if(admin && admin.id){
    return admin;
  }else {
    return -1;
  }
}
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
const getSidQuery = async ({ctx, isItems})=>{
  let sid = await getSid(ctx.cookies), q=ctx.query;
  // sid 为0 的用户,可以查看所有商品, sid 大于0的用户,可以查看对应的sid和sid==0的商品, sid 为-1的用户,不能查看任何商品
  if(sid>0){
    q.where = {sid: {$in: [sid]}} // sid 为0的商品,所有 sid>-1 的用户均可查看
    if(isItems){
      q.where.sid["$in"].push(0); // 若为查询商品,则需加上sid=0的商品, 若为查询用户,则不可以(超管除外,因为超管的sid即为0)
    }
  }else if(sid==-1) { // 用户未登录,不能查看任何商品
    q.where = {sid: {$in: [-999]}}
  }
  return q;
}
const getQueryObj = ({page,pSize,keyword,order,status,where,noPhone,hasDesc,noOffset})=>{
  page = Number(page) || 1;
  pSize = Number(pSize) || 10;
  var _like = {$like: "%"+keyword+"%"}, items = [];
  var _where = {};
  if(keyword){
    _where = {
      $or: [
        { name: _like },
        { phone: _like }
      ]
    };
    noPhone && _where["$or"].pop();
    hasDesc && _where["$or"].push({description:_like});
  }

  if(status==1 || status==0){
    _where.status = status
  }
  var _return = {
    where: {...where, ..._where},
    order: order?[order.split(/\s+/)]:"",// order: 'title DESC',
    offset: (page-1) * pSize,
    limit: pSize
  }
  if(noOffset){
    delete _return.offset;
  }
  return _return
}
// 检查是否登录了超级管理员帐号
const checkSuperAdmin = async ({ctx, callBackFn})=>{
  var admin = await getAdmin(ctx.cookies)
  if(admin!=-1 && admin.sid==0){
    await callBackFn({admin});
  }else if(admin==-1){
    ctx.response.body = Rst.fail('请先登录')
  }else {
    ctx.response.body = Rst.fail('非超级管理员不可查看项目 sid:'+admin.sid)
  }
}
module.exports = {
  getSid,
  getSidQuery,
  getQueryObj,
  checkSuperAdmin
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
