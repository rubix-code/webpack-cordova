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
		data: () => ({})
	}
</script>