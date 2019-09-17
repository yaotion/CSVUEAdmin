import Mock from 'mockjs'
const BoolArray = ['否', '是']
const CardStateNameArray = ['初始化', '储值', '售卡', '正常', '挂失', '退卡']
const mockCardResponse = Mock.mock(
  {
    id: '',
    // 姓名
    HolderName: '@cname',
    // 手机号
    TaxCode: '8765' + '@string("number", 8, 8)',
    CustName: '@cname',
    // 卡账余额
    AccMoney: '@float(200, 500,2 ,2)',
    AccNo: '000' + '@string("number", 1, 1)',
    HelpSign: '@string("number", 7, 7)',
    // 账户名称
    AccName: '散户',
    Address: '@county(true)',
    PostCode: '@zip()',
    // 有效期
    BeginDate: '@date("yyyyMMdd")',
    EndDate: '@date("yyyyMMdd")',
    // 证件号码
    CustCerNo: '41000111100000' + '@string("number", 4, 4)',
    BankName: '@county(true)',
    BankAccNo: '@natural'
  })

export default [
  {
    url: '/card/custInfoFind',
    type: 'get',
    response: config => {
      const { label } = config.query
      mockCardResponse.AccName = label
      return {
        code: 20000,
        data: mockCardResponse
      }
    }
  }
]

