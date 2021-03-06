/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const rscheme = /^(?:[a-z\u00a1-\uffff0-9-+]+)(?::|:\/\/)/i;
const defaultScheme = 'http://';

/**
 * @module UrlUtil
 */

/**
 * A simple class for parsing and dealing with URLs.
 * @class UrlUtil
 */
export default class UrlUtil {

  /**
   * Extracts the scheme from a value.
   * @param {String} input The input value.
   * @returns {String} The found scheme.
   */
  static getScheme(input) {
    // This function returns one of following:
    // - scheme + ':' (ex. http:)
    // - scheme + '://' (ex. http://)
    // - null
    let scheme = (rscheme.exec(input) || [])[0];
    return scheme === 'localhost:' ? null : scheme;
  }

  /**
   * Checks if an input has a scheme (e.g., http:// or ftp://).
   * @param {String} input The input value.
   * @returns {Boolean} Whether or not the input has a scheme.
   */
  static hasScheme(input) {
    return !!this.getScheme(input);
  }

  /**
   * Checks if a string is not a URL.
   * @param {String} input The input value.
   * @returns {Boolean} Returns true if this is not a valid URL.
   */
  static isNotURL(input) {
    // for cases, ?abc and "a? b" which should searching query
    const case1Reg = /^(\?)|(\?.+\s)/;
    // for cases, pure string
    const case2Reg = /[\?\.\s\:]/;
    // for cases, data:uri and view-source:uri
    const case3Reg = /^\w+\:.*/;

    let str = input.trim();
    if (case1Reg.test(str) || !case2Reg.test(str) ||
        this.getScheme(str) === str) {
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
      let url = new URL(str);
      return !url;
    } catch(e) {
      return true;
    }
  }

  /**
   * Converts an input string into a URL.
   * @param {String} input The input value.
   * @returns {String} The formatted URL.
   */
  static getUrlFromInput(input) {
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
  static isURL(input) {
    return !this.isNotURL(input);
  }

  /**
   * Checks if a URL is a view-source URL.
   * @param {String} input The input URL.
   * @returns {Boolean} Whether or not this is a view-source URL.
   */
  static isViewSourceUrl(url) {
    return url.toLowerCase().startsWith('view-source:');
  }

  /**
   * Checks if a url is a data url.
   * @param {String} input The input url.
   * @returns {Boolean} Whether or not this is a data url.
   */
  static isDataUrl(url) {
    return url.toLowerCase().startsWith('data:');
  }

  /**
   * Checks if a url is an image data url.
   * @param {String} input The input url.
   * @returns {Boolean} Whether or not this is an image data url.
   */
  static isImageDataUrl(url) {
    return url.toLowerCase().startsWith('data:image/');
  }

  /**
   * Converts a view-source url into a standard url.
   * @param {String} input The view-source url.
   * @returns {String} A normal url.
   */
  static getUrlFromViewSourceUrl(input) {
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
  static getViewSourceUrlFromUrl(input) {
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
  static getHostname(input) {
    try {
      return new URL(input).host;
    } catch (e) {
      return undefined;
    }
  }

}
