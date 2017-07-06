const {Sequelize, defineModel} = require('../mysql')

const dbAdmin = {
  id : {type : Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey : true, unique : true},
  account : {type : Sequelize.STRING, comment : '用户帐号'},
  password : {type : Sequelize.STRING, comment : '用户密码'},
  sign : {type : Sequelize.STRING, comment : '超级管理员此项为空字符串,创建普通管理员时,为管理员创建新活动时,需填入此项值(与sid对应),然后copy到对应的活动项目中(生成数据后不可修改,否则会对应不上)'},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "管理员所管理的分校id, -1表示未分配分校, 0表示超级管理员"}
}
const _dbAdmin = JSON.parse(JSON.stringify(dbAdmin));

const Admin = defineModel('admin', dbAdmin);

const build = ()=>{
  // force: true will drop the table if it already exists
  Admin.sync({force: true}).then(() => {
    return Admin.create({
      account: 'test',
      password: '123456',
      sign: 'test',
      sid : 0
    });
  });
}

var IDS = {}; // 已登录的管理员对象列表,程序或服务器重启会导致用户掉线 TODO[00001]
const operateIDS = (admin, login)=>{
  if(login){
    IDS[admin.id] = admin;
  }else {
    delete IDS[admin.id]
  }
}
const checkLogin = async (id)=>{
  if(IDS[id] && IDS[id].id){
    return IDS[id];
  }else {
    // 这里可以用该id再查一次数据库,但这样的话,只要浏览器有该cookies,则永远为登录状态 TODO[00001]
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

module.exports = {
  dbAdmin: _dbAdmin,
  build: build,
  Admin: Admin,
  AdminSession : "admin-sessionid",
  login: login,
  checkLogin: checkLogin
}
