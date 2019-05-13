import GeneratorFactory from '../src/export/GeneratorFactory'
import app9 from './data/app9.json'

test('Test Router', () => {

    let conf = {
        type: 'vue',
        css: {
            responsive: false
        },
        targets: {
            css: 'src/css',
            vue: 'src/vue',
            vueRouter: 'src'
        },
        vue: {
            "generateRouter": true
        }
    }
    let generator = GeneratorFactory.create(conf)
    let files = generator.run(app9, conf)

    expect(files).not.toBe(null)
    expect(files.length).toBe(7)

    let router = files.filter(f => f.type === 'router')
    expect(router.length).toBe(1)
    console.debug(router[0].content)
})