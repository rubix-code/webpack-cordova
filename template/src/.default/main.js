{{#if_eq build "standalone"}}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
{{/if_eq}}
import Vue from 'vue'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{#alacarte}}
import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  transitions
} from 'vuetify'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import '../node_modules/vuetify/src/stylus/app.styl'
{{else}}
import Vuetify from 'vuetify'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import 'vuetify/dist/vuetify.css'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{/alacarte}}

import '@/modules/transitions/transitions.css'

import App from './App'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{#router}}
import router from './router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{/router}}

import directives from '@/modules/directives'


for (const i in directives) {
	if(directives.hasOwnProperty(i))
		Vue.directive(i,directives[i])
}

{{#alacarte}}
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    transitions
  }{{#theme}},
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }{{/theme}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{else}}
Vue.use(Vuetify{{#theme}}, { theme: {
  primary: '#ee44aa',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}}{{/theme}}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
{{/alacarte}}

Vue.config.productionTip = false{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

Vue.prototype.$app = require('./scripts').default{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  render: h => h(App),
  data: { router_loading: false }{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

router.beforeEach((to,from,next) => {
	app.router_loading = true{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
	next(){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

router.afterEach((to,from,next) => {
	setTimeout(() => app.router_loading = false, 300 ){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
	// next()
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}