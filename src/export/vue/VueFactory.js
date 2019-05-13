
import HTMLFactory from '../html/HTMLFactory'

export default class VueFactory extends HTMLFactory {

    constructor() {
        super()
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

    getDataBinding (element) {
        if (element.props && element.props.databinding) {
            let databinding = element.props.databinding.default
            return `v-model="${databinding}"`
        }
        return ''
    }

}
