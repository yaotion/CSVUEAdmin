<template>
  <div class="app-container">
    <div class="filter-container">
      <ColChart height="500px" :x-data="chartXData" :y-data="chartYData" :main-data="chartData" width="100%" />
    </div>
  </div>
</template>

<script>
import { cardStationRecTime } from '@/api/card'

import ColChart from '@/components/Charts/ChartColStardard'

export default {
  name: 'CardStationRecTime',
  components: { ColChart },

  data() {
    return {
      chartXData: [],
      chartYData: [],
      chartData: [
        {
          name: '',
          type: 'bar',
          // data: [18203, 23489, 29034, 104970, 131744, 630230]
          data: [],
          itemStyle: {
            normal: {
              color: 'rgba(0,191,183,1)',
              label: {
                show: true,
                position: 'right',
                formatter: '{c}',
                textStyle: {
                  color: '#ffffff',
                  fontsize: '9px'
                }
              }
            }
          }
        }
      ],
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: {
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  mounted() {
    this.getList()
  },
  created() {

  },
  methods: {
    getList() {
      this.listLoading = true
      cardStationRecTime(this.listQuery).then(response => {
        // this.chartData[0].data = ['2019-07-22', '2019-07-23 12:00:00', '2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27']
        // this.chartYData = ['00000001油站', '00000002油站', '00000003油站', '00000004油站', '00000005油站', '00000006油站']
        // this.chartXData = ['2019-07-21', '2019-07-22', '2019-07-23', '2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27']
        this.chartData[0].data = response.data.StationTimeList
        this.chartYData = response.data.StationNameList

        this.chartXData = response.data.StandardTimeList
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>
