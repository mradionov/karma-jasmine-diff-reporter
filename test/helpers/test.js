'use strict';

var tape = require('tape');

var format = require('../../src/format');
var formatter = require('./test-formatter')();
var stack = require('./stack');

module.exports = function createTestFn(namespace) {

  var test = function (name, input, expected, options) {
    options = options || {};
    options.stack = options.stack || stack;

    return tape(namespace + ' ' + name,  function (assert) {
      var out = format(input + stack, formatter);

      assert.equal(out, expected + stack);
      assert.end();
    });
  };

  test.only = function (name, input, expected, options) {
    options = options || {};
    options.stack = options.stack || stack;

    return tape.only(namespace + ' ' + name,  function (assert) {
      var out = format(input + stack, formatter);

      assert.equal(out, expected + stack);
      assert.end();
    });
  };

  return test;
};