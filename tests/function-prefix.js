#!/usr/bin/env node

const assert = require("./util/assert.js");

const testConsole = new (require("./util/instrumented-console.js"))(console);

const ConsoleBuffer = require('../index.js');

let line = 0;

const consoleBuffer = ConsoleBuffer(testConsole, NaN, function() { return `${++line}: ` });
// const consoleBuffer = ConsoleBuffer(testConsole, NaN, function() { return '[' + new Date().toISOString() + '] '; });

assert(testConsole.isEmpty(), "Empty at start");

consoleBuffer.group("test");

['log', 'info', 'warn', 'error'].forEach(function(k) {
  // process.stdout.write('Testing ' + k);
  // process.stdout.write(' data should appear at the end of the output');
  consoleBuffer[k]('Hello %s!', k);
});

consoleBuffer.groupEnd();


consoleBuffer.table({hello: "table"});

assert(testConsole.isEmpty(), "Empty before flush");

consoleBuffer.flush();

assert(testConsole.outputEquals([
  ["1: test"],
  ["2: Hello log!"],
  ["3: Hello info!"],
[`6: ┌─────────┬─────────┐
6: │ (index) │ Values  │
6: ├─────────┼─────────┤
6: │  hello  │ 'table' │
6: └─────────┴─────────┘`],
]), "STDOUT OK");

assert(testConsole.errorEquals([
  ["4: Hello warn!"],
  ["5: Hello error!"],
]), "STRERR OK");
