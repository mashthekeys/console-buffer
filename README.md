console-buffer
==========

Buffer calls to `console.log`, `console.warn`, etc. for deferred logging in NodeJS and web browsers.

Description
-----------

Calls to `console` methods are synchronous, and as such,
will block the event loop while the data is being written to a file, terminal,
socket, pipe, etc.

This module provides a seamless, drop-in buffer for all calls to the
following `console` functions, and automatically flushes the buffer when it exceeds a certain size (8k by
default). In NodeJS, the buffer also flushes when the process exits.

- `console.log`
- `console.info`
- `console.warn`
- `console.error`
- `console.table`

Building for Browsers
---------------------

Bundle `index.js` with Browserify in standalone mode, which should include a copy of the NodeJS `util` module to be used inside this module. The main bundle (`consoleBuffer.js`) and an UglifyJS2 minified version (`consoleBuffer.min.js`) will be saved to the `dist` directory.

You can just run the included NPM script which does this:

```bash
npm run bundle
```

Example
-------

In NodeJS
``` js
require('console-buffer');
console.log('Hello'); // Buffered
console.log('world'); // Buffered
// Flushed at exit or 8k of data
```

In Browsers
``` js
console.log('Hello'); // Buffered
console.log('world'); // Buffered
// Flushed manually or at 8k of data (no automatic flush on exit)
logbuffer.flush(); // Flushed
```

`console._LOG_BUFFER` is also defined when this module is included for the first time, and is set to the module.
```js
require('console-buffer');
console.log('Hello'); // Buffered
console.log('world'); // Buffered
console._LOG_BUFFER.flush() // Flushed
```

Customization
-------------

If using the module in web browsers, you can replace any of the following `require(...)(...)` with `consoleBuffer(...)`.

### Buffer Size Limit

You can specify an alternative buffer size to use for automatic flushing like
this:

``` js
require('console-buffer')(4096); // Buffer will flush at 4k
```

### Prefixing Logs

You can specify a string or callback function which returns a string which will prefix all logs.

Specify a string. Here, all log statements will be prepended `MyLog: ` when flushed:

```js
require('console-buffer')(4096, 'MyLog: ');
```

Specify a callback function which returns a string. Here, all log statements will be prepended by `2013-04-27T04:37:24.703Z: ` as an example:

``` js
require('console-buffer')(4096, function() {
	return new Date().toISOString() + ': ';
});
```

### Manually Flushing the Buffer

This module also exposes the `flush` function used to flush all buffers, so you can manually invoke a flush:

``` js
const logbuffer = require('console-buffer');
console.log('hello'); // Buffered
console.log('world'); // Buffered
logbuffer.flush(); // Flushed
```

Also, you can specify an interval to automatically flush all buffers so logs
don't get held in memory indefinitely.

``` js
const logbuffer = require('console-buffer');
setInterval(function() {
  logbuffer.flush();
}, 5000); // Flush every 5 seconds
```

This will flush automatically at 8k of data as well as every 5 seconds.