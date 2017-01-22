'use strict';

exports.isUndefined = function isUndefined(value) {
  return typeof value === 'undefined';
};

exports.isNumber = function isNumber(value) {
  return typeof value === 'number';
};

exports.isObject = function isObject(value) {
  return typeof value === 'object' && value !== null;
};

