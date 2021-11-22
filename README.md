ShareJS [![Build Status](https://secure.travis-ci.org/conversation/ShareJS.png?branch=master)](http://travis-ci.org/conversation/ShareJS)
=======

**This is a fork of version 0.6.3 of the original [ShareJS](https://github.com/josephg/ShareJS) library.**

ShareJS is a little server (& client library) to allow concurrent editing of any kind of content. The server runs on NodeJS and the client works in NodeJS or a web browser.

ShareJS currently supports operational transform on plain-text and arbitrary JSON data.

Browser support
---------------

ShareJS **should** work with all of them ![logos of all of all the browsers](http://twitter.github.com/bootstrap/assets/img/browsers.png)

That said, I only test regularly with FF, Safari and Chrome, and occasionally with IE8+. **File bug reports if you have issues**


Developing locally
------------------

Install required packages, and compile the web client code:

    npm install

Run the simple example server which includes basic clients with:

    ./bin/exampleserver

Run a standalone example server by first creating a postgres database, then running the example server itself:

    createdb sharejs_example
    ./bin/sharejs

See `bin/options.js` for how to configure the example server.

If you need to re-compile the web client code, just run `npm install` again, or alternatively you can use `npm run prepublish`.

Running tests
-------------

This project uses a pretty old version of nodeunit, but all tests can easily be run with:

    npm run test

Running a server
----------------

There are two ways to run a sharejs server:

1. Embedded in a node.js server app:

    ```javascript
    var connect = require('connect'),
        sharejs = require('share').server;

    var app = connect(
          connect.logger(),
          connect.static(__dirname + '/my_html_files')
        );

    var options = {db: {type: 'none'}}; // See docs for options. {type: 'pg'} to enable persistance.

    // Attach the sharejs REST and Socket.io interfaces to the server
    server = sharejs.attach(app, options);

    server.listen(9000);
    console.log('Server running at http://127.0.0.1:9000/');
    ```
    The above script will start up a ShareJS server on port 9000 which hosts static content from the `my_html_files` directory. See [bin/exampleserver](https://github.com/josephg/ShareJS/blob/master/bin/exampleserver) for a more complex configuration example.

    > See the [Connect](http://senchalabs.github.com/connect/) or [Express](http://expressjs.com/) documentation for more complex routing.

2. From the command line:

        # sharejs
    Configuration is pulled from a configuration file that can't be easily edited at the moment. For now, I recommend method #1 above.

3. If you are just mucking around, run:

        # sharejs-exampleserver

    This will run a simple server on port 8000, and host all the example code there. Run it and check out http://localhost:8000/ . The example server stores everything in ram, so don't get too attached to your data.

    > If you're running sharejs from source, you can launch the example server by running `bin/exampleserver`.


Putting Share.js on your website
--------------------------------

If you want to get a simple editor working in your webpage with sharejs, here's what you need to do:

First, get an ace editor on your page:

```html
<div id="editor"></div>
```

Your web app will need access to the following JS files:

- Ace (http://ace.ajax.org/)
- Browserchannel
- ShareJS client and ace bindings.

Add these script tags:

```html
<script src="http://ajaxorg.github.com/ace/build/src/ace.js"></script>
<script src="/channel/bcsocket.js"></script>
<script src="/share/share.js"></script>
<script src="/share/ace.js"></script>
```

And add this code:

```html
<script>
    var editor = ace.edit("editor");

    sharejs.open('hello', 'text', function(error, doc) {
        doc.attach_ace(editor);
    });
</script>
```

> **NOTE:** If you're using version 0.4 or earler, the argument order is the other way around (`function(doc, error)`).

Thats about it :)

The easiest way to get your code running is to check sharejs out from source and put your html and css files in the `examples/` directory. Run `bin/exampleserver` to launch the demo server and browse to http://localhost:8000/your-app.html .

See the [wiki](https://github.com/josephg/ShareJS/wiki) for documentation.

Its also possible to use sharejs without ace. See the textarea example for details.

Writing a client using node.js
------------------------------

The client API is the same whether you're using the web or nodejs.

Here's an example application which opens a document and inserts some text in it. Every time an op is applied to the document, it'll print out the document's version.

Run this from a couple terminal windows when sharejs is running to see it go.

```javascript
var client = require('share').client;

// Open the 'hello' document, which should have type 'text':
client.open('hello', 'text', 'http://localhost:8000/sjs', function(error, doc) {
    // Insert some text at the start of the document (position 0):
    doc.insert("Hi there!\n", 0);

    // Get the contents of the document for some reason:
    console.log(doc.snapshot);

    doc.on('change', function(op) {
        console.log('Version: ' + doc.version);
    });

    // Close the doc if you want your node app to exit cleanly
    // doc.close();
});
```

> **NOTE:** If you're using version 0.4 or earler, the argument order is the other way around (`function(doc, error)`).

See [`the wiki`](https://github.com/josephg/ShareJS/wiki) for API documentation, and `examples/node*` for some more example apps.


