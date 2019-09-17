<template>
  <div class="app-container">
    <div class="filter-container">

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
        :id="table"
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

        <el-table-column label="账号" prop="AccNo" align="center" width="120" />
        <el-table-column label="账号名称" prop="AccName" align="center" width="180" />
        <el-table-column label="支票号码" prop="ChequeNo" align="center" width="160" />
        <el-table-column label="支票金额" prop="ChequeMoney" align="center" width="120" />
        <el-table-column label="接收时间" prop="ReceiveDate" align="center" width="160" />
        <el-table-column label="是否生效" prop="IsEffctiveName" align="center" width="100" />
        <el-table-column label="是否退票" prop="IsReturnName" align="center" width="100" />
        <el-table-column label="站点" prop="StationNo" align="center" width="90" />
        <el-table-column label="操作员" prop="OptName" align="center" width="100">
          <template slot-scope="scope2">
            <span>{{ scope2.row.OptName +'|'+ scope2.row.OptNo }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardChequeQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardChequeQuery',
  components: { Pagination },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      sum: {
        // 全部数量
        AllCount: 0,
        // 生效数量
        EffectiveCount: 0,
        // 未生效数量
        InEffectiveCount: 0,
        // 退票数量
        ReturnCount: 0
      },
      listLoading: true,
      stationList: null,
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: ''
      },
      downloadLoading: false
    }
  },
  computed: {
    getSumText() {
      var sumTextFormat = '全部支票数量:0，生效支票数量:0，未生效支票数量:0，退票数量:0'
      if (this.sum === undefined) { return sumTextFormat }
      return '全部支票数量:' + this.sum.AllCount + '，生效支票数量:' + this.sum.EffectiveCount + ',未生效支票数量' + this.sum.InEffectiveCount + ',退票数量:' + this.sum.ReturnCount
    }
  },
  created() {
    this.getStationList()
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
      cardChequeQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.sum = response.data.sum
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
        const tHeader = ['序号', '发卡点', '操作员', '账号', '账号名称', '支票号码', '支票金额', '接收时间', '是否生效', '是否退票']
        const filterVal = ['index', 'StationNo', 'OptName', 'AccNo', 'AccName', 'ChequeNo', 'ChequeMoney', 'ReceiveDate', 'IsEffctiveName', 'IsReturnName']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '卡出入库记录查询'
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
