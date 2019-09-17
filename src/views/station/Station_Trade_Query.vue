<template>
  <div class="app-container">
    <div class="filter-container">

      <el-date-picker
        v-model="listQuery.bussDate"
        class="filter-item"
        type="date"
        clearable
        style="width: 150px"
        placeholder="商务日期"
      />
      <el-select v-model="listQuery.shiftNo" placeholder="班号" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in shiftList" :key="item.shiftNo" :label="item.shiftNo" :value="item.shiftNo" />
      </el-select>

      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />

      <el-select v-model="listQuery.stationNo" placeholder="站点" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>
      <el-select v-model="listQuery.oilCode" placeholder="油品" clearable style="width: 80px" class="filter-item">
        <el-option v-for="item in oilList" :key="item.oilCode" :label="item.oilName" :value="item.oilCode" />
      </el-select>
      <el-select v-model="listQuery.terminal" placeholder="枪号" clearable style="width: 80px" class="filter-item">
        <el-option v-for="item in terminalList" :key="item.terminal" :label="item.terminalName" :value="item.terminal" />
      </el-select>
      <el-select v-model="listQuery.tradeType" placeholder="交易类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in tradeTypeList" :key="item.tradeType" :label="item.tradeTypeName" :value="item.tradeType" />
      </el-select>
      <el-select v-model="listQuery.cardType" placeholder="卡类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in cardTypeList" :key="item.cardType" :label="item.cardTypeName" :value="item.cardType" />
      </el-select>
      <el-select v-model="listQuery.payway" placeholder="结算方式" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in paywayList" :key="item.payway" :label="item.paywayName" :value="item.payway" />
      </el-select>
      <el-select v-model="listQuery.optNo" placeholder="操作员" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in optList" :key="item.optNo" :label="item.optName" :value="item.optNo" />
      </el-select>
      <el-select
        v-model="listQuery.cardNo"
        placeholder="卡号"
        filterable
        remote
        :remote-method="remoteMethod"
        clearable
        style="width: 220px"
        class="filter-item"
      >
        <el-option v-for="item in cardList" :key="item.CardNo" :label="item.CardNo" :value="item.CardNo" />
      </el-select>
      <el-checkbox v-model="listQuery.sysTrade" class="filter-item">包括系统交易</el-checkbox>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="加油交易明细" name="first">
        <div>
          <el-table
            :key="tableKey1"
            v-loading="listLoading"
            :data="list"
            :show-summary="true"
            :summary-method="getSummaries1"
            size="mini"
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
            <el-table-column label="商务日期" prop="BussDate" align="center" width="90" />
            <el-table-column label="班号" prop="ShiftNo" align="center" width="50" />
            <el-table-column label="逻辑枪号" prop="Terminal" align="center" width="80" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="单价" prop="Price" align="center" width="50" />
            <el-table-column label="加油量" prop="Qty" align="center" width="80" />
            <el-table-column label="加油金额" prop="Money" align="center" width="100" />
            <el-table-column label="加油原额" prop="MoneySale" align="center" width="100" />
            <el-table-column label="卡余额" prop="Bal" align="center" width="80" />
            <el-table-column label="交易方式" prop="TradeTypeName" align="center" width="80" />
            <el-table-column label="结算方式" prop="PayWayName" align="center" width="80" />
            <el-table-column label="员工号" prop="OptNo" align="center" width="80" />
            <el-table-column label="员工姓名" prop="OptName" align="center" width="100" />
            <el-table-column label="加油时间" prop="MachTime" align="center" width="140" />
            <el-table-column label="账户名称" prop="AccName" align="center" width="160" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按交易类型统计" name="second">
        <div>
          <el-table
            :key="tableKey2"
            v-loading="listLoading"
            :data="listByTradeType"
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

            <el-table-column label="交易类型" prop="TradeTypeName" align="center" width="100" />

            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按卡号统计" name="third">
        <div>
          <el-table
            :key="tableKey3"
            v-loading="listLoading"
            :data="listByCard"
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
            <el-table-column label="卡号" prop="CardNo" align="center" width="200" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
            <el-table-column label="账户名称" prop="AccName" align="center" width="300" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按卡类型统计" name="four">
        <div>
          <el-table
            :key="tableKey4"
            v-loading="listLoading"
            :data="listByCardType"
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
            <el-table-column label="卡类型" prop="CardTypeName" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按操作员统计" name="five">
        <div>
          <el-table
            :key="tableKey4"
            v-loading="listLoading"
            :data="listByOpt"
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
            <el-table-column label="员工号" prop="OptName" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按油品统计" name="six">
        <div>
          <el-table
            :key="tableKey4"
            v-loading="listLoading"
            :data="listByOil"
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
            <el-table-column label="油品编号" prop="OilCode" align="center" width="100" />
            <el-table-column label="油品名称" prop="OilName" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按油枪统计" name="seven">
        <div>
          <el-table
            :key="tableKey4"
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
            <el-table-column label="油枪号" prop="Terminal" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="按支付方式统计" name="eight">
        <div>
          <el-table
            :key="tableKey4"
            v-loading="listLoading"
            :data="listByPayWay"
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
            <el-table-column label="支付方式" prop="PayWayName" align="center" width="100" />
            <el-table-column label="营业量" prop="Qtys" align="center" width="100" />
            <el-table-column label="营业额" prop="Moneys" align="center" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
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
import { stationListQuery, shiftListQuery, oilCodeListQuery, terminalListQuery, tradeTypeListQuery, cardTypeListQuery, paywayListQuery, optListQuery } from '@/api/base'
import { stationTradeListQuery, sumTradeByTradeTypeQuery, sumTradeByCardQuery, sumTradeByCardTypeQuery,
  sumTradeByOptQuery, sumTradeByOilQuery, sumTradeByTerminalQuery, sumTradeByPayWayQuery } from '@/api/station'
