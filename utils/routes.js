// 由于有 admin 这种不能自由添加修改的表, 故而自动生成crud路由不能使用扫描式的, 考虑使用排除式或者指定式
// 由于指定式方便直接,目前确定用指定式
import { checkAdminLogin as checkALogin } from '../models/admin';
import { checkUserLogin as checkULogin } from '../models/users';




// TODO 这个思路判断条件太多,难以总结!
// 思路: models的数组中, 将字符串改为对象,并传入可供生成链接修改的参数,如{model:"items", childUrl:[{method:"post",uri:"/status/:status", params}]}
// 此时则 /items 除了自动生成原有的路由外, 还应生成一个 /items/status/:status




// import fs from 'fs'
// 导入动态生成的routes
// let route = require(__dirname + '/utils/routes');
// app.use(route.routes(), route.allowedMethods())
const models = [
  {model:"activity",get:{check:"super_admin"}},
  {model:"address",get:{check:"user"}},
  {model:"items",get:{check:"admin user"}},
  {model:"itemTag",check:"user"},
  {model:"admin",check:"admin"},
  {model:"order",check:"admin_user"},
  {model:"users",check:"admin_user"}]

const DIR = process.env.DIR || '';
const cwd = process.cwd()

let routes = [];

models.forEach(({model:m, ...crud})=>{
  const Model = require(cwd + '/models/' + m)
  const router = require('koa-router')()

  router.prefix(DIR+'/api/'+m) // 自动生成的接口默认在原来的地址上加上'/api'

  router.get('/table', async (ctx, next) => {
    ctx.response.body = Model.fields;
  });









  // router.get('/:id', async (ctx, next) => {
  //   if(ctx.params.id=='show'){
  //     ctx.response.body = show();
  //   }else {
  //     ctx.response.body = await getItem(ctx.params.id);
  //   }
  // });
  // router.post('/', async (ctx, next) => {
  //   await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
  //       var item = await createItem({sid: admin.sid, ...postItem})
  //       if(item && item.id){
  //         var _r = Rst.suc()
  //         ctx.response.body = {id: item.id, ..._r};
  //       }
  //   }});
  // });
  // router.put('/', async (ctx, next) => {
  //   await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
  //     var res = await updateItem(ctx.request.body)
  //     putRst(res, ctx);
  //   }});
  // });
  // router.del('/', async (ctx, next)=>{
  //   await checkALogin(ctx).then(async ({flag,admin})=>{ if(flag){
  //     var ids = ctx.request.body;
  //     var res = await deleteItems(ids, ctx.params.status)
  //     putRst([res], ctx);
  //   }});
  // });






  routes.push(router);
})

module.exports = routes

// var files = fs.readdirSync(cwd + '/models');
// // var files = fs.readdirSync(__dirname + '/models');
// for (var f of files) {
//     console.log(`build table: ${f}...`);
//     // let table = require(cwd + '/models/' + f)
//     // let table = require(__dirname + '/models/' + f)
//     app.use(route.routes(), route.allowedMethods())
// }
//
// // 处理每个js文件:
// for (var f of js_files) {
//     console.log(`process routes: ${f}...`);
//     // 导入js文件:
//     let route = require(__dirname + '/routes/' + f);
// }
