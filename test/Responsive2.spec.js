import ModelTransformer from '../src/export/ModelTransformer'
import app17 from './data/app17.json'
import app18 from './data/app18.json'
import * as TestUtil from './TestUtil'
import CSSFactory from '../src/export/CSSFactory'


test('Test checkCSSRow', () => {
    let t = new ModelTransformer(app17, true)
    let model = t.transform()

    let f = new CSSFactory(true, '', true)
    let styles = f.generate(model)

    let s10000 = model.screens.find(s => s.id === 's10000')
    expect(s10000).not.toBe(undefined)

    let screen = styles['s10000'][0]
    let r0 = styles['r0'][0]
    let header = styles['w10001'][0]
    let card = styles['w10002'][0]
    let p = styles['w10004'][0]
    let circleRight = styles['w10058'][0]
    let cricleCenter = styles['w10059'][0]
    let circleLeft = styles['w10057'][0]
 
    // console.debug(header.code)
  
    expectContains(screen.code, 'display: flex;')
    // card one is pinned left and right
    expectContains(card.code, 'display: flex;')
    expectContains(card.code, 'margin-left: 30px;')
    expectContains(card.code, 'margin-right: 30px;')
    expectNotContains(card.code, ' width:')
    expectNotContains(card.code, 'margin-bottom:')

    // right pinned with fixed with
    expectContains(circleRight.code, ' width: 80px;')
    expectContains(circleRight.code, 'calc')

    // center pinned with fixed with
    expectContains(cricleCenter.code, ' width: 80px;')
    expectContains(cricleCenter.code, 'margin-left:')
    expectNotContains(cricleCenter.code, 'margin-right')

    // center right pinned
    expectContains(circleLeft.code, ' width: 80px;')
    expectContains(circleLeft.code, 'margin-left:')
    expectNotContains(circleLeft.code, 'margin-right')

    // left right pinned with reponsive width
    expectContains(p.code, 'margin-left: 24px;')
    expectContains(p.code, 'margin-right: 24px;')
    expectContains(p.code, 'margin-bottom: 50px')
    expectNotContains(card.code, ' width:')

    // ro is a grid
    expectContains(r0.code, 'display: grid;')
    
    expectContains(header.code, 'height: 32px;')
    
    // console.debug(TestUtil.print(s10000))
});


test('Test fixed()', () => {

    let t = new ModelTransformer(app18, true)
    let model = t.transform()

    let f = new CSSFactory(true, '', true)
    let styles = f.generate(model)

    let fixed = styles['w10004'][0]

    expectContains(fixed.code, 'position: fixed')
    expectContains(fixed.code, ' top: 32px')
    expectContains(fixed.code, ' right: 19px')
    

});

function expectContains(str, needle) {
    expect(str.indexOf(needle)).toBeGreaterThanOrEqual(0)
}

function expectNotContains(str, needle) {
    expect(str.indexOf(needle)).toBe(-1)
}
