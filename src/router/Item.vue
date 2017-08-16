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
        <item-table :list="list" v-if="!detail">
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
                <el-option v-for="i of tag"
                :label="i.name"
                :key="i.id"
                :value="i.id"
                ></el-option>
              </el-select>
  
            </el-form-item>
            <el-form-item label="商品状态">
  
              <el-select v-model="goods.status" :disabled="detail.disabled">
                <el-option v-for="item of [{value: 0, label: '上架'},{value: 1, label: '下架'}]" :key="item.label" :value="item.value" :label="item.label"></el-option>
              </el-select>
  
            </el-form-item>
            <el-form-item label="商品销量">
  
              <el-input :disabled="true" :value="goods.buycount"></el-input>
  
            </el-form-item>
            <el-form-item v-if="!detail.disabled">
              <el-button @click="putItem">
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
export default {
  computed: {
    ...mapState({
      account: state => state.isLogin.account,
      menu: state => state.item.menu,
      page: state => state.item.page,
      keyword: state => state.item.keyword,
      status: state => state.item.status,
      detail: state => state.item.detail,
      disabled: state => state.item.detail.disabled,
      tag: state => state.tag.list
    }),
    goods () {
      let good = this.list.filter((item) => {
        if (this.detail) {
          return item.id === this.detail.id
        } else {
          return []
        }
      }).map(item => {
        item.status = Number(item.status)
        return item
      })
      return good[0]
    },
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
      this.$store.commit('gotoDetail', undefined)
    },
    putItem () {
      this.$store.dispatch('putItems', this.goods)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getAllItems', {})
      vm.$store.dispatch('getAllTag', {})
    })
  },
  beforeRouteLeave (to, from, next) {
    console.log('eh')
    this.$store.commit('gotoDetail', undefined)
    next()
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

