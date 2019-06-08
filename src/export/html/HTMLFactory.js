import pretty from 'pretty'
import ImportUtil from '../ImportUtil'
import * as ExportUtil from '../ExportUtil'

export default class HTMLFactory {

  constructor(conf) {
    this.conf = conf
    if (conf && conf.targets && conf.targets.images && conf.targets.html) {
      this.imagePrefix = ImportUtil.get(conf.targets.html, conf.targets.images)
    }
  }

  screen(screen, styles, childTemplates) {
    let css = this.css(styles)
    let inner = childTemplates.join('')
    let result = `<div class="${css} MatcSreen">${inner}</div>`
    return pretty(result)
  }

  container(container, styles, childTemplates) {
    let css = this.css(styles)
    let inner = childTemplates.join('')
    return `<div class="${css.trim()}"> ${inner}</div>`
  }


  element_Label(element, styles) {
    let css = this.css(styles)
    let label = element.props.label
    return `<label  class="${css}" >${label}</label>`
  }


  element(element, styles) {
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

  element_CheckBox(element, styles) {
    let css = this.css(styles)
    return `<input type="checkbox"  class="${css}" checked="${this.stripHTML(element.props.selected)} />`
  }

  element_TextBox(element, styles) {
    let css = this.css(styles)
    let placeholder = ''
    let value = element.props.label
    if (element.props.placeholder) {
      placeholder = value
      value = ''
    }
    return `<input type="text" placeholder="${placeholder}" class="${css}" value="${value}" />`
  }

  element_Box(element, styles) {
    let css = this.css(styles) 
    let label = ''
    if (element.props.label) {
      label = element.props.label
    }
    return `<div class="${css}">${label}</div>`
  }

  element_Button(element, styles) {
    let css = this.css(styles) 
    let label = ''
    if (element.props.label) {
      label = element.props.label
    }
    return `<div class="${css}">${label}</div>`
  }

  element_Label(element, styles) {
    let css = this.css(styles) 
    let label = ''
    if (element.props.label) {
      label = element.props.label
    }
    return `<div  class="${css}">${label}</div>`
  }

  element_ToggleButton(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_ImageCarousel(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_CheckBox(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_CheckBoxGroup(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Date(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_DateDropDown(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }
 
  element_DragNDrop(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_DropDown(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_HoverDropDown(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_HotSpot(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Icon(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_IconToggle(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_LabeledIconToggle(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Image(element, styles) {
    let css = this.css(styles) 
    let backgroundImage =  element.style.backgroundImage
    if (backgroundImage) {
      let src = this.imagePrefix + '/' + ExportUtil.getImageLocation(element,backgroundImage.url)
      return `<img src="${src}" class="${css}" />`
    }
    return ''
  }

  element_MobileDropDown(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_RadioBox2(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_RadioGroup(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Rating(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_HSlider(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Spinner(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Stepper(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Switch(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Table(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_TextBox(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_TextArea(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Password(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_TypeAheadTextBox(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_VolumeSlider(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_Repeater(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_SegmentButton(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_BarChart(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_PieChart(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_MultiRingChart(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  element_RingChart(element, styles) {
    let css = this.css(styles) 
    return `<div  class="${css}" />`
  }

  css(styles) {
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
