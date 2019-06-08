
import ModelTransformer from '../src/export/ModelTransformer'
import app9 from './data/app9.json'
import app6 from './data/app6.json'


test('Test Simple', () => {
  let t = new ModelTransformer(app6)
  let model = t.transform()

  expect(model.screens.length).toBe(1)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(null)
});

test('Test inherited', () => {
  let t = new ModelTransformer(app9)
  let model = t.transform()

  expect(model.screens.length).toBe(2)

  let screen = model.screens.find(s => s.id === 's10000')
  expect(screen).not.toBe(null)

  expect(screen.children.length).toBe(5)
  expect(screen.children[0].id).toBe('w10042@s10000')
  expect(screen.children[0].props.label).toBe('Master')
});