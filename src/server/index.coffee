# The server module...

connect = require 'connect'
http = require 'http'

Model = require './model'
createDb = require './db'

rest = require './rest'
sockjs = require './sockjs'
websocket = require './websocket'

# Create an HTTP server and attach whatever frontends are specified in the options.
#
# The model will be created based on options if it is not specified.
module.exports = create = (options, model = createModel(options)) ->
  attach(connect(), options, model)

# Create an OT document model attached to a database.
create.createModel = createModel = (options) ->
  dbOptions = options?.db

  db = createDb dbOptions
  new Model db, options

# Attach the OT server frontends to the provided Node HTTP server. Use this if you
# already have a `connect` compatible server and want to make some URL paths do OT.
#
# The options object specifies options for everything. If settings are missing,
# defaults will be provided.
#
# Set options.rest == null or options.socketio == null to turn off that frontend.
#
# This method always returns a http.Server, which should be used to listen
#
# eg.
#   var app = express();
#   var server = sharejs.server.attach(app);
#   server.listen(port);
#
create.attach = attach = (server, options, model = createModel(options)) ->
  options ?= {}
  options.staticpath ?= '/share'

  server.model = model
  server.on 'close', -> model.closeDb()

  server.use options.staticpath, connect.static("#{__dirname}/../../webclient") if options.staticpath != null

  createAgent = require('./useragent') model, options

  # The client frontend doesn't get access to the model at all, to make sure security stuff is
  # done properly.
  server.use rest(createAgent, options.rest or {}) if options.rest != null

  if !(server instanceof http.Server)
    server = http.createServer server

  # this is required by sockjs since it only works with http server, not with
  # `connect` server
  # SockJS frontend is disabled by default
  sockjs.attach(server, createAgent, options.sockjs or {}) if options.sockjs?

  # WebSocket frontend is disabled by default
  websocket.attach(server, createAgent, options.websocket or {}) if options.websocket?

  server
