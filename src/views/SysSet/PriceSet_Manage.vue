<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input v-model="listQuery.stationNo" class="filter-item" placeholder="油站编号" clearable style="width: 150px" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdd">
        Add
      </el-button>
    </div>

    <div id="tablePrint">

      <el-table v-loading="listLoading" border :data="list" size="mini" fit highlight-current-row>
        <el-table-column type="expand" prop="PriceName" align="center" width="60" :resizable="false">
          <template slot-scope="props">
            <el-table v-loading="listLoading" border :header-cell-style="tableHeaderStyle" :row-style="tableRowStyle" :data="props.row.PriceList">
              <el-table-column label="油品编号" prop="OilCode" align="center" width="120" :resizable="false" />
              <el-table-column label="油品名称" prop="OilName" align="center" width="200" :resizable="false" />
              <el-table-column label="油品价格" prop="OilPrice" align="center" width="120" :resizable="false" />
              <el-table-column v-if="notExporting" label="操作" align="center" width="230" :resizable="false" class-name="small-padding fixed-width">
                <template slot="header">
                  <el-button type="text" icon="el-icon-edit" style="text-decoration:underline;color:#FFFFFF" @click="handleOilPriceAdd(props.row)">
                    添加油品单价
                  </el-button>
                </template>

                <template slot-scope="{row}">
                  <el-button type="text" size="mini" style="text-decoration:underline" @click="handleOilPriceUpdate(props.row,row)">
                    Update
                  </el-button>
                  <el-button
                    style="text-decoration:underline;"
                    mini
                    type="text"
                    @click="handleOilPriceDelete(props.row,row)"
                  >
                    Delete
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

          </template>
        </el-table-column>

        <el-table-column label="策略名称" prop="PriceSetName" align="center" width="160" :resizable="false" />
        <el-table-column label="生效时间" prop="StartTime" align="center" width="160" :resizable="false" />
        <el-table-column label="生效站点" prop="PriceStation" align="center" width="400" :resizable="false" />

        <el-table-column v-if="notExporting" label="操作" align="center" width="220" :resizable="false" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="handleSetStation(row)">
              Station
            </el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)">
              Delete
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
        <el-form v-if="((dialogStatus==='dsAdd') || (dialogStatus==='dsUpdate'))" ref="dataForm_priceSet" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="策略名称" prop="PriceSetName">
            <el-input v-model="temp.PriceSetName" />
          </el-form-item>
          <el-form-item label="生效时间" prop="StartTime">
            <el-date-picker v-model="temp.StartTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
        </el-form>

        <el-form v-if="(dialogStatus==='dsStationSet') " ref="dataForm_StationSet" :rules="rulesContent" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">

          <el-form-item label="适用站点" prop="StationNo">
            <el-select v-model="temp.StationID" multiple placeholder="请指定活动适用站点">
              <el-option
                v-for="item in listStation"
                :key="item.stationno"
                :label="item.stationname"
                :value="item.stationno"
              />
            </el-select>
          </el-form-item>
        </el-form>

        <el-form v-if="((dialogStatus==='dsOilPriceAdd') || (dialogStatus==='dsOilPriceUpdate'))" ref="dataForm_oilPrice" :rules="rulesContent" :model="tempPrice" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">

          <el-form-item label="油品" prop="OilCode">
            <el-select v-model="tempPrice.OilCode" placeholder="指定油品">
              <el-option
                v-for="item in listOilCode"
                :key="item.oilCode"
                :label="item.oilName"
                :value="item.oilCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="单价" prop="OilPrice">
            <el-input-number v-model="tempPrice.OilPrice" :precision="2" :step="0.1" :max="20" />
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
  </div></template>
<style>

</style>
<script>

import { oilCodeListQuery, stationListQuery } from '@/api/base'

