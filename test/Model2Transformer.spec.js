import ModelTransformer from '../src/export/ModelTransformer'
import app11 from './data/app11.json'
import * as TestUtil from './TestUtil'

const debug = console.debug

test('Test Simple', () => {

  console.debug = debug
  let t = new ModelTransformer(app11)
  let model = t.transform()

  expect(model.screens.length).toBe(1)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(null)
  console.debug(TestUtil.print(screen))
});