<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.CardNo" placeholder="请输入卡号" clearable style="width: 210px" class="filter-item" />
      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-date-picker v-model="listQuery.begintime" style="width: 200px" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" style="width: 200px" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
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
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="礼品名称" prop="GoodsName" align="center" />
      <el-table-column label="时间" prop="OptTime" align="center" width="160" />
      <el-table-column label="数量" prop="GoodsNum" align="center" width="100" />
      <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
      <el-table-column label="消费积分" prop="GoodsCent" align="center" width="100" />
      <el-table-column label="剩余积分" prop="CurCent" align="center" width="100" />
      <el-table-column label="站点编号" prop="StationNo" align="center" width="100" />
    </el-table>
  </div>
</template>

<script>
import { cardScorePayQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardScorePayQuery',
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
        stationNo: '',
        CardNo: ''
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getStationList()
    this.getList()
  },
  methods: {
    getStationList() {
      this.listLoading = true
      stationListQuery(this.listQuery).then(response => {
        this.stationList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true
      cardScorePayQuery(this.listQuery).then(response => {
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
      var fileName = '用户卡积分兑换记录'
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
