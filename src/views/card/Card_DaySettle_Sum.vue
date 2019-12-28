<template>
  <div class="app-container">
    <div class="filter-container">
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
        :data="sum"
        border
        :span-method="objectSpanMethod"
        :cell-style="cellStyleMethod"
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="" prop="itemID" align="center" width="100" />
        <el-table-column label="类型" prop="itemTypeName" align="center" width="300" />
        <el-table-column label="金额" prop="itemMoney" align="center" width="150" />
        <el-table-column label="合计" prop="itemSum" align="center" width="250" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { cardDaySettleSum } from '@/api/card'
import { tableToExcel } from '@/utils/excelUtils'
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
        SaveMoney: '0.00',
        PreMoney: '0.00',
        OldAccBalance: '0.00',
        AccBalance: '0.00',
        OldCardAccBalance: '0.00',
        CardAccBalance: '0.00',
        OldCardBalance: '0.00',
        CardBalance: '0.00',
        AccCorrect: '0.00',
        AccViment: '0.00',
        AccUnViment: '0.00',
        AccDeposit: '0.00',
        AccUnDeposit: '0.00',
        AccUnGrey: '0.00',
        AccConsume: '0.00',
        AccDelete: '0.00',
        UserDeposit: '0.00',
        UserUnDeposit: '0.00',
        UserUngrey: '0.00',
        UserConsume: '0.00',
        UserPre: '0.00',
        UserReturnCard: '0.00',
        OldUserCardBalance: '0.00',
        UserCardBalance: '0.00',
        PreRefund: '0.00',
        IsBalance: '否',
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
          itemMoney: this.list.OldAccBalance,
          itemSum: this.list.OldAccBalance + this.list.OldCardAccBalance + this.list.OldCardBalance + this.list.OldUserCardBalance
        }, {
          itemID: '期初卡账余额',
          itemTypeName: this.list.OldCardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '期初卡余额',
          itemTypeName: this.list.OldCardBalance + this.list.OldUserCardBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: 'A',
          itemTypeName: '存钱金额',
          itemMoney: this.list.SaveMoney + this.list.UserDeposit,
          itemSum: this.list.SaveMoney + this.list.PreMoney + this.list.UserDeposit + this.list.UserPre -
          this.list.AccCorrect - this.list.AccConsume - this.list.UserConsume - this.list.AccDelete - this.list.UserReturnCard - this.list.UserUnDeposit
          // 客户存钱 + 客户优惠 + 散户储值 - 冲正 - 客户消费 - 散户消费 -  客户销户 - 散户退卡 - 散户圈提
        }, {
          itemID: 'B',
          itemTypeName: '优惠金额',
          itemMoney: this.list.PreMoney + this.list.UserPre,
          itemSum: ''
        }, {
          itemID: 'C',
          itemTypeName: '冲正',
          itemMoney: this.list.AccCorrect,
          itemSum: ''
        }, {
          itemID: 'D',
          itemTypeName: '消费',
          itemMoney: this.list.UserConsume + this.list.AccConsume,
          itemSum: ''
        }, {
          itemID: 'E',
          itemTypeName: '退钱',
          itemMoney: this.list.AccDelete + this.list.UserReturnCard,
          itemSum: ''
        }, {
          itemID: 'F',
          itemTypeName: '散户圈提',
          itemMoney: this.list.UserUnDeposit,
          itemSum: ''
        }, {
          itemID: 'C2',
          itemTypeName: '期末单位账户余额',
          itemMoney: this.list.AccBalance,
          itemSum: this.list.AccBalance + this.list.CardAccBalance + this.list.CardBalance + this.list.UserCardBalance + this.list.PreRefund
        }, {
          itemID: '期末卡账余额',
          itemTypeName: this.list.CardAccBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '期末卡余额',
          itemTypeName: this.list.CardBalance + this.list.UserCardBalance,
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '',
          itemTypeName: '',
          itemMoney: '',
          itemSum: ''
        }, {
          itemID: '平衡试算结果',
          itemTypeName: this.list.IsBalance === 0 ? '是' : '否',
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
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
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
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      var tableName = '#tabData'
      var fileName = '日记信息表'
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
