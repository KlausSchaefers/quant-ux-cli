import * as Util from 'export/ExportUtil'

export default class VueSinglePageWriter {

    

    getFiles(code) {
        let result = []
        code.screens.forEach(screen => {
            let body = screen.template
            let css = ''
            let normalize = code.styles['$NORMALIZE']
            if (normalize) {
                css += normalize.map(s => s.code).join('\n')
            }
            css += screen.styles.map(s => s.code).join('\n')
            let elements = Util.getAllChildrenForScreen(screen)
            elements.forEach(element => {
                let styles = code.styles[element.id]
                css += styles.map(s => s.code).join('\n')
            })

            let bindings = elements.filter(e => e.props && e.props.databinding)
                .map(e => `            ${e.props.databinding.default}: ${this.getDefaultDataBindung(e)}`)
            console.debug(bindings)
            let data = bindings.join('\n')

            result.push({
                name: `${screen.name}.css`,
                type: 'css',
                id: screen.id,
                content: css
            })
       
            result.push({
                name: `${screen.name}.vue`,
                type: 'vue',
                id: screen.id,
                content: `
<template>
${body}
</template>
<style lang="css">
    @import url("style/${screen.name}.css");
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
            })
        });
        return result
    }

    getDefaultDataBindung(e) {
        if (e.type === 'CheckBox') {
            return e.props.checked
        }
        return ''
    }

}