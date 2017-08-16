import api from '../../api/api'
import {responseHandle, addToList, removeFromList} from '../../util/util'

export default {
  state: {
    page: 1,
    keyword: undefined,
    list: [],
    menu: '1'
  },
  mutations: {
    listOrder (state, payload) {
      state.list = payload.list
      if (payload.page) {
        state.page = payload.page
      }
      if (payload.keyword) {
        state.keyword = payload.keyword
      }
    }
  },
  actions: {
    getAllOrder ({commit, state}, payload) {
      api.getAllOrder(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listOrder', {...payload, list: body})
        })
      })
    },
    postOrder ({commit, state}, payload) {
      api.postOrder(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          let newOrder = {
            ...payload
          }
          commit('listOrder', {list: addToList(state.list, newOrder)})
        })
      })
    },
    deleteOrder ({commit, state}, payload) {
      api.deleteOrder(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listOrder', {list: removeFromList(state.list, payload[0])})
        })
      })
    },
    putOrderStatus ({commit, state}, payload) {
      api.putOrderStatus(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          let id = payload.body[0]
          let status = payload.url
          let newList = state.list.map((item) => {
            if (item.id === id) {
              item.status = status
              return item
            }
            return item
          })
          commit('listOrder', {list: newList})
        })
      })
    }
  }
}
