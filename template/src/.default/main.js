import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
import VueCordova from 'vue-cordova'
import VueHead from 'vue-head'

import '@/modules/transitions/transitions.css'

import App from './App'
import router from './router'

import directives from '@/modules/directives'


for (const i in directives) {
	if(directives.hasOwnProperty(i))
		Vue.directive(i,directives[i])
}

Vue.use(Vuetify)
Vue.use(VueCordova)
Vue.use(VueHead)
// add cordova.js only if serving the app through file://
if (window.location.protocol === 'file:' || window.location.port === '3000') {
	var cordovaScript = document.createElement('script')
	cordovaScript.setAttribute('type', 'text/javascript')
	cordovaScript.setAttribute('src', 'cordova.js')
	document.body.appendChild(cordovaScript)
}

Vue.config.productionTip = false

Vue.prototype.$app = require('./scripts').default

/* eslint-disable no-new */
const app = new Vue({
	el: '#app',
	router,
	render: h => h(App),
	head: {
		meta: [
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
			}
		]
	},
	data: { router_loading: false }
})

router.beforeEach((to,from,next) => {
	app.router_loading = true
	next()
})

router.afterEach((to,from,next) => {
	setTimeout(() => app.router_loading = false, 300 )
	// next()
})