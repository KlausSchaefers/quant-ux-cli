
export default class HTMLFactory {

  constructor () {
  }

  screen (screen, styles, childTemplates) {
    let css = this.css(styles)
    let inner = childTemplates.join('')
    return `<div class="${css} MatcSreen">${inner}</div>`
  }

  container (container, styles, childTemplates) {
    let css = this.css(styles)
    let inner = childTemplates.join('')
    return `<div class="${css.trim()}"> ${inner}</div>`
  }


  element (element, styles) {
    if (this['element_' + element.type]) {
      return this['element_' + element.type](element, styles)
    }
    let css = this.css(styles)
    let label = ''
    if (element.props.label) {
      label = element.props.label
    }
    return `<div class="${css}">${label}</div>`
  }

  element_CheckBox (element, styles) {
    let css = this.css(styles)
    return `<input type="checkbox" css="${css}" class="${css}" checked="${this.stripHTML(element.props.selected)}">`
  }

  element_TextBox (element, styles) {
    let css = this.css(styles)
    let placeholder = ''
    let value = element.props.label
    if (element.props.placeholder) {
      placeholder = value
      value = ''
    }
    return `<input type="text" placeholder="${placeholder}" class="${css}" value="${value}">`
  }

  css (styles) {
    if (styles) {
      return styles.map(s => s.css).join(' ').trim()
    }
    return ''
  }

  stripHTML(s) {
		if (s == null || s == undefined)
			s = "";
		if (s.replace) {
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/<\/?[^>]+(>|$)/g, "");
			s = s.replace(/\n/g, "<br>");
			s = s.replace(/\$perc;/g, "%");
		}
		return s;
	}
}
