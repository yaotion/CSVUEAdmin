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
                    <span>{{ props.row.ActStartTime }}</span>
                  </el-form-item>
                  <el-form-item label="结束">
                    <span>{{ props.row.ActEndTime }}</span>
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
                  <span>明折明扣活动</span>
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
            <el-table-column label="用户类型" prop="DisObjectType" :formatter="FormatDisObjectType" align="center" width="80" :resizable="false" />
            <el-table-column label="用户级别" prop="DisObjectName" align="center" width="80" :resizable="false" />
            <el-table-column label="最小升数" prop="ValidMinVol" align="center" width="80" :resizable="false" />
            <el-table-column label="优惠额度" prop="DCTMoney" align="center" width="80" :resizable="false" />
            <el-table-column label="适用油站" prop="StationID" align="center" width="140" :resizable="false" />
            <el-table-column label="适用油品" prop="OilCode" align="center" width="140" :resizable="false" />
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
          <el-form-item label="开始时间" prop="ActStartTime">
            <el-date-picker v-model="temp.ActStartTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item label="结束时间" prop="ActEndTime">
            <el-date-picker v-model="temp.ActEndTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择结束时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
        </el-form>

        <el-form v-if="((dialogStatus==='contentAdd') || (dialogStatus==='contentUpdate'))" ref="dataForm_Content" :rules="rulesContent" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="用户类型" prop="DisObjectType">
            <el-select v-model="temp.DisObjectType" placeholder="请输入用户类型" @change="disObjectTypeChange">
              <el-option
                v-for="item in objectTypeList"
                :key="item.disObjectTypeID"
                :label="item.disObjectTypeName"
                :value="item.disObjectTypeID"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="temp.DisObjectType === 2?'用户等级':'单位名称'" prop="DisObjectID">
            <el-select v-show="temp.DisObjectType === 2" v-model="DisObjectID" placeholder="请选择用户级别">
              <el-option
                v-for="item in listRetailType"
                :key="item.retailTypeID"
                :label="item.retailTypeName"
                :value="item.retailTypeID"
              />
            </el-select>
            <el-select v-show="temp.DisObjectType === 1" v-model="DisObjectID" placeholder="请选择单位">
              <el-option
                v-for="item in listCust"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="适用站点" prop="StationNo">
            <el-select v-model="contentStation" multiple placeholder="请指定活动适用站点">
              <el-option
                v-for="item in listStation"
                :key="item.stationno"
                :label="item.stationname"
                :value="item.stationno"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="最小额度" prop="ValidMinVol">
            <el-input-number v-model="temp.ValidMinVol" :precision="2" :step="0.1" :min="0" />
          </el-form-item>

          <el-form-item label="优惠额度" prop="DCTMoney">
            <el-input-number v-model="temp.DCTMoney" :precision="2" :step="0.1" :min="0" />
          </el-form-item>

          <el-form-item label="指定油品" prop="OilCode">
            <el-select v-model="temp.OilCode" multiple placeholder="指定油品">
              <el-option
                v-for="item in listOilCode"
                :key="item.OilCode"
                :label="item.OilName"
                :value="item.OilCode"
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

