import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    cardtype: +Mock.Random.integer(1, 6),
    cardno: '01000111100000' + '@string("number", 4, 4)',
    maketime: '@datetime',
    operator: '@cname',
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/card/makelist',
    type: 'get',
    response: config => {
      const { timespan, page = 1, limit = 20, sort } = config.query
      let mockList = List.filter(item => {
        if (timespan && item.timespan !== timespan) return false
        return true
      })

      if (sort === '-maketime') {
        mockList = mockList.reverse()
      }

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

