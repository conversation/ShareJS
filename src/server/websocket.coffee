# This implements the WebSocket network API for ShareJS.
EventEmitter = require('events').EventEmitter
WebSocketServer = require('ws').Server

sessionHandler = require('./session').handler

STATISTICS_INTERVAL = 10000 # 10 seconds

wrapSession = (conn) ->
  wrapper = new EventEmitter
  wrapper.abort = -> conn.close()
  wrapper.stop = -> conn.close()
  wrapper.send = (response) ->
    conn.send JSON.stringify response if wrapper.ready()
  wrapper.ready = -> conn.readyState is 1
  conn.on 'close', -> wrapper.emit 'close'
  conn.on 'message', (data) ->
    msg = JSON.parse data

    # 'heartbeat' is a message from the client to see if
    # the server is still listening.
    #
    # if the client does not hear back in a timely manner
    # it should terminate the connection.
    if msg == 'heartbeat'
      wrapper.send { heartbeat: new Date() }
    else
      wrapper.emit 'message', msg

  wrapper.headers = conn.upgradeReq.headers
  # TODO - I don't think this is the right way to get the address
  wrapper.address = conn._socket.server._connectionKey?
  wrapper

exports.attach = (server, createAgent, options) ->
  options.prefix or= '/websocket'
  wss = new WebSocketServer {server: server, path: options.prefix, headers: options.headers}
  wss.on 'connection', (conn) -> sessionHandler wrapSession(conn), createAgent

  if !!options.trackStats
    setInterval ->
      options.trackStats
        activeWebsocketConnections: wss.clients.length
    , STATISTICS_INTERVAL
