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
app.use(require('koa-static')(__dirname + '/public'))

app.use(require('koa-views')(__dirname + '/views', {
  // extension: '{views}'
  // extension: 'html'
}))

app.use(require('restc').koa2())

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

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

module.exports = app
