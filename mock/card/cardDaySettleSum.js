import Mock from 'mockjs'

var List =

    Mock.mock({
      startAccBalance: '@float(2000,3000,2,2)',
      startCardAccBalance: '@float(2000,3000,2,2)',
      startCardBalance: '@float(2000,3000,2,2)',
      startSumBalacne: function() {
        return (this.startAccBalance + this.startCardAccBalance + this.startCardBalance).toFixed(2)
      },
      saveMoney: '@float(0,500,2,2)',
      preMoney: '@float(0,500,2,2)',
      reSaveMoney: '@float(0,500,2,2)',
      tradeMoney: '@float(0,500,2,2)',
      returnMoney: '@float(0,500,2,2)',
      reDeposit: '@float(0,500,2,2)',
      durationSum: function() {
        return (this.saveMoney + this.preMoney - this.reSaveMoney - this.tradeMoney - this.returnMoney - this.reDeposit).toFixed(2)
      },
      endAccBalance: '@float(0,500,2,2)',
      endCardAccBalance: '@float(2000,3000,2,2)',
      endCardBalance: '@float(2000,3000,2,2)',
      endSumBalacne: '@float(2000,3000,2,2)',
      isBalance: '否',
      nowDate: '@datetime'
    })

export default [
  {
    url: '/card/cardDaySettleSum',
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

