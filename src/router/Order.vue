<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col>
        <my-header :account="account"></my-header>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="body">
      <el-col :md="4" :lg="4">
        <el-menu :default-active="menu" @select="switchMenu" class="el-menu-vertical">
          <el-menu-item index="1">
            <i class="el-icon-message"></i>订单管理</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>商品管理</el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>分类管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :md="20" :lg="20">
        <order-table :list="list">
        </order-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Header from '../components/Header'
import OrderTable from '../components/OrderTable'
export default {
  computed: mapState({
    account: state => state.isLogin.account,
    menu: state => state.order.menu,
    list: state => state.order.list
  }),
  components: {
    'my-header': Header,
    'order-table': OrderTable
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getAllOrder', {})
    })
  },
  methods: {
    switchMenu (key) {
      switch (key) {
        case '2':
          this.$router.push('/Item')
          break
        case '3':
          this.$router.push('/Tag')
          break
      }
    }
  }
}
</script>


