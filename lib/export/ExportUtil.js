"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileName = getFileName;
exports.isLastChild = isLastChild;
exports.isRowGrid = isRowGrid;
exports.isOverLappingX = isOverLappingX;
exports.isOverLappingY = isOverLappingY;
exports.isTop = isTop;
exports.isStartingTop = isStartingTop;
exports.isBottom = isBottom;
exports.isLeft = isLeft;
exports.isStartingLeft = isStartingLeft;
exports.isRight = isRight;
exports.isFixedHorizontal = isFixedHorizontal;
exports.isFixedVertical = isFixedVertical;
exports.isPinnedLeft = isPinnedLeft;
exports.isPinnedRight = isPinnedRight;
exports.isPinnedUp = isPinnedUp;
exports.isPinnedDown = isPinnedDown;
exports.getImages = getImages;
exports.getImageLocation = getImageLocation;
exports.removeCommonPath = removeCommonPath;
exports.getScreenCSS = getScreenCSS;
exports.getAllChildrenForScreen = getAllChildrenForScreen;
exports.fixAutos = fixAutos;
exports.getOrderedWidgets = getOrderedWidgets;
exports.sortChildren = sortChildren;
exports.sortWidgetList = sortWidgetList;
exports.getAllChildren = getAllChildren;
exports.isContainedInBox = isContainedInBox;
exports.getBoundingBoxByBoxes = getBoundingBoxByBoxes;
exports.createInheritedModel = createInheritedModel;
exports.createContaineredModel = createContaineredModel;
exports.addContainerChildrenToModel = addContainerChildrenToModel;
exports.mixin = mixin;
exports.mixinNotOverwriten = mixinNotOverwriten;
exports.clone = clone;
exports.getLines = getLines;

function getFileName(name) {
  return name.replace(/\s/g, '_');
}

function isLastChild(widget) {
  if (widget.parent) {
    var parent = widget.parent;
    var last = parent.children[parent.children.length - 1];
    return last.id === widget.id;
  }

  return false;
}

function isRowGrid(widget) {
  var hasOverlaps = false;

  if (widget) {
    var nodes = widget.children;
    nodes.forEach(function (a) {
      nodes.forEach(function (b) {
        if (a.id !== b.id) {
          if (isOverLappingY(a, b)) {
            hasOverlaps = true;
          }
        }
      });
    });
  }

  return !hasOverlaps;
}

function isOverLappingX(pos, box) {
  return !isLeft(pos, box) && !isRight(pos, box);
}

function isOverLappingY(pos, box) {
  return !isTop(pos, box) && !isBottom(pos, box);
}

function isTop(from, to) {
  return from.y > to.y + to.h;
}

function isStartingTop(from, to) {
  return from.y >= to.y; // && (from.y + from.h) <= (to.y + to.h);
}

function isBottom(from, to) {
  return from.y + from.h < to.y;
}

function isLeft(from, to) {
  return from.x > to.x + to.w;
}

function isStartingLeft(from, to) {
  return from.x >= to.x;
}

function isRight(from, to) {
  return from.x + from.w < to.x;
}

function isFixedHorizontal(e) {
  return e.props && e.props.resize && e.props.resize.fixedHorizontal;
}

function isFixedVertical(e) {
  return e.props && e.props.resize && e.props.resize.fixedVertical;
}

function isPinnedLeft(e) {
  return e.props && e.props.resize && e.props.resize.left;
}

function isPinnedRight(e) {
  return e.props && e.props.resize && e.props.resize.right;
}

function isPinnedUp(e) {
  return e.props && e.props.resize && e.props.resize.up;
}

function isPinnedDown(e) {
  return e.props && e.props.resize && e.props.resize.down;
}

function getImages(app) {
  var images = [];
  var urls = {};
  Object.values(app.widgets).forEach(function (w) {
    if (w.style && w.style.backgroundImage) {
      var backgroundImage = w.style.backgroundImage;
      var url = getImageLocation(w, backgroundImage.url);

      if (!urls[url]) {
        images.push({
          name: url,
          type: 'images',
          id: w.id,
          src: backgroundImage.url
        });
        urls[url] = true;
      }
    }
  });
  Object.values(app.screens).forEach(function (w) {
    if (w.style && w.style.backgroundImage) {
      var backgroundImage = w.style.backgroundImage;
      var url = getImageLocation(w, backgroundImage.url);

      if (!urls[url]) {
        images.push({
          name: url,
          type: 'images',
          id: w.id,
          src: backgroundImage.url
        });
        urls[url] = true;
      }
    }
  });
  return images;
}

