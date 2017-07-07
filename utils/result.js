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

module.exports = {
  suc,
  fail
}
