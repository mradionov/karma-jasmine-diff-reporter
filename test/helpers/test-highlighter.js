'use strict';

function createTestFormatter(options) {
  // Do not highlight whitespaced and default text in tests to keep
  // tests clean. Code for both these cases is pretty straightforward,
  // so there is no much need to include them in every test.
  options = options || {};
  options.whitespace = options.whitespace || false;
  options.defaults = options.defaults || false;

  function actual(string) {
    if (!options.whitespace) {
      return actualText(string);
    }
    return string
      .replace(/\S+/g, actualText)
      .replace(/\s+/g, actualWhitespace);
  }

  function actualText(string) {
    return '<a>' + string + '</a>';
  }

  function actualWhitespace(string) {
    return '<aw>' + string + '</aw>';
  }


  function expected(string) {
    if (!options.whitespace) {
      return expectedText(string);
    }
    return string
      .replace(/\S+/g, expectedText)
      .replace(/\s+/g, expectedWhitespace);
  }

  function expectedText(string) {
    return '<e>' + string + '</e>';
  }

  function expectedWhitespace(string) {
    return '<ew>' + string + '</ew>';
  }


  function warning(string) {
    if (!options.whitespace) {
      return warningText(string);
    }
    return string
      .replace(/\S+/g, warningText)
      .replace(/\s+/g, warningWhitespace);
  }

  function warningText(string) {
    return '<w>' + string + '</w>';
  }

  function warningWhitespace(string) {
    return '<ww>' + string + '</ww>';
  }


  function defaults(string) {
    if (!options.defaults) {
      return string;
    }
    return '<d>' + string + '</d>';
  }


  return {
    actual: actual,
    expected: expected,
    warning: warning,
    defaults: defaults
  };
}


module.exports = createTestFormatter;
