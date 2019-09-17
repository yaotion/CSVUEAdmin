import Mock from 'mockjs'

const List = []

const count = 10

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    OptNo: '000' + i,
    OptName: '@cname',
    OptOrg: 'XXXXX' + i + '站',
    OptDuty: '@cname',
    Remark: '@cparagraph(1, 3)',
    Enabled: true
  }))
}

export default [
  {
    url: '/operator/operatorDetailListQuery',
    type: 'get',
    response: config => {
      const { stationNo, stationType } = config.query

      const mockList = List.filter(item => {
        if (stationNo && item.StationNo !== stationNo) return false
        if (stationType && item.StationType !== stationType) return false
        return true
      })

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: mockList
        }
      }
    }
  },

  {
    url: '/operator/operatorAdd',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/operator/operatorUpdate',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/operator/operatorDelete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/operator/operatorUpdatePassword',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }

]

