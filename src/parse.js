'use strict';

var Value = require('./value');
var Pair = require('./pair');

var MARKER = '\u200C';

function isBoolean(valueStr) {
  return valueStr === 'true' || valueStr === 'false';
}

// TODO: float
function isNumber(valueStr) {
  return !!valueStr.match(/^\d+$/);
}

function isString(valueStr) {
  var marker = MARKER + "'" + MARKER;
  return valueStr.indexOf(marker) === 0 && valueStr.lastIndexOf(marker) === valueStr.length - 3;
}

function isFunction(valueStr) {
  return valueStr === 'Function';
}

function isArray(valueStr) {
  return valueStr[0] === '[' && valueStr[valueStr.length - 1] === ']';
}

function isObject(valueStr) {
  return valueStr.indexOf('Object({') === 0 && valueStr.lastIndexOf('})') === valueStr.length - 2;
}

function isDefined(valueStr) {
  return valueStr === 'defined';
}

function isUndefined(valueStr) {
  return valueStr === 'undefined';
}

function isTruthy(valueStr) {
  return valueStr === 'truthy';
}

function isFalsy(valueStr) {
  return valueStr === 'falsy';
}

// TODO: float
function isCloseTo(valueStr) {
  return !!valueStr.match(/^close to \d+$/);
}

// TODO: float
function isGreaterThan(valueStr) {
  return !!valueStr.match(/^greater than \d+$/);
}

// TODO: float
function isLessThan(valueStr) {
  return !!valueStr.match(/^less than \d+$/);
}

function extractValues(valueStr) {
  var value = '';
  var values = [];
  var nestLevel = 0;

  for (var i = 0; i < valueStr.length; i++) {
    var ch = valueStr[i];

    if (ch === '[' || ch === '{') {
      nestLevel++;
      value += ch;
      continue;
    }

    if (ch === ']' || ch === '}') {
      nestLevel--;
      value += ch;
      continue;
    }

    if (ch === ',' && nestLevel === 0) {
      values.push(value.trim());
      value = '';
      continue;
    }

    value += ch;
  }

  values.push(value.trim());

  return values;
}

function extractKeyValue(objectValueStr) {
  var semiIndex = objectValueStr.indexOf(':');
  return {
    key: objectValueStr.substr(0, semiIndex).trim(),
    value: objectValueStr.substr(semiIndex + 1, objectValueStr.length - 1).trim()
  };
}

function extractArrayValues(arrayStr) {
  // cut [...]
  var arrayContentStr = arrayStr.substr(1, arrayStr.length - 2);
  var arrayValues = extractValues(arrayContentStr);
  return arrayValues;
}

function extractObjectValues(objectStr) {
  // cut Object({...})
  var objectContentStr = objectStr.substr(8, objectStr.length - 3 - 8);
  var objectValues = extractValues(objectContentStr);


  var objectKeyValues = [];
  for (var i = 0; i < objectValues.length; i++) {
    objectKeyValues.push(extractKeyValue(objectValues[i]));
  }

  return objectKeyValues;
}

var ANY_PATTERN = /^<jasmine\.any\((.*)\)>$/;

function isAny(valueStr) {
  return valueStr.test(ANY_PATTERN);
}

// TODO: infinity? nan? float?
function parse(valueStr) {
  if (isBoolean(valueStr)) {
    return new Value(Value.BOOLEAN, valueStr);
  }
  if (isString(valueStr)) {
    return new Value(Value.STRING, valueStr);
  }
  if (isNumber(valueStr)) {
    return new Value(Value.NUMBER, valueStr);
  }
  if (isFunction(valueStr)) {
    return new Value(Value.FUNCTION, valueStr);
  }
  if (isUndefined(valueStr)) {
    return new Value(Value.UNDEFINED, valueStr);
  }
  if (isDefined(valueStr)) {
    return new Value(Value.DEFINED, valueStr);
  }
  if (isTruthy(valueStr)) {
    return new Value(Value.TRUTHY, valueStr);
  }
  if (isFalsy(valueStr)) {
    return new Value(Value.FALSY, valueStr);
  }
  if (isCloseTo(valueStr)) {
    return new Value(Value.CLOSE_TO, valueStr);
  }
  if (isGreaterThan(valueStr)) {
    return new Value(Value.GREATER_THAN, valueStr);
  }
  if (isLessThan(valueStr)) {
    return new Value(Value.LESS_THAN, valueStr);
  }
  if (isArray(valueStr)) {
    var arrayValues = extractArrayValues(valueStr);
    var children = [];
    for (var i = 0; i < arrayValues.length; i++) {
      var arrayKey = i;
      var arrayValue = arrayValues[i];
      children.push(new Pair(arrayKey, parse(arrayValue)));
    }
    return new Value(Value.ARRAY, valueStr, children);
  }
  if (isObject(valueStr)) {
    var objectValues = extractObjectValues(valueStr);
    var children = [];
    for (var i = 0; i < objectValues.length; i++) {
      var objectKey = objectValues[i].key;
      var objectValue = objectValues[i].value;
      children.push(new Pair(objectKey, parse(objectValue)));
    }
    return new Value(Value.OBJECT, valueStr, children);
  }
  throw new Error('Unknown type for value: ' + valueStr);
}

module.exports = parse;
