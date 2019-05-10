import VueGenerator from './vue/VueGenerator'
import HTMLGenerator from './html/HTMLGenerator'

class GeneratorFactory {

    create (conf) {
        if (conf.type.toLowerCase() === 'vue') {
           return new VueGenerator()
        }
        if (conf.type.toLowerCase() === 'html') {
            return new HTMLGenerator()
        }
    }

}
export default new GeneratorFactory()