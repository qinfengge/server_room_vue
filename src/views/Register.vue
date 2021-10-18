<template>
  <div style="width: 100%;height: 100vh;overflow: hidden">
    <div style="width: 450px;margin: 150px auto">
      <div style="color: deepskyblue;font-size: 30px;text-align: center;padding: 30px 0">欢迎注册</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item size="normal" prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="passwd">
          <el-input v-model="form.passwd" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="confirm">
          <el-input v-model="form.confirm" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item size="normal">
          <el-button style="width: 100%" type="primary" @click="register">注册</el-button>
        </el-form-item>
        <el-form-item><el-button type="text" @click="$router.push('/login')">已有账号? 前往登陆 >> </el-button></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "Register",
  data(){
    return{
      form:{},
      rules:{
        username:[{
          required: true, message: '请输入用户名!', trigger: 'blur'
        }],
        passwd:[{
          required: true, message: '请输入密码!', trigger: 'blur'
        }],
        confirm:[{
          required: true, message: '请输入确认密码!', trigger: 'blur'
        }]
      }
    }
  },
  methods:{
    register(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.confirm!==this.form.passwd){
            ElMessage.error("2次密码输入不一致!")
            return
          }
          request.post("/user/register",this.form).then(res =>{
            if (res.code==0){
              ElMessage.success('注册成功!')
              this.$router.push("/login")
            }else {
              ElMessage.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>