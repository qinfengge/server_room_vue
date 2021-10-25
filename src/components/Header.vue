<template>
  <div style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;display: flex">
    <div style="width: 200px;padding-left: 25px;font-weight: bold;color: aqua">机房后台监测管理系统</div>
    <div style="flex: 1;text-align: center"><span id="hitokoto" style="background-image: linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cacd1 65%, #35eb93 100%);-webkit-background-clip: text; color: transparent; font-weight: bold;font-size: 22px">:D 获取中...</span></div>
    <div style="width: 120px">
      <el-dropdown>
        <span class="el-dropdown-link" style="height: 50px;display:flex;align-items: center">
          <el-avatar
              style="margin: 0 10px 0 0"
              :size="30"
              :src="user.pic"
          ></el-avatar>
            <span style="font-size: 15px;color: #8cc5ff">{{user.username}}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
            <el-dropdown-item @click="loginout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Header",
  // props: ['user'],
  methods:{
    loginout(){
      sessionStorage.clear()
      this.$router.push('/login')
    }
  },
  data(){
    return{
      user:{
        username:null,
        pic:null
      }
    }
  },
  created() {
    let userStr = sessionStorage.getItem("user")
    this.user = JSON.parse(userStr)
    if (!userStr){
      window.location.href = '/login'
    }

    request.get('https://v1.hitokoto.cn?/c=j')
        .then(res => {
          const hitokoto = document.getElementById('hitokoto')
          hitokoto.innerText = res.hitokoto
        })
        .catch(console.error)
  }
}

</script>

<style scoped>
el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 15px;
}
</style>