# A REST-ful frontend to the OT server.
#
# See the docs for details and examples about how the protocol works.

http = require 'http'
url  = require 'url'
nameregexes = {}

send403 = (res, message = 'Forbidden\n') ->
  res.writeHead 403, {'Content-Type': 'text/plain'}
  res.end message

send404 = (res, message = '404: Your document could not be found.\n') ->
  res.writeHead 404, {'Content-Type': 'text/plain'}
  res.end message

sendError = (res, message, head = false) ->
  if message == 'forbidden'
    if head
      send403 res, ""
    else
      send403 res
  else if message == 'Document does not exist' || 'operations missing in DB'
    if head
      send404 res, ""
    else
      send404 res
  else
    console.warn "REST server does not know how to send error: '#{message}'"
    if head
      res.writeHead 500, {'Content-Type': 'text/plain'}
      res.end "Error: #{message}\n"
    else
      res.writeHead 500, {}
      res.end "Error: #{message}\n"

send400 = (res, message) ->
  res.writeHead 400, {'Content-Type': 'text/plain'}
  res.end message

send200 = (res, message = "OK\n") ->
  res.writeHead 200, {'Content-Type': 'text/plain'}
  res.end message

sendJSON = (res, obj) ->
  res.writeHead 200, {'Content-Type': 'application/json'}
  res.end JSON.stringify(obj) + '\n'

# Callback is only called if the object was indeed JSON
expectJSONObject = (req, res, callback) ->
  pump req, (data) ->
    try
      obj = JSON.parse data
    catch error
      send400 res, 'Supplied JSON invalid'
      return

    callback(obj)

pump = (req, callback) ->
  data = ''
  req.on 'data', (chunk) -> data += chunk
  req.on 'end', () -> callback(data)

# match a doc path by its url
# For example:
#   > matchDocName '/doc/testdocument'
#   'testdocument'
#   > matchDocName '/doc/testdocument/hello'
#   undefined
#   > matchDocName '/document/test'
#   undefined
#   > matchDocName '/hello_world'
#   undefined
matchDocName = (urlString, base) ->
  if !nameregexes[base]?
    base ?= ""
    base = base[...-1] if base[base.length - 1] == "/"
    nameregexes[base] = new RegExp("^#{base}\/doc\/(?:([^\/]+?))\/?$", "i")

  urlParts = url.parse urlString
  parts = urlParts.pathname.match nameregexes[base]
  return parts[1] if parts

# match a doc path by its url, but only if it's followed by "/versions"
# For example:
#   > matchDocName '/doc/testdocument'
#   undefined
#   > matchDocName '/doc/testdocument/versions'
#   'testdocument'
#   > matchDocName '/document/test'
#   undefined
#   > matchDocName '/hello_world'
#   undefined
matchDocNameWithVersions = (urlString, base) ->
  base ?= ""
  base = base[...-1] if base[base.length - 1] == "/"
  urlParts = url.parse(urlString, true)
  parts = urlParts.pathname.match(new RegExp("^#{base}\/doc\/(?:([^\/]+?))\/versions\/?$", "i"))
  return {name: parts[1], every: parseInt(urlParts.query.every)} if parts

# match a version number from the query string of a URL
# For example:
#   > matchVersion 'http://example.com/?v=10'
#   10
#   > matchVersion 'http://example.com/'
#   10
#   > matchVersion 'hello'
#   undefined
matchVersion = (urlString) ->
  urlParts = url.parse urlString
  regexp = new RegExp("v=(\\d+)")
  if urlParts.query
    parts = urlParts.query.match(regexp)
    return parseInt(parts[1]) if parts

# prepare data for createClient. If createClient success, then we pass client
# together with req and res into the callback. Otherwise, stop the flow right
# here and send error back
#
# req - instance of 'http.ServerRequest'
# res - instance of 'http.ClientRequest'
# createClient - create a sharejs client
# cb - callback which accept req, res, client in that order
auth = (req, res, createClient, cb) ->
  data =
    headers: req.headers
    remoteAddress: req.connection.remoteAddress

  createClient data, (error, client) ->
    if client
      cb? req, res, client
    else
      sendError res, error

# GET returns the document snapshot. The version and type are sent as headers.
# I'm not sure what to do with document metadata - it is inaccessable for now.
getDocument = (req, res, client) ->
  resultCallback = (error, req, res, doc) ->
    if doc
      res.setHeader 'X-OT-Type', doc.type.name
      res.setHeader 'X-OT-Version', doc.v
      if req.method == "HEAD"
        send200 res, ""
      else
        if typeof doc.snapshot == 'string'
          send200 res, doc.snapshot
        else
          sendJSON res, doc.snapshot
    else
      if req.method == "HEAD"
        sendError res, error, true
      else
        sendError res, error
  if req.params.version || req.params.version == 0
    client.getSnapshotVersion req.params.name, req.params.version, (error, doc) ->
      resultCallback(error, req, res, doc)
  else
    client.getSnapshot req.params.name, (error, doc) ->
      resultCallback(error, req, res, doc)

# GET returns the document versions.
getDocumentVersions = (req, res, client) ->
  client.getVersions req.params.name, req.params.every, (error, docs) ->
    return sendError res, error if error

    if docs.length > 0
      res.setHeader 'X-OT-Type', docs[0].type
      sendJSON res, docs
    else
      sendJSON res, []

# Put is used to create a document. The contents are a JSON object with {type:TYPENAME, meta:{...}}
putDocument = (req, res, client) ->
  expectJSONObject req, res, (obj) ->
      type = obj?.type
      meta = obj?.meta

      unless typeof type == 'string' and (meta == undefined or typeof meta == 'object')
        send400 res, 'Type invalid'
      else
        client.create req.params.name, type, meta, (error) ->
          if error
            sendError res, error
          else
            send200 res

# POST submits an op to the document.
postDocument = (req, res, client) ->
  query = url.parse(req.url, true).query

  version = if query?.v?
    parseInt query?.v
  else
    parseInt req.headers['x-ot-version']

  unless version? and version >= 0
    send400 res, 'Version required - attach query parameter ?v=X on your URL or set the X-OT-Version header'
  else
    expectJSONObject req, res, (obj) ->
      opData = {v:version, op:obj, meta:{source:req.socket.remoteAddress}}
      client.submitOp req.params.name, opData, (error, newVersion) ->
        if error?
          sendError res, error
        else
          sendJSON res, {v:newVersion}

# DELETE a document
deleteDocument = (req, res, client) ->
  client.delete req.params.name, (error) ->
    if error
      sendError res, error
    else
      send200 res

# create a http request handler that is capable of routing request to the
# correct functions
# After getting the document name, `req` will have params which contain name of
# the document
makeDispatchHandler = (createClient, options) ->
  (req, res, next) ->
    if name = matchDocName(req.url, options.base)
      req.params or= {}
      req.params.name = name
      version = matchVersion(req.url)
      unless version == undefined
        req.params.version = version
      switch req.method
        when 'GET', 'HEAD' then auth req, res, createClient, getDocument
        when 'PUT' then auth req, res, createClient, putDocument
        when 'POST' then auth req, res, createClient, postDocument
        when 'DELETE' then auth req, res, createClient, deleteDocument
        else next()
    else if result = matchDocNameWithVersions(req.url, options.base)
      {name, every} = result
      req.params or= {}
      req.params.name = name
      req.params.every = every
      switch req.method
        when 'GET' then auth req, res, createClient, getDocumentVersions
        else next()
    else
      next()

module.exports = makeDispatchHandler