import { discountActDetailListQuery, discountContentDetailListQuery,
  discountActAdd, discountActUpdate, discountActDelete,
  discountContentAdd, discountContentUpdate, discountContentDelete } from '@/api/discountManage'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'DiscountManage',
  directives: { waves },
  filters: {
  },
  data() {
    var validateEndTM = (rule, value, callback) => {
      if ((value === '') || (value === undefined)) {
        callback(new Error('请输入活动结束时间'))
        return
      }
      if (value <= this.temp.ActStartTime) {
        callback(new Error('活动结束时间必须大于开始时间'))
        return
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
      listStation: null,
      listLoading: true,
      listContentLoading: false,
      objectTypeList: [
        {
          disObjectTypeID: 1,
          disObjectTypeName: '单位'
        },
        {
          disObjectTypeID: 2,
          disObjectTypeName: '散户'
        }
      ],
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
        ActStartTime: [{ required: true, message: '活动名称开始时间不能为空', trigger: 'blur' }],
        ActEndTime: [{ required: true, validator: validateEndTM, trigger: 'blur' }
        ]
      },
      rulesContent: {
        DisObjectType: [{ required: true, message: '用户类型不能为空', trigger: 'blur' }],
        DisObjectID: [{ required: true, message: '优惠对象不能为空', trigger: 'blur' }]

      },
      selectedActRow: {},
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
    contentStation: {
      // getter 方法
      get() {
        return this.temp.StationID
      },
      // setter 方法
      set(newValue) {
        this.temp.StationID = newValue
        this.temp.StationName = this.listStation.filter(item => newValue.indexOf(item.stationno) > -1).map(item => item.stationname).join('|')
      }
    },
    DisObjectID: {
      // getter 方法
      get() {
        return this.temp.DisObjectID
      },
      // setter 方法
      set(newValue) {
        this.temp.DisObjectID = newValue
        if (this.temp.DisObjectType === 1) { this.temp.DisObjectName = this.listCust.filter(item => newValue === item.id).map(item => item.label).join('|') }
        if (this.temp.DisObjectType === 2) { this.temp.DisObjectName = this.listRetailType.filter(item => newValue === item.retailTypeID).map(item => item.retailTypeName).join('|') }
      }
    }
  },
  created() {
    this.getList()
    this.getOilCodeList()
    this.getRetailTypeList()
    this.getCustList()
    this.getStationList()
  },
  methods: {

    disObjectTypeChange: function() {
      this.temp.DisObjectID = null
    },
    FormatDisObjectType: function(row, column) {
      return row.DisObjectType === 2 ? '散户优惠' : row.DisObjectType === 1 ? '单位优惠' : '其他'
    },
    getList() {
      this.listLoading = true
      console.info(this.listQuery)
      discountActDetailListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
      discountContentDetailListQuery(row).then(response => {
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
        DisID: '',
        ActID: this.selectedActRow.ActID,
        StationID: [],
        StationName: [],
        DisObjectID: null,
        DisObjectType: 1,
        OilCode: [],
        DctMoney: 0.00,
        ValidMinVol: 0.00

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
    handleContentAdd() {
      this.resetTemp()
      console.info(this.temp)
      this.dialogStatus = 'contentAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    actAddData() {
      this.$refs['dataForm_Act'].validate((valid) => {
        if (valid) {
          discountActAdd(this.temp).then(() => {
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
          discountActUpdate(this.temp).then(() => {
            for (const v of this.list) {
              if (v.ActNo === this.temp.ActNo) {
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
    handleActUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj

      this.dialogStatus = 'actUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Act'].clearValidate()
      })
    },
    handleContentUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.orginDisObjectType = this.temp.DisObjectType
      if (!Array.isArray(row.OilCode)) {
        const tempOil = row.OilCode
        this.temp.OilCode = tempOil.split('|')
      }
      if (!Array.isArray(row.StationID)) {
        const tempOil = row.StationID
        this.temp.StationID = tempOil.split('|')
      }
      this.dialogStatus = 'contentUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_Content'].clearValidate()
      })
    },
    contentAddData() {
      this.$refs['dataForm_Content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.StationID = tempData.StationID.join('|')
          tempData.OilCode = tempData.OilCode.join('|')
          discountContentAdd(tempData).then(() => {
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
    contentUpdateData() {
      this.$refs['dataForm_Content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.info(tempData)
          tempData.StationID = tempData.StationID.join('|')
          tempData.OilCode = tempData.OilCode.join('|')
          console.info(tempData)
          discountContentUpdate(tempData).then(() => {
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
      discountActDelete(row).then(() => {
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
      discountContentDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        const index = this.listContent.indexOf(row)
        this.listContent.splice(index, 1)
      })
    }
  }
}
</script>
