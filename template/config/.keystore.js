const cmd = require('inquirer')
const fs = require('fs-extra')
const chalk = require('chalk')
const path = require('path')
const deasync = require('deasync')
const nodecmd = require('node-run-cmd')

console.clear()
console.log(chalk.yellow('Generate Keystore'))
var keystore = async (callback = () => { }) => {
	try {
		var valid = false
		var previousKeystore = {}
		var retryCount = 0
		var maxRetry = 3
		var keystore = {}

		while (!valid) {
			retryCount++
			if (retryCount > maxRetry) throw 'Too many retry attempts'
			keystore = await cmd.prompt([
				{
					name: 'alias',
					message: 'Store Alias: ',
					type: 'input',
					default: previousKeystore.alias || 'App'
				},
				{
					name: 'CN',
					message: 'What is your first and last name?',
					default: previousKeystore.CN || 'Unknown',
					type: 'input'
				},
				{
					name: 'OU',
					message: 'What is the name of your organizational unit?',
					default: previousKeystore.OU || 'Unknown',
					type: 'input'
				},
				{
					name: 'O',
					message: 'What is the name of your organization?',
					default: previousKeystore.O || 'Unknown',
					type: 'input'
				},
				{
					name: 'L',
					message: 'What is the name of your City or Locality?',
					default: previousKeystore.L || 'Unknown',
					type: 'input'
				},
				{
					name: 'ST',
					message: 'What is the name of your State or Province?',
					default: previousKeystore.ST || 'Unknown',
					type: 'input'
				},
				{
					name: 'C',
					message: 'What is the two-letter country code for this unit?',
					default: previousKeystore.C || 'Unknown',
					type: 'input',
					filter: i => i.toUpperCase()
				},
			])

			valid = await cmd.prompt([
				{
					name: 'confirm',
					default: false,
					message: `Is CN=${keystore.CN}, OU=${keystore.OU}, O=${keystore.O}, L=${keystore.L}, ST=${keystore.ST}, C=${keystore.C} correct?`,
					type: 'confirm'
				}
			])

			valid = valid.confirm
			previousKeystore = keystore
		}

		valid = false
		retryCount = 0
		console.log("  Store Password")
		while (!valid) {
			retryCount++
			if (retryCount > maxRetry) throw 'Too many retry attempts'
			var pass = await cmd.prompt([
				{
					name: 'keystorePassword',
					message: 'Enter keystore password:',
					type: 'password',
					validate: i => i.length >= 6 ? true : 'Keystore password is too short - must be at least 6 characters'
				},
				{
					name: 'keystoreConfirmPassword',
					message: 'Re-enter new password:',
					type: 'password',
					validate: i => i.length >= 6 ? true : 'Keystore password is too short - must be at least 6 characters'
				},
			])

			if (pass.keystorePassword === pass.keystoreConfirmPassword) {
				keystore = { ...keystore, ...pass }
				valid = true
			} else console.log(chalk.bold.red('! ') + chalk.bold('They Did not Match! Retry!'))
		}

		valid = false
		retryCount = 0
		console.log('  Key Password')
		while (!valid) {
			retryCount++
			if (retryCount > maxRetry) throw 'Too many retry attempts'
			var pass = await cmd.prompt([
				{
					name: 'keyPassword',
					message: 'Enter key password:',
					type: 'password',
					validate: i => i.length >= 6 ? true : 'Key password is too short - must be at least 6 characters'
				},
				{
					name: 'keyConfirmPassword',
					message: 'Re-enter new password:',
					type: 'password',
					validate: i => i.length >= 6 ? true : 'Key password is too short - must be at least 6 characters'
				},
			])

			if (pass.keyPassword === pass.keyConfirmPassword) {
				keystore = { ...keystore, ...pass }
				valid = true
			} else console.log(chalk.bold.red('! ') + chalk.bold('They Did not Match! Retry!'))
		}

		var params = [
			keystore.keystorePassword,
			keystore.keystorePassword,
			keystore.CN,
			keystore.OU,
			keystore.O,
			keystore.L,
			keystore.ST,
			keystore.C,
			'y',
			keystore.keyPassword,
			keystore.keyPassword,
		]
		keystore['file'] = keystore.alias+'.keystore'
		
		params = params.join('\n')
		params = `echo "${params}"`
		
		var runthis = `keytool -genkey -v -keyalg RSA -keysize 2048 -validity 10000  -alias ${keystore.alias} -keystore ${keystore.file} -dname "CN=${keystore.CN}, OU=${keystore.OU}, O=${keystore.O}, L=${keystore.L}, ST=${keystore.ST}, OU=${keystore.C}" -keypass ${keystore.keyPassword} -storepass ${keystore.keystorePassword}`
		console.log('  Generating ...')
		var _output = ''
		await nodecmd.run(runthis,{
			onData: data => { _output += data },
			onDone: data => { if(data) throw 'Something Went wrong with keytool \n Error Code : '+ data + '\n' + chalk.grey(_output) }
		})

		var answers = {}
		answers["storePassword"] = keystore.keystorePassword
		answers["password"] = keystore.keyPassword
		answers["alias"] = keystore.alias
		answers["keystore"] = keystore.file
		answers["keystoreType"] = ""

		var build = {
			android: {
				release: answers
			}
		}

		fs.writeFileSync(path.resolve(__dirname, '../build.json'), JSON.stringify(build, false, 2))
		if(fs.existsSync(path.resolve(__dirname, '../cordova'))){
			fs.writeFileSync(path.resolve(__dirname, '../cordova/build.json'), JSON.stringify(build, false, 2))
			fs.copySync(
				path.resolve(__dirname,'../'+keystore.file),
				path.resolve(__dirname,'../cordova/'+keystore.file),
			)
		}
		console.log(chalk.green('Keystore is now ready'))
		console.log(`[ ${keystore.file} ]`)
		callback(false, true)
	} catch (error) {
		callback(error, false)
		console.log(chalk.bold.bgRed(' Error ') + chalk.bold(' ' + error))
	}
	process.exit()
}

keystore()