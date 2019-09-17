import FileSaver from 'file-saver'
import XLSX from 'xlsx'

function file2Xce(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()
    reader.onload = function(e) {
      const data = e.target.result
      this.wb = XLSX.read(data, {
        type: 'binary'
      })
      if (this.wb.SheetNames.length > 0) {
        const ws = this.wb.Sheets[this.wb.SheetNames[0]]
        const result = XLSX.utils.sheet_to_json(ws)
        console.info(result)
        resolve(result)
      }
    }
    reader.readAsBinaryString(file.raw)
    // reader.readAsBinaryString(file) // 传统input方法
  })
}
/* generate workbook object from table */

export function tableToExcel(tabDom, ExcelName) {
  var xlsxParam = { raw: true, display: true } // 导出的内容只做解析，不进行格式转换

  const wb = XLSX.utils.table_to_book(tabDom, xlsxParam)

  /* get binary string as output */
  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })

  FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), ExcelName + '.xlsx')

  return wbout
}

export function ExcelToJson(file, callback) {
  // let file = file.files[0] // 使用传统的input方法需要加上这一步
  const types = file.name.split('.')[1]
  const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
  if (!fileType) {
    alert('格式错误！请重新选择')
    return
  }
  file2Xce(file).then(tabJson => {
    if (callback) {
      callback(tabJson)
    }
  })
}
