<template>
  <div style="width: 100%;height: 100vh;overflow: hidden">
    <div style="width: 450px;margin: 150px auto">
      <div style="color: deepskyblue;font-size: 30px;text-align: center;padding: 30px 0">欢迎注册</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item size="normal" prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="email">
          <el-input v-model="form.email" prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" show-password></el-input>
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
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (!value) {
        return callback(new Error('邮箱不能为空'))
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }, 100)
    }
    return{
      form:{},
      rules:{
        username:[{
          required: true, message: '请输入用户名!', trigger: 'blur'
        }],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ],
        password:[{
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
          if (this.form.confirm!==this.form.password){
            ElMessage.error("2次密码输入不一致!")
            return
          }
          request.post("/user/register",this.form).then(res =>{
            if (res.code==0){
              ElMessage.success('注册成功!')
              // this.$router.push("/login")
              request.post('/user/login',this.form).then(res =>{
                if (res.code==0){
                  ElMessage.success('登陆成功!')
                  sessionStorage.setItem("user",JSON.stringify(res.data)) //缓存用户信息
                  console.log(res)
                  this.$router.push("/")
                }
              })
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