testCase = require('nodeunit').testCase

assert = require 'assert'

server = require '../src/server'
types = require '../src/types'

nativeclient = require '../src/client'
webclient = require './helpers/webclient'

genTests = (client) -> testCase
  setUp: (callback) ->
    # The connection we use in this test is just a dummy object, messages are
    # faked without any real client/server interaction
    @connection = { send: -> {} }
    @doc = new client.Doc(@connection, "test", { type: "json" })

    # Open the document and apply some ops to get it into a working state
    @doc.open()
    @doc._onMessage({ doc: "test", open: true, snapshot: null, type: "json", create: false, v: 1 })
    @doc._onMessage({ doc: "test", op: [
      { "p": [], "oi": {} },
      { "p": ["text"], "oi": "" },
      { "p": ["text", 0], "si": "foo" }
    ], v: 1, meta: { source: "remote" }})

    # Disconnect from the document after setting it up
    @doc.close()
    callback()

  tearDown: (callback) ->
    delete @doc
    callback()

  'receiving a remote op in between open intent and open success message with pending local op': (test) -> 
    console.log(@doc.snapshot)

    # To start with just assert that the document snapshot and type is in the 
    # correct shape as the setup is a bit complex
    test.strictEqual @doc.type.name, "json"
    test.strictEqual @doc.version, 2
    test.deepEqual @doc.snapshot, { text: "foo" }

    # This should set the doc state to "opening" until we hear back from the server
    @doc.open()
    test.strictEqual @doc.state, "opening"

    # "submit" an op (while opening, will be stored as pending op)
    @doc.submitOp { "p": ["text", 3], "si": " bar" }
    test.deepEqual @doc.pendingOp, [{ "p": ["text", 3], "si": " bar" }]

    # Simulate receiving a remote op at version 2 from the server
    @doc._onMessage({ doc: "test", op: [{ "p": ["text", 3], "si": " baz"}], v: 2, meta: { source: "remote" }})

    # It should be stored in @serverOps
    test.deepEqual @doc.serverOps[2], [{ "p": ["text", 3], "si": " baz"}]

    # But does not increment the document version yet
    test.strictEqual @doc.version, 2

    # Simulate the server acknowledging that we opened the document at version 2
    @doc._onMessage({ doc: "test", open: true, v: 2 })

    # Our pending op is transformed by the queued remote server op and applied to the snapshot
    test.deepEqual @doc.snapshot, { text: "foo bar baz" }

    # And our document version should be at 3 now
    test.strictEqual @doc.version, 3
    test.done()

exports.native = genTests nativeclient
exports.webclient = genTests webclient
