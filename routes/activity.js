import { checkAdminLogin as checkALogin } from '../models/admin';
import { checkUserLogin as checkULogin } from '../models/users';
import { getQueryObj,checkSuperAdmin } from '../service/user';
import Activity, {entity} from '../models/activity';
import Rst from '../utils/result';
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
// TODO
router.post('/checkApiGet', async (ctx, next) => {
  const {api, phone, checkpwd, sign} = ctx.body;
});

// 用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [修改]  积分接口是否正确
// TODO 这个接口建议做成接收到要消费的积分,然后计算出减掉了消费的积分后的总分返回!避免因为有积分高频的操作而导致积分不准确!
router.post('/checkApiPost', async (ctx, next) => {
  const {api, phone, checkpwd, sign} = ctx.body;

});

router.post('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ({admin})=>{
    var body = ctx.request.body;
    var activitys = await Activity.retrieve({query:{where:{name:body.name,sign:body.sign}}});
    if(activitys.length>0){
      ctx.response.body = Rst.fail("相同的活动name和sign已存在")
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
