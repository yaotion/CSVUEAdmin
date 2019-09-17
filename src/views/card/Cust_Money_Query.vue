<template>
  <div class="app-container">
    <div class="filter-container">

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
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="index" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="AccNo" align="center" width="100" />
        <el-table-column label="账户名称" prop="AccName" align="center" width="300" />
        <el-table-column label="存钱" prop="SaveMoney" align="center" width="100" />

        <el-table-column label="优惠" prop="PreMoney" align="center" width="100" />
        <el-table-column label="账户余额" prop="AccBalance" align="center" width="100" />
        <el-table-column label="卡账余额" prop="CardAccBalance" align="center" width="100" />
        <el-table-column label="卡余额" prop="CardBalance" align="center" width="100" />
        <el-table-column label="消费" prop="TradeMoney" align="center" width="100" />
        <el-table-column label="冲正" prop="DeSaveMoney" align="center" width="100" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { custMoneyQuery } from '@/api/card'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CustMoneyQuery',
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '账号', '账户名称', '存钱', '优惠', '账户余额', '卡账余额', '卡余额', '消费', '冲正']
        const filterVal = ['index', 'AccNo', 'AccName', 'SaveMoney', 'PreMoney', 'AccBalance', 'CardAccBalance', 'CardBalance', 'TradeMoney', 'DeSaveMoney']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '单位账户信息查询'
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
