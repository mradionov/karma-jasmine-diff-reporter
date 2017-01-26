'use strict';

var extend = require('./utils/object').extend;

var DEFAULT_MATCHERS = {

  toBe: {
    pattern: /Expected ([\S\s]*) to be ([\S\s]*)\./,
    reverse: true
  },

  toEqual: {
    pattern: /Expected ([\S\s]*) to equal ([\S\s]*)\./,
    reverse: true
  },

  toHaveBeenCalledWith: {
    pattern: /Expected spy .* to have been called with ([\S\s]*) but actual calls were ([\S\s]*)\./
  },

  toThrow: {
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  }

};

exports.extend = function (customMatchers) {
  customMatchers = customMatchers || {};

  var allMatchers = {};

  extend(allMatchers, DEFAULT_MATCHERS);

  extend(allMatchers, customMatchers);

  return allMatchers;
};
