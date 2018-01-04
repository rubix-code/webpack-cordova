const path = require('path')
const fs = require('fs-extra')

const file = path.resolve(__dirname, './app-list.json')
const osFile = path.resolve(__dirname, './os-list.json')
const defaultApp = path.resolve(__dirname, '../src/.default')

if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify({}, false, 2))
var appList = fs.readJsonSync(file)

module.exports = {
	file,
	defaultApp,
	appList
}