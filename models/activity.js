import {Sequelize, initTable} from '../utils/model'

const table = 'activity',
fields = {
  name : {type : Sequelize.STRING, comment : '活动名称(用于可视化分别活动)'},
  sign : {type : Sequelize.STRING, comment : '活动标识,值唯一,创建后无法修改. 接入活动后,从活动跳转登录积分商城要传sign值', unique : true},
  api_get : {type : Sequelize.STRING, comment : '该活动同步积分的接口'},
  api_post : {type : Sequelize.STRING, comment : '该活动修改积分的接口'},
},
entity = {
  name : "test",
  sign : "test123456",
  api_get : "http://localhost:3000/users/testApiGet",
  api_post : "http://localhost:3000/users/testApiPost",
};

module.exports = initTable({table, fields, entity})
