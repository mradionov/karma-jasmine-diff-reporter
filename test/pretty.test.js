'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./helpers/test-formatter')();
var stack = require('./helpers/stack');
var mark = require('./helpers/mark').mark;

// test('pretty: arrays two spaces default', function (assert) {
//   var input =
//     "Expected [ 5, 'foo', Object({ baz: true }) ]" +
//     " to equal [ 10, 'bar', Object({ baz: false }) ]." +
//     stack;
//   var expected =
//     "Expected <d>[\n" +
//     "  </d><a>5</a><d>,\n" +
//     "  '</d><a>foo</a><d>',\n" +
//     "  Object({\n" +
//     "    baz: </d><a>true</a><d>\n" +
//     "  })\n" +
//     "]</d> to equal <d>[\n" +
//     "  </d><e>10</e><d>,\n" +
//     "  '</d><e>bar</e><d>',\n" +
//     "  Object({\n" +
//     "    baz: </d><e>false</e><d>\n" +
//     "  })\n" +
//     "]</d>." +
//     stack;

//   var out = diff(input, formatter, { pretty: true });

//   assert.equal(out, expected);
//   assert.end();
// });

// test('pretty: arrays tab', function (assert) {
//   var input =
//     "Expected [ 5, 'foo', Object({ baz: true }) ]" +
//     " to equal [ 10, 'bar', Object({ baz: false }) ]." +
//     stack;
//   var expected =
//     "Expected <d>[\n" +
//     "\t</d><a>5</a><d>,\n" +
//     "\t'</d><a>foo</a><d>',\n" +
//     "\tObject({\n" +
//     "\t\tbaz: </d><a>true</a><d>\n" +
//     "\t})\n" +
//     "]</d> to equal <d>[\n" +
//     "\t</d><e>10</e><d>,\n" +
//     "\t'</d><e>bar</e><d>',\n" +
//     "\tObject({\n" +
//     "\t\tbaz: </d><e>false</e><d>\n" +
//     "\t})\n" +
//     "]</d>." +
//     stack;

//     var out = diff(input, formatter, { pretty: '\t' });

//     assert.equal(out, expected);
//     assert.end();
// });

// test('pretty: arrays string', function (assert) {
//   var input =
//     "Expected [ 5, 'foo', Object({ baz: true }) ]" +
//     " to equal [ 10, 'bar', Object({ baz: false }) ]." +
//     stack;
//   var expected =
//     "Expected <d>[\n" +
//     "---</d><a>5</a><d>,\n" +
//     "---'</d><a>foo</a><d>',\n" +
//     "---Object({\n" +
//     "------baz: </d><a>true</a><d>\n" +
//     "---})\n" +
//     "]</d> to equal <d>[\n" +
//     "---</d><e>10</e><d>,\n" +
//     "---'</d><e>bar</e><d>',\n" +
//     "---Object({\n" +
//     "------baz: </d><e>false</e><d>\n" +
//     "---})\n" +
//     "]</d>." +
//     stack;

//   var out = diff(input, formatter, { pretty: '---' });

//   assert.equal(out, expected);
//   assert.end();
// });

// test('pretty: deep object', function (assert) {
//   var input =
//     "Expected Object({ foo: 'bar', baz: 5," +
//     " tux: Object({ a: Object({ b: 4, c: [ 'foo', true ] }) }), qux: true })" +
//     " to equal Object({ foo: 'baz', bar: 10," +
//     " tux: Object({ a: Object({ b: 4, c: [ 'foo', false ] }) }), qqx: true })." +
//     stack;
//   var expected =
//     "Expected <d>Object({\n" +
//     "  foo: '</d><a>bar</a><d>',\n" +
//     "  </d><a>baz</a><d>: </d><a>5</a><d>,\n" +
//     "  tux: Object({\n" +
//     "    a: Object({\n" +
//     "      b: 4,\n" +
//     "      c: [\n" +
//     "        'foo',\n" +
//     "        </d><a>true</a><d>\n" +
//     "      ]\n" +
//     "    })\n" +
//     "  }),\n" +
//     "  </d><a>qux</a><d>: true\n" +
//     "})</d> to equal <d>Object({\n" +
//     "  foo: '</d><e>baz</e><d>',\n" +
//     "  </d><e>bar</e><d>: </d><e>10</e><d>,\n" +
//     "  tux: Object({\n" +
//     "    a: Object({\n" +
//     "      b: 4,\n" +
//     "      c: [\n" +
//     "        'foo',\n" +
//     "        </d><e>false</e><d>\n" +
//     "      ]\n" +
//     "    })\n" +
//     "  }),\n" +
//     "  </d><e>qqx</e><d>: true\n" +
//     "})</d>." +
//     stack;

//   var out = diff(input, formatter, { pretty: true });

//   assert.equal(out, expected);
//   assert.end();
// });

// test('pretty: dirty object', function (assert) {
//   var input =
//     "Expected Object({" +
//     " foo: " + mark("ba', r Object({ ,, []\\") + "," +
//     " baz: 5, qux: true })" +
//     " to equal Object({" +
//     " foo: " + mark("ba', r \'Object({ ,, []\\") + "," +
//     " batz: 5, qux: false })." +
//     stack;
//   var expected =
//     "Expected <d>Object({\n" +
//     "  foo: 'ba', r </d><d>Object({ ,, []\\',\n" +
//     "  </d><a>baz</a><d>: 5,\n" +
//     "  qux: </d><a>true</a><d>\n" +
//     "})</d> to equal <d>Object({\n" +
//     "  foo: 'ba', r </d><e>'</e><d>Object({ ,, []\\',\n" +
//     "  </d><e>batz</e><d>: 5,\n" +
//     "  qux: </d><e>false</e><d>\n" +
//     "})</d>." +
//     stack;

//   var out = diff(input, formatter, { pretty: true });

//   assert.equal(out, expected);
//   assert.end();
// });
