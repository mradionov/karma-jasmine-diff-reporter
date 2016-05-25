'use strict';

var test = require('tape');
var diff = require('../src/jasmine-diff').createDiffMessage;
var formatter = require('./test-formatter')();
var stack = "\nat Object.<anonymous> (/path/to/file.js:42:0)";

test('toBe: booleans', function (assert) {
  var input =
  "Expected true to be false." + stack;
  var expected =
  "Expected [a]true[/a] to be [e]false[/e]." + stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});

test('toBe: strings', function (assert) {
  var input =
    "Expected 'life' to be 'great'." +
    stack;
  var expected =
    "Expected [d]'[/d][a]life[/a][d]'[/d]" +
    " to be [d]'[/d][e]great[/e][d]'[/d]." +
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
    "Expected [d]'I [/d][a]hate[/a][d] cats'[/d]" +
    " to be [d]'I [/d][e]love[/e][d] cats'[/d]." +
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
    "Expected [d]'[/d][a]Kill[/a][d]. All. [/d][a]Humans[/a][d].'[/d]" +
    " to be [d]'[/d][e]Live[/e][d]. All. [/d][e]Robots[/e][d].'[/d]." +
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
    "Expected [d]'space[/d][a] [/a][d]space'[/d]" +
    " to be [d]'space[/d][e]\n[/e][d]space'[/d]." +
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
    "Expected [d]'space.[/d][a] [/a][d]dot'[/d]" +
    " to be [d]'space.[/d][e]\n[/e][d]dot'[/d]." +
    stack;

  var out = diff(input, formatter);

  assert.equal(out, expected);
  assert.end();
});
