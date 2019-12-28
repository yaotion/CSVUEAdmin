
const List = ['01', '02', '03', '04']

export default [
  {
    url: '/station/stationStationTanks',
    type: 'get',
    response: config => {
      const mockList = List

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

