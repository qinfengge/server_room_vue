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
      <el-table-column prop="did" label="设备ID"> </el-table-column>
      <el-table-column prop="type" label="设备类型" sortable>
        <template #default="scope">
          <span v-if="scope.row.type===1">温度传感器</span>
          <span v-if="scope.row.type===2">湿度传感器</span>
          <span v-if="scope.row.type===3">UPS</span>
        </template>
      </el-table-column>
      <el-table-column prop="min" label="最小值"> </el-table-column>
      <el-table-column prop="max" label="最大值" sortable> </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
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
        title="编辑预警"
        v-model="dialogVisible1"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备ID">
          <el-input v-model="form.did" style="width: 60%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="form.typeName" clearable placeholder="请选择" disabled>
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小值">
          <el-input v-model="form.min" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="最大值">
          <el-input v-model="form.max" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible1 = false">取 消</el-button>
      <el-button type="primary" @click="updateDevices">确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import request from "@/utils/request";
import { ElNotification } from 'element-plus'

export default {
  name: "Warning",
  data(){
    return {
      tableData:[],
      dialogVisible1:false,
      form:{
        typeName:null
      },
    }
  },
  methods:{
    addUser(){
      this.$router.push("/addWarning")
    },
    handleSelectionChange(val){
      this.ids = val.map(v => v.id)
    },
    deleteBatch(){
      if (!this.ids.length){
        ElMessage.error('请选择数据!')
        return
      }
      request.post("/warning/deleteBatch",this.ids).then(res =>{
        if (res.code==0){
          ElMessage.success('删除成功!')
          this.load()
        }
      })
    },
    updateDevices(){
      //修改
      request.put("/warning/update",this.form).then(res =>{
        if (res.code==0){
          this.dialogVisible1=false
          ElMessage.success('修改成功!')
          this.load() //刷新表格数据
        }else{
          ElMessage.error('失败!'+res.msg)
        }
      })
    },
    Edit(row){
      this.form = JSON.parse(JSON.stringify(row))
      if (this.form.type==1){
        this.form.typeName="温度传感器"
      }else if (this.form.type==2){
        this.form.typeName="湿度传感器"
      }else if (this.form.type==3){
        this.form.typeName="UPS"
      }
      this.dialogVisible1 = true
    },
    Delete(id){
      request.delete("/warning/delete/"+id).then(res =>{
        if (res.code==0){
          ElMessage.success('删除成功!')
          this.tempWarnId = []
          this.tempWarnIdOld = []
          this.load()
        }
      })
    },
    load(){
      request.get("/warning/list",{
        params:{
          pageSize: this.pageSize,
          pageNum: this.currentPage
        }
      }).then(res =>{
        if (res.code==0){
          console.log(res)
          this.tableData=res.data.records
          this.total=res.data.total
          this.loading = false
          this.tempWarn() //重新获取预警信息
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