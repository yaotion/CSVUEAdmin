import Mock from 'mockjs'

const List = []
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    optTime: '@datetime',
    Gift: '@ctitle(5)',
    CardNo: '01000111100000' + '@string("number", 4, 4)',
    Number: '@integer(1,5)',
    ScoreSpent: '@integer(200,1000)',
    ScoreBalance: '@integer(200,1000)'

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

