const host = location.host.match('localhost') ? '/api' : ''

let url = {
  adminLogin: '/admin/login',
  adminLogout: '/admin/logout',
  admin: '/admin'
}

let webInterface = {}

// 添加host
for (let key in url) {
  webInterface[key] = host + url[key]
}

export default webInterface
