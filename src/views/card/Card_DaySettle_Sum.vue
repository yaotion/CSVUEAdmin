<template>
  <div class="app-container">
    <div class="filter-container">

      <el-select v-model="listQuery.stationNo" placeholder="发卡点" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in stationList" :key="item.stationno" :label="item.stationname" :value="item.stationno" />
      </el-select>

      <el-date-picker v-model="timespan" class="filter-item" type="datetimerange" align="right" value-format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
    </div>

    <div>
      <el-table
        v-loading="listLoading"
        :show-header="true"
        :data="sum"

        border
        :span-method="objectSpanMethod"
        :cell-style="cellStyleMethod"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="" prop="itemID" align="center" width="200" />
        <el-table-column label="类型" prop="itemTypeName" align="center" width="300" />
        <el-table-column label="金额" prop="itemMoney" align="center" width="300" />
        <el-table-column label="合计" prop="itemSum" align="center" width="300" />
      </el-table>
    </div>

  </div>
</template>

<script>
import { cardDaySettleSum } from '@/api/card'
import { stationListQuery } from '@/api/base'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'CardDaySettleSum',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: {
        startAccBalance: '0.00',
        startCardAccBalance: '0.00',
        startCardBalance: '0.00',
        startSumBalacne: '0.00',
        saveMoney: '0.00',
        preMoney: '0.00',
        reSaveMoney: '0.00',
        tradeMoney: '0.00',
        returnMoney: '0.00',
        reDeposit: '0.00',
        durationSum: '0.00',
        endAccBalance: '0.00',
        endCardAccBalance: '0.00',
        endCardBalance: '0.00',
        endSumBalacne: '0.00',
        isBalance: '否',
        nowDate: ''
      },
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
    sum: function() {
      return [
        {
          itemID: 'C1',
          itemTypeName: '期初单位账户余额',
          itemMoney: this.list.startAccBalance,
          itemSum: this.list.startSumBalacne
        }, {
          itemID: '期初卡账余额',
          itemTypeName: this.list.startCardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '期初卡余额',
          itemTypeName: this.list.startCardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: 'A',
          itemTypeName: '存钱金额',
          itemMoney: this.list.saveMoney,
          itemSum: this.list.durationSum
        }, {
          itemID: 'B',
          itemTypeName: '优惠金额',
          itemMoney: this.list.preMoney,
          itemSum: ''
        }, {
          itemID: 'C',
          itemTypeName: '冲正',
          itemMoney: this.list.reSaveMoney,
          itemSum: ''
        }, {
          itemID: 'D',
          itemTypeName: '消费',
          itemMoney: this.list.tradeMoney,
          itemSum: ''
        }, {
          itemID: 'E',
          itemTypeName: '退钱',
          itemMoney: this.list.returnMoney,
          itemSum: ''
        }, {
          itemID: 'F',
          itemTypeName: '散户圈提',
          itemMoney: this.list.reDeposit,
          itemSum: ''
        }, {
          itemID: 'C2',
          itemTypeName: '期末单位账户余额',
          itemMoney: this.list.endAccBalance,
          itemSum: this.list.endSumBalacne
        }, {
          itemID: '期末卡账月',
          itemTypeName: this.list.endCardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '期末卡余额',
          itemTypeName: this.list.endCardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '',
          itemTypeName: '',
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '平衡失算结果',
          itemTypeName: this.list.isBalance,
          itemMoney: '时间:' + this.list.nowDate,
          itemSum: ''
        }, {
          itemID: '公式:C1=A+B-C-D-E-F=C2',
          itemTypeName: '',
          itemMoney: '',
          itemSum: ''
        }
      ]
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
      cardDaySettleSum(this.listQuery).then(response => {
        this.list = response.data.items
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ((rowIndex === 0) && (columnIndex === 0)) {
        return {
          rowspan: 3,
          colspan: 1
        }
      }
      if ((rowIndex === 0) && (columnIndex === 3)) {
        return {
          rowspan: 3,
          colspan: 1
        }
      }
      if ((rowIndex === 3) && (columnIndex === 3)) {
        return {
          rowspan: 6,
          colspan: 1
        }
      }

      if ((rowIndex === 9) && (columnIndex === 0)) {
        return {
          rowspan: 3,
          colspan: 1
        }
      }
      if ((rowIndex === 9) && (columnIndex === 3)) {
        return {
          rowspan: 3,
          colspan: 1
        }
      }
      if ((rowIndex === 12) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 4
        }
      }
      if ((rowIndex === 13) && (columnIndex === 2)) {
        return {
          rowspan: 1,
          colspan: 2
        }
      }
      if ((rowIndex === 14) && (columnIndex === 0)) {
        return {
          rowspan: 1,
          colspan: 4
        }
      }
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    cellStyleMethod({ row, column, rowIndex, columnIndex }) {
      if ((rowIndex === 14) && (columnIndex === 0)) {
        return {
          textAlign: 'left',
          paddingLeft: '40px'
        }
      }
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
