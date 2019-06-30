import ModelTransformer from '../src/export/ModelTransformer'
import app15 from './data/app15.json'
import * as TestUtil from './TestUtil'


test('Test addGridToElements', () => {
    let t = new ModelTransformer(app15, true)
    let model = t.transform()
});
