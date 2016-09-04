'use strict';

var test = require('tape');

var traverse = require('../src/traverse');
var parse = require('../src/parse');
var Pair = require('../src/pair');
var Value = require('../src/value');

test('traverse: one level object', function (assert) {
  assert.plan(20);

  var value = parse('Object({ foo: 42 })');
  var enterCalls = 0, leaveCalls = 0;

  traverse(value, {
    enter: function (enterValue, enterKey, path, nestLevel) {
      if (enterCalls === 0) {
        assert.deepEqual(enterValue, value);
        assert.equal(enterKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
      }
      if (enterCalls === 1) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '42'));
        assert.equal(enterKey, 'foo');
        assert.equal(path, 'foo');
        assert.equal(nestLevel, 1);
      }
      enterCalls++;
    },
    leave: function (leaveValue, leaveKey, path, nestLevel, isLast) {
      if (leaveCalls === 0) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '42'));
        assert.equal(leaveKey, 'foo');
        assert.equal(path, 'foo');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 1) {
        assert.deepEqual(leaveValue, value);
        assert.equal(leaveKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
        assert.equal(isLast, true);
      }
      leaveCalls++;
    }
  });

  assert.equal(enterCalls, 2);
  assert.equal(leaveCalls, 2);
});

test('traverse: two level object', function (assert) {
  assert.plan(29);

  var value = parse('Object({ foo: Object({ bar: 42 }) })');
  var enterCalls = 0, leaveCalls = 0;

  traverse(value, {
    enter: function (enterValue, enterKey, path, nestLevel) {
      if (enterCalls === 0) {
        assert.deepEqual(enterValue, value);
        assert.equal(enterKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
      }
      if (enterCalls === 1) {
        assert.deepEqual(
          enterValue,
          new Value(Value.OBJECT, 'Object({ bar: 42 })', [
            new Pair('bar', new Value(Value.NUMBER, '42'))
          ])
        );
        assert.equal(enterKey, 'foo');
        assert.equal(path, 'foo');
        assert.equal(nestLevel, 1);
      }
      if (enterCalls === 2) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '42'));
        assert.equal(enterKey, 'bar');
        assert.equal(path, 'foo.bar');
        assert.equal(nestLevel, 2);
      }
      enterCalls++;
    },
    leave: function (leaveValue, leaveKey, path, nestLevel, isLast) {
      if (leaveCalls === 0) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '42'));
        assert.equal(leaveKey, 'bar');
        assert.equal(path, 'foo.bar');
        assert.equal(nestLevel, 2);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 1) {
        assert.deepEqual(
          leaveValue,
          new Value(Value.OBJECT, 'Object({ bar: 42 })', [
            new Pair('bar', new Value(Value.NUMBER, '42'))
          ])
        );
        assert.equal(leaveKey, 'foo');
        assert.equal(path, 'foo');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 2) {
        assert.deepEqual(leaveValue, value);
        assert.equal(leaveKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
        assert.equal(isLast, true);
      }
      leaveCalls++;
    }
  });

  assert.equal(enterCalls, 3);
  assert.equal(leaveCalls, 3);
});

test('traverse: one level array', function (assert) {
  assert.plan(38);

  var value = parse('[1, 2, 3]');
  var enterCalls = 0, leaveCalls = 0;

  traverse(value, {
    enter: function (enterValue, enterKey, path, nestLevel) {
      if (enterCalls === 0) {
        assert.deepEqual(enterValue, value);
        assert.equal(enterKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
      }
      if (enterCalls === 1) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '1'));
        assert.equal(enterKey, 0);
        assert.equal(path, '0');
        assert.equal(nestLevel, 1);
      }
      if (enterCalls === 2) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '2'));
        assert.equal(enterKey, 1);
        assert.equal(path, '1');
        assert.equal(nestLevel, 1);
      }
      if (enterCalls === 3) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '3'));
        assert.equal(enterKey, 2);
        assert.equal(path, '2');
        assert.equal(nestLevel, 1);
      }
      enterCalls++
    },
    leave: function (leaveValue, leaveKey, path, nestLevel, isLast) {
      if (leaveCalls === 0) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '1'));
        assert.equal(leaveKey, 0);
        assert.equal(path, '0');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, false);
      }
      if (leaveCalls === 1) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '2'));
        assert.equal(leaveKey, 1);
        assert.equal(path, '1');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, false);
      }
      if (leaveCalls === 2) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '3'));
        assert.equal(leaveKey, 2);
        assert.equal(path, '2');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 3) {
        assert.deepEqual(leaveValue, value);
        assert.equal(leaveKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
        assert.equal(isLast, true);
      }
      leaveCalls++;
    }
  });

  assert.equal(enterCalls, 4);
  assert.equal(leaveCalls, 4);
});

