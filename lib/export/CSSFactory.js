"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("./ExportUtil"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default() {
    var isResponsive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'MACT';

    _classCallCheck(this, _default);

    this.isResponsive = isResponsive;
    this.prefix = prefix;
    this.marginWhiteSpaceCorrect = 0;
    this.mapping = {
      "background": "background-color",
      "color": "color",
      "textAlign": "text-align",
      "fontFamily": "font-family",
      "fontSize": "font-size",
      "fontStyle": "font-style",
      "fontWeight": "font-weight",
      "letterSpacing": "letter-spacing",
      "lineHeight": "line-height",
      "borderBottomColor": "border-bottom-color",
      "borderTopColor": "border-top-color",
      "borderLeftColor": "border-left-color",
      "borderRightColor": "border-right-color",
      "borderBottomLeftRadius": "border-bottom-left-radius",
      "borderTopLeftRadius": "border-top-left-radius",
      "borderBottomRightRadius": "border-bottom-right-radius",
      "borderTopRightRadius": "border-top-right-radius",
      "borderBottomWidth": "border-bottom-width",
      "borderTopWidth": "border-top-width",
      "borderLeftWidth": "border-left-width",
      "borderRightWidth": "border-right-width",
      "borderTopStyle": "border-top-style",
      "borderBottomStyle": "border-bottom-style",
      "borderRightStyle": "border-left-style",
      "borderLeftStyle": "border-right-style",
      "paddingBottom": "padding-bottom",
      "paddingLeft": "padding-left",
      "paddingRight": "padding-right",
      "paddingTop": "padding-top",
      "marginBottom": "margin-bottom",
      "marginLeft": "margin-left",
      "marginRight": "margin-right",
      "marginTop": "margin-top",
      "textDecoration": "text-decoration",
      "boxShadow": "box-shadow",
      "textShadow": "text-shadow"
    };
    this.borderWidthProperties = ['borderBottomWidth', 'borderTopWidth', 'borderLeftWidth', 'borderRightWidth'];
    this.borderStyleProperties = ['borderTopStyle', 'borderBottomStyle', 'borderRightStyle', 'borderLeftStyle'];
    this.textProperties = ['color', 'textDecoration', 'textAlign', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight'];
    this.isString = {
      "fontFamily": true
    }, this.isPixel = {
      "borderBottomLeftRadius": true,
      "borderBottomRightRadius": true,
      "borderTopRightRadius": true,
      "borderTopLeftRadius": true,
      "borderBottomWidth": true,
      "borderLeftWidth": true,
      "borderTopWidth": true,
      "borderRightWidth": true,
      "paddingBottom": true,
      "paddingLeft": true,
      "paddingRight": true,
      "paddingTop": true,
      "fontSize": true
    };
  }

  _createClass(_default, [{
    key: "generate",
    value: function generate(model) {
      var _this = this;

      var result = {};
      model.screens.forEach(function (screen) {
        result[screen.id] = [];
        result[screen.id].push({
          type: 'screen',
          css: screen.name.replace(/\s+/g, '_'),
          global: false,
          code: _this.getCSS(screen)
        });
        screen.children.forEach(function (child) {
          _this.generateElement(child, result, screen);
        });
      });
      result['$NORMALIZE'] = [];
      result['$NORMALIZE'].push({
        type: 'screen',
        css: '',
        global: true,
        code: this.getGlobalStyles()
      });
      return result;
    }
  }, {
    key: "getGlobalStyles",
    value: function getGlobalStyles() {
      var result = '';
      result += "body {\n  margin:0px;\n  font-family:'Source Sans Pro', 'Helvetica Neue', 'Helvetica', sans-serif;\n}\n\n";
      result += "div {\n  margin:0px;\n}\n\n";
      return result;
    }
  }, {
    key: "generateElement",
    value: function generateElement(node, result, screen) {
      var _this2 = this;

      result[node.id] = [];
      result[node.id].push({
        type: 'widget',
        css: node.name.replace(/\s+/g, '_'),
        global: false,
        code: this.getCSS(node, screen)
      });

      if (node.children) {
        node.children.forEach(function (child) {
          _this2.generateElement(child, result, screen);
        });
      }
    }
  }, {
    key: "getRaw",
    value: function getRaw(model, selectedWidgets) {
      var result = "";

      for (var i = 0; i < selectedWidgets.length; i++) {
        var id = selectedWidgets[i];
        var widget = model.widgets[id];

        if (widget) {
          result += this.getCSS(widget, null, false);
        } else {
          this.logger.warn("getRaw", "No widget with id > " + widget);
        }
      }

      return result;
    }
  }, {
    key: "getCSS",
    value: function getCSS(widget, screen) {
      var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var result = "";
      var name = this.getName(widget);
      result += '.' + name + ' {\n';
      var style = widget.style;
      style = Util.fixAutos(style, widget);
      result += this.getRawStyle(style);

      if (position) {
        result += this.getPosition(widget, screen);
      }

      if (this['getCSS_' + widget.type]) {
        result += this['getCSS_' + widget.type](widget.style, widget);
      }

      result += '}\n\n';

      if (widget.hover) {
        result += '.' + name + ':hover {\n';
        result += this.getRawStyle(widget.hover);

        if (this['getCSS_' + widget.type]) {
          result += this['getCSS_' + widget.type](widget.hover, widget);
        }

        result += '}\n\n';
      }

      return result;
    }
  }, {
    key: "getCSS_row",
    value: function getCSS_row() {
      return '  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: flex-start;\n  align-content: flex-start;\n';
    }
  }, {
    key: "getCSS_column",
    value: function getCSS_column() {
      return '  display: inline-block;\n';
    }
  }, {
    key: "getName",
    value: function getName(box) {
      return box.name.replace(/\s+/g, '_');
    }
  }, {
    key: "getPosition",
    value: function getPosition(widget) {
      var result = '';
      /**
       * If the widget is on the root level, we use teh screen!
       */

      var w = widget.w;
      var h = widget.h;
      var top = widget.y;
      var left = Math.max(0, widget.x - this.marginWhiteSpaceCorrect);
      var unitX = 'px';
      var unitY = 'px';
      /**
       * Take padding and border into account into account
       */

      if (widget.style) {
        if (widget.style.paddingTop) {
          h -= widget.style.paddingTop;
        }

        if (widget.style.paddingBottom) {
          h -= widget.style.paddingBottom;
        }

        if (widget.style.paddingLeft) {
          w -= widget.style.paddingLeft;
        }

        if (widget.style.paddingRight) {
          w -= widget.style.paddingRight;
        }

        if (widget.style.borderTopWidth) {
          h -= widget.style.borderTopWidth;
        }

        if (widget.style.borderBottomWidth) {
          h -= widget.style.borderBottomWidth;
        }

        if (widget.style.borderLeftWidth) {
          w -= widget.style.borderLeftWidth;
        }

        if (widget.style.borderRightWidth) {
          w -= widget.style.borderRightWidth;
        }
      }

      if (this.isResponsive) {
        if (widget.parent) {
          w = w / widget.parent.w * 100;
          left = left / widget.parent.w * 100;
        } else {
          w = 100;
          left = 0;
        }

        unitX = '%';
      }
      /**
       * To deal with margin collapsing we set things to inline-block. We could
       * still check for borders...
       */


      if (this.getSiblings(widget).length > 1) {
        result += '  display: inline-block;\n';
      }

      result += "  width: ".concat(w).concat(unitX, ";\n");
      result += "  height: ".concat(h).concat(unitY, ";\n");
      result += "  margin-top: ".concat(top).concat(unitY, ";\n");
      result += "  margin-left: ".concat(left).concat(unitX, ";\n");
      return result;
    }
  }, {
    key: "getSiblings",
    value: function getSiblings(widget) {
      if (widget.parent && widget.parent.children) {
        return widget.parent && widget.parent.children;
      }

      return [];
    }
  }, {
    key: "getRawStyle",
    value: function getRawStyle(style) {
      var result = '  border:0px solid;\n';

      for (var key in this.mapping) {
        if (style[key] !== undefined && style[key] !== null) {
          var value = style[key];
          result += '  ' + this.getKey(key) + ': ' + this.getValue(key, value) + ';\n';
        }
      }

      return result;
    }
  }, {
    key: "getKey",
    value: function getKey(key) {
      return this.mapping[key];
    }
  }, {
    key: "getValue",
    value: function getValue(key, value) {
      var result = '';

      if (this.isString[key]) {
        result += '"' + value + '"';
      } else if (this.isPixel[key]) {
        result += value + 'px';
      } else if (key === "boxShadow") {
        result = value.h + "px " + value.v + "px " + value.b + "px " + value.s + "px " + value.c;

        if (value.i) {
          result += 'inset';
        }
      } else if (key === 'textShadow') {
        result = value.h + "px " + value.v + "px " + value.b + "px " + value.c;
      } else {
        result += value;
      }

      return result;
    }
  }, {
    key: "clone",
    value: function clone(obj) {
      if (!obj) {
        return null;
      }

      var _s = JSON.stringify(obj);

      return JSON.parse(_s);
    }
  }]);

  return _default;
}();

exports["default"] = _default;