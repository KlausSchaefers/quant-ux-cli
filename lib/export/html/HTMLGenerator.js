"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CSSFactory = _interopRequireDefault(require("../CSSFactory"));

var _Generator = _interopRequireDefault(require("../Generator"));

var _HTMLFactory = _interopRequireDefault(require("./HTMLFactory"));

var _HTMLPageWriter = _interopRequireDefault(require("./HTMLPageWriter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HTMLGenerator =
/*#__PURE__*/
function () {
  function HTMLGenerator() {
    _classCallCheck(this, HTMLGenerator);
  }

  _createClass(HTMLGenerator, [{
    key: "run",
    value: function run(app, conf) {
      var generator = new _Generator["default"](new _HTMLFactory["default"](), new _CSSFactory["default"](conf.css.responsive));
      var result = generator.run(app);
      var writer = new _HTMLPageWriter["default"]();
      var files = writer.getFiles(result, conf);
      return files;
    }
  }]);

  return HTMLGenerator;
}();

var _default = new HTMLGenerator();

exports["default"] = _default;