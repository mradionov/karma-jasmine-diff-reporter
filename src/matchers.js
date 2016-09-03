'use strict';

var extend = require('extend');

exports.DEFAULT_MATCHERS = {

  toBe: {
    pattern: /Expected ([\S\s]*) to be ([\S\s]*)\./,
    reverse: true,
    pretty: true
  },

  toEqual: {
    pattern: /Expected ([\S\s]*) to equal ([\S\s]*)\./,
    reverse: true,
    pretty: true
  },

  toHaveBeenCalledWith: {
    pattern: /Expected spy .* to have been called with ([\S\s]*) but actual calls were ([\S\s]*)\./,
    pretty: true
  },

  toThrow: {
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  },

  toThrowError: {
    pattern: /Expected function to throw ([\S\s]*), but it threw ([\S\s]*)\./
  }

};

exports.extend = function (matchers) {
  return extend(true, {}, this.DEFAULT_MATCHERS, matchers);
};
