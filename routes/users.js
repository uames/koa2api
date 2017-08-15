import Rst from '../utils/result';
import Users,{ login, logout, UserSession, checkUserLogin as checkULogin } from '../models/users';
import Activity from '../models/activity';
import { getSid, getSidQuery, getQueryObj, fetchGet } from '../service/user';
import { checkAdminLogin as checkALogin } from '../models/admin';
import request from 'request'
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
  var {phone, checkpwd, sign} = ctx.query
  // 这里根据该用户的帐号, 返回该用户的积分
  // 重点: 若根据 phone checkpwd 找不到对应帐号, 则返回 balance: -1
  ctx.body = {
    balance: 8989
  }
});
// 测试 api_post 用于积分变化后同步到该系统, 设置于 /models/activity.js, 调用于 /service/api.js
// 同步积分的接口, 要确保积分只能变小不能变大!!!(除了取消订单外)
// 这个接口建议做成接收到要消费的积分,然后计算出减掉了消费的积分后的总分返回!避免因为有积分高频的操作而导致积分不准确!
var origin = process.env.NODE_ENV=="production"?process.env.npm_package_origin:process.env.npm_package_originDev;
router.post('/testApiPost', async (ctx, next) => {
  var {phone, checkpwd, sign, balance, cancelOrderId} = ctx.request.body

  if(cancelOrderId && !isNaN(cancelOrderId) && cancelOrderId>0){
    // 若 orderId>0 则需调用 /order/cancelOrder/:cancelOrderId/:phone/:checkpwd/:sign, 获取该订单使用了的积分: balance
    // 然后将 balance 增加到该用户的积分中 (即用户原来积分加上 balance 后作为用户积分)
    var uri = `/order/cancelOrder/${cancelOrderId}/${phone}/${checkpwd}/${sign}`
    await new Promise((resolve, reject) => {
      request.get(origin + uri, async (error, response, data)=>{
        // 这里将 data.balance 加到该用户的积分中
        // 重点: 若操作成功, 返回 errCode:0 或 code:1 或 status:1, 若失败则反之, 且返回失败原因 errMsg 或 msg
        if(true){
          ctx.body = Rst.suc("操作成功")
        }
        resolve()
      })
    })
  }else {
    // 否则将 balance 作为该用户消耗的积分(即用户原来积分减掉 balance 后作为用户积分)
    ctx.body = Rst.suc("操作成功")
  }
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
      var api_get = activitys[0]?activitys[0]['api_get']:'';
      await fetchGet({ctx, api_get, phone, checkpwd, sign, callBackFn:async ({balance})=>{
        await Users.update({id:user.id, balance});
        // TODO 这里就应该跳转进入登录后的页面了
        // ctx.redirect()
        ctx.body = Rst.suc("跳转登录成功")
      }})
    }else {
      ctx.body = Rst.fail("帐号或密码错误",401)
    }
  }else {
    ctx.body = Rst.fail("sign对应的活动不存在")
  }

});
// 为用户创建帐号(接入的系统在用户绑定手机号码的同时,或者跳转登录之前,调用此方法)
router.post('/', async (ctx, next) => {
  // 这里不需要验证,因为每次登录或消费的时候会验证积分
   var {phone, checkpwd, password, sign, name, address} = ctx.request.body
  //  根据sign获取activity并取得sid
   var activity = await Activity.retrieve({query:{where:{sign}}});
   var {id:sid, sign, api_get} = activity&&activity[0]?activity[0]:{};
   if(sid){
    //  TODO 这里可以尝试先调用 api_get 获取该用户的积分, 同时也可以验证该用户确实存在!
    await fetchGet({ctx, api_get, phone, checkpwd, sign, callBackFn:async ({balance})=>{
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
        var user = await Users.create({...ctx.request.body, balance, sid, password});
        if(user && user.id){
          ctx.body = {id: user.id, ...(Rst.suc())};
        }
      }else {
        ctx.body = Rst.fail("该用户已存在,请勿重复创建(sign,phone唯一)");
      }
    }})
   }else {
     ctx.body = Rst.fail("该项目不存在,请先到后台创建,或检查sign是否正确");
   }
});

router.get('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var q = {} // 普通管理员查看用户的时候,只能查看与自己sid相等的用户
    if(admin.sid>0){ // admin 为 0 的超级管理员可以查看所有用户
      q.where = {sid:admin.sid}
    }
    ctx.body = await Users.retrieve({query:getQueryObj(q)}); // q.page, q.pSize, q.keyword, q.order
  }});
});


router.get('/:id', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    if(ctx.params.id=='show'){
      ctx.body = show();
    }else {
      var userList = await Users.retrieve({query:{where:{id:ctx.params.id,sid:admin.sid}}})
      if(userList.length){
        ctx.body = Users.rebuildUser(userList[0]);
      }else {
        ctx.body = Rst.fail("该用户不属于本活动或该用户不存在")
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
      ctx.body = user
    }else {
      ctx.body = Rst.fail("帐号或密码错误",401)
    }
});
router.post('/logout', async (ctx, next) => {
    if(logout(ctx)){
      ctx.body = Rst.suc()
    }else {
      ctx.body = Rst.fail("退出失败")
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
      ctx.body = Rst.fail("user有问题:"+JSON.stringify(user));
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
