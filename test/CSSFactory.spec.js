
import ModelTransformer from '../src/export/ModelTransformer'
import CSSFactory from '../src/export/CSSFactory'
import app9 from './data/app9.json'

test('Test Template', () => {
  let t = new ModelTransformer(app9)
  let model = t.transform()

  let f = new CSSFactory()
  let styles = f.generate(model)

  let widgetStyle = styles['w10045']
  expect(widgetStyle).not.toBe(null)
  // we should have two styles registered for the widget
  expect(widgetStyle.length).toBe(2)

});