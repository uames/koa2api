import Rst from '../utils/result';
import { getQuery } from '../service/user';
import {dbItems, getItem, getItems, createItem, updateItem, deleteItems, shelfItems } from '../models/items';
import { getAdminBySession, checkAdminLogin as checkALogin, AdminSession } from '../models/admin';
import { getUserBySession, checkUserLogin as checkULogin, UserSession } from '../models/users';

const router = require('koa-router')()
const DIR = process.env.DIR || '';

router.prefix(DIR + '/items');

const postItem = {
  name: '艾美特(Airmate) FSW52R 遥控落地扇/电风扇',
  description: '【京东自营-艾美特专注电风扇44年】累计销量120万台！超30万消费者参与好评！大风量超静音，5米智能遥控，3档风量调节，静音睡眠风，一级能效！电机十年包用！好风扇就选艾美特！',
  specifications : JSON.stringify([{"name":"【五叶遥控款】","price":"239","store":"200","img":"[]"},{"name":"【京东机皇-累计销量120万台】","price":"179","store":"100","img":"[]"}]),
  details : `厂家服务
              本产品全国联保，享受三包服务，质保期为：全国联保一年
              自收到商品之日起，如您所购买家电商品出现质量问题，请先联系厂家进行检测，凭厂商提供的故障检测证明，在“我的京东-客户服务-返修退换货”页面提交退换申请，将有专业售后人员提供服务。京东承诺您：30天内产品出现质量问题可退货，180天内产品出现质量问题可换货，超过180天按国家三包规定享受服务。 您可以查询本品牌在各地售后服务中心的联系方式，请点击这儿查询......

              品牌官方网站：http://www.airmate-china.com/
              售后服务电话：400-886-0315`,
  cat_id : 0,
  status : 0,
  buycount : 0,
  sid : 1
}
// 接口说明 items/show
const show = ()=>{
  return {
    "数据库字段说明" : dbItems,
    "链接前缀": DIR,
    "GET  /items" : {example: "/items?page=1&pSize=10&keyword=书架&order=price desc", "成功":'status为1, sid为用户sid和0的[商品数组](即已上架的且用户所属分校的商品)', "备注":"若为空数组[],则表示该搜索条件无对应商品"},
    "GET  /items/all" : {example: "/items?page=1&pSize=10&keyword=书架&order=price desc", "成功":'默认为管理员sid的所有[商品数组],链接中可添加status=1或0来筛选上架或下架的商品', "备注":"若为空数组[],则表示该搜索条件无对应商品"},
    "GET  /items/:id" : {example: "/items/1", "成功":{id:1, ...postItem}, "备注":"若为空对象{},则表示该id对应的商品不存在"},
    "POST /items" : {参数:postItem, 成功:{errCode:0,id:"新建的商品的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /items" : {参数:postItem, 成功:{errCode:0,id:"新建的商品的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /items/shelf/:status" : {参数:{"链接中的status":"","body中的数据":"[要上架或下架的id数组]"}, 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}},
    "DEL  /items" : {参数:{"body中的数据":"[要删除的id数组]"}, 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}}
  }
}

router.get('/', async (ctx, next) => {
  var q = await getQuery(ctx)
  ctx.response.body = await getItems({status:1, ...q}); // q.page, q.pSize, q.keyword, q.order
});
router.get('/all', async (ctx, next) => {
  var q = await getQuery(ctx)
  ctx.response.body = await getItems(q); // q.page, q.pSize, q.keyword, q.order
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
const putRst = (res, ctx)=>{
  if(res && res[0]>0){
    ctx.response.body = Rst.suc("操作成功")
  }else if(res && res[0]==0) {
    ctx.response.body = Rst.suc("提交的数据无法使数据库发生改变")
  }else {
    ctx.response.body = Rst.fail("操作失败:"+JSON.stringify(res))
  }
}
router.put('/', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var res = await updateItem(ctx.request.body)
    putRst(res, ctx);
  }});
});
router.put('/shelf/:status', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await shelfItems(ids, ctx.params.status)
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
