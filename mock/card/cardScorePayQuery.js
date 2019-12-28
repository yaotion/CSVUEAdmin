import Mock from 'mockjs'

const List = []
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    OptTime: '@datetime',
    GoodsName: '@ctitle(5)',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    GoodsNum: '@integer(1,5)',
    GoodsCent: '@integer(200,1000)',
    CurCent: '@integer(200,1000)',
    StationNo: '000000' + '@string("number", 1, 1)'
  }))
}

export default [
  {
    url: '/card/cardScorePayQuery',
    type: 'get',
    response: config => {
      const { begintime, endtime, cardNo } = config.query

      const mockList = List.filter(item => {
        if (begintime && item.OptTime < begintime) return false
        if (endtime && item.OptTime > endtime) return false
        if (cardNo) return false
        return true
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList,
          sum: sum
        }
      }
    }
  }
]

