import { checkAdminLogin as checkALogin } from '../models/admin';
import { checkUserLogin as checkULogin } from '../models/users';
import { getQueryObj,checkSuperAdmin } from '../service/user';
import Activity, {entity} from '../models/activity';
import Rst from '../utils/result';
import http from 'http'
import qs from 'querystring'
const {router} = Rst.initRoute({
  prefix:'/activity'
});

const show = ()=>{
  return {
    "重要说明" : "您看到的所有 sid, 即为 activity.id",
    "POST  /activity/checkApiGet" : "用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [同步]  积分接口是否正确",
    "POST  /activity/checkApiPost" : "用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [修改]  积分接口是否正确",

    "GET  /activity" : {example: "/activity?page=1&pSize=10&keyword=书架&order=price desc", "成功":'返回第一页10条数据', "备注":"若为空数组[],则表示该搜索条件无对应数据"},
    "GET  /activity/:id" : {example: "/activity/1", "成功":{id:1, ...entity}, "备注":"若为空对象{},则表示该id对应的数据不存在"},
    "POST /activity" : {参数:entity, 成功:{errCode:0,id:"新建的数据的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /activity" : {说明:"sign值一旦创建不可修改",成功:{errCode:0,id:"修改的数据的id"},失败:{errCode:1,msg:"失败原因"}},
    // "DEL  /activity" : {参数:{"body中的数据":"[要删除的id数组]"}, 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}}
  }
}

router.get('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ()=>{
    ctx.response.body = await Activity.retrieve({query:getQueryObj(ctx.query)});
  }});
});
router.get('/:id', async (ctx, next) => {
  if(ctx.params.id=='show'){
    ctx.response.body = show();
  }else {
    await checkSuperAdmin({ctx, callBackFn:async ()=>{
      ctx.response.body = await Activity.retrieve({id:ctx.params.id});
    }});
  }
});

// 用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [同步]  积分接口是否正确
router.post('/checkApiGet', async (ctx, next) => {
  const {api, phone, checkpwd, sign} = ctx.body;
  if(api){
    // 这里利用了 Promise 解决了使异步的 http 变同步的问题
    await new Promise((resolve, reject) => {
      http.get(api+"?"+qs.stringify({phone, checkpwd, sign}),async (req,res)=>{
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
            var result = JSON.parse(html);
            if(result.balance!=undefined){
                ctx.response.body = Rst.suc("接口正确")
            }else {
                ctx.response.body = Rst.fail("接口错误")
            }
            resolve()
          });
      });
    })
  }
});

// 用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [修改]  积分接口是否正确
router.post('/checkApiPost', async (ctx, next) => {
  const {api, phone, checkpwd, sign, balance} = ctx.body;
  if(api){
    // 这里利用了 Promise 解决了使异步的 http 变同步的问题
    await new Promise((resolve, reject) => {
      http.post(api+"?"+qs.stringify({phone, checkpwd, sign, balance}),async (req,res)=>{
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
            var result = JSON.parse(html);
            if(result.errCode==0 || result.code==1 || result.status==1){
                ctx.response.body = Rst.suc("接口正确")
            }else {
                ctx.response.body = Rst.fail("接口错误")
            }
            resolve()
          });
      });
    })
  }
});

router.post('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ({admin})=>{
    var body = ctx.request.body;
    var activitys = await Activity.retrieve({query:{where:{sign:body.sign}}});
    if(activitys.length>0){
      ctx.response.body = Rst.fail("sign="+body.sign+"的活动已存在")
    }else {
      var activity = await Activity.create({...body})
      if(activity && activity.id){
        var _r = Rst.suc()
        ctx.response.body = {id: activity.id, ..._r};
      }else {
        ctx.response.body = Rst.fail("新建活动失败"+JSON.stringify(activity))
      }
    }
  }});
});
router.put('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ({admin})=>{
    var body = ctx.request.body
    delete body.sign
    var res = await Activity.update(body)
    Rst.putRst(res, ctx);
  }});
});
// 活动不允许删除
// router.del('/', async (ctx, next)=>{
//   await checkSuperAdmin({ctx, callBackFn:async ({admin})=>{
//     var ids = ctx.request.body;
//     var res = await Activity.del(ids)
//     Rst.putRst([res], ctx);
//   }});
// });

module.exports = router
