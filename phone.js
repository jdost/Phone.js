/**
 * Phone.js
 **/

(function () {
   if (typeof window.phone !== 'undefined')
      return;

   var isNum = function (char) {
      if (isNaN(char)) {
         return false;
      } else if (char === " ") {
         return false;
      }

      return true;
   };

   var parseString = function (phoneString) {
      if (typeof phoneString !== 'string') {
         return [];
      }

      var numberSet = [];
      for (var i = 0, l = phoneString.length; i < l; i++) {
         var current = phoneString[i];
         if (isNum(current)) {
            numberSet.push(parseInt(current));
         }
      }

      return numberSet;
   }
     , validate = function (set) {
      if (typeof set === 'string') {
         set = parseString(set);
      }

      return set.length >= 7;
   }
     , makeSet = function (nums) {
      var set = {};
      set.base = nums;
      set.string = "";
      for (var i = 0, l = nums.length; i < l; i++) {
         set.base += nums[i].toString();
      }

      return set;
   }
   /**
    *   Example base: +01 312 123 4567 (this number is actually not valid)
    * %C - Country Code ("01")
    * %A - Area Code ("312")
    * %N - Full Subscriber number ("1234567")
    * %N3 - First half of the subscriber number ("123")
    * %N4 - Second half of the subscriber number ("4567")
    **/
     , FORMATS = {
      /**
       * phone.US
       *   the US convention for phone numbers, (AAA) SSS-SSSS
       *
       *   >> p.toString(phone.US);
       *   "(111) 222-3333"
       **/
      US : "(%A) %N3-%N4"
      /**
       * phone.INTERNATIONAL
       *   the international convention for phone numbers, +CC AAA SSS SSSS
       *
       *   >> p.toString(phone.INTERNATIONAL);
       *   "+01 111 222 3333"
       **/
   ,  INTERNATIONAL : "+%C %A %N1 %N2"
   };

   /**
    * phone(""):
    *   builds the Phone object, this is the wrapper for handling the phone data
    *   the input is a datatype defining the Phone object, right now handles a
    *   string or object, the object expects that there is a property 'src' that
    *   holds a string describing the phone number.
    *
    *   the string just needs to have numbers for the phone number, it tests for
    *   characters that are a number and pushes them onto a stack, then checks the
    *   stack size against valid number lengths.
    *
    *   >> var p = phone("(111) 222-3333"); // this is not a valid number, it should
    *                 throw an error, but in this example, we shall ignore it
    *   [object]
    **/
   window.phone = function (builder) {
      var settings = {};
      if (typeof builder === 'string') {
         settings.src = builder;
      } else if (typeof builder === 'object') {
         settings = builder;
      } else {
         throw("phone() needs either a string or an object for a parameter");
      }

      settings.base = parseString(settings.src);

      var pos = 0;
      if (settings.base[0] === 1) {
         pos++;
      }
      if ((settings.base.length - pos) > 11) {
         settings.countryCode = makeSet(settings.base.slice(pos, pos+2));
         pos += 2;
      }
      if ((settings.base.length - pos) > 9) {
         settings.areaCode = makeSet(settings.base.slice(pos,pos+3));
         pos += 3;
      }
      if ((settings.base.length - pos) > 6) {
         settings.local = makeSet(settings.base.slice(pos, pos+7));
      }

      var stripped = false;
      return {
         /**
          * phone().toString():
          *   outputs a string format for the number in the object.  This takes a parameter
          *   for formatting the output string.  This parameter is either a defined format
          *   from the phone object (explained later) or a string with the defined 'wildcards'
          *
          *   >> p.toString();
          *   "(111) 222-3333"
          *   >> p.toString(phone.INTERNATIONAL);
          *   "+01 111 222 3333"
          **/
         toString: function (format) {
            if (typeof format === 'undefined') {
               format = FORMATS.US;
            }

            var str = "";
            var mod = false;
            for (var i = 0, l = format.length; i < l; i++) {
               var current = format[i];
               if (mod) {
                  switch (current) {
                     case "A": if (typeof settings.areaCode === 'object') { str += settings.areaCode.string; }
                               break;
                     case "N": i++;
                               current = format[i];
                               if (typeof settings.local === 'object') {
                                  if (current == "3") { str += settings.local.string.substr(0, 3); }
                                  else if (current == "4") { str += settings.local.string.substr(3, 4); }
                               }
                               break;
                  }
                  mod = false;
               } else {
                  switch (current) {
                     case "%": mod = true;
                               break;
                     default : if (!stripped) { str += current; }
                  }
               }
            }

            stripped = false;
            return str;
         }
         /**
          * phone().toHTML():
          *   returns an HTML node that acts as a valid telephone value in the DOM.  This will be
          *   an anchor with the href value of "tel:" and then the number value.  This takes an
          *   optional parameter for the format (like with <toString>) that will be used for the
          *   representation in the inner value of the node.  This format is also used as the basis
          *   for the href properties of the node, if the format leaves out Country Code, so will
          *   the href property.
          *
          *   >> p.toHTML()
          *   "<a href=\"tel:1112223333\">(111) 222-3333</a>" // this is just what the raw HTML
          *                would look like, shouldn't return a string
          **/
     ,   toHTML: function (format) {
            stripped = true;
            var pureNumber = this.toString(format);

            var node = document.createElement("a");
            node.innerHTML = this.toString(format);
            node.setAttribute("href", "tel:" + pureNumber);

            return node;
         }
      }
   };

   for (type in FORMATS) {
      window.phone[type] = FORMATS[type];
   }
   window.isValid = validate;
}) ();
