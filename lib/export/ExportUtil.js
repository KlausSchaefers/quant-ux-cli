"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllChildrenForScreen = getAllChildrenForScreen;
exports.fixAutos = fixAutos;

function getAllChildrenForScreen(screen) {
  var result = [];

  if (screen.model.children) {
    screen.model.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
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

function getAllChildren(node, result) {
  if (node.children) {
    node.children.forEach(function (child) {
      result.push(child);
      getAllChildren(child, result);
    });
  }
}