function getImageLocation(w, url) {
  var parts = url.split('/');

  if (parts.length === 2) {
    return parts[1];
  }

  return url;
}

function removeCommonPath(a, b) {
  var path = [];
  var aParts = a.split('/');
  var bParts = b.split('/');
  var different = false;
  aParts.forEach(function (p, i) {
    if (p !== bParts[i] || different) {
      path.push(p);
      different = true;
    }
  });
  return path.join('/');
}
/**
 * Generates the css for a given screen. Includes the styles for the screen and all
 * its children. Certain elements, like common, might be excluded.
 *
 * @param {*} screen The screen to genearte for
 * @param {*} code The code object with the styles
 * @param {*} exclude An array of types to be exluded, e.g ['template']
 */


function getScreenCSS(screen, code, exclude) {
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
  var elements = getAllChildrenForScreen(screen);
  var written = [];
  elements.forEach(function (element) {
    var styles = code.styles[element.id];

    if (exclude) {
      styles = styles.filter(function (s) {
        return exclude.indexOf(s.type) < 0;
      });
    }

    styles.forEach(function (s) {
      if (!written[s.css]) {
        css += s.code + '\n';
        written[s.css] = true;
      }
    }); // css += styles.map(s => s.code).join('\n')
  });
  return css;
}

function getAllChildrenForScreen(screen) {
  var result = [];

  if (screen.model.children) {
    screen.model.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
    });
  }

  if (screen.model.fixedChildren) {
    screen.model.fixedChildren.forEach(function (child) {
      result.push(child);
    });
  }

  return result;
}

function fixAutos(style, widget) {
  if (style.fontSize === 'Auto') {
    style.fontSize = widget.h;
  }

  return style;
}
/**
 * FIX for old models without z-value
 */


function fixMissingZValue(box) {
  if (box.z === null || box.z === undefined) {
    box.z = 0;
  }
}
/**
 * Get children
 */


function getOrderedWidgets(widgets) {
  var result = [];

  for (var id in widgets) {
    var widget = widgets[id];

    if (widget) {
      fixMissingZValue(widget);
      result.push(widget);
    }
  }

  sortWidgetList(result);
  return result;
}
/**
 * Sort Screen children to render them in the correct order!
 *
 * Pass the children as parameter
 */


function sortChildren(children) {
  var result = [];

  for (var i = 0; i < children.length; i++) {
    var widgetID = children[i];
    var widget = this.model.widgets[widgetID];

    if (widget) {
      fixMissingZValue(widget);
      result.push(widget);
    }
  }

  sortWidgetList(result); //console.debug("sortChildren > ", result);

  return result;
}
/**
 * This method is super important for the correct rendering!
 *
 * We sort by:
 *
 *  1) style.fixed: fixed elements will be renderd last, therefore they come
 *  as the last elements in the list
 *
 * 	2) inherited : inherited values come first. They shall be rendered below the
 *  widget of the new screen
 *
 *  3) z : High z values come later
 *
 *  4) id: if the z value is the same, sort by id, which means the order the widgets have been
 *  added to the screen.
 */


function sortWidgetList(result) {
  /**
   * Inline function to determine if a widget is fixed.
   * we have to check if style exists, because the Toolbar.onToolWidgetLayer()
   * call the method without styles.
   */
  var isFixed = function isFixed(w) {
    if (w.style && w.style.fixed) {
      return true;
    }

    return false;
  };

  result.sort(function (a, b) {
    var aFix = isFixed(a);
    var bFix = isFixed(b);
    /**
     * 1) Sort by fixed. If both are fixed or not fixed,
     * continue sorting by inherited.
     */

    if (aFix == bFix) {
      /**
       * If both a inherited or not inherited,
       * continue sorting by z & id
       */
      if (a.inherited && b.inherited || !a.inherited && !b.inherited) {
        /**
         * 4) if the have the same z, sot by id
         */
        if (a.z == b.z && a.id && b.id) {
          return a.id.localeCompare(b.id);
        }
        /**
         * 3) Sort by z. Attention, Chrome
         * needs -1, 0, 1 or one. > does not work
         */


        return a.z - b.z;
      }

      if (a.inherited) {
        return -1;
      }

      return 1;
    }

    if (aFix) {
      return 1;
    }

    return -1;
  });
}

function getAllChildren(node, result) {
  if (node.children) {
    node.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
    });
  }
}

function isContainedInBox(obj, parent) {
  if (parent) {
    if (obj.x >= parent.x && obj.x + obj.w <= parent.w + parent.x && obj.y >= parent.y && obj.y + obj.h <= parent.y + parent.h) {
      return true;
    }
  }

  return false;
}

