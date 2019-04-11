"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("export/ExportUtil"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VueSinglePageWriter =
/*#__PURE__*/
function () {
  function VueSinglePageWriter() {
    _classCallCheck(this, VueSinglePageWriter);
  }

  _createClass(VueSinglePageWriter, [{
    key: "getFiles",
    value: function getFiles(code) {
      var _this = this;

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
        var bindings = elements.filter(function (e) {
          return e.props && e.props.databinding;
        }).map(function (e) {
          return "            ".concat(e.props.databinding["default"], ": ").concat(_this.getDefaultDataBindung(e));
        });
        console.debug(bindings);
        var data = bindings.join('\n');
        result.push({
          name: "".concat(screen.name, ".css"),
          type: 'css',
          id: screen.id,
          content: css
        });
        result.push({
          name: "".concat(screen.name, ".vue"),
          type: 'vue',
          id: screen.id,
          content: "\n<template>\n".concat(body, "\n</template>\n<style lang=\"css\">\n    @import url(\"style/").concat(screen.name, ".css\");\n</style>\n<script>\nexport default {\n    name: \"").concat(screen.name, "\",\n    mixins: [],\n    props: [], \n    data: function() {\n        return {\n").concat(data, "\n        };\n    },\n    components: {},\n    methods: {\n        \n        }\n    },\n    mounted() {}\n};\n</script>")
        });
      });
      return result;
    }
  }, {
    key: "getDefaultDataBindung",
    value: function getDefaultDataBindung(e) {
      if (e.type === 'CheckBox') {
        return e.props.checked;
      }

      return '';
    }
  }]);

  return VueSinglePageWriter;
}();

exports["default"] = VueSinglePageWriter;