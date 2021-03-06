/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var rscheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::|:\/\/)/i;
var defaultScheme = 'http://';

/**
 * @module UrlUtil
 */

/**
 * A simple class for parsing and dealing with URLs.
 * @class UrlUtil
 */

var UrlUtil = (function () {
  function UrlUtil() {
    _classCallCheck(this, UrlUtil);
  }

  _createClass(UrlUtil, null, [{
    key: 'getScheme',

    /**
     * Extracts the scheme from a value.
     * @param {String} input The input value.
     * @returns {String} The found scheme.
     */
    value: function getScheme(input) {
      // This function returns one of following:
      // - scheme + ':' (ex. http:)
      // - scheme + '://' (ex. http://)
      // - null
      var scheme = (rscheme.exec(input) || [])[0];
      return scheme === 'localhost:' ? null : scheme;
    }

    /**
     * Checks if an input has a scheme (e.g., http:// or ftp://).
     * @param {String} input The input value.
     * @returns {Boolean} Whether or not the input has a scheme.
     */
  }, {
    key: 'hasScheme',
    value: function hasScheme(input) {
      return !!this.getScheme(input);
    }

    /**
     * Checks if a string is not a URL.
     * @param {String} input The input value.
     * @returns {Boolean} Returns true if this is not a valid URL.
     */
  }, {
    key: 'isNotURL',
    value: function isNotURL(input) {
      // for cases, ?abc and "a? b" which should searching query
      var case1Reg = /^(\?)|(\?.+\s)/;
      // for cases, pure string
      var case2Reg = /[\?\.\s\:]/;
      // for cases, data:uri and view-source:uri
      var case3Reg = /^\w+\:.*/;

      var str = input.trim();
      if (case1Reg.test(str) || !case2Reg.test(str) || this.getScheme(str) === str) {
        return true;
      }
      if (case3Reg.test(str)) {
        return false;
      }

      if (!this.hasScheme(str)) {
        // No scheme? Prepend to test as a full URL below.
        str = defaultScheme + str;
      }

      try {
        var url = new URL(str);
        return !url;
      } catch (e) {
        return true;
      }
    }

    /**
     * Converts an input string into a URL.
     * @param {String} input The input value.
     * @returns {String} The formatted URL.
     */
  }, {
    key: 'getUrlFromInput',
    value: function getUrlFromInput(input) {
      input = input.trim();

      // If there's no scheme, prepend the default scheme
      if (!this.hasScheme(input)) {
        input = defaultScheme + input;
      }

      if (this.isNotURL(input)) {
        return input;
      }

      return new URL(input).href;
    }

    /**
     * Checks if a given input is a valid URL.
     * @param {String} input The input URL.
     * @returns {Boolean} Whether or not this is a valid URL.
     */
  }, {
    key: 'isURL',
    value: function isURL(input) {
      return !this.isNotURL(input);
    }

    /**
     * Checks if a URL is a view-source URL.
     * @param {String} input The input URL.
     * @returns {Boolean} Whether or not this is a view-source URL.
     */
  }, {
    key: 'isViewSourceUrl',
    value: function isViewSourceUrl(url) {
      return url.toLowerCase().startsWith('view-source:');
    }

    /**
     * Checks if a url is a data url.
     * @param {String} input The input url.
     * @returns {Boolean} Whether or not this is a data url.
     */
  }, {
    key: 'isDataUrl',
    value: function isDataUrl(url) {
      return url.toLowerCase().startsWith('data:');
    }

    /**
     * Checks if a url is an image data url.
     * @param {String} input The input url.
     * @returns {Boolean} Whether or not this is an image data url.
     */
  }, {
    key: 'isImageDataUrl',
    value: function isImageDataUrl(url) {
      return url.toLowerCase().startsWith('data:image/');
    }

    /**
     * Converts a view-source url into a standard url.
     * @param {String} input The view-source url.
     * @returns {String} A normal url.
     */
  }, {
    key: 'getUrlFromViewSourceUrl',
    value: function getUrlFromViewSourceUrl(input) {
      if (!this.isViewSourceUrl(input)) {
        return input;
      }
      return this.getUrlFromInput(input.substring('view-source:'.length));
    }

    /**
     * Converts a URL into a view-source URL.
     * @param {String} input The input URL.
     * @returns {String} The view-source URL.
     */
  }, {
    key: 'getViewSourceUrlFromUrl',
    value: function getViewSourceUrlFromUrl(input) {
      if (this.isViewSourceUrl(input)) {
        return input;
      }

      // Normalizes the actual URL before the view-source: scheme like prefix.
      return 'view-source:' + this.getUrlFromViewSourceUrl(input);
    }

    /**
     * Extracts the hostname or returns undefined.
     * @param {String} input The input URL.
     * @returns {String} The host name.
     */
  }, {
    key: 'getHostname',
    value: function getHostname(input) {
      try {
        return new URL(input).host;
      } catch (e) {
        return undefined;
      }
    }
  }]);

  return UrlUtil;
})();

exports['default'] = UrlUtil;
module.exports = exports['default'];