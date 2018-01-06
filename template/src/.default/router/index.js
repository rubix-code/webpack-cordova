import Vue from 'vue'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import Router from 'vue-router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import pages from './pages'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

import E404 from '@/pages/errors/404'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

Vue.use(Router){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

pages.push({
	path:'*',
	component: E404{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

// mode 'history' will not work because cordova serves only static files
// file:/// api in browsers does not support history.push
// use hash for route resolution
export default new Router({
	routes: pages{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
