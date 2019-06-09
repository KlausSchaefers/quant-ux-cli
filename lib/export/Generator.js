"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ModelTransformer = _interopRequireDefault(require("./ModelTransformer"));

var _CSSOptimizer = _interopRequireDefault(require("./CSSOptimizer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Main class the orchestrates the code generation. Can be configurred
 * with an element and style factory
 */
var Generator =
/*#__PURE__*/
function () {
  function Generator(elementFactory, styleFactory, codeFactory) {
    _classCallCheck(this, Generator);

    this.elementFactory = elementFactory;
    this.styleFactory = styleFactory, this.codeFactory = codeFactory;
  }

  _createClass(Generator, [{
    key: "run",
    value: function run(model) {
      var _this = this;

      var result = {
        id: model.id,
        name: model.name,
        screens: []
        /**
         * Compress the CSS, e.g. merge borders if possible.
         */

      };
      model = new _CSSOptimizer["default"]().run(model);
      /**
       * First, we create a grid model
       */

      var transformer = new _ModelTransformer["default"](model);
      var gridModel = transformer.transform();
      /**
       * Second, we create styles and attach them also to the model
       * if needed. We need to do this before, so we can
       * compute shared styles
       */

      result.styles = this.styleFactory.generate(gridModel);
      /**
      * Third, Generate code
      */

      gridModel.screens.forEach(function (screen) {
        result.screens.push(_this.generateScreen(screen, result.styles));
      });
      return result;
    }
  }, {
    key: "generateScreen",
    value: function generateScreen(screen, styles) {
      var _this2 = this;

      var result = {
        id: screen.id,
        name: screen.name,
        model: screen,
        styles: styles[screen.id],
        code: ""
      };
      var body = [];
      screen.children.forEach(function (child) {
        body.push(_this2.generateElement(child, styles));
      });
      result.template = this.elementFactory.screen(screen, styles[screen.id], body).trim();
      return result;
    }
  }, {
    key: "generateElement",
    value: function generateElement(element, styles) {
      var _this3 = this;

      if (element.children && element.children.length > 0) {
        var templates = [];
        element.children.forEach(function (child) {
          templates.push(_this3.generateElement(child, styles));
        });
        return this.elementFactory.container(element, styles[element.id], templates);
      } else {
        return this.elementFactory.element(element, styles[element.id]);
      }
    }
  }]);

  return Generator;
}();

exports["default"] = Generator;