'use strict';

var tape = require('tape');

var format = require('../../src/format');
var formatter = require('../helpers/test-formatter')();
var stack = require('../helpers/stack');
var m = require('../../src/marker').wrapString;

var test = function (name, body) {
  return tape('format: toBe: ' + name,  body);
};

test('booleans', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected <a>true</a> to be <e>false</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('strings', function (assert) {
  var input =
    "Expected " + m('foo') + " to be " + m('bar') + "." +
    stack;
  var expected =
    "Expected '<a>foo</a>' to be '<e>bar</e>'." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('undefined facing a string', function (assert) {
  var input =
    "Expected " + m('defined') + " to be undefined." +
    stack;
  var expected =
    "Expected <a>'defined'</a> to be <e>undefined</e>." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('defined', function (assert) {
  var input =
    "Expected undefined to be defined." + stack;
  var expected =
    "Expected <a>undefined</a> to be <e>defined</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('truthy', function (assert) {
  var input =
    "Expected false to be truthy." + stack;
  var expected =
    "Expected <a>false</a> to be <e>truthy</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('falsy', function (assert) {
  var input =
    "Expected true to be falsy." + stack;
  var expected =
    "Expected <a>true</a> to be <e>falsy</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('close to', function (assert) {
  var input =
    "Expected 3 to be close to 5." + stack;
  var expected =
    "Expected <a>3</a> to be <e>close to 5</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('greater than', function (assert) {
  var input =
    "Expected 3 to be greater than 5." + stack;
  var expected =
    "Expected <a>3</a> to be <e>greater than 5</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('less than', function (assert) {
  var input =
    "Expected 5 to be less than 3." + stack;
  var expected =
    "Expected <a>5</a> to be <e>less than 3</e>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('objects by ref', function (assert) {
  var input =
    "Expected Object({ foo: 42 }) to be Object({ foo: 42 })." +
    stack;
  var expected =
    "Expected <r>Object({ foo: 42 })</r> to be <r>Object({ foo: 42 })</r>." +
    stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('arrays by ref', function (assert) {
  var input =
    "Expected [1, 2, 3] to be [1, 2, 3]." + stack;
  var expected =
    "Expected <r>[1, 2, 3]</r> to be <r>[1, 2, 3]</r>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('functions by ref', function (assert) {
  var input =
    "Expected Function to be Function." + stack;
  var expected =
    "Expected <r>Function</r> to be <r>Function</r>." + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
