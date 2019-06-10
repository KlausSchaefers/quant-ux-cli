
import ModelTransformer from '../src/export/ModelTransformer'
import CSSFactory from '../src/export/CSSFactory'
import app9 from './data/app9.json'
import app12 from './data/app12.json'

test('Test Template', () => {
  let t = new ModelTransformer(app9)
  let model = t.transform()

  let f = new CSSFactory()
  let styles = f.generate(model)

  let widgetStyle = styles['w10045']
  expect(widgetStyle).not.toBe(null)
  expect(widgetStyle.length).toBe(2)

});

test('Test selector with screen', () => {
  let t = new ModelTransformer(app12)
  let model = t.transform()

  let f = new CSSFactory(false, '', true)
  let styles = f.generate(model)

  let widgetStyle = styles['w10036']

  expect(widgetStyle).not.toBe(null)
  expect(widgetStyle.length).toBe(1)
  expect(widgetStyle[0].code.indexOf('.Karate .Paragraph1')).toBeGreaterThanOrEqual(0)

});

test('Test selector without screen', () => {
  let t = new ModelTransformer(app12)
  let model = t.transform()

  let f = new CSSFactory(false, '', false)
  let styles = f.generate(model)

  let widgetStyle = styles['w10036']
 
  expect(widgetStyle).not.toBe(null)
  expect(widgetStyle.length).toBe(1)
  expect(widgetStyle[0].code.indexOf('.Karate .Paragraph1')).toBe(-1)
  expect(widgetStyle[0].code.indexOf('.Paragraph1')).toBeGreaterThanOrEqual(0)
});

test('Test selector with screen and prefix', () => {
  let t = new ModelTransformer(app12)
  let model = t.transform()

  let f = new CSSFactory(false, 'Matc', true)
  let styles = f.generate(model)

  let widgetStyle = styles['w10036']
  
  expect(widgetStyle).not.toBe(null)
  expect(widgetStyle.length).toBe(1)
  expect(widgetStyle[0].code.indexOf('.Matc_Karate .Matc_Paragraph1')).toBeGreaterThanOrEqual(0)
});