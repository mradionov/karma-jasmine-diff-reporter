var createTest = require('./helpers/test');

var test = createTest('exclusions:');

test('unmatched message',

  `Some random text`,

  `Some random text`
);
