// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'element-ui/lib/theme-default/index.css'
import VueResource from 'vue-resource'
import {
  Menu,
  Submenu,
  MenuItem,
  Input,
  InputNumber,
  Select,
  Option,
  OptionGroup,
  Button,
  Form,
  FormItem,
  Icon,
  Row,
  Col
} from 'element-ui'

Vue.config.productionTip = false

Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Select)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)

Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})

window.onload = () => {
  if (localStorage.getItem('state')) {
    store.replaceState(JSON.parse(localStorage.getItem('state')))
  }
}
