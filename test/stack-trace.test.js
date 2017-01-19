'use strict';

var createTest = require('./helpers/test');

var test = createTest('stacktrace:');

// Issue #10 with Phantom JS
test('don\'t capture stacktrace without "at"',

  `Expected true to be false.`,

  `Expected <a>true</a> to be <e>false</e>.`,

  { stack: `\ncheck@/path/to/file.js:42:0` }
);

// Note: this behavior is a bit weird comparing to toBeUndefined and others -
// that equal parts are highlighted with default colors. Not critical
// test('toEqual: no diff for equal objects', function (assert) {
//   var input =
//     "Expected Object({ foo: 'bar' }) not to equal Object({ foo: 'bar' })." +
//     stack;
//   var expected =
//     "Expected <d>Object({ foo: 'bar' })</d>" +
//     " not to equal <d>Object({ foo: 'bar' })</d>." +
//     stack;

//   var out = diff(input, formatter);

//   assert.equal(out, expected);
//   assert.end();
// });
//