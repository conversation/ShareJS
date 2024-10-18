# The server module...

express = require 'express'
http = require 'http'

Model = require './model'
createDb = require './db'

rest = require './rest'
sockjs = require './sockjs'
websocket = require './websocket'

createModel = (options) ->
  dbOptions = options?.db

  db = createDb dbOptions
  new Model db, options

# Use this method to attach ShareJS to your http server.
#
# For example, using express (4+):
#
# import express from "express"
# import { server } from "share"
#
# const app = express()
# const options = { your: { options: "here" }}
# server.attach(app, options)
#
attach = (server, options, model = createModel(options)) ->
  options ?= {}
  options.staticpath ?= '/share'

  server.model = model
  server.on 'close', -> model.closeDb()

  server.use options.staticpath, express.static("#{__dirname}/../../webclient") if options.staticpath != null

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

module.exports = {
  createModel,
  attach,
}
