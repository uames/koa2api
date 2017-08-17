import {Sequelize, initTable} from '../utils/model'

var origin = process.env.ORIGIN;
const table = 'activity',
fields = {
  name : {type : Sequelize.STRING, comment : '活动名称(用于可视化分别活动)'},
  sign : {type : Sequelize.STRING,comment : `活动标识,值唯一,创建后无法修改. 接入活动后,从活动跳转登录积分商城要传sign值创建普通管理员时.
    为管理员创建新活动时,需填入此项值(与sid对应),然后copy到对应的活动项目中(生成数据后不可修改,否则会对应不上)`},
  api_get : {type : Sequelize.STRING, comment : '该活动同步积分的接口'},
  api_post : {type : Sequelize.STRING, comment : '该活动修改积分的接口'},
  url : {type : Sequelize.STRING, comment : '该活动的首页地址'},
},
entity = {
  "name" : "test",
  "sign" : "test123456",
  "api_get" : origin+"/users/testApiGet",
  "api_post" : origin+"/users/testApiPost",
  "url" : "http://baidu.com "
};

module.exports = initTable({table, fields, entity})
