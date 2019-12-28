<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.BlackListTypeID" placeholder="黑名单类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in blackListTypeList" :key="item.BlackListTypeID" :label="item.BlackListTypeName" :value="item.BlackListTypeID" />
      </el-select>
      <el-select
        v-model="listQuery.CardNo"
        placeholder="卡号"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in cardList" :key="item.CardNo" :label="item.CardNo" :value="item.CardNo" />
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

    <div id="tablePrint" ref="print">
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
        <el-table-column label="卡号" prop="CardNo" align="center" width="200" />
        <el-table-column label="持卡人" prop="HolderName" align="center" width="100" />
        <el-table-column label="挂失时间" prop="OptTime" align="center" width="200" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardBlackListQuery } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardBlackListQuery',

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
      blackListTypeList: [
        {
          BlackListTypeID: -1,
          BlackListTypeName: '基础黑名单'
        },
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

      listQuery: {
        begintime: '',
        endtime: '',
        CardNo: '',
        blackListTypeID: -1

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

    remoteMethod(cNo) {

    },

    getList() {
      this.listLoading = true

      cardBlackListQuery(this.listQuery).then(response => {
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
