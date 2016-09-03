'use strict';

function Value(type, text, children) {
  this.type = type;
  this.text = text;
  this.children = children || [];
}

Value.prototype.toString = function () {
  return this.text;
};

Value.prototype.byPath = function (path) {
  var key = path;

  if (this.type === Value.ARRAY) {
    key = NUMBER(path);
    return this.children[key];
  }

  var pair;
  this.children.forEach(function (child) {
    if (child.key === path) {
      pair = child;
    }
  });

  if (pair) {
    return pair.value;
  }

  return;
};

Value.prototype.isEqual = function (value) {
  return this.type === value.type && this.text === value.text;
};

Value.BOOLEAN = 'BOOLEAN';
Value.STRING = 'STRING';
Value.FUNCTION = 'FUNCTION';
Value.NUMBER = 'NUMBER';
Value.ARRAY = 'ARRAY';
Value.OBJECT = 'OBJECT';
Value.UNDEFINED = 'UNDEFINED';
Value.DEFINED = 'DEFINED';
Value.TRUTHY = 'TRUTHY';
Value.FALSY = 'FALSY';
Value.CLOSE_TO = 'CLOSE_TO';
Value.GREATER_THAN = 'GREATER_THAN';
Value.LESS_THAN = 'LESS_THAN';

module.exports = Value;
