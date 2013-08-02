;(function (exprt) {
  'use strict';

  var GenericError = function GenericError (label) {
    return function (msg) {
      return {
        "type": function () { return label; },
        "toString" : function () { return label + ": " + msg; }
      };
    };
  };
  var InvalidNumberError = new GenericError ("InvalidNumber");

  var self;
  var isNumber = function (a) { return !(isNaN(a) || a === ' '); };
  /***
   * X - Next (required) digit (right justified)
   * O - Next (optional) digit (will not error if not included)
   ***/
  var FORMATS = {
    INTERNATIONAL : "+OO OOO XXX XXXX",
    US : "(OOO) XXX-XXXX",

    MEXICO : "(OO) XXXX XXXX",
    DENMARK : "OO XX XX XX"
  };
  var DEFAULT = {
    FORMAT : FORMATS.US
  };

  /***
   * Function: wrap_number
   *
   * Turns a primative stack of the extracted digits of a phone number primative
   * into a functional object with proper output values and properties
   ***/
  var wrap_number = function (num) {
    return {
      toString: function (frmt) { return format(num, frmt || DEFAULT.FORMAT); },
      raw: Array.prototype.slice.call(num, 0),
      toHTML: function (frmt) { return html_format(num, frmt || DEFAULT.FORMAT); },
      country: function () { return country_code(num); },
      area: function () { return area_code(num); }
    };
  };
  /***
   * Function : country_code
   *
   * Tries to extract the country code of the number, determines if there are enough
   * digits to account for the regular number and determines whether the rest are
   * just the country code or include the area code
   ***/
  var country_code = function (num) {
  };
  /***
   * Function: area_code
   *
   * Tries to extract the area code of the number, determines if there are enough
   * digits to account for the regular number and then figures whether the
   * remaining digits are the area code
   ***/
  var area_code = function (num) {
  };
  /***
   * Function: format
   *
   * Takes the number stack primative and tries to fill in the provided format
   * string using the stack.  It uses a right first fill in of the `X` placeholders
   * for the digits, any remaining X values that do not have a corresponding (and
   * other characters mixed in) get dropped if there are no more digits, i.e. a 7
   * digit number (simple US format) will not produce an empty section for area code
   ***/
  var format = function format (num, frmt) {
    if (FORMATS[frmt]) { frmt = FORMATS[frmt]; }
    var tmp = Array.prototype.slice.call(num, 0);
    var out = "", temp = "";

    for (var i = frmt.length; i > 0; i--) {
      if (frmt[i-1] === "X") {
        if (num.length) {
          out = (num.pop()).toString() + temp + out;
          temp = "";
        } else {
          throw new InvalidNumberError("Not enough digits for the output format.");
        }
      } else if (frmt[i-1] === "O") {
        if (num.length) {
          out = (num.pop()).toString() + temp + out;
          temp = "";
        } else {
          temp = "";
          break;
        }
      } else {
        temp = frmt[i-1] + temp;
      }
    }

    return temp + out;
  };
  /***
   * Function: html_format
   *
   * Similar to `format` (above) but generates the value inside of valid HTML.  This
   * should be an anchor with the `href` property being a `tel:` protocol with the
   * phone number as the address.
   ***/
  var html_format = function html_format (num, frmt) {
    return "<a href=\"tel:" + num.join('') + "\">" + format(num, frmt) + "</a>";
  };
  /***
   * Function: parse
   *
   * Takes a string and loops over pushing each parsed integer onto the stack (and
   * tossing the rest).  This stack is considered the number primitive.
   ***/
  var parse = function parse (src) {
    var pNumber = [];

    for (var i = 0, l = src.length; i < l; i++) {
      if (isNumber(src[i])) {
        pNumber.push(parseInt(src[i], 10));
      }
    }

    return wrap_number(pNumber);
  };
  /***
   * Function: test
   *
   * Loops over a string and a format and determins whether the format matches the
   * string with the digits replaced with the `X` placeholder.
   ***/
  var test = function test (src, frmt) {
    frmt = frmt || DEFAULT.FORMAT;
    if (FORMATS[frmt]) { frmt = FORMATS[frmt]; }
    src = Array.prototype.slice.call(src, 0);
    frmt = Array.prototype.slice.call(frmt, 0);

    while (frmt.length) {
      var c = frmt.pop();
      if (c === 'O') {
        if (frmt.length+1 === src.length) {
          if (!isNumber(src.pop())) { return false; }
        }
      } else if (c === 'X') {
        if (!isNumber(src.pop())) { return false; }
      } else {
        if (c !== src.pop() && frmt.indexOf('X') !== -1) { return false; }
      }
    }

    return src.length === 0;
  };

  self = function (src) {
    return parse(src);
  };
  self.isValid = test;
  self.FORMAT = FORMATS;
  self.setDefaultFormat = function (frmt) {
    if (FORMATS[frmt]) { frmt = FORMATS[frmt]; }
    DEFAULT.FORMAT = frmt;
  };

  exprt.Phone = self;
}(typeof exports === 'undefined' ? this : exports));
