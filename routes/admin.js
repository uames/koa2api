import Rst from '../utils/result';
import Admin, { login, logout, AdminSession, checkAdminLogin as checkALogin } from '../models/admin';
import { getQueryObj,checkSuperAdmin } from '../service/user';
import _ from 'lodash';
const {router} = Rst.initRoute({
  prefix:'/admin'
});

router.get('/show', async (ctx, next) => {
  ctx.response.body = {
    "GET  /admin" : "超级管理员获取管理员列表",
    "POST /admin" : "超级管理员[新增]普通管理员. name password相同, 或name sid相同的, 只能出现一次,",
    "POST /admin/login" : "帐号密码登录管理端",
    "POST /admin/logout" : "退出登录",
    "PUT  /admin" : "超级管理员[修改]普通管理员. name password相同, 或name sid相同的, 只能出现一次,",
    "DEL  /admin" : {说明:"超级管理员[删除]普通管理员",参数:{"body中的数据":"[要删除的id数组]"}}
  }
});

router.post('/login', async (ctx, next) => {
    var account = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    var admin = await login({account, password});
    if(admin && admin.id){
      // const n = ctx.cookies.get('shop-sessionid');
      ctx.cookies.set(AdminSession, admin.id);
      ctx.response.body = {...(Rst.suc()),sid:admin.sid}
    }else {
      ctx.response.body = Rst.fail("帐号或密码错误")
    }
});
router.post('/logout', async (ctx, next) => {
  if(logout(ctx)){
    ctx.response.body = Rst.suc()
  }else {
    ctx.response.body = Rst.fail("退出失败")
  }
});
router.get('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ()=>{
    var query = ctx.query;
    query.where = {sid:{$ne:0}}
    ctx.response.body = await Admin.retrieve({query:getQueryObj(query)});
  }});
});
// 超级管理员新增普通管理员
router.post('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async ()=>{
    var body = ctx.request.body;
    // name password相同, 或name sid相同的, 只能出现一次,
    var admins = await Admin.retrieve({query:{where:{account:body.account,$or:[{password:body.password}, {sid:body.sid}]}}});
    if(admins.length>0){
      ctx.response.body = Rst.fail("该活动已有同名的管理员帐号")
    }else {
      var admin = await Admin.create({...body})
      if(admin && admin.id){
        var _r = Rst.suc()
        ctx.response.body = {id: admin.id, ..._r};
      }else {
        ctx.response.body = Rst.fail("新建管理员失败"+JSON.stringify(admin))
      }
    }
  }});
});

router.put('/', async (ctx, next) => {
  await checkSuperAdmin({ctx, callBackFn:async (admin)=>{
    var body = ctx.request.body;
    // name password相同, 或name sid相同的, 只能出现一次,
    var admins = await Admin.retrieve({query:{ where:{account:body.account,$or:[{password:body.password}, {sid:body.sid}], id:{$ne:body.id}} }});
    if(admins.length>0){
      ctx.response.body = Rst.fail("该活动已有同名的管理员帐号")
    }else {
      var res = await Admin.update(ctx.request.body)
      Rst.putRst(res, ctx);
    }
  }});
});
router.del('/', async (ctx, next)=>{
  await checkSuperAdmin({ctx, callBackFn:async ()=>{
    var ids = ctx.request.body;
    // ids = _.without(ids,0); // TODO 删除管理员的时候,不能删除 sid 为 0 的超级管理员
    var res = await Admin.del(ids)
    Rst.putRst([res], ctx);
  }});
});
module.exports = router
