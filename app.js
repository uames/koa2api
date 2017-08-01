const Koa = require('koa')
const app = new Koa()
const session = require("koa-session2");
// connect mysql
require('./utils/mysql').connect()

// error handler
require('koa-onerror')(app)

// middlewares
app.use(session({
    key: "SESSIONID",   //default "koa:sess"
}))
app.use(require('koa-bodyparser')({
  enableTypes:['json', 'form', 'text']
}))
app.use(require('koa-json')())
app.use(require('koa-logger')())

// koa-static  example: http://localhost:3000/js/test.js
app.use(require('koa-static')(__dirname + '/public'))

app.use(require('koa-views')(__dirname + '/views', {
  // extension: '{views}'
  // extension: 'html'
}))

// 便捷的测试框架 restc, 唯一的问题是无法区分路由,所有路由都变成了接口, 无法加载html模板
// app.use(require('restc').koa2())

// cors 设置
// var whitelist = ['http://example1.com', 'http://example2.com']
// app.use(require('koa-cors')({
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }));

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// 将 process.env.UPDATE_MANIFEST 处理为空格字符串
process.env.UPDATE_MANIFEST = (new Array(Number(process.env.UPDATE_MANIFEST)).fill(" ")).join("");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log(process.env.UPDATE_MANIFEST.length);
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
// routes
// 先导入fs模块，然后用readdirSync列出文件 这里可以用sync是因为启动时只运行一次，不存在性能问题:
var files = require('fs').readdirSync(__dirname + '/routes');
// 过滤出.js文件:
var js_files = files.filter((f)=>{
    return f.endsWith('.js');
});
// 处理每个js文件:
for (var f of js_files) {
    console.log(`process routes: ${f}...`);
    // 导入js文件:
    let route = require(__dirname + '/routes/' + f);
    app.use(route.routes(), route.allowedMethods())
}
// 导入自动生成路由文件
let routes = require(__dirname + '/utils/routes');
for (var route of routes) {
    app.use(route.routes(), route.allowedMethods())
}

module.exports = app
