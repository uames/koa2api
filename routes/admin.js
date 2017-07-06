const router = require('koa-router')()
const Rst = require('../utils/result')
const DIR = process.env.DIR || '';

router.prefix(DIR + '/admin');
const { login, AdminSession } = require('../utils/models/admin')

// router.get('/', async (ctx, next) => {
//     ctx.response.body = `<h1>Index</h1>
//         <form action="${DIR}/users/signin" method="post">
//             <p>Name: <input name="name" value="koa"></p>
//             <p>Password: <input name="password" type="password"></p>
//             <p><input type="submit" value="Submit"></p>
//         </form>`;
// });

// router.post('/signin', async (ctx, next) => {
//     var name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="${DIR}/users">Try again</a></p>`;
//     }
// });
router.post('/login', async (ctx, next) => {
    var account = ctx.request.body.account || '',
        password = ctx.request.body.password || '';
    var admin = await login({account, password});
    if(admin && admin.id){
      // const n = ctx.cookies.get('shop-sessionid');
      ctx.cookies.set(AdminSession, admin.id);
      ctx.response.body = Rst.suc()
    }else {
      ctx.response.body = Rst.fail("帐号或密码错误")
    }

});
module.exports = router
