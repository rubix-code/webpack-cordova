<template>
	<v-app dark>
		<transition name="slide-y-transition">
			<div class="z-1 elevation-3">
				<v-toolbar>
					<v-spacer></v-spacer>
					<label style="font-size:x-large;padding:5px;">App</label>
					<v-spacer></v-spacer>
				</v-toolbar>
			</div>
		</transition>
		<main >
			<transition name="slide-x-transition">
				<v-dialog v-if="false" :value="$root.router_loading" fullscreen transition="fadeIn" :overlay="false" >
						<v-card>
							<v-container fill-height>
								<v-layout> 
								Loading ...
								</v-layout>
							</v-container>
						</v-card>
				</v-dialog>
			</transition>
			<transition name="slide-x-transition">
				<router-view></router-view>
			</transition>
		</main>
	</v-app>
</template>

<script>
	export default {
		data: () => ({}),
		created () {
			var self = this
			if(this.cordova)
			this.cordova.on('deviceready', () => {
				self.onDeviceReady()
			})
		},
		methods: {
			onDeviceReady: function () {
				// Handle the device ready event.
				this.cordova.on('pause', this.onPause, false)
				this.cordova.on('resume', this.onResume, false)
				if (this.cordova.device.platform === 'Android') {
					document.addEventListener('backbutton', this.onBackKeyDown, false)
				}
			},
			onPause () {
				// Handle the pause lifecycle event.
				console.log('pause')
			},
			onResume () {
				// Handle the resume lifecycle event.
				// SetTimeout required for iOS.
				setTimeout(function () {
					console.log('resume')
				}, 0)
			},
			onBackKeyDown () {
				// Handle the back-button event on Android. By default it will exit the app.
				navigator.app.exitApp()
			}
		}
	}
</script>