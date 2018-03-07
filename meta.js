module.exports = {
	"helpers": {
		"if_or": function (v1, v2, options) {
			if (v1 || v2) {
				return options.fn(this);
			}

			return options.inverse(this);
		}
	},
	"prompts": {
		"name": {
			"type": "string",
			"required": true,
			"message": "Project name"
		},
		"appId": {
			"type": "string",
			"required": true,
			"message": "App Id",
			"default": "com.cordova.app"
		},
		"description": {
			"type": "string",
			"required": false,
			"message": "Project description",
			"default": "A Vue.js project"
		},
		"authorName": {
			"type": "string",
			"message": "Author"
		},
		"authorEmail": {
			"type": "string",
			"message": "Author Email"
		},
		"authorUrl": {
			"type": "string",
			"message": "Author Url"
		},
		"router": {
			"type": "confirm",
			"message": "Install vue-router?"
		},
		"lint": {
			"type": "confirm",
			"message": "Use ESLint to lint your code?",
			"default": false
		},
		"lintConfig": {
			"when": "lint",
			"type": "list",
			"message": "Pick an ESLint preset",
			"choices": [
				{
					"name": "Standard (https://github.com/standard/standard)",
					"value": "standard",
					"short": "Standard"
				},
				{
					"name": "Airbnb (https://github.com/airbnb/javascript)",
					"value": "airbnb",
					"short": "Airbnb"
				},
				{
					"name": "none (configure it yourself)",
					"value": "none",
					"short": "none"
				}
			]
		},
		"unit": {
			"type": "confirm",
			"message": "Setup unit tests",
			"default": false
		},
		"runner": {
			"when": "unit",
			"type": "list",
			"message": "Pick a test runner",
			"choices": [
				{
					"name": "Jest",
					"value": "jest",
					"short": "jest"
				},
				{
					"name": "Karma and Mocha",
					"value": "karma",
					"short": "karma"
				},
				{
					"name": "none (configure it yourself)",
					"value": "noTest",
					"short": "noTest"
				}
			]
		},
		"e2e": {
			"type": "confirm",
			"message": "Setup e2e tests with Nightwatch?",
			"default": false
		},
		"alacarte": {
			"type": "confirm",
			"message": "Use a-la-carte components?",
			"default": false
		},
		"theme": {
			"type": "confirm",
			"message": "Use custom theme?",
			"default": false
		}
	},
	"filters": {
		".eslintrc.js": "lint",
		".eslintignore": "lint",
		"config/test.env.js": "unit || e2e",
		"test/unit/**/*": "unit",
		"test/unit/index.js": "unit && runner === 'karma'",
		"test/unit/karma.conf.js": "unit && runner === 'karma'",
		"test/unit/specs/index.js": "unit && runner === 'karma'",
		"test/unit/setup.js": "unit && runner === 'jest'",
		"test/e2e/**/*": "e2e",
		"src/router/**/*": "router"
	},
	"completeMessage": "To get started:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run onetime \n  cd cordova\n  cordova add platform android\n cd ..\n  npm run dev \n  npm run build:app\n\nDocumentation can be found at https://vuejs-templates.github.io/webpack"
};