<template>
  <div>
<!--    定义步骤条-->
    <div style="margin: 5vh">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="选择设备类型"></el-step>
        <el-step title="选择设备"></el-step>
        <el-step title="设置预警范围"></el-step>
      </el-steps>
    </div>
<!--    定义各个步骤条内容-->
    <div>
      <el-form ref="form" :model="form" style="margin: 10vh 20vh 0 20vh;align-items: center">
      <div v-show="active == 0">
        <el-form-item label="设备类型">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div v-show="active == 1">
        <el-table
            :data="tableData"
            style="width: 100%"
            :row-class-name="tableRowClassName"
            border
            v-loading="loading"
        >
          <el-table-column prop="id" label="ID" sortable> </el-table-column>
          <el-table-column prop="dname" label="设备名称"> </el-table-column>
          <el-table-column prop="onsw" label="设备开关" sortable>
            <template #default="scope">
              <el-switch v-model="scope.row.onsw"
                         :active-value=1
                         :inactive-value=0
                         disabled
                         @change="switchChange(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="设备类型" sortable>
            <template #default="scope">
              <span v-if="scope.row.type===1">温度传感器</span>
              <span v-if="scope.row.type===2">湿度传感器</span>
              <span v-if="scope.row.type===3">UPS</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="设备状态" sortable>
            <template #default="scope">
              <span v-if="scope.row.status===0">异常</span>
              <span v-if="scope.row.status===1">正常</span>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="地点"> </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable> </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button @click="Choise(scope.row)" type="text" size="small">添加预警</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="active == 2" align-center>
        <el-form
            label-width="100px"
            :model="warnForm"
        >
          <el-form-item label="设备ID">
            <el-input v-model="warnForm.did" disabled></el-input>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="warnForm.typeName" clearable disabled placeholder="请选择">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警最小值">
            <el-input v-model="warnForm.min"></el-input>
          </el-form-item>
          <el-form-item label="预警最大值">
            <el-input v-model="warnForm.max"></el-input>
          </el-form-item>
        </el-form>
      </div>
        <!--    定义控制组件-->
        <div>
          <el-button v-if="active>0" style="margin-top: 12px" @click="pre">上一步</el-button>
          <el-button v-if="active==0" style="margin-top: 12px" @click="next">下一步</el-button>
          <el-button v-if="active==2" style="margin-top: 12px" @click="addWarn">完成</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import {ElMessage} from "element-plus";

export default {
  name: "AddWarning",
  data() {
    return {
      active: 0,
      form: {},
      warnForm:{
        typeName:null,
        did:null,
        type:null,
        min:null,
        max:null
      },
      warnFormat:{},
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
      tableData:[],
    }
  },

  methods: {
    next() {
      if (this.active++ > 2) this.active = 0
      if (this.active==1){
        request.get("/devices/typeList/"+this.form.type).then(res =>{
          if (res.code==0){
            this.tableData = res.data.records
          }
        })
      }
    },
    pre() {
      if (this.active-- < 1) this.active = 0
    },
    load(){
      request.get("/devices/list").then(res =>{
        if (res.code==0){
          console.log(res)
          this.form=res.data.records
          console.log(this.form)
        }
      })
    },
    Choise(row){
      this.active++
      this.warnForm = JSON.parse(JSON.stringify(row))
      this.warnForm.did = this.warnForm.id
      if (this.warnForm.type==1){
        this.warnForm.typeName="温度传感器"
      }else if (this.warnForm.type==2){
        this.warnForm.typeName="湿度传感器"
      }else if (this.warnForm.type==3){
        this.warnForm.typeName="UPS"
      }
    },
    addWarn(){
      this.warnFormat.did = this.warnForm.did
      this.warnFormat.type = this.warnForm.type
      this.warnFormat.min = this.warnForm.min
      this.warnFormat.max = this.warnForm.max
      request.post("/warning/add",this.warnFormat).then(res =>{
        if (res.code==0){
          ElMessage.success('添加成功!')
          this.$router.push("/warning")
        }
      })
    },
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>

</style>