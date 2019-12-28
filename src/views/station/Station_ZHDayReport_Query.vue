<template>
  <div class="app-container">
    <div class="filter-container">

      <el-date-picker v-model="listQuery.bussDate" class="filter-item" type="date" clearable value-format="yyyy-MM-dd" style="width: 150px" placeholder="商务日期" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <div id="tablePrint" ref="print">
      <el-table
        id="tabData"

        :key="tableKey"
        v-loading="listLoading"
        size="mini"
        :data="list"
        :show-summary="true"
        :summary-method="getSummaries1"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="站点" prop="StationNo" align="center" width="90" />
        <el-table-column label="油品编号" prop="Oil_Code" align="center" width="80" />
        <el-table-column label="单价" prop="Price" align="center" width="80" />
        <el-table-column label="试机" prop="SJMoneys" align="center" width="80" />
        <el-table-column label="现金" prop="XJMoneys" align="center" width="80" />
        <el-table-column label="油票" prop="YPMoneys" align="center" width="80" />
        <el-table-column label="银行卡" prop="YHKMoneys" align="center" width="80" />
        <el-table-column label="信用卡" prop="XYKMoneys" align="center" width="80" />
        <el-table-column label="记账" prop="JZMoneys" align="center" width="80" />
        <el-table-column label="其他" prop="QTMoneys" align="center" width="80" />
        <el-table-column label="其他1" prop="QT1Moneys" align="center" width="80" />
        <el-table-column label="所有加油量" prop="TotalQtys" align="center" width="80" />
        <el-table-column label="本月加油量" prop="MonthQtys" align="center" width="80" />
        <el-table-column label="所有加油金额" prop="TotalMoneys" align="center" width="80" />
        <el-table-column label="结束存量" prop="End_li" align="center" width="80" />
        <el-table-column label="可添百分比" prop="CanAdd" align="center" width="80" />
      </el-table>
    </div>
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
import { stationZHDayReportQuery } from '@/api/station'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationZHDayReportQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        bussDate: ''
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

      stationZHDayReportQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSummaries1(param) {
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
      var tableName = '#tabData'
      var fileName = '加油交易明细'
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
