'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('toEqual: objects', function (assert) {
  var input =
    "Expected Object({ foo: 'bar' }) to equal Object({ baz: 'qux' })." +
    stack;
  var expected =
    "Expected <d>Object({ </d><a>foo</a><d>: '</d><a>bar</a><d>' })</d>" +
    " to equal <d>Object({ </d><e>baz</e><d>: '</d><e>qux</e><d>' })</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

// Note: this behavior is a bit weird comparing to toBeUndefined and others -
// that equal parts are highlighted with default colors. Not critical
test('toEqual: no diff for equal objects', function (assert) {
  var input =
    "Expected Object({ foo: 'bar' }) not to equal Object({ foo: 'bar' })." +
    stack;
  var expected =
    "Expected <d>Object({ foo: 'bar' })</d>" +
    " not to equal <d>Object({ foo: 'bar' })</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toEqual: no diff for objectContaining', function (assert) {
  var input =
    "Expected Object({ foo: 'bar' }) to equal " +
    "<jasmine.objectContaining(Object({ foo: 'qux' }))>.";
  var expected =
    "Expected Object({ foo: 'bar' }) to equal " +
    "<jasmine.objectContaining(Object({ foo: 'qux' }))>.";

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
