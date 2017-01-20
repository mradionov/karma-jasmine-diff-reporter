var createTest = require('./helpers/test');

var test = createTest('exclusions:');

test('unmatched message',

  `Some random text`,

  `Some random text`
);

// Note: this behavior is a bit weird comparing to toBeUndefined and others -
// that equal parts are highlighted with default colors. Not critical
test('no diff for equal numbers',

  `Expected 5 not to be 5.`,

  `Expected 5 not to be 5.`
);
