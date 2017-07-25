import {Sequelize, initTable} from '../utils/model'

const table = 'item_tag',
fields = {
  name : {type : Sequelize.STRING, comment : '标签名称'},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "商品所属分校id, -1表示未分配分校, 0表示所有分校通用"}
},
entity = {
  "name": "办公用品",
  "sid" : 1
};

module.exports = initTable({table, fields, entity})
