const util = require('util');
const nsTable = require("nodestringtable");

let global_process;
try {
  global_process = process;
} catch (referenceError) {}

function ConsoleBuffer(console, limit = NaN, prefix = null) {
  if (!new.target) {
    return new ConsoleBuffer(console, limit, prefix);
  }

  this._buffer = [];
  this._console = console;
  this._consoleMethods = Object.getPrototypeOf(console);

  this._limit = limit;
  this._prefix = prefix;
  this._size = 0;

  if (global_process != null) {
    global_process.on('exit', this._processExitListener = () => this.flush());
  }
}

ConsoleBuffer.prototype.$queue = function(name, args) {
  let message;

  if (name === "table") {
    message = nsTable.apply(null, args);

    name = "info";
  } else {
    message = util.format.apply(null, args);
  }

  let prefix;

  if (this._prefix != null) {
    if (typeof this._prefix === "function") {
      prefix = String(this._prefix());
    } else {
      prefix = String(this._prefix);
    }
  } else {
    prefix = "";
  }

  if (this._indent) {
    prefix += " ".repeat(this._indent);
  }

  if (prefix != null && prefix.length) {
    message = prefix + message.replace(/\n/g, "\n" + prefix);
  }

  // calculate the new length in characters
  this._size += message.length;

  // push the data, and flush if > limit
  this._buffer.push([name, message]);

  if (this._size > this._limit) this.flush();
};

/** console.clear() empties the buffer */
ConsoleBuffer.prototype.clear = function() {
  this._buffer = [];
  this._size = 0;
};

/** console.flush() outputs and empties the buffer */
ConsoleBuffer.prototype.flush = function() {
  const console = this._console;
  const methods = this._consoleMethods;

  for (let i = 0; i < this._buffer.length; ++i) {
    const [method, message] = this._buffer[i];

    // if (method in methods) {
      methods[method].call(console, message);
    // } else {
      // console[method](message);
    // }
  }

  this.clear();
};

/** console.read() converts the buffer to string. */
ConsoleBuffer.prototype.read = function() {
  return this._buffer.map(([,message]) => message).join("\n");
};

// Most console function pass through to $queue
ConsoleBuffer.prototype.debug = function() { this.$queue("debug", arguments) };

ConsoleBuffer.prototype.error = function() { this.$queue("error", arguments) };

ConsoleBuffer.prototype.info = function() { this.$queue("info", arguments) };

ConsoleBuffer.prototype.group = function() {
  this.$queue("group", arguments);

  this._indent += 4;
};

ConsoleBuffer.prototype.groupEnd = function() {
  this._indent = Math.max(0, (this._indent | 0) - 4);

  this._buffer.push(["groupEnd", void undefined]);
};

ConsoleBuffer.prototype.log = function() { this.$queue("log", arguments) };

ConsoleBuffer.prototype.table = function() { this.$queue("table", arguments) };

ConsoleBuffer.prototype.warn = function() { this.$queue("warn", arguments) };


ConsoleBuffer.prototype.patchConsole = function (name) {
  this._console[name] = (...args) => this[name](...args);
};

ConsoleBuffer.prototype.patch = function () {
  // this.limit = limit !== null ? limit : 8192;
  // this.prefix = prefix;
  this.patchConsole("log");
  this.patchConsole("warn");
  this.patchConsole("error");
  this.patchConsole("info");
  this.patchConsole("table");
  this.patchConsole("group");
  this.patchConsole("groupEnd");
};

module.exports = ConsoleBuffer;
