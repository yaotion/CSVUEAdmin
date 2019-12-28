<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox v-model="listQuery.onlyUnBalance" style="color:red;">查找不平账户</el-checkbox>
      <el-input v-model="listQuery.cardNo" placeholder="请输入卡号" clearable style="width: 200px" class="filter-item" />

      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <div>
      <span style="color:red;font-size:12">{{ getSumText }}
      </span></div>
    <div id="tablePrint" ref="print">
      <el-table
        id="tabData"
        :key="tableKey"
        v-loading="listLoading"
        :show-summary="true"
        :summary-method="getSummaries"
        :data="list"
        size="mini"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="120" />
        <el-table-column label="持卡人" prop="HolderName" align="center" width="80" />
        <el-table-column label="账户名称" prop="AccName" align="center" width="120" />
        <el-table-column label="期初余额" prop="Balance1" align="center" width="80" />
        <el-table-column label="储值" prop="Deposit" align="center" width="80" />
        <el-table-column label="优惠" prop="Pre" align="center" width="70" />
        <el-table-column label="消费" prop="Consume" align="center" width="80" />
        <el-table-column label="扣款" prop="Undeposit" align="center" width="80" />
        <el-table-column label="退钱" prop="Return" align="center" width="70" />
        <el-table-column label="备付金" prop="Refund" align="center" width="70" />
        <el-table-column label="期末余额" prop="Balance2" align="center" width="80" />
        <el-table-column label="差额" prop="Difference" align="center" width="70" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardBalanceQuery } from '@/api/card'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import { tableToExcel } from '@/utils/excelUtils'
export default {
  name: 'CardBalanceQuery',
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
        begintime: '',
        endtime: '',
        cardNo: '',
        onlyUnBalance: 0
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
      cardBalanceQuery(this.listQuery).then(response => {
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
      var fileName = '用户卡平衡表'
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
