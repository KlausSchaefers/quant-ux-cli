import * as Util from '../ExportUtil'

export default class VueSinglePageWriter {


    getFiles(code) {
        let result = []
        let imports = ['normalize.css']
        /**
         * First, create common css files
         */
        this.addNormalize(code, result)

        /**
         * Second, create symbol.css
         */
        if (this.addSymbols(code, result)) {
            imports.push('symbols.css')
        }


         /**
         * Thirs, create common.css for shared styles
         */
        if (this.addCommon(code, result)) {
            imports.push('common.css')
        }

        /**
         * Create a css and vue file for each screen
         */
        code.screens.forEach(screen => {
            this.addFilesForScreen(screen, code, result, imports)
        })
        return result
    }

    addNormalize (code, result) {
        let css = ''
        let normalize = code.styles['$NORMALIZE']
        if (normalize) {
            css += normalize.map(s => s.code).join('\n')
        }
        result.push({
            name: `normalize.css`,
            type: 'css',
            id: code.id,
            content: css
        })
    }

    addCommon (code, result) {

        return false
    }

    addSymbols (code, result) {
        let css = []
        let written = []
        Object.values(code.styles).forEach(styles => {
            styles.forEach(s => {
                if (s.type === 'template' && written.indexOf(s.css) < 0) {
                    css.push(s.code)
                    written.push(s.css)
                }
            })
        })
        console.debug(`Quant-UX: addSymbols() >  ${css.length} symbol classes. [${written}]`)
        if (css.length > 0 ) {
            result.push({
                name: `symbols.css`,
                type: 'css',
                id: code.id,
                content: css.join('\n')
            })
        }
        return css.length > 0
    }

    addFilesForScreen(screen, code, result, imports) {

        let css = Util.getScreenCSS(screen, code, ['common', 'template'])

        result.push({
            name: `${screen.name}.css`,
            type: 'css',
            id: screen.id,
            content: css
        })

        let data = this.getData(screen)
        let body = screen.template
        let cssImports = imports.map(i => `    @import url("${i}");`).join('\n')
        console.debug('dsd', imports, '~~', cssImports)
        result.push({
            name: `${screen.name}.vue`,
            type: 'vue',
            id: screen.id,
            content: this.getTemplate(screen, body, data, cssImports)
        })
    }

    getData (screen) {
        let elements = Util.getAllChildrenForScreen(screen)
        let bindings = elements.filter(e => e.props && e.props.databinding)
        .map(e => `            ${e.props.databinding.default}: ${this.getDefaultDataBindung(e)}`)
        return bindings.join('\n')
    }

    getTemplate (screen, body, data, cssImports) {
return `
<template>
${body}
</template>
<style lang="css">
${cssImports}
</style>
<script>
export default {
    name: "${screen.name}",
    mixins: [],
    props: [],
    data: function() {
        return {
${data}
        };
    },
    components: {},
    methods: {

        }
    },
    mounted() {}
};
</script>`
    }

    getDefaultDataBindung(e) {
        if (e.type === 'CheckBox') {
            return e.props.checked
        }
        return ''
    }

}