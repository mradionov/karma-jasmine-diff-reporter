'use strict';

var path = require('path');
var jasmineDiff = require('./src/jasmine-diff');

function JasmineDiffReporter(baseReporterDecorator, config) {
  var self = this;

  // Extend Karma Base reporter
  baseReporterDecorator(self);

  var reporterOptions = config.jasmineDiffReporter || {};

  var options = {
    matchers: reporterOptions.matchers || {},
    color: reporterOptions.color || {},
    pretty: reporterOptions.pretty || false
  };

  options.color.enabled = !!config.colors;

  // Check if reporter is last in the list of config reporters
  var reporterName = 'jasmine-diff';
  var hasTrailingReporters = config.reporters.slice(-1).pop() !== reporterName;

  // Override Base reporter method
  // Replace original message with highlighted one

  var originalSpecFailure = self.specFailure;

  self.specFailure = function (browser, result) {

    result.log = result.log.map(function (message) {
      return jasmineDiff.createDiffMessage(message, options);
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
  config.frameworks.push('jasmine-diff');

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

JasmineDiffReporter.$inject = ['baseReporterDecorator', 'config'];
JasmineDiffFramework.$inject = ['config', 'logger'];

module.exports = {
  'reporter:jasmine-diff': ['type', JasmineDiffReporter],
  'framework:jasmine-diff': ['factory', JasmineDiffFramework]
};
