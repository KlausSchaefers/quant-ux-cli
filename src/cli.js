

import fs from 'fs';
import request from 'request'
import GeneratorFactory from './export/GeneratorFactory'

function generate (app, conf) {
    console.debug(`Quant-UX: Generate <${conf.type}> for prototype <${app.name}>`)

    let files = GeneratorFactory.create(app, conf)
    console.debug(files)

}

function getApp(conf) {
    let url = `${conf.server}/rest/invitation/${conf.token}/app.json`
    request(url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let app = JSON.parse(body)
            if (app) {
                generate(app, conf)
            }
        } else {
            console.error('error:', error); // Print the error if one occurred
        }
    });
}

function load(confFile = '.quant-ux.json') {
    if (fs.existsSync(confFile)) {
        console.debug(`Quant-UX: Load config <${confFile}>`)
        let content = fs.readFileSync(confFile, 'UTF-8')
        return JSON.parse(content)
    }
}

function main () {
    console.debug(' ______     __  __     ______     __   __     ______   __  __     __  __')
    console.debug('/\\  __ \\   /\\ \\/\\ \\   /\\  __ \\   /\\ "-.\\ \\   /\\__  _\\ /\\ \\/\\ \\   /\\_\\_\\_\\ ')
    console.debug('\\ \\ \\/\\_\\  \\ \\ \\_\\ \\  \\ \\  __ \\  \\ \\ \\-.  \\  \\/_/\\ \\/ \\ \\ \\_\\ \\  \\/_/\\_\\/_')
    console.debug(' \\ \\___\\_\\  \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\_\\\\"\\_\\    \\ \\_\\  \\ \\_____\\   /\\_\\/\\_\\ ')
    console.debug('  \\/___/_/   \\/_____/   \\/_/\\/_/   \\/_/ \\/_/     \\/_/   \\/_____/   \\/_/\\/_/ ')
    console.debug('                                                                      V.1.01')
    console.debug('')
    /**
     * Here is the main entry point
     */
    let conf = load()
    if (conf) {
        getApp(conf)
    } else {
        console.error(`No config file. Please create a ${confFile} file.`)
    }
}

main()
