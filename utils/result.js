import Log from '../models/log'
const suc = (msg)=>{
  return {
    errCode: 0,
    msg: msg || ''
  }
}
const fail = (msg,code)=>{
  return {
    errCode: code!=undefined?code:1,
    msg: msg || '未定义错误信息'
  }
}
const log = ({content,type, tag})=>{
  Log.create({content, type, tag});
}
const putRst = (res, ctx)=>{
  if(res && res[0]>0){
    ctx.response.body = suc("操作成功")
    return true;
  }else if(res && res[0]==0) {
    ctx.response.body = suc("提交的数据无法使数据库发生改变")
    return true;
  }else {
    ctx.response.body = fail("操作失败:"+JSON.stringify(res))
    return false;
  }
}
// 初始化 route
const initRoute = ({prefix,entity})=>{
  const router = require('koa-router')()
  const DIR = process.env.DIR || '';
  router.prefix(DIR + prefix);

  return {router, entity}
}
module.exports = {
  suc,
  fail,
  log,
  putRst,
  initRoute
}
