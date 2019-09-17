<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>

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
      fit
      size="mini"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" align="center" width="60" />
      <el-table-column label="站点" prop="stationno" align="center" width="90" />
      <el-table-column label="负责人" prop="MasterName" align="center" width="80" />

      <el-table-column label="操作员" prop="OptName" align="center" width="100">
        <template slot-scope="scope2">
          <span>{{ scope2.row.OptName +'|'+ scope2.row.OptNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据号" prop="FrmId" align="center" width="120" />
      <el-table-column label="时间" prop="OptTime" align="center" width="90" />
      <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
      <el-table-column label="持卡人" prop="cardname" align="center" width="80" />
      <el-table-column label="账户名称" prop="AccName" align="center" />
    </el-table>
  </div>
</template>

<script>
import { userSaleTrade } from '@/api/card'
import { stationListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'MarkcardQuery',
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
        stationNo: ''
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

      console.info(this.listQuery)
      userSaleTrade(this.listQuery).then(response => {
        console.info(response)
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
