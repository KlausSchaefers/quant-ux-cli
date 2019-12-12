import VueGenerator from './vue/VueGenerator'
import HTMLGenerator from './html/HTMLGenerator'
import DownloadGenerator from './download/DownloadGenerator'
import chalk from 'chalk';

class GeneratorFactory {

    create (conf) {
        if (conf.type.toLowerCase() === 'vue') {
           return new VueGenerator()
        }
        if (conf.type.toLowerCase() === 'html') {
            return new HTMLGenerator()
        }
        if (conf.type.toLowerCase() === 'download') {
            return new DownloadGenerator()
        }
        console.error(chalk.red('Not supported type : ' + conf.type.toLowerCase()))
    }

}
export default new GeneratorFactory()