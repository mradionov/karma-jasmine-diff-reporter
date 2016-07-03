'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');
var markJSON = require('./helpers/mark').markJSON;

// When using "json" option bypassing Jasmine default pretty-printer
// we get actual args for toHaveBeenCalledWith wrapped in extra array
test('json: cut square brackets from actual for thbcw', function (assert) {
  var input =
    "Expected spy foo to have been called with [false]" +
    " but actual calls were [[true]]." +
    stack;
  var expected =
    "Expected spy foo to have been called with <d>[</d><e>false</e><d>]</d>" +
    " but actual calls were <d>[</d><a>true</a><d>]</d>." +
    stack;

  var out = diff(input, formatter, { json: true });

  assert.equal(out, expected);
  assert.end();
});

test('json: do not cut square brackets for arrays', function (assert) {
  var input =
    "Expected [['foo']] to equal [['bar']]." +
    stack;
  var expected =
    "Expected <d>[['</d><a>foo</a><d>']]</d>" +
    " to equal <d>[['</d><e>bar</e><d>']]</d>." +
    stack;

  var out = diff(input, formatter, { json: true });

  assert.equal(out, expected);
  assert.end();
});

test('json: process marked strings with quotes inside', function(assert) {
  var input =
    'Expected "' + markJSON('\\"f\\"o\\"') + '"' +
    ' to be "' + markJSON('\\"b\\"a\\"') + '".' +
    stack;

  var expected =
    'Expected <d>"\\"</d><a>f</a><d>\\"</d><a>o</a><d>\\""</d>' +
    ' to be <d>"\\"</d><e>b</e><d>\\"</d><e>a</e><d>\\""</d>.' +
    stack;

  var out = diff(input, formatter, { json: true });

  assert.equal(out, expected);
  assert.end();
});
