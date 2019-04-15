import VueMultiPageWriter from '../src/export/vue/VueMultiPageWriter'
import VueFactory from '../src/export/vue/VueFactory'
import CSSFactory from '../src/export/CSSFactory'
import GeneratorFactory from '../src/export/GeneratorFactory'
import app9 from './data/app9.json'

test('Test Template', () => {

  let files = GeneratorFactory.create(app9, {type: 'vue', css: {responsive:false}})

  expect(files).not.toBe(null)
  expect(files.length).toBe(6)

  expect(files.filter(f => f.type === 'css').length).toBe(4)
  expect(files.filter(f => f.type === 'vue').length).toBe(2)

  let symbols = files.find(f => f.name === 'symbols.css')
  expect(symbols).not.toBe(null)
  expect(symbols).not.toBe(undefined)
  expect(symbols.type).toBe('css')
  expect(symbols.content.indexOf('.RedBox')).toBeGreaterThanOrEqual(0)


  let screen1CSS = files.find(f => f.name === 'Screen.css')
  expect(screen1CSS).not.toBe(null)
  expect(screen1CSS).not.toBe(undefined)
  expect(screen1CSS.content.indexOf('.RedBox')).toBe(-1)
  expect(screen1CSS.content.indexOf('.Box_Master')).toBe(-1) // FIXME: Should these go to a seperate CSS?

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  expect(screen1Vue).not.toBe(null)
  expect(screen1Vue).not.toBe(undefined)
  expect(screen1Vue.content.indexOf('.RedBox')).toBe(-1)
  expect(screen1Vue.content.indexOf('@import url("normalize.css")')).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf('@import url("symbols.css")')).toBeGreaterThanOrEqual(0)

  // console.debug(screen1Vue.content)


  // console.debug(file.content)
});