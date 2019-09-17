<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.StationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.TankNo" placeholder="油罐" clearable style="width: 200px" class="filter-item">
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
        v-loading="listLoading"
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
        <el-table-column label="批次" prop="BatID" align="center" width="100" />
        <el-table-column label="站点" prop="StationNo" align="center" width="80" />
        <el-table-column label="油罐" prop="TankNo" align="center" width="50" />
        <el-table-column label="油品" prop="OilName" align="center" width="60" />
        <el-table-column label="直径" prop="TankDiam" align="center" width="60" />
        <el-table-column label="长度" prop="TankLength" align="center" width="60" />
        <el-table-column label="最大容积" prop="TankVolume" align="center" width="60" />

        <el-table-column label="高油位报警" align="center">
          <el-table-column label="高油位" prop="HighLevel" align="center" width="60" />
          <el-table-column label="高高油位" prop="HHightLevel" align="center" width="60" />
        </el-table-column>
        <el-table-column label="低油位报警" align="center">
          <el-table-column label="低油位" prop="LowLevel" align="center" width="60" />
          <el-table-column label="低低油位" prop="LLowLevel" align="center" width="60" />
        </el-table-column>
        <el-table-column label="高水位报警高度" prop="HighWater" align="center" width="60" />
        <el-table-column label="温度报警" align="center">
          <el-table-column label="高温" prop="HighTemp" align="center" width="60" />
          <el-table-column label="低温" prop="LowTemp" align="center" width="60" />
        </el-table-column>
        <el-table-column label="基本油差" align="center">
          <el-table-column label="油位" prop="OilLevel" align="center" width="60" />
          <el-table-column label="水位" prop="WaterLevel" align="center" width="60" />
        </el-table-column>
        <el-table-column label="修改时间" prop="UpdateTime" align="center" width="140" />
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
import { stationTankChangeQuery } from '@/api/station'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'StationTankChangeQuery',
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
          filename: '卸油记录查询表'
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
