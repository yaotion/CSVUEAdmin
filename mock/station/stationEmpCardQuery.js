import Mock from 'mockjs'
const List = []

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@integer(1,9)',

    CardNo: '01000411100000' + '@string("number", 4, 4)',
    // const filterVal = ['index', 'StationNo', 'BatID', 'Terminal', 'MachNo',
    // 'Port', 'MachType', 'TankNo', 'OilName', 'UpdateTime']
    EmpNo: '0' + '@integer(0,9)',
    EmpName: '@cname',
    CerNo: '01000111100000' + '@string("number", 4, 4)'
  }))
}

export default [
  {
    url: '/station/stationEmpCardQuery',
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

