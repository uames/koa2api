<template>
  <el-row class="table-row">
    <el-col :md="9" :lg="9" class="table-row-item">{{name}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{price}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{tag}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{status ? '已上架' : '已下架'}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{buycount}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">
      <el-button size="small" type="primary" @click="gotoChange">修改</el-button>
      <el-button size="small" @click="gotoDetail">详情</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [
    'id',
    'name',
    'price',
    'description',
    'specifications',
    'details',
    'tag_id',
    'status',
    'buycount',
    'tag'
  ],
  methods: {
    // 前往详情页
    gotoDetail () {
      console.log(this.$store)
      this.$store.commit('gotoDetail', {
        id: this.id,
        disabled: true
      })
    },
    // 前往修改页
    gotoChange () {
      this.$store.commit('gotoDetail', {
        id: this.id,
        disabled: false
      })
    }
  }
}
</script>

