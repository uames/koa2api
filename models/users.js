import {Sequelize, initTable} from '../utils/model'
import Rst from '../utils/result'

const table = 'users',
fields = {
  name : {type : Sequelize.STRING, comment : '用户名称'},
  phone : {type: Sequelize.STRING, validate: {isNumeric: true}, comment : '用户手机,同时也是帐号,登录积分商城时,要用到这个帐号' },
  password : {type : Sequelize.STRING, comment : '用户密码,用于积分商城登录'},
  checkpwd :  {type : Sequelize.STRING, comment : '跳转密码,用于保存接入的系统的密码,跳转时验证该密码正确即可'},
  address : {type: Sequelize.STRING, comment : '当前默认收货地址' },
  balance : {type : Sequelize.INTEGER, comment : '积分余额'},
  sign : {type : Sequelize.STRING, comment : '超级用户此项为空字符串,第三方接入本系统后,调用接口生成用户时,需传入此项值(与sid对应),然后copy到对应的活动项目中(生成数据后不可修改,否则会对应不上)'},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "此项值根据sign在activity表中获取到,用户所属的活动(分校)id, -1表示未分配, 0表示超级用户,可查看所有分校产品"}
},
entity = {
      name: 'test',
      phone: '18825053886',
      password: '123456',
      checkpwd: '654321',
      address: "广州市",
      balance: 999999,
      sign: 'test123456',
      sid : 1
}
const {Model: Users, ..._table} = initTable({table, fields, entity})



var IDS = {}; // 已登录的普通用户对象列表,程序或服务器重启会导致用户掉线 (已修改,见 TAG[00002])
const rebuildUser = user => {
  if(user){
    return {id:user.id, sid: user.sid, sign: user.sign, name: user.name, balance: user.balance, phone: user.phone, createdAt:user.createdAt}
  }else{
    return {}
  }
}
const operateIDS = (user, login)=>{
  if(login){
    // 将已登录的帐号保存于此,避免每次检查都到数据库中查找
    IDS[user.id] = rebuildUser(user);
    // IDS[user.id] = user;
  }else {
    delete IDS[user.id]
  }
}
const getUserBySession = async (id)=>{
  if(IDS[id] && IDS[id].id){
    return IDS[id];
  }else {
    // 这里可以用该id再查一次数据库,但这样的话,只要浏览器有该cookies,则永远为登录状态 TAG[00002]
    var _user = {};
    await Users.findById(id).then(user => {
      if(user && user.id){
        operateIDS(user, true)
        _user = user;
      }
    })
    return rebuildUser(_user);
  }
}
// 检查是否登录了用户帐号
const checkUserLogin = async (ctx)=>{
  // ctx.cookies.set(UserSession, user.id); // 设置cookies
  var user = await getUserBySession(ctx.cookies.get(UserSession)) // 获取cookies
  if(user && user.id){
    if(user.sid<1){
      ctx.response.body = Rst.fail("user.sid<1, 该用户未分配分校",401)
    }else {
      return {flag:true,user:user};
    }
  }else {
    ctx.response.body = Rst.fail("请先登录",401)
  }
  return {}; // 最后必须返回一个空对象,否则会出错
}

const login = async ({phone, password, checkpwd, sign})=>{
  var _user = {}, where = {phone};
  if(password && password.length > 5){
    where.password = password
  }else {
    where.sign = sign; // 若为跳转登录,则还需要用到 sign
    where.checkpwd = checkpwd
  }
  await Users.findOne({ where: where }).then(user => {
    if(user && user.id){
      operateIDS(user, true)
    }
    _user = user;
  })

  return rebuildUser(_user);
}
const logout = (ctx)=>{
  var id = ctx.cookies.get(UserSession)
  operateIDS({id},false);
  ctx.cookies.set(UserSession, null);
  return true;
}
const UserSession = "user-sessionid"



module.exports = {
  ..._table,
  UserSession,
  login,
  logout,
  getUserBySession,
  checkUserLogin,
  rebuildUser
}
