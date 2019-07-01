import ModelTransformer from '../src/export/ModelTransformer'
import app12 from './data/app12.json'
import * as TestUtil from './TestUtil'
import CSSFactory from '../src/export/CSSFactory'


test('Test checkCSSRow', () => {
    delete app12.screens['s10047']
    delete app12.screens['s10030']
    delete app12.screens['s10014']
    let t = new ModelTransformer(app12, true)
    let model = t.transform()

    let f = new CSSFactory(true, '', true)
    let styles = f.generate(model)

    let s10000 = model.screens.find(s => s.id === 's10000')
    expect(s10000).not.toBe(undefined)

    let screen = styles['s10000'][0]
    let card = styles['w10002'][0]
    let p = styles['w10004'][0]
 
    // console.debug(card.code)
    // console.debug(screen.code)
    // console.debug(p.code)
    // FIXME: For some reason we have here a different parent!
    console.debug(TestUtil.print(s10000))
});
