'use strict';

var createTest = require('../../helpers/test');
var m = require('../../../src/marker').wrapString;

var test = createTest('format: toEqual: any:');

test('number vs any string',

  `Expected 3 to equal <jasmine.any(String)>.`,

  `Expected <a>3</a> to equal <e><jasmine.any(String)></e>.`
);

test('any string vs number',

  `Expected <jasmine.any(String)> to equal 3.`,

  `Expected <a><jasmine.any(String)></a> to equal <e>3</e>.`
);

test('any number vs any string',

  `Expected <jasmine.any(Number)> to equal <jasmine.any(String)>.`,

  `Expected <a><jasmine.any(Number)></a> to equal <e><jasmine.any(String)></e>.`
);

test('object with string vs any string',

  `Expected Object({ foo: 42, bar: ${m('bar')} }) ` +
  `to equal Object({ foo: 43, bar: <jasmine.any(String)> }).`,

  `Expected Object({ foo: <a>42</a>, bar: 'bar' }) ` +
  `to equal Object({ foo: <e>43</e>, bar: <jasmine.any(String)> }).`
);

test('object with number vs any number',

  `Expected Object({ foo: 42, bar: 53 }) ` +
  `to equal Object({ foo: 43, bar: <jasmine.any(Number)> }).`,

  `Expected Object({ foo: <a>42</a>, bar: 53 }) ` +
  `to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Number)> }).`
);

test('object with boolean vs any boolean',

  `Expected Object({ foo: 42, bar: true }) ` +
  `to equal Object({ foo: 43, bar: <jasmine.any(Boolean)> }).`,

  `Expected Object({ foo: <a>42</a>, bar: true }) ` +
  `to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Boolean)> }).`
);

test('object with object vs any object',

  `Expected Object({ foo: 42, bar: Object({ baz: 53 }) }) ` +
  `to equal Object({ foo: 43, bar: <jasmine.any(Object)> }).`,

  `Expected Object({ foo: <a>42</a>, bar: Object({ baz: 53 }) }) ` +
  `to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Object)> }).`
);

test('object with function vs any function',

  `Expected Object({ foo: 42, bar: Function }) ` +
  `to equal Object({ foo: 43, bar: <jasmine.any(Function)> }).`,

  `Expected Object({ foo: <a>42</a>, bar: Function }) ` +
  `to equal Object({ foo: <e>43</e>, bar: <jasmine.any(Function)> }).`
);
