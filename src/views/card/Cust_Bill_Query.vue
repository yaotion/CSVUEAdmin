<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.AccNo" placeholder="请输入单位编号" clearable style="width: 250px" class="filter-item" />
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
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="时间" prop="OptTime" align="center" width="90" />
        <el-table-column label="站点" prop="StationName" align="center" width="60" />
        <el-table-column label="操作员" prop="OptNo" align="center" width="50" />
        <el-table-column label="存钱" prop="PayAMN" align="center" width="60" />
        <el-table-column label="类型" prop="PayType" align="center" width="50" />
        <el-table-column label="余额" prop="AccBalance" align="center" width="60" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="70" />
        <el-table-column label="卡账" prop="CardAccNo" align="center" width="60" />
        <el-table-column label="划账金额" prop="ChangeAMN" align="center" width="60" />
        <el-table-column label="划账类型" prop="ChangeType" align="center" width="50" />
        <el-table-column label="卡账余额" prop="CardAccBalance" align="center" width="60" />
        <el-table-column label="持有人" prop="HolderName" align="center" width="50" />
        <el-table-column label="储值金额" prop="DepositAMN" align="center" width="60" />
        <el-table-column label="储值类型" prop="DepositType" align="center" width="50" />
        <el-table-column label="消费" prop="ConsumeAMN" align="center" width="60" />
        <el-table-column label="卡余额" prop="CardBalance" align="center" width="60" />
      </el-table>
      <el-table
        v-loading="listLoading"
        :show-header="false"
        :data="sumTable"
        border
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="类型" prop="TypeName" align="center" width="140" />
        <el-table-column label="合计" prop="sumValue" align="center" width="120" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { custBillQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CustBillQuery',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      sumTable: null,
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

    getSumList(row) {
      var listResult = []
      listResult = [
        {
          TypeName: '存钱',
          sumValue: row.SaveMoneys
        },
        {
          TypeName: '优惠',
          sumValue: row.PreMoneys
        },
        {
          TypeName: '冲正',
          sumValue: row.CorrectMoneys
        },
        {
          TypeName: '划账',
          sumValue: row.VirementMoneys
        },
        {
          TypeName: '反划账',
          sumValue: row.UnVirementMoneys
        },
        {
          TypeName: '储值',
          sumValue: row.DepositMoneys
        },
        {
          TypeName: '扣款',
          sumValue: row.UndepositMoneys
        },
        {
          TypeName: '退卡',
          sumValue: row.ReturnMoneys
        },
        {
          TypeName: '消费',
          sumValue: row.TradeMoneys
        }
      ]
      return listResult
    },
    getList() {
      this.listLoading = true
      custBillQuery(this.listQuery).then(response => {
        this.list = response.data.items
        var sum = response.data.sum
        console.log(this.list)
        this.sumTable = this.getSumList(sum)
        console.log(this.sumTable)
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
      var fileName = '单位客户对账单'
      var dataTmp = document.querySelector(tableName)
      try {
        tableToExcel(dataTmp, fileName)
      } finally {
        this.downloadLoading = false
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
