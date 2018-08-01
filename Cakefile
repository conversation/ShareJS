require 'shelljs/global'
config.fatal = true

fs     = require 'fs'
path   = require 'path'
os     = require 'os'

# Gain access through PATH to all binaries added by `npm install`
# Rewrite when https://github.com/arturadib/shelljs/issues/32 is fixed
npm_bin  = path.resolve(path.join('node_modules', '.bin'))
path_sep = if os.platform() == 'win32' then ";" else ":"
process.env.PATH = "#{npm_bin}#{path_sep}#{process.env.PATH}"

option '', '--verbose', 'Show nodeunit-output for test-task'

task 'test', 'Run all tests', (options) ->
  console.log 'Running tests... (is your webclient up-to-date and nodeunit installed?)'

  config.silent = true unless options['verbose']
  exec 'nodeunit tests.coffee', (status, stdout, stderr) ->
    if status == 0
      console.log 'All tests succeeded!'
    else
      console.log "Some tests failed (error: #{status}). Try --verbose."
    process.exit(1) if status isnt 0
  config.silent = false

# This is only needed to be able to refer to the line numbers of crashes
task 'build', 'Build the .js files', ->
  console.log 'Compiling Coffee from src to lib'
  exec "coffee --compile --bare --output lib/ src/"

expandNames = (names) -> ("src/#{c}.coffee" for c in names).join ' '

compile = (filenames, dest) ->
  prepend = require "prepend-file"

  filenames = expandNames filenames
  exec "coffee -j #{dest}.js -c #{filenames}"
  # prepend.sync "#{dest}.js", "var WEB=true;"

buildtype = (name) ->
  filenames = ['types/web-prelude', "types/#{name}"]

  if ls "src/types/#{name}-api.coffee"
    filenames.push "types/#{name}-api"

  compile filenames, "webclient/#{name}"



client = [
  'client/web-prelude'
  'client/microevent'
  'types/helpers'
  'types/text'
  'types/text-api'
  'client/doc'
  'client/reconnecting_websocket'
  'client/connection'
  'client/index'
]

extras = [
  'client/ace'
  'client/cm'
  'client/textarea'
]

task 'webclient', 'Build the web client into one file', ->
  compile client, 'webclient/share'
  buildtype 'json'
  buildtype 'text-tp2'
  buildtype 'text2'

  # TODO: This should also be closure compiled.
  extrafiles = expandNames extras
  exec "coffee --compile --output webclient/ #{extrafiles}"
  # For backwards compatibility. (The ace.js file used to be called share-ace.js)
  cp "-f", "webclient/ace.js", "webclient/share-ace.js"
  cp "-f", "src/lib-etherpad/*", "webclient/"

option '-V', '--version [version]', 'The new patch version'
task 'bump', 'Increase the patch level of the version, -V is optional', (options) ->
  oldVersion = require("./package.json").version

  console.log "Current version is #{oldVersion}"

  if options.version
    version = options.version
  else
    versions = oldVersion.match(/(\d+)\.(\d+)\.(\d+)/)
    versions.shift()
    versions[2]++
    version = versions.join '.'
  console.log "New version is #{version}"

  throw new Error "Needs git" if not which "git"
  if exec("git status --porcelain").output.match /^ M /m
    throw new Error "git status must be clean"

  for file in ["package.json", "src/index.coffee", "src/client/web-prelude.coffee"]
    sed '-i', oldVersion, version, file

  invoke "webclient"
  exec "git commit -a -m 'Bump to #{version}'"

#task 'lightwave', ->
# buildclosure ['client/web-prelude', 'client/microevent', 'types/text-tp2'], 'lightwave'
