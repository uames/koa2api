<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col>
        <my-header :account="account"></my-header>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="body">
      <el-col :md="4" :lg="4">
        <el-menu :default-active="menu" @select="select" @close="handleClose" class="el-menu-vertical">
          <el-menu-item index="1">
            <i class="el-icon-message"></i>账号管理</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>活动管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :md="20" :lg="20">
        <account-table :list="list">
        </account-table>
      </el-col>
    </el-row>
  </div>  
</template>

<script>
import Header from '../components/Header'
import AccountTable from '../components/AccountTable'
import {mapState} from 'vuex'
export default {
  computed: mapState({
    account: state => state.isLogin.account,
    page: state => state.account.page,
    keyword: state => state.account.keyword,
    list: state => state.account.list,
    menu: state => state.account.menu
  }),
  components: {
    'my-header': Header,
    'account-table': AccountTable
  },
  methods: {
    select (key, keyPath) {
      if (key[0] === '2') {
        this.$router.push('/Activity')
      }
    },
    handleClose () {

    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getAdmin', {})
      vm.$store.dispatch('getActivity', {})
    })
  }
}
</script>

<style>

</style>