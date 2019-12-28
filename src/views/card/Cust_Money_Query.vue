<template>
  <div class="app-container">
    <div class="filter-container">

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
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        size="mini"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="账号" prop="AccNo" align="center" width="100" />
        <el-table-column label="账户名称" prop="AccName" align="center" />
        <el-table-column label="存钱" prop="SaveMoney" align="center" width="100" />
        <el-table-column label="优惠" prop="PreMoney" align="center" width="100" />
        <el-table-column label="账户余额" prop="AccBalance" align="center" width="100" />
        <el-table-column label="卡账余额" prop="CardAccBalance" align="center" width="100" />
        <el-table-column label="卡余额" prop="CardBalance" align="center" width="100" />
        <el-table-column label="消费" prop="AccConsume" align="center" width="100" />
        <el-table-column label="冲正" prop="AccCorrect" align="center" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { custMoneyQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CustMoneyQuery',
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
        endtime: ''
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
      custMoneyQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '售卡记录查询'
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
