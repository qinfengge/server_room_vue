<template>
  <div style="padding: 15px">
    <!--    功能菜单-->
    <div style="margin: 10px">
      <el-button type="primary" @click="addUser">新增</el-button>
      <el-popconfirm title="确定删除吗？" @confirm="deleteBatch">
        <template #reference>
          <el-button type="danger" size="small">批量删除</el-button>
        </template>
      </el-popconfirm>
      <el-button type="primary">导入</el-button>
      <el-button type="primary">导出</el-button>
    </div>
    <!--    搜索-->
    <div style="margin: 10px 0">
      <el-input
          style="width: 20%"
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="search"
          clearable
      >
      </el-input>
      <el-button type="primary" style="margin-left: 15px" @click="load">查询</el-button>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" sortable> </el-table-column>
      <el-table-column prop="did" label="设备ID" sortable> </el-table-column>
      <el-table-column prop="vol" label="电压/V"> </el-table-column>
      <el-table-column prop="elecurrent" label="电流/A"> </el-table-column>
      <el-table-column prop="creatTime" label="创建时间"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button @click="showDevices(scope.row.devicesList)" type="text" size="small">查看详细数据</el-button>
          <el-button @click="showEchars(scope.row.did)" type="text" size="small">查看图表</el-button>
          <el-button @click="Edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="Delete(scope.row.id)">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--    编辑dialog-->
    <el-dialog
        title="编辑Ups数据"
        v-model="dialogVisible1"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="电压">
          <el-input v-model="form.vol" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="电流">
          <el-input v-model="form.elecurrent" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible1 = false">取 消</el-button>
      <el-button type="primary" @click="updateDevices">确 定</el-button>
    </span>
      </template>
    </el-dialog>

    <!--    设备详细信息dialog-->
    <el-dialog title="设备详细信息" v-model="devicesVis" width="30%">
      <el-table :data="devicesList" stripe border>
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="设备ID" sortable> </el-table-column>
        <el-table-column prop="dname" label="设备名称"> </el-table-column>
        <el-table-column prop="type" label="设备类型">
          <template #default="scope">
            <span v-if="scope.row.type===1">温度传感器</span>
            <span v-if="scope.row.type===2">湿度传感器</span>
            <span v-if="scope.row.type===3">UPS</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="设备状态">
          <template #default="scope">
            <span v-if="scope.row.status===0">异常</span>
            <span v-if="scope.row.status===1">正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地点"> </el-table-column>
      </el-table>
    </el-dialog>

    <!--    曲线图dialog-->
    <el-dialog
        title="Ups曲线图"
        v-model="echars"
    >
      <div id="myChart" style="width: 800px;height: 500px"></div>
    </el-dialog>
    <div style="margin: 10px 0">
      <el-pagination background layout="total, prev, pager, next"
                     :page-size=pageSize
                     :total=total
                     @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import request from "@/utils/request";
export default {
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine(){
      this.option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: '电压',
            type: 'line',
            data: [],
          },
          {
            name: '电流',
            type: 'line',
            data: [],
          }
        ]
      };
    },
    showEchars(did){
      this.echars= true
      this.$nextTick(() =>{
        let myChart = this.$root.echarts.init(document.getElementById('myChart'))
        request.get("/ups/showEchars/"+did).then(res =>{
          console.log(res)
          this.option.xAxis.data=[]
          this.option.series[0].data=[]
          res.data.forEach(item =>{
            this.option.xAxis.data.push( item.creatTime)
            this.option.series[0].data.push(item.vol)
            this.option.series[1].data.push(item.elecurrent)
          })
           myChart.setOption(this.option)
        })
      })
    },
    showDevices(devices){
      this.devicesList = devices;
      // 打开dialog
      this.devicesVis = true
    },
    Edit(row){
      this.form = JSON.parse(JSON.stringify(row))
      console.log(this.form)
      this.dialogVisible1 = true
      //因为弹窗未打开时无法获取元素节点,因此this.$refs['upload']不存在
      //使用nextTick来处理未来元素
    },
    Delete(id){
      request.delete("/ups/delete/"+id).then(res =>{
        if (res.code==0){
          ElMessage.success('删除成功!')
          this.load()
        }
      })
    },
    deleteBatch(){
      if (!this.ids.length){
        ElMessage.error('请选择数据!')
        return
      }
      request.post("/ups/deleteBatch",this.ids).then(res =>{
        if (res.code==0){
          ElMessage.success('删除成功!')
          this.load()
        }
      })
    },
    handleSelectionChange(val){
      this.ids = val.map(v => v.id)
    },
    updateDevices(){
      //修改
      request.put("/ups/update",this.form).then(res =>{
        if (res.code==0){
          this.dialogVisible1=false
          ElMessage.success('修改成功!')
          this.load() //刷新表格数据
        }else{
          ElMessage.error('失败!'+res.msg)
        }
      })
    },
    load(){
      request.get("/ups/list",{
        params:{
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          search: this.search
        }
      }).then(res =>{
        console.log(res)
        if (res.code==0){
          this.tableData=res.data.records
          this.total=res.data.total
          this.loading = false
        }
      })
    },
    handleCurrentChange(pageNum){
      this.currentPage=pageNum
      this.load()
    },
  },
  data() {
    return {
      form:{},
      search:'',
      currentPage:1,
      pageSize:3,
      total:null,
      devicesVis: false,
      dialogVisible1: false,
      echars: false,
      tableData: [],
      devicesList: [],
      ids:[],
      option:{},
      options: [
        {
          value: '1',
          label: '温度传感器',
        },
        {
          value: '2',
          label: '湿度传感器',
        },
        {
          value: '3',
          label: 'UPS',
        }
      ],
      loading: true,
    }
  },
  created() {
    this.load()
  }
}
</script>
<style>
body {
  margin: 0;
}
.el-table .warning-row {
  --el-table-tr-background-color: var(--el-color-warning-lighter);
}
.el-table .success-row {
  --el-table-tr-background-color: var(--el-color-success-lighter);
}
</style>
