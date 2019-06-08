
import ImportUtil from '../src/export/ImportUtil'


test('Test CSS', () => {
  
    let prefix = ImportUtil.get('generated/src/components', 'generated/src/images')
    expect(prefix).toBe('../images')

    prefix = ImportUtil.get('generated/src/components', 'generated/images')
    expect(prefix).toBe('../../images')

});

