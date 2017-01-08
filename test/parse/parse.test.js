'use strict';

var tape = require('tape');

var parse = require('../../src/parse');
var Value = require('../../src/value');

var test = function (name, body) {
  return tape('parse: ' + name, body);
};

test('boolean true', function (assert) {
  var value = parse('true');
  assert.equal(value.type, Value.BOOLEAN);
  assert.end();
});

test('boolean false', function (assert) {
  var value = parse('false');
  assert.equal(value.type, Value.BOOLEAN);
  assert.end();
});

test('undefined', function (assert) {
  var value = parse('undefined');
  assert.equal(value.type, Value.UNDEFINED);
  assert.end();
});

test('null', function (assert) {
  var value = parse('null');
  assert.equal(value.type, Value.NULL);
  assert.end();
});

test('jasmine defined', function (assert) {
  var value = parse('defined');
  assert.equal(value.type, Value.DEFINED);
  assert.end();
});

test('jasmine truthy', function (assert) {
  var value = parse('truthy');
  assert.equal(value.type, Value.TRUTHY);
  assert.end();
});

test('jasmine falsy', function (assert) {
  var value = parse('falsy');
  assert.equal(value.type, Value.FALSY);
  assert.end();
});

test('jasmine close to', function (assert) {
  var value = parse('close to 5');
  assert.equal(value.type, Value.CLOSE_TO);
  assert.end();
});

test('jasmine greater than', function (assert) {
  var value = parse('greater than 5');
  assert.equal(value.type, Value.GREATER_THAN);
  assert.end();
});

test('jasmine less than', function (assert) {
  var value = parse('less than 5');
  assert.equal(value.type, Value.LESS_THAN);
  assert.end();
});

test('number', function (assert) {
  var value = parse('42');
  assert.equal(value.type, Value.NUMBER);
  assert.end();
});
