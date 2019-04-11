import ModelTranformer from 'export/ModelTransformer'
import pretty from 'pretty'

/**
 * Main class the orchestrates the code generation. Can be configurred 
 * with an element and style factory
 */
export default class Generator {

  constructor (elementFactory, styleFactory, codeFactory) {
    this.elementFactory = elementFactory
    this.styleFactory = styleFactory,
    this.codeFactory = codeFactory
  }

  run (model) {
    let result = {
      name: model.name,
      screens: [],
    }

     /**
     * First, we create a grid model
     */
    let transformer = new ModelTranformer(model)
    let gridModel = transformer.transform()

    /**
     * Second, we create styles and attach them also to the model 
     * if needed. We need to do this before, so we can 
     * compute shared styles
     */
    result.styles = this.styleFactory.generate(gridModel)

    /**
    * Third, Generate code 
    */
    gridModel.screens.forEach(screen => {
      result.screens.push(this.generateScreen(screen, result.styles))
    })
    return result
  }

  generateScreen(screen, styles) {
    let result = {
      id: screen.id,
      name: screen.name,
      model: screen,
      styles: styles[screen.id],
      code: ""
    }

    let body = []
    screen.children.forEach(child => {
      body.push(this.generateElement(child, styles))
    })
    result.template = pretty(this.elementFactory.screen(screen, styles[screen.id], body).trim())
    return result
  }

  generateElement (element, styles) {
    if (element.children && element.children.length > 0) {
      let templates = []
      element.children.forEach(child => {
        templates.push(this.generateElement(child, styles))
      })
      return this.elementFactory.container(element, styles[element.id], templates)
    } else { 
      return this.elementFactory.element(element, styles[element.id])
    }
  }

 

}