karma-jasmine-diff-reporter
===

> [Karma](http://karma-runner.github.io/) reporter to highlight diffs of failed equality expectations for [Jasmine](http://jasmine.github.io/).

Jasmine matchers that will be processed:

- toBe
- toBeUndefined
- toBeNaN
- toBeNull
- toEqual
- toHaveBeenCalledWith
- toThrow
- toThrowError

Example: ![Example base](http://i.imgur.com/5fkAvw2.jpg "Example base")

Expectations have red background, actual results - green.

*Note: there are matchers like `toBeTruthy` or `toBeDefined` in Jasmine, but they won't be highlighted because the messages outputed are `Expected 0 to be truthy` or `Expected undefined to be defined` respectively, and words `truthy` and `defined` are not the part of JavaScript.*

*Note: if you use custom matchers, they also might be accidently highlighted, if their messages match the patterns I use to extract the data for comparison. There is no a solution to disable it yet. You can find more about custom matchers below.*

### Support

Only Jasmine 2.x is supported, this extension **will not work** with Jasmine 1.3.

### Installation

The easiest way is to keep *karma-jasmine-diff-reporter* as a devDependency in your `package.json`:

```json
{
  "devDependencies": {
    "karma": "^0.12.0",
    "karma-jasmine": "^0.3.0",
    "karma-jasmine-diff-reporter": "^0.1.0"
  }
}
```

or install via console:

```bash
npm install karma-jasmine-diff-reporter --save-dev
```

### Configuration

The idea behind *karma-jasmine-diff-reporter* is that it does not output info by itself, but just modifies the message, so as a result **you can use it in conjunction with your favorite reporter**. To do so, you have to put it before reporter you normally use in the Karma config file:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    // use Progress reporter and still highlight diffs
    reporters: ['jasmine-diff', 'progress']

    // reporters: ['jasmine-diff, 'mocha'] // karma-mocha-reporter
    // reporters: ['jasmine-diff', 'nested'] // karma-nested-reporter

    // reporters: ['jasmine-diff'] // use Karma default Base reporter

  });
};
```

Otherwise, if you do not use any extra reporters, Karma Base reporter will be used by default.

Because of this specific order-dependent behavior some of the reporters that are listed after `jasmine-diff` might break (for example `karma-junit-reporter` which converts result into XML, which does not support characters used to set colors in terminal).

```js
  reporters: ['jasmine-diff', 'junit']
```

The workaround is actually to put `jasmine-diff` after broken reporter:

```js
  reporters: ['junit', 'jasmine-diff']
```

### Options

##### Colors

Karma config has an option `colors` which accepts a boolean value telling whether or not colors should be used in output. If this option is set to `false`, then *karma-jasmine-diff-reporter* will print diffs using inverse colors.

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    reporters: ['jasmine-diff']

    colors: false

  });
};
```

Example: ![Example inverse](http://i.imgur.com/l0xqQv5.jpg "Example inverse")

Also you can explicitly specify what colors you want to see for diffs:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    reporters: ['jasmine-diff']

    jasmineDiffReporter: {
      // Bg - background
      // Fg - foreground (text)
      color: {
        expectedBg: 'bgYellow', // default 'bgRed'
        expectedFg: 'black',    // default 'white'
        actualBg: 'bgCyan',     // default 'bgGreen'
        actualFg: 'red'         // default 'white'
      }
    }

  });
};
```

Example: ![Example custom colors](http://i.imgur.com/eOTgERa.jpg "Example custom colors")

You can use any [colors](https://github.com/chalk/chalk#styles) that a supported by [`chalk`](https://github.com/chalk/chalk).

Defaults for "expected" message is red background with white text and for "actual" - green background with white text.

If you have `colors:false` in Karma config, none of the custom or default colors will be used, diffs will be inversed instead.

##### Custom matchers

If you have custom Jasmine matchers, which compare your data for equality, but the message of your matchers does not fit to *karma-jasmine-diff-reporter*, you can specify the rules to extract the objects for comparison of the custom matcher in the configuration:

```js
// karma.conf.js
module.exports = function(config) {
  config.set({

    frameworks: ['jasmine'],

    reporters: ['jasmine-diff']

    jasmineDiffReporter: {

      matchers: {

        toLookTheSameAs: {
          pattern: /Expected (.*) to look the same as (.*)./,
          reverse: true
        }

      }
    }

  });
};
```

Matcher must have a property called `pattern`, which is a pattern to parse a failure message. It should have **two** capturing groups, which will capture your data to compare. If you have less or more - it will be ignored. Also there is an optional property `reverse`, if it is set to `true`, then the colors, which are used to highlight *actual* and *expected* data objects, should be switched. By default, first capturing group stands for *expected* data and second - for *actual* data. You can take a look at the definitions of default matchers [here in the source code](src/jasmine-diff.js#8). You can even override default matchers by using their property name in config file (do it at your own risk).

*Note: this feature is experimental and may cover just a few cases and may not cover a lot more, because custom matchers can be way to custom. But if there are some stable libraries, which provide popular custom matchers (like [Jasmine-Matchers](https://github.com/JamieMason/Jasmine-Matchers)) and you think you want it to be supported, let me know the use-cases in the issues.*


### Dependencies

- [diff](https://www.npmjs.com/package/diff) - Text differencing
- [chalk](https://www.npmjs.com/package/chalk) - Terminal string styling
- [extend](https://www.npmjs.com/package/extend) - Deep extend JS objects

### Pitfalls

Diffs won't be displayed for a deep nested objects or large arrays, a threshold for these situations is configured in Jasmine. By default it has object nest level `MAX_PRETTY_PRINT_DEPTH = 40` and array length `MAX_PRETTY_PRINT_ARRAY_LENGTH = 100`. It means that if the diff is out of these bounds, then Jasmine will return the same strings for both compared objects and *karma-jasmine-diff-reporter* won't be able to highlight those diffs.