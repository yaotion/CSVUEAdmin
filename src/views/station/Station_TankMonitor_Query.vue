<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item" @change="handleStationChange">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.oilCode" placeholder="油品" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in oilCodeList" :key="item.oilCode" :label="item.oilName" :value="item.oilCode" />
      </el-select>
      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>

    <div v-for="item in list" :key="item.tankNo" style="width:290px;height:300px;float:left;margin:20px;background-color:#A8DBC9">
      <svg-icon icon-class="tank" style="width:18em;height:10em" />
      <div style="width:290px;height:130px;float:left;padding:0;margin:0">
        <el-row>
          <el-col :span="4" style="padding:8px;">
            油高
          </el-col>
          <el-col :span="7">
            <el-input :value="item.oilHeight" :readonly="true" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            水高
          </el-col>
          <el-col :span="7">
            <el-input :value="item.waterHeight" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="padding:8px;">
            存油
          </el-col>
          <el-col :span="7">
            <el-input :value="item.leftQty" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            可添
          </el-col>
          <el-col :span="7">
            <el-input :value="item.nullQty" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="padding:8px;">
            状态
          </el-col>
          <el-col :span="7">
            <el-input :value="item.stateName" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            温度
          </el-col>
          <el-col :span="7">
            <el-input :value="item.temp" /></el-col>
        </el-row>
      </div>
    </div>

  </div>
</template>
<style>
 .el-col {
    margin: 0;
    padding:0;
  }
.el-col div input {
    background-color: transparent
  }
</style>

<script>
import { stationTankMonitorQuery } from '@/api/station'
import { stationListQuery, oilCodeListQuery } from '@/api/base'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationTankMonitorQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      oilCodeList: null,
      total: 0,
      listLoading: true,
      stationList: null,
      shiftList: null,
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: '',
        oilCode: ''
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
    getOilCodeList(value) {
      var qry = {
        StationNo: value
      }
      oilCodeListQuery(qry).then(response => {
        this.oilCodeList = response.data.items
        // Just to simulate the time of the request
      })
    },
    getList() {
      this.listLoading = true
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()

      stationTankMonitorQuery(this.listQuery).then(response => {
        this.list = response.data.items
        console.info(response)
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleStationChange(value) {
      this.getOilCodeList(value)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '', '站点', '操作时间', '油枪号', '老价格', '新价格', '油品编号', '油品名称', '升累计']
        const filterVal = ['index', 'StationNo', 'OptTime', 'Terminal', 'OldPrice', 'NewPrice', 'OilCode', 'OilName', 'QtySsum']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'PSAM卡信息'
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
