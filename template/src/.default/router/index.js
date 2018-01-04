import Vue from 'vue'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import Router from 'vue-router'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
import pages from './pages'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

import E404 from '@/pages/errors/404'{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

Vue.use(Router){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

pages.push({
	path:'*',
	component: E404{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

export default new Router({
	mode: 'history',
	routes: pages{{#if_eq lintConfig "airbnb"}},{{/if_eq}}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
