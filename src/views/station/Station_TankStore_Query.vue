<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.StationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.TankNo" placeholder="油罐" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in tankList" :key="item.tankNo" :label="item.tankNo" :value="item.tankNo" />
      </el-select>
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
        <el-table-column label="序号" prop="index" align="center" width="60">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="OptName" align="center" width="100" />
        <el-table-column label="交班时间" prop="OptTime" align="center" width="100" />

        <el-table-column label="交班前" align="center">
          <el-table-column label="高度" prop="StartHeight" align="center" width="80" />
          <el-table-column label="体积" prop="StartQty" align="center" width="80" />
          <el-table-column label="温度" prop="StartTemp" align="center" width="80" />
          <el-table-column label="密度" prop="StartDensity" align="center" width="80" />
          <el-table-column label="重量" prop="StartWeight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="卸油单" align="center">
          <el-table-column label="体积" prop="BillQty" align="center" width="80" />
          <el-table-column label="密度" prop="BillDensity" align="center" width="80" />
          <el-table-column label="重量" prop="BillWeight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="卸油量" align="center">
          <el-table-column label="体积" prop="Qty" align="center" width="80" />
          <el-table-column label="密度" prop="Density" align="center" width="80" />
          <el-table-column label="重量" prop="Weight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="账面数量" align="center">
          <el-table-column label="体积" prop="ZMQty" align="center" width="80" />
          <el-table-column label="重量" prop="ZMWeight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="交班后" align="center">
          <el-table-column label="高度" prop="EndHeight" align="center" width="80" />
          <el-table-column label="体积" prop="EndQty" align="center" width="80" />
          <el-table-column label="温度" prop="EndTemp" align="center" width="80" />
          <el-table-column label="密度" prop="EndDensity" align="center" width="80" />
          <el-table-column label="重量" prop="EndWeight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="损耗" align="center">
          <el-table-column label="重量" prop="LossWeight" align="center" width="80" />
        </el-table-column>
        <el-table-column label="泵码" align="center">
          <el-table-column label="班前泵码" prop="StartPump" align="center" width="100" />
          <el-table-column label="班后泵码" prop="EndPump" align="center" width="100" />
          <el-table-column label="泵码差" prop="PumpDiff" align="center" width="100" />
        </el-table-column>

      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
import { stationTankStoreQuery } from '@/api/station'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { tableToExcel } from '@/utils/excelUtils'
export default {
  name: 'StationTankStoreQuery',
  components: { Pagination },
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
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        TankNo: '',
        StationNo: ''

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
      stationTankStoreQuery(this.listQuery).then(response => {
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var dataTmp = document.querySelector('#tabData')
      try {
        tableToExcel(dataTmp, '油站库存查询')
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
