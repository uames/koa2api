import Rst from '../utils/result';
import Tag from '../models/itemTag';
import { checkAdminLogin as checkALogin } from '../models/admin';
const {router} = Rst.initRoute({
  prefix:'/tag'
});

// 用户获取自己 id 下的所有订单
router.get('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    let q={}
    q.where = {sid:admin.sid}
    ctx.response.body = await Tag.retrieve({query:getQueryObj(q)}); // q.page, q.pSize, q.keyword, q.order
  }});
});
router.get('/:id', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    if(ctx.params.id=='show'){
      ctx.response.body = show();
    }else {
      var tags = await Tag.retrieve({query:getQueryObj({sid:admin.sid,id:ctx.params.id})});
      if(tags.length){
        ctx.response.body = tags[0];
      }else {
        ctx.response.body = Rst.fail("该分类不存在或该分类不属于当前活动")
      }
    }
  }});
});

// 用户新增地址
router.post('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var body = ctx.request.body;
    var address = await Tag.create({...body, user_id: user.id, status: 0})
    if(address && address.id){
      var _r = Rst.suc()
      ctx.response.body = {id: address.id, ..._r};
    }
  }});
});
router.put('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var body = ctx.request.body;
    var status = body.status;
    delete body.status;
    var res = await Tag.update(body)
    // if(){
    //
    // }
    Rst.putRst(res, ctx);
  }});
});

module.exports = router
