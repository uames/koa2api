<template>
  <div class="layout">
    <div class="header">商品列表
      <div class="search">
        <el-input
          placeholder="搜索"
          icon="search"
          v-model="key"
          :on-icon-click="handleIconClick">
        </el-input>
      </div>
    </div> 
    <div class="table">
      <el-button @click="createItem">添加商品</el-button>
      <el-row class="table-row">
        <el-col :md="9" :lg="9" class="table-row-item">商品名称</el-col>
        <el-col :md="3" :lg="3" class="table-row-item">商品价格</el-col>
        <el-col :md="3" :lg="3" class="table-row-item">商品类目</el-col>
        <el-col :md="3" :lg="3" class="table-row-item">商品状态</el-col>
        <el-col :md="3" :lg="3" class="table-row-item">商品销量</el-col>
        <el-col :md="3" :lg="3" class="table-row-item">操作</el-col>
      </el-row>
      <item-table-row v-for="i of list" :key="i.id"
      :id="i.id"
      :name="i.name"
      :price="i.price"
      :description="i.description"
      :specifications="i.specifications"
      :details="i.details"
      :tag_id="i.tag_id"
      :status="i.status"
      :buycount="i.buycount"
      :tag="i.tag"
      ></item-table-row>
    </div>
  </div>
</template>

<script>
import ItemTableRow from './ItemTableRow'
import bus from '../bus/bus'
export default {
  props: [
    'list',
    'keyword'
  ],
  data () {
    return {
      key: this.keyword
    }
  },
  components: {
    'item-table-row': ItemTableRow
  },
  methods: {
    handleIconClick () {
      let {key} = this
      this.$store.dispatch('getAllItems', {
        keyword: key
      })
    },
    createItem () {
      bus.$emit('createItem')
    }
  }
}
</script>
