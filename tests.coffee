# This runs all the tests.
#
# run with:
# % nodeunit tests.coffee

modules = [
  'testhelpers'

  'version'

  'types/count'
  'types/text'
  'types/text-composable'
  'types/text-tp2'
  'types/text-api'
  'types/json'
  'types/json-api'

  'db'
  'doc'
  'model'
  'useragent'
  'events'
  'rest'
  'rest_base'
  'sockjs'
  'websocket'

  'microevent'

  'client'

  # These tests are currently flakey.
#  'integration'
]

exports[module] = require "./test/#{module}" for module in modules

# This is a little hack to get around the lack of cleanup done by sockjs. It should terminate
# the node.js process 2 seconds after all the tests are complete.
#
# When sockjs is removed, this can be removed as well
exports.cleanup = (test) ->
  test.done()
  setTimeout (-> process.exit(0)), 2000

