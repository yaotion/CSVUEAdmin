import Mock from 'mockjs'
const BlackListTypeNameArray = ['基础黑名单', '新增黑名单', '新删黑名单']
const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    StationNo: '0000000' + '@string("number", 1, 1)',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    BlackListType: '@integer(0,2)',
    BlackListTypeName: function() {
      return BlackListTypeNameArray[this.BlackListType]
    },
    BlackListVersion: '@integer(1,254)',
    StationUpdateTime: '@datetime',
    PostUpdateTime: '@datetime',
    TimeSpan: '@integer(1,254)',
    IsTimeout: function() {
      return this.TimeSpan > 5 ? '是' : '否'
    },
    pageviews: '@integer(300, 5000)'
  }))
}

const BlackListVersion = Mock.mock({
  BlackVer: '@integer(1, 254)',
  AddBlackVer: '@integer(1, 254)',
  DelBlackVer: '@integer(1, 254)'
})
export default [
  {
    url: '/card/cardBlackListCheckQuery',
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
          items: pageList,
          sum: BlackListVersion
        }
      }
    }
  }
]