function getBoundingBoxByBoxes(boxes) {
  var result = {
    x: 100000000,
    y: 100000000,
    w: 0,
    h: 0
  };

  for (var i = 0; i < boxes.length; i++) {
    var box = boxes[i];
    result.x = Math.min(result.x, box.x);
    result.y = Math.min(result.y, box.y);
    result.w = Math.max(result.w, box.x + box.w);
    result.h = Math.max(result.h, box.y + box.h);
  }

  result.h -= result.y;
  result.w -= result.x;
  return result;
}

function getZoomed(v, zoom) {
  return Math.round(v * zoom);
}

function getUnZoomed(v, zoom) {
  return Math.round(v / zoom);
}

function getZoomedBox(box, zoomX, zoomY) {
  if (box.x) {
    box.x = this.getZoomed(box.x, zoomX);
  }

  if (box.y) {
    box.y = this.getZoomed(box.y, zoomY);
  }

  if (box.w) {
    box.w = this.getZoomed(box.w, zoomX);
  }

  if (box.h) {
    box.h = this.getZoomed(box.h, zoomY);
  }

  if (box.min) {
    box.min.h = this.getZoomed(box.min.h, zoomY);
    box.min.w = this.getZoomed(box.min.w, zoomX);
  }

  box.isZoomed = true;
  return box;
}

function createInheritedModel(model) {
  /**
   * Build lookup map for overwrites
   */
  var overwritenWidgets = {};

  for (var screenID in model.screens) {
    var screen = model.screens[screenID];
    overwritenWidgets[screenID] = {};

    for (var i = 0; i < screen.children.length; i++) {
      var widgetID = screen.children[i];
      var widget = model.widgets[widgetID];

      if (widget && widget.parentWidget) {
        overwritenWidgets[screenID][widget.parentWidget] = widgetID;
      }
    }
  }

  var inModel = clone(model);
  inModel.inherited = true;
  /**
   * add container widgets
   */

  createContaineredModel(inModel);
  /**
   * add widgets from parent (master) screens
   */

  for (var _screenID in inModel.screens) {
    /**
     * *ATTENTION* We read from the org model, otherwise we have
     * issues in the loop as we change the screen.
     */
    var _screen = model.screens[_screenID];

    if (_screen.parents && _screen.parents.length > 0) {
      /**
       * add widgets from parent screens
       */
      for (var _i = 0; _i < _screen.parents.length; _i++) {
        var parentID = _screen.parents[_i];

        if (parentID != _screenID) {
          if (model.screens[parentID]) {
            /**
             * *ATTENTION* We read from the org model, otherwise we have
             * issues in the loop as we change the screen!
             */
            var parentScreen = model.screens[parentID];
            var difX = parentScreen.x - _screen.x;
            var difY = parentScreen.y - _screen.y;
            var parentChildren = parentScreen.children;

            for (var j = 0; j < parentChildren.length; j++) {
              var parentWidgetID = parentChildren[j];
              /**
               * *ATTENTION* We read from the org model, otherwise we have
               * issues in the loop as we change the screen!
               */

              var parentWidget = model.widgets[parentWidgetID];

              if (parentWidget) {
                var overwritenWidgetID = overwritenWidgets[_screenID][parentWidgetID];

                if (!overwritenWidgetID) {
                  var copy = clone(parentWidget);
                  /**
                   * Super important the ID mapping!!
                   */

                  copy.id = parentWidget.id + "@" + _screenID;
                  copy.inherited = parentWidget.id;
                  copy.inheritedScreen = _screenID;
                  copy.inheritedOrder = _i + 1;
                  /**
                   * Now lets also put it at the right position!
                   */

                  copy.x -= difX;
                  copy.y -= difY;
                  /**
                   * We write the new widget to the inherited model!
                   *
                   */

                  inModel.widgets[copy.id] = copy;

                  inModel.screens[_screenID].children.push(copy.id);
                  /**
                   * Also add a to the inherited copies
                   * so we can to live updates in canvas
                   */


                  var parentCopy = inModel.widgets[parentWidget.id];

                  if (!parentCopy.copies) {
                    parentCopy.copies = [];
                  }

                  parentCopy.copies.push(copy.id);
                } else {
                  var overwritenWidget = inModel.widgets[overwritenWidgetID];

                  if (overwritenWidget) {
                    overwritenWidget.props = mixin(clone(parentWidget.props), overwritenWidget.props, true);
                    overwritenWidget.style = mixin(clone(parentWidget.style), overwritenWidget.style, true);

                    if (overwritenWidget.hover) {
                      overwritenWidget.hover = mixin(clone(parentWidget.hover), overwritenWidget.hover, true);
                    }

                    if (overwritenWidget.error) {
                      overwritenWidget.error = mixin(clone(parentWidget.error), overwritenWidget.error, true);
                    }
                    /**
                     * Also add a reference to the *INHERITED* copies
                     * so we can to live updates in canvas
                     */


                    var _parentCopy = inModel.widgets[parentWidget.id];

                    if (!_parentCopy.inheritedCopies) {
                      _parentCopy.inheritedCopies = [];
                    }

                    _parentCopy.inheritedCopies.push(overwritenWidget.id);
                    /**
                     * Also inherited positions
                     */


                    if (overwritenWidget.parentWidgetPos) {
                      overwritenWidget.x = parentWidget.x - difX;
                      overwritenWidget.y = parentWidget.y - difY;
                      overwritenWidget.w = parentWidget.w;
                      overwritenWidget.h = parentWidget.h;
                    }

                    overwritenWidget._inheried = true;
                  } else {
                    console.error("createInheritedModel() > No overwriten widget in model");
                  }
                }
              } else {
                console.warn("createInheritedModel() > no parent screen child with id > " + parentID + ">" + parentWidget);
              }
            }
          } else {
            console.warn("createInheritedModel() > Deteced Self inheritance...", _screen);
          }
        } else {
          console.warn("createInheritedModel() > no parent screen with id > " + parentID);
        }
      }
    }
  }

  return inModel;
}

