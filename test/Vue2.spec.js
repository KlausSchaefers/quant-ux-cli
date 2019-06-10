import VueMultiPageWriter from '../src/export/vue/VueMultiPageWriter'
import GeneratorFactory from '../src/export/GeneratorFactory'
import app9 from './data/app9.json'
import app10 from './data/app10.json'
import app11 from './data/app11.json'


test('Test Image', () => {

  let generator =  GeneratorFactory.create({type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  let files = generator.run(app11, {type: 'vue', css: {responsive:false}, targets: {css:'src/css', vue: 'src/vue', images: 'src/imgs'}})
  
  expect(files).not.toBe(null)

  let screen1Vue = files.find(f => f.name === 'Screen.vue')
  expect(screen1Vue).not.toBe(null)
  expect(screen1Vue).not.toBe(undefined)
  expect(screen1Vue.content.indexOf('<img src="../imgs/')).toBeGreaterThanOrEqual(0)
  expect(screen1Vue.content.indexOf('<div class="Header">Sport Wiki</div>')).toBeGreaterThanOrEqual(0)
  
  let images = files.filter(f => f.type === 'images')
  expect(images.length).toBe(1)
  // console.debug(images)
  // console.debug(screen1Vue.content)
  // console.debug(file.content)
});