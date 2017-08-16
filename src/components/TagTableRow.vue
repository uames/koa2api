<template>
  <el-row class="table-row">
    <el-col :md="8" :lg="8" class="table-row-item">{{id || "id将由系统自动生成"}}</el-col>
    <el-col :md="8" :lg="8" class="table-row-item">
      <el-input v-model="name" :disabled="disabled">
      </el-input>
    </el-col>
    <el-col :md="8" :lg="8" class="table-row-item">
      <el-button type="text" @click="putTag">
        {{ disabled ? '修改' : '完成'}}
      </el-button>
      <el-button type="text" @click="deleteTag">
        删除
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [
    'id',
    'name'
  ],
  data () {
    return {
      disabled: Boolean(this.id)
    }
  },
  methods: {
    deleteTag () {
      if (this.id) {
        this.$store.dispatch('deleteTag', [this.id])
      } else {
        this.$store.dispatch('deleteLocalTag')
      }
    },
    putTag () {
      if (!this.disabled) {
        if (this.id) {
          this.$store.dispatch('putTag', {
            id: this.id,
            name: this.name
          })
        } else {
          this.$store.dispatch('postTag', {
            name: this.name
          })
        }
      }
      this.disabled = !this.disabled
    }
  }
}
</script>
