<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.CardNo" placeholder="请输入卡号" clearable style="width: 250px" class="filter-item" />
      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      id="tabData"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      size="mini"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="时间" prop="OptTime" align="center" width="160" />
      <el-table-column label="类型" prop="TradeType" align="center" width="80" />
      <el-table-column label="数量" prop="Qty" align="center" width="80" />
      <el-table-column label="金额" prop="AMN" align="center" width="80" />
      <el-table-column label="余额" prop="BAL" align="center" width="80" />
      <el-table-column label="油品" prop="OilName" align="center" width="80" />
      <el-table-column label="单价" prop="Price" align="center" width="80" />
      <el-table-column label="站点" prop="StationName" align="center" />
      <el-table-column label="操作员" prop="OptNo" align="center" width="100" />
    </el-table>
  </div>
</template>

<script>
import { cardTradeQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardTradeQuery',
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
      stationList: null,

      listQuery: {
        begintime: '',
        endtime: '',
        CardNo: ''
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
      cardTradeQuery(this.listQuery).then(response => {
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
      var fileName = '用户卡消费信息'
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
