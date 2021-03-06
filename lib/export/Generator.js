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
var Generator = /*#__PURE__*/function () {
  function Generator(elementFactory, styleFactory, codeFactory) {
    _classCallCheck(this, Generator);

    this.elementFactory = elementFactory;
    this.styleFactory = styleFactory, this.codeFactory = codeFactory;
  }

  _createClass(Generator, [{
    key: "run",
    value: function run(model) {
      var _this = this;

      var grid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var result = {
        id: model.id,
        name: model.name,
        screens: []
      };
      /**
       * First, we create a grid model
       */

      var transformer = new _ModelTransformer["default"](model, grid);
      var gridModel = transformer.transform();
      /**
       * Second the CSS, e.g. merge borders if possible.
       */

      gridModel = new _CSSOptimizer["default"]().runTree(gridModel);
      /**
       * Third, we create styles and attach them also to the model
       * if needed. We need to do this before, so we can
       * compute shared styles
       */

      result.styles = this.styleFactory.generate(gridModel);
      /**
      * Last, Generate code
      */

      gridModel.screens.forEach(function (screen) {
        result.screens.push(_this.generateScreen(screen, result.styles, gridModel));
      });
      return result;
    }
  }, {
    key: "generateScreen",
    value: function generateScreen(screen, styles, gridModel) {
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
        body.push(_this2.generateElement(child, styles, gridModel));
      });
      screen.fixedChildren.forEach(function (child) {
        body.push(_this2.generateElement(child, styles, gridModel));
      });
      result.template = this.elementFactory.screen(screen, styles[screen.id], body).trim();
      return result;
    }
  }, {
    key: "generateElement",
    value: function generateElement(element, styles, gridModel) {
      var _this3 = this;

      if (element.style.fixed) console.debug('Generator.egenerateElement', element.name, styles[element.id]);

      if (element.children && element.children.length > 0) {
        var templates = [];
        element.children.forEach(function (child) {
          templates.push(_this3.generateElement(child, styles, gridModel));
        });
        return this.elementFactory.container(element, styles[element.id], templates);
      } else {
        return this.elementFactory.element(element, styles[element.id], gridModel);
      }
    }
  }]);

  return Generator;
}();

exports["default"] = Generator;