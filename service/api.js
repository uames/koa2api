import http from 'http'
import request from 'request'
import qs from 'querystring'
import Rst from '../utils/result';

const fetchGet = async ({ctx, api_get, phone, checkpwd, sign, callBackFn})=>{
  if(api_get){
    // 这里利用了 Promise 解决了使异步的 http 变同步的问题
    await new Promise((resolve, reject) => {
      http.get(api_get+"?"+qs.stringify({phone, checkpwd, sign}),async (req,res)=>{
          var content = "请求api_get接口出错,phone:"+phone+",checkpwd:"+checkpwd+",sign:"+sign, _d = '';
          req.on('error', function(e){
            content += ",err:"+JSON.stringify(e)
            Rst.log({ content, type:1, tag:"[ /service/api.js fetchGet 01]" });
            ctx.body = Rst.fail(content)
          });
          req.on('data',function(data){
            _d += data;
          });
          req.on('end',async ()=>{
            // 规定返回的obj的格式 {balance: 用户在该系统中的当前积分}
            var {balance} = JSON.parse( _d );
            if(balance>-1){
              //  检查 phone 是否有对应的帐号
              await callBackFn({balance})
            }else if(balance==-1) {
              ctx.body = Rst.fail("该用户在第三方系统中不存在!")
            }else {
              content += ",data:" + _d
              Rst.log({ content, type:1, tag:"[/service/api.js fetchGet 02]" });
              ctx.body = Rst.fail(content)
            }
            resolve()
          });
      });
    })
  }else {
    ctx.body = Rst.fail("未设置 api_get 接口")
  }
}
const fetchPost = async ({ctx, api_post, phone, checkpwd, sign, balance, orderId, callBackFn})=>{
  if(api_post){
    // 这里利用了 Promise 解决了使异步的 http 变同步的问题
    await new Promise((resolve, reject) => {
      request.post(api_post, {form:{phone, checkpwd, sign, balance, cancelOrderId:orderId}}, async (error, response, data)=>{
        data = JSON.parse(data)
        var content = "请求 api_post 接口出错:phone:"+phone+", checkpwd:"+checkpwd+",sign:"+sign;
        if(error){
          content += ",err:"+JSON.stringify(error)
          Rst.log({ content, type:1, tag:"[/service/api.js fetchPost 01]" });
          ctx.body = Rst.fail(content)
        }else {
          if(data.errCode==0 || data.code==1 || data.status==1){
              await callBackFn(data)
          }else {
              content += ",data:" + JSON.stringify(data)
              Rst.log({ content, type:1, tag:"[/service/api.js fetchPost 02]" });
              ctx.body = Rst.fail(content)
          }
        }
        resolve()
      })
    })
  }else {
    ctx.body = Rst.fail("未设置 api_post 接口")
  }
}
module.exports = {
  fetchGet,
  fetchPost
}
