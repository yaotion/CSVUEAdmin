<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox v-model="checked" style="color:red;">查找不平账户</el-checkbox>
      <el-input v-model="listQuery.CardNo" placeholder="请输入卡号" clearable style="width: 200px" class="filter-item" />

      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
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
        :id="table"
        :key="tableKey"
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

        <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
        <el-table-column label="持卡人" prop="MasterName" align="center" width="90" />
        <el-table-column label="账户名称" prop="AccName" align="center" width="160" />
        <el-table-column label="起初余额" prop="StartAmt" align="center" width="90" />
        <el-table-column label="储值" prop="DepositMoney" align="center" width="90" />
        <el-table-column label="优惠" prop="PreMoney" align="center" width="90" />
        <el-table-column label="消费" prop="TradeMoney" align="center" width="90" />
        <el-table-column label="扣款" prop="DeDepositMoney" align="center" width="90" />
        <el-table-column label="退钱" prop="ReturnMoney" align="center" width="90" />
        <el-table-column label="备付金" prop="RemarkMoney" align="center" width="90" />
        <el-table-column label="期末余额" prop="EndAmt" align="center" width="90" />
        <el-table-column label="差额" prop="DiffMoney" align="center" width="90" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardBalanceQuery } from '@/api/card'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardBalanceQuery',
  components: { Pagination },
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
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        CardNo: '',
        checked: false
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
          filename: '用户卡平衡表'
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
