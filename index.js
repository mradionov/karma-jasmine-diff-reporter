'use strict';

var jasmineDiff = require('./src/jasmine-diff');

function JasmineDiffReporter(baseReporterDecorator, config) {
  var self = this;

  // Extend Karma Base reporter
  baseReporterDecorator(self);


  config.jasmineDiffReporter = config.jasmineDiffReporter || {};

  var options = {
    matchers: config.jasmineDiffReporter.matchers || {},
    color: config.jasmineDiffReporter.color || {}
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

  // When using console.log from specs, Karma displays them through a method
  // "onBrowserLog". In case, when multiple reporters are used in conjunction
  // with karma-jasmine-diff-reporter, they both will show a console.log,
  // because they both have implementation of this method if inheriting.
  // So just suppress any logs from karma-jasmine-diff-reporter, because
  // it is an utility reporter by doing nothing on browser log,
  // unless it's alone in the "reporters" option and base reporter is used.
  if (hasTrailingReporters) {
    self.onBrowserLog = function () {};
  }

}

JasmineDiffReporter.$inject = ['baseReporterDecorator', 'config'];

module.exports = {
  'reporter:jasmine-diff': ['type', JasmineDiffReporter]
};