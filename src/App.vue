<template>
  <div>
    <router-view/>
    <el-affix position="bottom" :offset="10">
      <p style="text-align: center">created by lizhiao on 2021.10.17 </p>
    </el-affix>
  </div>
</template>

<style>

</style>
<script>
export default {
  name:'App',
}
</script>
