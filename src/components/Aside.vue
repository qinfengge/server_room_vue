<template>
  <div>
    <el-menu
        style="width: 200px; height: calc(100vh - 150px)"
        :default-active="path"
        router
        :default-openeds="['1','2','3']"
        class="el-menu-vertical-demo"
    >
      <el-sub-menu index="1" v-if="user.role===1">
        <template #title>
          <i class="el-icon-s-tools"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/show">系统概览</el-menu-item>
        <el-menu-item index="/manager">用户管理</el-menu-item>
        <el-menu-item index="/device">设备管理</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="2" v-if="user.role===1">
        <template #title>
          <i class="el-icon-star-on"></i>
          <span>数据管理</span>
        </template>
        <el-menu-item index="/temp">温度传感器</el-menu-item>
        <el-menu-item index="/mois">湿度传感器</el-menu-item>
        <el-menu-item index="/ups">UPS</el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="3" v-if="user.role===1">
        <template #title>
          <i class="el-icon-star-on"></i>
          <span>一些有趣的</span>
        </template>
        <el-menu-item index="/video">视频</el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div style="display: flex">
      <aplayer showLrc
               mini
               volume="0.1"
               :music="{
      title: 'Lemon',
      artist: '米津玄師',
      src: 'http://music.163.com/song/media/outer/url?id=536622304.mp3',
      pic: 'http://p1.music.126.net/r0TgUXBEEmMG48KSsEa_mg==/109951163143657970.jpg?param=130y130'
               }"
               :list="[
                   {
      title: '起风了',
      artist: '林俊杰',
      src: require('../../public/林俊杰翻唱起风了.mp3'),
      },
      {
        title: 'Lemon',
      artist: '米津玄師',
      src: 'http://music.163.com/song/media/outer/url?id=536622304.mp3',
      pic: 'http://p1.music.126.net/r0TgUXBEEmMG48KSsEa_mg==/109951163143657970.jpg?param=130y130'
      }
               ]"
      />
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import Aplayer from "vue3-aplayer";

export default {
  name: "Aside",
  components: {
    Aplayer
  },
  data(){
    return{
      path:this.$route.path,
      user:{}
    }
  },
  created() {
    let userStr = sessionStorage.getItem("user") || "{}"
    this.user = JSON.parse(userStr)
    //本地缓存不可靠,要使用服务器校验
    request.get("/user/checkUserRole/" + this.user.id).then(res =>{
      if (res.code===0){
        this.user = res.data
      }
    })
  }
}
</script>

<style scoped>

</style>