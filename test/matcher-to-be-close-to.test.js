'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toBeCloseTo: no diff', function (assert) {
  var input =
    "Expected 3 to be close to 5." +
    stack;
  var expected =
    "Expected 3 to be close to 5." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
