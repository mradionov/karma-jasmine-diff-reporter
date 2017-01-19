'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: warning:');

test('functions',

  `Expected Function to equal Function.`,

  `Expected <w>Function</w> to equal <w>Function</w>.`
);

test('functions in objects',

  `Expected Object({ foo: Function }) ` +
  `to equal Object({ foo: Function }).`,

  `Expected Object({ foo: <w>Function</w> }) ` +
  `to equal Object({ foo: <w>Function</w> }).`
);
