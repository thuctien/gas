function doPost(e) {
    try {
        const postData = JSON.parse(e.postData.contents)
        const { type, payload } = postData
        log('type', type)
        log('payload', payload)
        const mapping = {
            log: log
        }
        const callback = mapping[type]
        const result = callback(payload)
        log('result', result)
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.TEXT)
    } catch (error) {
        log('doPost return error')
        log(error)
    }
}

function forceAuth() {
  DriveApp.getRootFolder(); // This forces the Drive scope check
  const folder = DriveApp.createFolder('my test folder')
}