import { cardFuzzySearch } from '@/api/card'
import { Message } from 'element-ui'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'StationTradeQuery',
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
      total: 0,
      activeName: 'first',
      // 列表
      list: null,
      listByTradeType: null,
      listByCard: null,
      listByCardType: null,

      listByOpt: null,
      listByOil: null,
      listByTerminal: null,
      listByPayWay: null,
      listLoading: true,
      // 基础信息
      stationList: null,
      shiftList: null,
      oilList: null,
      terminalList: null,
      tradeTypeList: null,
      cardTypeList: null,
      paywayList: null,
      optList: null,
      cardList: null,
      timespan: null,
      listQuery: {
        page: 1,
        limit: 20,
        bussDate: '2019-08-10',
        oilCode: '',
        begintime: '',
        endtime: '',
        shiftNo: '',
        stationno: '',
        terminal: '',
        tradeType: '',
        cardType: '',
        payway: '',
        optNo: '',
        cardNo: '',
        sysTrade: false
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getStationList()
    this.getOilList()
    this.getShiftList()
    this.getTerminalList()
    this.getTradeTypeList()
    this.getPaywayList()
    this.getCardTypeList()
    this.getOptList()
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
    getShiftList() {
      this.listLoading = true
      shiftListQuery(this.listQuery).then(response => {
        this.shiftList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getOilList() {
      this.listLoading = true
      oilCodeListQuery(this.listQuery).then(response => {
        console.info(response.data.items)
        this.oilList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    getTerminalList() {
      this.listLoading = true
      terminalListQuery(this.listQuery).then(response => {
        this.terminalList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getTradeTypeList() {
      this.listLoading = true
      tradeTypeListQuery(this.listQuery).then(response => {
        this.tradeTypeList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getCardTypeList() {
      this.listLoading = true
      cardTypeListQuery(this.listQuery).then(response => {
        this.cardTypeList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getPaywayList() {
      this.listLoading = true
      paywayListQuery(this.listQuery).then(response => {
        this.paywayList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getOptList() {
      this.listLoading = true
      optListQuery(this.listQuery).then(response => {
        this.optList = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    getTradeList() {
      this.listLoading = true

      stationTradeListQuery(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByTradeType() {
      this.listLoading = true
      sumTradeByTradeTypeQuery(this.listQuery).then(response => {
        this.listByTradeType = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByCard() {
      this.listLoading = true
      sumTradeByCardQuery(this.listQuery).then(response => {
        this.listByCard = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByCardType() {
      this.listLoading = true
      sumTradeByCardTypeQuery(this.listQuery).then(response => {
        this.listByCardType = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByOpt() {
      this.listLoading = true
      sumTradeByOptQuery(this.listQuery).then(response => {
        this.listByOpt = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByOil() {
      this.listLoading = true
      sumTradeByOilQuery(this.listQuery).then(response => {
        this.listByOil = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByTerminal() {
      this.listLoading = true
      sumTradeByTerminalQuery(this.listQuery).then(response => {
        this.listByTerminal = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getSumTradeByPayWay() {
      this.listLoading = true
      sumTradeByPayWayQuery(this.listQuery).then(response => {
        this.listByPayWay = response.data.items
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

    getList() {
      if (this.listQuery.bussDate === '' || this.listQuery.bussDate === null) {
        return
      }
      this.getTradeList()
      this.getSumTradeByTradeType()
      this.getSumTradeByCard()
      this.getSumTradeByCardType()

      this.getSumTradeByOpt()
      this.getSumTradeByOil()
      this.getSumTradeByTerminal()
      this.getSumTradeByPayWay()
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.listQuery.bussDate === '' || this.listQuery.bussDate === null) {
        Message.error('请输入商务日起或者加油时段')
        return
      }
      this.getList()
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
