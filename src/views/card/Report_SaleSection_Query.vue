<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.StationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
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

    <div id="tablePrint" ref="print">
      <el-table
        v-loading="listLoading"
        :show-summary="true"
        :summary-method="getSummaries"
        :data="list"
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

        <el-table-column label="油品" prop="OilName" align="center" width="80" />
        <el-table-column label="单价" prop="Price" align="center" width="60" />
        <el-table-column label="现金" align="center">
          <el-table-column label="升数" prop="CashQty" align="center" width="80" />
          <el-table-column label="金额" prop="CashMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="银联" align="center">
          <el-table-column label="升数" prop="BankQty" align="center" width="80" />
          <el-table-column label="金额" prop="BankMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="微信支付宝" align="center">
          <el-table-column label="升数" prop="NetQty" align="center" width="80" />
          <el-table-column label="金额" prop="NetMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="散户卡" align="center">
          <el-table-column label="升数" prop="CardQty" align="center" width="80" />
          <el-table-column label="金额" prop="CardMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="客户卡" align="center">
          <el-table-column label="升数" prop="CustQty" align="center" width="80" />
          <el-table-column label="金额" prop="CustMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="记账卡" align="center">
          <el-table-column label="升数" prop="BookQty" align="center" width="80" />
          <el-table-column label="金额" prop="BookMoney" align="center" width="80" />
        </el-table-column>
        <el-table-column label="合计" align="center">
          <el-table-column label="升数" prop="SumQty" align="center" width="80" />
          <el-table-column label="金额" prop="SumMoney" align="center" width="80" />
        </el-table-column>
      </el-table>
    </div>

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
import { reportSaleSectionQuery } from '@/api/report'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'ReportSaleSectionQuery',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      list: null,
      total: 0,

      listLoading: true,
      stationList: null,
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        StationNo: ''
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

    getList() {
      this.listLoading = true
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()
      reportSaleSectionQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index === 1) {
          sums[index] = '---'
          return
        }
        if (index === 2) {
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
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '卡号', '持卡人', '账户名称', '期初', '储值', '优惠', '消费', '扣款', '退钱', '备付金', '期末余额', '差额']
        const filterVal = ['index', 'CardNo', 'MasterName', 'AccName', 'StartAmt', 'DepositMoney', 'PreMoney', 'TradeMoney', 'DeDepositMoney', 'ReturnMoney', 'RemarkMoney', 'EndAmt', 'DiffMoney']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '油品销售区间报表'
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
