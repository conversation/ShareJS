// ShareJS options
module.exports = {
	// Port to listen on
	port: 9000,

	// Database options
	db: {
		// DB type. Options are 'postgres' or 'none'.
    //
    // If you don't want a database, you can also say db: null. With no database,
    // all documents are deleted when the server restarts.
    type: 'pg',

    // Uses postgres over unix socket by default, you must `createdb sharejs_example`
    // manually first, the tables will be created automatically.
    schema: "public",
    database: "sharejs_example",
    host: "/var/run/postgresql",
    operations_table: 'operations',
    snapshot_table: 'snapshots',

    // If you prefer to use postgres over TCP/IP, you can just pass in a connectionString
    // instead of the database name and host shown above:
    //connectionString: "postgres://user@db_host:5432/db_name"

    // By default, sharejs will create its tables in a schema called 'sharejs'.
    //schema: 'sharejs',
	},

	// The server will statically host webclient/ directory at /share/*.
	// (Eg, the web client can be found at /share/share.js).
	// Set staticpath: null to disable.
	staticpath: '/share',

	// REST frontend options. Set rest: null to disable REST frontend.
	rest: {
	},

	// SocketIO frontend options. Set socketio: null to disable socketIO frontend.
	socketio: {
	  // Specify tuples for io.configure:
	  // 'transports': ['xhr-polling', 'flashsocket']
	},

  // Browserchannel server options. Set browserChannel:null to disable browserchannel.
  browserChannel: {},

  // Websocket server options. Set websocket:null to disable websocket support.
  websocket: {
    headers: { "Access-Control-Allow-Origin": "*" },
  },

	// Authentication code to test if clients are allowed to perform different actions.
	// See documentation for details.
	//auth: function(client, action) {
	//	action.allow();
	//}
}
