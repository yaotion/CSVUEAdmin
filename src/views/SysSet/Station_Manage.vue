/* eslint-disable vue/html-quotes */
<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.stationNo" class="filter-item" placeholder="油站编号" clearable style="width: 150px" />
      <el-select v-model="listQuery.stationType" placeholder="站点类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in stationTypeList" :key="item.stationType" :label="item.stationTypeName" :value="item.stationType" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <div id="tablePrint">
      <el-table
        id="tabData"
        :key="tableKey"
        v-loading="listLoading"
        height="600"
        :data="list"
        border
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="index" type="index" align="center" width="60" />
        <el-table-column label="网点编号" prop="StationNo" align="center" width="90" />
        <el-table-column label="站点类型" prop="StationTypeName" align="center" width="90" />
        <el-table-column label="注册密码" prop="SecCode" align="center" width="80" />
        <el-table-column label="网点简称" prop="BriefName" align="center" width="100" />
        <el-table-column label="网点名称" prop="StationName" align="center" width="200" />
        <el-table-column label="负责人" prop="Master" align="center" width="80" />
        <el-table-column label="联系电话" prop="TelNo" align="center" width="100" />
        <el-table-column label="税号" prop="TaxCode" align="center" width="200" />
        <el-table-column label="税率" prop="TaxRate" align="center" width="80" />
        <el-table-column label="开户银行" prop="BankName" align="center" width="120" />
        <el-table-column label="银行账号" prop="BankAccNo" align="center" width="160" />
        <el-table-column label="地址" prop="Address" align="center" width="250" />
        <el-table-column label="备注" prop="Memo" align="center" width="250" />
        <el-table-column v-if="notExporting" label="操作" fixed="right" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>

            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleInit(row)">
              Init
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="850px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 700px; margin-left:50px;">
          <el-row>
            <el-col :span="8">
              <el-form-item label="网点编号" prop="StationNo">
                <el-input v-model="temp.StationNo" />
              </el-form-item>
            </el-col>

            <el-col :span="7" :offset="1">
              <el-form-item label="注册密码" prop="SecCode">
                <el-input v-model="temp.SecCode" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="网点简称" prop="BriefName">
                <el-input v-model="temp.BriefName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="网点名称" prop="StationName">
                <el-input v-model="temp.StationName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="联系电话">
                <el-input v-model="temp.TelNo" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="负责人">
                <el-input v-model="temp.Master" />
              </el-form-item>
            </el-col>

          </el-row>

          <el-row>
            <el-col :span="16">
              <el-form-item label="税号">
                <el-input v-model="temp.TaxCode" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="1">
              <el-form-item label="税率">
                <el-input v-model="temp.TaxRate" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行">
                <el-input v-model="temp.BankName" />
              </el-form-item>
            </el-col>
            <el-col :span="11" :offset="1">
              <el-form-item label="银行账号">
                <el-input v-model="temp.BankAccNo" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="地址">
                <el-input v-model="temp.Address" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="temp.Memo" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="网点类型">
            <el-radio-group v-model="temp.StationType">
              <el-radio-button v-model="temp.StationType" label="0" border>加油站</el-radio-button>
              <el-radio-button v-model="temp.StationType" label="1" border>发卡点</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { stationDetailListQuery, stationAdd, stationUpdate, stationDelete, stationInit } from '@/api/stationInfo'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'StationManage',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      notExporting: true,
      tableKey: 0,
      list: null,
      listLoading: true,
      stationTypeList: [
        { stationType: -1,
          stationTypeName: '全部类型' },
        { stationType: 0,
          stationTypeName: '加油站' },
        { stationType: 1,
          stationTypeName: '发卡点' }
      ],
      listQuery: {
        stationNo: '',
        stationType: -1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '网点修改',
        create: '创建网点'
      },
      rules: {
        StationNo: [{ required: true, message: '网点编号不能为空', trigger: 'change' }],
        SecCode: [{ required: true, message: '网点密码不能为空', trigger: 'change' }],
        BriefName: [{ required: true, message: '网点简称不能为空', trigger: 'blur' }],
        StationName: [{ required: true, message: '网点名称不能为空', trigger: 'blur' }]
      },
      temp: {
        index: 0,
        StationNo: '',
        SecCode: '',
        BriefName: '',
        StationName: '',
        TelNo: '',
        Master: '',
        TaxCode: '',
        TaxRate: '',
        BankName: '',
        BankAccNo: '',
        Address: '',
        Memo: '',
        StationType: '0'
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      stationDetailListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          stationAdd(this.temp).then(() => {
            this.handleFilter()
            console.info(this.temp)
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.info(this.temp)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.info(tempData)
          stationUpdate(tempData).then(() => {
            this.handleFilter()
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
    handleDeleteMethod(row) {
      stationDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleInit(row) {
      this.$confirm('此操作将会引起客户端重新注册, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleInitMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消初始化'
        })
      })
    },
    handleInitMethod(row) {
      stationInit(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Init Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      this.notExporting = false
      this.$nextTick(() => {
        var dataTmp = document.querySelector('#tabData')
        try {
          tableToExcel(dataTmp, '油站信息表')
        } finally {
          this.notExporting = true
          this.downloadLoading = false
        }
      })
    }
  }
}
</script>
