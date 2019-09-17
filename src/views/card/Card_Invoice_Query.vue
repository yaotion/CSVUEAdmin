<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="发卡点" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.stationNo" placeholder="开票类型" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-input v-model="listQuery.CardNo" placeholder="请输入卡号" clearable style="width: 160px" class="filter-item" />

      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <div>
      <el-table
        v-loading="listLoading"
        :show-header="true"
        :data="list"

        border
        :span-method="objectSpanMethod"
        :cell-style="cellStyleMethod"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
        <el-table-column label="姓名" prop="MasterName" align="center" width="100" />
        <el-table-column label="加油金额" prop="Money" align="center" width="100" />
        <el-table-column label="加油时间" prop="MachTime" align="center" width="160" />
        <el-table-column label="加油升数" prop="Qty" align="center" width="100" />
        <el-table-column label="站点" prop="StationNo" align="center" width="100" />
        <el-table-column label="开票类型" prop="InvoiceTypeName" align="center" width="100" />
      </el-table>
    </div>

  </div>
</template>

<script>
import { cardInvoiceQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CardInvoiceQuery',
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
      cardInvoiceQuery(this.listQuery).then(response => {
        this.list = response.data.items
        this.list.push({})
        this.list.push(
          {
            index: '未开票统计',
            CardNo: response.data.sum.UnInvoiced,
            MasterName: '',
            Money: '',
            MachTime: '',
            Qty: '',
            StaitonNo: '',
            InvoiceTypeName: ''
          }
        )
        this.list.push({
          index: '已开票统计',
          CardNo: response.data.sum.Invoiced,
          MasterName: '',
          Money: '',
          MachTime: '',
          Qty: '',
          StaitonNo: '',
          InvoiceTypeName: ''
        })
        this.list.push({
          index: '全部统计',
          CardNo: response.data.sum.All,
          MasterName: '',
          Money: '',
          MachTime: '',
          Qty: '',
          StaitonNo: '',
          InvoiceTypeName: ''
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      var dataCount = this.list.length

      if ((rowIndex === dataCount - 4) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 4
        }
      }
      if ((rowIndex === dataCount - 3) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 3
        }
      }
      if ((rowIndex === dataCount - 3) && (columnIndex === 2)) {
        return {
          rowspan: 3,
          colspan: 4
        }
      }
      if ((rowIndex === dataCount - 2) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 3
        }
      }
      if ((rowIndex === dataCount - 1) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 3
        }
      }
    },
    cellStyleMethod({ row, column, rowIndex, columnIndex }) {
      // if ((rowIndex === 14) && (columnIndex === 0)) {
      // return {
      //   textAlign: 'left',
      //   paddingLeft: '40px'
      // }
      // }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
