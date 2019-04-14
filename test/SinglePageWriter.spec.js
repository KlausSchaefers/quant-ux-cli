import SinglePageWriter from '../src/export/html/SinglePageWriter'
import HTMLFactory from '../src/export/html/HTMLFactory'
import CSSFactory from '../src/export/CSSFactory'
import Generator from '../src/export/Generator'
import app9 from './data/app9.json'

test('Test Template', () => {

  let gen = new Generator(new HTMLFactory(), new CSSFactory(true))
  let code = gen.run(app9)

  let writer = new SinglePageWriter()
  let files = writer.getFiles(code)

  expect(files).not.toBe(null)
  expect(files.length).toBe(2)

  let file = files.find(f => f.id === 's10000')
  expect(file).not.toBe(null)


  expect(file.content.indexOf('.Templated')).toBeGreaterThan(0)
  expect(file.content.indexOf('.RedBox')).toBeGreaterThan(0)
  expect(file.content.match(/\.RedBox/g).length).toBe(1)
  expect(file.content.indexOf('<div class="RedBox Templated"></div>')).toBeGreaterThan(0)

  console.debug(file.content)
});