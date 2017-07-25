import Rst from '../utils/result';
import Users,{ login, logout, UserSession, checkUserLogin as checkULogin } from '../models/users';
import Activity from '../models/activity';
import { getSid, getSidQuery, getQueryObj } from '../service/user';
import { checkAdminLogin as checkALogin } from '../models/admin';
import http from 'http'
import qs from 'querystring'
const {router} = Rst.initRoute({
  prefix:'/users'
});

const show = ()=>{
  return {
    "GET  /users/testApiGet" : "测试 api_get 用于跳转登录后测试调用api, 调用于 /models/activity.js 中",
    "POST /users/testApiPost" : "测试 api_post 用于积分变化后同步到该系统, 调用于 /models/activity.js 中",
    "GET  /users/jumpLogin/:sign/:account/:checkpwd" : `用于第三方活动进入积分商城登录使用.
          跳转登录需要有三个参数,sign account checkpwd, 缺一不可.`,

    "GET  /users" : "普通管理员查看用户的时候,只能查看与自己sid相等的用户. admin 为 0 的超级管理员可以查看所有用户",
    "GET  /users/:id" : "根据id获取用户详细信息",
    "POST /users" : "为用户创建帐号(接入的系统在用户绑定手机号码的同时,或者跳转登录之前,调用此方法)",
    "POST /users/login" : "正常地使用帐号密码登录,帐号为phone, 密码默认为5201314",
    "POST /users/logout" : "退出登录",
    "PUT  /users" : "这里只能修改 password 和 name, 这里只允许用户本人可以修改, 根据登录的用户的phone, 修改其所有帐号!",
    "DEL  /users" : {说明:"管理员[删除]用户",参数:{"body中的数据":"[要删除的id数组]"}}
  }
}

// 测试 api_get 用于跳转登录后测试调用api, 调用于 /models/activity.js 中
router.get('/testApiGet', async (ctx, next) => {
  ctx.response.body = {
    balance: 0
  }
});
// 测试 api_post 用于积分变化后同步到该系统, 调用于 /models/activity.js 中
router.post('/testApiPost', async (ctx, next) => {
  var {phone, checkpwd, sign, balance} = ctx.request.body
  ctx.response.body = Rst.suc("操作成功")
});

