# cordova-webpack-boilerplate

> A full-featured Webpack setup with hot-reload, lint-on-save, unit testing & css extraction that can be built into Cordova app.
> Build Multiple Apps in one project that correlate each other

## Important
> Does not Support Windows

The following tools must be globally available in console before installation
1. cordova (v7 or higher)
2. keytool

## Documentation

- [For this template](http://vuejs-templates.github.io/webpack): common questions specific to this template are answered and each part is described in greater detail
- [For Vue 2.0](http://vuejs.org/guide/): general information about how to work with Vue, not specific to this template
- [For Vuetify](https://vuetifyjs.com): information about building template
- [For Cordova](https://cordova.apache.org/) : for usage

## Usage

This is a project template for [vue-cli](https://github.com/vuejs/vue-cli). **It is recommended to use npm 3+ for a more efficient dependency tree.**

``` bash
$ npm install -g vue-cli
$ vue init rubix-code/webpack-cordova my-project
$ cd my-project
$ npm install

# add cordova platform
$ cd cordova
# only android build is suported by script
$ cordova platform add android
$ cd ..

$ npm run dev

# build App
$ npm run build:app
```

The development server will run on port 3001 by default.
You can specify port by adding environment variable PORT.

## What's Included

- `npm run dev`: first-in-class development experience.
  - Webpack + `vue-loader` for single file Vue components.
  - State preserving hot-reload
  - State preserving compilation error overlay
  - Lint-on-save with ESLint
  - Source maps

- `npm run manager`: manage apps
	- add, remove app projects from source
	- set default template for future apps

- `npm run build:dist`: Production ready build.
  - JavaScript minified with [UglifyJS](https://github.com/mishoo/UglifyJS2).
  - HTML minified with [html-minifier](https://github.com/kangax/html-minifier).
  - CSS across all components extracted into a single file and minified with [cssnano](https://github.com/ben-eb/cssnano).
  - Static assets compiled with version hashes for efficient long-term caching, and an auto-generated production `index.html` with proper URLs to these generated assets.
  - Use `npm run build:dist --report`to build with bundle size analytics.
  - Use `npm run build:dist -- --clean`to build clean.

- `npm run build:app` : Cordova production build
	- build android app
	- use `npm run build:app -- --clean` for clean builds

- `npm run unit`: Unit tests run in [JSDOM](https://github.com/tmpvar/jsdom) with [Jest](https://facebook.github.io/jest/), or in PhantomJS with Karma + Mocha + karma-webpack.
  - Supports ES2015+ in test files.
  - Easy mocking.

- `npm run e2e`: End-to-end tests with [Nightwatch](http://nightwatchjs.org/).
  - Run tests in multiple browsers in parallel.
  - Works with one command out of the box:
    - Selenium and chromedriver dependencies automatically handled.
    - Automatically spawns the Selenium server.

## TODOS:

1. Add Windows Support
2. Add Support for other cordova platforms
3. Run all cordova command using onlt `npm run cordova [...args]`
4. Optimize build and waiting time
5. Add more Documentation

### Why this can suck

Because it is my first attempt with th Node Environment many codes are just pulled together to make things work.

Please feel free to suggest optimisation, changes and new features

> This project is built using [Vuetify Webpack Advanced](https://github.com/vuetifyjs/webpack-advanced) Boilerplate