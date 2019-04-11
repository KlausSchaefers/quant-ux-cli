"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _CSSFactory = _interopRequireDefault(require("./CSSFactory"));

var _Generator = _interopRequireDefault(require("./Generator"));

var _HTMLFactory = _interopRequireDefault(require("./html/HTMLFactory"));

var ExportUtil = _interopRequireWildcard(require("./ExportUtil"));

var _HTMLPageWriter = _interopRequireDefault(require("./html/HTMLPageWriter"));

var _VueFactory = _interopRequireDefault(require("./vue/VueFactory"));

var _VueSinglePageWriter = _interopRequireDefault(require("./vue/VueSinglePageWriter"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GeneratorFactory =
/*#__PURE__*/
function () {
  function GeneratorFactory() {
    _classCallCheck(this, GeneratorFactory);
  }

  _createClass(GeneratorFactory, [{
    key: "create",
    value: function create(app, conf) {
      if (conf.type === 'vue') {
        var vueGenerator = new _Generator["default"](new _VueFactory["default"](), new _CSSFactory["default"](conf.css.responsive));
        var vueResult = vueGenerator.run(app);
        var writer = new _VueSinglePageWriter["default"]();
        var files = writer.getFiles(vueResult);
        return files;
      }

      if (conf.type === 'html') {
        var _vueGenerator = new _Generator["default"](new _HTMLFactory["default"](), new _CSSFactory["default"](conf.css.responsive));

        var _vueResult = _vueGenerator.run(app);

        var _writer = new _HTMLPageWriter["default"]();

        var _files = _writer.getFiles(_vueResult);

        return _files;
      }
    }
  }]);

  return GeneratorFactory;
}();

var _default = new GeneratorFactory();

exports["default"] = _default;