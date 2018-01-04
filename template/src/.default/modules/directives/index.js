const directives = {
	'click-outside': {
		priority: 700,
		bind() {
			let self = this
			this.event = function (event) {
			self.vm.$emit(self.expression, event)
			}
			this.el.addEventListener('click', this.stopProp)
			document.body.addEventListener('click', this.event)
		},

		unbind() {
			this.el.removeEventListener('click', this.stopProp)
			document.body.removeEventListener('click', this.event)
		},
		stopProp(event) {
			event.stopPropagation()
		}
	},
	'click-outside': {
		bind: function (el, binding, vNode) {
			// Provided expression must evaluate to a function.
			if (typeof binding.value !== 'function') {
				const compName = vNode.context.name
				let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
				if (compName) {
					warn += `Found in component '${compName}'`
				}

				console.warn(warn)
			}
			// Define Handler and cache it on the element
			const bubble = binding.modifiers.bubble
			const handler = (e) => {
				if (bubble || (!el.contains(e.target) && el !== e.target)) {
					binding.value(e)
				}
			}
			el.__vueClickOutside__ = handler

			// add Event Listeners
			document.addEventListener('click', handler)
			},

			unbind: function (el, binding) {
			// Remove Event Listeners
			document.removeEventListener('click', el.__vueClickOutside__)
			el.__vueClickOutside__ = null
		}
	}
}


export default directives