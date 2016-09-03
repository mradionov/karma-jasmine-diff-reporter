'use strict';

var test = require('tape');
var format = require('../../src/format');
var formater = require('../helpers/test-formatter')();

// Issue #10 with Phantom JS
test('format: don\'t capture stacktrace without "at"', function (assert) {
  var input =
    "Expected true to be false." +
    "\ncheck@/path/to/file.js:42:0";
  var expected =
    "Expected <a>true</a> to be <e>false</e>." +
    "\ncheck@/path/to/file.js:42:0";

  var out = format(input, formater);

  assert.equal(out, expected);
  assert.end();
});
