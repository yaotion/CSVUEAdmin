<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.CardNo" placeholder="卡号" clearable style="width: 200px" class="filter-item" />
      <el-input v-model="listQuery.HolderName" placeholder="持卡人" clearable style="width: 100px" class="filter-item" />
      <el-input v-model="listQuery.Mobile" placeholder="手机号" clearable style="width: 150px" class="filter-item" />
      <el-input v-model="listQuery.CerNo" placeholder="证件号" clearable style="width: 150px" class="filter-item" />
      <el-input v-model="listQuery.Car" placeholder="车牌" clearable style="width: 100px" class="filter-item" />
      <el-select v-model="listQuery.RetailType" placeholder="卡级别" clearable style="width: 100px" class="filter-item">
        <el-option v-for="item in retailTypeList" :key="item.retailTypeID" :label="item.retailTypeName" :value="item.retailTypeID" />
      </el-select>
      <el-select v-model="listQuery.CardState" placeholder="卡状态" clearable style="width: 100px" class="filter-item">
        <el-option-group
          v-for="group in cardStateList"
          :key="group.sortID"
          :label="group.sortName"
        >
          <el-option
            v-for="item in group.sortData"
            :key="item.cardState"
            :label="item.cardStateName"
            :value="item.cardState"
          />
        </el-option-group>
      </el-select>
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
        fit
        size="mini"
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" type="index" align="center" width="60" />
        <el-table-column label="卡号" prop="CardNo" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleViewDetail(scope.row)">
              {{ scope.row.CardNo }}
            </el-button>

          </template>
        </el-table-column>
        <el-table-column label="类别" prop="AccType" align="center" width="60" />
        <el-table-column label="证件号码" prop="HolderCerNo" align="center" width="90" />
        <el-table-column label="卡有效期" prop="BeginDate" align="center" width="140">
          <template slot-scope="scope2">
            <span>{{ formatDT(scope2.row.BeginDate,'yy-MM-dd') +'--'+ formatDT(scope2.row.EndDate,'yy-MM-dd') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="持卡人" prop="HolderName" align="center" width="60" />
        <el-table-column label="手机号" prop="Mobile" align="center" width="100" />
        <el-table-column label="限车牌" prop="LimitCar" align="center" width="80" />
        <el-table-column label="限油品" prop="LimitOil" :formatter="LimitOilFormatter" align="center" width="70" />
        <el-table-column label="卡余额" prop="Moneys" align="center" width="70" />
        <el-table-column label="卡级别" prop="RetailTypeName" :formatter="RetailTypeFormatter" align="center" width="60" />
        <el-table-column label="卡状态" prop="CardStateName" align="center" width="60" />

      </el-table>
    </div>

    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="viewItem" size="mini" label-position="left" label-width="100px" style="width: 500px; margin-left:50px;">
        <el-form-item label="卡号">
          <el-input v-model="viewItem.CardNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="viewItem.HolderName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-model="viewItem.Birthday" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="viewItem.Mobile" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="提示问题">
          <el-input v-model="viewItem.PWDHint" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="回答">
          <el-input v-model="viewItem.PWDAnswer" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="卡账余额">
          <el-input v-model="viewItem.AccMoney" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="卡余额">
          <el-input v-model="viewItem.Moneys" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="账户名称">
          <el-input v-model="viewItem.AccName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="viewItem.HolderJob" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="公司名称">
          <el-input v-model="viewItem.HolderCompanyName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="viewItem.HolderCompanyAddr" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="公司电话">
          <el-input v-model="viewItem.HolderCompanyTelephone" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="公司传真">
          <el-input v-model="viewItem.HolderCompanyFax" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="卡状态">
          <el-input v-model="viewItem.CardStateName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="卡有效期">
          <el-col :span="11">
            <el-input v-model="viewItem.BeginDate" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input v-model="viewItem.EndDate" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
          </el-col>
        </el-form-item>
        <el-form-item label="卡级别">
          <el-input v-model="viewItem.RetailTypeName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item label="发行时间">

          <el-input v-model="viewItem.MakeTime" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>

        <el-form-item label="是否设置密码">
          <el-input v-model="viewItem.HasPWDName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-right:50px;">
        <el-button type="primary" @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cardInfoQuery } from '@/api/card'
import { cardInfoFind } from '@/api/card'
import { stationListQuery, cardStateCompListQuery, retailTypeListQuery } from '@/api/base'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardInfoQuery',
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
      cardStateList: null,
      retailTypeList: null,
      listQuery: {
        begintime: '',
        endtime: '',
        stationNo: ''
      },
      detailQuery: {
        CardNo: ''
      },
      viewItem: {
        id: '',
        // 卡号
        CardNo: '',
        // 姓名
        HolderName: 1,
        // 生日
        Birthday: '',
        // 手机号
        Mobile: '',
        // 提示问题
        PWDHint: '',
        // 回答
        PWDAnswer: '',
        // 邮件地址
        // 卡账余额
        AccMoney: '',
        // 卡余额
        Moneys: 0.00,
        // 账户名称
        AccName: '',
        // //////////////////////
        // 职务
        HolderJob: '',
        // 公司名称
        HolderCompanyName: '',
        // 公司地址
        HolderCompanyAddr: '',
        // 公司电话
        HolderCompanyTelephone: '',
        // 公司传真
        HolderCompanyFax: '',
        // 油耗(100升以上、100升一下)
        // 接收邮件
        AllowEmail: '',
        // 卡状态
        CardStateName: '',
        // 证件类型
        HolderCerTypeName: '',
        // 证件号码
        HolderCerNo: '',
        // 有效期
        BeginDate: '',
        EndDate: '',
        // 积分
        // 散户卡类型
        RetailTypeName: '',
        // 发型时间
        MakeTime: '',
        // 是否有密码
        HasPWD: 0,
        HasPWDName: ''
      },
      dialogFormVisible: false,

      dialogStatus: '',
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getStationList()
    this.getCardStateList()
    this.getRetailTypeList()
    this.getList()
  },
  methods: {

    CerTypeFormatter: function(row, column) {
      if (row.HolderCerType === 0) { return '身份证' }
      if (row.HolderCerType === 1) { return '军官证' }

      if (row.HolderCerType === 2) { return '护照' }
      if (row.HolderCerType === 3) { return '入境证' }
      if (row.HolderCerType === 4) { return '临时身份证' }
      if (row.HolderCerType === 5) { return '驾驶证' }
      if (row.HolderCerType === 6) { return '其他' }
      return '未知类型'
    },
    LimitOilFormatter: function(row, column) {
      if (row.LimitOil === 'FFFF') { return '不限' }
      return row.LimitOil
    },
    RetailTypeFormatter: function(row, column) {
      if (row.RetailTypeID === 0) { return '无' }
      return row.RetailTypeName
    },
    formatDT(datetime, fmt) {
      var s = datetime.replace(/-/g, '/')
      var date = new Date(s)
      var o = {

        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
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
    getCardStateList() {
      cardStateCompListQuery().then(response => {
        this.cardStateList = response.data.items
      })
    },
    getRetailTypeList() {
      retailTypeListQuery().then(response => {
        this.retailTypeList = response.data.items
      })
    },
    getList() {
      this.listLoading = true
      cardInfoQuery(this.listQuery).then(response => {
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
      var fileName = '用户卡信息查询'
      var dataTmp = document.querySelector(tableName)
      try {
        tableToExcel(dataTmp, fileName)
      } finally {
        this.downloadLoading = false
      }
    },
    handleViewDetail(row) {
      this.detailQuery.CardNo = row.CardNo
      cardInfoFind(this.detailQuery).then(response => {
        console.info(response.data)
        this.viewItem = response.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    }
  }
}
</script>
