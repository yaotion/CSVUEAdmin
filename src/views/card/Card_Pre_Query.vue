<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.preState" placeholder="返还状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in preStateList" :key="item.preState" :label="item.preStateName" :value="item.preState" />
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

      <el-select v-model="listQuery.preId" placeholder="优惠方式" clearable style="width: 250px" class="filter-item">
        <el-option v-for="item in preIdList" :key="item.preId" :label="item.preName" :value="item.preId" />
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
        <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
        <el-table-column label="加油量" prop="Qty" align="center" width="100" />
        <el-table-column label="金额" prop="Money" align="center" width="100" />
        <el-table-column label="优惠金额" prop="PreMoney" align="center" width="100" />
        <el-table-column label="优惠时间" prop="PreTime" align="center" width="100" />
        <el-table-column label="状态" prop="StateName" align="center" width="100" />
        <el-table-column label="站点" prop="stationno" align="center" width="90" />
        <el-table-column label="账户名称" prop="AccName" align="center" width="180" />
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { cardPreQuery } from '@/api/card'
import { preIdListQuery } from '@/api/base'
import { cardFuzzySearch } from '@/api/card'

// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
  name: 'CardPreQuery',
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
      preStateList: [
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
        page: 1,
        limit: 20,
        begintime: '',
        endtime: '',
        stationno: '',
        CardNo: ''
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

    getEndtime() {
      if (this.timespan && this.timespan[1]) {
        return this.timespan[1].toString()
      }
      return null
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
      this.listQuery.begintime = this.getBegintime()
      this.listQuery.endtime = this.getEndtime()
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
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '卡号', '加油量', '金额', '优惠金额', '优惠时间', '状态', '站点', '账户名称']
        const filterVal = ['index', 'CardNo', 'Qty', 'Money', 'PreMoney', 'PreTime', 'StateName', 'stationno', 'AccNo']
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
