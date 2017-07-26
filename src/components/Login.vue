<template>
  <div class="form-outer">
    <div class="form-wrap">
      <div class="form-header">登陆</div>
      <el-form ref="form" :model="form" rule="rule" label-width="80px">
        
        <el-form-item label="账号名称">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="submitForm('form')">登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import webInterface from '../webinterface/webinterface'
export default {
  name: 'login',
  data () {
    return {
      form: {
        account: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit (e) {
      console.log('submit!')
    },
    submitForm (formName) {
      this.$http.post(webInterface.adminLogin, this.form)
      .then((res) => {
        if (res.body.sid === 0) {
          this.$router.push('/accountManage')
        }
      })
    }
  }
}
</script>

<style scoped>
  .form-outer {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .form-wrap {
    display: inline-block;
    width: 400px;
    margin: auto;
    border: 1px solid #ececec;
    padding: 15px 10px 5px 0;
  }

  .form-wrap:hover {
    border-color: #8391a5;
  }

  .form-header {
    display: block;
    height: 40px;
    font-size: 18px;
  }
</style>