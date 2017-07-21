import {Sequelize, initTable} from '../utils/model'

const table = 'log',
fields = {
  content : {type : Sequelize.TEXT, comment : '记录内容'},
  type : {type : Sequelize.BOOLEAN, defaultValue: 1, comment : '记录类型: 1错误 2流水 ...'},
  tag : {type : Sequelize.STRING, comment : '记录tag, 用于区分不同的记录'},
},
entity = {
};

module.exports = initTable({table, fields, entity})
