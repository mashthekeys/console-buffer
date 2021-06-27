const nodestringtable = require("nodestringtable");

class InstrumentedConsole {
  constructor(console) {
    this.console = console;
    this.stdout = [];
    this.stderr = [];
  }

  // Testing API
  outputEquals(expectedValue) {
    return JSON.stringify(this.stdout) === JSON.stringify(expectedValue);
  }
  errorEquals(expectedValue) {
    return JSON.stringify(this.stderr) === JSON.stringify(expectedValue);
  }

  // Console API
  error(...args) {
    this.stderr.push(args);
    this.console.error(...args);
  }

  group(...args) {
    this.stdout.push("[");
    this.console.group(...args);
  }

  groupEnd(...args) {
    this.stdout.push("]");
    this.console.groupEnd(...args);
  }

  info(...args) {
    this.stdout.push(args);
    this.console.info(...args);
  }

  log(...args) {
    this.stdout.push(args);
    this.console.log(...args);
  }

  table(...args) {
    this.stdout.push([nodestringtable(...args)]);
    this.console.table(...args);
  }

  warn(...args) {
    this.stderr.push(args);
    this.console.warn(...args);
  }
}

module.exports.InstrumentedConsole = InstrumentedConsole;

module.exports.instrumentedConsole = new InstrumentedConsole(console);
