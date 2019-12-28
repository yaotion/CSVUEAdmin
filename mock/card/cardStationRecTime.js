
export default [
  {
    url: '/card/cardStationRecTime',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: {
          StationNameList: ['001油站', '002油站', '003油站', '004油站', '005油站', '006油站'],
          StationTimeList: ['2019-07-21', '2019-07-22', '2019-07-23', '2019-07-24', '2019-07-25', '2019-07-26'],
          StandardTimeList: ['2019-07-22', '2019-07-23', '2019-07-24', '2019-07-25', '2019-07-26', '2019-07-27']
        }
      }
    }
  }
]

