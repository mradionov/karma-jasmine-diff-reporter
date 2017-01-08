'use strict';

var tape = require('tape');

var format = require('../../src/format');
var formatter = require('./test-formatter')();
var s = require('./stack-wrap');
var m = require('../../src/marker').wrapString;

module.exports = function createTestFn(namespace) {

  var test = function (name, input, expected) {
    return tape(namespace + ' ' + name,  function (assert) {
      var out = format(s(input), formatter);

      assert.equal(out, s(expected));
      assert.end();
    });
  };

  test.only = function (name, input, expected) {
    return tape.only(namespace + ' ' + name,  function (assert) {
      var out = format(s(input), formatter);

      assert.equal(out, s(expected));
      assert.end();
    });
  };

  return test;
};