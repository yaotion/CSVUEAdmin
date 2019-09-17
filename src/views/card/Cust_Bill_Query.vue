<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.CardNo" placeholder="请输入单位编号" clearable style="width: 200px" class="filter-item" />
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
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="index" align="center" width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="OptTime" align="center" width="90" />
        <el-table-column label="站点" prop="stationno" align="center" width="60" />
        <el-table-column label="操作员" prop="OptNo" align="center" width="50" />
        <el-table-column label="存钱" prop="SaveMoney" align="center" width="60" />
        <el-table-column label="类型" prop="SaveType" align="center" width="50" />
        <el-table-column label="余额" prop="AccMoney" align="center" width="60" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="70" />
        <el-table-column label="卡账" prop="AccName" align="center" width="60" />
        <el-table-column label="划账金额" prop="ChangeMoney" align="center" width="60" />
        <el-table-column label="划账类型" prop="ChangeType" align="center" width="50" />
        <el-table-column label="卡账余额" prop="AccBalance" align="center" width="60" />
        <el-table-column label="持有人" prop="Master" align="center" width="50" />
        <el-table-column label="储值金额" prop="DepositMoney" align="center" width="60" />
        <el-table-column label="储值类型" prop="DepositType" align="center" width="50" />
        <el-table-column label="消费" prop="TradeMoney" align="center" width="60" />
        <el-table-column label="卡余额" prop="Balance" align="center" width="60" />
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
          sumValue: row.ReSaveMoneys
        },
        {
          TypeName: '划账',
          sumValue: row.ChangeMoneys
        },
        {
          TypeName: '反划账',
          sumValue: row.ReChangeMoneys
        },
        {
          TypeName: '储值',
          sumValue: row.DepositMoneys
        },
        {
          TypeName: '扣款',
          sumValue: row.ReDepositMoneys
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
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '发卡点', '负责人', '单据编号', '操作员', '操作员编号', '时间', '卡号', '原因']
        const filterVal = ['index', 'stationno', 'MasterName', 'FrmId', 'OptName', 'OptNo', 'OptTime', 'CardNo', 'Reason']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '单位客户对账单'
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
