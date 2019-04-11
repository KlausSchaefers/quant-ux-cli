"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _request = _interopRequireDefault(require("request"));

var _GeneratorFactory = _interopRequireDefault(require("./export/GeneratorFactory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generate(app, conf) {
  console.debug("Quant-UX: Generate <".concat(conf.type, "> for prototype <").concat(app.name, ">"));

  var files = _GeneratorFactory["default"].create(app, conf);

  console.debug(files);
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
      console.error('error:', error); // Print the error if one occurred
    }
  });
}

function load() {
  var confFile = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.quant-ux.json';

  if (_fs["default"].existsSync(confFile)) {
    console.debug("Quant-UX: Load config <".concat(confFile, ">"));

    var content = _fs["default"].readFileSync(confFile, 'UTF-8');

    return JSON.parse(content);
  }
}

function main() {
  console.debug(' ______     __  __     ______     __   __     ______   __  __     __  __');
  console.debug('/\\  __ \\   /\\ \\/\\ \\   /\\  __ \\   /\\ "-.\\ \\   /\\__  _\\ /\\ \\/\\ \\   /\\_\\_\\_\\ ');
  console.debug('\\ \\ \\/\\_\\  \\ \\ \\_\\ \\  \\ \\  __ \\  \\ \\ \\-.  \\  \\/_/\\ \\/ \\ \\ \\_\\ \\  \\/_/\\_\\/_');
  console.debug(' \\ \\___\\_\\  \\ \\_____\\  \\ \\_\\ \\_\\  \\ \\_\\\\"\\_\\    \\ \\_\\  \\ \\_____\\   /\\_\\/\\_\\ ');
  console.debug('  \\/___/_/   \\/_____/   \\/_/\\/_/   \\/_/ \\/_/     \\/_/   \\/_____/   \\/_/\\/_/ ');
  console.debug('                                                                      V.1.01');
  console.debug('');
  /**
   * Here is the main entry point
   */

  var conf = load();

  if (conf) {
    getApp(conf);
  } else {
    console.error("No config file. Please create a ".concat(confFile, " file."));
  }
}

main();