<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <div id="tablePrint" ref="print">
      <el-table
        id="tabData"
        v-loading="listLoading"
        :data="list"
        size="mini"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="批次" prop="TransOrder" align="center" width="100" />
        <el-table-column label="站点" prop="StationNo" align="center" width="80" />
        <el-table-column label="油罐" prop="Tank_No" align="center" width="50" />
        <el-table-column label="油品" prop="Oil_Name" align="center" width="60" />
        <el-table-column label="直径" prop="Tank_Diameter" align="center" width="60" />
        <el-table-column label="长度" prop="Tank_Length" align="center" width="60" />
        <el-table-column label="最大容积" prop="Max_Volume" align="center" width="60" />

        <el-table-column label="高油位报警" align="center">
          <el-table-column label="高油位" prop="High_Oil" align="center" width="60" />
          <el-table-column label="高高油位" prop="High_High_Oil" align="center" width="60" />
        </el-table-column>
        <el-table-column label="低油位报警" align="center">
          <el-table-column label="低油位" prop="Low_Oil" align="center" width="60" />
          <el-table-column label="低低油位" prop="Low_Low_Oil" align="center" width="60" />
        </el-table-column>
        <el-table-column label="高水位报警高度" prop="High_Water" align="center" width="60" />
        <el-table-column label="温度报警" align="center">
          <el-table-column label="高温" prop="High_Temp" align="center" width="60" />
          <el-table-column label="低温" prop="Low_Temp" align="center" width="60" />
        </el-table-column>
        <el-table-column label="基本油差" align="center">
          <el-table-column label="油位" prop="Oil_Offset" align="center" width="60" />
          <el-table-column label="水位" prop="Water_Offset" align="center" width="60" />
        </el-table-column>
        <el-table-column label="修改时间" prop="UpdateTime" align="center" width="140" />
      </el-table>
    </div>
  </div>
</template>
<style >

.el-table{
    overflow: auto;
}
 .el-table__header-wrapper,
 .el-table__body-wrapper,
 .el-table__footer-wrapper{
          overflow:visible;
    }
  .el-table__body-wrapper{
    overflow-x:visible !important;
  }
  /* 这个是为了解决前面样式覆盖之后伪类带出来的竖线 */
 .el-table::after{
    position: relative;
 }
</style>
<script>
import { stationTankChangeQuery } from '@/api/station'
import { tableToExcel } from '@/utils/excelUtils'
import { stationListQuery } from '@/api/base'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationTankChangeQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
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
      stationTankChangeQuery(this.listQuery).then(response => {
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
      var fileName = '油罐信息查询'
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
