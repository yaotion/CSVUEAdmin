<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item" @change="handleStationChange">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.oilCode" placeholder="油品" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in oilCodeList" :key="item.oilCode" :label="item.oilName" :value="item.oilCode" />
      </el-select>
      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <div v-for="item in list" :key="item.Tank_No" style="width:290px;height:300px;float:left;margin:20px;background-color:#A8DBC9">
      <svg-icon icon-class="tank" style="width:18em;height:10em" />
      <div style="width:290px;height:130px;float:left;padding:0;margin:0">
        <el-row>
          <el-col :span="4" style="padding:8px;">
            油高
          </el-col>
          <el-col :span="7">
            <el-input :value="item.Oil_height" :readonly="true" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            水高
          </el-col>
          <el-col :span="7">
            <el-input :value="item.High_water" />
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="padding:8px;">
            存油
          </el-col>
          <el-col :span="7">
            <el-input :value="item.Inven_volume" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            可添
          </el-col>
          <el-col :span="7">
            <el-input :value="item.Empty_volume" /></el-col>
        </el-row>
        <el-row>
          <el-col :span="4" style="padding:8px;">
            状态
          </el-col>
          <el-col :span="7">
            <el-input :value="item.Sta" /></el-col>
          <el-col :span="4" style="padding-top:8px; padding-left:10px;">
            温度
          </el-col>
          <el-col :span="7">
            <el-input :value="item.Oil_temp" /></el-col>
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
      listQuery: {
        begintime: '',
        endtime: '',
        stationNo: '',
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
      this.getList()
    }

  }
}
</script>
