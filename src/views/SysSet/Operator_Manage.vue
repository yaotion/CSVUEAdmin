<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
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
        <el-table-column label="操作员编号" prop="OptNo" align="center" width="100" />
        <el-table-column label="操作员姓名" prop="OptName" align="center" width="120" />
        <el-table-column label="所属单位" prop="StationName" align="center" width="200" />
        <el-table-column label="职务" prop="OptLevel" align="center" width="120" />
        <el-table-column label="是否启用" prop="UseFlag" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.UseFlag===0?"√":"" }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="notExporting" label="操作" align="center" width="350" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button type="primary" size="mini" @click="handlePower(row)">
              Power
            </el-button>
            <el-button type="primary" size="small" @click="handlePassword(row)">
              Password
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="650px">
        <el-form v-if=" dialogStatus === 'create'" ref="dataForm" :rules="rules" size="mini" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">
          <el-form-item label="操作员编号" prop="OptNo">
            <el-input v-model="temp.OptNo" />
          </el-form-item>
          <el-form-item label="操作员姓名" prop="OptName">
            <el-input v-model="temp.OptName" />
          </el-form-item>
          <el-form-item label="所属站点" prop="StationNo">
            <el-select v-model="temp.StationNo" placeholder="请选择">
              <el-option
                v-for="item in orgList"
                :key="item.stationno"
                :label="item.stationname"
                :value="item.stationno"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="职务" prop="OptLevel">
            <el-input v-model="temp.OptLevel" />
          </el-form-item>
          <el-form-item label="备注" prop="Memo">
            <el-input v-model="temp.Memo" type="textarea" :rows="2" />
          </el-form-item>

          <el-form-item label="密码" prop="Pin">
            <el-input v-model="temp.Pin" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="ConfirmPassword">
            <el-input v-model="temp.ConfirmPassword" show-password />
          </el-form-item>
          <el-form-item label="启用" prop="UseFlag">
            <el-switch v-model="temp.UseFlag" :active-value="0" :inactive-value="1" />
          </el-form-item>
        </el-form>
        <el-form v-if=" dialogStatus === 'update'" ref="dataForm_Update" :rules="rules" size="mini" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">
          <el-form-item label="操作员编号">
            <el-input v-model="temp.OptNo" disabled="true" />
          </el-form-item>
          <el-form-item label="操作员名称" prop="OptName">
            <el-input v-model="temp.OptName" />
          </el-form-item>
          <el-form-item label="所属单位">
            <el-input v-model="temp.StationName" disabled="true" />
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="temp.OptLevel" />
          </el-form-item>
          <el-form-item label="备注" prop="Memo">
            <el-input v-model="temp.Memo" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item>
            <el-switch v-model="temp.UseFlag" :active-value="0" :inactive-value="1" />
          </el-form-item>
        </el-form>

        <el-form v-if=" dialogStatus === 'password'" ref="dataForm_Password" :rules="passwordRules" size="mini" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">
          <el-form-item label="操作员编号" prop="OptNo">
            <el-input v-model="temp.OptNo" :disabled="true" />
          </el-form-item>
          <el-form-item label="操作员姓名" prop="OptName">
            <el-input v-model="temp.OptName" :disabled="true" />
          </el-form-item>
          <el-form-item label="旧密码" prop="OldPassword">
            <el-input v-model="temp.OldPassword" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="NewPassword">
            <el-input v-model="temp.NewPassword" show-password />
          </el-form-item>
          <el-form-item label="确认密码" prop="ConfirmPassword">
            <el-input v-model="temp.ConfirmPassword" show-password />
          </el-form-item>

        </el-form>
        <el-form v-if=" dialogStatus === 'power'" ref="dataForm_Power" size="mini" :model="temp" label-position="right" label-width="100px" style="width: 500px; margin-left:50px;">
          <el-transfer v-model="powerList.hasList" :props="{key: 'FunctionNo',label: 'FunctionName'}" :titles="['系统功能', '已有功能']" :data="powerList.leftList" />
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="handleConfirm">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { operatorDetailListQuery, operatorAdd, operatorUpdate, operatorDelete, systemFunctionList, optFunctionList, optFunctionUpdate, operatorUpdatePassword } from '@/api/operatorManage'
import { stationListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'PayWayManage',
  directives: { waves },
  filters: {
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if ((value === '') || (value === undefined)) {
        callback(new Error('请再次输入密码'))
        return
      }
      if (value !== this.temp.NewPassword) {
        callback(new Error('两次输入密码不一致!'))
        return
      }
      callback()
    }
    return {
      notExporting: true,
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      orgList: null,

      powerList:
      {
        OptNo: '',
        leftList: [

        ],
        hasList: []
      },
      textMap: {
        update: '修改操作员',
        power: '操作员权限',
        password: '重置密码',
        create: '新建操作员'
      },
      passwordRules: {
        OldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        NewPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        ConfirmPassword: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      rules: {
        OptNo: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        StationNo: [
          { required: true, message: '站点不能为空', trigger: 'blur' }
        ],
        OptName: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
      },
      temp: {

      },
      downloadLoading: false
    }
  },
  computed: {
    UseFlagCheck: {
      // getter 方法
      get() {
        return this.temp.UseFlag === 0
      },
      // setter 方法
      set(newValue) {
        this.temp.UseFlag = newValue ? 0 : 1
      }
    }
  },
  created() {
    this.getList()
    this.getSystemFunctionList()
    this.getStationList()
  },
  methods: {
    getList() {
      this.listLoading = true
      operatorDetailListQuery(this.listQuery).then(response => {
        this.list = response.data.items

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getStationList() {
      this.listLoading = true
      stationListQuery(this.listQuery).then(response => {
        this.orgList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSystemFunctionList() {
      this.listLoading = true
      systemFunctionList(this.listQuery).then(response => {
        this.allPowerList = response.data.items.concat()
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
    handleConfirm() {
      if (this.dialogStatus === 'create') {
        this.createData()
      }
      if (this.dialogStatus === 'update') {
        this.updateData()
      }
      if (this.dialogStatus === 'power') {
        this.updatePower()
      }
      if (this.dialogStatus === 'password') {
        this.updatePassword()
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
          operatorAdd(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.info(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Update'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm_Update'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.info(tempData)
          operatorUpdate(tempData).then(() => {
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

    handlePower(row) {
      this.listQuery = Object.assign({}, row) // copy obj
      optFunctionList(this.listQuery).then(response => {
        console.info(response)
        this.powerList.leftList = this.allPowerList.concat()
        this.powerList.OptNo = row.OptNo
        this.powerList.hasList = response.data.items.map(x => { return x.FunctionNo })
        console.info(this.powerList)
        this.dialogStatus = 'power'
        this.dialogFormVisible = true
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    updatePower(row) {
      var qry = {}
      qry.OptNo = this.powerList.OptNo
      qry.FunctionList = []
      console.info(this.powerList)
      this.powerList.hasList.forEach(element => {
        console.info(element)
        this.powerList.leftList.forEach(eleAll => {
          console.info(eleAll)
          if (element === eleAll.FunctionNo) {
            console.info('------------Capture---------------')
            console.info(eleAll.FunctionNo + '------------------------------' + eleAll.FunctionType)
            qry.FunctionList.push(
              {
                FunctionNo: eleAll.FunctionNo,
                FunctionType: eleAll.FunctionType
              }
            )
            return false
          }
        })
      })
      console.info('--------Submit--------------')
      console.info(qry)
      optFunctionUpdate(qry).then(response => {
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Update Power Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },

    handlePassword(row) {
      this.temp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'password'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Password'].clearValidate()
      })
    },
    updatePassword() {
      this.$refs['dataForm_Password'].validate((valid) => {
        if (valid) {
          operatorUpdatePassword(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'update password Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteData(row) {
      operatorDelete(row).then(() => {
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
        this.deleteData(row)
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
