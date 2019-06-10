import ModelTransformer from '../src/export/ModelTransformer'
import app12 from './data/app12.json'
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