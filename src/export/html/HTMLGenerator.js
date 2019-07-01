import CSSFactory from '../CSSFactory'
import Generator from '../Generator'
import HTMLFactory from './HTMLFactory'
import HTMLPageWriter from './HTMLPageWriter'

class HTMLGenerator {

  run(app, conf) {
    let generator = new Generator(
        new HTMLFactory(conf), 
        new CSSFactory(conf.css.grid,  conf.css.prefix, true)
    )
    let result = generator.run(app, conf.css.grid)
    let writer = new HTMLPageWriter()
    let files = writer.getFiles(result, conf)
    return files
  }

}
export default new HTMLGenerator()