test('traverse: two level array', function (assert) {
  assert.plan(56);

  var value = parse('[1, [2, 3], 4]');
  var enterCalls = 0, leaveCalls = 0;

  traverse(value, {
    enter: function (enterValue, enterKey, path, nestLevel) {
      if (enterCalls === 0) {
        assert.deepEqual(enterValue, value);
        assert.equal(enterKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
      }
      if (enterCalls === 1) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '1'));
        assert.equal(enterKey, 0);
        assert.equal(path, '0');
        assert.equal(nestLevel, 1);
      }
      if (enterCalls === 2) {
        assert.deepEqual(enterValue, new Value(Value.ARRAY, '[2, 3]', [
          new Pair(0, new Value(Value.NUMBER, '2')),
          new Pair(1, new Value(Value.NUMBER, '3'))
        ]));
        assert.equal(enterKey, 1);
        assert.equal(path, '1');
        assert.equal(nestLevel, 1);
      }
      if (enterCalls === 3) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '2'));
        assert.equal(enterKey, 0);
        assert.equal(path, '1.0');
        assert.equal(nestLevel, 2);
      }
      if (enterCalls === 4) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '3'));
        assert.equal(enterKey, 1);
        assert.equal(path, '1.1');
        assert.equal(nestLevel, 2);
      }
      if (enterCalls === 5) {
        assert.deepEqual(enterValue, new Value(Value.NUMBER, '4'));
        assert.equal(enterKey, 2);
        assert.equal(path, '2');
        assert.equal(nestLevel, 1);
      }
      enterCalls++;
    },
    leave: function (leaveValue, leaveKey, path, nestLevel, isLast) {
      if (leaveCalls === 0) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '1'));
        assert.equal(leaveKey, 0);
        assert.equal(path, '0');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, false);
      }
      if (leaveCalls === 1) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '2'));
        assert.equal(leaveKey, 0);
        assert.equal(path, '1.0');
        assert.equal(nestLevel, 2);
        assert.equal(isLast, false);
      }
      if (leaveCalls === 2) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '3'));
        assert.equal(leaveKey, 1);
        assert.equal(path, '1.1');
        assert.equal(nestLevel, 2);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 3) {
        assert.deepEqual(leaveValue, new Value(Value.ARRAY, '[2, 3]', [
          new Pair(0, new Value(Value.NUMBER, '2')),
          new Pair(1, new Value(Value.NUMBER, '3'))
        ]));
        assert.equal(leaveKey, 1);
        assert.equal(path, '1');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, false);
      }
      if (leaveCalls === 4) {
        assert.deepEqual(leaveValue, new Value(Value.NUMBER, '4'));
        assert.equal(leaveKey, 2);
        assert.equal(path, '2');
        assert.equal(nestLevel, 1);
        assert.equal(isLast, true);
      }
      if (leaveCalls === 5) {
        assert.deepEqual(leaveValue, value);
        assert.equal(leaveKey, undefined);
        assert.equal(path, '');
        assert.equal(nestLevel, 0);
        assert.equal(isLast, true);
      }
      leaveCalls++;
    }
  });

  assert.equal(enterCalls, 6);
  assert.equal(leaveCalls, 6);
});

