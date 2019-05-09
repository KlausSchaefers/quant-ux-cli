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

/**
 * This class transforms an absolute quant-ux model into an
 * kind of HTML model, where the elements have a real parent
 * child relation child
 */
var ModelTransformer =
/*#__PURE__*/
function () {
  function ModelTransformer(app) {
    _classCallCheck(this, ModelTransformer);

    this.model = app;
    this.rowContainerID = 0;
    this.columnContainerID = 0;
    this.removeSingleLabels = true;
    this.textProperties = ['color', 'textDecoration', 'textAlign', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight'];
  }

  _createClass(ModelTransformer, [{
    key: "transform",
    value: function transform() {
      var _this = this;

      var relative = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var result = {
        id: this.model.id,
        name: this.model.name,
        templates: this.model.templates ? Object.values(this.model.templates) : [],
        warnings: [],
        screens: []
        /**
         * Before we start, we create an inherited model!
         */

      };
      this.model = Util.createInheritedModel(this.model);
      /**
       * FIXME: We should fix doubles names. With mastre screens
       * we could have overwites! We could rename them, but this
       * would have to be consistant in all screens!
       */

      var _loop = function _loop(screenID) {
        var screen = _this.model.screens[screenID];
        var children = screen.children;
        var names = children.map(function (c) {
          return _this.model.widgets[c].name;
        });
        var count = {};
        names.forEach(function (n) {
          if (count[n]) {
            result.warnings.push("Dubplicate name of element '".concat(n, "' in screen '").concat(screen.name, "'"));
          }

          count[n] = true;
        });
      };

      for (var screenID in this.model.screens) {
        _loop(screenID);
      }

      var _loop2 = function _loop2(screenID) {
        var screen = _this.model.screens[screenID];
        /**
         * First we build a hirachical parent child relation.
         */

        screen = _this.transformScreenToTree(screen);
        /**
         * now check for every node in the tree if
         * we have a single row and add cobtainers
         */

        screen = _this.addRows(screen);
        screen = _this.addRowContainer(screen);
        /**
         * now check in every containering box (parent != null)
         * if we have columns. If so, add also a container
         */

        screen = _this.addColumns(screen);
        screen = _this.addColumnsContainer(screen);
        /**
         * cleanup single containers. It can happen
         * that a row gets one column...
         */

        screen = _this.cleanUpContainer(screen);
        /**
         * Order elements and set relative positions
         */

        screen = _this.setOrderAndRelativePositons(screen, relative);
        /**
         * set screen pos to 0,0
         */

        screen.children.forEach(function (c) {
          c.parent = screen;
        });
        screen.x = 0;
        screen.y = 0;
        result.screens.push(screen);
      };

      for (var screenID in this.model.screens) {
        _loop2(screenID);
      }

      if (this.removeSingleLabels) {
        this.attachSingleLabels(result);
      }
      /**
       * If we have warnings, lets print them
       */


      result.warnings.forEach(function (w) {
        console.warn(w);
      });
      return result;
    }
  }, {
    key: "setOrderAndRelativePositons",
    value: function setOrderAndRelativePositons(parent, relative) {
      var _this2 = this;

      var nodes = parent.children;

      if (parent.type === 'row') {
        nodes.sort(function (a, b) {
          return a.x - b.x;
        });

        if (relative) {
          var last = 0;
          nodes.forEach(function (n, i) {
            var x = n.x - last;
            last = n.x + n.w;
            n.x = x;
            n.c = i;
          });
        }
      } else {
        nodes.sort(function (a, b) {
          return a.y - b.y;
        });

        if (relative) {
          var _last = 0;
          nodes.forEach(function (n, i) {
            var y = n.y - _last;
            _last = n.y + n.h;
            n.y = y;
            n.r = i;
          });
        }
      }

      nodes.forEach(function (n) {
        if (n.children && n.children.length > 0) {
          _this2.setOrderAndRelativePositons(n, relative);
        }
      });
      return parent;
    }
  }, {
    key: "attachSingleLabels",
    value: function attachSingleLabels(model) {
      var _this3 = this;

      model.screens.forEach(function (screen) {
        screen.children.forEach(function (child) {
          _this3.attachSingleLabelsInNodes(child);
        });
      });
      return model;
    }
  }, {
    key: "attachSingleLabelsInNodes",
    value: function attachSingleLabelsInNodes(node) {
      var _this4 = this;

      /**
       * If we have a box that has NO label props and contains
       * only one child of type label, we merge this in.
       */
      if (!node.props.label && node.children.length === 1) {
        var child = node.children[0];

        if (child.type === 'Label') {
          node.props.label = child.props.label;
          node.children = [];
          this.textProperties.forEach(function (key) {
            if (child.style[key]) {
              node.style[key] = child.style[key];
            }
          });
          node.style.paddingTop = child.y;
          node.style.paddingLeft = child.x;
          node.style = Util.fixAutos(node.style, child);
        }
      } else {
        node.children.forEach(function (child) {
          _this4.attachSingleLabelsInNodes(child);
        });
      }
    }
  }, {
    key: "cleanUpContainer",
    value: function cleanUpContainer(parent) {
      var _this5 = this;

      var nodes = parent.children;
      nodes.forEach(function (node) {
        if (node.children.length === 1) {
          var child = node.children[0];

          if (_this5.isEqualBox(node, child)) {
            node.children = child.children;
            node.children.forEach(function (c) {
              c.parent = node;
            });
          }
        }
      });
      /**
       * Go down recursive
       */

      nodes.forEach(function (a) {
        if (a.children && a.children.length > 0) {
          _this5.cleanUpContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "addColumnsContainer",
    value: function addColumnsContainer(parent) {
      var _this6 = this;

      var nodes = parent.children;
      var newChildren = [];
      var columns = {};
      nodes.forEach(function (a) {
        if (a.column) {
          if (!columns[a.column]) {
            columns[a.column] = [];
          }

          columns[a.column].push(a);
        } else {
          newChildren.push(a);
        }
      });
      /**
       * For each row create a container and reposition the children
       */

      for (var column in columns) {
        var children = columns[column];
        var hasParent = children.reduce(function (a, b) {
          return b.parent != null & a;
        }, true);

        if (hasParent) {
          (function () {
            var boundingBox = Util.getBoundingBoxByBoxes(children);
            var container = {
              id: 'c' + _this6.columnContainerID++,
              name: "Column ".concat(_this6.columnContainerID),
              children: children,
              x: boundingBox.x,
              y: boundingBox.y,
              h: boundingBox.h,
              w: boundingBox.w,
              type: 'column',
              parent: parent,
              style: {},
              props: {}
            };
            children.forEach(function (c) {
              c.x = c.x - container.x, c.y = c.y - container.y, c.parent = container;
            });
            newChildren.push(container);
          })();
        } else {
          newChildren = children.concat(newChildren);
        }
      }

      parent.children = newChildren;
      /**
       * Go down recursive
       */

      nodes.forEach(function (a) {
        if (a.children && a.children.length > 0) {
          _this6.addColumnsContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "addColumns",
    value: function addColumns(parent) {
      var _this7 = this;

      var nodes = parent.children; // let rows = []

      var columnIDs = 0;
      nodes.forEach(function (a) {
        nodes.forEach(function (b) {
          if (a.id !== b.id) {
            if (_this7.isOverLappingX(a, b) && a.parent) {
              // console.debug('  same row', a.name, b.name)

              /**
               * If we have now row, create a new id for a
               */
              if (!a.column) {
                a.column = columnIDs++;
              }
              /**
               * If b has no row, we put it in the same row as
               * a
               */


              if (!b.column) {
                b.column = a.column;
              } else {
                var oldId = b.column;
                var newId = a.column;
                /**
                 * if b has already a row, we merge row a & b
                 */

                nodes.forEach(function (c) {
                  if (c.column === oldId) {
                    c.column = newId;
                  }
                });
              }
            }
          }
          /**
           * no step down recursive
           */


          if (a.children && a.children.length > 0) {
            _this7.addColumns(a);
          }
        });
      });
      return parent;
    }
  }, {
    key: "addRowContainer",
    value: function addRowContainer(parent) {
      var _this8 = this;

      var nodes = parent.children;
      var newChildren = [];
      var rows = {};
      nodes.forEach(function (a) {
        if (a.row) {
          if (!rows[a.row]) {
            rows[a.row] = [];
          }

          rows[a.row].push(a);
        } else {
          newChildren.push(a);
        }
      });
      /**
       * For each row create a container and reposition the children
       */

      for (var row in rows) {
        var children = rows[row];
        var hasNoParent = children.reduce(function (a, b) {
          return b.parent === null & a;
        }, true);

        if (hasNoParent) {
          (function () {
            var boundingBox = Util.getBoundingBoxByBoxes(children);
            var container = {
              id: 'r' + _this8.rowContainerID++,
              name: "Row ".concat(_this8.rowContainerID),
              children: children,
              x: boundingBox.x,
              y: boundingBox.y,
              h: boundingBox.h,
              w: boundingBox.w,
              type: 'row',
              style: {},
              props: {}
            };
            children.forEach(function (c) {
              c.x = c.x - container.x, c.y = c.y - container.y, c.parent = container;
            });
            newChildren.push(container);
          })();
        } else {
          newChildren = children.concat(newChildren);
        }
      }

      parent.children = newChildren;
      /**
       * Go down recursive
       */

      nodes.forEach(function (a) {
        if (a.children && a.children.length > 0) {
          _this8.addRowContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "addRows",
    value: function addRows(parent) {
      var _this9 = this;

      var nodes = parent.children; // let rows = []

      var rowIDs = 0;
      nodes.forEach(function (a) {
        nodes.forEach(function (b) {
          if (a.id !== b.id) {
            if (_this9.isOverLappingY(a, b)) {
              // console.debug('  same row', a.name, b.name)

              /**
               * If we have now row, create a new id for a
               */
              if (!a.row) {
                a.row = rowIDs++;
              }
              /**
               * If b has no row, we put it in the same row as
               * a
               */


              if (!b.row) {
                b.row = a.row;
              } else {
                var oldId = b.row;
                var newId = a.row;
                /**
                 * if b has already a row, we merge row a & b
                 */

                nodes.forEach(function (c) {
                  if (c.row === oldId) {
                    c.row = newId;
                  }
                });
              }
            }
          }
          /**
           * no step down recursive
           */


          if (a.children && a.children.length > 0) {
            _this9.addRows(a);
          }
        });
      });
      return parent;
    }
    /**
     * Transforms and screen into a hiearchical presentation. return the root node.
     * @param {MATCScreen} screen
     */

  }, {
    key: "transformScreenToTree",
    value: function transformScreenToTree(screen) {
      var _this10 = this;

      var result = this.clone(screen);
      delete result.children;
      delete result.has;
      result.children = [];
      /**
       * Get widget in render order. This is important to derive the
       * parent child relations.
       */

      var widgets = Util.getOrderedWidgets(this.getWidgets(screen));
      /**
       *  now build child parent relations
       */

      var parentWidgets = [];
      var elementsById = {};
      widgets.forEach(function (widget) {
        var element = _this10.clone(widget);

        element.children = [];
        delete element.has;
        /**
         * Check if the widget has a parent (= is contained) widget.
         * If so, calculate the relative position to the parent,
         * otherwise but the element under the screen.
         */

        var parentWidget = _this10.getParentWidget(parentWidgets, element);

        if (parentWidget) {
          element.x = widget.x - parentWidget.x;
          element.y = widget.y - parentWidget.y;
          element.parent = parentWidget;
          elementsById[parentWidget.id].children.push(element);
        } else {
          element.x = widget.x - screen.x;
          element.y = widget.y - screen.y;
          element.parent = null;
          result.children.push(element);
        }
        /**
         * Save the widget, so we can check in the next
         * iteation if this is a parent or not!
         */


        parentWidgets.unshift(widget);
        elementsById[element.id] = element;
      });
      return result;
    }
  }, {
    key: "getParentWidget",
    value: function getParentWidget(potentialParents, element) {
      for (var p = 0; p < potentialParents.length; p++) {
        var parent = potentialParents[p];

        if (Util.isContainedInBox(element, parent)) {
          return parent;
        }
      }
    }
  }, {
    key: "getWidgets",
    value: function getWidgets(screen) {
      var widgets = [];

      for (var i = 0; i < screen.children.length; i++) {
        var id = screen.children[i];
        var widget = this.model.widgets[id];
        widgets.push(widget);
      }

      return widgets;
    }
  }, {
    key: "clone",
    value: function clone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  }, {
    key: "isOverLappingX",
    value: function isOverLappingX(pos, box) {
      return !this.isLeft(pos, box) && !this.isRight(pos, box);
    }
  }, {
    key: "isOverLappingY",
    value: function isOverLappingY(pos, box) {
      return !this.isTop(pos, box) && !this.isBottom(pos, box);
    }
  }, {
    key: "isTop",
    value: function isTop(from, to) {
      return from.y > to.y + to.h;
    }
  }, {
    key: "isStartingTop",
    value: function isStartingTop(from, to) {
      return from.y >= to.y; // && (from.y + from.h) <= (to.y + to.h);
    }
  }, {
    key: "isBottom",
    value: function isBottom(from, to) {
      return from.y + from.h < to.y;
    }
  }, {
    key: "isLeft",
    value: function isLeft(from, to) {
      return from.x > to.x + to.w;
    }
  }, {
    key: "isStartingLeft",
    value: function isStartingLeft(from, to) {
      return from.x >= to.x;
    }
  }, {
    key: "isRight",
    value: function isRight(from, to) {
      return from.x + from.w < to.x;
    }
  }, {
    key: "isEqualBox",
    value: function isEqualBox(parent, child) {
      return child.x === 0 && child.y === 0 && parent.w === child.w && parent.h === child.h;
    }
  }]);

  return ModelTransformer;
}();

exports["default"] = ModelTransformer;