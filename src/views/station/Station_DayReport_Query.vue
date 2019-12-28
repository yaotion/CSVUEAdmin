<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>

      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="date" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="date" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="按油枪统计" name="first">
        <div>
          <el-table
            id="tabData1"
            :key="tableKey1"
            v-loading="listLoading"
            :data="listByTerminal"
            :show-summary="true"
            :summary-method="getSummaries1"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="枪号" prop="Terminal" align="center" width="90" />
            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="90" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />
            <el-table-column label="起始累计数" prop="Pump_Qty1" align="center" width="180" />
            <el-table-column label="截止累计数" prop="Pump_Qty2" align="center" width="180" />
            <el-table-column label="营业数量" prop="Sum_Qty" align="center" width="115" />
            <el-table-column label="营业金额" prop="Sum_Money" align="center" width="115" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按油品统计" name="second">
        <div>
          <el-table
            id="tabData2"
            :key="tableKey2"
            v-loading="listLoading"
            :data="listByOil"
            :show-summary="true"
            :summary-method="getSummaries2"
            border
            size="mini"
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />

            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="80" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="80" />
            <el-table-column label="单价" prop="Price" align="center" width="80" />
            <el-table-column label="试机油量" prop="SJQtys" align="center" width="80" />
            <el-table-column label="试机金额" prop="SJMoneys" align="center" width="80" />
            <el-table-column label="现金油量" prop="XJQtys" align="center" width="80" />
            <el-table-column label="现金金额" prop="XJMoneys" align="center" width="80" />
            <el-table-column label="邮票油量" prop="YPQtys" align="center" width="80" />
            <el-table-column label="邮票金额" prop="YPMoneys" align="center" width="80" />
            <el-table-column label="银行卡量" prop="YHKQtys" align="center" width="80" />
            <el-table-column label="银行卡金额" prop="YHKMoneys" align="center" width="80" />
            <el-table-column label="信用卡油量" prop="XYKQtys" align="center" width="80" />
            <el-table-column label="信用卡金额" prop="XYKMoneys" align="center" width="80" />
            <el-table-column label="记账油量" prop="JZQtys" align="center" width="80" />
            <el-table-column label="记账金额" prop="JZMoneys" align="center" width="80" />
            <el-table-column label="其他油量" prop="QTQtys" align="center" width="80" />
            <el-table-column label="其他金额" prop="QTMoneys" align="center" width="80" />
            <el-table-column label="其他1油量" prop="QT1Qtys" align="center" width="80" />
            <el-table-column label="其他1金额" prop="QT1Moneys" align="center" width="80" />
            <el-table-column label="微信油量" prop="WXQtys" align="center" width="80" />
            <el-table-column label="微信金额" prop="WXMoneys" align="center" width="80" />
            <el-table-column label="支付宝油量" prop="ZFBQtys" align="center" width="80" />
            <el-table-column label="支付宝金额" prop="ZFBMoneys" align="center" width="80" />
            <el-table-column label="银联油量" prop="YLQtys" align="center" width="80" />
            <el-table-column label="银联金额" prop="YLMoneys" align="center" width="80" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按罐进销存统计" name="third">
        <div>
          <el-table
            id="tabData3"
            :key="tableKey3"
            v-loading="listLoading"
            :data="listByTank"
            :show-summary="true"
            :summary-method="getSummaries3"
            border
            size="mini"
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="油罐" prop="Tank_No" align="center" width="80" />
            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="100" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />
            <el-table-column label="起始存量" prop="Start_li" align="center" width="100" />
            <el-table-column label="添油量" prop="Add_li" align="center" width="100" />
            <el-table-column label="发油量" prop="Sale_li" align="center" width="100" />
            <el-table-column label="截止存量" prop="End_li" align="center" width="100" />
            <el-table-column label="损耗量" prop="Lost_li" align="center" width="100" />

          </el-table>
        </div></el-tab-pane>
      <el-tab-pane label="按加油员加油量统计" name="fourth">
        <div>
          <el-table
            id="tabData4"
            :key="tableKey4"
            v-loading="listLoading"
            :data="listByOpt"
            :show-summary="true"
            :summary-method="getSummaries4"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="油站编号" prop="StationNo" align="center" width="100" />
            <el-table-column label="操作员" prop="Emp_No" align="center" width="100" />
            <el-table-column label="操作姓名" prop="Emp_Name" align="center" width="100" />
            <el-table-column label="加油量" prop="Sum_Qty" align="center" width="120" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按收款员收款金额统计" name="five">
        <div>
          <el-table
            id="tabData5"
            :key="tableKey5"
            v-loading="listLoading"
            :data="listByCashier"
            :show-summary="true"
            :summary-method="getSummaries5"
            border
            fit
            size="mini"
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="油站编号" prop="StationNo" align="center" width="100" />
            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="100" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />
            <el-table-column label="收款员编号" prop="Emp_No" align="center" width="100" />
            <el-table-column label="现金金额" prop="XJMoneys" align="center" width="100" />
            <el-table-column label="邮票金额" prop="YPMoneys" align="center" width="100" />
            <el-table-column label="银行卡金额" prop="YHKMoneys" align="center" width="100" />
            <el-table-column label="记账金额" prop="JZMoneys" align="center" width="100" />
            <el-table-column label="其他金额" prop="QTMoneys" align="center" width="100" />
            <el-table-column label="其他1金额" prop="QT1Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style >

