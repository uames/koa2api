export function loginSuccess (state, payload) {
  state.isLogin = payload
}

export function logoutSuccess (state) {
  state.isLogin = false
}
