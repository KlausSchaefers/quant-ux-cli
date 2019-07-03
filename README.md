# Quant-UX -CLI

The Quant-UX-CLI tool allwos you to generate code out of your Quant-UX designs.
Create a design at http://v2.quant-ux.com and run the cli to generate, CSS, HTML and Vue.js code

## Install

```
npm install --dev quant-ux-cli
```

## How to run:

Simply run the following command on the commandline. Make sure you are in the correct directory.

```
quant-ux
```

You need a .quant-ux.json file in your root directory. If the file does not exist, the cli will
ask for the _MOST IMPORTANT_ config parameters and create the config file for you. The config file
will look like:

```
{
    "token": "<Your token here>",
    "targets": {
        "vue": "test/src/components",
        "css": "test/src/css",
        "html": "test/src/html",
        "images": "src/images",
        "vueRouter": "src",
        "vueApp": "src"
    },
    "type": "html",
    "server": "https://quant-ux.com",
    "conflict": "overwrite",
    "css": {
        "responsive": false
    },
    "vue": {
        "generateRouter": true,
        "generateApp": true,
        "routerName": "router.js"
    }
}
```

The token identifies your prototype. You can optain it the editor on http://v2.quant-ux.com or
in the settings page of your prototype. Please note, that there are many other parameters that
you can configure. The _conflict_ parameter defines, how conflicts are handled. "Overwrite" will
(obviously) overwrite your local changes, while "keep" will keep them. This is important if you
want to generate code into an existing project.

## How to contribbute

The code generator is a standalone NPM package. Before you start developing, you need to clone (or fork) the repositiory.

```
git clone https://github.com/KlausSchaefers/quant-ux-cli.git
npm install
```

Lets first have alook at the main components, in the CLI and explore shortly their intreaction.
Before the output specifc code generators are called, the ModelTransformer 
transforms the Quant-UX vectorish format into a hierachical model, that resembles the raw 
structure of HTML. Also, the style properties of the components are transformed into CSS3, including 
hover classes and so on. Afterwards the Generator class iterates over the hierchical model and 
calls the factories to generate the templates and passes the CSS and the templates to the page 
writers, which create the final output. In a last step, the files are written to the file system.

You can find for the different output formats (Vue, HTML) different folders with the code. 
If you want to add some new output format, you should orient yourself in the exising examples. 
The main classes you have to implement are a factory and a page writer. Let's have a 
look at a HTML factory


```
export default class HTMLFactory {

    constructor () {
    }

    /**
     * Generate template for a screen and wraps the child templates
     *
     * @param {*} screen The screen model
     * @param {*} styles The styles for this element
     * @param {*} childTemplates The child template to wrap
     */
    screen (screen, styles, childTemplates) {
      let css = this.css(styles)
      let inner = childTemplates.join('')
      return `<div class="${css} MatcSreen">${inner}</div>`
    }

    /**
     * Generate template for a container and wraps the child templates
     * @param {*} container The container
     * @param {*} styles The css styles
     * @param {*} childTemplates The child template
     */
    container (container, styles, childTemplates) {
      let css = this.css(styles)
      let inner = childTemplates.join('')
      return `<div class="${css.trim()}"> ${inner}</div>`
    }


    /**
     * Generates the template for a given element. The method
     * delegates in this example to specific methods.
     * @param {*} element The element to write
     * @param {*} styles  The styles
     */
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

```

The page writer finaly assembles the HTML page, in this case a page iwth inline CSS. 
Please note that this class my return multiple files, 
for instance seperate files for the CSS and the HTML.
