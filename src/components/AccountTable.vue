<template>
<div class="layout">
  <div class="header">管理员列表</div>
  <div class="table"> 
    <el-button @click="createRow">添加管理员</el-button>
    <el-row class="talbe-row">
      <el-col :md="6" :lg="6">管理员</el-col>
      <el-col :md="6" :lg="6">密码</el-col>
      <el-col :md="6" :lg="6">活动</el-col>
      <el-col :md="6" :lg="6">操作</el-col>
    </el-row>
    <table-row class="table-row" v-for="i of list" :key="i.id"
      :account="i.account"
      :password="i.password"
      :id="i.id"
      :sid="i.sid"
      :isEdit="false"
    >
    </table-row>
  </div>
  </div>
</template>

<script>
import AccountTableRow from './AccountTableRow'
export default {
  props: [
    'list'
  ],
  data () {
    return {
      newRow: false
    }
  },
  beforeUpdate () {
    console.log(this.newRow)
  },
  components: {
    'table-row': AccountTableRow
  },
  methods: {
    createRow () {
      this.$store.dispatch('addNewRow')
    }
  }
}
</script>

<style>
  
</style>
