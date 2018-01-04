const files = require.context('.', false, /\.js$/){{#if_eq lintConfig "airbnb"}};{{/if_eq}}
const modules = {}{{#if_eq lintConfig "airbnb"}};{{/if_eq}}

files.keys().forEach(key => {
	if (key === './index.js') return{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
	if (files(key).default.name && files(key).default.module) {
		modules[files(key).default.name] = files(key).default.module{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
	}
}){{#if_eq lintConfig "airbnb"}};{{/if_eq}}

export default modules{{#if_eq lintConfig "airbnb"}};{{/if_eq}}