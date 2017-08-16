<template>
<div class="layout">
  <div class="header">活动列表</div>
  <el-button @click="createActivity">创建活动</el-button>
  <div class="table">
    <el-row :gutter="5" class="table-row">
      <el-col :md="4" :lg="4" class="table-header-item">活动名称</el-col>
      <el-col :md="4" :lg="4" class="table-header-item">活动标识</el-col>
      <el-col :md="4" :lg="4" class="table-header-item">同步积分接口</el-col>
      <el-col :md="4" :lg="4" class="table-header-item">修改积分接口</el-col>
      <el-col :md="4" :lg="4" class="table-header-item">活动系统主页</el-col>
      <el-col :md="4" :lg="4" class="table-header-item">操作</el-col>
    </el-row>
    <activity-table-row v-for="i of list" :key="i.id"
      :id="i.id"
      :name="i.name"
      :sign="i.sign"
      :api_get="i.api_get"
      :api_post="i.api_post"
      :url="i.url"
    >
    </activity-table-row>
  </div>
</div>
</template>

<script>
import ActivityTableRow from './ActivityTableRow'
export default {
  props: [
    'list'
  ],
  computed: {

  },
  components: {
    'activity-table-row': ActivityTableRow
  },
  methods: {
    createActivity () {
      this.$store.commit('createActivity', {})
    }
  }
}
</script>

<style>
 
</style>

