'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toHaveBeenCalledWith: bools', function (assert) {
  var input =
    "Expected spy foo to have been called with [ false ]" +
    " but actual calls were [ true ]." +
    stack;
  var expected =
    "Expected spy foo to have been called with <d>[ </d><e>false</e><d> ]</d>" +
    " but actual calls were <d>[ </d><a>true</a><d> ]</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toHaveBeenCalledWith: objects', function (assert) {
  var input =
    "Expected spy foo to have been called with" +
    " [ Object({ foo: 'bar' }) ]" +
    " but actual calls were" +
    " [ Object({ baz: 'qux' }) ]." +
    stack;
  var expected =
    "Expected spy foo to have been called with" +
    " <d>[ Object({ </d><e>foo</e><d>: '</d><e>bar</e><d>' }) ]</d>" +
    " but actual calls were" +
    " <d>[ Object({ </d><a>baz</a><d>: '</d><a>qux</a><d>' }) ]</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
