'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('format: custom:');

test('default order',

  `Expected true to look the same as false.`,

  `Expected <e>true</e> to look the same as <a>false</a>.`,

  { format: { matchers: {
    toLookTheSameAS: {
      pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./
    }
  }}}
);

test('reverse order',

  `Expected true to look the same as false.`,

  `Expected <a>true</a> to look the same as <e>false</e>.`,

  { format: { matchers: {
    toLookTheSameAS: {
      pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./,
      reverse: true
    }
  }}}
);
