"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Util = _interopRequireWildcard(require("../ExportUtil"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RouterFactory =
/*#__PURE__*/
function () {
  function RouterFactory() {
    _classCallCheck(this, RouterFactory);
  }

  _createClass(RouterFactory, [{
    key: "run",
    value: function run(files, conf, app) {
      var folder = Util.removeCommonPath(conf.targets.vue, conf.targets.vueRouter);
      var routes = [];
      /**
       * Add start screen as root
       */

      files.forEach(function (f) {
        if (f.type === 'vue' && app.screens[f.id] && app.screens[f.id].props.start === true) {
          routes.push("   {\n        path: '/',\n        name: '".concat(f.screenName, "',\n        component: () => import(/* webpackChunkName: \"").concat(f.name, "\" */ './").concat(folder, "/").concat(f.name, "')\n    }"));
        }
      });
      files.forEach(function (f) {
        if (f.type === 'vue') {
          // console.debug('', f)
          routes.push("   {\n        path: '/".concat(f.screenName, ".html',\n        name: '").concat(f.screenName, "',\n        component: () => import(/* webpackChunkName: \"").concat(f.name, "\" */ './").concat(folder, "/").concat(f.name, "')\n    }"));
        }
      });
      var body = routes.join(',');
      var content = "\nimport Vue from 'vue'\nimport Router from 'vue-router'\n\nVue.use(Router)\n\nexport default new Router({\n  routes: [\n    ".concat(body, "\n  ]\n})\n");
      var routerName = conf.vue.routerName ? conf.vue.routerName : 'router.js';
      files.push({
        name: routerName,
        type: 'router',
        content: content
      });
      return files;
    }
  }]);

  return RouterFactory;
}();

exports["default"] = RouterFactory;