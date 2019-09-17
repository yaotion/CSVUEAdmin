import Mock from 'mockjs'

var List =
  [
    Mock.mock({
      TypeName: '售卡数量',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '挂失数量',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '开户数量',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '销户数量',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '修改卡信息次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '挂失数量',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '修改卡密码次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '重装卡密码次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '重新发卡次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '解灰次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '挂失退卡次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '修改客户密码次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '修改客户信息次数',
      sumValue: '@integer(1,10)'
    }),
    Mock.mock({
      TypeName: '转账金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '反转账金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '圈提金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '单位客户存钱金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '散户储值金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '冲正金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '销户退款',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '应收款',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '退至单位账户金额',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '存钱客户存钱 A1',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '记账客户存钱 A2',
      sumValue: '@float(10,1000,2,2)'
    }),
    Mock.mock({
      TypeName: '单位客户存钱=A1+A2',
      sumValue: '@float(10,1000,2,2)'
    })
  ]

export default [
  {
    url: '/card/cardSaleStationSum',
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

