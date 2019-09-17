
const List = []
const count = 10

for (let i = 1; i < count; i++) {
  List.push({
    id: '000' + (i).toString(),
    label: '000' + (i).toString(),
    children: [{
      id: '000' + (i).toString() + '000' + (i).toString() + '000' + (i).toString(),
      label: '000' + (i).toString() + '000' + (i).toString() + '  000' + (i).toString()
    }]
  }
  )
}

export default [
  {
    url: '/card/custInfoQuery',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: List
      }
    }
  }
]

