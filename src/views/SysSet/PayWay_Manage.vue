<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>
    <div id="tablePrint">
      <el-table
        id="tabData"
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="结算方式编号" prop="PayWay" align="center" width="100" />
        <el-table-column label="结算方式名称" prop="PayWayName" align="center" width="200" />

        <el-table-column v-if="notExporting" label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>

            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="450px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 300px; margin-left:50px;">
          <el-form-item label="结算方式编号" prop="PayWay">
            <el-input v-model.number="temp.PayWay" type="number" :disabled="dialogStatus!=='create'" />
          </el-form-item>

          <el-form-item label="结算方式名称" prop="PayWayName">
            <el-input v-model="temp.PayWayName" />
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
import { payWayDetailListQuery, payWayAdd, payWayUpdate, payWayDelete } from '@/api/payWayManage'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'PayWayManage',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      notExporting: true,
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '结算方式修改',
        create: '新建结算方式'
      },
      rules: {
        PayWay: [
          { required: true, message: '结算方式编号不能为空', trigger: 'blur' },
          { type: 'number', message: '结算方式编号必须为数字值', trigger: 'blur' }
        ],
        PayWayName: [{ required: true, message: '结算方式名称不能为空', trigger: 'blur' }]
      },
      temp: {
        PayWay: 0,
        PayWayName: ''
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
      payWayDetailListQuery(this.listQuery).then(response => {
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
        PayWay: 0,
        PayWayName: ''
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
          payWayAdd(this.temp).then(() => {
            this.list.unshift(this.temp)
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
          payWayUpdate(tempData).then(() => {
            for (const v of this.list) {
              if (v.StationNo === this.temp.StationNo) {
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
    handleDeleteMethod(row) {
      payWayDelete(row).then(() => {
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

    handleDownload() {
      this.downloadLoading = true
      this.notExporting = false
      this.$nextTick(() => {
        var dataTmp = document.querySelector('#tabData')
        try {
          tableToExcel(dataTmp, '结算方式列表')
        } finally {
          this.notExporting = true
          this.downloadLoading = false
        }
      })
    }
  }
}
</script>
