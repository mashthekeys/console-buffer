@mashthekeys/console-buffer
==========

[![NPM](https://nodei.co/npm/@mashthekeys/console-buffer.png)](https://nodei.co/npm/@mashthekeys/console-buffer/)

Buffer calls to `console.log`, `console.warn`, etc. for deferred logging in NodeJS and web browsers.
Forked to provide ConsoleBuffer constructor independently of replacing the global console.

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

Bundle `index.js` with Browserify in standalone mode, which should include a copy of the NodeJS `util` module to be used inside this module. The main bundle (`console-buffer.js`) and an UglifyJS2 minified version (`console-buffer.min.js`) will be saved to the `dist` directory.

You can just run the included NPM script which does this:

```bash
npm run bundle
```

Example
-------

In NodeJS
```js
require('@mashthekeys/console-buffer')(console);
console.log('Hello'); // Buffered
console.log('world'); // Buffered
// Flushed at exit or 8k of data
```

Customization
-------------

### Patch custom console

To patch a custom console or logger instance, pass the instance as the first parameter.

```js
const logger = require('some-package')();

const buffer = require('@mashthekeys/console-buffer')(logger);
logger.log('Hello'); // Buffered
logger.log('world'); // Buffered
// Flushed at exit or 8k of data
// or by calling buffer.flush();
```

### Buffer Size Limit

You can specify an alternative buffer size to use for automatic flushing like
this:

```js
require('@mashthekeys/console-buffer')(console, 4096); // Buffer will flush at 4k
```

### Prefixing Logs

You can specify a string or callback function which returns a string which will prefix all logs.

Specify a string. Here, all log statements will be prepended `MyLog: ` when flushed:

```js
require('@mashthekeys/console-buffer')(console, 4096, 'MyLog: ');
```

Specify a callback function which returns a string. Here, all log statements will be prepended by `2021-06-27T12:44:46.123Z: ` as an example:

```js
require('@mashthekeys/console-buffer')(console, 4096, function() {
	return new Date().toISOString() + ': ';
});
```

### Manually Flushing the Buffer

This module also exposes the `flush` function used to flush all buffers, so you can manually invoke a flush:

``` js
const logBuffer = require('@mashthekeys/console-buffer')(console);
console.log('hello'); // Buffered
console.log('world'); // Buffered
logBuffer.flush(); // Flushed
```

Also, you can specify an interval to automatically flush all buffers so logs
don't get held in memory indefinitely.

``` js
const logBuffer = require('@mashthekeys/console-buffer')(console);
setInterval(function() {
  logBuffer.flush();
}, 5000); // Flush every 5 seconds
```

This will flush automatically at 8k of data as well as every 5 seconds.

### Flushing the Buffer Without Logging

`logBuffer.clear()` will empty the contents of the buffer without logging them to the console.