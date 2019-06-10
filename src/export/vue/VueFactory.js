
import HTMLFactory from '../html/HTMLFactory'
import ImportUtil from '../ImportUtil'
import * as Util from '../ExportUtil'

export default class VueFactory extends HTMLFactory {

    constructor(conf) {
        super(conf)
        if (conf && conf.targets && conf.targets.images && conf.targets.vue) {
            this.imagePrefix = ImportUtil.get(conf.targets.vue, conf.targets.images)
        }
    }

    element_CheckBox(element, styles) {
        let css = this.css(styles)
        let databinding = this.getDataBinding(element)
        return `<input type="checkbox" css="${css}" class="${css}" ${databinding} />`
    }

    element_TextBox(element, styles) {
        let css = this.css(styles)
        let placeholder = ''
        if (element.props.placeholder) {
            placeholder = element.props.label
        }
        let databinding = this.getDataBinding(element)
        return `<input type="text" placeholder="${placeholder}" class="${css}" ${databinding}/>`
    }

    getAction (element, gridModel) {
        if (element.lines) {
            let click = element.lines.find(l => l.event === 'click')
            if (click && click.screen) {
                let screen = gridModel.screens.find(s => s.id === click.screen.id)
                if (screen) {
                    return `@click="navigateTo('${Util.getFileName(screen.name)}')"`
                }
            }
        }
        return ''
    }

    getDataBinding (element) {
        if (element.props && element.props.databinding) {
            let databinding = element.props.databinding.default
            return `v-model="${databinding}"`
        }
        return ''
    }

   

}
