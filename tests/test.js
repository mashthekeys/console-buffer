#!/usr/bin/env node

const nodestringtable = require("nodestringtable");
const {instrumentedConsole} = require("./util/instrumented-console");

const bufferedConsole = require('../')(instrumentedConsole);

['log', 'info', 'warn', 'error'].forEach(function(k, i) {
  process.stdout.write('Testing ' + k);
  process.stdout.write(' data should appear at the end of the output\n');
  instrumentedConsole[k]('Hello %s %d', 'world', i);
});
process.stdout.write('Testing table data should appear at the end of the output\n');
instrumentedConsole.table({hello: "world 4"});

// Output should be empty before flush
assert(instrumentedConsole.outputEquals([]));
assert(instrumentedConsole.errorEquals([]));

bufferedConsole.flush();

assert(instrumentedConsole.outputEquals([
  ["Hello world 0"],
  ["Hello world 1"],
  [nodestringtable({hello:"world 4"})]
]))
assert(instrumentedConsole.errorEquals([
  ["Hello world 2"],
  ["Hello world 3"],
]))

process.stdout.write('PASSED\n');
process.exit(0);

function assert(expression) {
  if (!expression) throw new Error("Test failed");
}