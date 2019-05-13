"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("../ExportUtil"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VueMutliPageWriter =
/*#__PURE__*/
function () {
  function VueMutliPageWriter() {
    _classCallCheck(this, VueMutliPageWriter);
  }

  _createClass(VueMutliPageWriter, [{
    key: "getFiles",
    value: function getFiles(code, conf) {
      var _this = this;

      var result = [];
      var imports = ['normalize.css'];
      /**
       * First, create common css files
       */

      this.addNormalize(code, result);
      /**
       * Second, create symbol.css
       */

      if (this.addSymbols(code, result)) {
        imports.push('symbols.css');
      }
      /**
      * Thirs, create common.css for shared styles
      */


      if (this.addCommon(code, result)) {
        imports.push('common.css');
      }
      /**
       * Create a css and vue file for each screen
       */


      code.screens.forEach(function (screen) {
        _this.addFilesForScreen(screen, code, result, imports, conf);
      });
      return result;
    }
  }, {
    key: "addNormalize",
    value: function addNormalize(code, result) {
      var css = '';
      var normalize = code.styles['$NORMALIZE'];

      if (normalize) {
        css += normalize.map(function (s) {
          return s.code;
        }).join('\n');
      }

      result.push({
        name: "normalize.css",
        type: 'css',
        id: code.id,
        content: css
      });
    }
  }, {
    key: "addCommon",
    value: function addCommon(code, result) {
      return false;
    }
  }, {
    key: "addSymbols",
    value: function addSymbols(code, result) {
      var css = [];
      var written = [];
      Object.values(code.styles).forEach(function (styles) {
        styles.forEach(function (s) {
          if (s.type === 'template' && written.indexOf(s.css) < 0) {
            css.push(s.code);
            written.push(s.css);
          }
        });
      });
      console.debug("Quant-UX: addSymbols() >  ".concat(css.length, " symbol classes. [").concat(written, "]"));

      if (css.length > 0) {
        result.push({
          name: "symbols.css",
          type: 'css',
          id: code.id,
          content: css.join('\n')
        });
      }

      return css.length > 0;
    }
  }, {
    key: "addFilesForScreen",
    value: function addFilesForScreen(screen, code, result, imports, conf) {
      var css = Util.getScreenCSS(screen, code, ['common', 'template']);
      result.push({
        name: "".concat(this.getFileName(screen.name), ".css"),
        type: 'css',
        id: screen.id,
        content: css
      });
      imports.push("".concat(this.getFileName(screen.name), ".css"));
      var cssPath = this.getCSSPath(conf);
      var data = this.getData(screen);
      var body = screen.template;
      var cssImports = imports.map(function (i) {
        return "    @import url(\"".concat(cssPath).concat(i, "\");");
      }).join('\n');
      result.push({
        name: "".concat(this.getFileName(screen.name), ".vue"),
        screenName: this.getFileName(screen.name),
        type: 'vue',
        id: screen.id,
        content: this.getTemplate(screen, body, data, cssImports)
      });
    }
  }, {
    key: "getCSSPath",
    value: function getCSSPath(conf) {
      if (conf && conf.targets) {
        var css = conf.targets.css;
        var vue = conf.targets.vue;

        if (css && vue) {
          var path = [];
          var cssParts = css.split('/');
          var vueParts = vue.split('/');
          var stop = false;
          cssParts.forEach(function (p, i) {
            if (p === vueParts[i] && !stop) {
              path.push('..');
            } else {
              path.push(p);
            }
          });
          return path.join('/') + '/';
        }
      }

      return '';
    }
  }, {
    key: "getFileName",
    value: function getFileName(name) {
      return name.replace(/\s/g, '_');
    }
  }, {
    key: "getData",
    value: function getData(screen) {
      var _this2 = this;

      var elements = Util.getAllChildrenForScreen(screen);
      var bindings = elements.filter(function (e) {
        return e.props && e.props.databinding;
      }).map(function (e) {
        return "            ".concat(e.props.databinding["default"], ": ").concat(_this2.getDefaultDataBindung(e));
      });
      return bindings.join(',\n');
    }
  }, {
    key: "getTemplate",
    value: function getTemplate(screen, body, data, cssImports) {
      return "\n<template>\n".concat(body, "\n</template>\n<style lang=\"css\">\n").concat(cssImports, "\n</style>\n<script>\nexport default {\n    name: \"").concat(screen.name, "\",\n    mixins: [],\n    props: [],\n    data: function() {\n        return {\n").concat(data, "\n        };\n    },\n    components: {},\n    methods: {},\n    mounted() {}\n};\n</script>");
    }
  }, {
    key: "getDefaultDataBindung",
    value: function getDefaultDataBindung(e) {
      if (e.type === 'CheckBox') {
        return e.props.checked;
      }

      if (e.props.label && !e.props.placeholder) {
        return "\"".concat(e.props.label, "\"");
      }

      return '""';
    }
  }]);

  return VueMutliPageWriter;
}();

exports["default"] = VueMutliPageWriter;