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
    var grid = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, ModelTransformer);

    this.model = app;
    this.rowContainerID = 0;
    this.columnContainerID = 0;
    this.removeSingleLabels = true;
    this.isGrid = grid;
    this._cloneId = 0;
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
       * Embedd links
       */

      this.model = this.addActions(this.model);
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
         * If we do not do a responsive layout we have to add rows
         * and columns to make 'old school' layout.
         */

        if (!_this.isGrid) {
          /**
           * now check for every node in the tree if
           * we have a single row and add containers
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
        } else {
          /**
           * FIXME: add also rows. We still need to sort it somehow
           */
          screen = _this.addRows(screen);
          screen = _this.addRowContainer(screen);
          screen = _this.setOrderAndRelativePositons(screen, false);
          /**
           * FIXME: For some reaosn we clone somewhere the
           * parents and get weird result.
           */

          _this.fixParents(screen);

          screen = _this.addGrid(screen);
        }
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
    key: "fixParents",
    value: function fixParents(parent) {
      var _this2 = this;

      if (parent.children) {
        parent.children.forEach(function (c) {
          c.parent = parent;

          _this2.fixParents(c);
        });
      }
    }
  }, {
    key: "addGrid",
    value: function addGrid(screen) {
      this.addGridToElements(screen);
      return screen;
    }
  }, {
    key: "addGridToElements",
    value: function addGridToElements(parent) {
      var _this3 = this;

      var grid = this.computeGrid(parent);

      if (grid) {
        parent.grid = grid;

        if (parent.children && parent.children.length > 0) {
          parent.children.forEach(function (e) {
            e.gridColumnStart = 0;
            e.gridColumnEnd = grid.columns.length;
            e.gridRowStart = 0;
            e.gridRowEnd = grid.rows.length;
            grid.columns.forEach(function (c, i) {
              if (c.v === e.x) {
                e.gridColumnStart = i;
              }

              if (c.v === e.x + e.w) {
                e.gridColumnEnd = i;
              }
            });
            grid.rows.forEach(function (r, i) {
              if (r.v === e.y) {
                e.gridRowStart = i;
              }

              if (r.v === e.y + e.h) {
                e.gridRowEnd = i;
              }
            });
          });
        }
      }

      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(function (c) {
          _this3.addGridToElements(c);
        });
      }

      return parent;
    }
  }, {
    key: "computeGrid",
    value: function computeGrid(parent) {
      var _this4 = this;

      if (parent.children && parent.children.length > 0) {
        var rows = {};
        var columns = {};
        /**
         * Collect all the relevant lines. First the parent
         * then all the children
         */

        this.addGridColumns(columns, 0, parent, true);
        this.addGridColumns(columns, parent.w, parent, false);
        this.addGridRow(rows, 0, parent, true);
        this.addGridRow(rows, parent.h, parent, false);
        parent.children.forEach(function (c) {
          _this4.addGridColumns(columns, c.x, c, true);

          _this4.addGridColumns(columns, c.x + c.w, c, false);

          _this4.addGridRow(rows, c.y, c, true);

          _this4.addGridRow(rows, c.y + c.h, c, false);
        });
        /**
         * Set the width and convert objects to arrays
         */

        columns = this.setGridColumnWidth(columns, parent);
        rows = this.setGridRowHeight(rows, parent);
        /**
         * determine fixed columns and rows
         */

        this.setFixed(parent, columns, rows);
        return {
          rows: rows,
          columns: columns
        };
      }

      return null;
    }
  }, {
    key: "setFixed",
    value: function setFixed(parent, columns, rows) {
      /**
       * Set fixed. For ech child check if the 
       * 1) We have fixed Vertical or Horizontal
       * 2) If pinned. e.g. if pinned right, all
       *    columns < e.v must be fixed
       */
      parent.children.forEach(function (e) {
        if (Util.isFixedHorizontal(e)) {
          columns.forEach(function (column) {
            if (column.v >= e.x && column.v < e.x + e.w) {
              column.fixed = true;
            }
          });
        }

        if (Util.isPinnedLeft(e)) {
          columns.forEach(function (column) {
            if (column.v < e.x) {
              column.fixed = true;
            }
          });
        }

        if (Util.isPinnedRight(e)) {
          columns.forEach(function (column) {
            if (column.v >= e.x + e.w) {
              column.fixed = true;
            }
          });
        }

        if (Util.isFixedVertical(e)) {
          rows.forEach(function (row) {
            if (row.v >= e.y && row.v < e.y + e.h) {
              row.fixed = true;
            }
          });
        }

        if (Util.isPinnedUp(e)) {
          rows.forEach(function (row) {
            if (row.v < e.y) {
              row.fixed = true;
            }
          });
        }

        if (Util.isPinnedDown(e)) {
          rows.forEach(function (row) {
            if (row.v >= e.y + e.h) {
              row.fixed = true;
            }
          });
        }
      });
    }
  }, {
    key: "setGridColumnWidth",
    value: function setGridColumnWidth(columns, parent) {
      columns = Object.values(columns).sort(function (a, b) {
        return a.v - b.v;
      });
      columns.forEach(function (column, i) {
        if (columns[i + 1]) {
          column.l = columns[i + 1].v - column.v;
        } else {
          column.l = parent.w - column.v;
        }
      });
      return columns.filter(function (c) {
        return c.l > 0;
      });
    }
  }, {
    key: "setGridRowHeight",
    value: function setGridRowHeight(rows, parent) {
      rows = Object.values(rows).sort(function (a, b) {
        return a.v - b.v;
      });
      rows.forEach(function (row, i) {
        if (rows[i + 1]) {
          row.l = rows[i + 1].v - row.v;
        } else {
          row.l = parent.h - row.v;
        }
      });
      return rows.filter(function (r) {
        return r.l > 0;
      });
    }
  }, {
    key: "addGridColumns",
    value: function addGridColumns(columns, x, e, start) {
      if (!columns[x]) {
        columns[x] = {
          v: x,
          start: [],
          end: [],
          fixed: false
        };
      }

      if (start) {
        columns[x].start.push(e);
      } else {
        columns[x].end.push(e);
      }
    }
  }, {
    key: "addGridRow",
    value: function addGridRow(rows, y, e, start) {
      if (!rows[y]) {
        rows[y] = {
          v: y,
          start: [],
          end: [],
          fixed: false
        };
      }

      if (start) {
        rows[y].start.push(e);
      } else {
        rows[y].end.push(e);
      }
    }
  }, {
    key: "setOrderAndRelativePositons",
    value: function setOrderAndRelativePositons(parent, relative) {
      var _this5 = this;

      var nodes = parent.children;

      if (parent.type === 'row') {
        nodes.sort(function (a, b) {
          return a.x - b.x;
        });
        var last = 0;
        nodes.forEach(function (n, i) {
          var x = n.x - last;
          last = n.x + n.w;

          if (relative) {
            n.x = x;
            n.c = i;
          } else {
            n.left = x;
            n.c = i;
          }
        });
      } else {
        nodes.sort(function (a, b) {
          return a.y - b.y;
        });
        var _last = 0;
        nodes.forEach(function (n, i) {
          var y = n.y - _last;
          _last = n.y + n.h;

          if (relative) {
            n.y = y;
            n.r = i;
          } else {
            n.top = y;
          }
        });
      }

      nodes.forEach(function (n) {
        if (n.children && n.children.length > 0) {
          _this5.setOrderAndRelativePositons(n, relative);
        }
      });
      return parent;
    }
  }, {
    key: "addActions",
    value: function addActions(model) {
      Object.values(model.widgets).forEach(function (w) {
        var lines = Util.getLines(w, model, true);

        if (lines.length > 0) {
          w.lines = lines;
          lines.forEach(function (l) {
            var screen = model.screens[l.to];

            if (screen) {
              l.screen = screen;
            }
          });
        }
      });
      return model;
    }
  }, {
    key: "attachSingleLabels",
    value: function attachSingleLabels(model) {
      var _this6 = this;

      model.screens.forEach(function (screen) {
        screen.children.forEach(function (child) {
          _this6.attachSingleLabelsInNodes(child);
        });
      });
      return model;
    }
  }, {
    key: "attachSingleLabelsInNodes",
    value: function attachSingleLabelsInNodes(node) {
      var _this7 = this;

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
          _this7.attachSingleLabelsInNodes(child);
        });
      }
    }
  }, {
    key: "cleanUpContainer",
    value: function cleanUpContainer(parent) {
      var _this8 = this;

      var nodes = parent.children;
      nodes.forEach(function (node) {
        if (node.children.length === 1) {
          var child = node.children[0];

          if (_this8.isEqualBox(node, child)) {
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
          _this8.cleanUpContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "addColumnsContainer",
    value: function addColumnsContainer(parent) {
      var _this9 = this;

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
              id: 'c' + _this9.columnContainerID++,
              name: "Column ".concat(_this9.columnContainerID),
              children: children,
              x: boundingBox.x,
              y: boundingBox.y,
              h: boundingBox.h,
              w: boundingBox.w,
              type: 'column',
              parent: parent,
              style: {},
              props: {
                resize: {
                  right: false,
                  up: false,
                  left: false,
                  down: false,
                  fixedHorizontal: false,
                  fixedVertical: false
                }
              }
            };
            children.forEach(function (c) {
              c.x = c.x - container.x, c.y = c.y - container.y, c.parent = container;

              _this9.mergeInResponsive(container, c);
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
          _this9.addColumnsContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "mergeInResponsive",
    value: function mergeInResponsive(container, c) {
      container.props.resize.right = container.props.resize.right || Util.isPinnedRight(c);
      container.props.resize.left = container.props.resize.left || Util.isPinnedLeft(c);
      container.props.fixedHorizontal = container.props.fixedHorizontal || Util.isFixedHorizontal(c);
    }
  }, {
    key: "addColumns",
    value: function addColumns(parent) {
      var _this10 = this;

      var nodes = parent.children; // let rows = []

      var columnIDs = 0;
      nodes.forEach(function (a) {
        // console.debug(' addColumns()', a.name, ' @', parent.name)
        nodes.forEach(function (b) {
          if (a.id !== b.id) {
            if (Util.isOverLappingX(a, b) && a.parent) {
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
            _this10.addColumns(a);
          }
        });
      });
      return parent;
    }
  }, {
    key: "addRowContainer",
    value: function addRowContainer(parent) {
      var _this11 = this;

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

      var _loop3 = function _loop3(row) {
        var children = rows[row];
        var boundingBox = Util.getBoundingBoxByBoxes(children);
        var container = {
          id: 'r' + _this11.rowContainerID++,
          name: "Row ".concat(_this11.rowContainerID),
          children: children,
          x: boundingBox.x,
          y: boundingBox.y,
          h: boundingBox.h,
          w: boundingBox.w,
          type: 'row',
          parent: parent,
          style: {},
          props: {
            resize: {
              right: false,
              up: false,
              left: false,
              down: false,
              fixedHorizontal: false,
              fixedVertical: false
            }
          }
        };
        children.forEach(function (c) {
          c.x = c.x - container.x, c.y = c.y - container.y, c.parent = container;

          _this11.mergeInResponsive(container, c);
        });
        newChildren.push(container);
      };

      for (var row in rows) {
        _loop3(row);
      }

      parent.children = newChildren;
      /**
       * Go down recursive
       */

      nodes.forEach(function (a) {
        if (a.children && a.children.length > 0) {
          _this11.addRowContainer(a);
        }
      });
      return parent;
    }
  }, {
    key: "addRows",
    value: function addRows(parent) {
      var _this12 = this;

      var nodes = parent.children;
      nodes.sort(function (a, b) {
        return a.y - b.y;
      }); // let rows = []

      var rowIDs = 1;
      nodes.forEach(function (a) {
        // console.debug(' addRows()', a.name)
        nodes.forEach(function (b) {
          if (a.id !== b.id) {
            if (Util.isOverLappingY(a, b)) {
              /**
               * FIXME: We have here an issue of the elements in the row are overlapping
               */
              // console.debug('    addRows overlap', a.name, b.name, this.isTop(b, a), this.isBottom(b, a))

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
              } //console.debug('    addRows() > Same row', a.name, ' == ',b.name, ' >> ',  a.row, b.row)

            }
          }
          /**
           * no step down recursive
           */


          if (a.children && a.children.length > 0) {
            _this12.addRows(a);
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
      var _this13 = this;

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
        /**
         * FIXME: we should not clone here!
         */
        var element = _this13.clone(widget);

        element.children = [];
        delete element.has;
        /**
         * Check if the widget has a parent (= is contained) widget.
         * If so, calculate the relative position to the parent,
         * otherwise but the element under the screen.
         */

        var parentWidget = _this13.getParentWidget(parentWidgets, element);

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
      var clone = JSON.parse(JSON.stringify(obj));
      clone._id = this._cloneId++;
      return clone;
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