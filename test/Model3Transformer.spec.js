import ModelTransformer from '../src/export/ModelTransformer'
import app12 from './data/app12.json'
import app16 from './data/app16.json'
import app18 from './data/app18.json'
import * as TestUtil from './TestUtil'
import * as Util from '../src/export/ExportUtil'


test('Test Actions', () => {

  delete app12.screens['s10000']
  delete app12.screens['s10030']
  delete app12.screens['s10047']
  let t = new ModelTransformer(app12)
  let model = t.transform()

  expect(model.screens.length).toBe(1)

  let screen = model.screens.find(s => s.id === 's10014')
  expect(screen).not.toBe(undefined)

  // console.debug(TestUtil.print(screen))
});


test('Test mergeInResponsive()', () => {

  let t = new ModelTransformer(app16)
  let model = t.transform()

  expect(model.screens.length).toBe(1)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(undefined)
  let row1 = screen.children[0]
  let col1 = row1.children[0]
  expect(row1.props.resize.left).toBe(true)
  expect(col1.props.resize.left).toBe(true)
 
  //console.debug(TestUtil.print(row1))
});


test('Test fixed()', () => {

  let t = new ModelTransformer(app18)
  let model = t.transform()

  expect(model.screens.length).toBe(1)
  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(undefined)
  expect(screen.fixedChildren.length).toBe(1)
 
  console.debug(TestUtil.print(screen))
});