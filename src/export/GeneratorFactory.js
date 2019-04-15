import CSSFactory from './CSSFactory'
import Generator from './Generator'
import HTMLFactory from './html/HTMLFactory'
import * as ExportUtil from './ExportUtil'
import HTMLPageWriter from './html/HTMLPageWriter'
import VueFactory from './vue/VueFactory'
import VueMultiPageWriter from './vue/VueMultiPageWriter'

class GeneratorFactory {

    create (app, conf) {
        if (conf.type === 'vue') {
            let vueGenerator = new Generator(new VueFactory(), new CSSFactory(conf.css.responsive))
			let vueResult = vueGenerator.run(app)
			let writer = new VueMultiPageWriter()
            let files = writer.getFiles(vueResult)
            return files
        }
        if (conf.type === 'html') {
            let vueGenerator = new Generator(new HTMLFactory(), new CSSFactory(conf.css.responsive))
			let vueResult = vueGenerator.run(app)
			let writer = new HTMLPageWriter()
            let files = writer.getFiles(vueResult)
            return files
        }
    }

}
export default new GeneratorFactory()