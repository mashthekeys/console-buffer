#!/usr/bin/env node

require('../')(console, null, function() { return '[' + new Date().toISOString() + '] '; });
console.group("test");
['log', 'info', 'warn', 'error'].forEach(function(k) {
  process.stdout.write('Testing ' + k);
  process.stdout.write(' data should appear at the end of the output\n');
  console[k]('Hello %s!', 'world');
});
console.groupEnd();
process.stdout.write('Testing table data should appear at the end of the output\n');
console.table({hello:"world"});