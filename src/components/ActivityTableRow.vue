<template>
  <el-row :gutter="5" class="table-row">
    <el-col :md="4" :lg="4" class="table-row-item">
      <span class="my-span">
        {{name}}
      </span>
    </el-col>
    <el-col :md="4" :lg="4" class="table-row-item">
      <span class="my-span">
        {{sign}}
      </span>
    </el-col>
    <el-col :md="4" :lg="4" class="table-row-item">
      <span class="my-span">
        {{api_get}}
      </span>
    </el-col>
    <el-col :md="4" :lg="4" class="table-row-item">
      <span class="my-span">
        {{api_post}}
      </span>
    </el-col>
    <el-col :md="4" :lg="4" class="table-row-item">
      <span class="my-span">{{url}}</span>
    </el-col>
    <el-col :md="4" :lg="4" class="table-row-item">
      <el-button @click="putActivity">编辑</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: [
    'id',
    'sign',
    'name',
    'api_post',
    'api_get',
    'url'
  ],
  methods: {
    putActivity () {
      this.$store.commit('createActivity', {
        id: this.id,
        sign: this.sign,
        name: this.name,
        api_post: this.api_post,
        api_get: this.api_get,
        url: this.url
      })
    }
  }
}
</script>

<style>

</style>

