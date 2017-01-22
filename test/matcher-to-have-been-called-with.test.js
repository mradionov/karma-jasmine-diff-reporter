'use strict';

var createTest = require('./helpers/test');
var m = require('./helpers/mark');

var test = createTest('format: toHaveBeenCalledWith:');

test('bools',

  `Expected spy foo to have been called with [ false ]` +
  ` but actual calls were [ true ].`,

  `Expected spy foo to have been called with [ <e>false</e> ]` +
  ` but actual calls were [ <a>true</a> ].`
);

test('objects with different props',
  `Expected spy foo to have been called with ` +
  `[ Object({ foo: ${m('bar')} }) ] ` +
  `but actual calls were ` +
  `[ Object({ baz: ${m('qux')} }) ].`,

  `Expected spy foo to have been called with ` +
  `[ Object({ <e>foo: 'bar'</e> }) ] ` +
  `but actual calls were ` +
  `[ Object({ <a>baz: 'qux'</a> }) ].`
);
