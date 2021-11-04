<template>
  <div style="height: 50px;line-height: 50px;border-bottom: 1px solid #ccc;display: flex">
    <div style="width: 200px;padding-left: 25px;font-weight: bold;color: aqua">机房后台监测管理系统</div>
    <div style="flex: 1;text-align: center"><span id="hitokoto" style="background-image: linear-gradient(60deg, #3d3393 0%, #2b76b9 37%, #2cacd1 65%, #35eb93 100%);-webkit-background-clip: text; color: transparent; font-weight: bold;font-size: 22px">:D 获取中...</span></div>
    <div style="width: 200px;display:flex;">
      <div>
        <el-dropdown style="margin-right: 50px">
    <span class="el-dropdown-link">
      <el-badge :value="this.msgValue" :max="99" class="item">
        <i class="el-icon-bell" style="font-size: 20px"></i>
      </el-badge>
    </span>
          <template #dropdown>
            <el-dropdown-menu style="width: 450px">
              <el-dropdown-item v-for="(value) in this.msg"><h4 style="text-align: center">创建者:{{value.username}}</h4><p>{{ value.msg }}</p></el-dropdown-item>
              <el-dropdown-item @click="clearBell" style="text-align: center;color: deepskyblue">全部清除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-dropdown>
        <span class="el-dropdown-link" style="height: 50px;align-items: center">
          <el-avatar
              style="margin: 10px 10px 0 0"
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
import {ElMessage, ElNotification} from "element-plus";

export default {
  name: "Header",
  // props: ['user'],
  mounted() {
    this.$nextTick(() => {
      setInterval(this.loadMsg, 5000);
    })
  },
  methods:{
    loginout(){
      sessionStorage.clear()
      this.$router.push('/login')
    },
    loadMsg(){
      request.get("/msg/list").then(res =>{
        this.msg = res.data
        this.$store.state.msgValue = res.data.length
        console.log(this.$store.state.msgValue)
        console.log(this.msgValue)
        const _this = this
        if (this.msgValue!==this.$store.state.msgValue){
          for (let i = 0; i < this.msg.length; i++){
            (function(i) {
              setTimeout(function() {
                if (_this.msg[i].isShow==0){
                  ElNotification({
                    title: '温度警告!!!',
                    message: _this.msg[i].msg,
                    type: 'error',
                    duration: 10000,
                  })
                }
                request.put("/msg/isShow",_this.msg[i]).then(res =>{
                })
              }, 5000 * i);
            })(i);
          }
        }
        this.msgValue = this.$store.state.msgValue
      })
    },
    clearBell(){
      request.put("/msg/clearAll").then(res =>{
        if (res.code==0){
          ElMessage.success('清除成功!')
        }
      })
    }
  },
  data(){
    return{
      user:{
        username:null,
        pic:null
      },
      msg:{
        username: 111,
        msg: 111,
        isShow: 0
      },
      msgValue: 0,
    }
  },
  created() {
    this.loadMsg()
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