// 跳转登录需要有三个参数,sign account checkpwd, 缺一不可
router.get('/jumpLogin/:sign/:account/:checkpwd', async (ctx, next) => {
  var {account:phone, checkpwd, sign} = ctx.params
  var activitys = await Activity.retrieve({query:{where:{sign}}});
  if(activitys.length>0){
    var user = await login({phone, checkpwd, sid:activitys[0].id});
    if(user && user.id){
      ctx.cookies.set(UserSession, user.id);
      // 这里调用 activity 表中 sid 为 user.sid 的积分同步接口, 将 user.phone 和 checkpwd 传过去获取数据
      var api = activitys[0]?activitys[0]['api_get']:'';
      if(api){
        // 这里利用了 Promise 解决了使异步的 http 变同步的问题
        await new Promise((resolve, reject) => {
          http.get(api+"?"+qs.stringify({phone, ...ctx.params}),async (req,res)=>{
              req.on('error', function(e){
                Rst.log({
                  content:"请求api_get接口出错,userId:"+user.id+",phone:"+phone+",sign:"+sign,
                  type:1,
                  tag:"[routes.users jumpLogin 01]"
                });
                ctx.response.body = Rst.fail("请求api_get接口出错,uid:"+user.id)
              });
              var html='';
              req.on('data',function(data){
                html+=data;
              });
              req.on('end',async ()=>{
                // 规定返回的obj的格式 {balance: 用户在该系统中的当前积分}
                var {balance} = JSON.parse(html);
                if(balance>-1){
                  await Users.update({id:user.id, balance});
                  // TODO 这里就应该跳转进入登录后的页面了  ctx.redirect()
                  ctx.response.body = Rst.suc("跳转登录成功")
                }else {
                  Rst.log({
                    content:"api_get同步积分失败,userId:"+user.id+",phone:"+phone+",sign:"+sign+",balance:"+balance,
                    type:1,
                    tag:"[routes.users jumpLogin 02]"
                  });
                  ctx.response.body = Rst.fail("api_get同步积分失败,uid:"+user.id+",balance:"+balance)
                }
                resolve()
              });
          });
        })
      }else {
        ctx.response.body = Rst.fail("未设置 api_get 接口")
      }
    }else {
      ctx.response.body = Rst.fail("帐号或密码错误",401)
    }
  }else {
    ctx.response.body = Rst.fail("sign对应的活动不存在")
  }

});
// 为用户创建帐号(接入的系统在用户绑定手机号码的同时,或者跳转登录之前,调用此方法)
router.post('/', async (ctx, next) => {
  // 这里不需要验证,因为每次登录或消费的时候会验证积分
   var {phone, checkpwd, password, sign, balance, name, address} = ctx.request.body
  //  根据sign获取activity并取得sid
   var activity = await Activity.retrieve({query:{where:{sign}}});
   var sid = activity&&activity[0]?activity[0].id:0;
   if(sid){
    //  TODO 这里可以尝试先调用 api_get 获取该用户的积分, 同时也可以验证该用户确实存在!



     //  检查 phone 是否有对应的帐号
     var users = await Users.retrieve({query:{where:{sid,phone}}});
     if(users.length==0){
       users = await Users.retrieve({query:{where:{phone}}});
       if(users.length>0){ // 有的话,使它们的password值一致
         password = users[0].password;
       }
       if(password.length==0){ // 若没有password且没有其它活动相同phone的用户
         password = '5201314';
       }
       var user = await Users.create({...ctx.request.body, sid, password});
       if(user && user.id){
         ctx.response.body = {id: user.id, ...(Rst.suc())};
       }
     }else {
       ctx.response.body = Rst.fail("该用户已存在,请勿重复创建(sign,phone唯一)");
     }
   }else {
     ctx.response.body = Rst.fail("该项目不存在,请先到后台创建,或检查sign是否正确");
   }
});

router.get('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var q = {} // 普通管理员查看用户的时候,只能查看与自己sid相等的用户
    if(admin.sid>0){ // admin 为 0 的超级管理员可以查看所有用户
      q.where = {sid:admin.sid}
    }
    ctx.response.body = await Users.retrieve({query:getQueryObj(q)}); // q.page, q.pSize, q.keyword, q.order
  }});
});


router.get('/:id', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    if(ctx.params.id=='show'){
      ctx.response.body = show();
    }else {
      var userList = await Users.retrieve({query:{where:{id:ctx.params.id,sid:admin.sid}}})
      if(userList.length){
        ctx.response.body = Users.rebuildUser(userList[0]);
      }else {
        ctx.response.body = Rst.fail("该用户不属于本活动或该用户不存在")
      }
    }
  }});
});
router.post('/login', async (ctx, next) => {
    var phone = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    var user = await login({phone, password});
    if(user && user.id){
      ctx.cookies.set(UserSession, user.id);
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


// 这里不允许管理员修改, 用户可以修改, 根据登录的用户的phone, 修改其所有帐号!这里只能修改 password 和 name
router.put('/', async (ctx, next) => {
  await checkULogin(ctx).then(async ({flag,user})=>{ if(flag){
    var {password, name} = ctx.request.body
    if(user && user.sid){
      // 修改的时候, 根据phone修改所有的活动
      var res = await Users.updateByPhone({phone:user.phone, password, name});
      Rst.putRst(res, ctx);
    }else {
      ctx.response.body = Rst.fail("user有问题:"+JSON.stringify(user));
    }
  }});
});
router.del('/', async (ctx, next)=>{
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await Users.del(ids)
    Rst.putRst([res], ctx);
  }});
});
module.exports = router
