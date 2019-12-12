import * as ExportUtil from '../ExportUtil'

export default class DownloadGenerator {

  run(app, conf) {

    let files = ExportUtil.getImages(app)
    files.push({
        type: 'app',
        name: 'app.json',
        content: JSON.stringify(app, null, 2)
    })
    return files
  }
}