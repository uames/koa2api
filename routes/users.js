import Rst from '../utils/result';
import Users,{ login, logout, UserSession } from '../models/users';
import Activity from '../models/activity';
import { getSidQuery, getQueryObj } from '../service/user';
import { checkAdminLogin as checkALogin } from '../models/admin';
import http from 'http'
import qs from 'querystring'
const {router} = Rst.initRoute({
  prefix:'/users'
});

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
  var user = await login({phone, checkpwd, sign});
  if(user && user.id){
    ctx.cookies.set(UserSession, user.id);
    // 这里调用 activity 表中 sid 为 user.sid 的积分同步接口, 将 user.phone 和 checkpwd 传过去获取数据
    var activity = await Activity.retrieve({id:user.sid});
    var api = activity?activity['api_get']:'';
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
});
// 为用户创建帐号(接入的系统在用户绑定手机号码的同时,或者跳转登录之前,调用此方法)
router.post('/', async (ctx, next) => {
  // TODO 这里需要验证!!!否则存在漏洞 不需要做,因为每次登录或消费的时候验证会验证积分
   var {phone, checkpwd, sign, balance, name} = ctx.request.body

   var activity = await Activity.retrieve({query:{where:{sign}}});
   var sid = activity&&activity[0]?activity[0].id:0;
   if(sid){
     //  检查 phone 是否有对应的帐号
     var users = await Users.retrieve({query:{where:{sign,phone}}});
     if(users.length==0){
       var password = "";
       users = await Users.retrieve({query:{where:{phone}}});
       if(users.length>0){ // 有的话,使它们的password值一致
         password = users[0].password;
       }
       var user = await Users.create({...ctx.request.body, sid, password});
       if(user && user.id){
         var _r = Rst.suc()
         ctx.response.body = {id: user.id, ..._r};
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
    var q = {} // 管理员查看用户的时候,只能查看与自己sid相等的用户
    q.where = {sid:admin.sid}
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
