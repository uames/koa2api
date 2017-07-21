import { checkAdminLogin as checkALogin } from '../models/admin';
import { checkUserLogin as checkULogin } from '../models/users';
import { getQueryObj,checkSuperAdmin } from '../service/user';
import Activity from '../models/activity';
import Rst from '../utils/result';
const {router} = Rst.initRoute({
  prefix:'/activity'
});


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
router.get('/checkApiGet', async (ctx, next) => {
  const {api, phone, checkpwd, sign} = ctx.query;
});

// 用于在接入新活动(项目)之前, 检查该活动为接入积分商城开发的  [修改]  积分接口是否正确
router.get('/checkApiPost', async (ctx, next) => {
  const {api, phone, checkpwd, sign} = ctx.query;

});

router.post('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ({admin})=>{
    var activity = await Activity.create({...ctx.request.body, sid: admin.sid})
    if(activity && activity.id){
      var _r = Rst.suc()
      ctx.response.body = {id: activity.id, ..._r};
    }
  }});
});
router.put('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var res = await updateItem(ctx.request.body)
    putRst(res, ctx);
  }});
});
router.del('/', async (ctx, next)=>{
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await deleteItems(ids, ctx.params.status)
    putRst([res], ctx);
  }});
});

module.exports = router
