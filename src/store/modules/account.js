import api from '../../api/api'
import {updateList, addToList} from '../../util/util'

console.log(api)

export default {
  state: {
    page: 1,
    keyword: undefined,
    list: [],
    menu: '1'
  },
  mutations: {
    // 更新管理者视图
    listAdmin (state, payload) {
      state.list = payload.list
      if (payload.keyword) {
        state.keyword = payload.keyword
      }
      if (payload.page) {
        state.page = payload.page
      }
    }
  },
  actions: {
    // 获取管理者列表
    getAdmin ({commit, state}, payload) {
      if (!payload.keyword) {
        payload.keyword = state.keyword
      }
      if (!payload.page) {
        payload.page = state.page
      }
      api.getAdmin(payload)
      .then(({body}) => {
        if (body.errCode) {
          alert(body.errMsg)
          return
        }
        let newPayload = {
          ...payload,
          list: body
        }
        commit('listAdmin', newPayload)
      })
    },
    // 创建管理者列表
    postAdmin ({commit, state}, payload) {
      api.postAdmin(payload)
      .then(({body}) => {
        if (body.errCode) {
          alert(body.msg)
          return
        }
        let timestamp = Date.now()
        let newAccount = {
          ...payload,
          createdAt: timestamp,
          updatedAt: timestamp,
          version: 0,
          id: body.id
        }
        let {list} = state
        list.pop()
        commit('listAdmin', {list: addToList(list, newAccount)})
      })
    },
    // 修改管理员列表
    putAdmin ({commit, state}, payload) {
      api.putAdmin(payload)
      .then(({body}) => {
        if (body.errCode) {
          alert(body.msg)
          return
        }
        let {list} = state
        let newList = updateList(list, payload)
        commit('listAdmin', {list: newList})
      })
    },
    // 删除管理员
    deleteAdmin ({commit, state}, payload) {
      api.deleteAdmin(payload)
      .then(({body}) => {
        if (body.errCode) {
          alert(body.msg)
          return
        }
        let {list} = state
        let newList = list.filter((item) => {
          return item.id !== payload[0]
        })
        commit('listAdmin', {list: newList})
      })
    },
    addNewRow ({commit, state}, payload) {
      let {list} = state
      if (list.length) {
        let len = list.length
        if (Object.keys(list[len - 1]).length) {
          list.push({})
          commit('listAdmin', {list: list})
        }
      } else {
        list.push({})
        commit('listAdmin', {list: list})
      }
    }
  }
}
