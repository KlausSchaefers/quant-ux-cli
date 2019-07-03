"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("./ExportUtil"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default() {
    var isGrid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var useScreenNameInSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, _default);

    this.isGrid = isGrid;
    this.prefix = prefix ? prefix : '';
    this.useScreenNameInSelector = useScreenNameInSelector;
    this.marginWhiteSpaceCorrect = 0;
    this.isResponsive = true;
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
      "border": "border",
      "borderWidth": "border-width",
      "borderStyle": "border-style",
      "borderColor": "border-color",
      "borderRadius": "border-radius",
      "borderLeft": "border-left",
      "borderRight": "border-right",
      "borderTop": "border-top",
      "borderBottom": "border-bottom",
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
      "padding": "padding",
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
    this.isPixel = {
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
    this.heightProperties = ['paddingTop', '_paddingTop', 'paddingBottom', '_paddingBottom', 'borderTopWidth', '_borderTopWidth', 'borderBottomWidth', '_borderBottomWidth'];
  }

  _createClass(_default, [{
    key: "generate",
    value: function generate(model) {
      var _this = this;

      var result = {};
      /**
       * Generate the template styles
       */

      model.templates.forEach(function (t) {
        var style = {
          type: 'template',
          css: t.name.replace(/\s+/g, '_'),
          global: true,
          code: _this.getCSS(t, null, false)
        };
        result[t.id] = [style];
      });
      /**
       * Generate styles for each screen. The templates styles
       * might here be reused!
       */

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
      /**
       * Add some normalizer styles
       */

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
      /**
       * If we have a templated node,
       * add also the template class here
       */

      if (node.template) {
        var template = result[node.template];

        if (template) {
          template.forEach(function (t) {
            result[node.id].push(t);
          });
        }
      }
      /**
       * TDOD: If we have shared code...
       */


      var name = this.getName(node);
      result[node.id].push({
        type: 'widget',
        css: name,
        global: false,
        code: this.getCSS(node, screen),
        inherited: node.inherited,
        inheritedScreen: node.inheritedScreen
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
    key: "getSelector",
    value: function getSelector(widget, screen) {
      var selector = '.' + this.getName(widget);

      if (this.useScreenNameInSelector && screen) {
        selector = '.' + this.getName(screen) + ' ' + selector;
      }

      return selector;
    }
  }, {
    key: "getName",
    value: function getName(box) {
      var name = box.name.replace(/\s+/g, '_');

      if (box.inherited) {
        name += '_Master';
      }

      if (this.prefix) {
        name = "".concat(this.prefix, "_").concat(name);
      }

      return name;
    }
  }, {
    key: "getCSS",
    value: function getCSS(widget, screen) {
      var position = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var result = "";
      var style = widget.style;
      style = Util.fixAutos(style, widget);
      var selector = this.getSelector(widget, screen);
      result += selector + ' {\n';
      result += this.getRawStyle(style);

      if (widget.lines && widget.lines.length > 0) {
        result += '  cursor: pointer;\n';
      }

      if (position) {
        result += this.getPosition(widget, screen);
      }

      if (this['getCSS_' + widget.type]) {
        result += this['getCSS_' + widget.type](widget.style, widget);
      }

      result += '}\n\n';

      if (widget.hover) {
        result += selector + ':hover {\n';
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
      if (!this.isGrid) {
        return '  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: flex-start;\n  align-content: flex-start;\n';
      }

      return '';
    }
  }, {
    key: "getCSS_column",
    value: function getCSS_column() {
      if (!this.isGrid) {
        return '  display: inline-block;\n';
      }

      return '';
    }
  }, {
    key: "getCSS_Image",
    value: function getCSS_Image() {
      var result = '';

      if (this.isGrid) {
        result += "  height:100%;\n";
        result += "  width:100%;\n";
      }

      return result;
    }
  }, {
    key: "getPosition",
    value: function getPosition(widget) {
      if (!this.isGrid) {
        return this.getAbsolutePosition(widget);
      } else {
        return this.getGridPosition(widget);
      }
    }
  }, {
    key: "getGridPosition",
    value: function getGridPosition(widget) {
      var result = ''; //console.debug('getGridPosition', widget.name, ' = ', Util.isRowGrid(widget))

      if (widget.grid) {
        // FIXME: Remove the false!
        if (Util.isRowGrid(widget)) {
          widget.grid.isRow = true;
          result += "  display: flex;\n";
          result += "  flex-direction: column;\n";
        } else {
          result += '  display: grid;\n';
          result += '  grid-template-columns: ' + this.getGridTracks(widget.w, widget.grid.columns) + ';\n';
          result += '  grid-template-rows: ' + this.getGridTracks(widget.h, widget.grid.rows) + ';\n';
        }
      }

      if (widget.parent) {
        // console.debug(widget.name, widget.parent.name, widget.parent.grid !== undefined)
        if (widget.parent.grid && widget.parent.grid.isRow) {
          //FIXME: Here we should have some where fancz logic to take pins and fix into account
          if (Util.isPinnedLeft(widget) && Util.isPinnedRight(widget)) {
            result += "  margin-left: ".concat(this.getPinnedLeft(widget), ";\n");
            result += "  margin-right: ".concat(this.getPinnedRight(widget), ";\n");
          } else if (Util.isPinnedLeft(widget)) {
            if (Util.isFixedHorizontal(widget)) {
              result += "  width: ".concat(this.getFixedWidth(widget), ";\n");
              result += "  margin-left: ".concat(this.getPinnedLeft(widget), ";\n");
            } else {
              result += "  margin-right: ".concat(this.getResponsiveRight(widget), ";\n");
              result += "  margin-left: ".concat(this.getPinnedLeft(widget), ";\n");
            }
          } else if (Util.isPinnedRight(widget)) {
            if (Util.isFixedHorizontal(widget)) {
              result += "  width: ".concat(this.getFixedWidth(widget), ";\n");
              result += "  margin-left: ".concat(this.getCalcLeft(widget), ";\n");
            } else {
              result += "  margin-left: ".concat(this.getResponsiveLeft(widget), ";\n");
              result += "  margin-right: ".concat(this.getPinnedRight(widget), ";\n");
            }
          } else {
            if (Util.isFixedHorizontal(widget)) {
              result += "  width: ".concat(this.getFixedWidth(widget), ";\n");
              result += "  margin-left: ".concat(this.getResponsiveLeft(widget), ";\n");
            } else {
              result += "  margin-right: ".concat(this.getResponsiveRight(widget), ";\n");
              result += "  margin-left: ".concat(this.getResponsiveLeft(widget), ";\n");
            }
          }

          if (Util.isFixedVertical(widget)) {
            result += "  height: ".concat(this.getCorrectedHeight(widget), ";\n");
          } else {
            result += "  min-height: ".concat(this.getCorrectedHeight(widget), ";\n");
          }

          result += "  margin-top: ".concat(this.getPinnedTop(widget), ";\n");

          if (Util.isLastChild(widget)) {
            result += "  margin-bottom: ".concat(this.getPinnedBottom(widget), ";\n");
          }
        } else {
          result += "  grid-column-start: ".concat(widget.gridColumnStart + 1, ";\n");
          result += "  grid-column-end: ".concat(widget.gridColumnEnd + 1, ";\n");
          result += "  grid-row-start: ".concat(widget.gridRowStart + 1, ";\n");
          result += "  grid-row-end: ".concat(widget.gridRowEnd + 1, ";\n");
        }
      } else {
        result += "  min-height: 100%;\n";
      }

      return result;
    }
  }, {
    key: "getPinnedBottom",
    value: function getPinnedBottom(widget) {
      if (widget.parent) {
        var parent = widget.parent;
        var innerHeight = parent.children.map(function (c) {
          return c.h + c.top;
        }).reduce(function (a, b) {
          return a + b;
        }, 0);
        return parent.h - innerHeight + 'px';
      }

      return 'auto';
    }
  }, {
    key: "getFixedWidth",
    value: function getFixedWidth(widget) {
      return widget.w + 'px';
    }
  }, {
    key: "getPinnedTop",
    value: function getPinnedTop(widget) {
      return widget.top + 'px';
    }
  }, {
    key: "getCalcLeft",
    value: function getCalcLeft(widget) {
      if (widget.parent) {
        var right = widget.parent.w - (widget.x + widget.w);
        return "calc(100% - ".concat(widget.w + right, "px)");
      }

      return '0px';
    }
  }, {
    key: "getResponsiveLeft",
    value: function getResponsiveLeft(widget) {
      if (widget.parent) {
        return Math.round(widget.x * 100 / widget.parent.w) + '%';
      }

      return widget.x + 'px';
    }
  }, {
    key: "getResponsiveRight",
    value: function getResponsiveRight(widget) {
      if (widget.parent) {
        var right = widget.parent.w - (widget.x + widget.w);
        return Math.round(right * 100 / widget.parent.w) + '%';
      }

      return widget.x + 'px';
    }
  }, {
    key: "getPinnedLeft",
    value: function getPinnedLeft(widget) {
      return widget.x + 'px';
    }
  }, {
    key: "getPinnedRight",
    value: function getPinnedRight(widget) {
      if (widget.parent) {
        return widget.parent.w - (widget.x + widget.w) + 'px';
      }

      return '0px';
    }
  }, {
    key: "getResponsiveWidth",
    value: function getResponsiveWidth(widget) {
      if (widget.parent) {
        return Math.round(widget.w * 100 / widget.parent.w) + '%';
      }

      return '100%';
    }
  }, {
    key: "getFixedHeight",
    value: function getFixedHeight(widget) {
      return widget.h + 'px';
    }
  }, {
    key: "getCorrectedHeight",
    value: function getCorrectedHeight(widget) {
      var h = widget.h;
      this.heightProperties.forEach(function (key) {
        if (widget.style[key]) {
          h -= widget.style[key];
        }
      });
      return h + 'px';
    }
  }, {
    key: "getGridTracks",
    value: function getGridTracks(total, list) {
      if (list) {
        var max = Math.max.apply(Math, _toConsumableArray(list.map(function (i) {
          return i.l;
        })));
        return list.map(function (i) {
          if (i.fixed) {
            return i.l + 'px';
          }

          if (max === i.l) {
            return 'auto';
          }

          return Math.round(i.l * 100 / total) + '%';
        }).join(' ');
      }
    }
  }, {
    key: "getAbsolutePosition",
    value: function getAbsolutePosition(widget) {
      // console.debug('-', widget.name, widget.x, widget.props.resize)
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
      /**
       * To deal with margin collapsing we set things to inline-block. We could
       * still check for borders...
       */


      if (this.getSiblings(widget).length > 1) {
        result += '  display: inline-block;\n';
      }

      result += "  width: ".concat(w, "px;\n");
      result += "  height: ".concat(h).concat(unitY, ";\n");
      result += "  margin-top: ".concat(top).concat(unitY, ";\n");
      result += "  margin-left: ".concat(left).concat(unitX, ";\n");
      return result;
    }
  }, {
    key: "getRelativePosition",
    value: function getRelativePosition() {
      var result = '';

      if (!Util.isFixedHorizontal(widget)) {
        if (widget.parent) {
          if (Util.isPinnedLeft(widget) && Util.isPinnedRight(widget)) {
            // result += `  width: 100%;\n`
            result += "  margin-left: ".concat(left, "px;\n");
            result += "  margin-right: ".concat(widget.parent.w - (w + widget.x), "px;\n");
          } else {
            w = widget.w * 100 / widget.parent.w;
            result += "  width: ".concat(w, "%;\n");
            result += "  margin-left: ".concat(left).concat(unitX, ";\n");
          }
        }
      } else {
        console.debug(' normal', widget.name, w, widget.props.resize);
        result += "  width: ".concat(w, "px;\n");
        result += "  margin-left: ".concat(left).concat(unitX, ";\n");
      }
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
      var result = '';

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

      if (key === 'fontFamily') {
        result += this.escapeFontFamily(value);
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
    key: "escapeFontFamily",
    value: function escapeFontFamily(value) {
      return value.split(',').map(function (f) {
        if (f.indexOf(' ') >= 0) {
          return '"' + f + '"';
        }

        return f;
      }).join(', ');
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