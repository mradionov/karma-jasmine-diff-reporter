'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formater = require('./helpers/test-formatter')();

// Issue #10 with Phantom JS
test('stacktrace: dont capture stacktrace without "at"', function (assert) {
  var input =
    "Expected true to be false." +
    "\ncheck@/path/to/file.js:42:0";
  var expected =
    "Expected <a>true</a> to be <e>false</e>." +
    "\ncheck@/path/to/file.js:42:0";

  var out = diff(input, formater);

  assert.equal(out, expected);
  assert.end();
});
