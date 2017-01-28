'use strict';

var createTest = require('./helpers/test');

var test = createTest('verbose:');

test('default',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected Object({ <a>foo: 42</a> }) to equal Object({ <e>bar: 43</e> }).'
);

test('objects turned off',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected { <a>foo: 42</a> } to equal { <e>bar: 43</e> }.',

  { format: { verbose: { object: false } } }
);

test('whole turned off',

  'Expected Object({ foo: 42 }) to equal Object({ bar: 43 }).',

  'Expected { <a>foo: 42</a> } to equal { <e>bar: 43</e> }.',

  { format: { verbose: false } }
);
