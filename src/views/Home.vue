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
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="id" label="ID" sortable> </el-table-column>
      <el-table-column prop="pic" label="头像">
        <template #default="scope">
          <el-image
              style="width: 75px; height: 75px"
              :src="scope.row.pic"
              :preview-src-list="[scope.row.pic]"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="role" label="角色">
      <template #default="scope">
        <span v-if="scope.row.role===1">管理员</span>
        <span v-if="scope.row.role===2">普通用户</span>
      </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="sex" label="性别"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>

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
    <el-dialog
        title="新增用户"
        v-model="dialogVisible"
        width="30%"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="form.username" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.passwd" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.sex" label="男" border>男</el-radio>
          <el-radio v-model="form.sex" label="女" border>女</el-radio>
          <el-radio v-model="form.sex" label="保密" border>保密</el-radio>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" style="width: 60%;"></el-input>
        </el-form-item>
        <el-form-item label="设为管理员">
          <el-radio v-model="form.role" :label="1" border>管理员</el-radio>
          <el-radio v-model="form.role" :label="2" border>普通用户</el-radio>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
              ref="upload"
              class="upload-demo"
              action="http://localhost:8181/file/upload/"
              :on-success="handleAvatarSuccess"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="saveUser">确 定</el-button>
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
    tableRowClassName({row, rowIndex}) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    Edit(row){
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
      //因为弹窗未打开时无法获取元素节点,因此this.$refs['upload']不存在
      //使用nextTick来处理未来元素
      this.$nextTick(() =>{
        this.$refs['upload'].clearFiles()
      })
    },
    Delete(id){
      request.delete("/user/delete/"+id).then(res =>{
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
      request.post("/user/deleteBatch",this.ids).then(res =>{
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
      this.$refs['upload'].clearFiles()
    },
    saveUser(){
      if (this.form.id==null){
        //新增
        request.post("/user/save",this.form).then(res =>{
          // console.log(res)
          if (res.code==0){
            this.dialogVisible=false
            ElMessage.success('添加成功!')
            this.load()
          }else {
            ElMessage.error('失败!'+res.msg)
          }
        })
      }else {
        //修改
        request.put("/user/update",this.form).then(res =>{
          if (res.code==0){
            this.dialogVisible=false
            ElMessage.success('修改成功!')
            this.load() //刷新表格数据
          }else{
            ElMessage.error('失败!'+res.msg)
          }
        })
      }

    },
    load(){
      request.get("/user/list",{
        params:{
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          search: this.search
        }
      }).then(res =>{
        if (res.code==0){
          this.tableData=res.data.records
          this.total=res.data.total
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
      pageSize:3,
      total:null,
      dialogVisible: false,
      tableData: null,
      ids:[]
    }
  },
  created() {
    this.load()
  }
}
</script>
<style>
.el-table .warning-row {
  --el-table-tr-background-color: var(--el-color-warning-lighter);
}
.el-table .success-row {
  --el-table-tr-background-color: var(--el-color-success-lighter);
}
</style>
