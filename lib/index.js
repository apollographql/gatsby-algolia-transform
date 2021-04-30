"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _require = require('parse5'),
    parseFragment = _require.parseFragment;

function pageToAlgoliaRecord(_ref, baseUrl) {
  var node = _ref.node;

  var htmlAst = node.htmlAst,
      mdxAST = node.mdxAST,
      content = node.content,
      rest = _objectWithoutProperties(node, ["htmlAst", "mdxAST", "content"]);

  var currentRec = {
    text: ''
  };
  var recsToSave = [];
  var headTags = ['h1', 'h2', 'h3', 'h4'];

  function cleanupAndAppendTextVal(value) {
    var currentTxt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var newText = currentTxt;

    if (value && value !== '\n') {
      var val = value.replace(/(\r\n|\n|\r)/gm, '') || '';
      var currentTxtLen = currentTxt.length;

      if (val.length > 0) {
        if (currentTxtLen > 0) {
          if (currentTxt[currentTxtLen - 1] !== ' ' && val[0] !== ' ') {
            newText += ' ';
          }
        }

        newText += val;
      }
    }

    return newText;
  }

  function buildLink(value, theNode) {
    var _theNode$fields;

    var slugHead = value.replace(/\./g, '').replace(/ /g, '-').toLowerCase();
    return "".concat(baseUrl).concat((theNode === null || theNode === void 0 ? void 0 : (_theNode$fields = theNode.fields) === null || _theNode$fields === void 0 ? void 0 : _theNode$fields.slug) || (theNode === null || theNode === void 0 ? void 0 : theNode.slug) || '', "#").concat(slugHead);
  }

  function splitForHeader(parent, value, theRec) {
    // TODO fix nested elements in headers (like inlineCode)
    //removing headers that are "smaller" than the current one, eg if parent === h2 remove h3, h4 etc...
    var headz = _objectSpread({}, theRec.headings) || {};

    for (var i = headTags.indexOf(parent); i < headTags.length; i++) {
      delete headz[headTags[i]];
    }

    var recToPush = _objectSpread({}, theRec);

    headz[parent] = value;

    if (!recToPush.headings) {
      recToPush.headings = {};
    }

    return [recToPush, {
      text: '',
      headings: headz,
      link: buildLink(value, node)
    }];
  }

  function isHeader(parent) {
    return headTags.includes(parent) || parent.type === 'heading';
  } // TODO: extract code blocks into codeSnippet key


  function parseElem(parent, elem, pageType) {
    var type = elem.type,
        tagName = elem.tagName,
        value = elem.value,
        children = elem.children,
        nodeName = elem.nodeName,
        childNodes = elem.childNodes;

    if (nodeName === '#text' || type === 'inlineCode' || type === 'text') {
      if (isHeader(parent) === false) {
        // just text, we append new chunk of text
        currentRec.text = cleanupAndAppendTextVal(value, currentRec.text);
      } else {
        // TODO: test here if header has multiple children
        // this is a header so we split
        var _ref2 = pageType === 'MDX' ? splitForHeader("h".concat(parent.depth), value, currentRec) : splitForHeader(parent, value, currentRec),
            _ref3 = _slicedToArray(_ref2, 2),
            recToPush = _ref3[0],
            freshRec = _ref3[1]; // and we add rec to array for saving


        recsToSave.push(_objectSpread({}, recToPush)); // reset with current headings state

        currentRec = _objectSpread({}, freshRec);
      }
    } else if (children || childNodes) {
      // drill further down
      return children ? type === 'element' ? traverseChildren(tagName, children) : traverseChildren(elem, children, 'MDX') : traverseChildren(tagName, childNodes, 'HTMLfrag');
    }
  }

  function traverseChildren(parent, children, nodeType) {
    return {
      parent: parent,
      children: children.map(function (child) {
        return parseElem(parent, child, nodeType);
      }).filter(function (elem) {
        return elem !== undefined;
      })
    };
  }

  function getRecsAndReset(node, recs) {
    var _categories$nodes;

    var id = node.id,
        frontmatter = node.frontmatter,
        fields = node.fields,
        slug = node.slug,
        categories = node.categories,
        rest = _objectWithoutProperties(node, ["id", "frontmatter", "fields", "slug", "categories"]);

    var categs = (categories === null || categories === void 0 ? void 0 : (_categories$nodes = categories.nodes) === null || _categories$nodes === void 0 ? void 0 : _categories$nodes.map(function (node) {
      return node.name;
    })) || categories || [];
    var docset = baseUrl.includes('https://www.apollographql.com/docs/') && baseUrl.substring(baseUrl.lastIndexOf('/') + 1);

    if (docset) {
      categs.push('documentation', docset);

      if (['react', 'ios', 'android'].includes(docset)) {
        categs.push('client');
      }

      if (fields !== null && fields !== void 0 && fields.sidebarTitle) {
        categs.push(fields.sidebarTitle.toLowerCase());
      }
    }

    var type = docset ? 'docs' : baseUrl.includes('odyssey') ? 'odyssey' : baseUrl.includes('blog') ? 'blog' : '';
    var url = baseUrl;

    if (type === 'blog') {
      url = "".concat(baseUrl).concat((node === null || node === void 0 ? void 0 : node.link) || '');
    } else {
      url = "".concat(baseUrl).concat((fields === null || fields === void 0 ? void 0 : fields.slug) || slug || '');
    }

    var allRecs = recs.map(function (rec, index) {
      return _objectSpread(_objectSpread(_objectSpread(_objectSpread({
        objectID: "".concat(id, "_").concat(index),
        index: index,
        docset: docset,
        type: type,
        categories: categs,
        url: url
      }, frontmatter), fields), rest), rec);
    });
    return allRecs;
  } // start parsing


  if (htmlAst) {
    traverseChildren('root', htmlAst === null || htmlAst === void 0 ? void 0 : htmlAst.children);
  } else if (mdxAST) {
    traverseChildren(mdxAST, mdxAST === null || mdxAST === void 0 ? void 0 : mdxAST.children, 'MDX');
  } else if (content) {
    var htmlWPAst = parseFragment(content);
    traverseChildren(htmlWPAst, (htmlWPAst === null || htmlWPAst === void 0 ? void 0 : htmlWPAst.childNodes) || [], 'HTMLfrag');
  } // pushing the last record before starting the new page, if not empty


  if (currentRec.text.length) {
    recsToSave.push(_objectSpread({}, currentRec));
  }

  return getRecsAndReset(rest, recsToSave);
}

