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

    run (model) {
        model = ExportUtil.clone(model)

        if (model.templates) {
            this.compressList(model.templates)
        }
        this.compressList(model.screens)
        this.compressList(model.widgets)

        return model
    }

    compressList(list) {
        Object.values(list).forEach(item => {
            item.style = this.compress(item.style, item)
        })
    }

    compress (style) {

        /**
         * Create some thing like 
         */
        this.compressAttribes(style, this.borderRadius, 'borderRadius', 'px', 0)
        let borderIsEqual = this.compressAttribes(style, this.borderColor, 'borderColor', false, 'transparent')
        let widthIsEqual = this.compressAttribes(style, this.borderWidth, 'borderWidth', 'px', 0)
        let styleIsEqual = this.compressAttribes(style, this.borderStyle, 'borderStyle', false, 'solid')

        /**
         * We have to convert the padding in here alreadz to box model??
         */
        // this.compressAttribes(style, this.padding, 'padding', 'px', 0)

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

        if (style.border === '0px solid transparent') {
            delete style.border
        }

        if (style.padding === '0px') {
            delete style.padding
        }

        return style
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