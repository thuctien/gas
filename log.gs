//This funtion will write everything you want to log to an Google sheets for an easier debug
const LOG_SHEET_NAME='log'
const SPREAD_SHEET_FILE_ID='YOUR_GOOGLE_SHEET_FILE_ID'


function log() {
  let string = ''
  if (arguments.length > 0) {
    for (let i = 0; i < arguments.length; i++) {
      let arg = arguments[i]
      string = string + parseString(arg)

    }
  }

  const spreadSheetFile = SpreadsheetApp.openById(SPREAD_SHEET_FILE_ID)
// In case GAS file is bounded by Googlesheet file, using this  
// const spreadSheetFile = SpreadsheetApp.getActive()
  const logSheet = spreadSheetFile.getSheetByName(LOG_SHEET_NAME)
  try {
    const current = new Date()
    const currentString = `${current.toLocaleDateString('vi-VN')} @${current.toLocaleTimeString('vi-VN')} `
    const data = [string, currentString]
    logSheet.appendRow(data)
  } catch (error) {
    logSheet.appendRow(['Co loi do ham log sinh ra'])
    logSheet.appendRow([error.message])

  }
}





function parseString(item) {
  if (item === undefined) return "undefined";
  if (item === null) return "null";

  // Nếu là Object hoặc Array
  if (typeof item === 'object') {
    try {
      return JSON.stringify(item, (key, value) => {
        // Xử lý để JSON.stringify không bỏ qua undefined và function
        if (typeof value === 'undefined') return 'undefined';
        if (typeof value === 'function') return value.toString();
        return value;
      }, null);
    } catch (e) {
      return "[Error: Không thể parse đối tượng]";
    }
  }

  // Đối với các kiểu nguyên thủy khác (Number, Boolean, String, Symbol, BigInt)
  return String(item);
}
