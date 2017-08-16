<template>
  <div class="layout">
    <div class="header">分类列表</div>
    <el-button @click="createTag">
      新建分类
    </el-button>
    <el-row :gutter="5" class="table-row">
      <el-col :md="8" :lg="8" class="table-row-item">id</el-col>
      <el-col :md="8" :lg="8" class="table-row-item">分类名</el-col>
      <el-col :md="8" :lg="8" class="table-row-item">操作</el-col>
    </el-row>
      <tag-table-row v-for="i of list" :key="i.id" :id="i.id" :name="i.name"></tag-table-row>
  </div>
</template>

<script>
import TagTableRow from './TagTableRow'
export default {
  props: [
    'list'
  ],
  components: {
    'tag-table-row': TagTableRow
  },
  methods: {
    createTag () {
      this.$store.dispatch('createTag')
    }
  }
}
</script>