<template>
  <div class="app-container">
    <div class="filter-container">
      <span class="demonstration">制卡时间：</span>
      <el-date-picker v-model="listQuery.timespan" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" prop="index" align="center" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡片类型" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.cardtype | typeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡片编号" prop="cardno" align="center" width="200" />
      <el-table-column label="制卡时间" prop="maketime" sortable="custom" align="center" width="200" />
      <el-table-column label="操作员" prop="operator" align="center" width="200" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { makelist } from '@/api/card'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'MarkcardQuery',
  components: { Pagination },
  directives: { waves },
  filters: {
    typeFilter(type) {
      const typeMap = {
        1: '不确定',
        2: '用户卡',
        3: '管理卡',
        4: '员工卡',
        5: '验泵卡',
        6: '维修卡'
      }
      return typeMap[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        timespan: '',
        sort: '+maketime'
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      makelist(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'maketime') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+maketime'
      } else {
        this.listQuery.sort = '-maketime'
      }
      this.handleFilter()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '卡片类型', '卡片编号', '制卡时间', '操作员']
        const filterVal = ['index', 'cardtype', 'cardno', 'maketime', 'operator']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '制卡记录表'
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
