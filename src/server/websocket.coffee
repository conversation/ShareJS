# This implements the WebSocket network API for ShareJS.
EventEmitter = require('events').EventEmitter
WebSocketServer = require('ws').Server
sessionHandler = require('./session').handler

STATISTICS_INTERVAL = 10000 # 10 seconds
CLIENT_TIMEOUT = 30000 # 30 seconds

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
      conn.isAlive = true
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
  wss.on 'connection', (conn) ->
    conn.isAlive = true
    sessionHandler wrapSession(conn), createAgent

  if !!options.trackStats
    setInterval ->
      options.trackStats
        activeWebsocketConnections: wss.clients.length
    , STATISTICS_INTERVAL

  # Clients send out a heartbeat at 10 second intervals, if
  # that is missing for more than 30 seconds, assume they are
  # gone for good and terminate the connection to free up resources.
  #
  # https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
  #
  # Our implementation differs a little from the suggested solution, where the
  # client sends pings to the server instead of the other way around.
  # This is intentional because it allows the client to pick up on bad connections
  # and re-establish them more reliably and quickly.
  #
  # In our case, the server simply cleans up the mess after it's happened. In this
  # event, the client would have already established a new connection by the time
  # the server terminates it from it's side.
  setInterval ->
    for client in wss.clients
      client.terminate() if !client.isAlive
      client.isAlive = false
  , CLIENT_TIMEOUT
