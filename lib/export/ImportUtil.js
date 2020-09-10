"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ImportUtil = /*#__PURE__*/function () {
  function ImportUtil() {
    _classCallCheck(this, ImportUtil);
  }

  _createClass(ImportUtil, [{
    key: "get",
    value: function get(current, from) {
      var back = [];
      var forward = [];
      var currentParts = current.split('/');
      var fromParts = from.split('/');
      var notEqual = false;

      for (var i = 0; i < currentParts.length; i++) {
        var c = currentParts[i];
        var f = fromParts[i];

        if (c !== f) {
          notEqual = true;
        }

        if (notEqual) {
          back.push('..');

          if (f) {
            forward.push(f);
          }
        }
      }

      return back.join('/') + '/' + forward.join('/');
    }
  }]);

  return ImportUtil;
}();

var _default = new ImportUtil();

exports["default"] = _default;