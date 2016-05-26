'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toBeTruthy: no diff', function (assert) {
  var input =
    "Expected false to be truthy." +
    stack;
  var expected =
    "Expected false to be truthy." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
