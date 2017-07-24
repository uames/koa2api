import Rst from '../utils/result';
import { getSidQuery,getQueryObj } from '../service/user';
import { fields, getItem, getItems, createItem, updateItem, deleteItems, shelfItems, entity } from '../models/items';
import { getAdminBySession, checkAdminLogin as checkALogin, AdminSession } from '../models/admin';
import { getUserBySession, checkUserLogin as checkULogin, UserSession } from '../models/users';

const {router, entity:postItem} = Rst.initRoute({
  prefix:'/items',
  entity:{
    ...entity,
    cat_id : 0,
    status : 0,
    buycount : 0,
    sid : 1
  }
});
// 接口说明 items/show
const show = ()=>{
  return {
    "GET  /items" : {example: "/items?page=1&pSize=10&keyword=书架&order=price desc", "成功":'status为1, sid为用户sid和0的[商品数组](即已上架的且用户所属分校的商品)', "备注":"若为空数组[],则表示该搜索条件无对应商品"},
    "GET  /items/all" : {example: "/items?page=1&pSize=10&keyword=书架&order=price desc", "成功":'默认为管理员sid的所有[商品数组],链接中可添加status=1或0来筛选上架或下架的商品', "备注":"若为空数组[],则表示该搜索条件无对应商品"},
    "GET  /items/:id" : {example: "/items/1", "成功":{id:1, ...postItem}, "备注":"若为空对象{},则表示该id对应的数据不存在"},
    "POST /items" : {参数:postItem, 成功:{errCode:0,id:"新建的数据的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /items" : {参数:postItem, 成功:{errCode:0,id:"修改的数据的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /items/status/:status" : {参数:{"链接中的status":"","body中的数据":"[要上架或下架的id数组]"}, 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}},
    "DEL  /items" : {参数:{"body中的数据":"[要删除的id数组]"}, 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}}
  }
}
const itemTip = {noPhone:1,hasDesc:1};
router.get('/', async (ctx, next) => {
  var q = await getSidQuery({ctx, isItems:1})
  ctx.response.body = await getItems(getQueryObj({status:1, ...q, ...itemTip})); // q.page, q.pSize, q.keyword, q.order
});
router.get('/all', async (ctx, next) => {
  var q = await getSidQuery({ctx, isItems:1})
  ctx.response.body = await getItems(getQueryObj({...q, ...itemTip})); // q.page, q.pSize, q.keyword, q.order
});
router.get('/:id', async (ctx, next) => {
  // TODO 这里未对获取单个商品进行 sid 的验证
  if(ctx.params.id=='show'){
    ctx.response.body = show();
  }else {
    ctx.response.body = await getItem(ctx.params.id);
  }
});

router.post('/', async (ctx, next) => {
  // var body = ctx.request.body;
  // {
  //   name: body.name,
  //   description: body.description,
  //   price: body.price,
  //   specifications : body.specifications,
  //   details : body.details,
  //   cat_id : body.details
  // }
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
      var item = await createItem({sid: admin.sid, ...postItem})
      if(item && item.id){
        var _r = Rst.suc()
        ctx.response.body = {id: item.id, ..._r};
      }
  }});
});

router.put('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var res = await updateItem(ctx.request.body)
    Rst.putRst(res, ctx);
  }});
});
router.put('/status/:status', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await shelfItems(ids, ctx.params.status)
    Rst.putRst(res, ctx);
  }});
});
router.del('/', async (ctx, next)=>{
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await deleteItems(ids)
    Rst.putRst([res], ctx);
  }});
});
module.exports = router
