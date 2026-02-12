class DataInSheet {
  constructor(spreadSheetId, sheetName, startRow, startCol, titles) {
    this.sheetName = sheetName
    this.startRow = startRow
    this.startCol = startCol
    this.titles = titles
    if (spreadSheetId) {
      this.sheet = SpreadsheetApp.openById(spreadSheetId).getSheetByName(this.sheetName)

    } else {
      this.sheet = SpreadsheetApp.getActive()
    }


    this.usedRows = this.sheet.getLastRow() - this.startRow >= 0 ? this.sheet.getLastRow() - startRow + 1 : 0
    this.usedCols = this.sheet.getLastColumn() - this.startCol >= 0 ? Math.max(this.sheet.getLastColumn() - this.startCol, titles.length) : 0

  }
  _getRawData() {
    if (this.usedRows > 0 && this.usedCols > 0) {
      const range = this.sheet.getRange(this.startRow, this.startCol, this.usedRows, this.usedCols)
      return range.getDisplayValues()
    } else {
      return null
    }

  }
  getData() {
    const rawData = this._getRawData()
    if (rawData) {
      return rawData.map(row => {
        return this.titles.reduce((p, title, index) => {
          return {
            ...p,
            [title]: row[index]
          }
        }, {})
      })
    } else {
      return null
    }
  }
  appendRow(data) {
    let dataTobeWritten = this.titles.map(title => {
      return data[title]
    })
    if (this.startCol > 1) {
      dataTobeWritten = [...Array(this.startCol - 1).fill(null), ...dataTobeWritten]

    }
    this.sheet.appendRow(dataTobeWritten)
  }
  updateRow(key, keyValue, rowData) {//rowData dang {key1:value1, key2:value2}
    const data = this.getData()
    const foundRow = data.findIndex(row => {
      return row[key] == keyValue
    })
    if (foundRow) {
      const currentRowData = data[foundRow]
      const newRowData = this.titles.map(title => {
        return rowData[title] ?? currentRowData[title]
      })
      this.sheet.getRange(this.startRow + foundRow, this.startCol, 1, newRowData.length).setValues([newRowData])
    } else {
      log('Khoong tim thay dong')
    }
  }

}
