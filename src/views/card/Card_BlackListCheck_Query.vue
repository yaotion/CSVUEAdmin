<template>
  <div class="app-container">
    <div class="filter-container">
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
        id="tabData"
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="油站" prop="StationNo" align="center" width="100" />
        <el-table-column label="类型" prop="BlackListTypeName" align="center" width="100" />
        <el-table-column label="版本" prop="BlackListVersion" align="center" width="80" />
        <el-table-column label="更新时间" prop="StationUpdateTime" align="center" width="200" />
        <el-table-column label="最后同步时间" prop="PostUpdateTime" align="center" width="200" />
        <el-table-column label="同步时间差(分)" prop="TimeSpan" align="center" />
        <el-table-column label="是否超时" prop="IsTimeout" align="center" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardBlackListCheckQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CardBlackListCheckQuery',
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
      loading: false,

      blackVersion: {
        BaseVersion: 0,
        NewAddVersion: 0,
        NewDelVersion: 0
      },

      listQuery: {

      },
      downloadLoading: false
    }
  },
  computed: {
    getSumText() {
      var sumTextFormat = '中心黑名单版本：基础黑名单01;新增黑名单0;新删黑名单0;'
      console.info(this.blackVersion)
      if (this.blackVersion === undefined) { return sumTextFormat }
      return '中心黑名单版本：基础黑名单' + this.blackVersion.BlackVer + ';新增黑名单' + this.blackVersion.AddBlackVer + ';新删黑名单' + this.blackVersion.DelBlackVer + ';'
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      cardBlackListCheckQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.blackVersion = response.data.sum
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
      var fileName = '黑名单校验纪录'
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
