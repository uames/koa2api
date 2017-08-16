<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col>
        <my-header :account="account"></my-header>
      </el-col>
    </el-row>
     <el-row :gutter="10" class="body">
      <el-col :md="4" :lg="4">
        <el-menu default-active="menu" @select="select" @close="handleClose" class="el-menu-vertical">
          <el-menu-item index="1">
            <i class="el-icon-message"></i>账号管理</el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>活动管理</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :md="20" :lg="20">
        <activity-table :list="list">
        </activity-table>
      </el-col>
    </el-row>
    <div class="modal-wrap" v-if="modal">
      <div class="modal">
        <div class="modal-header">{{!modal.id ? '创建活动' : '修改活动'}}</div>
        <el-form label-width="120px">
          <el-form-item label="活动名称">
            <el-input v-model="modal.name"></el-input>
          </el-form-item>
          <el-form-item label="活动标识">
            <el-input v-model="modal.sign"></el-input>
          </el-form-item>
          <el-form-item label="同步积分接口">
            <el-input v-model="modal.api_post"></el-input>
          </el-form-item>
          <el-form-item label="修改积分接口">
            <el-input v-model="modal.api_get"></el-input>
          </el-form-item>
          <el-form-item label="活动系统主页">
            <el-input v-model="modal.url"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitActivity">提交</el-button>
            <el-button @click="cancelModal">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>  
</template>

<script>
import Header from '../components/Header'
import ActivityTable from '../components/ActivityTable'
import {mapState} from 'vuex'
export default {
  computed: mapState({
    account: state => state.isLogin.account,
    menu: state => state.activity.menu,
    list: state => state.activity.list,
    page: state => state.activity.page,
    modal: state => state.activity.modal
  }),
  components: {
    'my-header': Header,
    'activity-table': ActivityTable
  },
  methods: {
    select (key) {
      if (key[0] === '1') {
        this.$router.push('/accountManage')
      }
    },
    handleClose () {
      console.log('hello')
    },
    cancelModal (e) {
      e.preventDefault()
      this.$store.commit('createActivity', false)
    },
    submitActivity (e) {
      e.preventDefault()
      if (this.modal.id) {
        // 有id，修改活动
        this.$store.dispatch('putActivity', this.modal)
      } else {
        this.$store.dispatch('postActivity', this.modal)
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('getActivity')
    })
  }
}
</script>

<style>
.modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background: rgba(0,0,0,0.5)
}
.modal {
  margin: auto;
  background: white;
  padding: 20px;
  min-width: 500px;
}
.modal-header {
  margin-bottom: 20px;
  font-size: 20px;
}
</style>
