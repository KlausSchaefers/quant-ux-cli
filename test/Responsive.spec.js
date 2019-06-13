
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
                name: "Child2 Hor Fixed",
                x: 100, 
                y: 0,
                w: 250,
                h: 200,
                props : {
                    resize : {
                      fixedHorizontal: true
                    }
                }
            },
            {
                name: "Child1 Vert Fixed",
                x: 0, 
                y: 50,
                w: 200,
                h: 50,
                props : {
                    resize : {
                        fixedVertical: true
                    }
                }
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

    expect(grid.rows.length).toBe(3)
    expectGrid(grid.rows, 0, 50, false)
    expectGrid(grid.rows, 50, 50, true)
    expectGrid(grid.rows, 100, 100, false)
});

function expectGrid(values, v, w, isFixed) {
    let e = values.find(value => value.v === v)
    expect(e).not.toBe(undefined)
    expect(e.l).toBe(w)
    expect(e.fixed).toBe(isFixed)
}

xtest('Test addGridToElements', () => {
    let t = new ModelTransformer(app13, true)
    
    let e = {
        name: "Parent",
        w: 600,
        h: 200,
        children: [
            {
                name: "Child2 Hor Fixed",
                x: 100, 
                y: 0,
                w: 250,
                h: 200,
                props : {
                    resize : {
                      fixedHorizontal: true
                    }
                }
            },
            {
                name: "Child1 Vert Fixed",
                x: 0, 
                y: 50,
                w: 200,
                h: 50,
                props : {
                    resize : {
                        fixedVertical: true
                    }
                }
            }
        ]
    }
    let result = t.addGridToElements(e)
    console.debug(result.grid)
    console.debug(result)

    expect(result).not.toBe(null)
    expect(result).not.toBe(undefined)
    expect(result.grid).not.toBe(null)
    expect(result.grid).not.toBe(undefined)

    let child1 = e.children.find(c => c.name === 'Child2 Hor Fixed')
    expect(child1.name).toBe('Child2 Hor Fixed')
    expect(child1.gridColumnStart).toBe(1)
    expect(child1.gridColumnEnd).toBe(3)

  
   
});


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