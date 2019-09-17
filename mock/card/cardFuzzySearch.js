import Mock from 'mockjs'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    CardNo: '01000111100000' + '@string("number", 4, 4)'
  }))
}

export default [
  {
    url: '/card/cardFuzzySearch',
    type: 'get',
    response: config => {
      const { CardNo } = config.query

      const mockList = List.filter(item => {
        if (item.CardNo.indexOf(CardNo, 0) > 0) { return true }
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  }
]

