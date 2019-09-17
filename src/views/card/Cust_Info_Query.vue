<template>
  <div class="app-container">
    <div style="width:250px;float:left;margin:0;padding:0">
      <div>单位客户列表</div>
      <div>
        <el-tree :data="list" :props="defaultProps" @node-click="handleNodeClick" />
      </div>
    </div>

    <div style="float:left;width:720px;margin-left:20px">
      <div style="">
        <el-form ref="dataForm" :model="viewItem" size="mini" label-position="left" label-width="0px" style="">
          <el-form-item>
            <el-col :span="3">
              单位账号:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.AccNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              结算类型:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.CardNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="3">
              账户名称:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.AccName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              助记符:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.HelpSign" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="3">
              管理卡认证:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.AccNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              账户金额:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.AccMoney" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="3">
              通讯地址:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.Address" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              邮政编码:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.PostCode" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span="3">
              联系电话:
            </el-col>

            <el-col :span="7">
              <el-input v-model="viewItem.TelNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              税务登记号:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.TaxCode" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="3">
              负责人:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.CustName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              身份证号:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.CustCerNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-col :span="3">
              开户银行:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.BankName" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
            <el-col :span="1">&nbsp;</el-col>
            <el-col :span="3">
              银行账号:
            </el-col>
            <el-col :span="7">
              <el-input v-model="viewItem.BankAccNo" :autosize="{ minRows: 2, maxRows: 4}" type="text" :readonly="true" />
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="cardList"
          border
          fit
          highlight-current-row
          size="mini"
        >
          <el-table-column label="序号" type="index" prop="index" align="center" width="60" />
          <el-table-column label="卡号" prop="CardNo" align="center" width="160" />
          <el-table-column label="持卡人" prop="HolderName" align="center" width="100" />
          <el-table-column label="证件号" prop="HolderCerNo" align="center" width="90" />
          <el-table-column label="卡状态" prop="CardStateName" align="center" width="60" />
          <el-table-column label="有效期" prop="BeginDate" align="center" width="140">
            <template slot-scope="scope2">
              <span>{{ formatDT(scope2.row.BeginDate,'yy-MM-dd') +'--'+ formatDT(scope2.row.EndDate,'yy-MM-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="卡余额" prop="Moneys" align="center" width="80" />

        </el-table>

      </div>
    </div>
  </div>

</template>

<script>
import { custInfoQuery, custInfoFind, custCardQuery } from '@/api/card'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive

export default {
  name: 'CardInfoQuery',
  components: { },
  directives: { waves },
  filters: {
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      cardList: null,
      total: 0,
      listLoading: true,
      customerQuery: {},
      listQuery: {
      },
      viewItem: {

      },
      dialogFormVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogStatus: '',
      downloadLoading: false
    }
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      custInfoQuery(this.listQuery).then(response => {
        console.info(response.data)
        this.list = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    handleViewDetail(data) {
      this.customerQuery.AccNo = data.id
      console.info(this.customerQuery)
      custInfoFind(this.customerQuery).then(response => {
        this.viewItem = response.data
        console.info(response.data)
        custCardQuery(this.customerQuery).then(response => {
          console.info(response.data.items)
          this.cardList = response.data.items
        })
      })
    },
    handleNodeClick(data) {
      this.handleViewDetail(data)
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    }
  }
}
</script>
