'use strict';

var test = require('tape');

var format = require('../../src/format');
var formatter = require('../helpers/test-formatter')();
var stack = require('../helpers/stack');

test('format: exclusions: unmatched message', function (assert) {
  var input = "Some random text" + stack;
  var expected = "Some random text" + stack;

  var out = format(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
