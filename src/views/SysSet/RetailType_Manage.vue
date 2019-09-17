<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.retailTypeID" placeholder="站点类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in listRetailType" :key="item.retailTypeID" :label="item.retailTypeName" :value="item.retailTypeID" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleActAdd">
        Add
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
            <el-table-column label="级别编号" prop="RetailTypeID" width="80" align="left" :resizable="false" />
            <el-table-column label="级别名称" prop="RetailTypeName" align="left" :resizable="false" />
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

        <el-form v-if="((dialogStatus==='set') || (dialogStatus==='setBat'))" ref="dataForm_Content" :rules="rulesContent" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="用户类型" prop="RetailTypeID">
            <el-select v-model="newRetailType.RetailTypeID" placeholder="请输入用户类型">
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
          <el-form-item label="用户类型" prop="RetailTypeID">
            <el-select v-model="newRetailType.RetailTypeID" placeholder="请输入用户类型">
              <el-option
                v-for="item in listRetailType"
                :key="item.RetailTypeID"
                :label="item.RetailTypeName"
                :value="item.RetailTypeID"
              />
            </el-select>

          </el-form-item>
          <el-form-item label="用户类型" prop="RetailTypeID">
            <el-upload ref="upload" action="/" :show-file-list="false" :on-change="importExcel2" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
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
      newRetailType: {},
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
    getList() {
      this.listLoading = true
      retailTypeListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getRetailTypeList() {
      this.listLoading = true
      retailTypeListQuery(this.listQuery).then(response => {
        this.listRetailType = response.data.items
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
    actClick(row, column, event) {
      this.getContentList(row)
    },
    handleFilter() {
      this.getList()
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
            this.list.unshift(this.temp)
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
    handleContentAdd() {

    },
    handleActUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    handleContentUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.newRetailType = {}
      this.dialogStatus = 'set'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    contentUpdateData() {
      this.$refs['dataForm_Content'].validate((valid) => {
        if (valid) {
          var selectedRetailType
          for (const s of this.listRetailType) {
            if (s.RetailTypeID === this.temp.RetailTypeID) {
              selectedRetailType = s
              break
            }
          }
          retailTypeSetUserCard(this.temp).then(() => {
            for (const v of this.listContent) {
              if (v.CardNo === this.temp.CardNo) {
                var dx = Object.assign({}, v)
                dx.RetailTypeID = selectedRetailType.RetailTypeID
                dx.RetailTypeName = selectedRetailType.RetailTypeName
                const index = this.listContent.indexOf(v)
                this.listContent.splice(index, 1, dx)
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
    },
    handleActDelete(row) {
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
    handleImport() {
      this.temp = {}

      this.dialogStatus = 'export'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Export'].clearValidate()
      })
    },
    handleContentUpdateBat() {
      this.temp = {}

      this.dialogStatus = 'setBat'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    contentUpdateBatData() {
      var selectedRetailType
      for (const s of this.listRetailType) {
        if (s.RetailTypeID === this.newRetailType.RetailTypeID) {
          selectedRetailType = s
          break
        }
      }
      for (const f of this.multipleSelection) {
        for (const v of this.listContent) {
          if (v.CardNo === f.CardNo) {
            const index = this.listContent.indexOf(v)
            v.RetailTypeID = selectedRetailType.RetailTypeID
            v.RetailTypeName = selectedRetailType.RetailTypeName
            this.listContent.splice(index, v)
            break
          }
        }
      }
      this.dialogFormVisible = false
      this.$notify({
        title: 'Success',
        message: 'Update Successfully',
        type: 'success',
        duration: 2000
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    importExcel2(file) {
      ExcelToJson(file, this.importHandler)
    },
    importHandler(fileData) {
      alert(fileData)
    }
  }
}
</script>
