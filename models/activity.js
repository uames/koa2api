import {Sequelize, defineModel} from '../uitls/mysql'

const dbUsers = {
  name : {type : Sequelize.STRING, comment : '用户名称'},
  phone : {type: Sequelize.STRING, validate: {isNumeric: true}, comment : '用户手机,同时也是帐号,登录积分商城时,要用到这个帐号' },
  password : {type : Sequelize.STRING, comment : '用户密码,用于积分商城登录'},
  checkpwd :  {type : Sequelize.STRING, comment : '跳转密码,用于保存接入的系统的密码,跳转时验证该密码正确即可'},
  balance : {type : Sequelize.INTEGER, comment : '积分余额'},
}
const _dbUsers = JSON.parse(JSON.stringify(dbUsers));

const Users = defineModel('activity', dbUsers);

const build = ()=>{
  // force: true will drop the table if it already exists
  Users.sync({force: true}).then(() => {
    return Users.create({
          name: 'test',
          phone: '18825053886',
          password: '123456',
          checkpwd: '654321',
          balance: 9999,
          sid : 0
    });
  });
}

var IDS = {}; // 已登录的管理员对象列表,程序或服务器重启会导致用户掉线 TODO[00001]
const operateIDS = (user, login)=>{
  if(login){
    IDS[user.id] = user;
  }else {
    delete IDS[user.id]
  }
}
const checkLogin = async (id)=>{
  if(IDS[id] && IDS[id].id){
    return IDS[id];
  }else {
    // 这里可以用该id再查一次数据库,但这样的话,只要浏览器有该cookies,则永远为登录状态 TODO[00001]
    var _user = {};
    await Users.findById(id).then(user => {
      if(user && user.id){
        operateIDS(user, true)
        _user = user;
      }
    })
    return _user;
  }
}

const login = async ({account, password})=>{
  var _user = {};
  await Users.findOne({ where: {account: account, password: password} }).then(user => {
    if(user && user.id){
      operateIDS(user, true)
    }
    _user = user;
  })
  return _user;
}

module.exports = {
  dbUsers: _dbUsers,
  build: build,
  Users: Users,
  userSession : "user-sessionid",
  login: login,
  checkLogin: checkLogin
}
