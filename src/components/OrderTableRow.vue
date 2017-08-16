<template> 
  <el-row :gutter="5" class="table-row">
    <el-col :md="6" :lg="6" class="table-row-item">
      <span class="my-span">
        {{name}}
      </span>
      </el-col>
    <el-col :md="3" :lg="3" class="table-row-item">
      <span class="my-span">{{price}}
      </span>
      </el-col>
    <el-col :md="3" :lg="3" class="table-row-item"><span class="my-span">{{user_name}}</span></el-col>
    <el-col :md="3" :lg="3" class="table-row-item"><span class="my-span">{{phone}}</span></el-col>
    <el-col :md="3" :lg="3" class="table-row-item"><span class="my-span">{{address}}</span></el-col>
    <el-col :md="3" :lg="3" class="table-row-item">
      <el-select v-model="newStatus" :disabled="disabled">
        <el-option :value="-1" label="已删除" :disabled="true"></el-option>
        <el-option :value="0" label="已取消" :disabled="true"></el-option>
        <el-option :value="1" label="待发货" ></el-option>
        <el-option :value="2" label="已发货"></el-option>
        <el-option :value="3" label="已完成"></el-option>
      </el-select>
    </el-col>
    <el-col :md="3" :lg="3" class="table-row-item">
      <el-button type="small" @click="changeStatus">{{ this.disabled ? '修改': '完成'}}</el-button>
      <el-button type="small" @click="deleteOrder">删除</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [
    'id',
    'item_id',
    'name',
    'price',
    'user_id',
    'user_name',
    'phone',
    'address',
    'sid',
    'status',
    'createdAt',
    'updatedAt',
    'version'
  ],
  data () {
    return {
      newStatus: Number(this.status),
      disabled: true
    }
  },
  methods: {
    deleteOrder () {
      this.$store.dispatch('deleteOrder', [this.id])
    },
    changeStatus () {
      if (!this.disabled) {
        this.$store.dispatch('putOrderStatus', {
          url: this.newStatus,
          body: [this.id]
        })
      }
      this.disabled = !this.disabled
    }
  }
}
</script>

