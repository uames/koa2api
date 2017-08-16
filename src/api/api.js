'use strict'

// 对于restful中参数形如：id的参数放在params.url中，其他的放在params.body

import Vue from 'vue'
import VueResource from 'vue-resource'
import qs from 'query-string'

Vue.use(VueResource)

const host = location.host.match('localhost') ? '/api' : ''
const methods = ['post', 'get', 'delete', 'put']

// 需要使用四个http动词的api接口
let common = {
  admin: '/admin',
  activity: '/activity',
  tag: '/tag',
  order: '/order',
  items: '/items'
}

// 生成方法接口和http动词的对象；
function generateHttpAction (apis, methods) {
  var tmpApi = {}
  for (var api in apis) {
    for (var methodIndex in methods) {
      var apiName = methods[methodIndex] + api[0].toUpperCase() + api.slice(1)
      tmpApi[apiName] = {
        url: apis[api],
        method: methods[methodIndex]
      }
    }
  }
  return tmpApi
}

var commonTransform = generateHttpAction(common, methods)

let extra = {
  adminLogin: {
    url: '/admin/login',
    method: 'post'
  },
  adminLogout: {
    url: '/admin/logout',
    method: 'post'
  },
  getActivityById: {
    url: '/activity',
    method: 'get',
    rest: true
  },
  getTagById: {
    url: '/tag',
    method: 'get',
    rest: true
  },
  getAllOrder: {
    url: '/order/all',
    method: 'get'
  },
  getAllActivity: {
    url: '/activity/all',
    method: 'get'
  },
  putOrderStatus: {
    url: '/order/status',
    method: 'put',
    rest: true
  },
  getAllItems: {
    url: '/items/all',
    method: 'get'
  }
}

let apis = {}
Object.assign(apis, commonTransform, extra)

let webInterface = {}
for (var api in apis) {
  let { url, method, rest } = apis[api]
  webInterface[api] = (params) => {
    if (rest) {
      // restful中url中会带有参数
      if (method === 'delete') {
        return Vue.http[method](host + url + '/' + params.url, params)
      } else {
        return Vue.http[method](host + url + '/' + params.url, params.body)
      }
    } else {
      if (method === 'delete') {
        return Vue.http[method](host + url, {body: params})
      } else if (method !== 'get') {
        return Vue.http[method](host + url, params)
      } else {
        return Vue.http[method](host + url + '?' + qs.stringify(params))
      }
    }
  }
}

export default webInterface
