"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _request = _interopRequireDefault(require("request"));

var _inquirer = require("inquirer");

var _chalk = _interopRequireDefault(require("chalk"));

var _GeneratorFactory = _interopRequireDefault(require("./export/GeneratorFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generate(app, conf) {
  console.debug("Quant-UX: Generate <".concat(conf.type, "> for prototype <").concat(app.name, ">"));

  var generator = _GeneratorFactory["default"].create(conf);

  var files = generator.run(app, conf);
  var folders = {
    'vue': conf.targets.vue,
    'html': conf.targets.html,
    'css': conf.targets.css,
    'app': conf.targets.app,
    'images': conf.targets.images,
    'router': conf.targets.vueRouter,
    'vueApp': conf.targets.vueApp
  };
  Object.values(folders).forEach(function (f) {
    if (f) {
      if (!_fs["default"].existsSync(f)) {
        _fs["default"].mkdirSync(f, {
          recursive: true
        });

        console.debug(_chalk["default"].blue('- Create folder ', f));
      }
    }
  });
  files.forEach(function (f) {
    if (folders[f.type]) {
      var destination = _path["default"].join(folders[f.type], f.name);

      if (_fs["default"].existsSync(destination)) {
        if (conf.conflict === 'overwrite') {
          writeFile(destination, f, conf);
          console.debug(_chalk["default"].yellow('- Overwrite file ', destination));
        } else {
          console.debug(_chalk["default"].green('- > No change to exiting file ', destination));
        }
      } else {
        writeFile(destination, f, conf);
        console.debug(_chalk["default"].green('- Create file ', destination));
      }
    } else {
      console.error(_chalk["default"].red('No target folder defined for file type', f.type));
    }
  });
}

function writeFile(destination, f, conf) {
  if (f.type === 'images') {
    var url = "".concat(conf.server, "/rest/images/").concat(conf.token, "/").concat(f.src);
    (0, _request["default"])(url).pipe(_fs["default"].createWriteStream(destination)).on('close', function (res) {
      console.debug(_chalk["default"].green(' - Download Image', f.name));
    });
  } else {
    _fs["default"].writeFileSync(destination, f.content);
  }
}

function getApp(conf) {
  var url = "".concat(conf.server, "/rest/invitation/").concat(conf.token, "/app.json");
  (0, _request["default"])(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var app = JSON.parse(body);

      if (app) {
        generate(app, conf);
      }
    } else {
      console.error(_chalk["default"].red('Quant-UX: Could not download protoype! Maybe the Code generation token is not correct?'));
      console.error(_chalk["default"].red('          Check the .quant-ux.json file for the correctness of the token.'));
    }
  });
}

function load() {
  var confFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.quant-ux.json';
  return new Promise(function (resolve, reject) {
    if (_fs["default"].existsSync(confFile)) {
      console.debug("Quant-UX: Load config <".concat(confFile, ">"));

      var content = _fs["default"].readFileSync(confFile, 'UTF-8');

      resolve(JSON.parse(content));
    } else {
      console.debug("Quant-UX: No ".concat(confFile, " found!"));
      var questions = [{
        type: 'input',
        name: 'token',
        message: 'Code generation token. (You can optain it from the "Share" dialog in the web ui)'
      }, {
        type: 'list',
        name: 'type',
        choices: ["Download", "Vue (Deprecated)", "HTML (Deprecated)"],
        message: 'Output format'
      }];
      (0, _inquirer.prompt)(questions).then(function (answers) {
        var conf = {
          "token": answers.token,
          "type": answers.type,
          "server": "https://quant-ux.com",
          "conflict": "overwrite",
          "css": {
            "grid": false,
            "prefix": ""
          },
          "vue": {
            "generateRouter": true,
            "generateApp": true,
            "routerName": "router.js"
          }
        };

        if (answers.type === 'Download') {
          propmpDownlaod(conf, confFile, resolve);
        } else {
          propmpGenerate(conf, confFile, resolve);
        }
      });
    }
  });
}

function propmpDownlaod(conf, confFile, resolve) {
  var questions = [{
    type: 'input',
    name: 'jsonFolder',
    "default": "src/qux",
    message: 'Design file folder'
  }, {
    type: 'input',
    name: 'imageFolder',
    "default": "public/img",
    message: 'Image folder'
  }, {
    type: 'confirm',
    name: 'save',
    message: 'Save config to .quant-ux.json'
  }];
  (0, _inquirer.prompt)(questions).then(function (answers) {
    conf.targets = {
      "images": answers.imageFolder,
      "app": answers.jsonFolder
    };

    if (answers.save) {
      _fs["default"].writeFileSync(confFile, JSON.stringify(conf, null, 2));

      console.debug(' - Write config file...');
    }

    resolve(conf);
  });
}

function propmpGenerate(conf, confFile, resolve) {
  var questions = [{
    type: 'input',
    name: 'cssFolder',
    "default": "src/css",
    message: 'CSS output folder'
  }, {
    type: 'input',
    name: 'vueFolder',
    "default": "src/pages",
    message: 'Vue output folder'
  }, {
    type: 'input',
    name: 'htmlFolder',
    "default": "src/html",
    message: 'HTML putput folder'
  }, {
    type: 'input',
    name: 'imageFolder',
    "default": "src/images",
    message: 'Image folder'
  }, {
    type: 'confirm',
    name: 'save',
    message: 'Save config to .quant-ux.json'
  }];
  (0, _inquirer.prompt)(questions).then(function (answers) {
    conf.targets = {
      "vue": answers.vueFolder,
      "css": answers.cssFolder,
      "html": answers.htmlFolder,
      "images": answers.imageFolder,
      "vueRouter": "src",
      "vueApp": "src"
    };

    if (answers.save) {
      _fs["default"].writeFileSync(confFile, JSON.stringify(conf, null, 2));

      console.debug(' - Write config file...');
    }

    resolve(conf);
  });
}

function main() {
  console.debug('Quant-UX: Start generating code! V 2.0.1');
  /**
   * Here is the main entry point
   */

  load().then(function (conf) {
    if (conf) {
      getApp(conf);
    }
  });
}

main();