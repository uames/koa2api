import api from '../../api/api'
import {updateList, addToList, responseHandle} from '../../util/util'

export default {
  state: {
    page: 1,
    keyword: undefined,
    list: [],
    modal: false,
    menu: '2'
  },
  mutations: {
    listActivity (state, payload) {
      state.list = payload.list
      if (payload.page) {
        state.page = payload.page
      }
      if (payload.keyword) {
        state.keyword = payload.keyword
      }
      state.modal = false
    },
    createActivity (state, payload) {
      state.modal = payload
    }
  },
  actions: {
    getActivity ({commit}, payload) {
      api.getActivity(payload)
      .then(({body}) => {
        if (body.errCode) {
          alert(body.msg)
          return
        }
        commit('listActivity', {list: body, ...payload})
      })
    },
    postActivity ({commit, state}, payload) {
      api.postActivity(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listActivity', {list: addToList(state.list, { ...payload, id: body.id })})
        })
      })
    },
    putActivity ({commit, state}, payload) {
      api.putActivity(payload)
      .then(({body}) => {
        responseHandle(body, () => {
          commit('listActivity', {list: updateList(state.list, payload)})
        })
      })
    }
  }
}
