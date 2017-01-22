'use strict';

// var test = require('tape');
// var diff = require('../src/jasmine-diff').createDiffMessage;
// var formatter = require('./helpers/test-formatter')();
// var stack = require('./helpers/stack');

// test('custom-matcher: default order', function (assert) {
//   var options = {
//     matchers: {
//       toLookTheSameAS: {
//         pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./
//       }
//     }
//   };
//   var input =
//     "Expected true to look the same as false." + stack;
//   var expected =
//     "Expected <e>true</e> to look the same as <a>false</a>." + stack;

//   var out = diff(input, formatter, options);

//   assert.equal(out, expected);
//   assert.end();
// });

// test('custom-matcher: reverse order', function (assert) {
//   var options = {
//     matchers: {
//       toLookTheSameAS: {
//         pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./,
//         reverse: true
//       }
//     }
//   };
//   var input =
//     "Expected true to look the same as false." + stack;
//   var expected =
//     "Expected <a>true</a> to look the same as <e>false</e>." + stack;

//   var out = diff(input, formatter, options);

//   assert.equal(out, expected);
//   assert.end();
// });
