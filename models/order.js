import {Sequelize, initTable} from '../utils/model'

const table = 'order',
fields = {
  item_id : {type : Sequelize.INTEGER, comment : '商品id'},
  name : {type : Sequelize.STRING, comment : '商品名称'},
  price : {type : Sequelize.INTEGER, comment : '商品价格'},
  // item_info : {type : Sequelize.TEXT, comment : '商品信息:{name:"商品名称",price:"商品价格"}'},
  user_id : {type : Sequelize.INTEGER, comment : '员工id'},
  user_name :  {type : Sequelize.STRING, comment : '收货人名称'},
  phone : {type: Sequelize.STRING, validate: {isNumeric: true}, comment : '收货人手机' },
  address : {type: Sequelize.STRING, comment : '收货地址' },
  // user_info : {type : Sequelize.TEXT, comment : '员工信息: {name:"姓名",phone:"手机"}'},
  sid : {type : Sequelize.INTEGER, comment : "订单所属分校id(使用用户的sid)"},
  status : {type : Sequelize.BOOLEAN, defaultValue: 1, comment : "-1已删除订单(不可见),0订单已取消,1待发货,2已发货(待收货),3订单已完成"},
},
entity = {
  "item_id": 1,
  "name": "艾美特(Airmate) FSW52R 遥控落地扇/电风扇",
  "price": 179,
  "user_name": "收货人名称",
  "phone": 18585256663,
  "address": "广州市",
  user_id: 1,
  sid: 1,
  status: 2,
};
const {Model: Order, ..._table} = initTable({table, fields, entity})

// 修改订单状态, 支持批量修改
const chgStatus = async ({ids, status, sid})=>{
  var rst=[];
  var id = ids.constructor.name==="Array"?{$in: ids}:ids;
  var where = {id};
  if(sid){
    where.sid = sid;
  }
  await Order.update(
    { status: status }, /* set attributes' value */
    { where }/* where criteria */
  ).then((res)=>{
    rst = res;
  });
  return rst;
}
module.exports = {
  ..._table,
  chgStatus
}
