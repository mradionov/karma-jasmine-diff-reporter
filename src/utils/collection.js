'use strict';

exports.findBy = function findBy(collection, key, value) {
  for (var i = 0; i < collection.length; i++) {
    if (collection[i][key] === value) {
      return collection[i];
    }
  }
};
