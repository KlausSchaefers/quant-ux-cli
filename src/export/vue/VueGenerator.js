import CSSFactory from '../CSSFactory'
import Generator from '../Generator'
import VueFactory from './VueFactory'
import VueMultiPageWriter from './VueMultiPageWriter'
import RouterFactory from './RouterFactory'
import * as ExportUtil from '../ExportUtil'

export default class VueGenerator {

  run(app, conf) {
    let generator = new Generator(
        new VueFactory(conf), 
        new CSSFactory(conf.css.responsive, conf.css.prefix, true)
    )
    let result = generator.run(app, conf.css.responsive)
    let writer = new VueMultiPageWriter()
    let files = writer.getFiles(result, conf)
    files = files.concat(ExportUtil.getImages(app))
    if (conf.vue && conf.vue.generateRouter === true) {
      files = new RouterFactory().run(files, conf, app)
    }
    return files
  }
}