<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>

      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
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
            <el-table-column label="序号" prop="index" align="center" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="枪号" prop="Terminal" align="center" width="90" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="90" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="起始累计数" prop="PumpStart" align="center" width="180" />
            <el-table-column label="截止累计数" prop="PumpEnd" align="center" width="180" />
            <el-table-column label="营业数量" prop="Qtys" align="center" width="115" />
            <el-table-column label="营业金额" prop="Moneys" align="center" width="115" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按油品统计" name="second">
        <div>
          <el-table
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
            <el-table-column label="序号" prop="index" align="center" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>

            <el-table-column label="油品名称" prop="OilName" align="center" width="80" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="80" />
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
            <el-table-column label="序号" prop="index" align="center" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>
            <el-table-column label="油罐" prop="TankNo" align="center" width="80" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />

            <el-table-column label="起始存量" prop="StartQty" align="center" width="100" />
            <el-table-column label="添油量" prop="AddQty" align="center" width="100" />
            <el-table-column label="发油量" prop="TradeQty" align="center" width="100" />
            <el-table-column label="截止存量" prop="EndQty" align="center" width="100" />
            <el-table-column label="损耗量" prop="DiffQty" align="center" width="100" />

          </el-table>
        </div></el-tab-pane>
      <el-tab-pane label="按加油员加油量统计" name="fourth">
        <div>
          <el-table
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
            <el-table-column label="序号" prop="index" align="center" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>

            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="操作员" prop="OptNo" align="center" width="80" />
            <el-table-column label="操作姓名" prop="OptName" align="center" width="80" />
            <el-table-column label="加油量" prop="Qtys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按收款员收款金额统计" name="five">
        <div>
          <el-table
            :key="tableKey5"
            v-loading="listLoading"
            :data="listByCashier"
            :show-summary="true"
            :summary-method="getSummaries5"
            border
            fit
            highlight-current-row
            style="width: 100%;"
          >
            <el-table-column label="序号" prop="index" align="center" width="60">
              <template slot-scope="scope">
                <span>{{ scope.row.index }}</span>
              </template>
            </el-table-column>

            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="收款员编号" prop="CashierNo" align="center" width="100" />
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
import { cardInoutQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
import { stationDayReportByTerminalQuery, stationDayReportByOilQuery,
  stationDayReportByTankQuery, stationDayReportByOptQuery, stationDayReportByCashierQuery
} from '@/api/station'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'StationDayReportQuery',
  components: { Pagination },
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
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: ''
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getStationList()
    this.getDayReportByTerminal()
    this.getDayReportByOil()
    this.getDayReportByTank()
    this.getDayReportByOpt()
    this.getDayReportByCashier()
  },
  methods: {
    getBegintime() {
      if (this.timespan && this.timespan[0]) {
        return this.timespan[0].toString()
      }
      return null
    },
    getEndtime() {
      if (this.timespan && this.timespan[1]) {
        return this.timespan[1].toString()
      }
      return null
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
      stationDayReportByOptQuery(this.listQuery).then(response => {
        this.listByOpt = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getDayReportByCashier() {
      this.listLoading = true
      stationDayReportByCashierQuery(this.listQuery).then(response => {
        this.listByCashier = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getList() {
      this.listLoading = true
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()
      cardInoutQuery(this.listQuery).then(response => {
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
      this.listQuery.page = 1
      // this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '发卡点', '操作员', '操作员编号', '时间', '卡号', '种类', '数量']
        const filterVal = ['index', 'StationNo', 'OptName', 'OptNo', 'OptTime', 'CardNo', 'CardTypeName', 'CardCount']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '油站日报查询'
        })
        this.downloadLoading = false
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
