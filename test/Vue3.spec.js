import GeneratorFactory from '../src/export/GeneratorFactory'
import app12 from './data/app12.json'
import app18 from './data/app18.json'

test('Test Click', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {grid: true}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  let files = generator.run(app12, {type: 'vue', css: {grid: true}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  
  expect(files).not.toBe(null)

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  expect(screen1Vue.content.indexOf(`click="navigateTo('KarateScreen')"`)).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf(`click="navigateTo('CapoeiraScreen')"`)).toBeGreaterThanOrEqual(0)
 
  // console.debug(screen1Vue.content)
});


test('Test Fixed', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {grid: true}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  let files = generator.run(app18, {type: 'vue', css: {grid: true}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  
  expect(files).not.toBe(null)

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  let screen1Css = files.find(f => f.name === 'Screen.css')
  console.debug(screen1Css.content)
  expect(screen1Css.content.indexOf(`.Screen .Fixed`)).toBeGreaterThanOrEqual(0)
  
  // console.debug(screen1Vue.content)
});