.el-table{
    overflow: auto;
}
 .el-table__header-wrapper,
 .el-table__body-wrapper,
 .el-table__footer-wrapper{
          overflow:visible;
    }
  .el-table__body-wrapper{
    overflow-x:visible !important;
  }
  /* 这个是为了解决前面样式覆盖之后伪类带出来的竖线 */
 .el-table::after{
    position: relative;
 }
</style>
<script>
import { stationListQuery } from '@/api/base'
import { stationDayReportByTerminalQuery, stationDayReportByOilQuery,
  stationDayReportByTankQuery, stationDayReportByEmpQty, stationDayReportByEmpMoney
} from '@/api/station'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import { tableToExcel } from '@/utils/excelUtils'
export default {
  name: 'StationDayReportQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey1: 0,
      tableKey2: 0,
      tableKey3: 0,
      tableKey4: 0,
      tableKey5: 0,
      list: null,
      total: 0,
      activeName: 'first',
      listByTerminal: null,
      listByOil: null,
      listByTank: null,
      listByOpt: null,
      listByCashier: null,
      listLoading: true,
      stationList: null,
      timespan: null,
      listQuery: {
        begintime: '',
        endtime: '',
        stationNo: ''
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

    getStationList() {
      this.listLoading = true
      stationListQuery(this.listQuery).then(response => {
        this.stationList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDayReportByTerminal() {
      this.listLoading = true
      stationDayReportByTerminalQuery(this.listQuery).then(response => {
        this.listByTerminal = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getDayReportByOil() {
      this.listLoading = true
      stationDayReportByOilQuery(this.listQuery).then(response => {
        this.listByOil = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDayReportByTank() {
      this.listLoading = true
      stationDayReportByTankQuery(this.listQuery).then(response => {
        this.listByTank = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDayReportByOpt() {
      this.listLoading = true
      stationDayReportByEmpQty(this.listQuery).then(response => {
        this.listByOpt = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDayReportByCashier() {
      this.listLoading = true
      stationDayReportByEmpMoney(this.listQuery).then(response => {
        this.listByCashier = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getList() {
      this.getStationList()
      this.getDayReportByTerminal()
      this.getDayReportByOil()
      this.getDayReportByTank()
      this.getDayReportByOpt()
      this.getDayReportByCashier()
    },
    getSummaries1(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 5)) {
          sums[index] = '---'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = '---'
        }
      })
      return sums
    },
    getSummaries2(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 2)) {
          sums[index] = '---'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = '---'
        }
      })
      return sums
    },
    getSummaries3(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 3)) {
          sums[index] = '---'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = '---'
        }
      })
      return sums
    },
    getSummaries4(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 4)) {
          sums[index] = '---'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = '---'
        }
      })
      return sums
    },
    getSummaries5(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 3)) {
          sums[index] = '---'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return (prev + curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = '---'
        }
      })
      return sums
    },
    handleFilter() {
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData1'
      var fileName = '加油报表按油枪统计'
      if (this.activeName === 'first') {
        tableName = '#tabData1'
        fileName = '加油报表按油枪统计'
      }
      if (this.activeName === 'second') {
        tableName = '#tabData2'
        fileName = '加油报表按油拼统计'
      }
      if (this.activeName === 'third') {
        tableName = '#tabData3'
        fileName = '加油报表按油罐统计'
      }
      if (this.activeName === 'fourth') {
        tableName = '#tabData1'
        fileName = '加油报表按员工加油量统计'
      }
      if (this.activeName === 'fiveth') {
        tableName = '#tabData1'
        fileName = '加油报表按员工加油金额统计'
      }
      var dataTmp = document.querySelector(tableName)

      try {
        tableToExcel(dataTmp, fileName)
      } finally {
        this.downloadLoading = false
      }
    }
  }
}
</script>
