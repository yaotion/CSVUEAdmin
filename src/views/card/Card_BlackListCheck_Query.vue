<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.BlackListTypeID" placeholder="黑名单类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in blackListTypeList" :key="item.BlackListTypeID" :label="item.BlackListTypeName" :value="item.BlackListTypeID" />
      </el-select>

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <div>
      <span style="color:red;font-size:12">{{ getSumText }}
      </span></div>
    <div id="tablePrint" ref="print">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
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
        <el-table-column label="油站" prop="StaitonNo" align="center" width="200" />
        <el-table-column label="类型" prop="BlackListTypeName" align="center" width="200" />
        <el-table-column label="版本" prop="BlackListVersion" align="center" width="80" />
        <el-table-column label="更新时间" prop="LastUpdateTime" align="center" width="200" />
        <el-table-column label="最后同步时间" prop="LastPostTime" align="center" width="200" />
        <el-table-column label="同步时间差(分)" prop="TimeSpan" align="center" width="200" />
        <el-table-column label="是否超时" prop="IsTimeout" align="center" width="100" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardBlackListCheckQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardBlackListCheckQuery',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      loading: false,
      stationList: null,
      blackListTypeList: [
        {
          BlackListTypeID: 0,
          BlackListTypeName: '基础黑名单'
        }, {
          BlackListTypeID: 1,
          BlackListTypeName: '新增黑名单'
        },
        {
          BlackListTypeID: 2,
          BlackListTypeName: '新删黑名单'
        }
      ],
      blackVersion: {
        BaseVersion: 0,
        NewAddVersion: 0,
        NewDelVersion: 0
      },
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: '',
        CardNo: '',
        blackListTypeID: ''

      },
      downloadLoading: false
    }
  },
  computed: {
    getSumText() {
      var sumTextFormat = '中心黑名单版本：基础黑名单01;新增黑名单0;新删黑名单0;'
      console.info(this.blackVersion)
      if (this.blackVersion === undefined) { return sumTextFormat }
      return '中心黑名单版本：基础黑名单' + this.blackVersion.BaseVersion + ';新增黑名单' + this.blackVersion.NewAddVersion + ';新删黑名单' + this.blackVersion.NewDelVersion + ';'
    }
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
    getList() {
      this.listLoading = true
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()
      cardBlackListCheckQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.blackVersion = response.data.backListVersion
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
        const tHeader = ['序号', '类型', '版本', '更新时间', '最后同步时间', '同步时间差(份)', '是否超时']
        const filterVal = ['index', 'BlackListTypeName', 'BlackListVersion', 'LastUpdateTime', 'LastPostTime', 'TimeSpan', 'IsTimeout']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '黑名单校验记录'
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
