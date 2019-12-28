<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.actName" class="filter-item" placeholder="活动名称" clearable style="width: 250px" />
      <el-date-picker v-model="listQuery.beginTime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endTime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleContentAdd">
        Add
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
                <el-form label-position="left" label-width="40px" size="mini">
                  <el-form-item label="开始">
                    <span>{{ props.row.StartTm }}</span>
                  </el-form-item>
                  <el-form-item label="结束">
                    <span>{{ props.row.EndTm }}</span>
                  </el-form-item>

                </el-form>
                <div>
                  <el-button type="primary" size="mini" @click="handleActUpdate(props.row)">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleActDelete(props.row)">删除</el-button>
                </div>

              </template>
            </el-table-column>

            <el-table-column label="活动名称" prop="ActName" align="left" :resizable="false">
              <template slot="header">
                <div style="float:left;margin-left: 0px; padding-left:0px;color:blue;font-size:14px" class="filter-item">
                  <span>充值赠送活动</span>
                </div>
                <div style="float:right">
                  <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="text" icon="el-icon-edit" @click="handleActAdd()">
                    添加活动
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table></el-col>
        <el-col :span="17">
          <el-table v-loading="listContentLoading" border :data="listContent" size="mini" fit highlight-current-row>
            <el-table-column label="优惠对象" align="center" prop="AccNo" width="80">
              <template slot-scope="scope2">
                <span>{{ scope2.row.AccNo.trim()=== '0000'?'散户':'客户' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="对象名称" align="center" prop="AccNo" :resizable="false">
              <template slot-scope="scope2">
                <span>{{ scope2.row.AccNo.trim()=== '0000'?scope2.row.RetailTypeName:scope2.row.AccName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最小金额" prop="DepositMin" align="center" width="80" :resizable="false" />
            <el-table-column label="最大金额" prop="DepositMax" align="center" width="80" :resizable="false" />
            <el-table-column label="优惠力度" prop="DepositBonus" align="center" width="80" :resizable="false" />
            <el-table-column label="优惠方式" align="center" width="80" :resizable="false">
              <template slot-scope="scope2">
                <span>{{ scope2.row.BonusType=== 1?'按比例':'定金额' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="notExporting" label="操作" align="center" width="165" :resizable="false" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleContentUpdate(row)">
                  Edit
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleContentDelete(row)">
                  Delete
                </el-button>
              </template>
            </el-table-column>

          </el-table>

        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
        <el-form v-if="((dialogStatus==='actAdd') || (dialogStatus==='actUpdate'))" ref="dataForm_Act" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="活动名称" prop="ActName">
            <el-input v-model="temp.ActName" />
          </el-form-item>
          <el-form-item label="开始时间" prop="StartTm">
            <el-date-picker v-model="temp.StartTm" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item label="结束时间" prop="EndTm">
            <el-date-picker v-model="temp.EndTm" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
        </el-form>

        <el-form v-if="((dialogStatus==='contentAdd') || (dialogStatus==='contentUpdate'))" ref="dataForm_Content" :rules="rulesContent" :model="tempContent" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="优惠对象" prop="DisObjectType">
            <el-select v-model="tempContent.DisObjectType" placeholder="请输入用户类型" @change="disObjectTypeChange">
              <el-option
                v-for="item in objectTypeList"
                :key="item.disObjectTypeID"
                :label="item.disObjectTypeName"
                :value="item.disObjectTypeID"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="tempContent.DisObjectType === 2" label="对象名称" prop="RetailTypeID">
            <el-select v-model="tempContent.RetailTypeID" placeholder="请选择用户级别">
              <el-option
                v-for="item in listRetailType"
                :key="item.retailTypeID"
                :label="item.retailTypeName"
                :value="item.retailTypeID"
              />
            </el-select>

          </el-form-item>
          <el-form-item v-show="tempContent.DisObjectType === 1" label="对象名称" prop="AccNo">
            <el-select v-model="tempContent.AccNo" placeholder="请选择单位">
              <el-option
                v-for="item in listCust"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最小金额" prop="DepositMin">
            <el-input-number v-model="tempContent.DepositMin" :precision="2" :step="0.1" :min="0" />
          </el-form-item>
          <el-form-item label="最大金额" prop="DepositMax">
            <el-input-number v-model="tempContent.DepositMax" :precision="2" :step="0.1" :min="0" />
          </el-form-item>
          <el-form-item label="优惠力度" prop="DepositBonus">
            <el-input-number v-model="tempContent.DepositBonus" :precision="2" :step="0.1" :min="0" />
          </el-form-item>
          <el-form-item label="赠送类型" prop="BonusType">
            <el-radio-group v-model="tempContent.BonusType">
              <el-radio-button label="0">按金额赠送</el-radio-button>
              <el-radio-button label="1">按比例赠送</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="指定油品" prop="OilCode">
            <el-select v-model="tempContent.OilCode" multiple placeholder="指定油品">
              <el-option
                v-for="item in listOilCode"
                :key="item.OilCode"
                :label="item.OilName"
                :value="item.OilCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="适用站点" prop="StationLst">
            <el-select v-model="tempContent.StationLst" multiple placeholder="请指定活动适用站点">
              <el-option
                v-for="item in listStation"
                :key="item.stationno"
                :label="item.stationname"
                :value="item.stationno"
              />
            </el-select>
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

import { oilCodeListQuery, retailTypeListQuery, stationListQuery } from '@/api/base'
import { custInfoQuery } from '@/api/card'

import { depositActDetailListQuery, depositContentDetailListQuery,
  depositActAdd, depositActUpdate, depositActDelete,
  depositContentAdd, depositContentUpdate, depositContentDelete } from '@/api/depositManage'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'DepositManage',
  directives: { waves },
  filters: {
  },
  data() {
    var validateEndTM = (rule, value, callback) => {
      if ((value === '') || (value === undefined)) {
        callback(new Error('请输入活动结束时间'))
        return
      }
      if (value <= this.temp.StartTM) {
        callback(new Error('活动结束时间必须大于开始时间'))
        return
      }
      callback()
    }
    var validateStation = (rule, value, callback) => {
      if ((value === '') || (value === null) || (value.length === 0)) {
        callback(new Error('至少要选择一个站点'))
        return
      }

      callback()
    }
    var validateOilCode = (rule, value, callback) => {
      if ((value === '') || (value === null) || (value.length === 0)) {
        callback(new Error('至少要选择一个油品'))
        return
      }
      callback()
    }
    var validateObjectType = (rule, value, callback) => {
      console.info('validateObjectType')
      console.info(value)
      console.info(this.tempContent)
      if (value === 2) {
        if (this.tempContent.RetailTypeID === null) {
          callback(new Error('请选择目标单位'))
          return
        }
      }
      if (value === 1) {
        if (this.tempContent.AccNo === null) {
          callback(new Error('清选择散户类型'))
          return
        }
      }
      callback()
    }
    return {
      notExporting: true,
      tableKey: 0,
      list: null,
      listOilCode: null,
      listRetailType: null,
      listContent: null,
      listCust: null,
      listLoading: true,
      listContentLoading: false,
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      stationTypeList: [
        { stationType: '0',
          stationTypeName: '加油站' },
        { stationType: '1',
          stationTypeName: '发卡点' }
      ],
      listStation: null,
      listQuery: {
        beginTime: '',
        endTime: '',
        actName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        actAdd: '新建活动',
        actUpdate: '修改活动',
        contentAdd: '添加活动内容',
        contentUpdate: '修改活动内容'
      },
      rules: {
        ActName: [{ required: true, message: '活动名称不能为空', trigger: 'blur' }],
        StartTM: [{ required: true, message: '活动名称开始时间不能为空', trigger: 'blur' }],
        EndTM: [{ required: true, validator: validateEndTM, trigger: 'blur' }]
      },
      rulesContent: {
        DisObjectType: [
          { required: true, message: '请选择优惠对象', trigger: 'blur' },
          { validator: validateObjectType, trigger: 'blur' }
        ],

        BonusType: [{ required: true, message: '请选择赠送类型', trigger: 'blur' }],
        StationLst: [{ required: true, validator: validateStation, trigger: 'blur' }],
        OilCode: [{ required: true, validator: validateOilCode, trigger: 'blur' }]
      },
      selectedActRow: {},
      temp: {},
      tempContent: {},
      downloadLoading: false,
      objectTypeList: [
        {
          disObjectTypeID: 1,
          disObjectTypeName: '单位'
        },
        {
          disObjectTypeID: 2,
          disObjectTypeName: '散户'
        }
      ]
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.getOilCodeList()
    this.getRetailTypeList()
    this.getStationList()
    this.getCustList()
  },
  methods: {
    getList() {
      this.listLoading = true
      depositActDetailListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    disObjectTypeChange() {
      this.tempContent.RetailTypeID = []
      this.tempContent.AccNo = []
    },
    getOilCodeList() {
      this.listLoading = true
      oilCodeListQuery(this.listQuery).then(response => {
        this.listOilCode = response.data.items
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
    getCustList() {
      this.listLoading = true
      custInfoQuery(this.listQuery).then(response => {
        this.listCust = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getStationList() {
      this.listLoading = true
      stationListQuery(this.listQuery).then(response => {
        console.info(response.data)
        this.listStation = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getContentList(row) {
      this.listContentLoading = true
      this.selectedActRow = row
      depositContentDetailListQuery(row).then(response => {
        this.listContent = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listContentLoading = false
        }, 1.5 * 1000)
      })
    },
    actClick(row, column, event) {
      const qry = {
        actID: row.Id
      }
      this.getContentList(qry)
    },
    handleFilter() {
      this.getList()
    },

    resetTemp() {
      this.temp = {
        ActName: '',
        StartTm: '',
        EndTm: ''
      }
    },
    resetTempContent() {
      this.tempContent = {
        AccName: null,
        AccNo: null,
        ActID: null,
        BonusType: 0,
        CreateTime: null,
        DepositBonus: 0.00,
        DepositMax: 0.00,
        DepositMin: 0.00,
        DisObjectType: null,
        OilCode: [],
        RetailTypeID: null,
        RetailTypeName: null,
        StationLst: []
      }
    },
    handleActAdd() {
      this.resetTemp()
      this.dialogStatus = 'actAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    actAddData() {
      this.$refs['dataForm_Act'].validate((valid) => {
        if (valid) {
          depositActAdd(this.temp).then(() => {
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
    handleActUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'actUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    actUpdateData() {
      this.$refs['dataForm_Act'].validate((valid) => {
        if (valid) {
          depositActUpdate(this.temp).then(() => {
            this.getList()
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
      depositActDelete(row).then(() => {
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
    handleContentAdd() {
      this.resetTempContent()
      this.dialogStatus = 'contentAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].resetFields()
      })
    },
    contentAddData() {
      this.$refs['dataForm_Content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempContent)
          tempData.ActID = this.selectedActRow.actID
          tempData.StationLst = tempData.StationLst.join('|')
          tempData.OilCode = tempData.OilCode.join('|')
          // /单位客户把散户类型职位0
          if (tempData.DisObjectType === 1) { tempData.RetailTypeID = 0 }
          // /散户吧单位账号职位'0000'
          if (tempData.DisObjectType === 2) { tempData.AccNo = '0000' }
          depositContentAdd(tempData).then(() => {
            this.getContentList(this.selectedActRow)
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

    handleContentUpdate(row) {
      var tempData = Object.assign({}, row)
      if (tempData.OilCode === null) { tempData.OilCode = [] }
      if (!Array.isArray(tempData.OilCode)) {
        var tempOil = tempData.OilCode
        if (tempOil != null) { tempData.OilCode = tempOil.split('|') }
      }

      if (tempData.StationLst === null) { tempData.StationLst = [] }
      if (!Array.isArray(tempData.StationLst)) {
        var tempStation = tempData.StationLst
        if (tempStation != null) { tempData.StationLst = tempStation.split('|') }
      }
      tempData.DisObjectType = 1
      if (tempData.AccNo.trim() === '0000') { tempData.DisObjectType = 2 }

      this.tempContent = tempData // copy obj

      this.dialogStatus = 'contentUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },

    contentUpdateData() {
      this.$refs['dataForm_Content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempContent)
          console.info(tempData)
          tempData.StationLst = tempData.StationLst.join('|')
          tempData.OilCode = tempData.OilCode.join('|')
          // /单位客户把散户类型职位0
          if (tempData.DisObjectType === 1) { tempData.RetailTypeID = 0 }
          // /散户吧单位账号职位'0000'
          if (tempData.DisObjectType === 2) { tempData.AccNo = '0000' }

          depositContentUpdate(tempData).then(() => {
            this.getContentList(this.selectedActRow)

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
    handleContentDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleContentDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleContentDeleteMethod(row) {
      depositContentDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.listContent.indexOf(row)
        this.listContent.splice(index, 1)
      })
    },
    confirmSave() {
      if (this.dialogStatus === 'actAdd') {
        this.actAddData()
        return
      }
      if (this.dialogStatus === 'actUpdate') {
        this.actUpdateData()
        return
      }
      if (this.dialogStatus === 'contentAdd') {
        this.contentAddData()
        return
      }
      if (this.dialogStatus === 'contentUpdate') {
        this.contentUpdateData()
        return
      }
    }
  }
}
</script>
