import Mock from 'mockjs'

const List = []
const count = 20
const sum = {}
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    optTime: '@datetime',
    ScoreType: '----',
    Score: '@integer(200,1000)',
    ScoreBalance: '@integer(200,1000)',
    AWard: '@sentence'

  }))
}

export default [
  {
    url: '/card/cardScoreBillQuery',
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

