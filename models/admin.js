import {Sequelize, initTable} from '../utils/model'
import Rst from '../utils/result'

const table = 'admin',
fields = {
  id : {type : Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey : true, unique : true},
  account : {type : Sequelize.STRING, comment : '用户帐号'},
  password : {type : Sequelize.STRING, comment : '用户密码'},
  // sign : {type : Sequelize.STRING, comment : '超级管理员此项为空字符串,'},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "管理员所管理的分校id, -1表示未分配分校, 0表示超级管理员"}
},
entity = {
  "account": "test",
  "password": "123456",
  "sid" : 0
}
const {Model: Admin, ..._table} = initTable({table, fields, entity})



var IDS = {}; // 已登录的管理员对象列表,程序或服务器重启会导致用户掉线(已修改,见 TAG[00002])
const operateIDS = (admin, login)=>{
  if(login){
    IDS[admin.id] = {id:admin.id, sid: admin.sid, sign: admin.sign}; // 将已登录的帐号保存于此,避免每次检查都到数据库中查找
  }else {
    delete IDS[admin.id]
  }
}
const getAdminBySession = async (id)=>{
  if(IDS[id] && IDS[id].id){
    return IDS[id];
  }else {
    // 这里可以用该id再查一次数据库,但这样的话,只要浏览器有该cookies,则永远为登录状态 TAG[00002]
    var _admin = {};
    await Admin.findById(id).then(admin => {
      if(admin && admin.id){
        operateIDS(admin, true)
        _admin = admin;
      }
    })
    return _admin;
  }
}
// 检查是否登录了管理员帐号
const checkAdminLogin = async (ctx)=>{
  // ctx.cookies.set(AdminSession, admin.id); // 设置cookies
  var admin = await getAdminBySession(ctx.cookies.get(AdminSession)) // 获取cookies
  if(admin && admin.id){
    if(admin.sid==-1){
      ctx.response.body = Rst.fail("管理员sid=-1,该管理员未分配分校",401)
    }else {
      return {flag:true,admin:admin};
    }
  }else {
    ctx.response.body = Rst.fail("请先登录",401)
  }
  return {}; // 最后必须返回一个空对象,否则会出错
}


const login = async ({account, password})=>{
  var _admin = {};
  await Admin.findOne({ where: {account: account, password: password} }).then(admin => {
    if(admin && admin.id){
      operateIDS(admin, true)
    }
    _admin = admin;
  })
  return _admin;
}
const logout = (ctx)=>{
  var id = ctx.cookies.get(AdminSession);
  operateIDS({id},false);
  ctx.cookies.set(AdminSession, null);
  return true;
}
const AdminSession = "admin-sessionid";



module.exports = {
  ..._table,
  login,
  logout,
  AdminSession,
  getAdminBySession,
  checkAdminLogin
}
