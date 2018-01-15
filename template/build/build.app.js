'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const args = require('minimist')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
var webpackConfig = require('./webpack.app.conf')
const cmd = require('node-run-cmd')
const mv = require('mv')
const fs = require('fs-extra')
const keystore = require('../build.json')

const spinner = ora('building ' + chalk.inverse.blue(config.build.appName + '.apk') + ' for production...\n' + chalk.cyan('building distribution...'))
spinner.start()

config.build.assetsRoot = path.resolve(__dirname, '../www')
webpackConfig.output.path = path.resolve(__dirname, '../www')

var outputDir = path.resolve(__dirname, '../dist/')

const cordova = {
  configure: () => {
    const XML = require('node-jsxml').XML
    const _package = require('../package.json')
    const _configFile = path.resolve(__dirname, '../cordova/config.xml')
    var _config = fs.readFileSync(_configFile, 'utf8')
    _config = new XML(_config)
    _config.attribute('id').setValue(
      _package.appId +
      "." + config.build.appRoot
    )
    _config.child('name').setValue(config.build.appName)
    _config.child('description').setValue(_package.description)
    _config.child('author').setValue(_package.author.name)
    _config.child('author').attribute('email').setValue(_package.author.email)
    _config.child('author').attribute('href').setValue(_package.author.url)
    fs.writeFileSync(_configFile, _config.toXMLString())
  },
  build: () => {
    var output = []
    var consoleOutput = ''
    cmd.run([`cordova build --release --keystore='${keystore.android.release.keystore}' ${process.env.OS || 'android'} --buildConfig`], {
      cwd: 'cordova',
      onData: data => {
        consoleOutput += data
        data.split('\n').map(i => {
          output.push(
            i.replace(/^\t+|\t+$|^\s+|\s+$/, '')
            .replace('\\', '/')
          )
        })
      },
      onDone: e => {
        if (e) {
          console.log(chalk.yellow('Something went wrong!\n Please manually use the app from output directory \n '))
          console.log(chalk.red(consoleOutput))
          process.exit(e)
        }
        console.log(chalk.grey(consoleOutput))

        console.log(chalk.green('Built the following apk(s):'))
        output.filter(i => i.match(/(\.apk)$/))
          .map(i => {
            var destination = i.split('/')
            destination = destination[destination.length - 1].split('-')
            destination[0] = config.build.appName
            destination = destination.join('-')

            if (fs.existsSync(i)) {
              fs.copySync(i, outputDir + '/' + destination)
              console.log(chalk.green('> ') + destination)
            }
          })
        console.log('Located at: \n' + outputDir + '/')
        process.exit()
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

    cordova.configure()
    var argv = args(process.argv.slice(process.argv[2] === '--' ? 3 : 2))
    if (Object.keys(argv).indexOf('dist') > -1 && !argv['dist']) {
      console.log(chalk.green('  Build complete.'))
    } else {
      console.log(chalk.green('  Build complete.\n Take it away cordova!'))
      cordova.build()
    }
  })
})
