

import fs from 'fs';
import path from 'path';
import request from 'request'
import {prompt} from 'inquirer';
import chalk from 'chalk';
import GeneratorFactory from './export/GeneratorFactory'

function generate (app, conf) {
    console.debug(`Quant-UX: Generate <${conf.type}> for prototype <${app.name}>`)

    let generator = GeneratorFactory.create(conf)
    let files = generator.run(app, conf)

    let folders = {
        'vue': conf.targets.vue,
        'html': conf.targets.html,
        'css': conf.targets.css,
        'images': conf.targets.images,
    }
    Object.values(folders).forEach(f => {
        if (!fs.existsSync(f)) {
            fs.mkdirSync(f, { recursive: true })
            console.debug(chalk.blue('- Create folder ', f))
        }
    })

    files.forEach(f => {
        if (folders[f.type]) {
            let destination = path.join(folders[f.type], f.name)
            if (fs.existsSync(destination)) {
                if (conf.conflict === 'overwrite') {
                    fs.writeFileSync(destination, f.content)
                    console.debug(chalk.yellow('- Overwrite file ', destination))
                } else {
                    console.debug(chalk.green('- > No change to exiting file ', destination))
                }
            } else {
                fs.writeFileSync(destination, f.content)
                console.debug(chalk.green('- Create file ', destination))
            }
        } else {
            console.error(chalk.red('No target folder defined for file type', f.type))
        }
    })

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
            console.error(chalk.red('Quant-UX: Could not download protoype! Maybe the Code generation token is not correct?'));
            console.error(chalk.red('          Check the .quant-ux.json file for the correctness of the token.'));
        }
    });
}

function load(confFile = '.quant-ux.json') {
    return new Promise( (resolve, reject) => {

        if (fs.existsSync(confFile)) {
            console.debug(`Quant-UX: Load config <${confFile}>`)
            let content = fs.readFileSync(confFile, 'UTF-8')
            resolve(JSON.parse(content))
        } else {
            console.debug(`Quant-UX: No ${confFile} found!`)
            const questions = [
                {
                    type : 'input',
                    name : 'token',
                    message : 'Code generation token. (You can optain it from the "Share" dialog in the web ui)'
                },
                {
                    type : 'input',
                    name : 'cssFolder',
                    default: "src/css",
                    message : 'CSS output folder'
                },
                {
                    type : 'input',
                    name : 'vueFolder',
                    default: "src/pages",
                    message : 'Vue output folder'
                },
                {
                    type : 'input',
                    name : 'htmlFolder',
                    default: "src/html",
                    message : 'HTML putput folder'
                },
                {
                    type : 'list',
                    name : 'type',
                    choices: ["Vue", "HTML"],
                    message : 'Output format'
                },
                {
                    type : 'confirm',
                    name : 'save',
                    message : 'Save config to .quant-ux.json'
                },
            ];
            prompt(questions).then(answers => {
                let conf = {
                        "token": answers.token,
                        "targets": {
                            "vue": answers.vueFolder,
                            "css": answers.cssFolder,
                            "html": answers.htmlFolder
                        },
                        "type": answers.type,
                        "server": "https://quant-ux.com",
                        "conflict": "overwrite",
                        "css": {
                            "responsive": true
                        }
                }
                if (answers.save) {
                    fs.writeFileSync(confFile, JSON.stringify(conf, null, 2))
                    console.debug(' - Write config file...')
                }
                resolve(conf)
            })
        }
    })
}

function main () {
    console.debug('Quant-UX: Start generating code! V 1.1.6')
    /**
     * Here is the main entry point
     */
    load().then(conf => {
        if (conf) {
            getApp(conf)
        }
    })
}

main()