function parsePages(pages, baseUrl) {
  var _pages$edges;

  return (pages === null || pages === void 0 ? void 0 : (_pages$edges = pages.edges) === null || _pages$edges === void 0 ? void 0 : _pages$edges.flatMap(function (page) {
    return pageToAlgoliaRecord(page, baseUrl);
  })) || [];
}

exports.parse = function (_ref4) {
  var _ref4$data = _ref4.data,
      _ref4$data$pagesMD = _ref4$data.pagesMD,
      pagesMD = _ref4$data$pagesMD === void 0 ? [] : _ref4$data$pagesMD,
      _ref4$data$pagesMDX = _ref4$data.pagesMDX,
      pagesMDX = _ref4$data$pagesMDX === void 0 ? [] : _ref4$data$pagesMDX,
      _ref4$data$pagesWP = _ref4$data.pagesWP,
      pagesWP = _ref4$data$pagesWP === void 0 ? [] : _ref4$data$pagesWP,
      _ref4$baseUrl = _ref4.baseUrl,
      baseUrl = _ref4$baseUrl === void 0 ? '' : _ref4$baseUrl;

  try {
    var allPages = [pagesMD, pagesMDX, pagesWP].flatMap(function (pages) {
      return parsePages(pages, baseUrl);
    });
    console.log("Saving ".concat(allPages.length, " records to Algolia"));
    return allPages;
  } catch (err) {
    console.error(err);
  }
};

exports.queries = require('./queries');
exports.algoliaSettings = require('./settings');