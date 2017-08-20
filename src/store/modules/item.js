import api from '../../api/api'
import {addToList, responseHandle, updateList} from '../../util/util'

export default {
  state: {
    page: 1,
    keyword: undefined,
    list: [],
    menu: '2',
    detail: undefined
  },
  getters: {
    listGetter (state, getters, rootState) {
      return state.list.map((item) => {
        item.tag = rootState.tag.list.filter((tag) => {
          return tag.id === item.tag_id
        })[0].name
        return item
      })
    }
  },
  mutations: {
    listItems (state, payload) {
      state.list = payload.list
      if (payload.page) {
        state.page = payload.page
      }
      if (payload.keyword || payload.keyword === '') {
        state.keyword = payload.keyword
      }
    },
    gotoDetail (state, payload) {
      state.detail = payload
    }
  },
  actions: {
    getAllItems ({commit, state}, payload) {
      api.getAllItems(payload)
        .then(({body}) => {
          responseHandle(body, () => {
            commit('listItems', { ...payload, list: body })
            commit('gotoDetail', undefined)
          })
        })
    },
    postItems ({commit, state}, payload) {
      api.postItems(payload)
        .then(({ body }) => {
          responseHandle(body, () => {
            let { list } = state
            commit('listItems', {list: addToList(list, payload)})
          })
        })
    },
    putItemsStatus ({commit, state}, payload) {
      api.putItems(payload)
        .then(({body}) => {
          responseHandle(body, () => {
            let {list} = state
            let newList = list.map((item) => {
              if (item.id in payload) {
                item.status = payload.url
              }
              return item
            })
            commit('listItems', {list: newList})
          })
        })
    },
    deleteItems ({commit, state}, payload) {
      api.deleteItems(payload)
        .then(({body}) => {
          responseHandle(body, () => {
            let {list} = state
            let newList = list.filter((item) => {
              return !(item.id in payload)
            })
            commit('listItems', {list: newList})
          })
        })
    },
    putItems ({commit, state}, payload) {
      api.putItems(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          let {list} = state
          commit('listItems', {list: updateList(list, payload)})
          commit('gotoDetail', undefined)
        })
      })
    }
  }
}
