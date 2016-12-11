'use strict';

function findValueInPairsByKey(pairs, key) {
  for (var i = 0; i < pairs.length; i++) {
    if (pairs[i].key === key) {
      return pairs[i].value;
    }
  }
}

function Value(type, text, children, options) {
  options = options || {};

  this.type = type;
  this.text = text;
  this.children = children || [];


  this.any = options.any || false;
  this.instance = options.instance || 'Object';
}

Value.prototype.byPath = function (path) {
  if (path === '') {
    return this;
  }

  if (this.type !== Value.ARRAY &&
      this.type !== Value.OBJECT &&
      this.type !== Value.INSTANCE
  ) {
    return;
  }

  var parts = path.split('.');
  var result = this;

  for (var i = 0; i < parts.length; i++) {
    var key = parts[i];
    if (result.type === Value.ARRAY) {
      key = Number(key);
    }

    var found = findValueInPairsByKey(result.children, key);
    if (!found) {
      return;
    }

    result = found;
  }

  return result;
};

Value.BOOLEAN = 'BOOLEAN';
Value.UNDEFINED = 'UNDEFINED';
Value.NULL = 'NULL';
Value.STRING = 'STRING';
Value.FUNCTION = 'FUNCTION';
Value.NUMBER = 'NUMBER';
Value.ARRAY = 'ARRAY';
Value.OBJECT = 'OBJECT';
Value.INSTANCE = 'INSTANCE';
Value.DEFINED = 'DEFINED';
Value.TRUTHY = 'TRUTHY';
Value.FALSY = 'FALSY';
Value.CLOSE_TO = 'CLOSE_TO';
Value.GREATER_THAN = 'GREATER_THAN';
Value.LESS_THAN = 'LESS_THAN';

module.exports = Value;
