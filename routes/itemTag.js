import Rst from '../utils/result';
import Tag from '../models/itemTag';
import { getSid, getSidQuery, getQueryObj } from '../service/user';
import { checkAdminLogin as checkALogin } from '../models/admin';
const {router} = Rst.initRoute({
  prefix:'/tag'
});
// 接口说明 tag/show
const show = ()=>{
  return {
    "说明":"这里的接口, 操作的都是sid与当前登录用户sid相同的数据, GET /tag普通用户和管理员均可调用,其它接口只有管理员可调用",
    "GET  /tag" : "获取当前用户sid下所有的标签",
    "GET  /tag/:id" : "根据id获取单个tag数据",
    "POST /tag" : "新增标签",
    "PUT  /tag" : "修改标签",
    "DEL  /tag" : "删除标签",
  }
}

// 获取当前用户sid下所有的标签
router.get('/', async (ctx, next) => {
  var sid = await getSid(ctx.cookies);
  if(sid>-1){
    let q=ctx.query
    if(sid>0){ // sid==0 的超级管理员可查看所有标签
      q.where = {sid}
    }
    ctx.response.body = await Tag.retrieve({query:getQueryObj({...q,noPhone:1})});
  }else {
    ctx.response.body = Rst.fail('请先登录')
  }
});
router.get('/:id', async (ctx, next) => {
  if(ctx.params.id=='show'){
    ctx.response.body = show();
  }else {
    await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
      var tags = await Tag.retrieve({query:getQueryObj({where:{sid:admin.sid,id:ctx.params.id}})});
      if(tags.length){
        ctx.response.body = tags[0];
      }else {
        ctx.response.body = Rst.fail("该分类不存在或该分类不属于当前活动")
      }
    }});
  }
});

router.post('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var body = ctx.request.body;
    var tag = await Tag.create({...body, sid: admin.sid, status: 0})
    if(tag && tag.id){
      ctx.response.body = {id: tag.id, ...(Rst.suc())};
    }
  }});
});
router.put('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var body = ctx.request.body;
    var tags = await Tag.retrieve({query:getQueryObj({where:{sid:admin.sid,id:body.id}})});
    if(tags.length){
      var res = await Tag.update(body)
      Rst.putRst(res, ctx);
    }else {
      ctx.response.body = Rst.fail("该分类不存在或该分类不属于当前活动")
    }
  }});
});
// 删除标签
router.del('/', async (ctx, next)=>{
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await Tag.delByWhere({sid:admin.sid, id: {$in: ids}})
    Rst.putRst([res], ctx);
  }});
});

module.exports = router
