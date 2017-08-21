import {Sequelize, initTable} from '../utils/model'

const table = 'address',
fields = {
  name :  {type : Sequelize.STRING, comment : '收货人名称'},
  phone : {type: Sequelize.STRING, validate: {isNumeric: true}, comment : '收货人手机' },
  user_id : {type : Sequelize.INTEGER, comment : '用户id'},
  province :  {type : Sequelize.STRING, comment : '省'},
  city :  {type : Sequelize.STRING, comment : '市'},
  district :  {type : Sequelize.STRING, comment : '区或镇'},
  details :  {type : Sequelize.STRING, comment : '详细至门牌号'},
  status : {type : Sequelize.BOOLEAN, defaultValue: 0, comment : "0非当前默认地址, 1当前默认地址"},
},
entity = {
  "user_id" :1,
  "province" : "广东省",
  "city" : "广州市",
  "district" : "天河区",
  "details" : "员村三横路54号",
  "status" : 1,
  "name" : "test",
  "phone" : "18825053886"
};
const {Model:Address, ..._table} = initTable({table, fields, entity})

const chgStatus = async ({where, status})=>{
  var rst=[];
  await Address.update(
    { status: status }, /* set attributes' value */
    { where: where }/* where criteria */
  ).then((res)=>{
    rst = res;
  });
  return rst;
}

module.exports = {
  ..._table,
  chgStatus
}
