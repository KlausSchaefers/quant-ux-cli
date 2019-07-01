import GeneratorFactory from '../src/export/GeneratorFactory'
import app12 from './data/app12.json'


test('Test Click', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  let files = generator.run(app12, {type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  
  expect(files).not.toBe(null)

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  console.debug(screen1Vue.content)
  expect(screen1Vue.content.indexOf(`click="navigateTo('KarateScreen')"`)).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf(`click="navigateTo('CapoeiraScreen')"`)).toBeGreaterThanOrEqual(0)
 
  // console.debug(screen1Vue.content)
});

