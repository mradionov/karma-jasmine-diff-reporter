'use strict';

var createTest = require('../../helpers/test');
var m = require('../../../src/marker').wrapString;

var test = createTest('format: toEqual: containing:');

test('wrong value',

  `Expected Object({ foo: 42 }) to equal ` +
  `<jasmine.objectContaining(Object({ foo: 43 }))>.`,

  `Expected Object({ foo: <a>42</a> }) to equal ` +
  `<jasmine.objectContaining(Object({ foo: <e>43</e> }))>.`
);

test('different key',

  `Expected Object({ foo: 42 }) to equal ` +
  `<jasmine.objectContaining(Object({ bar: 42 }))>.`,

  `Expected Object({ foo: 42 }) to equal ` +
  `<jasmine.objectContaining(Object({ <e>bar: 42</e> }))>.`
);

test('multiple keys vs single key',

  `Expected Object({ foo: 42, bar: 43 }) to equal ` +
  `<jasmine.objectContaining(Object({ bar: 42 }))>.`,

  `Expected Object({ foo: 42, bar: <a>43</a> }) to equal ` +
  `<jasmine.objectContaining(Object({ bar: <e>42</e> }))>.`
);
