import Mock from 'mockjs'
const List = []
const OilCodeArray = ['1020', '1040', '2001']
const OilNameArray = ['92#汽油', '95#汽油', '0#柴油']

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@integer(1,9)',

    Emp_No: '0' + '@integer(1,9)',
    OptName: '@cname',

    OilName: function() {
      return OilNameArray[this.RandID]
    },
    Oil_Code: function() {
      return OilCodeArray[this.RandID]
    },
    Buss_Date: '@date',
    Shift_No: '@integer(1,3)',
    Tank_No: '@integer(1,9)',
    Alarm_Type: '',
    Start_Time: '@datetime',
    End_Time: '@datetime',
    Water_Height: '@float(20,200,2,2)',
    Oil_Height: '@float(20,200,2,2)',
    Oil_Temp: '@float(2,40,2,2)',
    OptTime: '@datetime'
  }))
}

export default [
  {
    url: '/station/stationTankAlarmQuery',
    type: 'get',
    response: config => {
      const { begintime, endtime, page = 1, limit = 20, stationNo } = config.query

      const mockList = List.filter(item => {
        if (begintime && item.OptTime < begintime) return false
        if (endtime && item.OptTime > endtime) return false
        if (stationNo && stationNo !== item.stationno) return false
        return true
      })

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

