const files = require.context('@/pages/', false, /\.vue$/){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
const pages = []{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

files.keys().forEach(key => {
	if(files(key).default.route && files(key).default.route.name && files(key).default.route.path ){
		pages.push({
			...files(key).default.route,
			props: true,
			component:files(key){{#if_eq lintConfig "airbnb"}},{{/if_eq}}
		}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
	}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

export default pages{{#if_eq lintConfig "airbnb"}};{{/if_eq}}