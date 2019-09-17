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
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="本班加油明细" name="first">
        <div>
          <el-table
            :key="tableKey1"
            v-loading="listLoading"
            :data="list"
            :show-summary="true"
            :summary-method="getSummaries1"
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
            <el-table-column label="流水号" prop="FlowNo" align="center" width="80" />
            <el-table-column label="枪号" prop="Terminal" align="center" width="80" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="单价" prop="Price" align="center" width="100" />
            <el-table-column label="加油量" prop="Qty" align="center" width="100" />
            <el-table-column label="金额" prop="Money" align="center" width="100" />
            <el-table-column label="付款方式" prop="PayWay" align="center" width="80" />
            <el-table-column label="加油时间" prop="MachTime" align="center" width="160" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本班按油品统计" name="second">
        <div>
          <el-table
            :key="tableKey2"
            v-loading="listLoading"
            :data="listByOil"
            :show-summary="true"
            :summary-method="getSummaries2"
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

            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />

            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本班按油枪统计" name="third">
        <div>
          <el-table
            :key="tableKey3"
            v-loading="listLoading"
            :data="listByTerminal"
            :show-summary="true"
            :summary-method="getSummaries3"
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
            <el-table-column label="油枪" prop="Terminal" align="center" width="100" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />

          </el-table>
        </div></el-tab-pane>

    </el-tabs>
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
import { stationListQuery } from '@/api/base'
import { stationShiftNowYYLDetailQuery, stationShiftNowYYLByOilQuery,
  stationShiftNowYYLByTerminalQuery } from '@/api/station'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationShiftNoYYLQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey1: 0,
      tableKey2: 0,
      tableKey3: 0,
      tableKey4: 0,
      tableKey5: 0,
      list: null,
      total: 0,
      activeName: 'first',
      listByTerminal: null,
      listByOil: null,

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

  },
  created() {
    this.getStationList()
    this.getShiftNoYYLDetail()
    this.getShiftNoYYLByOil()
    this.getShiftNoYYLByTerminal()
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
    getShiftNoYYLDetail() {
      this.listLoading = true
      stationShiftNowYYLDetailQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getShiftNoYYLByOil() {
      this.listLoading = true
      stationShiftNowYYLByOilQuery(this.listQuery).then(response => {
        this.listByOil = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getShiftNoYYLByTerminal() {
      this.listLoading = true
      stationShiftNowYYLByTerminalQuery(this.listQuery).then(response => {
        this.listByTerminal = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getSummaries1(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 5)) {
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
    getSummaries2(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 2)) {
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
    getSummaries3(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if ((index >= 1) && (index <= 3)) {
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
      // this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '发卡点', '操作员', '操作员编号', '时间', '卡号', '种类', '数量']
        const filterVal = ['index', 'StationNo', 'OptName', 'OptNo', 'OptTime', 'CardNo', 'CardTypeName', 'CardCount']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '油站日报查询'
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
