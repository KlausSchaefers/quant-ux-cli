
import ModelTransformer from '../src/export/ModelTransformer'
import CSSFactory from '../src/export/CSSFactory'
import * as TestUtil from './TestUtil'
import app9 from './data/app9.json'
import app12 from './data/app12.json'
import app13 from './data/app13.json'
import app14 from './data/app14.json'

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
  expect(widgetStyle[0].code.indexOf('.KarateScreen .Paragraph1')).toBeGreaterThanOrEqual(0)

});

test('Test selector without screen', () => {
  let t = new ModelTransformer(app12)
  let model = t.transform()

  let f = new CSSFactory(false, '', false)
  let styles = f.generate(model)

  let widgetStyle = styles['w10036']
 
  expect(widgetStyle).not.toBe(null)
  expect(widgetStyle.length).toBe(1)
  expect(widgetStyle[0].code.indexOf('.KarateScreen .Paragraph1')).toBe(-1)
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
  expect(widgetStyle[0].code.indexOf('.Matc_KarateScreen .Matc_Paragraph1')).toBeGreaterThanOrEqual(0)
});


test('Test getGridTracks', () => {
 

  let f = new CSSFactory(true, '', true)
  let track = f.getGridTracks(600, [ 
    { v: 0, start: [Array], end: [], fixed: true, l: 100 },
    { v: 48, start: [Array], end: [], fixed: true, l: 100 },
    { v: 234, start: [], end: [Array], fixed: false, l: 200 } 
  ])
  expect(track).toBe('100px 100px auto')

  track = f.getGridTracks(600, [ 
    { v: 0, start: [Array], end: [], fixed: false, l: 150 },
    { v: 48, start: [Array], end: [], fixed: true, l: 100 },
    { v: 234, start: [], end: [Array], fixed: false, l: 200 } 
  ])
  expect(track).toBe('25% 100px auto')

  console.debug('getGridTracks', track)
});

test('Test Grid', () => {
  let t = new ModelTransformer(app13, true)
  let model = t.transform()

  let f = new CSSFactory(true, '', true)
  let styles = f.generate(model)


  let screen = styles['s10000'][0]
  let card = styles['w10001'][0]
  let cricle = styles['w10002'][0]
  let topleft = styles['w10003'][0]
  let bottom = styles['w10004'][0]

  // console.debug(TestUtil.print(model.screens[0], true))
  // console.debug(screen)
  // console.debug(card)
});
