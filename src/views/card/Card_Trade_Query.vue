<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.CardNo" placeholder="请输入卡号" clearable style="width: 200px" class="filter-item" />
      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="index" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="machTime" align="center" width="160" />
      <el-table-column label="类型" prop="TradeType" align="center" width="80" />
      <el-table-column label="数量" prop="Qty" align="center" width="80" />
      <el-table-column label="金额" prop="Money" align="center" width="80" />
      <el-table-column label="余额" prop="Balance" align="center" width="80" />
      <el-table-column label="油品" prop="OilName" align="center" width="80" />
      <el-table-column label="单价" prop="Price" align="center" width="80" />
      <el-table-column label="站点" prop="stationno" align="center" width="100" />
      <el-table-column label="操作员" prop="OptName" align="center" width="100">
        <template slot-scope="scope2">
          <span>{{ scope2.row.OptName +'|'+ scope2.row.OptNo }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { cardTradeQuery } from '@/api/card'
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
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: '',
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '时间', '类型', '升数', '金额', '余额', '油品', '单价', '油站', '操作员编号', '操作员姓名']
        const filterVal = ['index', 'machTime', 'TradeType', 'Qty', 'Money', 'Balance', 'OilName', 'Price', 'stationno', 'OptNo', 'OptName']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户卡消费情况'
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
