'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toBeUndefined: should be safe facing a string', function (assert) {
  var input =
    "Expected 'defined' to be undefined." +
    stack;
  var expected =
    "Expected <a>'defined'</a> to be <e>undefined</e>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
