import * as Util from '../ExportUtil'

export default class SinglePageWriter {

    getFiles(code) {
        let result = []
        code.screens.forEach(screen => {
            let body = screen.template

            let css = Util.getScreenCSS(screen, code)

            result.push({
                name: `${screen.name}.html`,
                type: 'html',
                id: screen.id,
                content:
`<html>
    <head>
    <title>${screen.name}</title>
    <style type="text/css">
        ${css}
    </style>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,700|Source+Sans+Pro:400,300,200,700' rel='stylesheet' type='text/css'>
    </head>
    <body>
        ${body}
    </body>
</html>`
            })
        });
        return result
    }

}