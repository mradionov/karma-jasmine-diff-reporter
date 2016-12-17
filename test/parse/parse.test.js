'use strict';

var test = require('tape');

var parse = require('../../src/parse');
var Value = require('../../src/value');

test('parse: unknown', function (assert) {
  var value = parse('foo');
  assert.equal(value.type, Value.UNKNOWN);
  assert.end();
});

test('parse: boolean true', function (assert) {
  var value = parse('true');
  assert.equal(value.type, Value.BOOLEAN);
  assert.end();
});

test('parse: boolean false', function (assert) {
  var value = parse('false');
  assert.equal(value.type, Value.BOOLEAN);
  assert.end();
});

test('parse: undefined', function (assert) {
  var value = parse('undefined');
  assert.equal(value.type, Value.UNDEFINED);
  assert.end();
});

test('parse: null', function (assert) {
  var value = parse('null');
  assert.equal(value.type, Value.NULL);
  assert.end();
});

test('parse: jasmine defined', function (assert) {
  var value = parse('defined');
  assert.equal(value.type, Value.DEFINED);
  assert.end();
});

test('parse: jasmine truthy', function (assert) {
  var value = parse('truthy');
  assert.equal(value.type, Value.TRUTHY);
  assert.end();
});

test('parse: jasmine falsy', function (assert) {
  var value = parse('falsy');
  assert.equal(value.type, Value.FALSY);
  assert.end();
});

test('parse: jasmine close to', function (assert) {
  var value = parse('close to 5');
  assert.equal(value.type, Value.CLOSE_TO);
  assert.end();
});

test('parse: jasmine greater than', function (assert) {
  var value = parse('greater than 5');
  assert.equal(value.type, Value.GREATER_THAN);
  assert.end();
});

test('parse: jasmine less than', function (assert) {
  var value = parse('less than 5');
  assert.equal(value.type, Value.LESS_THAN);
  assert.end();
});

test('parse: number', function (assert) {
  var value = parse('42');
  assert.equal(value.type, Value.NUMBER);
  assert.end();
});
