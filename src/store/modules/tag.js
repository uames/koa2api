import api from '../../api/api'
import {responseHandle, addToList, removeFromList} from '../../util/util'

export default {
  state: {
    list: [],
    menu: '3'
  },
  mutations: {
    listTag (state, payload) {
      state.list = payload.list
    }
  },
  actions: {
    getAllTag ({commit, state}, payload) {
      api.getTag()
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listTag', {list: body})
        })
      })
    },
    postTag ({commit, state, rootState}, payload) {
      api.postTag(payload)
      .then(({body}) => {
        var t = Date.now()
        responseHandle(body, () => {
          let newTag = {
            id: body.id,
            ...payload,
            sid: rootState.isLogin.sid,
            createdAt: t,
            updatedAt: t,
            version: 0
          }
          let newList = addToList(state.list, newTag)
          commit('listTag', {list: newList})
        })
      })
    },
    putTag ({commit, state, rootState}, payload) {
      api.putTag(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          let newList = state.list.map((item) => {
            if (item.id === payload.id) {
              item.name = payload.name
            }
            return item
          })
          commit('listTag', {list: newList})
        })
      })
    },
    deleteTag ({commit, state}, payload) {
      api.deleteTag(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listTag', {list: removeFromList(state.list, payload)})
        })
      })
    },
    createTag ({commit, state}, payload) {
      let {list} = state
      if (!list.length || Object.keys(list[list.length - 1]).length) {
        list.push({})
        commit('listTag', {list: list})
      }
    },
    deleteLocalTag ({commit, state}, payload) {
      let {list} = state
      list.pop()
      commit('listTag', {list: list})
    }
  }
}
