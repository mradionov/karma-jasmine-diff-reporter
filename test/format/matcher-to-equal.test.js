'use strict';

var test = require('tape');

var format = require('../../src/format');
var formatter = require('../helpers/test-formatter')();
var stack = require('../helpers/stack');
var m = require('../../src/marker').wrapString;

test('format: toEqual: booleans', function (assert) {
  var input =
    "Expected true to equal false." + stack;
  var expected =
    "Expected <a>true</a> to equal <e>false</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: strings', function (assert) {
  var input =
    "Expected " + m('foo') + " to equal " + m('bar') + "." +
    stack;
  var expected =
    "Expected '<a>foo</a>' to equal '<e>bar</e>'." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: arrays', function (assert) {
  var input =
    "Expected [1, 2, 3] to equal [1, 4, 3]." + stack;
  var expected =
    "Expected [1, <a>2</a>, 3] to equal [1, <e>4</e>, 3]." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: nested arrays', function (assert) {
  var input =
    "Expected [1, [2, [3, 4]]] " +
    "to equal [1, [5, [7, 4]]]." +
    stack;
  var expected =
    "Expected [1, [<a>2</a>, [<a>3</a>, 4]]] " +
    "to equal [1, [<e>5</e>, [<e>7</e>, 4]]]." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: objects', function (assert) {
  var input =
    "Expected Object({ foo: 42 }) to equal Object({ foo: 43 })." +
    stack;
  var expected =
    "Expected Object({ foo: <a>42</a> }) to equal Object({ foo: <e>43</e> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: different objects', function (assert) {
  var input =
    "Expected Object({ foo: 42 }) to equal Object({ bar: 33 })." +
    stack;
  var expected =
    "Expected Object({ <a>foo: 42</a> }) to equal Object({ <e>bar: 33</e> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: objects with different keys', function (assert) {
  var input =
    "Expected Object({ foo: 42 }) to equal Object({ bar: 42 })." +
    stack;
  var expected =
    "Expected Object({ <a>foo: 42</a> }) to equal Object({ <e>bar: 42</e> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: objects with functions', function (assert) {
  var input =
    "Expected Object({ foo: Function }) " +
    "to equal Object({ foo: Function })." +
    stack;
  var expected =
    "Expected Object({ foo: <r>Function</r> }) " +
    "to equal Object({ foo: <r>Function</r> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: object with missing key', function (assert) {
  var input =
    "Expected Object({ foo: 42, bar: 43, qux: 44 }) " +
    "to equal Object({ foo: 42, qux: 44 })." +
    stack;
  var expected =
    "Expected Object({ foo: 42, <a>bar: 43</a>, qux: 44 }) " +
    "to equal Object({ foo: 42, qux: 44 })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: nested objects', function (assert) {
  var input =
    "Expected Object({ foo: Object({ bar: 42, qux: 43 }) }) " +
    "to equal Object({ foo: Object({ bar: 33 }) })." +
    stack;
  var expected =
    "Expected Object({ foo: Object({ bar: <a>42</a>, <a>qux: 43</a> }) }) " +
    "to equal Object({ foo: Object({ bar: <e>33</e> }) })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: objects any function', function (assert) {
  var input =
    "Expected Object({ foo: 42, bar: Function }) " +
    "to equal Object({ foo: 43, bar: <jasmine.any(Function)> })."
    + stack;
  var expected =
    "Expected Object({ foo: <a>42</a>, bar: Function }) " +
    "to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Function)> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: instances', function (assert) {
  var input =
    "Expected Foo({ bar: 42 }) to equal Foo({ foo: 42 })." +
    stack;
  var expected =
    "Expected Foo({ <a>bar: 42</a> }) to equal Foo({ <e>foo: 42</e> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: different instances', function (assert) {
  var input =
    "Expected Foo({ bar: 42 }) to equal Bar({ foo: 42 })." +
    stack;
  var expected =
    "Expected <a>Foo({ bar: 42 })</a> to equal <e>Bar({ foo: 42 })</e>." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: nested instances', function (assert) {
  var input =
    "Expected Foo({ bar: Bar({ qux: 42 }) }) " +
    "to equal Foo({ bar: Bar({ xuq: 42 }) })." +
    stack;
  var expected =
    "Expected Foo({ bar: Bar({ <a>qux: 42</a> }) }) " +
    "to equal Foo({ bar: Bar({ <e>xuq: 42</e> }) })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('format: toEqual: nested instances with different keys', function (assert) {
  var input =
    "Expected Foo({ bar: Bar({ qux: 42 }) }) " +
    "to equal Foo({ baz: Bar({ qux: 42 }) })." +
    stack;
  var expected =
    "Expected Foo({ <a>bar: Bar({ qux: 42 })</a> }) " +
    "to equal Foo({ <e>baz: Bar({ qux: 42 })</e> })." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});