'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');

test('multiline: to be', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected\n" +
    "\n" +
    "  <a>true</a>\n" +
    "\n" +
    "to be\n" +
    "\n" +
    "  <e>false</e>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, { multiline: true });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: to have been called with', function (assert) {
  var input =
    "Expected spy foo to have been called with [ false ]" +
    " but actual calls were [ true ]." +
    stack;
  var expected =
    "Expected spy foo to have been called with\n" +
    "\n" +
    "  <d>[ </d><e>false</e><d> ]</d>\n" +
    "\n" +
    "but actual calls were\n" +
    "\n" +
    "  <d>[ </d><a>true</a><d> ]</d>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, { multiline: true });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: to throw', function (assert) {
  var input =
    "Expected function to throw" +
    " TypeError: foo," +
    " but it threw" +
    " ReferenceError: a is not defined." +
    stack;
  var expected =
    "Expected function to throw\n" +
    "\n" +
    "  <e>TypeError</e><d>: </d><e>foo</e>\n" +
    "\n" +
    "but it threw\n" +
    "\n" +
    "  <a>ReferenceError</a><d>: </d><a>a is not defined</a>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, { multiline: true });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: before, after, indent int', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected\n" +
    "    <a>true</a>\n" +
    "\n" +
    "\n" +
    "to be\n" +
    "    <e>false</e>\n" +
    "\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, {
    multiline: {
      before: 1,
      after: 3,
      indent: 4
    }
  });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: indent string', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected\n" +
    "\n" +
    "\t<a>true</a>\n" +
    "\n" +
    "to be\n" +
    "\n" +
    "\t<e>false</e>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, {
    multiline: {
      indent: '\t'
    }
  });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: before after string', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected--^^<a>true</a>__to be--^^<e>false</e>__." +
    stack;

  var out = diff(input, formatter, {
    multiline: {
      before: '--',
      after: '__',
      indent: '^^'
    }
  });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: pretty', function (assert) {
  var input =
    "Expected [ 5, 'foo', Object({ baz: true }) ]" +
    " to equal [ 10, 'bar', Object({ baz: false }) ]." +
    stack;
  var expected =
    "Expected\n" +
    "\n" +
    "  <d>[\n" +
    "    </d><a>5</a><d>,\n" +
    "    '</d><a>foo</a><d>',\n" +
    "    Object({\n" +
    "      baz: </d><a>true</a><d>\n" +
    "    })\n" +
    "  ]</d>\n" +
    "\n" +
    "to equal\n" +
    "\n" +
    "  <d>[\n" +
    "    </d><e>10</e><d>,\n" +
    "    '</d><e>bar</e><d>',\n" +
    "    Object({\n" +
    "      baz: </d><e>false</e><d>\n" +
    "    })\n" +
    "  ]</d>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, {
    pretty: true,
    multiline: true
  });

  assert.equal(out, expected);
  assert.end();
});

test('multiline: matcher overrides global', function (assert) {
  var input =
    "Expected true to be false." + stack;
  var expected =
    "Expected\n" +
    "\n" +
    "\n" +
    "--<a>true</a>\n" +
    "\n" +
    "to be\n" +
    "\n" +
    "\n" +
    "--<e>false</e>\n" +
    "\n" +
    "." +
    stack;

  var out = diff(input, formatter, {
    multiline: {
      before: 1,
      after: 1,
      indent: '\t'
    },
    matchers: {
      toBe: {
        multiline: {
          before: 3,
          after: 2,
          indent: '--'
        }
      }
    }
  });

  assert.equal(out, expected);
  assert.end();
});
