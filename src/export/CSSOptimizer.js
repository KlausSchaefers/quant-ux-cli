import * as ExportUtil from './ExportUtil'

export default class CSSOptimizer {


	constructor () {
        /**
         *  Keep the order to collapsed Order: top-left corner, top-right,  bottom-left corners, bottom-right
         */
        this.borderRadius = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"]

         /**
         * Order: top, right, bottom, left
         */
        this.borderWidth = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"]
        this.borderStyle = ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle']
        this.borderColor = ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']

        this.padding = ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
	}

    runFlat (model) {
        model = ExportUtil.clone(model)

        if (model.templates) {
            this.compressList(model.templates)
        }
        this.compressList(model.screens)
        this.compressList(model.widgets)

        return model
    }

    runTree (model) {

      	/**
		 * Generate the template styles
		 */
		model.templates.forEach(template => {
			template.style = this.compress(template.style, template)
		})

		/**
		 * Generate styles for each screen. The templates styles
		 * might here be reused!
		 */
		model.screens.forEach(screen => {
            screen.style = this.compress(screen.style, screen)
			screen.children.forEach(child => {
				this.compressChildren(child)
			})
        })
        
        return model
    }

    compressChildren (element) {
        element.style = this.compress(element.style, element, false)
        if (element.children) {
            element.children.forEach(child => {
				this.compressChildren(child)
			})
        }
    }

    compressList(list) {
        Object.values(list).forEach(item => {
            item.style = this.compress(item.style, item)
        })
    }

    compress (style) {

        /**
         * TODOD: We have to convert the padding in here alreadz to box model. For now
         * we need the correct box model in the css factory...
         */
        // this.resizeToBoxModel(element)
        // this.compressAttribes(style, this.padding, 'padding', 'px', 0)
        

        /**
         * Compress and collapse border
         */
        this.compressAttribes(style, this.borderRadius, 'borderRadius', 'px', 0)
        let borderIsEqual = this.compressAttribes(style, this.borderColor, 'borderColor', false, 'transparent')
        let widthIsEqual = this.compressAttribes(style, this.borderWidth, 'borderWidth', 'px', 0)
        let styleIsEqual = this.compressAttribes(style, this.borderStyle, 'borderStyle', false, 'solid')

        /**
         * Merge borders of possible
         */
        if (borderIsEqual && widthIsEqual && styleIsEqual) {
            style.border = `${style.borderWidth} ${style.borderStyle} ${style.borderColor}`
            delete style.borderColor
            delete style.borderWidth
            delete style.borderStyle
        }

        /**
         * Remove defaults for the all equal case
         */
        if (style.borderStyle === 'solid solid solid solid') {
            delete style.borderStyle
        }

        if (style.borderStyle === 'solid') {
            delete style.borderStyle
        }

        if (style.border && style.border.indexOf('0px') === 0) {
            delete style.border
        }

        if (style.padding === '0px') {
            delete style.padding
        }

        if (style.borderRadius === '0px') {
            delete style.borderRadius
        }

        return style
    }

    resizeToBoxModel (widget) {
        console.debug('CSSOptimizer.resizeToBoxModel()')
        if (widget.style) {
			if (widget.style.paddingTop) {
				widget.h -= widget.style.paddingTop
			}
			if (widget.style.paddingBottom) {
				widget.h -= widget.style.paddingBottom
			}
			if (widget.style.paddingLeft) {
				widget.w -= widget.style.paddingLeft
			}
			if (widget.style.paddingRight) {
				widget.w -= widget.style.paddingRight
			}

			if (widget.style.borderTopWidth) {
				widget.h -= widget.style.borderTopWidth
			}
			if (widget.style.borderBottomWidth) {
				widget.h -= widget.style.borderBottomWidth
			}
			if (widget.style.borderLeftWidth) {
				widget.w -= widget.style.borderLeftWidth
			}
			if (widget.style.borderRightWidth) {
				widget.w -= widget.style.borderRightWidth
			}
        }
        return widget
    }

    compressAttribes (style, keys, prop, unit, defaultValue) {
        /**
         * Check if we have all the same
         */
        let firstValue = style[keys[0]]
        if(keys.every(key => style[key] === firstValue)) {

            if (firstValue === undefined || firstValue === null) {
                firstValue = defaultValue
            }
            if (unit) {
                firstValue += unit
            } 
            keys.forEach(key => {
                delete style[key]
            })

            style[prop] = firstValue
            return true;
        } else {
            let values = []
            keys.forEach(key => {
                let value = style[key]
                if (value === undefined || value === null) {
                    value = defaultValue
                }
                if (unit) {
                    value += unit
                } 
                values.push(value)
                delete style[key]
            })
            style[prop] = values.join(' ')
            return false
        }
    }

}