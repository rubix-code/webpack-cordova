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

// Select App
var current = deasync(
	async (callback = () => { }) => {
		var questions = [
			{
				message: 'Select App',
				name: 'appName',
				type: 'list',
				choices: Object.values(apps)
			}
		]

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
    index: path.resolve(__dirname, '../dist/'+ appRoot +'/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist/'+appRoot),
    assetsSubDirectory: 'static',
	assetsPublicPath: './',
	appRoot: appRoot,
	appName: appName,
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
    port: process.env.PORT || 3001 ,
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
