import {Sequelize, initTable} from '../utils/model'

const table = "items",
fields = {
  name : {type : Sequelize.STRING(100), comment : '商品名称'},
  price : {type : Sequelize.INTEGER, comment : '商品价格(多个价格则取最低价)'},
  description : {type : Sequelize.TEXT, comment : '商品描述'},
  specifications : {type : Sequelize.TEXT, comment : '商品规格(数组),内容:[{name:"规格名称",price:"兑换该商品所需积分值",store:"库存",img:"图片(数组)"}]'},
  details : {type : Sequelize.TEXT, comment : '商品详情'},
  tag_id : {type : Sequelize.INTEGER, comment : "商品类目id,0表示为未分类商品"},
  status : {type : Sequelize.BOOLEAN, defaultValue: 0, comment : "1(true)代表商品上架,0(false)代表商品下架"},
  buycount : {type : Sequelize.INTEGER, defaultValue: 0, comment : "商品销量"},
  sid : {type : Sequelize.INTEGER, defaultValue: -1, comment : "商品所属分校id, -1表示未分配分校, 0表示所有分校通用"}
},
entity = {
  "name": "艾美特(Airmate) FSW52R 遥控落地扇/电风扇",
  "description": "【京东自营-艾美特专注电风扇44年】累计销量120万台！超30万消费者参与好评！大风量超静音，5米智能遥控，3档风量调节，静音睡眠风，一级能效！电机十年包用！好风扇就选艾美特！",
  "price": 239,
  "specifications" : "[{\"name\":\"【五叶遥控款】\",\"price\":\"239\",\"store\":\"200\",\"img\":\"[]\"},{\"name\":\"【京东机皇-累计销量120万台】\",\"price\":\"179\",\"store\":\"100\",\"img\":\"[]\"}]",
  "details" : `厂家服务
              本产品全国联保，享受三包服务，质保期为：全国联保一年
              自收到商品之日起，如您所购买家电商品出现质量问题，请先联系厂家进行检测，凭厂商提供的故障检测证明，在“我的京东-客户服务-返修退换货”页面提交退换申请，将有专业售后人员提供服务。京东承诺您：30天内产品出现质量问题可退货，180天内产品出现质量问题可换货，超过180天按国家三包规定享受服务。 您可以查询本品牌在各地售后服务中心的联系方式，请点击这儿查询......

              品牌官方网站：http://www.airmate-china.com/
              售后服务电话：400-886-0315`,
  "tag_id" : 1,
  "status":1,
  "sid":1
};
const {Model:Items, ..._table} = initTable({table, fields, entity})



const getItem = async id=>{
  var _r = {};
  await Items.findById(id).then(function(res){
    _r = res || _r
  });
  return _r;
}
const getItems = async (queryObj)=>{
  var items = []
  await Items.findAll(queryObj).then(res => {
    items = res;
  });
  return items;
}
const initItem = (item)=>{
  if(isNaN(item.price)){
    var spec = JSON.parse(item.specifications);
    item.price=spec&&spec[0]?spec[0].price:0;
    if(item.price>0){
      for(var s in spec){
        if(spec[s].price<item.price){
          item.price = spec[s].price
        }
      }
    }
  }
  return item;
}
const createItem = async (item)=>{
  item = initItem(item)
  return await Items.create(item);
}
const updateItem = async (item)=>{
  item = initItem(item)
  var id = item.id, rst=[];
  // delete item.id;
  await Items.update(
    { ...item }, /* set attributes' value */
    { where: { id: id }} /* where criteria */
  ).then((res)=>{
    rst = res;
  });
  return rst;
}
const deleteItems = async ids=>{
  var rst=[];
  await Items.destroy({
    where:{id: {$in: ids}},
    // truncate: true /* this will ignore where and truncate the table instead */
  }).then((res)=>{
    rst = res;
  });
  return rst;
}
const shelfItems = async (ids, status)=>{
  var rst=[];
  await Items.update(
    { status: status }, /* set attributes' value */
    { where: { id: {$in: ids} }}/* where criteria */
  ).then((res)=>{
    rst = res;
  });
  return rst;
}



module.exports = {
  ..._table,
  getItem,
  getItems,
  createItem,
  updateItem,
  deleteItems,
  shelfItems
}
