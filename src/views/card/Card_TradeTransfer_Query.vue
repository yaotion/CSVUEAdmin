<template>
  <div class="app-container">
    <div class="filter-container">
      <ColChart height="500px" :x-data="chartXData" :y-data="chartYData" :main-data="chartData" width="100%" />
      <el-select v-model="listQuery.stationNo" placeholder="发卡点" clearable style="width: 200px" class="filter-item">
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
        <el-table-column label="站点" prop="stationno" align="center" width="90" />
        <el-table-column label="负责人" prop="MasterName" align="center" width="90" />
        <el-table-column label="单据编号" prop="FrmId" align="center" width="160" />
        <el-table-column label="操作员" prop="OptName" align="center" width="100">
          <template slot-scope="scope2">
            <span>{{ scope2.row.OptName +'|'+ scope2.row.OptNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="OptTime" align="center" width="100" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="100" />
        <el-table-column label="原因" prop="Reason" align="center" width="300" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardModifylogQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
import ColChart from '@/components/Charts/ChartColStardard'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardModifylogQuery',
  components: { Pagination, ColChart },
  directives: { waves },

  filters: {
  },
  data() {
    return {
      chartXData: ['2019-07-21', '2019-07-22', '2019-07-23', '2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27'],
      chartYData: ['001油站', '002油站', '003油站', '004油站', '005油站', '006油站'],
      chartData: [
        {
          name: '',
          type: 'bar',
          // data: [18203, 23489, 29034, 104970, 131744, 630230]
          data: ['2019-07-22', '2019-07-23', '2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27'],
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              label: {
                show: true,
                position: 'right',
                formatter: '{c}',
                textStyle: {
                  color: '#ffffff',
                  fontsize: '9px'
                }
              }
            }
          }
        }
      ],
      tableKey: 0,
      list: null,
      total: 0,
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
      cardModifylogQuery(this.listQuery).then(response => {
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
        const tHeader = ['序号', '发卡点', '负责人', '单据编号', '操作员', '操作员编号', '时间', '卡号', '原因']
        const filterVal = ['index', 'stationno', 'MasterName', 'FrmId', 'OptName', 'OptNo', 'OptTime', 'CardNo', 'Reason']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '卡密码修改记录'
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
