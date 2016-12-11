'use strict';

var test = require('tape');

var parse = require('../../src/parse');
var Pair = require('../../src/pair');
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

test('parse: array', function (assert) {
  var value = parse('[1, 2, 3]');
  assert.equal(value.type, Value.ARRAY);
  assert.deepEqual(value.children, [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.NUMBER, '2')),
    new Pair(2, new Value(Value.NUMBER, '3'))
  ]);
  assert.end();
});

test('parse: nested arrays', function (assert) {
  var value = parse('[1, [2, [3, 4]], 5]');
  assert.equal(value.type, Value.ARRAY);
  assert.deepEqual(value.children, [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.ARRAY, '[2, [3, 4]]', [
      new Pair(0, new Value(Value.NUMBER, '2')),
      new Pair(1, new Value(Value.ARRAY, '[3, 4]', [
        new Pair(0, new Value(Value.NUMBER, '3')),
        new Pair(1, new Value(Value.NUMBER, '4'))
      ]))
    ])),
    new Pair(2, new Value(Value.NUMBER, '5'))
  ]);
  assert.end();
});

test('parse: object', function (assert) {
  var value = parse('Object({ foo: 42 })');
  assert.equal(value.type, Value.OBJECT);
  assert.deepEqual(value.children, [
    new Pair('foo', new Value(Value.NUMBER, '42'))
  ]);
  assert.end();
});

test('parse: nested objects', function (assert) {
  var object3 = 'Object({ qux: 44, quxex: 3 })';
  var object2 = 'Object({ bar: 43, barob: ' + object3 + ', barex: 2 })';
  var object1 = 'Object({ foo: 42, fooob: ' + object2 + ', fooex: 1 })';

  var value = parse(object1);

  assert.equal(value.type, Value.OBJECT);
  assert.deepEqual(value.children, [
    new Pair('foo', new Value(Value.NUMBER, '42')),
    new Pair('fooob', new Value(Value.OBJECT, object2, [
      new Pair('bar', new Value(Value.NUMBER, '43')),
      new Pair('barob', new Value(Value.OBJECT, object3, [
        new Pair('qux', new Value(Value.NUMBER, '44')),
        new Pair('quxex', new Value(Value.NUMBER, '3'))
      ])),
      new Pair('barex', new Value(Value.NUMBER, '2'))
    ])),
    new Pair('fooex', new Value(Value.NUMBER, '1'))
  ]);
  assert.end();
});

test('parse: instance', function (assert) {
  var value = parse('Foo({ bar: 42 })');

  assert.equal(value.type, Value.INSTANCE);
  assert.deepEqual(value.children, [
    new Pair('bar', new Value(Value.NUMBER, '42'))
  ]);
  assert.end();
});

test('parse: nested instance', function (assert) {
  var instance2 = 'Bar({ qux: 44 })';
  var instance1 = 'Foo({ bar: ' + instance2 + ' })';

  var value = parse(instance1);

  assert.equal(value.type, Value.INSTANCE);
  assert.equal(value.instance, 'Foo');
  assert.deepEqual(value.children, [
    new Pair('bar', new Value(Value.INSTANCE, instance2, [
      new Pair('qux', new Value(Value.NUMBER, '44'))
    ], { instance: 'Bar' }))
  ]);
  assert.end();
});
