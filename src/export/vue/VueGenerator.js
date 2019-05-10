import CSSFactory from '../CSSFactory'
import Generator from '../Generator'
import VueFactory from './VueFactory'
import VueMultiPageWriter from './VueMultiPageWriter'

export default class VueGenerator {

  run(app, conf) {
    let generator = new Generator(new VueFactory(), new CSSFactory(conf.css.responsive))
    let result = generator.run(app)
    let writer = new VueMultiPageWriter()
    let files = writer.getFiles(result, conf)
    return files
  }
}