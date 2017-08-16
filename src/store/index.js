import Vuex from 'vuex'
import Vue from 'vue'
import * as actions from './actions'
import * as mutations from './mutation'
import account from './modules/account'
import activity from './modules/activity'
import order from './modules/order'
import item from './modules/item'
import tag from './modules/tag'

Vue.use(Vuex)

const storeToSession = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem('state', JSON.stringify(state))
  })
}

export default new Vuex.Store({
  actions: actions,
  state: {
    isLogin: false
  },
  mutations: mutations,
  modules: {
    account: account,
    activity: activity,
    order: order,
    item: item,
    tag: tag
  },
  plugins: [
    storeToSession
  ]
})
