<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.CardNo"
        placeholder="卡号"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        clearable
        style="width: 220px"
        class="filter-item"
      >
        <el-option v-for="item in cardList" :key="item.CardNo" :label="item.CardNo" :value="item.CardNo" />
      </el-select>
      <el-select v-model="listQuery.preState" placeholder="返还状态" clearable class="filter-item">
        <el-option v-for="item in preStateList" :key="item.preState" :label="item.preStateName" :value="item.preState" />
      </el-select>

      <el-select v-model="listQuery.preId" placeholder="优惠方式" clearable class="filter-item">
        <el-option v-for="item in preIdList" :key="item.preId" :label="item.preName" :value="item.preId" />
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
        size="mini"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="优惠方式" prop="PreId" align="center" width="80" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
        <el-table-column label="加油量" prop="Qty" align="center" width="80" />
        <el-table-column label="金额" prop="Money" align="center" width="80" />
        <el-table-column label="优惠金额" prop="PreMoney" align="center" width="80" />
        <el-table-column label="优惠时间" prop="PreTime" align="center" width="160" />
        <el-table-column label="状态" prop="State" align="center" width="60">
          <template slot-scope="scope2">
            <span>{{ scope2.row.State == 0 ? "未返还" : "已返还" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="站点" prop="StationNo" align="center" width="90" />
        <el-table-column label="账户名称" prop="AccName" align="center">
          <template slot-scope="scope2">
            <span>{{ scope2.row.AccNo.trim() == "00000000000000000000" ? "散户" : scope2.row.AccName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardPreQuery } from '@/api/card'
import { preIdListQuery } from '@/api/base'
import { cardFuzzySearch } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CardPreQuery',
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
      preStateList: [
        {
          preState: -1,
          preStateName: '全部状态'
        },
        {
          preState: 0,
          preStateName: '未返还'
        }, {
          preState: 1,
          preStateName: '已返还'
        }
      ],
      cardList: null,
      preIdList: null,
      timespan: null,
      listQuery: {
        begintime: '',
        endtime: '',
        CardNo: '',
        preId: -1,
        preState: -1
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getPreIdListList()
    this.getList()
  },
  methods: {

    remoteMethod(cNo) {
      if (cNo !== '') {
        var qry = {
          CardNo: cNo
        }

        cardFuzzySearch(qry).then(response => {
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

    getPreIdListList() {
      this.listLoading = true
      preIdListQuery(this.listQuery).then(response => {
        this.preIdList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getList() {
      this.listLoading = true

      cardPreQuery(this.listQuery).then(response => {
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
      var fileName = '优惠记录查询'
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
