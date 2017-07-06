const {Sequelize, defineModel} = require('../mysql')

const dbUsers = {
  id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
  name : {type : Sequelize.STRING, comment : '用户名称'},
  phone : {type: Sequelize.STRING, validate: {isNumeric: true}, comment : '用户手机,同时也是帐号,登录积分商城时,要用到这个帐号' },
  password : {type : Sequelize.STRING, comment : '用户密码,用于积分商城登录'},
  checkpwd :  {type : Sequelize.STRING, comment : '跳转密码,用于保存接入的系统的密码,跳转时验证该密码正确即可'},
  balance : {type : Sequelize.INTEGER, comment : '积分余额'},
  sign : {type : Sequelize.STRING, comment : '超级用户此项为空字符串,第三方接入本系统后,调用接口生成用户时,需传入此项值(与sid对应),然后copy到对应的活动项目中(生成数据后不可修改,否则会对应不上)'},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "此项值根据sign在activity表中获取到,用户所属的活动(分校)id, -1表示未分配, 0表示超级用户,可查看所有分校产品"}
}
const _dbUsers = JSON.parse(JSON.stringify(dbUsers));

const Users = defineModel('users', dbUsers);

const build = ()=>{
  // force: true will drop the table if it already exists
  Users.sync({force: true}).then(() => {
    return Users.create({
          name: 'test',
          phone: '18825053886',
          password: '123456',
          checkpwd: '654321',
          balance: 9999,
          sign: 'test',
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
  UserSession : "user-sessionid",
  login: login,
  checkLogin: checkLogin
}
