const cmd = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const args = require('minimist')
const _App = require('./app.env')
const cmd2 = require('node-run-cmd')
const deasync = require('deasync')

// Source code base directory
const sourceDir = path.resolve(__dirname, '../src/')
// Application List File
const AppFile = _App.file
const OsFile = _App.osFile
// Default App Location
const defaultApp = _App.defaultApp

console.clear()
// Get all registered apps
var AppList = fs.readJSONSync(AppFile)

var manager = {
	saveAppList: () => fs.writeFileSync(AppFile, JSON.stringify(AppList, false, 2)),
	setDefault: () => {
		const questions = [
			{
				type: 'list',
				name: 'default',
				message: 'Select App to be set as default',
				choices: Object.keys(AppList)
			},
			{
				type: 'confirm',
				default: false,
				message: 'Are you sure ?',
				name: 'confirm'
			}
		]

		cmd.prompt(questions).then(answers => {
			if (answers.confirm) {
				fs.removeSync(defaultApp)
				fs.copySync(path.resolve(sourceDir, './' + answers.default), defaultApp)
				console.log('Done!')
			}
			else console.log('Cancelled!')
		})
	},
	add: () => {
		const questions = [
			{
				type: 'input',
				name: 'appName',
				message: 'App Name: ',
				validate: value => {
					var valid = true
					Object.keys(AppList).forEach(key => {
						if (AppList.hasOwnProperty(key) && AppList[key] === value)
							valid = 'Name Already Exists, Please Select a new Unique Name.'
					})
					return valid
				}
			},
			{
				type: 'input',
				name: 'appCode',
				message: 'App Code: ',
				validate: value => {
					var valid = true
					Object.keys(AppList).forEach(key => {
						if (key === value) valid = "Please select a unique App Code."
					})
					return valid
				}
			},
		]

		console.log(chalk.blue('Add App'))
		cmd.prompt(questions).then(answers => {
			AppList[answers.appCode] = answers.appName
			var newApp = path.resolve(sourceDir, answers['appCode'])
			manager.saveAppList()
			fs.copySync(defaultApp, newApp)
			console.log(chalk.bold('Added App : ') + chalk.green(answers['appName'] + ' [ ' + answers['appCode'] + ' ]'))
			console.log('Source: ' + newApp)
		})
	},
	list: () => {
		if (Object.keys(AppList).length === 0)
			console.log(chalk.red('>>>') + ' No App Added!')
		else {
			console.log(chalk.green('>') + ' ' + chalk.bold('Available Apps :'))
			Object.keys(AppList).forEach(key => console.log(chalk.cyan('- ' + key)))
		}
	},
	delete: () => {
		if (Object.keys(AppList).length === 0)
			console.log(chalk.red('>>>') + ' No App Added!')
		else {
			console.log(chalk.blue('Delete App'))
			cmd.prompt([
				{
					type: 'list',
					message: 'Available Apps',
					name: 'code',
					choices: Object.keys(AppList)
				},
				{
					type: 'confirm',
					default: false,
					message: 'Are you sure you want to delete?',
					name: 'confirm'
				}
			]).then(answers => {
				try {
					if (answers['confirm']) {
						fs.removeSync(path.resolve(sourceDir, answers['code']))
						delete AppList[answers['code']]
						manager.saveAppList()
						console.log(chalk.blue('deleted: ' + answers['code']))
					} else console.log(chalk.green('Delete Operation Canceled'))
				} catch (error) {
					console.log(chalk.red(error))
				}
			})
		}
	},
	quit: () => { process.exit() },
	initialize: (argv = false) => {
		var arg = false
		if (Object.keys(argv).indexOf('add') > -1) arg = 'add'
		else if (Object.keys(argv).indexOf('list') > -1) arg = 'list'
		else if (Object.keys(argv).indexOf('delete') > -1) arg = 'delete'
		else if (Object.keys(argv).indexOf('setDefault') > -1) arg = 'setDefault'

		if (manager.hasOwnProperty(arg)) manager[arg]()
		else cmd.prompt([
			{
				type: 'list',
				message: 'App Manager',
				name: 'operation',
				choices: [
					{
						key: 'l',
						name: 'List All',
						value: 'list'
					},
					{
						key: 'a',
						name: 'Add App',
						value: 'add'
					},
					{
						key: 'd',
						name: 'Delete App',
						value: 'delete'
					},
					{
						key: 's',
						name: 'Set Default App',
						value: 'setDefault'
					},
					{
						key: 'q',
						name: 'Quit',
						value: 'quit'
					},
				]
			}
		]).then(answers => {
			if (manager.hasOwnProperty(answers.operation)) manager[answers.operation]()
			else console.log(chalk.red('>>>') + ' Function not available')
		})
	}
}

var argv = args(process.argv.slice(process.argv[2] === '--' ? 3 : 2))
manager.initialize(argv)