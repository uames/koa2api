<template>
  <div class="layout">
    <div class="header">订单列表</div>
      <div class="table">
      <el-row :gutter="5" class="table-row">
        <el-col :md="6" :lg="6" class="table-header-item">商品名称</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">商品价格</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">收货人名称</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">收货人手机</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">收货地址</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">订单状态</el-col>
        <el-col :md="3" :lg="3" class="table-header-item">操作</el-col>
      </el-row>
      <order-table-row v-for="item in list" :key="item.id" 
      :id="item.id"
      :name="item.name"
      :item_id="item.item_id"
      :price="item.price"
      :user_id="item.user_id"
      :user_name="item.user_name"
      :phone="item.phone"
      :address="item.address"
      :sid="item.sid"
      :status="item.status"
      :createdAt="item.createdAt"
      :updatedAt="item.updatedAt"
      :version="item.version"
      >
      </order-table-row>
    </div>
  </div>
</template>

<script>
import OrderTableRow from './OrderTableRow'
export default {
  props: [
    'list'
  ],
  components: {
    'order-table-row': OrderTableRow
  }
}
</script>
