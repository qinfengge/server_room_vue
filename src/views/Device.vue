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
      <el-table-column prop="dname" label="设备名称"> </el-table-column>
      <el-table-column prop="onsw" label="设备开关" sortable>
        <template #default="scope">
        <el-switch v-model="scope.row.onsw"
                   :active-value=1
                   :inactive-value=0
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
          <el-button @click="AddData(scope.row)" type="text" size="small">在此节点添加数据</el-button>
          <el-button @click="Edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="Delete(scope.row.id)">
            <template #reference>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        title="新增用户"
        v-model="dialogVisible"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="form.dname" style="width: 60%;"></el-input>
        </el-form-item>
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
        <el-form-item label="地点">
          <el-input v-model="form.location" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveUser">确 定</el-button>
    </span>
      </template>
    </el-dialog>
<!--    编辑dialog-->
    <el-dialog
        title="编辑用户"
        v-model="dialogVisible1"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备名称">
          <el-input v-model="form.dname" style="width: 60%;"></el-input>
        </el-form-item>
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
        <el-form-item label="设备状态">
          <el-radio v-model="form.status" :label="1" border>正常</el-radio>
          <el-radio v-model="form.status" :label="0" border>异常</el-radio>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible1 = false">取 消</el-button>
      <el-button type="primary" @click="updateDevices">确 定</el-button>
    </span>
      </template>
    </el-dialog>

<!--    新增温度数据-->
    <el-dialog
        title="添加温度数据"
        v-model="tempVis"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备ID">
          <el-input v-model="this.did"  style="width: 60%;" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="温度">
          <el-input v-model="form.wenData" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="tempVis = false">取 消</el-button>
      <el-button type="primary" @click="digAddData">确 定</el-button>
    </span>
      </template>
    </el-dialog>

<!--    新增湿度数据-->
    <el-dialog
        title="编辑温度数据"
        v-model="moisVis"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备ID">
          <el-input v-model="this.did"  style="width: 60%;" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="温度">
          <el-input v-model="form.shiData" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="moisVis = false">取 消</el-button>
      <el-button type="primary" @click="digAddData">确 定</el-button>
    </span>
      </template>
    </el-dialog>
<!--    新增Ups数据-->
    <el-dialog
        title="编辑Ups数据"
        v-model="upsVis"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="设备ID">
          <el-input v-model="this.did"  style="width: 60%;" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="电压">
          <el-input v-model="form.vol" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="电流">
          <el-input v-model="form.elecurrent" style="width: 60%;"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="upsVis = false">取 消</el-button>
      <el-button type="primary" @click="digAddData">确 定</el-button>
    </span>
      </template>
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
  methods: {
    AddData(row){
      this.did = row.id
      this.flag = row.type
      if (this.flag===1){
        this.tempVis = true
      }else if (this.flag===2){
        this.moisVis = true
      }else if (this.flag===3){
        this.upsVis = true
      }
    },
    switchChange(row){
      request.put("/devices/update",row).then(res =>{
        if (res.code==0){
          ElMessage.success('开关成功!')
          this.load() //刷新表格数据
        }else{
          ElMessage.error('开关失败!'+res.msg)
        }
      })
    },
    digAddData(){
      if (this.flag===1){
        this.form.did = this.did
        request.post("/temp/add",this.form).then(res =>{
          console.log(this.form)
          // console.log(res)
          if (res.code==0){
            this.tempVis=false
            ElMessage.success('添加成功!')
            this.load()
          }else {
            ElMessage.error('失败!'+res.msg)
          }
        })
      }else if (this.flag===2){
        this.form.did = this.did
        request.post("/mois/add",this.form).then(res =>{
          console.log(this.form)
          // console.log(res)
          if (res.code==0){
            this.moisVis=false
            ElMessage.success('添加成功!')
            this.load()
          }else {
            ElMessage.error('失败!'+res.msg)
          }
        })
      }else if (this.flag===3){
        this.form.did = this.did
        request.post("/ups/add",this.form).then(res =>{
          console.log(this.form)
          // console.log(res)
          if (res.code==0){
            this.upsVis=false
            ElMessage.success('添加成功!')
            this.load()
          }else {
            ElMessage.error('失败!'+res.msg)
          }
        })
      }
    },
    tableRowClassName({row, rowIndex}) {
      if (row.status === 1) {
        return 'success-row'
      } else if (row.status === 0) {
        return 'warning-row'
      }
      return ''
    },
    Edit(row){
      this.form = JSON.parse(JSON.stringify(row))
      console.log(this.form)
      this.dialogVisible1 = true
      //因为弹窗未打开时无法获取元素节点,因此this.$refs['upload']不存在
      //使用nextTick来处理未来元素
    },
    Delete(id){
      request.delete("/devices/delete/"+id).then(res =>{
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
      request.post("/devices/deleteBatch",this.ids).then(res =>{
        if (res.code==0){
          ElMessage.success('删除成功!')
          this.load()
        }
      })
    },
    handleSelectionChange(val){
      this.ids = val.map(v => v.id)
    },
    addUser(){
      this.dialogVisible=true
      this.form={}
    },
    saveUser(){
        //新增
        request.post("/devices/add",this.form).then(res =>{
          // console.log(res)
          if (res.code==0){
            this.dialogVisible=false
            ElMessage.success('添加成功!')
            this.load()
          }else {
            ElMessage.error('失败!'+res.msg)
          }
        })
    },
    updateDevices(){
      //修改
      request.put("/devices/update",this.form).then(res =>{
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
      request.get("/devices/list",{
        params:{
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          search: this.search
        }
      }).then(res =>{
        if (res.code==0){
          console.log(res)
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
    handleAvatarSuccess(res){
      this.form.pic = res.data
    }
  },
  data() {
    return {
      form:{},
      search:'',
      currentPage:1,
      pageSize:5,
      total:null,
      dialogVisible: false,
      dialogVisible1: false,
      tempVis: false,
      moisVis: false,
      upsVis: false,
      // 用于标记devices type,调用不同方法
      flag: '',
      // 把did传过去
      did:'',
      tableData: null,
      ids:[],
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
