"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("../ExportUtil"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HTMLPageWriter = /*#__PURE__*/function () {
  function HTMLPageWriter() {
    _classCallCheck(this, HTMLPageWriter);
  }

  _createClass(HTMLPageWriter, [{
    key: "getFiles",
    value: function getFiles(code) {
      var result = [];
      code.screens.forEach(function (screen) {
        var body = screen.template;
        var css = '';
        var normalize = code.styles['$NORMALIZE'];

        if (normalize) {
          css += normalize.map(function (s) {
            return s.code;
          }).join('\n');
        }

        css += screen.styles.map(function (s) {
          return s.code;
        }).join('\n');
        var elements = Util.getAllChildrenForScreen(screen);
        elements.forEach(function (element) {
          var styles = code.styles[element.id];
          css += styles.map(function (s) {
            return s.code;
          }).join('\n');
        });
        result.push({
          name: "".concat(screen.name, ".css"),
          type: 'css',
          id: screen.id,
          content: css
        });
        result.push({
          name: "".concat(screen.name, ".html"),
          type: 'html',
          id: screen.id,
          content: "<html>\n    <head>\n    <title>".concat(screen.name, "</title>\n    <style type=\"text/css\">\n        @import url(\"style/").concat(screen.name, ".css\");\n    </style>\n    <link href='https://fonts.googleapis.com/css?family=Roboto:400,300,700|Source+Sans+Pro:400,300,200,700' rel='stylesheet' type='text/css'>\n    </head>\n    <body>\n        ").concat(body, "\n    </body>\n</html>")
        });
      });
      return result;
    }
  }]);

  return HTMLPageWriter;
}();

exports["default"] = HTMLPageWriter;