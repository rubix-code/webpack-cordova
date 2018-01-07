"use strict"
const { exec } = require('child_process')

var execute = (Command) => new Promise((resolve, reject) => {
	exec(Command, (error, stdout, stderr) => {
		if (error) reject(error.code)
		else resolve(stdout)
	})
})

var validate = async (cmds = {}) => {
	var missing = []
	var cmdsKey = Object.keys(cmds)
	for (let i = 0; i < cmdsKey.length; i++) {
		try { await execute(cmds[cmdsKey[i]]) }
		catch (error) { missing.push(cmdsKey[i]) }
	}
	if (missing.length > 0) {
		console.log('Following Terminal Command(s) are needed to proceed')
		missing.forEach(i => console.log('> ' + i))
		process.exit(1)
	}
	else console.log('Proceed.')
}

validate({
	cordova: 'cordova -v',
	keytool: 'keytool'
})