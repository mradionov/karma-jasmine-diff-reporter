'use strict';

var createTest = require('../helpers/test');

var test = createTest('format: toEqual: array:');

test(
  'wrong value',

  `Expected [ 1, 2, 3 ] to equal [ 1, 4, 3 ].`,

  `Expected [ 1, <a>2</a>, 3 ] to equal [ 1, <e>4</e>, 3 ].`
);

test('with object with wrong value',

  `Expected [ 1, Object({ foo: 42 }), 3 ] ` +
  `to equal [ 1, Object({ foo: 43 }), 3 ].`,

  `Expected [ 1, Object({ foo: <a>42</a> }), 3 ] ` +
  `to equal [ 1, Object({ foo: <e>43</e> }), 3 ].`
);

test('nested array',

  `Expected [ 1, [ 2, [ 3, 4 ] ] ] `+
  `to equal [ 1, [ 5, [ 7, 4 ] ] ].`,

  `Expected [ 1, [ <a>2</a>, [ <a>3</a>, 4 ] ] ] `+
  `to equal [ 1, [ <e>5</e>, [ <e>7</e>, 4 ] ] ].`
);