function createContaineredModel(inModel) {
  for (var screenID in inModel.screens) {
    var screen = inModel.screens[screenID];

    for (var i = 0; i < screen.children.length; i++) {
      var widgetID = screen.children[i];
      var widget = inModel.widgets[widgetID];

      if (widget) {
        if (widget.isContainer) {
          var children = getContainedChildWidgets(widget, inModel);
          widget.children = children.map(function (w) {
            return w.id;
          });
        }
      } else {
        /**
         * FIXME: This can happen for screen copies...
         */
        // console.warn('Core.createContaineredModel() > cannot find widgte', widgetID)
      }
    }
  }
}

function getContainedChildWidgets(container, model) {
  var result = [];
  /*
   * Loop over sorted list
   */

  var sortedWidgets = getOrderedWidgets(model.widgets);
  var found = false;

  for (var i = 0; i < sortedWidgets.length; i++) {
    var widget = sortedWidgets[i];

    if (container.id != widget.id) {
      if (found && isContainedInBox(widget, container)) {
        widget.container = container.id;
        result.push(widget);
      }
    } else {
      found = true;
    }
  }

  return result;
}

function addContainerChildrenToModel(model) {
  /**
   * Add here some function to add the virtual children, so that stuff
   * works also in the analytic canvas. This would mean we would have to
   * copy all the code from the Repeater to here...
   */
  return model;
}

function mixin(a, b, keepTrack) {
  if (a && b) {
    b = lang.clone(b);

    if (keepTrack) {
      b._mixed = {};
    }

    for (var k in a) {
      if (b[k] === undefined || b[k] === null) {
        b[k] = a[k];

        if (keepTrack) {
          b._mixed[k] = true;
        }
      }
    }
  }

  return b;
}

function mixinNotOverwriten(a, b) {
  if (a && b) {
    var mixed = {};

    if (b._mixed) {
      mixed = b._mixed;
    } //console.debug("mixinNotOverwriten", overwriten)


    for (var k in a) {
      if (b[k] === undefined || b[k] === null || mixed[k]) {
        b[k] = a[k];
      }
    }
  }

  return b;
}

function clone(obj) {
  if (!obj) {
    return null;
  }

  var _s = JSON.stringify(obj);

  return JSON.parse(_s);
}

function getLines(widget, model, deep) {
  var result = [];

  if (widget.inherited && model.widgets[widget.inherited]) {
    widget = model.widgets[widget.inherited];
  }

  var widgetID = widget.id;
  var lines = getFromLines(widget, model);

  if (lines && lines.length > 0) {
    return lines;
  }

  var group = getParentGroup(widgetID, model);

  if (group) {
    var groupLine = getFromLines(group, model);

    if (groupLine && groupLine.length > 0) {
      return groupLine;
    }
  }

  return result;
}

function getFromLines(box, model) {
  var result = [];

  for (var id in model.lines) {
    var line = model.lines[id];

    if (line.from == box.id) {
      result.push(line);
    }
  }

  return result;
}

function getParentGroup(widgetID, model) {
  if (model.groups) {
    for (var id in model.groups) {
      var group = model.groups[id];
      var i = group.children.indexOf(widgetID);

      if (i > -1) {
        return group;
      }
    }
  }

  return null;
}