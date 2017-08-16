<template>
  <el-menu theme="dark" mode="horizontal" @select="logout">
    <el-submenu index="1" class="el-menu-demo">
      <template slot="title">{{account}}</template>
      <el-menu-item index="1-1">退出登录</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  props: ['account'],
  methods: {
    logout () {
      this.$store.dispatch('logout')
    }
  }
}
</script>


<style scoped>
.el-menu-demo {
  margin-left: 85%;
  font-size: inherit
}
</style>

