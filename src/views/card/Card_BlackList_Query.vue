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
        <el-table-column label="卡号" prop="CardNo" align="center" width="200" />
        <el-table-column label="持卡人" prop="MasterName" align="center" width="100" />
        <el-table-column label="挂失时间" prop="BeginTime" align="center" width="200" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardBlackListQuery } from '@/api/card'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardBlackListQuery',
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
      cardList: null,
      preIdList: null,
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
    remoteMethod(cNo) {
      if (cNo !== '') {
        var qry = {
          CardNo: cNo
        }

        cardBlackListQuery(qry).then(response => {
          this.cardList = response.data.items
          // Just to simulate the time of the request
          setTimeout(() => {
            this.loading = false
          }, 1.5 * 1000)
        })
      } else {
        this.options = []
      }
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '卡号', '持卡人', '挂失时间']
        const filterVal = ['index', 'CardNo', 'MasterName', 'BeginTime']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '黑名单查询'
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
