import Mock from 'mockjs'

var List =
  [
    Mock.mock({
      TypeName: '员工卡',
      QtySum: '@integer(10,100)',
      MoneySum: '@integer(200,2000)',
      CountSum: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '非卡',
      QtySum: '@integer(10,100)',
      MoneySum: '@integer(200,2000)',
      CountSum: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '合计',
      QtySum: '@integer(10,100)',
      MoneySum: '@integer(200,2000)',
      CountSum: '@integer(1,10)'
    })
  ]

export default [
  {
    url: '/card/cardOilStationSum',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  }
]

