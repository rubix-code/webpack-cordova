const cmd = require('node-run-cmd').run
const prompt = require('inquirer').prompt
const chalk = require('chalk')
const fs = require('fs-extra')
const path = require('path')
const args = require('minimist')
const deasync = require('deasync')
const package = require('../package.json')

console.clear()
console.log('Generate Cordova Project')
if (!fs.existsSync(path.resolve(__dirname, '../www')))
	fs.mkdirSync(path.resolve(__dirname, '../www'))

var cordova = {
	initialize: async (callback = () => { }) => {
		var reply = await prompt([
			{
				name: 'id',
				type: 'input',
				message: 'Enter App Id',
				default: package.appId,
				filter: i => i.toLowerCase(),
				validate: i => true
			},
			{
				name: 'name',
				type: 'input',
				message: 'Enter App Name',
				default: package.name
			}
		])
		var response
		var command = `cordova create cordova ${reply.id} ${reply.name} --link-to=www`
		await cmd(command, {
			onData: data => { response = data },
			onError: e => { response = chalk.grey(e) }
		})
		if (fs.existsSync('cordova')) console.log(chalk.green('Created Cordova Project'))
		else throw chalk.red('Unable to create Cordova Project \n') + response
		callback(false, true)
	},
	reset: async (callback = () => { }) => {
		var reply = await prompt([
			{
				name: 'confirm',
				message: 'Are you sure you want to reset',
				type: 'confirm',
				default: false
			}
		])
		if (reply.confirm) {
			fs.removeSync('cordova')
			console.log(chalk.grey('Cordova project removed'))
			console.log(chalk.yellow('Recreate Project'))
			await cordova.initialize()
		}
		else console.log(chalk.green('Cancelled!'))
		callback(false, true)
	},
	exit: async (callback = () => { }) => {
		process.exit()
		callback(false, true)
	}
}

var argv = args(process.argv.slice(process.argv[2] === '--' ? 3 : 2))

deasync(
	async (callback = () => { }) => {
		var reply = {}
		if (Object.keys(argv).indexOf('reset') > -1) reply = 'reset'
		else if (Object.keys(argv).indexOf('init') > -1) reply = 'initialize'
		else {
			reply = await prompt([
				{
					type: "list",
					message: "cordova manager",
					choices: ["Reset", "Initialize", "Exit"],
					name: "option",
					filter: i => i.toLowerCase()
				}
			])
			reply = reply.option
		}
		try {
			await cordova[reply]()
		} catch (error) {
			console.log(error)
		}
		callback(false, true)
	}
)()