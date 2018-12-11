# MIT License:
#
# Copyright (c) 2010-2012, Joe Walnes
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

###
This behaves like a WebSocket in every way, except if it fails to connect,
or it gets disconnected, it will repeatedly poll until it succesfully connects
again.

It is API compatible, so when you have:
ws = new WebSocket('ws://....');
you can replace with:
ws = new ReconnectingWebSocket('ws://....');

The event stream will typically look like:
onopen
onmessage
onmessage
onclose // lost connection
onopen  // sometime later...
onmessage
onmessage
etc...

It is API compatible with the standard WebSocket API.

Inspired from: https://github.com/joewalnes/reconnecting-websocket/
Contributors:
- Joe Walnes
- Didier Colens
- Wout Mertens
###
class ReconnectingWebSocket
  HEALTHCHECK_INTERVAL = 10000 # 10 seconds

  HEARTBEAT_NOT_REQUESTED = 1
  HEARTBEAT_REQUESTED = 2
  HEARTBEAT_RECEIVED = 3

  ###
  Setting this to true is the equivalent of setting all instances of ReconnectingWebSocket.debug to true.
  ###
  debugAll: false

  constructor: (url) ->
    # These can be altered by calling code.
    @debug = @debugAll

    # TODO: Do we need/want this? I think it's only for API compatibility. But
    # do we even care about that, considering this class is only used by ShareJS?
    @forcedClose = false

    @url = url
    @readyState = WebSocket.CONNECTING
    @URL = url # Public API

    # We have a single health check interval for each ReconnectingWebSocket
    #
    # The two main purposes are to:
    #
    #  - Trigger a reconnect if we've been in the Socket.CONNECTING state for
    #    more than 10 seconds.
    #
    #  - Trigger a reconnect if we're in the Socket.OPEN state and we have not
    #    had a heartbeat response from the server for more than 10 seconds
    #
    # This interval is also in charge of sending a heartbeat frame to the server
    # every 10 seconds when in the Socket.OPEN state.
    #
    @healthCheckInterval = setInterval @_periodicHealthCheck, HEALTHCHECK_INTERVAL

    # and of course, kick off the initial connect
    @_connect()

  onopen: (event) ->
  onclose: (event) ->
  onconnecting: (event) ->
  onmessage: (event) ->
  onerror: (event) ->

  send: (data) ->
    if @ws
      console.debug "ReconnectingWebSocket", "send", @url, data  if @debug
      @ws.send data
    else
      throw "INVALID_STATE_ERR : Pausing to reconnect websocket"

  close: ->
    if @ws
      @forcedClose = true
      @ws.close()

  ###
  Additional public API method to refresh the connection if still open (close, re-open).
  For example, if the app suspects bad data / missed heart beats, it can try to refresh.
  ###
  refresh: ->
    console.debug "ReconnectingWebSocket", "refresh" if @debug
    @_reconnect()

  # Closes the WebSocket connection or connection attempt and tries again.
  #
  # Useful if stuck in a state unexpectedly, or if no heartbeat response
  # has been received.
  _reconnect: =>
    console.debug "ReconnectingWebSocket", "reconnect"  if @debug
    if !@ws || @ws.readyState == WebSocket.CLOSED
      @_connect()
    else
      @_disconnect()
      @_connect()

  # This checks to see if the server is still responding.
  #
  # If the client does not receive a response within the interval, it
  # will refresh the connection.
  _checkHeartbeat: =>
    if @heartbeatResponse == HEARTBEAT_REQUESTED
      console.debug "ReconnectingWebSocket", "no-heartbeat"  if @debug
      @_reconnect()
    else
      @heartbeatResponse = HEARTBEAT_REQUESTED
      console.debug "ReconnectingWebSocket", "send-heartbeat"  if @debug
      @send JSON.stringify "heartbeat"

  _periodicHealthCheck: =>
    console.debug "ReconnectingWebSocket", "healthcheck"  if @debug
    switch @readyState
      when WebSocket.CLOSED then @_reconnect()
      when WebSocket.CONNECTING then @_reconnect()
      when WebSocket.OPEN then @_checkHeartbeat()

  _connect: =>
    @ws = new WebSocket(@url)
    @readyState = WebSocket.CONNECTING
    console.debug "ReconnectingWebSocket", "attempt-connect", @url  if @debug
    @ws.addEventListener "open", @_handleWebsocketOpen
    @ws.addEventListener "close", @_handleWebsocketClose
    @ws.addEventListener "message", @_handleWebsocketMessage
    @ws.addEventListener "error", @_handleWebsocketError

  _handleWebsocketOpen: (event) =>
    console.debug "ReconnectingWebSocket", "onopen", @url  if @debug
    @readyState = WebSocket.OPEN
    @heartbeatResponse = HEARTBEAT_NOT_REQUESTED
    @onopen event

  _handleWebsocketClose: (event) =>
    @ws = null
    @readyState = WebSocket.CLOSED
    @onclose event

    if @forcedClose
      # if we're closing for good, kill the health check interval so it
      # doesn't try to re-establish the connection
      clearInterval @healthCheckInterval

  _handleWebsocketMessage: (event) =>
    data = JSON.parse event.data

    console.debug "ReconnectingWebSocket", "onmessage", @url, event.data  if @debug
    # intercept the message if it's a heartbeat
    if data.heartbeat
      console.debug "ReconnectingWebSocket", "heartbeat-received", data.heartbeat  if @debug
      @heartbeatResponse = HEARTBEAT_RECEIVED
    else
      @onmessage event

  _handleWebsocketError: (event) =>
    console.debug "ReconnectingWebSocket", "onerror", @url, event  if @debug
    @onerror event

  _removeEventListeners: =>
    console.debug "ReconnectingWebSocket", "remove-event-listeners"  if @debug
    if @ws
      @ws.removeEventListener "open", @_handleWebsocketOpen
      @ws.removeEventListener "close", @_handleWebsocketClose
      @ws.removeEventListener "message", @_handleWebsocketMessage
      @ws.removeEventListener "error", @_handleWebsocketError

  _disconnect: =>
    console.debug "ReconnectingWebSocket", "disconnect"  if @debug
    if @ws
      @_removeEventListeners()
      @ws.close()
      @readyState = WebSocket.CLOSED
      @onclose
        target: this
        type: "disconnect"
