'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
var webpackConfig = require('./webpack.app.conf')
const cmd = require('node-run-cmd')
const mv = require('mv')
const fs = require('fs')

const spinner = ora('building ' + chalk.inverse.blue(config.build.appName + '.apk') + ' for production...\n' + chalk.cyan('building distribution...'))
spinner.start()

config.build.assetsRoot = path.resolve(__dirname, '../www')
webpackConfig.output.path = path.resolve(__dirname, '../www')

var output_dir = path.resolve(__dirname, '../dist/')

const cordova = {
	build: () => {
		cmd.run([`cordova build --release --keystore='app.keystore' ${process.env.OS || 'android'}`], {
			onData: data => console.log(data),
			onDone: e => {
				var sourceDir = path.resolve(__dirname, '../platforms/android/build/outputs/apk/')
				var source = null
				var appName = config.build.appName
				if (fs.existsSync(path.resolve(sourceDir, './android-release.apk')))
					source = path.resolve(sourceDir, './android-release.apk')
				else if (fs.existsSync(path.resolve(sourceDir, './android-release-unsigned.apk'))) {
					source = path.resolve(sourceDir, './android-release-unsigned.apk')
					appName = appName + '-unsigned'
				}
				else {
					console.log(chalk.yellow('Something went wrong!\n Please manually use the app \n ' + sourceDir))
					process.exit()
				}

				var dest = output_dir + '/' + appName + '.apk'
				mv(source, dest, { mkdirp: true }, e => {
					console.log(dest)
					if (e) console.log(chalk.red(e))
					else console.log(chalk.inverse.green('DONE!') + chalk.green(` built ${config.build.appName}.apk \n Located at: ${output_dir} `))
				})
			}
		})
	}
}

spinner.stop()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
	if (err) throw err
	webpack(webpackConfig, function (err, stats) {
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n\n')

		if (stats.hasErrors()) {
			console.log(chalk.red('  Build failed with errors.\n'))
			process.exit(1)
		}

		console.log(chalk.green('  Build complete.\n Take it away cordova!'))

		cordova.build()
	})
})
