"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _VueGenerator = _interopRequireDefault(require("./vue/VueGenerator"));

var _HTMLGenerator = _interopRequireDefault(require("./html/HTMLGenerator"));

var _DownloadGenerator = _interopRequireDefault(require("./download/DownloadGenerator"));

var _chalk = _interopRequireDefault(require("chalk"));

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
    value: function create(conf) {
      if (conf.type.toLowerCase() === 'vue') {
        return new _VueGenerator["default"]();
      }

      if (conf.type.toLowerCase() === 'html') {
        return new _HTMLGenerator["default"]();
      }

      if (conf.type.toLowerCase() === 'download') {
        return new _DownloadGenerator["default"]();
      }

      console.error(_chalk["default"].red('Not supported type : ' + conf.type.toLowerCase()));
    }
  }]);

  return GeneratorFactory;
}();

var _default = new GeneratorFactory();

exports["default"] = _default;