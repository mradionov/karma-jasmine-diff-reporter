'use strict';

var test = require('tape');

var parse = require('../../src/parse');
var Pair = require('../../src/pair');
var Value = require('../../src/value');

test('parse: any: unknown', function (assert) {
  var value = parse('<jasmine.any(Foo)>');
  assert.equal(value.type, Value.INSTANCE);
  assert.equal(value.any, true);
  assert.end();
});

test('parse: any: bool', function (assert) {
  var value = parse('<jasmine.any(Boolean)>');
  assert.equal(value.type, Value.BOOLEAN);
  assert.equal(value.any, true);
  assert.end();
});

test('parse: any: function', function (assert) {
  var value = parse('<jasmine.any(Function)>');
  assert.equal(value.type, Value.FUNCTION);
  assert.equal(value.any, true);
  assert.end();
});

