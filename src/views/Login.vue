<template>
  <div style="width: 100%;height: 100vh; overflow: hidden">
    <div style="width: 450px;margin: 150px auto">
      <div style="color: deepskyblue;font-size: 30px;text-align: center;padding: 30px 0">欢迎登陆</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item size="normal" prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item size="normal" prop="code">
          <div style="display: flex">
            <el-input v-model="form.ValidCode" prefix-icon="el-icon-key" style="width: 50%;" placeholder="请输入验证码"></el-input>
            <ValidCode @input="createValidCode" />
          </div>
        </el-form-item>
        <el-form-item size="normal">
          <el-button style="width: 100%" type="primary" @click="login">登陆</el-button>
        </el-form-item>
        <el-form-item><el-button type="text" @click="$router.push('/register')">前往注册 >> </el-button></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";
import ValidCode from "@/components/ValidCode";

export default {
  name: "Login",
  components: {ValidCode},
  data(){
    return{
      form:{},
      rules:{
        username:[{
          required: true, message: '请输入用户名或邮箱!', trigger: 'blur'
        }],
        password:[{
          required: true, message: '请输入密码!', trigger: 'blur'
        }]
      },
      ValidCode:''
    }
  },
  methods:{
    login(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (!this.form.ValidCode) {
            ElMessage.error("请填写验证码")
            return
          }
          if(this.form.ValidCode.toLowerCase() !== this.ValidCode.toLowerCase()) {
            ElMessage.error("验证码错误")
            console.log(this.ValidCode)
            return
          }
          request.post("/user/login",this.form).then(res =>{
            if (res.code==0){
              ElMessage.success('登陆成功!')
              sessionStorage.setItem("user",JSON.stringify(res.data)) //缓存用户信息
              console.log(res)
              this.$router.push("/")
            }else {
              ElMessage.error(res.msg)
            }
          })
        }
      })
    },
    createValidCode(data) {
      this.ValidCode = data
    },
  }
}
</script>

<style scoped>

</style>