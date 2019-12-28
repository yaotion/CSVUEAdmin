<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Refresh
      </el-button>
    </div>
    <div id="tablePrint">
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
        <el-table-column label="油品编码" prop="OilCode" align="center" width="100" />
        <el-table-column label="油品名称" prop="OilName" align="center" width="200" />
        <el-table-column label="油品密度" prop="OilDensity" align="center" width="100">
          <template slot-scope="{row}">
            <template v-if="row.mode > 0">
              <el-input v-model="row.OilDensity" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.OilDensity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="油品单价" prop="OilPrice" align="center" width="100">
          <template slot-scope="{row}">
            <template v-if="row.mode > 0">
              <el-input v-model="row.OilPrice" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.OilPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否启用" prop="OilEnabled" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.OilEnabled===1?"√":"" }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="notExporting" label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <template v-if="row.mode > 0">
              <el-button type="success" size="small" icon="el-icon-circle-check-outline" @click="confirmEdit(row)">
                Ok
              </el-button>
              <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(row)">
                cancel
              </el-button>
            </template>
            <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button> -->
            <template v-else-if="row.OilEnabled">
              <el-button size="small" icon="el-icon-delete" type="danger" @click="handleDelete(row)">
                禁用
              </el-button>
              <el-button size="small" icon="el-icon-delete" type="danger" @click="row.mode = 2">
                编辑
              </el-button>
            </template>
            <el-button v-else type="primary" size="small" icon="el-icon-edit" @click="row.mode = 1">
              启用
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { centerOilDetailListQuery, centerOilAdd, centerOilUpdate, centerOilDelete } from '@/api/centerOilManage'
import { tableToExcel } from '@/utils/excelUtils'
// import printJS from 'print-js'
import waves from '@/directive/waves' // waves directive
export default {
  name: 'PayWayManage',
  directives: { waves },
  filters: {
  },
  data() {
    return {
      notExporting: true,
      tableKey: 0,
      list: null,
      listLoading: true,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '结算方式修改',
        create: '新建结算方式'
      },
      rules: {
        PayWay: [
          { required: true, message: '结算方式编号不能为空', trigger: 'blur' },
          { type: 'number', message: '结算方式编号必须为数字值', trigger: 'blur' }
        ],
        PayWayName: [{ required: true, message: '结算方式名称不能为空', trigger: 'blur' }]
      },
      temp: {
        PayWay: 0,
        PayWayName: ''
      },
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
      centerOilDetailListQuery(this.listQuery).then(response => {
        const items = response.data.items
        this.list = items.map(v => {
          this.$set(v, 'mode', 0) // https://vuejs.org/v2/guide/reactivity.html
          v.originalPrice = v.OilPrice //  will be used when user click the cancel botton
          v.originalDensity = v.OilDensity
          return v
        })
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.getList()
    },

    resetTemp() {
      this.temp = {
        PayWay: 0,
        PayWayName: ''
      }
    },

    createData(row) {
      this.temp = Object.assign({}, row)

      centerOilAdd(this.temp).then(() => {
        this.temp.OilEnabled = true
        this.temp.mode = 0
        this.handleFilter()
      })
    },

    updateData(row) {
      this.temp = Object.assign({}, row)
      console.info(this.list)
      centerOilUpdate(this.temp).then(() => {
        this.temp.OilEnabled = true
        this.temp.mode = 0
        this.handleFilter()
      })
    },
    handleDeleteMethod(row) {
      centerOilDelete(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.handleFilter()
      })
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDeleteMethod(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    cancelEdit(row) {
      row.title = row.originalTitle
      row.mode = 0
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      if (row.mode === 1) { this.createData(row) } else { this.updateData(row) }
    },
    reOrderList() {
      this.list.sort(function(x, y) {
        if ((x.OilEnabled) && (!y.OilEnabled)) { return -1 }
        if ((!y.OilEnabled) && (x.OilEnabled)) { return 1 }
        if (x.OilCode < y.OilCode) return -1
        return 1
      })
    },
    handleDownload() {
      this.downloadLoading = true
      this.notExporting = false
      this.$nextTick(() => {
        var dataTmp = document.querySelector('#tabData')
        try {
          tableToExcel(dataTmp, '结算方式列表')
        } finally {
          this.notExporting = true
          this.downloadLoading = false
        }
      })
    }
  }
}
</script>
