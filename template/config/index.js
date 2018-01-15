// see http://vuejs-templates.github.io/webpack for documentation.
const args = require('minimist')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs-extra')
const deasync = require('deasync')
const App = require('./app.env')
const cmd = require('inquirer')

const apps = App.appList
const distSrc = path.resolve(__dirname, '../dist')

console.clear()
// Select App
// De Async so that it waits for input
var current = deasync(
	// async function
	async (callback = () => { }) => {
		var questions = [
			{
				message: 'Select App',
				name: 'appName',
				type: 'list',
				choices: Object.values(apps)
			}
		]

		// check if cordova is initialized
		if (!fs.existsSync(path.resolve(__dirname, '../cordova'))){
			console.log(
				chalk.red('Please run the following command to proceed\n') +
				'\t npm run cordova -- --init'
			)
			process.exit(1)
		}

		// check if build.json exists
		if (!fs.existsSync(path.resolve(__dirname, '../cordova/build.json'))) {
			if (!fs.existsSync(path.resolve(__dirname, '../build.json'))) {
				console.log(chalk.red('Please Run the following command to proceed\n'))
				console.log('\t node config/.keystore.js')
				process.exit(1)
			}
			try {
				fs.copySync(path.resolve(__dirname, '../build.json'), path.resolve(__dirname, '../cordova/build.json'))
			} catch (error) {
				console.log(
					chalk.bgRed(' ERROR ') +
					error
				)
				process.exit(1)
			}
		}

		const keystore = require('../build.json').android.release.keystore
		// check if keystore exists
		if (!fs.existsSync(path.resolve(__dirname, '../cordova/' + keystore))) {
			if (!fs.existsSync(path.resolve(__dirname, '../' + keystore))) {
				console.log(chalk.red('Please Run the following command to proceed\n'))
				console.log('\t node config/.keystore.js')
				process.exit(1)
			}
			try {
				fs.copySync(path.resolve(__dirname, '../' + keystore), path.resolve(__dirname, '../cordova/' + keystore))
			} catch (error) {
				console.log(
					chalk.bgRed(' ERROR ') +
					error
				)
				process.exit(1)
			}
		}
		// get App to configure to
		var answers = await cmd.prompt(questions)
		answers['appRoot'] = Object.keys(apps).find(i => apps[i] === answers['appName'])

		callback(false, answers)
	}
)()

var appRoot, appName

if (process.env.App) {
	appRoot = (process.env.APP || '.default')
	appName = apps[appRoot] || 'System Default'
} else {
	appRoot = current.appRoot
	appName = current.appName
}

var splashScreen = path.resolve(__dirname, '../src/' + appRoot + '/splashScreen/index.html')
if (fs.existsSync(splashScreen))
	splashScreen = fs.readFileSync(splashScreen)
else
	splashScreen = false

console.log('Configured for ' + appName)

var argv = args(process.argv.slice(process.argv[2] === '--' ? 3 : 2))
// If clean
if (Object.keys(argv).indexOf('clean') > -1) {
	fs.removeSync(distSrc)
	fs.mkdir(distSrc)
	console.log(chalk.yellow('Cleaned'))
}


module.exports = {
	build: {
		env: require('./prod.env'),
		index: path.resolve(__dirname, '../dist/' + appRoot + '/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist/' + appRoot),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',
		appRoot: appRoot,
		appName: appName,
		splashcreen: splashScreen,
		productionSourceMap: true,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	dev: {
		env: require('./dev.env'),
		port: process.env.PORT || 3001,
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	}
}
