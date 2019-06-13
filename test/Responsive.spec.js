
import ModelTransformer from '../src/export/ModelTransformer'
import CSSFactory from '../src/export/CSSFactory'
import app13 from './data/app13.json'
import * as TestUtil from './TestUtil'

test('Test computeGrid', () => {
    let t = new ModelTransformer(app13, true)
    
    let e = {
        name: "Parent",
        w: 600,
        h: 200,
        children: [
            {
                name: "Child2",
                x: 100, 
                y: 0,
                w: 250,
                h: 200,
                props : {
                    resize : {
                      fixedHorizontal: true
                    }
                  },
            },
            {
                name: "Child1",
                x: 0, 
                y: 0,
                w: 200,
                h: 200
            }
        ]
    }
    let grid = t.computeGrid(e)
    expect(grid).not.toBe(null)
    expect(grid.columns.length).toBe(4)
    expectGrid(grid.columns, 0, 100, false)
    expectGrid(grid.columns, 100, 100, true)
    expectGrid(grid.columns, 200, 150, true)
    expectGrid(grid.columns, 350, 250, false)
    //console.debug(grid)
});

function expectGrid(values, v, w, isFixed) {
    console.debug('expectGrid, ', values)
    let e = values.find(value => value.v === v)
    expect(e).not.toBe(undefined)
    expect(e.w).toBe(w)
    expect(e.fixed).toBe(isFixed)
}


xtest('Test Template', () => {
  let t = new ModelTransformer(app13, true)
  let model = t.transform()

  let f = new CSSFactory(true, '', true)
  let styles = f.generate(model)


  let screen = styles['s10000'][0]
  let card = styles['w10001'][0]
  let cricle = styles['w10002'][0]
  let topleft = styles['w10003'][0]
  let bottom = styles['w10004'][0]

  console.debug(TestUtil.print(model.screens[0], true))

  // console.debug(screen.code)
  // expect(widgetStyle).not.toBe(null)
  // expect(widgetStyle.length).toBe(2)

});


function xtest () {

}