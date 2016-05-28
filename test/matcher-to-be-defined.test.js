'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toBeDefined: no diff', function (assert) {
  var input =
    "Expected undefined to be defined." +
    stack;
  var expected =
    "Expected undefined to be defined." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
