karma-jasmine-diff-reporter [![Build status](https://travis-ci.org/mradionov/karma-jasmine-diff-reporter.svg?branch=master)](https://travis-ci.org/mradionov/karma-jasmine-diff-reporter)
===

> Diff and pretty print for failed tests.

![Example](http://i.imgur.com/5fkAvw2.jpg "Example")

## Important

The goal of the reporter is to add user-friendly diff highlighting for complex nested structures. Jasmine 2.6 introduced it's own solution for such a case and now has it out-of-the-box. Reporter is relying on the actual console output and since it has changed, reporter can't work correctly any more. If you are fine with Jasmine 2.6+ output, then the reporter won't be very useful. If you want to use the reporter instead of built-in Jasmine solution, make sure to set an option `legacy: true` in reporter options ([docs](#legacy)), which will enforce the console output to Jasmine prior 2.6, so the reporter could work with it and highlight the results.

## Install

```bash
npm install karma-jasmine-diff-reporter --save-dev
```

Add reporter to karma config file:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['jasmine-diff']
  });
};
```

You can use it together with another reporters, which tweak the output - just place them after:

```js
reporters: ['jasmine-diff', 'progress']
```

Some specific reporters might break because of how the output is changed, make sure to place them before:

```js
reporters: ['junit', 'jasmine-diff']
```

If you have `plugins` option overriden, make sure to add the reporter in there too ([Karma/Loading Plugins](http://karma-runner.github.io/1.0/config/plugins.html))

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['jasmine-diff'],
    plugins: [
      'karma-jasmine-diff-reporter'
    ]
  });
};
```

## Options

Default options:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    jasmineDiffReporter: {
      color: {
        expectedBg: 'bgRed',
        expectedWhitespaceBg: 'bgRed',
        expectedFg: 'white',

        actualBg: 'bgGreen',
        actualWhitespaceBg: 'bgGreen',
        actualFg: 'white',

        warningBg: 'bgYellow',
        warningWhitespaceBg: 'bgYellow',
        warningFg: 'white',

        defaultBg: '',
        defaultFg: ''
      },
      pretty: false,
      multiline: false,
      verbose: true,
      legacy: false,
      matchers: {}
    }
  });
};
```

#### color

- `expected*` - colors for test expectations
- `actual*` - colors for actual results
- `warning*` - values which reporter could not fully diff and they are worth attention
- `default*` - text of the value which was not highlighted with any of the above colors

You can use any [colors](https://github.com/chalk/chalk#styles) that a supported by [chalk](https://github.com/chalk/chalk).

If karma config option `colors: false` is set, then reporter will ignore any custom colors and display diffs in inverse color of the terminal. ([see output example](http://i.imgur.com/l0xqQv5.jpg)).

To use default terminal color for any of the option just provide an empty string (`''`) as a value.

#### pretty

Values in objects and arrays will be indented depending on the nesting level.
([see output example](http://i.imgur.com/6TTlSmB.jpg))

Disabled by default. To enable:

- `pretty: true` - 2 spaces for indent level
- `pretty: 4` - number of spaces per level
- `pretty: '\t'` - string per level

#### multiline

Adds extra newlines to separate Jasmine matcher text from actual values. ([see output example](http://storage6.static.itmages.com/i/16/0531/h_1464718207_5857499_e7d1091267.jpeg))

Disabled by default. To enable:

- `multiline: true` - 2 newlines before and after the value + 2 spaces of indentation.
- Each option can configured using numbers (number of newlines/spaces) and strings.

  ```js
  multiline: {
    before: 3,    // 3 newlines
    after: '\n',  // 1 newline
    indent: '  '  // 2 spaces
  }
  ```

#### verbose

If turned off, reduces the output by cutting of some Jasmine-specific syntax.

Enabled by default, which means nothing is cut off. To disable:

- `verbose: false` - remove all extra Jasmine syntax
- Detailed configuration:

  ```js
  verbose: {
    object: false
  }
  ```

  - `object` - Jasmine wraps objects - `Object({ foo: 42 })`, if set to `false` objects will be displayed without this wrapper - `{ foo: 42 }`.

#### legacy

Jasmine 2.6 introduced built-in diffs for objects. Reporter can't work with those diffs at the moment, so they are simply displayed without any highlights.

Disabled by default, which means Jasmine built-in diffs are respected.

If you want to bring back old diffs and reporter highlighting as well, turn this option on.

```js
legacy: true
```


#### matchers

By default only Jasmine core matchers are supported. Use this option to add any custom matchers so they could be correctly parsed and highlighted as well.

```js
matchers: {
  toLookTheSameAs: {
    pattern: /Expected ([\S\s]*) to look the same as ([\S\s]*)\./,
    reverse: true,
    format: 'complex'
  }
}
```

- `pattern` (required) - pattern to parse a failure message. It must have **two** capturing groups, which will capture actual and expected values. Suggested regular expression for capturing group is `[\S\s]*`, which will capture all characters including whitespaces.
- `reverse` (optional) - if set to `true`, then the colors, which are used to highlight actual and expected values will be swapped. By default, first capturing group stands for expected value and second - for actual value.
- `format` (optional) - accepts either a string or a function. String specifies which diff algorithm to use. Available algorithms are:
  - `complex` (default) - values are deeply parsed and analyzed, diffed parts get highlighted
  - `full` - highlights the entire values in their appropriate colors
  - `multiple` - internal option for values which hold multiple arrays
  - `passthru` - nothing is diffed and highlighted
  - `primitive` - values are diffed and highlighted as raw strings
  - `warning` - highlights the entire values in warning colors


Take a look at the [definitions of in-built matchers](src/matchers.js) to have a better understaning.

## Support

- jasmine 2.x
- karma 0.9+
- karma-jasmine 0.3+

## Pitfalls

Diffs won't be displayed for a deep nested objects or large arrays, a threshold for these situations is configured in Jasmine. By default it has object nest level `MAX_PRETTY_PRINT_DEPTH = 40` and array length `MAX_PRETTY_PRINT_ARRAY_LENGTH = 100`. It means that if the diff is out of these bounds, then Jasmine will return the same strings for both compared objects and the reporter won't be able to highlight those diffs.

## License

[MIT](LICENSE)
