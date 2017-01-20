'use strict';

var path = require('path');

var karma = require('karma');

var jasmineDiff = require('./src/jasmine-diff');
var createColorFormatter = require('./src/color-formatter');

var karmaMajorVersion = Number(karma.VERSION.split('.')[0]);

function JasmineDiffReporter(baseReporterDecorator, config, logger) {
  var self = this;

  // Extend Karma Base reporter
  baseReporterDecorator(self);

  var reporterOptions = config.jasmineDiffReporter || {};

  var options = {
    matchers: reporterOptions.matchers || {},
    color: reporterOptions.color || {},
    pretty: reporterOptions.pretty || false,
    multiline: reporterOptions.multiline || false
  };

  options.color.enabled = !!config.colors;

  // Create formatter responsible for highlighting message fragments
  // and pass it to diff function as a dep to be able to replace it in tests
  var colorFormatter = createColorFormatter(options.color);

  // Check if reporter is last in the list of config reporters
  var reporterName = 'jasmine-diff';
  var hasTrailingReporters = config.reporters.slice(-1).pop() !== reporterName;

  // Override Base reporter method
  // Replace original message with highlighted one

  var originalSpecFailure = self.specFailure;

  self.specFailure = function (browser, result) {

    result.log = result.log.map(function (message) {
      return jasmineDiff.createDiffMessage(message, colorFormatter, options);
    });

    // If reporter is last in the list of reporters from config
    // then invoke Karma's Base reporter. Basically this reporter
    // just changes the message, but does not output info by itself,
    // so one could use any reporter and still have highlighted diff.
    if (!hasTrailingReporters) {
      originalSpecFailure.call(self, browser, result);
    }
  };

  // In case, when multiple reporters are used in conjunction
  // with karma-jasmine-diff-reporter, they both will show repetitive log
  // messages when displaying everything that supposed to write to terminal.
  // So just suppress any logs from karma-jasmine-diff-reporter, because
  // it is an utility reporter by doing nothing on browser log,
  // unless it's alone in the "reporters" option and base reporter is used.
  if (hasTrailingReporters) {
    self.writeCommonMsg = function () {};
  }

  // Secretly inject a framework to be able to patch Jasmine
  // Frameworks are included earlier in Karma workflow so it is possible
  // to inject some script on a test page.

  // Framework injection is different in 0.x and 1.x karma, manually injecting
  // a framework won't work in 1.x, but files injection does work from inside
  // of the reporter in 1.x, so call it manually for 1.x versions
  if (karmaMajorVersion < 1) {
    config.frameworks.push('jasmine-diff');
  } else {
    JasmineDiffFramework(config, logger);
  }

}

function JasmineDiffFramework(config, logger) {
  var log = logger.create('jasmine-diff');

  // karma-jasmine uses adapter to work with Jasmine
  // Use it to include custom patch for Jasmine right before adapter starts

  var jasminePath = path.dirname(require.resolve('jasmine-core'));
  var coreFile = '/jasmine-core/jasmine.js';
  var jasmineCorePath = jasminePath + coreFile;

  var index = -1;
  for (var i = 0, l = config.files.length; i < l; i++) {
    if (config.files[i].pattern === jasmineCorePath) {
      index = i;
      break;
    }
  }

  if (index === -1) {
    log.warn('File "%s" not found in module "jasmine-core".', coreFile);
    log.warn('You may be using a not supported Jasmine version.');
    log.warn('Pretty print option will not be available');
    return false;
  }

  var patchPath = path.join(__dirname, 'src', 'karma-jasmine', 'pp-patch.js');

  config.files.splice(index + 2, 0, {
    pattern: patchPath,
    included: true,
    served: true,
    watched: false
  });

}

JasmineDiffReporter.$inject = ['baseReporterDecorator', 'config', 'logger'];
JasmineDiffFramework.$inject = ['config', 'logger'];

var modules = {
  'reporter:jasmine-diff': ['type', JasmineDiffReporter]
};

// Framework insertion is different in 0.x and 1.x karma, manually injecting
// a framework won't work in 1.x, but files injection does work from inside
// of the reporter
if (karmaMajorVersion < 1) {
  modules['framework:jasmine-diff'] = ['factory', JasmineDiffFramework];
}

module.exports = modules;
