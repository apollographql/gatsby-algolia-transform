"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var baseSettings = {
  searchableAttributes: ['unordered(title)', 'unordered(slug)', 'unordered(categories)', 'unordered(headings.h2)', 'unordered(headings.h3)', 'unordered(headings.h4)', 'unordered(text)', 'unordered(description)'],
  distinct: true,
  customRanking: ['desc(pageviews)', 'asc(index)']
};
module.exports = {
  "default": _objectSpread(_objectSpread({}, baseSettings), {}, {
    attributesForFaceting: ['categories', 'docset', 'type'],
    attributeForDistinct: 'slug'
  }),
  blog: _objectSpread(_objectSpread({}, baseSettings), {}, {
    attributesForFaceting: ['categories', 'type'],
    attributeForDistinct: 'url'
  }),
  odyssey: _objectSpread(_objectSpread({}, baseSettings), {}, {
    attributesForFaceting: ['categories', 'type'],
    attributeForDistinct: 'slug'
  })
};