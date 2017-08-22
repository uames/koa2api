<template>
  <el-row class="table-row">
    <el-col :md="9" :lg="9" class="table-row-item">{{name}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{price}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{tag}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{status ? '已上架' : '已下架'}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">{{buycount}}</el-col>
    <el-col :md="3" :lg="3" class="table-row-item">
      <el-button size="small" type="primary" @click="modify">修改</el-button>
      <el-button size="small" @click="gotoDetail">详情</el-button>
    </el-col>
  </el-row>
</template>

<script>
import bus from '../bus/bus'
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
    gotoDetail () {
      let {id} = this
      bus.$emit('modifyItem', {
        id: id,
        disabled: true
      })
    },
    modify () {
      let {id} = this
      bus.$emit('modifyItem', {
        id: id,
        disabled: false
      })
    }
  }
}
</script>