import { priceSetListQuery,
  priceSetAdd, priceSetUpdate, priceSetDelete, oilPriceAdd, oilPriceUpdate, oilPriceDelete } from '@/api/priceSetManage2'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'PriceSetManage',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      notExporting: true,
      tableKey: 0,
      list: [{
        PriceName: '测试策略',
        PriceType: '时段策略',
        StartTime: '2019-09-09',
        EndTime: '2019-10-09',
        PriceList: [
          {
            OilCode: '1020',
            OilName: '92#汽油',
            OilPrice: 7.25
          },
          {
            OilCode: '1040',
            OilName: '95#汽油',
            OilPrice: 8.10
          }
        ]
      }],
      listOilCode: null,

      listContent: null,

      listStation: null,
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

      listQuery: {
        stationNo: '',
        stationType: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        dsAdd: '添加价格策略',
        dsUpdate: '修改价格策略',
        dsOilPriceAdd: '添加油品单价',
        dsOilPriceUpdate: '修改油品单价',
        dsStationSet: '修改油品单价'
      },
      rules: {
        PriceSetName: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }],
        StartTime: [{ required: true, message: '活动名称开始时间不能为空', trigger: 'blur' }]

      },
      rulesContent: {
        OilCode: [{ required: true, message: '油品不能为空', trigger: 'blur' }],
        OilPrice: [{ required: true, message: '油价不能为空', trigger: 'blur' }]

      },
      temp: {

      },

      tempPrice: {
        OilCode: '',
        Price: 0.00
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.getOilCodeList()

    this.getStationList()
  },
  methods: {
    getList() {
      this.listLoading = true
      priceSetListQuery(this.listQuery).then(response => {
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
    getStationList() {
      this.listLoading = true
      stationListQuery(this.listQuery).then(response => {
        this.listStation = response.data.items
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

      }
    },
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'dsAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_priceSet'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'dsUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_priceSet'].clearValidate()
      })
    },
    addData() {
      this.$refs['dataForm_priceSet'].validate((valid) => {
        if (valid) {
          priceSetAdd(this.temp).then(() => {
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
    updateData() {
      this.$refs['dataForm_priceSet'].validate((valid) => {
        if (valid) {
          priceSetUpdate(this.temp).then(() => {
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
    handleOilPriceAdd(row) {
      this.temp = row

      this.dialogStatus = 'dsOilPriceAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_oilPrice'].clearValidate()
      })
    },
    handleOilPriceUpdate(row, priceItem) {
      this.temp = row // copy obj
      this.tempPrice = Object.assign({}, priceItem) // copy obj
      this.dialogStatus = 'dsOilPriceUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_oilPrice'].clearValidate()
      })
    },

    oilPriceAddData() {
      this.$refs['dataForm_oilPrice'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempPrice)

          oilPriceAdd(tempData).then(() => {
            this.temp.PriceList.unshift(tempData)

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
    oilPriceUpdateData() {
      this.$refs['dataForm_oilPrice'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempPrice)
          console.info(tempData)
          console.info(this.temp.PriceList)
          oilPriceUpdate(tempData).then(() => {
            for (const v of this.temp.PriceList) {
              if (v.OilCode === tempData.OilCode) {
                const index = this.temp.PriceList.indexOf(v)
                this.temp.PriceList.splice(index, 1, tempData)
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
      if (this.dialogStatus === 'dsAdd') {
        this.addData()
        return
      }
      if (this.dialogStatus === 'dsUpdate') {
        this.updateData()
        return
      }
      if (this.dialogStatus === 'dsOilPriceAdd') {
        this.oilPriceAddData()
        return
      }
      if (this.dialogStatus === 'dsOilPriceUpdate') {
        this.oilPriceUpdateData()
        return
      }
      if (this.dialogStatus === 'dsStationSet') {
        this.setStation()
        return
      }
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
    handleDeleteMethod(row) {
      priceSetDelete(row).then(() => {
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
    handleOilPriceDelete(row, priceItem) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.temp = row // copy obj
        this.tempPrice = Object.assign({}, priceItem) // copy obj
        this.handleOilPriceDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleOilPriceDeleteMethod(row) {
      oilPriceDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        for (const v of this.temp.PriceList) {
          if (v.OilCode === this.tempPrice.OilCode) {
            const index = this.temp.PriceList.indexOf(v)
            this.temp.PriceList.splice(index, 1,)
            break
          }
        }
      })
    },

    handleSetStation(row) {
      this.temp = row
      this.dialogStatus = 'dsStationSet'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_StationSet'].clearValidate()
      })
    },
    setStation() {

    },
    tableRowStyle() {
      return 'background-color: #FFFFFF'
    },
    tableHeaderStyle() {
      return 'background-color: #cc9933;color:#FFFFFF;font-color:#ffffff'
    }
  }
}
</script>
