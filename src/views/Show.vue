<template>
  <div style="padding: 10px">
    <el-card>
      <div style="display: flex;padding: 50px">
        <!--      获取用户角色count-->
        <div id="myChart1" style="width: 400px;height: 600px"></div>
        <!--      获取设备状态count-->
        <div id="myChart2" :style="{width: '400px', height: '600px'}"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Show",
  data() {
    return {
    }
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart1 = this.$root.echarts.init(document.getElementById('myChart1'))
      let myChart2 = this.$root.echarts.init(document.getElementById('myChart2'))
      var option1 = {
        legend: {},
        tooltip: {},
        title: {
          text: '用户成分',
          left: 'center',
          top: 'center'
        },
        series: [
          {
            type: 'pie',
            data: [
            ],
            radius: ['40%', '70%']
          }
        ]
      };
      var option2 = {
        legend: {},
        tooltip: {},
        title: {
          text: '设备状态',
          left: 'center',
          top: 'center'
        },
        series: [
          {
            type: 'pie',
            data: [
            ]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      request.get("/user/getRoleCount").then(res =>{
        console.log(res.data)
        res.data.forEach(item =>{
          option1.series[0].data.push({name: item.roleEx,value: item.count})
        })
        myChart1.setOption(option1);
      })
      request.get("/devices/devicesStatusCount").then(res =>{
        console.log(res)
        res.data.forEach(item =>{
          option2.series[0].data.push({name: item.statusEx,value: item.count})
        })
        myChart2.setOption(option2)
      })
    }
  }
}
</script>

<style scoped>

</style>