'use strict';

var createTest = require('./helpers/test');

var test = createTest('legacy:');

test('passthru objects',

  'Expected object to have properties\n' +
  "    baz: 'qux'\n" +
  'Expected object not to have properties\n' +
  "    foo: 'bar'\n",

  'Expected object to have properties\n' +
  "    baz: 'qux'\n" +
  'Expected object not to have properties\n' +
  "    foo: 'bar'\n",

  { format: { legacy: false } }
);

test('dont multiline',
  "Expected $.foo = 'bar' to equal 'baz'.\n" +
  'Expected object to have properties\n' +
  '    bar: 10\n' +
  '    qqx: true\n' +
  'Expected $.tux.a.c[1] = true to equal false.\n' +
  'Expected object to have properties\n' +
  '    bar: 10\n' +
  '    qqx: true',

  "Expected $.foo = 'bar' to equal 'baz'.\n" +
  'Expected object to have properties\n' +
  '    bar: 10\n' +
  '    qqx: true\n' +
  'Expected $.tux.a.c[1] = true to equal false.\n' +
  'Expected object to have properties\n' +
  '    bar: 10\n' +
  '    qqx: true',

  { format: { legacy: false, multiline: true } }
);
