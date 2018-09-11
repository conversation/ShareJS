# This implements the WebSocket network API for ShareJS.
EventEmitter = require('events').EventEmitter
WebSocketServer = require('ws').Server

sessionHandler = require('./session').handler

wrapSession = (conn) ->
  wrapper = new EventEmitter
  wrapper.abort = -> conn.close()
  wrapper.stop = -> conn.close()
  wrapper.send = (response) ->
    conn.send JSON.stringify response if wrapper.ready()
  wrapper.ready = -> conn.readyState is 1
  conn.on 'message', (data) -> wrapper.emit 'message', JSON.parse data
  wrapper.headers = conn.upgradeReq.headers
  # TODO - I don't think this is the right way to get the address
  wrapper.address = conn._socket.server._connectionKey?
  wrapper

# checks heartbeat of clients every 30 seconds
#
# if they don't respond to a ping, terminate the connection
setPeriodicHeartbeatCheck = (wss) ->
  setInterval ->
    for ws in wss.clients
      if ws.isAlive
        ws.isAlive = false
        ws.ping()
      else
        ws.terminate()
  , 30000

heartbeat = ->
  @isAlive = true

exports.attach = (server, createAgent, options) ->
  options.prefix or= '/websocket'
  wss = new WebSocketServer {server: server, path: options.prefix, headers: options.headers}

  wss.on 'connection', (ws) ->
    ws.isAlive = true
    ws.on('pong', heartbeat);
    sessionHandler wrapSession(ws), createAgent

  setPeriodicHeartbeatCheck(wss)
