"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _HTMLFactory2 = _interopRequireDefault(require("../html/HTMLFactory"));

var _ImportUtil = _interopRequireDefault(require("../ImportUtil"));

var Util = _interopRequireWildcard(require("../ExportUtil"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var VueFactory =
/*#__PURE__*/
function (_HTMLFactory) {
  _inherits(VueFactory, _HTMLFactory);

  function VueFactory(conf) {
    var _this;

    _classCallCheck(this, VueFactory);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VueFactory).call(this, conf));

    if (conf && conf.targets && conf.targets.images && conf.targets.vue) {
      _this.imagePrefix = _ImportUtil["default"].get(conf.targets.vue, conf.targets.images);
    }

    return _this;
  }

  _createClass(VueFactory, [{
    key: "element_CheckBox",
    value: function element_CheckBox(element, styles) {
      var css = this.css(styles);
      var databinding = this.getDataBinding(element);
      return "<input type=\"checkbox\" css=\"".concat(css, "\" class=\"").concat(css, "\" ").concat(databinding, " />");
    }
  }, {
    key: "element_TextBox",
    value: function element_TextBox(element, styles) {
      var css = this.css(styles);
      var placeholder = '';

      if (element.props.placeholder) {
        placeholder = element.props.label;
      }

      var databinding = this.getDataBinding(element);
      return "<input type=\"text\" placeholder=\"".concat(placeholder, "\" class=\"").concat(css, "\" ").concat(databinding, "/>");
    }
  }, {
    key: "getAction",
    value: function getAction(element, gridModel) {
      if (element.lines) {
        var click = element.lines.find(function (l) {
          return l.event === 'click';
        });

        if (click && click.screen) {
          var screen = gridModel.screens.find(function (s) {
            return s.id === click.screen.id;
          });

          if (screen) {
            return "@click=\"navigateTo('".concat(Util.getFileName(screen.name), "')\"");
          }
        }
      }

      return '';
    }
  }, {
    key: "getDataBinding",
    value: function getDataBinding(element) {
      if (element.props && element.props.databinding) {
        var databinding = element.props.databinding["default"];
        return "v-model=\"".concat(databinding, "\"");
      }

      return '';
    }
  }]);

  return VueFactory;
}(_HTMLFactory2["default"]);

exports["default"] = VueFactory;