<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>

      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
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
        v-loading="listLoading"
        :show-summary="true"
        size="mini"
        :summary-method="getSummaries"
        :data="sum"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="油品" prop="StationNo" align="center" width="80" />
        <el-table-column label="油品" prop="Oil_Code" align="center" width="80" />
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
import { reportSaleSectionQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
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
        begintime: '',
        endtime: '',
        StationNo: ''
      },
      downloadLoading: false
    }
  },
  computed: {
    sum: function() {
      var rlt = []
      if (this.list === null) return rlt

      this.list.forEach(element => {
        var item
        if (rlt.length > 0) {
          item = rlt.find(function(x) {
            if ((x.StationNo === element.StationNo) && (x.Oil_Code === element.Oil_Code) && (x.Price === element.Price)) {
              return true
            }
          })
        }
        if (item === undefined) {
          item = {
            StationNo: element.StationNo,
            Oil_Code: element.Oil_Code,
            Price: element.Price,
            CashQty: 0,
            CashMoney: 0,
            BankQty: 0,
            BankMoney: 0,
            NetQty: 0,
            NetMoney: 0,
            CardQty: 0,
            CardMoney: 0,
            CustQty: 0,
            CustMoney: 0,
            BookQty: 0,
            BookMoney: 0,
            SumQty: 0,
            SumMoney: 0
          }
          rlt.push(item)
        }
        item.SumQty += element.SumQty
        item.SumMoney += element.SumMoney
        switch (element.PAY_WAY) {
          case 1:// 现金
            item.CashQty += element.SumQty
            item.CashMoney += element.SumMoney
            break
          case 12:// 银联
            item.BankQty += element.SumQty
            item.BankMoney += element.SumMoney
            break
          case 9: // 微信支付宝
          case 11:
          case 13:
          case 14:
            item.NetQty += element.SumQty
            item.NetMoney += element.SumMoney
            break
          case 4: // IC卡
            // 记账卡
            if (element.IsJiZhang === 1) {
              item.BookQty += element.SumQty
              item.BookMoney += element.SumMoney
            } else if (element.CardAcc === 'cust') {
              // 客户卡
              item.BookQty += element.SumQty
              item.BookMoney += element.SumMoney
            } else {
              // 散户卡
              item.CardQty += element.SumQty
              item.CardMoney += element.SumMoney
            }
            break
        }
      })
      return rlt
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
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
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '销售区间报表'
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
