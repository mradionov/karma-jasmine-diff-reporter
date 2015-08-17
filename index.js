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

  this.specFailure = function (browser, result) {

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

}

JasmineDiffReporter.$inject = ['baseReporterDecorator', 'config'];

module.exports = {
  'reporter:jasmine-diff': ['type', JasmineDiffReporter]
};