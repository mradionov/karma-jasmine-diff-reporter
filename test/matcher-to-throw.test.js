'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toThrow: without message', function (assert) {
  var input =
    "Expected function to throw" +
    " TypeError: foo," +
    " but it threw" +
    " ReferenceError: a is not defined." +
    stack;
  var expected =
    "Expected function to throw" +
    " <e>TypeError</e><d>: </d><e>foo</e>," +
    " but it threw" +
    " <a>ReferenceError</a><d>: </d><a>a</a><aw> </aw><a>is</a><aw> </aw><a>not</a><aw> </aw><a>defined</a>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toThrow: with message', function (assert) {
  var input =
    "Expected function to throw" +
    " TypeError with message 'foo'," +
    " but it threw" +
    " ReferenceError with message 'bar'." +
    stack;
  var expected =
    "Expected function to throw" +
    " <e>TypeError</e><d> with message '</d><e>foo</e><d>'</d>," +
    " but it threw" +
    " <a>ReferenceError</a><d> with message '</d><a>bar</a><d>'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
