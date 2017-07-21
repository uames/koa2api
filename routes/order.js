import Rst from '../utils/result';
import Order, {entity} from '../models/order';
import { getSidQuery,getQueryObj } from '../service/user';
import { checkUserLogin as checkULogin } from '../models/users';
import { checkAdminLogin as checkALogin } from '../models/admin';

const {router,entity:postOrder} = Rst.initRoute({
  prefix:'/order',
  entity
});
// 接口说明 items/show
const show = ()=>{
  return {
    "GET  /order" : {限制:"必须普通用户登录才能调用",example: "/order?page=1&pSize=10&keyword=书架&order=price desc", 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}},
    "GET  /order/all" : {限制:"必须管理员登录才能调用", 参数:"与 GET  /order 相同", 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}},
    "GET  /order/:id" : {example: "/items/1", "成功":{id:1, ...postOrder}, "备注":"若为空对象{},则表示该id对应的商品不存在"},
    "POST /order" : {参数:postOrder, 成功:{errCode:0,id:"新建的商品的id"},失败:{errCode:1,msg:"失败原因"}},
    "PUT  /order/status/:status" : {参数:"body内容:id数组[1,2,3]或[1],或单个的id如1,:status为订单状态值",成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}},
    "DEL  /order" : {参数:"与/order/status/:status相同", 成功:{errCode:0},失败:{errCode:1,msg:"失败原因"}}
  }
}
// 用户获取自己 id 和 sid 下的所有订单
router.get('/', async (ctx, next) => {
  await checkULogin(ctx).then(async ({flag,user})=>{ if(flag){
    let q=ctx.query
    q.where = {user_id:user.id, sid: user.sid, status:{$gt: -1}} // status==-1 为已删除的订单
    ctx.response.body = await Order.retrieve({query:getQueryObj(q)}); // q.page, q.pSize, q.keyword, q.order
  }});
});
// 管理员获取自己 sid 下的所有订单
router.get('/all', async (ctx, next) => {
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    let q=ctx.query
    q.where = {sid: admin.sid, status:{$gt: -1}} // status==-1 为已删除的订单
    ctx.response.body = await Order.retrieve({query:getQueryObj(q)}); // q.page, q.pSize, q.keyword, q.order
  }});
});
// 用户获取自己 id 和 sid 下的所有订单
router.get('/:id', async (ctx, next) => {
  await checkULogin(ctx).then(async ({flag,user})=>{ if(flag){
    if(ctx.params.id=='show'){
      ctx.response.body = show();
    }else {
      ctx.response.body = await Order.retrieve({id:ctx.params.id});
    }
  }});
});
// 用户生成订单
router.post('/', async (ctx, next) => {
  await checkULogin(ctx).then(async ({flag,user})=>{ if(flag){
    var body = ctx.request.body;
    var order = await Order.create({...body, sid: user.sid, user_id: user.id, status: 1})
    if(order && order.id){
      var _r = Rst.suc()
      ctx.response.body = {id: order.id, ..._r};
    }
  }});
});
router.put('/status/:status', async (ctx, next) => {
  const setStatus = async ()=>{
    var ids = ctx.request.body;
    var res = await Order.chgStatus(ids, ctx.params.status)
    Rst.putRst(res, ctx);
  }
  await checkULogin(ctx).then(async ({flag,user})=>{
    if(flag){
      await setStatus()
    }else {
      await checkALogin(ctx).then(async ({flag,user})=>{ if(flag){
        await setStatus()
      }});
    }
  });
});
// 删除订单只是将 status 值改为 -1
router.del('/', async (ctx, next)=>{
  await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
    var ids = ctx.request.body;
    var res = await Order.chgStatus(ids, -1)
    Rst.putRst([res], ctx);
  }});
});

module.exports = router
