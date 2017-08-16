<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

.table-row-item {
  display: inline-block;
  overflow: hidden;
  line-height: 36px;
  text-overflow: ellipsis;
  word-break: all;
  white-space: nowrap;
}

.my-span {
  height: 36px;
  line-height: 36px;
}

.layout>.table {
  margin: 20px auto;
  width: 90%;
}

.layout>.header {
  margin: 10px 10px;
  font-size: 20px;
  text-align: left;
  position: relative;
}

.layout .search {
  position: absolute;
  right: 10%;
  top: 0;
  bottom: 0;
}

.table-row {
  margin: 5px;
}

.container {
  min-height: 100%;
  display: flex;
  flex-direction: column
}

.body {
  flex: 1;
}

.el-menu-vertical {
  min-height: 600px;
}
</style>
