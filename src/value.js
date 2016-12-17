'use strict';

function findValueInPairsByKey(children, key) {
  for (var i = 0; i < children.length; i++) {
    if (children[i].key === key) {
      return children[i];
    }
  }
}

function Value(type, text, options) {
  options = options || {};

  this.type = type;
  this.text = text;

  this.key = typeof options.key !== 'undefined'  ? options.key + '' : '';
  this.any = options.any || false;
  this.instance = options.instance || 'Object';

  this.children = options.children || [];

  this.parent = null;
  this.prev = null;
  this.next = null;
  this.level = 0;

  this.updateReferences();
}

Value.prototype.updateReferences = function (level) {
  level = typeof level === 'undefined' ? this.level + 1 : level;
  // console.log(level);
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];
    child.parent = this;
    child.prev = this.children[i - 1] || null;
    child.next = this.children[i + 1] || null;
    child.level = level;

    child.updateReferences(level + 1);
  }
};

Value.prototype.getPath = function () {
  var path = this.key;
  var parent = this.parent;
  while (parent && parent.key) {
    path = parent.key + '.' + path;
    parent = parent.parent;
  }
  return path;
};

Value.prototype.isLast = function () {
  return this.next === null;
};

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
    var found = findValueInPairsByKey(result.children, key);
    if (!found) {
      return;
    }

    result = found;
  }

  return result;
};

Value.prototype.isPrimitive = function () {
  return !this.isComplex();
};

Value.prototype.isComplex = function () {
  var complexTypes = [
    Value.OBJECT,
    Value.INSTANCE,
    Value.ARRAY,
    Value.FUNCTION
  ];
  return complexTypes.indexOf(this.type) !== -1;
};

Value.prototype.canNest = function () {
  var nestTypes = [
    Value.OBJECT,
    Value.INSTANCE,
    Value.ARRAY,
  ];
  return nestTypes.indexOf(this.type) !== -1;
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
