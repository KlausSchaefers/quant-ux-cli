import CSSFactory from './CSSFactory'
import Generator from './Generator'
import HTMLFactory from './html/HTMLFactory'
import * as ExportUtil from './ExportUtil'
import HTMLPageWriter from './html/HTMLPageWriter'
import VueFactory from './vue/VueFactory'
import VueMultiPageWriter from './vue/VueMultiPageWriter'

class GeneratorFactory {

    create (app, conf) {
        if (conf.type.toLowerCase() === 'vue') {
            let vueGenerator = new Generator(new VueFactory(), new CSSFactory(conf.css.responsive))
			let vueResult = vueGenerator.run(app)
			let writer = new VueMultiPageWriter()
            let files = writer.getFiles(vueResult, conf)
            return files
        }
        if (conf.type.toLowerCase() === 'html') {
            let vueGenerator = new Generator(new HTMLFactory(), new CSSFactory(conf.css.responsive))
			let vueResult = vueGenerator.run(app)
			let writer = new HTMLPageWriter()
            let files = writer.getFiles(vueResult, conf)
            return files
        }
    }

}
export default new GeneratorFactory()