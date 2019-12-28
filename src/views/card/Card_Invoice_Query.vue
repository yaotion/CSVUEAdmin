<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="发卡点" clearable style="width: 160px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.invoiceType" placeholder="开票类型" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in invoiceTypeList" :key="item.stationno" :label="item.invoiceTypeName" :value="item.invoiceType" />
      </el-select>
      <el-input v-model="listQuery.cardNo" placeholder="请输入卡号" clearable style="width: 160px" class="filter-item" />

      <el-date-picker v-model="listQuery.begintime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="开始日期" default-time="00:00:00" />
      <el-date-picker v-model="listQuery.endtime" class="filter-item" type="datetime" align="right" value-format="yyyy-MM-dd HH:mm:ss" placeholder="结束日期" default-time="23:59:00" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <div>
      <el-table
        id="tabData"
        v-loading="listLoading"
        :show-header="true"
        :data="list"
        border
        size="mini"
        :span-method="objectSpanMethod"
        :cell-style="cellStyleMethod"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="卡号" prop="ASN" align="center" width="160" />
        <el-table-column label="姓名" prop="HolderName" align="center" width="80" />
        <el-table-column label="加油金额" prop="AMN" align="center" width="100" />
        <el-table-column label="加油时间" prop="Mach_Time" align="center" width="120" />
        <el-table-column label="加油升数" prop="Qty" align="center" width="80" />
        <el-table-column label="站点" prop="StationNo" align="center" width="80" />
        <el-table-column label="开票类型" prop="InvoiceTypeName" align="center" width="80" />
      </el-table>
    </div>

  </div>
</template>

<script>
import { cardInvoiceQuery } from '@/api/card'
import { stationListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
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

      invoiceTypeList: [
        { invoiceType: 0,
          invoiceTypeName: '全部' },
        { invoiceType: 2,
          invoiceTypeName: '未开' },
        { invoiceType: 3,
          invoiceTypeName: '已开' }
      ],
      listQuery: {
        invoiceType: 0,
        begintime: '',
        endtime: '',
        stationNo: '',
        cardNo: ''
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
      cardInvoiceQuery(this.listQuery).then(response => {
        this.list = response.data.items

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
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '开票记录查询'
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
