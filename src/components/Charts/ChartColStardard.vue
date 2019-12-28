<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },

    mainData: {
      type: Array,
      default: function() { return [] } },

    xData: {
      type: Array,
      default: function() { return [] } },
    yData: {
      type: Array,
      default: function() { return [] } }
  },
  data() {

  },
  watch: {
    mainData: function() {
      this.initChart()
    },
    xData: function() {
      this.initChart()
    }, yData: function() {
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#344b58',
        title: {
          text: '油站最后传输时间表',
          x: '20',
          top: '20',
          textStyle: {
            color: '#fff',
            fontSize: '22'
          }
        },

        toolbox: {
          show: false
        },
        grid: {
          borderWidth: 0,
          top: 60,
          bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        calculable: true,
        xAxis: [{
          type: 'time',
          splitNumber: 10,
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          boundaryGap: false,
          axisTick: {
            show: false
          },
          data: this.xData
        }],
        yAxis: [
          {
            type: 'category',
            data: this.yData,
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#90979c'
              }
            },
            axisTick: {
              show: false
            }
          }
        ],

        series: this.mainData
      })
    }
  }
}
</script>
