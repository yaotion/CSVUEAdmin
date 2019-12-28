<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
    </div>

    <div id="tablePrint">
      <el-row :gutter="24">
        <el-col :span="15">
          <el-table v-loading="listLoading" :data="list" border size="mini" height="250" fit highlight-current-row @row-click="setClick">
            <el-table-column label="体系名称" prop="PriceSetName" align="left" />
            <el-table-column label="启用时间" prop="UseTime" width="140" align="left" />
            <el-table-column label="是否启用" prop="PriceUse" width="80" align="left">
              <template slot-scope="scope2">
                <span>{{ scope2.row.PriceUse === 0?'未生效':"已生效" }}</span>
              </template>
            </el-table-column>
            <el-table-column width="150">
              <template slot="header">
                <div>
                  <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="text" icon="el-icon-edit" @click="handleAdd()">
                    添加体系
                  </el-button>
                </div>
              </template>
              <template slot-scope="scope">
                <div>
                  <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="9">
          <el-table v-loading="listLoading" :data="listPriceStation" border size="mini" height="250" fit highlight-current-row>
            <el-table-column label="油站编号" prop="StationName" align="center" width="120" />
            <el-table-column label="油站名称" prop="StationName" align="center" />
            <el-table-column v-if="notExporting" label="" align="center" width="80" :resizable="false" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button v-show="row.PriceStationNo===0" type="primary" size="mini" @click="enableStation(row)">
                  启用
                </el-button>
                <el-button v-show="row.PriceStationNo!==0" type="danger" size="mini" @click="disableStation(row)">
                  禁用
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="24" style="margin-top:20px;">
        <el-col :span="15">
          <el-table v-loading="listLoading" border :data="listContent" size="mini" fit highlight-current-row @row-click="contentClick">
            <el-table-column label="策略名称" prop="ContentName" align="center" />
            <el-table-column label="策略类型" prop="ContentType" :formatter="formatContentType" align="center" width="100" :resizable="false" />
            <el-table-column label="策略时段" prop="StartHour" :formatter="formatTimeSpan" align="center" width="120" :resizable="false" />
            <el-table-column width="150">
              <template slot="header">
                <div>
                  <el-button class="filter-item" size="mini" style="margin-left: 10px;" type="text" icon="el-icon-edit" @click="handleContentAdd()">
                    添加策略
                  </el-button>
                </div>
              </template>
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleContentUpdate(row)">
                  Edit
                </el-button>
                <el-button size="mini" type="danger" @click="handleContentDelete(row)">
                  Delete
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="9">
          <el-table v-loading="listLoading" border :data="listContentOilCode" size="mini" fit highlight-current-row>
            <el-table-column label="油品" prop="OilName">
              <template slot-scope="{row}">
                <span>{{ "["+row.OilCode+"]"+row.OilName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="单价" prop="NewPrice" width="80">
              <template slot-scope="{row}">
                <template v-if="row.mode > 0">
                  <el-input v-model="row.NewPrice" class="edit-input" size="small" />
                </template>
                <span v-else>{{ row.NewPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="notExporting" label="" width="160" align="center" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <template v-if="row.mode > 0">
                  <el-button type="success" size="mini" @click="handleSetOil(row,1)">
                    yes
                  </el-button>
                  <el-button class="cancel-btn" size="mini" type="warning" @click="cancelhandleSetOil(row)">
                    no
                  </el-button>
                </template>
                <template v-else>
                  <el-button v-show="row.PriceInfoNo===0" type="primary" size="mini" @click="row.mode = 2">
                    启用
                  </el-button>
                  <el-button v-show="row.PriceInfoNo!==0" type="danger" size="mini" @click="handleSetOil(row,0)">
                    禁用
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="500px">
        <el-form v-if="((dialogStatus==='dsAdd') || (dialogStatus==='dsUpdate'))" ref="dataForm_priceSet" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="体系名称" prop="PriceSetName">
            <el-input v-model="temp.PriceSetName" />
          </el-form-item>
          <el-form-item label="生效时间" prop="UseTime">
            <el-date-picker v-model="temp.UseTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择开始时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
        </el-form>

        <el-form v-if="((dialogStatus==='dsContentAdd') || (dialogStatus==='dsContentUpdate'))" ref="dataForm_content" :rules="rulesContent" :model="tempContent" label-position="right" label-width="80px" style="width: 350px; margin-left:50px;">
          <el-form-item label="策略名称" prop="ContentName">
            <el-input v-model="tempContent.ContentName" />
          </el-form-item>
          <el-form-item label="策略类型" prop="ContentType">
            <el-select v-model="tempContent.ContentType" placeholder="请选择类型">
              <el-option
                v-for="item in ListContentType"
                :key="item.ContentType"
                :label="item.ContentTypeName"
                :value="item.ContentType"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="tempContent.ContentType!=1" label="开始时间" prop="StartHour">
            <el-date-picker v-model="tempContent.StartHour" value-format="yyyy-MM-dd HH:mm:ss" :type="tempContent.ContentType===2?'datetime':'time'" placeholder="选择开始时间" align="right" :picker-options="pickerOptions" />
          </el-form-item>
          <el-form-item v-show="tempContent.ContentType!=1" label="结束时间" prop="EndHour">
            <el-date-picker v-model="tempContent.EndHour" value-format="yyyy-MM-dd HH:mm:ss" :type="tempContent.ContentType===2?'datetime':'time'" placeholder="选择结束时间" align="right" :picker-options="pickerOptions" />
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
<script>
import moment from 'moment/moment'
import { oilCodeListQuery, stationListQuery } from '@/api/base'

import { priceSetListQuery, priceContentListQuery, priceStationListQuery, priceStationSetStation, priceOilListQuery, priceContentSetOil,
  priceSetAdd, priceSetUpdate, priceSetDelete, priceContentAdd, priceContentUpdate, priceContentDelete } from '@/api/priceSetManage2'

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
      listContent: null,
      listPriceStation: null,
      listContentOilCode: null,
      listOilCode: null,
      listStation: null,
      ListContentType: [
        { ContentType: 1,
          ContentTypeName: '不限时间'
        },
        { ContentType: 2,
          ContentTypeName: '指定日期范围'
        },
        { ContentType: 3,
          ContentTypeName: '指定每天时段'
        }
      ],
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
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        dsAdd: '添加价格体系',
        dsUpdate: '修改价格体系',
        dsContentAdd: '添加价格策略',
        dsContentUpdate: '修改价格策略'
      },
      rules: {
        PriceSetName: [{ required: true, message: '价格体系名称不能为空', trigger: 'blur' }],
        UseTime: [{ required: true, message: '价格体系生效时间不能为空', trigger: 'blur' }]
      },
      rulesContent: {
        ContentName: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }]
      },
      temp: {
      },
      tempContent: {

      },
      selectedSet: { // 当前选中的价格体系行
      },
      selectedContent: { // 当前选中的价格策略行

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
    this.handleFilter()
  },
  methods: {
    // 格式化数据
    formatContentType: function(row, column) {
      return row.ContentType === 1 ? '不限时间' : row.ContentType === 2 ? '指定日期范围' : '指定每天时段'
    },
    formatTimeSpan: function(row, column) {
      if (row.ContentType === 1) return '不限时间'
      if (row.ContentType === 2) {
        return row.StartHour + '----' + row.EndHour
      }
      if (row.ContentType === 3) {
        var dtStart = new Date(row.StartHour)
        var dtEnd = new Date(row.EndHour)
        return dtStart.toLocaleTimeString() + '----' + dtEnd.toLocaleTimeString()
      }
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
        console.info(response.data)
        this.listStation = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 查询按钮事假
    handleFilter() {
      this.getList()
      this.getOilCodeList()
      this.getStationList()
    },
    // -------------------------获取价格体系列表--------------------------------
    resetTemp() {
      this.temp = {
      }
    },
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
    // 添加价格体系
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'dsAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_priceSet'].clearValidate()
      })
    },
    addData() {
      this.$refs['dataForm_priceSet'].validate((valid) => {
        if (valid) {
          priceSetAdd(this.temp).then(() => {
            this.handleFilter()
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
    // 修改价格体系
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'dsUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_priceSet'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm_priceSet'].validate((valid) => {
        if (valid) {
          priceSetUpdate(this.temp).then(() => {
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
    // 删除价格体系
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
    // 价格体系行点击事件
    setClick(row) {
      console.info(row)
      this.selectedSet = Object.assign({}, row)
      console.info(this.selectedSet)
      this.getContent(this.selectedSet)
      this.getPriceStation(this.selectedSet)
    },

    // ----------------获取价格策略-----------------------
    resetContentTemp() {
      this.tempContent = {
        ContentName: '',
        ContentType: 1,
        StartHour: moment().format('YYYY-MM-DD HH:mm:ss'),
        EndHour: moment().add(7, 'd').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    getContent(row) {
      this.listLoading = true
      console.info(row)
      priceContentListQuery(row).then(response => {
        this.listContent = response.data.items
        console.info(this.listContent)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 价格策略行点击事件
    contentClick(row) {
      this.selectedContent = Object.assign({}, row)
      this.getPriceOil(this.selectedContent)
    },
    handleContentAdd() {
      console.info(this.selectedSet)
      if (!this.selectedSet.PriceSetNo) {
        this.$notify({
          title: '提示',
          message: '请选择价格体系',
          type: 'error',
          duration: 2000
        })
        return
      }
      this.resetContentTemp()
      console.info(this.tempContent)
      this.dialogStatus = 'dsContentAdd'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        console.info(this.$refs['dataForm_content'])
        this.$refs['dataForm_content'].clearValidate()
      })
    },
    addContentData() {
      this.$refs['dataForm_content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempContent)
          tempData.PriceSetNo = this.selectedSet.PriceSetNo
          priceContentAdd(tempData).then(() => {
            this.getContent(this.selectedSet)
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
    handleContentUpdate(row) {
      this.tempContent = Object.assign({}, row) // copy obj
      this.dialogStatus = 'dsContentUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm_content'].clearValidate()
      })
    },
    updateContentData() {
      this.$refs['dataForm_content'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.tempContent)
          console.info(tempData)
          priceContentUpdate(tempData).then(() => {
            this.getContent(this.selectedSet)
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
        this.tempContent = Object.assign({}, row) // copy obj
        this.handleOilPriceDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleContentDeleteMethod(row) {
      priceContentDelete(row).then(() => {
        this.getContent(this.selectedSet)
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // ----------------获取价格体系油站---------------------
    getPriceStation(row) {
      priceStationListQuery(row).then(response => {
        var tempList = response.data.items
        var tempStation = this.listStation.concat()
        console.info(tempStation)
        console.info(tempList)
        for (let i = tempStation.length - 1; i >= 0; i--) {
          for (let k = tempList.length - 1; k >= 0; k--) {
            console.info(tempStation[i].stationno + '?????????' + tempList[k].StationNo)
            if (tempStation[i].stationno === tempList[k].StationNo) {
              tempStation.splice(i--, 1)
            }
          }
        }

        for (let i = tempStation.length - 1; i >= 0; i--) {
          tempList.push({
            PriceSetNo: this.selectedSet.PriceSetNo,
            PriceStationNo: 0,
            StationName: tempStation[i].stationname,
            StationNo: tempStation[i].stationno,
            PUBflag: 0,
            IUpdateFlag: 0
          })
        }

        this.listPriceStation = tempList
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 启用油站
    enableStation(row) {
      this.$confirm('你确定要启用此油站吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStation(row, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 禁用油站
    disableStation(row) {
      this.$confirm('你确定要禁用此油站吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setStation(row, 0)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 设置油站数据提交
    setStation(row, setFlag) {
      var qry = {
        PriceSetNo: this.selectedSet.PriceSetNo,
        StationNo: row.StationNo,
        StationName: row.StationName,
        SetFlag: setFlag
      }
      console.info(qry)
      priceStationSetStation(qry).then(() => {
        this.getPriceStation(this.selectedSet)
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    // -------------------获取价格策略油品-------------------
    getPriceOil(row) {
      var qry = {
        priceContentNo: row.ContentNo
      }
      console.info(qry)
      priceOilListQuery(qry).then(response => {
        var tempList = response.data.items
        var tempOilCode = this.listOilCode.concat()
        console.info(tempOilCode)
        console.info(tempList)
        for (let i = tempOilCode.length - 1; i >= 0; i--) {
          for (let k = tempList.length - 1; k >= 0; k--) {
            console.info(tempOilCode[i].OilCode.trim() + '?????????' + tempList[k].OilCode.trim())
            if (tempOilCode[i].OilCode.trim() === tempList[k].OilCode.trim()) {
              tempOilCode.splice(i--, 1)
            }
          }
        }

        for (let i = tempOilCode.length - 1; i >= 0; i--) {
          tempList.push({
            priceContentNo: this.selectedContent.ContentNo,
            PriceInfoNo: 0,
            OilCode: tempOilCode[i].OilCode.trim(),
            OilName: tempOilCode[i].OilName.trim(),
            NewPrice: 0,
            OldPrice: 0
          })
        }

        this.listContentOilCode = tempList
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    cancelhandleSetOil(row) {
      row.mode = 0
    },
    // 设置油品
    handleSetOil(row, setFlag) {
      let oil = '启用'
      if (setFlag === 0) {
        oil = '禁用'
      }
      this.$confirm('你确定要' + oil + '此油品吗？, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setOil(row, setFlag)
        row.mode = 0
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 设置油品数据提交
    setOil(row, setFlag) {
      var qry = {
        PriceSetContent: this.selectedContent.ContentNo,
        OilCode: row.OilCode,
        OilName: row.OilName,
        NewPrice: row.NewPrice,
        SetFlag: setFlag
      }
      console.info(qry)
      priceContentSetOil(qry).then(() => {
        this.getPriceOil(this.selectedContent)
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
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
      if (this.dialogStatus === 'dsContentAdd') {
        this.addContentData()
        return
      }
      if (this.dialogStatus === 'dsContentUpdate') {
        this.updateContentData()
        return
      }
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
