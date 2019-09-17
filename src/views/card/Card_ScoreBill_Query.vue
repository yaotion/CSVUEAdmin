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
      <el-table-column label="时间" prop="optTime" align="center" width="160" />
      <el-table-column label="类型" prop="ScoreType" align="center" width="100" />
      <el-table-column label="积分" prop="Score" align="center" width="100" />
      <el-table-column label="剩余积分" prop="ScoreBalance" align="center" width="100" />
      <el-table-column label="奖品/油品" prop="AWard" align="center" width="400" />

    </el-table>
  </div>
</template>

<script>
import { cardScoreBillQuery } from '@/api/card'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardScoreBillQuery',
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
      cardScoreBillQuery(this.listQuery).then(response => {
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
        const tHeader = ['序号', '时间', '类型', '积分', '剩余积分', '奖品/油品']
        const filterVal = ['index', 'machTime', 'ScoreTpe', 'Score', 'ScoreBalance', 'AWard']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户卡积分账单'
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
