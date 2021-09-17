#!/usr/bin/env node

const assert = require("./util/assert.js");

const testConsole = new (require("./util/instrumented-console.js"))(console);

const ConsoleBuffer = require('../index.js');

const consoleBuffer = ConsoleBuffer(testConsole, NaN, '[[ConsoleBuffer]] ');

assert(testConsole.isEmpty(), "Empty at start");

['log', 'info', 'warn', 'error'].forEach(function(k) {
  // process.stdout.write('Testing ' + k);
  // process.stdout.write(' data should appear at the end of the output\n');
  consoleBuffer[k]('Hello %s!', k);
});

// process.stdout.write('Testing table data should appear at the end of the output\n');
consoleBuffer.table({hello: "table"});


assert(testConsole.isEmpty(), "Empty before flush");

consoleBuffer.flush();

assert(testConsole.outputEquals([
  ["[[ConsoleBuffer]] Hello log!"],
  ["[[ConsoleBuffer]] Hello info!"],
  [`[[ConsoleBuffer]] ┌─────────┬─────────┐
[[ConsoleBuffer]] │ (index) │ Values  │
[[ConsoleBuffer]] ├─────────┼─────────┤
[[ConsoleBuffer]] │  hello  │ 'table' │
[[ConsoleBuffer]] └─────────┴─────────┘`],
]), "STDOUT OK");

assert(testConsole.errorEquals([
  ["[[ConsoleBuffer]] Hello warn!"],
  ["[[ConsoleBuffer]] Hello error!"],
]), "STRERR OK");
