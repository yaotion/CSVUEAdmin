<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.payway" placeholder="支付方式" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in paywayList" :key="item.Pay_Way" :label="item.Way_Name" :value="item.Pay_Way" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="本班加油明细" name="first">
        <div>
          <el-table
            id="tabData"
            :key="tableKey1"
            v-loading="listLoading"
            :data="list"
            :show-summary="true"
            :summary-method="getSummaries1"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="流水号" prop="Flow_No" align="center" width="80" />
            <el-table-column label="枪号" prop="Terminal" align="center" width="80" />
            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="100" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />
            <el-table-column label="单价" prop="Price" align="center" width="100" />
            <el-table-column label="加油量" prop="Qty" align="center" width="100" />
            <el-table-column label="金额" prop="Money" align="center" width="100" />
            <el-table-column label="付款方式" prop="Way_Name" align="center" width="80" />
            <el-table-column label="加油时间" prop="Mach_Time" align="center" width="160" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本班按油品统计" name="second">
        <div>
          <el-table
            id="tabData2"
            :key="tableKey2"
            v-loading="listLoading"
            :data="listByOil"
            :show-summary="true"
            :summary-method="getSummaries2"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />

            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="100" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />

            <el-table-column label="营业量" prop="SumQty" align="center" width="100" />
            <el-table-column label="营业额" prop="SumMoney" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本班按油枪统计" name="third">
        <div>
          <el-table
            id="tabData3"
            :key="tableKey3"
            v-loading="listLoading"
            :data="listByTerminal"
            :show-summary="true"
            :summary-method="getSummaries3"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" type="index" align="center" width="60" />
            <el-table-column label="油枪" prop="Terminal" align="center" width="100" />
            <el-table-column label="油品名称" prop="Oil_Name" align="center" width="100" />
            <el-table-column label="油品编号" prop="Oil_Code" align="center" width="100" />
            <el-table-column label="营业量" prop="SumQty" align="center" width="100" />
            <el-table-column label="营业额" prop="SumMoney" align="center" width="100" />

          </el-table>
        </div></el-tab-pane>

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
import { stationListQuery, paywayListQuery } from '@/api/base'
import { stationShiftNowYYLDetailQuery, stationShiftNowYYLByOilQuery,
  stationShiftNowYYLByTerminalQuery } from '@/api/station'
import { tableToExcel } from '@/utils/excelUtils'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationShiftNoYYLQuery',
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
      listLoading: true,
      stationList: null,
      paywayList: null,
      listQuery: {
        stationNo: '',
        payway: -1
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getStationList()
    this.getPayWayList()
    this.getShiftNoYYLDetail()
    this.getShiftNoYYLByOil()
    this.getShiftNoYYLByTerminal()
  },
  methods: {
    getPayWayList() {
      this.listLoading = true
      paywayListQuery(this.listQuery).then(response => {
        this.paywayList = response.data.items
        this.paywayList.unshift({
          Pay_Way: -1,
          Way_Name: '全部'
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
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
    getShiftNoYYLDetail() {
      this.listLoading = true
      stationShiftNowYYLDetailQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getShiftNoYYLByOil() {
      this.listLoading = true
      stationShiftNowYYLByOilQuery(this.listQuery).then(response => {
        this.listByOil = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getShiftNoYYLByTerminal() {
      this.listLoading = true
      stationShiftNowYYLByTerminalQuery(this.listQuery).then(response => {
        this.listByTerminal = response.data.items
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

    handleFilter() {
      this.getShiftNoYYLDetail()
      this.getShiftNoYYLByOil()
      this.getShiftNoYYLByTerminal()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '本班营业量加油明细'
      if (this.activeName === 'second') {
        tableName = '#tabData2'
        fileName = '本班营业量按油品统计'
      }
      if (this.activeName === 'third') {
        tableName = '#tabData3'
        fileName = '本班营业量按油枪统计'
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
