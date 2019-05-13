"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pretty = _interopRequireDefault(require("pretty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var HTMLFactory =
/*#__PURE__*/
function () {
  function HTMLFactory() {
    _classCallCheck(this, HTMLFactory);
  }

  _createClass(HTMLFactory, [{
    key: "screen",
    value: function screen(_screen, styles, childTemplates) {
      var css = this.css(styles);
      var inner = childTemplates.join('');
      var result = "<div class=\"".concat(css, " MatcSreen\">").concat(inner, "</div>");
      return (0, _pretty["default"])(result);
    }
  }, {
    key: "container",
    value: function container(_container, styles, childTemplates) {
      var css = this.css(styles);
      var inner = childTemplates.join('');
      return "<div class=\"".concat(css.trim(), "\"> ").concat(inner, "</div>");
    }
  }, {
    key: "element_Label",
    value: function element_Label(element, styles) {
      var css = this.css(styles);
      var label = element.props.label;
      return "<label css=\"".concat(css, "\" class=\"").concat(css, "\" >").concat(label, "</label>");
    }
  }, {
    key: "element",
    value: function element(_element, styles) {
      if (this['element_' + _element.type]) {
        return this['element_' + _element.type](_element, styles);
      }

      var css = this.css(styles);
      var label = '';

      if (_element.props.label) {
        label = _element.props.label;
      }

      return "<div class=\"".concat(css, "\">").concat(label, "</div>");
    }
  }, {
    key: "element_CheckBox",
    value: function element_CheckBox(element, styles) {
      var css = this.css(styles);
      return "<input type=\"checkbox\" css=\"".concat(css, "\" class=\"").concat(css, "\" checked=\"").concat(this.stripHTML(element.props.selected), " />");
    }
  }, {
    key: "element_TextBox",
    value: function element_TextBox(element, styles) {
      var css = this.css(styles);
      var placeholder = '';
      var value = element.props.label;

      if (element.props.placeholder) {
        placeholder = value;
        value = '';
      }

      return "<input type=\"text\" placeholder=\"".concat(placeholder, "\" class=\"").concat(css, "\" value=\"").concat(value, "\" />");
    }
  }, {
    key: "element_Box",
    value: function element_Box(element, styles) {
      var css = this.css(styles);
      var label = '';

      if (element.props.label) {
        label = element.props.label;
      }

      return "<div class=\"".concat(css, "\">").concat(label, "</div>");
    }
  }, {
    key: "element_Button",
    value: function element_Button(element, styles) {
      var css = this.css(styles);
      var label = '';

      if (element.props.label) {
        label = element.props.label;
      }

      return "<div class=\"".concat(css, "\">").concat(label, "</div>");
    }
  }, {
    key: "element_ToggleButton",
    value: function element_ToggleButton(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_ImageCarousel",
    value: function element_ImageCarousel(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_CheckBox",
    value: function element_CheckBox(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_CheckBoxGroup",
    value: function element_CheckBoxGroup(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Date",
    value: function element_Date(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_DateDropDown",
    value: function element_DateDropDown(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_DragNDrop",
    value: function element_DragNDrop(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_DropDown",
    value: function element_DropDown(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_HoverDropDown",
    value: function element_HoverDropDown(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_HotSpot",
    value: function element_HotSpot(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Icon",
    value: function element_Icon(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_IconToggle",
    value: function element_IconToggle(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_LabeledIconToggle",
    value: function element_LabeledIconToggle(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Image",
    value: function element_Image(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Label",
    value: function element_Label(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_MobileDropDown",
    value: function element_MobileDropDown(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_RadioBox2",
    value: function element_RadioBox2(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_RadioGroup",
    value: function element_RadioGroup(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Rating",
    value: function element_Rating(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_HSlider",
    value: function element_HSlider(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Spinner",
    value: function element_Spinner(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Stepper",
    value: function element_Stepper(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Switch",
    value: function element_Switch(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Table",
    value: function element_Table(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_TextBox",
    value: function element_TextBox(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_TextArea",
    value: function element_TextArea(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Password",
    value: function element_Password(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_TypeAheadTextBox",
    value: function element_TypeAheadTextBox(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_VolumeSlider",
    value: function element_VolumeSlider(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_Repeater",
    value: function element_Repeater(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_SegmentButton",
    value: function element_SegmentButton(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_BarChart",
    value: function element_BarChart(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_PieChart",
    value: function element_PieChart(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_MultiRingChart",
    value: function element_MultiRingChart(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "element_RingChart",
    value: function element_RingChart(element, styles) {
      var css = this.css(styles);
      return "<div css=\"".concat(css, "\" class=\"").concat(css, "\" />");
    }
  }, {
    key: "css",
    value: function css(styles) {
      if (styles) {
        return styles.map(function (s) {
          return s.css;
        }).join(' ').trim();
      }

      return '';
    }
  }, {
    key: "stripHTML",
    value: function stripHTML(s) {
      if (s == null || s == undefined) s = "";

      if (s.replace) {
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/<\/?[^>]+(>|$)/g, "");
        s = s.replace(/\n/g, "<br>");
        s = s.replace(/\$perc;/g, "%");
      }

      return s;
    }
  }]);

  return HTMLFactory;
}();

exports["default"] = HTMLFactory;