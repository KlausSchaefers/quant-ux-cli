import * as Util from '../ExportUtil'

export default class RouterFactory {

    run (files, conf, app) {
        let folder = Util.removeCommonPath(conf.targets.vue, conf.targets.vueRouter)
        
        let routes = []

        /**
         * Add start screen as root
         */
        files.forEach(f => {
            if (f.type === 'vue' && app.screens[f.id] && app.screens[f.id].props.start === true) {
                routes.push(
`   {
        path: '/',
        name: '${f.screenName}',
        component: () => import(/* webpackChunkName: "${f.name}" */ './${folder}/${f.name}')
    }`)   
            }
        })

        files.forEach(f => {
            if (f.type === 'vue') {
                // console.debug('', f)
                routes.push(
`   {
        path: '/${f.screenName}.html',
        name: '${f.screenName}',
        component: () => import(/* webpackChunkName: "${f.name}" */ './${folder}/${f.name}')
    }`)        
            }
        })



        let body = routes.join(',')
        let content =
`
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    ${body}
  ]
})
`
        let routerName = conf.vue.routerName ? conf.vue.routerName :  'router.js'
        files.push({            
            name: routerName,
            type: 'router',
            content: content            
        })
        return files
    }

}