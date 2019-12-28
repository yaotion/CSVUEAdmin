<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>

      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleImport">
        Import
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleContentUpdateBat">
        Update Bat
      </el-button>
    </div>

    <div id="tablePrint">
      <el-row :gutter="24">
        <el-col :span="7">
          <el-table
            id="tabData"
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            size="mini"
            fit
            highlight-current-row
            @row-click="actClick"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <div>
                  <el-button type="primary" size="mini" @click="handleActUpdate(props.row)">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleActDelete(props.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="" prop="RetailTypeName" align="left" :resizable="false">
              <template slot-scope="scope2">
                <span>{{ scope2.row.RetailTypeID + "--" + scope2.row.RetailTypeName }}</span>
              </template>
              <template slot="header">
                <div style="float:left;margin-left: 0px; padding-left:0px;color:blue;font-size:14px" class="filter-item">
                  <span>散户级别</span>
                </div>
                <div style="float:right">
                  <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="text" icon="el-icon-edit" @click="handleActAdd()">
                    添加级别
                  </el-button>
                </div>
              </template>
            </el-table-column>

          </el-table></el-col>
        <el-col :span="17">
          <el-table v-loading="listContentLoading" border :data="listContent" size="mini" fit highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column type="selection" prop="Checked" width="55" />
            <el-table-column label="卡号" prop="CardNo" align="center" width="160" :resizable="false" />
            <el-table-column label="持卡人" prop="HolderName" align="center" width="80" :resizable="false" />
            <el-table-column label="电话" prop="Mobile" align="center" width="120" :resizable="false" />
            <el-table-column label="级别编号" prop="RetailTypeID" align="center" width="80" :resizable="false" />
            <el-table-column label="级别名称" prop="RetailTypeName" align="center" width="80" :resizable="false" />
            <el-table-column v-if="notExporting" label="操作" align="center" width="165" :resizable="false" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleContentUpdate(row)">
                  Set
                </el-button>
              </template>
            </el-table-column>

          </el-table>

        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
        <el-form v-if="((dialogStatus==='add') || (dialogStatus==='update'))" ref="dataForm_Act" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="级别编号" prop="RetailTypeID">
            <el-input v-model="temp.RetailTypeID" :disabled="dialogStatus==='update'" />
          </el-form-item>
          <el-form-item label="级别名称" prop="RetailTypeName">
            <el-input v-model="temp.RetailTypeName" />
          </el-form-item>
        </el-form>

        <el-form v-if="((dialogStatus==='set') || (dialogStatus==='setBat'))" ref="dataForm_Content" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="用户类型" prop="RetailTypeID">
            <el-select v-model="updatedCards.RetailTypeID" placeholder="请输入用户类型">
              <el-option
                v-for="item in listRetailType"
                :key="item.RetailTypeID"
                :label="item.RetailTypeName"
                :value="item.RetailTypeID"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-form v-if="((dialogStatus==='export'))" ref="dataForm_Export" :rules="rulesContent" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-row>
            <el-col :span="16">
              <el-form-item label="用户类型" prop="RetailTypeID">
                <el-select v-model="updatedCards.RetailTypeID" placeholder="请输入用户类型">
                  <el-option
                    v-for="item in listRetailType"
                    :key="item.RetailTypeID"
                    :label="item.RetailTypeName"
                    :value="item.RetailTypeID"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="2">
              <el-upload ref="upload" action="/" :show-file-list="false" :on-change="importExcel2" :auto-upload="false">
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table v-loading="listLoading" height="250" :data="updatedCards.CardList" border size="mini" fit highlight-current-row>
                <el-table-column label="序号" type="index" align="left" :resizable="false" />
                <el-table-column label="卡号" prop="CardNo" align="left" :resizable="false" />
              </el-table>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="confirmSave">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
<script>

import { retailTypeListQuery, retailTypeAdd,
  retailTypeUpdate, retailTypeDelete, retailTypeUserCardListQuery,
  retailTypeSetUserCard } from '@/api/retailTypeManage'
import { ExcelToJson } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'RetailTypeManage',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      notExporting: true,
      tableKey: 0,
      list: null,

      listRetailType: null,
      listContent: null,
      listUpload: null,
      listLoading: true,
      listContentLoading: false,

      listQuery: {
        stationNo: '',
        stationType: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: '新建散户类型',
        update: '修改散户类型',
        set: '设置散户类型',
        setBat: '批量设置散户类型'

      },
      rules: {
        ActName: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
        StartTM: [{ required: true, message: '活动名称开始时间不能为空', trigger: 'blur' }]

      },
      rulesContent:
      {
        RetailTypeID: [{ required: true, message: '新类型不能为空', trigger: 'blur' }]
      },
      temp: {

      },
      updatedCards: {
        RetailTypeID: 0,
        CardList: []
      },
      multipleSelection: [],
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.getRetailTypeList()
  },
  methods: {
    getRetailTypeList() {
      this.listLoading = true
      retailTypeListQuery(this.listQuery).then(response => {
        this.listRetailType = response.data.items
        this.listRetailType.unshift({
          RetailTypeID: 0,
          RetailTypeName: '普通'
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      retailTypeListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.list.unshift({
          RetailTypeID: 0,
          RetailTypeName: '普通'
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getContentList(row) {
      this.listContentLoading = true
      retailTypeUserCardListQuery(row).then(response => {
        this.listContent = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listContentLoading = false
        }, 1.5 * 1000)
      })
    },
    // 查看内容列表
    actClick(row, column, event) {
      this.temp = Object.assign({}, row) // copy obj
      this.getContentList(row)
    },
    // 刷新按钮事件
    handleFilter() {
      this.getList()
    },
    // 重置数据
    resetUpdateCards() {
      this.updatedCards = {
        RetailTypeID: 0,
        CardList: []
      }
    },
    resetTemp() {
      this.temp = {
        index: 0,
        OptNo: '',
        OptName: '',
        OptOrg: '',
        OptDuty: '',
        Remark: '',
        Enabled: ''
      }
    },
    // 添加分类
    handleActAdd() {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    actAddData() {
      this.$refs['dataForm_Act'].validate((valid) => {
        if (valid) {
          retailTypeAdd(this.temp).then(() => {
            this.list.push(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 修改分类
    handleActUpdate(row) {
      if (row.RetailTypeID === 0) {
        this.$message({
          type: 'info',
          message: '系统类型不能修改'
        })
        return
      }
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    actUpdateData() {
      this.$refs['dataForm_Act'].validate((valid) => {
        if (valid) {
          retailTypeUpdate(this.temp).then(() => {
            for (const v of this.list) {
              if (v.RetailTypeID === this.temp.RetailTypeID) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除分类
    handleActDelete(row) {
      if (row.RetailTypeID === 0) {
        this.$message({
          type: 'info',
          message: '系统类型不能删除'
        })
        return
      }
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleActDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleActDeleteMethod(row) {
      retailTypeDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Act Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    // 统一确认按钮事件
    confirmSave() {
      if (this.dialogStatus === 'add') {
        this.actAddData()
        return
      }
      if (this.dialogStatus === 'update') {
        this.actUpdateData()
        return
      }

      if (this.dialogStatus === 'set') {
        this.contentUpdateData()
        return
      }
      if (this.dialogStatus === 'setBat') {
        this.contentUpdateBatData()
        return
      }
      if (this.dialogStatus === 'export') {
        this.exportCards()
        return
      }
    },
    // 单个修改内容
    handleContentUpdate(row) {
      this.resetUpdateCards()
      this.updatedCards.RetailTypeID = row.RetailTypeID
      this.updatedCards.CardList.push(
        {
          CardNo: row.CardNo
        }
      )
      this.dialogStatus = 'set'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    contentUpdateData() {
      retailTypeSetUserCard(this.updatedCards).then(() => {
        this.getContentList(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 导入内容
    handleImport() {
      this.resetUpdateCards()
      this.dialogStatus = 'export'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Export'].clearValidate()
      })
    },
    importExcel2(file) {
      ExcelToJson(file, this.importHandler)
    },
    importHandler(fileData) {
      console.info(fileData)
      this.updatedCards.CardList = fileData
      console.info(this.updatedCards)
    },
    exportCards() {
      retailTypeSetUserCard(this.updatedCards).then(() => {
        this.getContentList(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 批量修改内容
    handleContentUpdateBat(row) {
      this.resetUpdateCards()
      this.updatedCards.RetailTypeID = this.temp.RetailTypeID
      this.updatedCards.CardList = this.multipleSelection
      console.info(this.updatedCards)
      this.dialogStatus = 'setBat'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    contentUpdateBatData() {
      retailTypeSetUserCard(this.updatedCards).then(() => {
        this.getContentList(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Successfully',
          type: 'success',
          duration: 2000
        })
      })
      this.dialogFormVisible = false
      this.$notify({
        title: 'Success',
        message: 'Update Successfully',
        type: 'success',
        duration: 2000
      })
    },
    // 多选事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    }

  }
}
</script>
