'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');
var mark = require('./helpers/mark').mark;

test('marker: clear when processed', function (assert) {
  var input =
    "Expected " + mark('foo') + " to be " + mark('bar') + "." +
    stack;
  var expected =
    "Expected <d>'</d><a>foo</a><d>'</d> to be <d>'</d><e>bar</e><d>'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('marker: clear when unknown matcher', function (assert) {
  var input =
    "Unknown message format " + mark('foo') + " with marked string." +
    stack;
  var expected =
    "Unknown message format 'foo' with marked string." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('marker: clear when unwanted matcher', function (assert) {
  var input =
    "Expected " + mark('foo') + " to be falsy." +
    stack;
  var expected =
    "Expected 'foo' to be falsy." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
