import Vue from 'vue'
import Router from 'vue-router'
const Login = resolve => require(['./Login.vue'], resolve)
const AccountManage = resolve => require(['./AccountManage.vue'], resolve)
const Activity = resolve => require(['./Activity.vue'], resolve)
const Order = resolve => require(['./Order.vue'], resolve)
const Item = resolve => require(['./Item'], resolve)
const Tag = resolve => require(['./Tag'], resolve)

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: to => {
        return '/login'
      }
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/AccountManage',
      name: 'AccountManage',
      component: AccountManage
    }, {
      path: '/Activity',
      name: 'Activity',
      component: Activity
    }, {
      path: '/Order',
      name: 'Order',
      component: Order
    }, {
      path: '/Item',
      name: 'Item',
      component: Item
    }, {
      path: '/Tag',
      name: 'Tag',
      component: Tag
    }
  ]
})
