<template>
	<div>
		Hello world
		<router-link :to="{name:'Hello'}">Link</router-link>
	</div>
</template>

<script>
	export default {
		name: 'index',
		route: {
			name: 'Index',
			path: '/',
		},
		data: () => ({}){{#if_eq lintConfig "airbnb"}},{{/if_eq}}
	}{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
</script>