<template>
  <div>
    <!--    头部-->
    <Header/>
    <!--    主体-->
    <div style="display: flex">
      <!--      侧边栏导航-->
      <Aside/>
      <!--      内容区域-->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import request from "@/utils/request";
import {ElMessage, ElNotification} from "element-plus";

export default {
  name: "Layout",
  components:{
    Aside,
    Header
  },
  data() {
    return{
      // tempWarnId:[],
      // tempWarnIdOld:[],

    }
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.tempWarn, 5000);
    })
  },
  methods:{
    // tempWarn(){
    //   request.get("/temp/warn").then(res =>{
    //     if (res.code==0){
    //       this.tempWarnIdOld = this.tempWarnId
    //       this.tempWarnId = []
    //       this.tempWarnId = res.data
    //       console.log(this.tempWarnId)
    //       console.log(this.tempWarnIdOld)
    //       let arr = [...this.tempWarnId].filter(x => [...this.tempWarnIdOld].every(y => y.id !== x.id));
    //       console.log(arr)
    //       if (this.tempWarnId.length !== this.tempWarnIdOld.length){
    //         for (let i = 0; i < arr.length; i++){
    //           (function(i) {
    //             setTimeout(function() {
    //               ElNotification({
    //                 title: '温度警告!!!',
    //                 message: "设备"+arr[i].did+"\n超出预警!!!!!"+"数据编号为"+arr[i].id+"\n温度为"+arr[i].wenData+"°C"+"\n创建时间为"+arr[i].creatTime,
    //                 type: 'error',
    //                 duration: 10000,
    //               })
    //               let userStr = sessionStorage.getItem("user")
    //               this.msg.username = JSON.parse(userStr).username
    //               this.msg.msg = "设备"+arr[i].did+"\n超出预警!!!!!"+"数据编号为"+arr[i].id+"\n温度为"+arr[i].wenData+"°C"+"\n创建时间为"+arr[i].creatTime,
    //               request.post("/msg/add",this.msg).then(res =>{
    //                 if (res.code==0){
    //                   this.loadMsg()
    //                 }
    //               })
    //             }, 5000 * i);
    //           })(i);
    //         }
    //       }
    //     }
    //   })
    // },
    tempWarn(){
      request.get("/msg/addWarnMsg").then(res =>{
        // if (res.code==0){
        //   ElMessage.success('成功!')
        // }
      })
    },
  },
  created() {
    this.tempWarn()
  }
}
</script>

<style scoped>

</style>