<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item" @change="getStationTankList">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="date" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="date" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-select v-model="listQuery.TankNo" placeholder="油罐" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in tankList" :key="item" :label="item" :value="item" />
      </el-select>

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
        v-loading="listLoading"
        :show-summary="true"
        :summary-method="getSummaries"
        :data="list"
        size="mini"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="姓名" prop="Emp_Name" align="center" width="100" />
        <el-table-column label="交班时间" prop="AddTime" align="center" width="100" />

        <el-table-column label="交班前" align="center">
          <el-table-column label="高度" prop="Start_Oilh" align="center" width="80" />
          <el-table-column label="体积" prop="Start_Vol" align="center" width="80" />
          <el-table-column label="温度" prop="Start_Temp" align="center" width="80" />
          <el-table-column label="密度" prop="Start_Dens" align="center" width="80" />
          <el-table-column label="重量" prop="Start_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="卸油单" align="center">
          <el-table-column label="体积" prop="Doc_Vol" align="center" width="80" />
          <el-table-column label="密度" prop="Doc_Dens" align="center" width="80" />
          <el-table-column label="重量" prop="Doc_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="卸油量" align="center">
          <el-table-column label="体积" prop="Qty_Vol" align="center" width="80" />
          <el-table-column label="密度" prop="Qty_Dens" align="center" width="80" />
          <el-table-column label="重量" prop="Qty_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="账面数量" align="center">
          <el-table-column label="体积" prop="Acco_Vol" align="center" width="80" />
          <el-table-column label="重量" prop="Acco_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="交班后" align="center">
          <el-table-column label="高度" prop="End_Oilh" align="center" width="80" />
          <el-table-column label="体积" prop="End_Vol" align="center" width="80" />
          <el-table-column label="温度" prop="End_Temp" align="center" width="80" />
          <el-table-column label="密度" prop="End_Dens" align="center" width="80" />
          <el-table-column label="重量" prop="End_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="损耗" align="center">
          <el-table-column label="重量" prop="Loss_Wt" align="center" width="80" />
        </el-table-column>
        <el-table-column label="泵码" align="center">
          <el-table-column label="班前泵码" prop="Start_Pump" align="center" width="100" />
          <el-table-column label="班后泵码" prop="End_Pump" align="center" width="100" />
          <el-table-column label="泵码差" prop="Diff_Pump" align="center" width="100" />
        </el-table-column>

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
import { stationTankShiftQuery, stationStationTanks } from '@/api/station'
import { stationListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationTankShiftQuery',
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
      tankList: null,
      listQuery: {
        begintime: '',
        endtime: '',
        TankNo: '',
        stationNo: ''
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
    this.getStationList()
  },
  methods: {
    getStationTankList() {
      stationStationTanks(this.listQuery).then(response => {
        this.tankList = response.data.items
      })
    },
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
      stationTankShiftQuery(this.listQuery).then(response => {
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
        if ((index >= 1) && (index <= 12)) {
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
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '油罐库存记录查询'
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
