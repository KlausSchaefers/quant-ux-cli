
import * as Util from './ExportUtil'

export default class {

	constructor (isResponsive = false, prefix = 'MACT') {
		this.isResponsive = isResponsive
		this.prefix = prefix
		this.marginWhiteSpaceCorrect = 0;

		this.mapping = {
			"background" : "background-color",

			"color" : "color",
			"textAlign" : "text-align",
			"fontFamily" : "font-family",
			"fontSize" : "font-size",
			"fontStyle" : "font-style",
			"fontWeight" : "font-weight",
			"letterSpacing" : "letter-spacing",
			"lineHeight" : "line-height",

			"borderBottomColor" : "border-bottom-color",
			"borderTopColor" : "border-top-color",
			"borderLeftColor" : "border-left-color",
			"borderRightColor" : "border-right-color",

			"borderBottomLeftRadius" : "border-bottom-left-radius",
			"borderTopLeftRadius" : "border-top-left-radius",
			"borderBottomRightRadius" : "border-bottom-right-radius",
			"borderTopRightRadius" : "border-top-right-radius",

			"borderBottomWidth" : "border-bottom-width",
			"borderTopWidth" : "border-top-width",
			"borderLeftWidth" : "border-left-width",
			"borderRightWidth" : "border-right-width",

			"borderTopStyle" : "border-top-style",
			"borderBottomStyle" : "border-bottom-style",
			"borderRightStyle" : "border-left-style",
			"borderLeftStyle" : "border-right-style",

			"paddingBottom" : "padding-bottom",
			"paddingLeft" : "padding-left",
			"paddingRight" : "padding-right",
			"paddingTop" : "padding-top",

			"marginBottom" : "margin-bottom",
			"marginLeft" : "margin-left",
			"marginRight" : "margin-right",
			"marginTop": "margin-top",

			"textDecoration" : "text-decoration",
			"boxShadow" : "box-shadow",
			"textShadow" : "text-shadow"
		}

		this.borderWidthProperties = ['borderBottomWidth', 'borderTopWidth', 'borderLeftWidth', 'borderRightWidth']
		this.borderStyleProperties = ['borderTopStyle', 'borderBottomStyle', 'borderRightStyle', 'borderLeftStyle']
		this.textProperties = [
			'color', 'textDecoration', 'textAlign', 'fontFamily',
			'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight'
		]

		this.isString = {
			"fontFamily": true
		},

		this.isPixel = {
			"borderBottomLeftRadius": true,
			"borderBottomRightRadius": true,
			"borderTopRightRadius": true,
			"borderTopLeftRadius": true,

			"borderBottomWidth": true,
			"borderLeftWidth": true,
			"borderTopWidth": true,
			"borderRightWidth": true,

			"paddingBottom": true,
			"paddingLeft": true,
			"paddingRight": true,
			"paddingTop": true,

			"fontSize": true
		}
	}

	generate(model) {
		let result = {}

		model.templates.forEach(t => {
			let style = {
				type: 'template',
				css: t.name.replace(/\s+/g, '_'),
				global:true,
				code: this.getCSS(t, screen, false)
			}
			result[t.id] = [style]
		})

		model.screens.forEach(screen => {
			result[screen.id] = []
			result[screen.id].push({
				type: 'screen',
				css: screen.name.replace(/\s+/g, '_'),
				global:false,
				code: this.getCSS(screen)
			})
			screen.children.forEach(child => {
				this.generateElement(child, result, screen)
			})
		})

		result['$NORMALIZE'] = []
		result['$NORMALIZE'].push({
			type: 'screen',
			css: '',
			global:true,
			code: this.getGlobalStyles()
		})

		return result
	}



	getGlobalStyles () {
		let result = ''
		result += `body {\n  margin:0px;\n  font-family:'Source Sans Pro', 'Helvetica Neue', 'Helvetica', sans-serif;\n}\n\n`
		result += `div {\n  margin:0px;\n}\n\n`
		return result
	}

	generateElement (node, result, screen) {

		result[node.id] = []

		if (node.template) {
			let template = result[node.template]
			if (template) {
				template.forEach(t => {
					result[node.id].push(t)
				})
			}
		}

		let name = this.getName(node);
		result[node.id].push({
			type: 'widget',
			css: name,
			global:false,
			code: this.getCSS(node, screen),
			inherited: node.inherited,
			inheritedScreen: node.inheritedScreen
		})

		if (node.children) {
			node.children.forEach(child =>{
				this.generateElement(child, result, screen)
			})
		}
	}


