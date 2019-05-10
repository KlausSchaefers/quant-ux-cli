import VueMultiPageWriter from '../src/export/vue/VueMultiPageWriter'
import GeneratorFactory from '../src/export/GeneratorFactory'
import app9 from './data/app9.json'
import app10 from './data/app10.json'

test('Test CSSPath', () => {
  let path = new VueMultiPageWriter().getCSSPath({type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue'}})
  expect(path).toBe('../css/')

  path = new VueMultiPageWriter().getCSSPath({type: 'vue', css: {responsive:false}, targets: {css:'abc/css', vue: 'xzy/vue'}})
  expect(path).toBe('abc/css/')

  path = new VueMultiPageWriter().getCSSPath()
  expect(path).toBe('')
})

test('Test Template', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue'}})
  let files = generator.run(app9, {type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue'}})

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
  // expect(screen1CSS.content.indexOf('.Box_Master')).toBe(-1) // FIXME: Should these go to a seperate CSS?

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  expect(screen1Vue).not.toBe(null)
  expect(screen1Vue).not.toBe(undefined)
  expect(screen1Vue.content.indexOf('.RedBox')).toBe(-1)
  // console.debug(screen1Vue.content)
  expect(screen1Vue.content.indexOf('@import url("../css/normalize.css")')).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf('@import url("../css/symbols.css")')).toBeGreaterThanOrEqual(0)



  // console.debug(screen1Vue.content)


  // console.debug(file.content)
});


test('Test Data Binding', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue'}})
  let files = generator.run(app10, {type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue'}})

  expect(files).not.toBe(null)

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  expect(screen1Vue).not.toBe(null)
  expect(screen1Vue).not.toBe(undefined)
  expect(screen1Vue.content.indexOf('.RedBox')).toBe(-1)

  expect(screen1Vue.content.indexOf('v-model="email"')).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf('v-model="password"')).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf('email: "Enter a value"')).toBeGreaterThanOrEqual(0)

  console.debug(screen1Vue.content)
  // console.debug(file.content)
});