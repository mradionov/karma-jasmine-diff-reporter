'use strict';

var test = require('tape');

var Value = require('../src/value');
var Pair = require('../src/pair');

test('value: init without children', function (assert) {
  var value = new Value(Value.NUMBER, '42');

  assert.equal(value.type, Value.NUMBER);
  assert.equal(value.text, '42');
  assert.deepEqual(value.children, []);
  assert.end();
});

test('value: init with children', function (assert) {
  var value = new Value(Value.ARRAY, '[1, 2]', [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.NUMBER, '2'))
  ]);

  assert.equal(value.type, Value.ARRAY);
  assert.equal(value.text, '[1, 2]');
  assert.deepEqual(value.children, [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.NUMBER, '2'))
  ]);
  assert.end();
});

test('value: byPath: empty path itself', function (assert) {
  var value = new Value(Value.NUMBER, '42');

  var child = value.byPath('');

  assert.equal(child, value);
  assert.end();
});

test('value: byPath: primitive', function (assert) {
  var value = new Value(Value.NUMBER, '42');

  var child = value.byPath('foo');

  assert.equal(child, undefined);
  assert.end();
});

test('value: byPath: object one level', function (assert) {
  var value = new Value(Value.OBJECT, 'Object({ foo: 42 })', [
    new Pair('foo', new Value(Value.NUMBER, '42'))
  ]);

  var child = value.byPath('foo');

  assert.deepEqual(child, new Value(Value.NUMBER, '42'));
  assert.end();
});

test('value: byPath: object deep level', function (assert) {
  var value = new Value(
    Value.OBJECT, 'Object({ foo: Object({ bar: Object({ qux: 42 }) }) })', [
      new Pair('foo', new Value(
        Value.OBJECT, 'Object({ bar: Object({ qux: 42 }) })', [
          new Pair('bar', new Value(
            Value.OBJECT, 'Object({ qux: 42 }', [
              new Pair('qux', new Value(Value.NUMBER, '42'))
            ]
          ))
        ]
      ))
    ]
  );

  var child = value.byPath('foo.bar.qux');

  assert.deepEqual(child, new Value(Value.NUMBER, '42'));
  assert.end();
});

test('value: byPath: instance deep level', function (assert) {
  var value = new Value(
    Value.OBJECT, 'Foo({ foo: Object({ bar: Object({ qux: 42 }) }) })', [
      new Pair('foo', new Value(
        Value.OBJECT, 'Object({ bar: Object({ qux: 42 }) })', [
          new Pair('bar', new Value(
            Value.OBJECT, 'Object({ qux: 42 }', [
              new Pair('qux', new Value(Value.NUMBER, '42'))
            ]
          ))
        ]
      ))
    ]
  );

  var child = value.byPath('foo.bar.qux');

  assert.deepEqual(child, new Value(Value.NUMBER, '42'));
  assert.end();
});

test('value: byPath: array one level', function (assert) {
  var value = new Value(Value.ARRAY, '[1, 2, 3]', [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.NUMBER, '2')),
    new Pair(2, new Value(Value.NUMBER, '3'))
  ]);

  var child = value.byPath('1');

  assert.deepEqual(child, new Value(Value.NUMBER, '2'));
  assert.end();
});

test('value: byPath: array deep level', function (assert) {
  var value = new Value(Value.ARRAY, '[1, [2, 3, [4, 5]]]', [
    new Pair(0, new Value(Value.NUMBER, '1')),
    new Pair(1, new Value(Value.ARRAY, '[2, 3, [4, 5]]', [
      new Pair(0, new Value(Value.NUMBER, '2')),
      new Pair(1, new Value(Value.NUMBER, '3')),
      new Pair(2, new Value(Value.ARRAY, '[4, 5]', [
        new Pair(0, new Value(Value.NUMBER, '4')),
        new Pair(1, new Value(Value.NUMBER, '5'))
      ]))
    ]))
  ]);

  var child = value.byPath('1.2.1');

  assert.deepEqual(child, new Value(Value.NUMBER, '5'));
  assert.end();
});