	getRaw (model, selectedWidgets) {
		var result = "";
		for (var i=0; i< selectedWidgets.length; i++) {
			var id = selectedWidgets[i];
			var widget = model.widgets[id];
			if (widget) {
				result += this.getCSS(widget, null, false)
			} else {
				this.logger.warn("getRaw", "No widget with id > " + widget);
			}
		}
		return result;
	}

	getCSS (widget, screen, position = true) {
		var result = "";

		var style = widget.style;
		style = Util.fixAutos(style, widget)

		let name = this.getName(widget);
		result += '.' + name + ' {\n'
		result += this.getRawStyle(style);

		if (position) {
			result += this.getPosition(widget, screen);
		}
		if (this['getCSS_' + widget.type]) {
			result += this['getCSS_' + widget.type](widget.style, widget)
		}
		result += '}\n\n'

		if (widget.hover) {
			result += '.' +name + ':hover {\n'
			result += this.getRawStyle(widget.hover);
			if (this['getCSS_' + widget.type]) {
				result += this['getCSS_' + widget.type](widget.hover, widget)
			}
			result += '}\n\n'
		}
		return result
	}

	getCSS_row () {
		return '  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: flex-start;\n  align-content: flex-start;\n'
	}

	getCSS_column() {
		return '  display: inline-block;\n'
	}


	getName(box){
		let name = box.name.replace(/\s+/g, '_')
		if (box.inherited) {
			name += 'Master'
		}
		return name
	}

	getPosition (widget) {
		let result = ''

		/**
		 * If the widget is on the root level, we use teh screen!
		 */
		let w = widget.w
		let h = widget.h
		let top = widget.y
		let left = Math.max(0, widget.x - this.marginWhiteSpaceCorrect)
		let unitX = 'px'
		let unitY = 'px'

		/**
		 * Take padding and border into account into account
		 */
		if (widget.style) {
			if (widget.style.paddingTop) {
				h -= widget.style.paddingTop
			}
			if (widget.style.paddingBottom) {
				h -= widget.style.paddingBottom
			}
			if (widget.style.paddingLeft) {
				w -= widget.style.paddingLeft
			}
			if (widget.style.paddingRight) {
				w -= widget.style.paddingRight
			}


			if (widget.style.borderTopWidth) {
				h -= widget.style.borderTopWidth
			}
			if (widget.style.borderBottomWidth) {
				h -= widget.style.borderBottomWidth
			}
			if (widget.style.borderLeftWidth) {
				w -= widget.style.borderLeftWidth
			}
			if (widget.style.borderRightWidth) {
				w -= widget.style.borderRightWidth
			}
		}

		if (this.isResponsive) {
			if (widget.parent){
				w = (w / widget.parent.w) * 100
				left = (left / widget.parent.w) * 100
			} else {
				w = 100
				left = 0
			}
			unitX = '%'
		}

		/**
		 * To deal with margin collapsing we set things to inline-block. We could
		 * still check for borders...
		 */
		if (this.getSiblings(widget).length > 1) {
			result += '  display: inline-block;\n'
		}

		result += `  width: ${w}${unitX};\n`
		result += `  height: ${h}${unitY};\n`
		result += `  margin-top: ${top}${unitY};\n`
		result += `  margin-left: ${left}${unitX};\n`

		return result
	}

	getSiblings (widget){
		if (widget.parent && widget.parent.children){
			return widget.parent && widget.parent.children
		}
		return []
	}

	getRawStyle (style) {
		var result = '  border:0px solid;\n'
		for (var key in this.mapping) {
			if (style[key] !== undefined && style[key] !== null) {
				var value = style[key];
				result += '  ' + this.getKey(key) + ': ' + this.getValue(key, value) + ';\n'
			}
		}
		return result;
	}

	getKey (key) {
		return this.mapping[key];
	}

	getValue (key, value) {
		var result = ''
		if (this.isString[key]) {
			result += '"' + value + '"';
		} else if (this.isPixel[key]) {
			result += value + 'px';
		} else if (key === "boxShadow") {
			result = value.h+"px "+ value.v+"px "+ value.b+"px "+ value.s + "px " + value.c;
			if (value.i) {
				result += 'inset'
			}
		} else if (key === 'textShadow') {
			result = value.h+"px "+ value.v+"px "+ value.b+"px "+ value.c;
		}
		else {
			result += value
		}
		return result;
	}

	clone (obj) {
        if (!obj) {
            return null
        }
        let _s = JSON.stringify(obj)
        return JSON.parse(_s)
    }
}