<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col>
        <my-header :account="account"></my-header>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="body" type="flex">
      <el-col :md="4" :lg="4">
        <el-menu :default-active="menu" @select="switchMenu" class="el-menu-vertical">
          <el-menu-item index="1">
            <i class="el-icon-message"></i>订单管理</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>商品管理</el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>分类管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :md="20" :lg="20">
        <item-table :list="list" v-if="!detail" :keyword="keyword" v-on:modify="modify">
        </item-table>
        <div class="detail" v-if="detail">
          <div class="bread-header">
            <a href="javascript:void(0)" @click="goback">商品列表</a> > 商品{{goods.name}}
          </div>
          <el-form label-width="100px" class="my-form">
            <el-form-item label="商品名称">
              <el-input :disabled="detail.disabled" v-model="goods.name">
              </el-input>
            </el-form-item>
            <el-form-item label="商品详情">
              <el-input type="textarea" autosize v-model="goods.details" :disabled="detail.disabled"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input type="textarea" autosize v-model="goods.description" :disabled="detail.disabled"></el-input>
            </el-form-item>
            <el-form-item label="商品规格">
              <div>
                {{goods.specifications}}
              </div>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input-number v-model="goods.price" :disabled="detail.disabled"></el-input-number>
            </el-form-item>
            <el-form-item label="商品类目">
              <el-select v-model="goods.tag_id" :disabled="detail.disabled">
                <el-option v-for="i in tag"
                :label="i.name"
                :key="i.id"
                :value="i.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品状态">
              <el-select v-model="goods.status" :disabled="detail.disabled">
                <el-option v-for="item in [{value: 0, label: '上架'},{value: 1, label: '下架'}]" :key="item.label" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品销量">
              <el-input :disabled="true" :value="goods.buycount"></el-input>
            </el-form-item>
            <el-form-item v-if="!detail.disabled">
              <el-button @click="submitItem">
                提交
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Header from '../components/Header'
import {mapState, mapGetters} from 'vuex'
import ItemTable from '../components/ItemTable'
import bus from '../bus/bus'
export default {
  data () {
    return {
      goods: undefined,
      detail: undefined
    }
  },
  computed: {
    ...mapState({
      account: state => state.isLogin.account,
      menu: state => state.item.menu,
      page: state => state.item.page,
      keyword: state => state.item.keyword,
      status: state => state.item.status,
      disabled: state => state.item.detail.disabled,
      tag: state => state.tag.list
    }),
    ...mapGetters({
      list: 'listGetter'
    })
  },
  components: {
    'my-header': Header,
    'item-table': ItemTable
  },
  methods: {
    switchMenu (key) {
      switch (key) {
        case '1':
          this.$router.push('/Order')
          break
        case '3':
          this.$router.push('/Tag')
      }
    },
    goback () {
      this.detail = undefined
    },
    modify (id) {
      let {list} = this
      this.goods = list.filter(item => {
        return item.id === id
      })[0]
    },
    submitItem () {
      if (this.detail.id) {
        this.$store.dispatch('putItems', this.goods)
      } else {
        this.$store.dispatch('postItems', this.goods)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getAllItems', {})
      vm.$store.dispatch('getAllTag', {})
    })
  },
  beforeCreate () {
    var that = this
    bus.$on('modifyItem', function (obj) {
      that.goods = that.$store.state.item.list.filter((item) => {
        return item.id === obj.id
      }).map((item) => {
        item.status = Number(item.status)
        return item
      })[0]
      that.detail = obj
    })
    bus.$on('createItem', function () {
      that.goods = {
        status: 0,
        tag_id: 1,
        price: 0
      }
      that.detail = {
        disabled: false
      }
    })
  }
}

</script>

<style>
.bread-header {
  text-align: left;
  padding-left: 20px;
  font-size: 20px;
  height: 60px;
  line-height: 60px;
}

.my-form {
  max-width: 700px;
  margin: auto;
}

a {
  color: inherit;
}

</style>

