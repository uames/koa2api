import api from '../api/api'
import router from '../router'

export const login = ({ commit, state }, params) => {
  api.adminLogin(params)
  .then(({body}) => {
    if (body.errCode) {
      alert('出错！')
      return
    }
    let payload = {
      sid: body.sid,
      account: params.account
    }
    commit('loginSuccess', payload)
    if (!body.sid) {
      router.push('/AccountManage')
    } else {
      router.push('/order')
    }
    return
  })
}

export const logout = ({ commit }, params) => {
  api.adminLogout()
  .then(({body}) => {
    if (body.errCode) {
      alert('出错')
      return
    }
    commit('logoutSuccess')
    router.push('/login')
  })
}
