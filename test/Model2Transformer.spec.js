import ModelTransformer from '../src/export/ModelTransformer'
import app11 from './data/app11.json'
import app12 from './data/app12.json'
import * as TestUtil from './TestUtil'
import * as Util from '../src/export/ExportUtil'

test('Test Simple', () => {

  let t = new ModelTransformer(app11)
  let model = t.transform()

  expect(model.screens.length).toBe(1)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(null)
});


test('Test Actions', () => {

  let t = new ModelTransformer(app12)
  let model = t.transform()

  expect(model.screens.length).toBe(4)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(null)

  let widgets = []
  Util.getAllChildren(screen, widgets)
  let karate = widgets.find(w => w.id === 'w10009')
  expect(karate).not.toBe(undefined)
  expect(karate.lines.length).toBe(1)

  console.debug(TestUtil.print(screen))
});