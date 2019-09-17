<template>
  <div class="app-container">
    <div class="filter-container">
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
        :data="list"
        size="mini"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="类型" prop="TypeName" align="center" width="90" />
        <el-table-column label="数量" prop="Qty" align="center" width="90" />
        <el-table-column label="金额" prop="Amn" align="center" width="90" />
        <el-table-column label="余额" prop="Bal" align="center" width="90" />
        <el-table-column label="时间" prop="OptTime" align="center" width="160" />

        <el-table-column label="油品" prop="OilName" align="center" width="80" />
        <el-table-column label="单价" prop="Price" align="center" width="80" />
        <el-table-column label="站点" prop="StationName" align="center" />
        <el-table-column label="操作员" prop="OptNo" align="center" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardBillQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardBillQuery',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      sum: {
        // 交易总升数
        TradeQtys: 0,
        // 交易总金额
        TradeMoneys: 0,
        // 扣款总金额
        DeSaveMoneys: 0,
        // 储值存钱总金额
        SaveMoneys: 0,
        // 优惠返还总金额
        PreMoneys: 0
      },
      list: null,
      total: 0,
      listLoading: true,
      stationList: null,
      listQuery: {
        begintime: '',
        endtime: '',
        cardNo: ''
      },
      downloadLoading: false
    }
  },
  computed: {
    getSumText() {
      var sumTextFormat = '合计：加油共0升，0元；扣款0元，储值/存钱0元，优惠0元'
      if (this.sum === undefined) { return sumTextFormat }
      return '合计：加油共' + this.sum.TradeQtys + '升，' + this.sum.TradeMoneys + '元；扣款' + this.sum.DeSaveMoneys + '元，储值/存钱' + this.sum.SaveMoneys + '元，优惠' + this.sum.PreMoneys + '元'
    }

  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
      cardBillQuery(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.items
        this.sum = response.data.sum
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
      var fileName = '用户卡对账单'
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
