<template>
  <el-row :gutter="5" class="table-row">
    <el-col :gutter="10" :md="6">
      <el-input type="text" :disabled="disabled" v-model="newAccount"/>
    </el-col>
    <el-col :gutter="10" :md="6">
      <el-input type="text" :disabled="disabled" v-model="newPassword"/>
    </el-col>
    <el-col :gutter="10" :md="6">
      <el-select v-model="newSid" :disabled="disabled">
        <el-option v-for="act of activity" :key="act.id" :value="act.id" :label="act.name">
        </el-option>
      </el-select>
    </el-col>
    <el-col :gutter="10" :md="6">
      <el-button @click="changeEditable">{{ !disabled ? '完成' : '编辑'}}</el-button>
      <el-button @click="deleteAccount">删除</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [
    'id',
    'account',
    'password',
    'sid',
    'createdAt',
    'updatedAt',
    'version',
    'isEdit'
  ],
  data () {
    return {
      editable: this.isEdit,
      newAccount: this.account,
      newPassword: this.password,
      newSid: this.sid
    }
  },
  computed: {
    disabled: function () {
      if (this.id) {
        return !this.editable
      } else {
        return this.editable
      }
    },
    activity: function () {
      return this.$store.state.activity.list
    }
  },
  methods: {
    changeEditable () {
      if (!this.disabled) {
        if (this.id) {
          this.$store.dispatch('putAdmin', {
            id: this.id,
            account: this.newAccount,
            password: this.newPassword,
            sid: this.newSid
          })
        } else {
          this.$store.dispatch('postAdmin', {
            account: this.newAccount,
            password: this.newPassword,
            sid: this.newSid
          })
        }
      }
      this.editable = !this.editable
    },
    deleteAccount () {
      this.$store.dispatch('deleteAdmin', [this.id])
    }
  }
}
</script>

<style>

</style>


