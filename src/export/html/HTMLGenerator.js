import CSSFactory from '../CSSFactory'
import Generator from '../Generator'
import HTMLFactory from './HTMLFactory'
import HTMLPageWriter from './HTMLPageWriter'

class HTMLGenerator {

  run(app, conf) {
    let generator = new Generator(new HTMLFactory(), new CSSFactory(conf.css.responsive))
    let result = generator.run(app)
    let writer = new HTMLPageWriter()
    let files = writer.getFiles(result, conf)
    return files
  }

}
export default new HTMLGenerator()