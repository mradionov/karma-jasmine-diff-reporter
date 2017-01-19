'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('format: toBe:');

test('booleans',

  `Expected true to be false.`,

  `Expected <a>true</a> to be <e>false</e>.`
);

test('strings',

  `Expected ${m('foo')} to be ${m('bar')}.`,

  `Expected '<a>foo</a>' to be '<e>bar</e>'.`
);

test('strings content',

  `Expected ${m('I hate cats')} to be ${m('I love cats')}.`,

  `Expected 'I <a>hate</a> cats' to be 'I <e>love</e> cats'.`
);

test('strings with dots',

  `Expected ${m('foo. bar. baz.')} to be ${m('qux. bar. daz.')}.`,

  `Expected '<a>foo</a>. bar. <a>baz</a>.' to be '<e>qux</e>. bar. <e>daz</e>.'.`
);

test('undefined facing a string',

  `Expected ${m('defined')} to be undefined.`,

  `Expected <a>'defined'</a> to be <e>undefined</e>.`
);

test('defined',

  `Expected undefined to be defined.`,

  `Expected <a>undefined</a> to be <e>defined</e>.`
);

test('truthy',

  `Expected false to be truthy.`,

  `Expected <a>false</a> to be <e>truthy</e>.`
);

test('falsy',

  `Expected true to be falsy.`,

  `Expected <a>true</a> to be <e>falsy</e>.`
);

test('close to',

  `Expected 3 to be close to 5.`,

  `Expected <a>3</a> to be <e>close to 5</e>.`
);

test('greater than',

  `Expected 3 to be greater than 5.`,

  `Expected <a>3</a> to be <e>greater than 5</e>.`
);

test('less than',

  `Expected 5 to be less than 3.`,

  `Expected <a>5</a> to be <e>less than 3</e>.`
);

test('objects by ref',

  `Expected Object({ foo: 42 }) to be Object({ foo: 42 }).`,

  `Expected <w>Object({ foo: 42 })</w> to be <w>Object({ foo: 42 })</w>.`
);

test('arrays by ref',

  `Expected [1, 2, 3] to be [1, 2, 3].`,

  `Expected <w>[1, 2, 3]</w> to be <w>[1, 2, 3]</w>.`

  );

test('functions by ref',

  `Expected Function to be Function.`,

  `Expected <w>Function</w> to be <w>Function</w>.`
);

/*

test('toBe: strings', function (assert) {
  var input =
    "Expected 'life' to be 'great'." +
    stack;
  var expected =
    "Expected <d>'</d><a>life</a><d>'</d>" +
    " to be <d>'</d><e>great</e><d>'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toBe: strings content', function (assert) {
  var input =
    "Expected 'I hate cats' to be 'I love cats'." +
    stack;
  var expected =
    "Expected <d>'I </d><a>hate</a><d> cats'</d>" +
    " to be <d>'I </d><e>love</e><d> cats'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toBe: strings with dots', function (assert) {
  var input =
    "Expected 'Kill. All. Humans.' to be 'Live. All. Robots.'." +
    stack;
  var expected =
    "Expected <d>'</d><a>Kill</a><d>. All. </d><a>Humans</a><d>.'</d>" +
    " to be <d>'</d><e>Live</e><d>. All. </d><e>Robots</e><d>.'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toBe: string with whitespace', function (assert) {
  var input =
    "Expected 'space space' to be 'space\nspace'." +
    stack;
  var expected =
    "Expected <d>'space</d><aw> </aw><d>space'</d>" +
    " to be <d>'space</d><ew>\n</ew><d>space'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

// It should be tested because of inner logic of splitting stack from message
test('toBe: string with whitespace right after dot', function (assert) {
  var input =
    "Expected 'space. dot' to be 'space.\ndot'." +
    stack;
  var expected =
    "Expected <d>'space.</d><aw> </aw><d>dot'</d>" +
    " to be <d>'space.</d><ew>\n</ew><d>dot'</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toBe: arrays', function (assert) {
  var input =
    "Expected [2, 2, 8] to be [2, 3, 8]." +
    stack;
  var expected =
    "Expected <d>[2, </d><a>2</a><d>, 8]</d>" +
    " to be <d>[2, </d><e>3</e><d>, 8]</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

// Issue #6 not capturing newlines inside strings
test('toBe: undefined vs string with newlines', function (assert) {
  var input =
    "Expected undefined to be 'space\nspace'." +
    stack;
  var expected =
    "Expected <a>undefined</a> to be <e>'space</e><ew>\n</ew><e>space'</e>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

// Note: this behavior is a bit weird comparing to toBeUndefined and others -
// that equal parts are highlighted with default colors. Not critical
test('toBe: no diff for equal booleans', function (assert) {
  var input =
    "Expected true not to be true." +
    stack;
  var expected =
    "Expected <d>true</d> not to be <d>true</d>." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

*/