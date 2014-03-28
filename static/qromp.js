$(document).ready(function(){

var COMPILED = !0, goog = goog || {};
goog.global = window;
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
  if (!COMPILED) {
    if (goog.isProvided_(a)) {
      throw Error('Namespace "' + a + '" already declared.');
    }
    delete goog.implicitNamespaces_[a];
    for (var b = a;(b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) {
      goog.implicitNamespaces_[b] = !0;
    }
  }
  goog.exportPath_(a);
};
goog.setTestOnly = function(a) {
  if (COMPILED && !goog.DEBUG) {
    throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
  }
};
COMPILED || (goog.isProvided_ = function(a) {
  return!goog.implicitNamespaces_[a] && !!goog.getObjectByName(a);
}, goog.implicitNamespaces_ = {});
goog.exportPath_ = function(a, b, c) {
  a = a.split(".");
  c = c || goog.global;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d;a.length && (d = a.shift());) {
    !a.length && goog.isDef(b) ? c[d] = b : c = c[d] ? c[d] : c[d] = {};
  }
};
goog.getObjectByName = function(a, b) {
  for (var c = a.split("."), d = b || goog.global, e;e = c.shift();) {
    if (goog.isDefAndNotNull(d[e])) {
      d = d[e];
    } else {
      return null;
    }
  }
  return d;
};
goog.globalize = function(a, b) {
  var c = b || goog.global, d;
  for (d in a) {
    c[d] = a[d];
  }
};
goog.addDependency = function(a, b, c) {
  if (!COMPILED) {
    var d;
    a = a.replace(/\\/g, "/");
    for (var e = goog.dependencies_, f = 0;d = b[f];f++) {
      e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
    }
    for (d = 0;b = c[d];d++) {
      a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0;
    }
  }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
  if (!COMPILED && !goog.isProvided_(a)) {
    if (goog.ENABLE_DEBUG_LOADER) {
      var b = goog.getPathFromDeps_(a);
      if (b) {
        goog.included_[b] = !0;
        goog.writeScripts_();
        return;
      }
    }
    a = "goog.require could not find: " + a;
    goog.global.console && goog.global.console.error(a);
    throw Error(a);
  }
};
goog.basePath = "";
goog.nullFunction = function() {
};
goog.identityFunction = function(a, b) {
  return a;
};
goog.abstractMethod = function() {
  throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
  a.getInstance = function() {
    if (a.instance_) {
      return a.instance_;
    }
    goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
    return a.instance_ = new a;
  };
};
goog.instantiatedSingletons_ = [];
!COMPILED && goog.ENABLE_DEBUG_LOADER && (goog.included_ = {}, goog.dependencies_ = {pathToNames:{}, nameToPath:{}, requires:{}, visited:{}, written:{}}, goog.inHtmlDocument_ = function() {
  var a = goog.global.document;
  return "undefined" != typeof a && "write" in a;
}, goog.findBasePath_ = function() {
  if (goog.global.CLOSURE_BASE_PATH) {
    goog.basePath = goog.global.CLOSURE_BASE_PATH;
  } else {
    if (goog.inHtmlDocument_()) {
      for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1;0 <= b;--b) {
        var c = a[b].src, d = c.lastIndexOf("?"), d = -1 == d ? c.length : d;
        if ("base.js" == c.substr(d - 7, 7)) {
          goog.basePath = c.substr(0, d - 7);
          break;
        }
      }
    }
  }
}, goog.importScript_ = function(a) {
  var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
  !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0);
}, goog.writeScriptTag_ = function(a) {
  if (goog.inHtmlDocument_()) {
    var b = goog.global.document;
    if ("complete" == b.readyState) {
      if (/\bdeps.js$/.test(a)) {
        return!1;
      }
      throw Error('Cannot write "' + a + '" after document load');
    }
    b.write('\x3cscript type\x3d"text/javascript" src\x3d"' + a + '"\x3e\x3c/script\x3e');
    return!0;
  }
  return!1;
}, goog.writeScripts_ = function() {
  function a(e) {
    if (!(e in d.written)) {
      if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires)) {
        for (var g in d.requires[e]) {
          if (!goog.isProvided_(g)) {
            if (g in d.nameToPath) {
              a(d.nameToPath[g]);
            } else {
              throw Error("Undefined nameToPath for " + g);
            }
          }
        }
      }
      e in c || (c[e] = !0, b.push(e));
    }
  }
  var b = [], c = {}, d = goog.dependencies_, e;
  for (e in goog.included_) {
    d.written[e] || a(e);
  }
  for (e = 0;e < b.length;e++) {
    if (b[e]) {
      goog.importScript_(goog.basePath + b[e]);
    } else {
      throw Error("Undefined script input");
    }
  }
}, goog.getPathFromDeps_ = function(a) {
  return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null;
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
};
goog.isDef = function(a) {
  return void 0 !== a;
};
goog.isNull = function(a) {
  return null === a;
};
goog.isDefAndNotNull = function(a) {
  return null != a;
};
goog.isArray = function(a) {
  return "array" == goog.typeOf(a);
};
goog.isArrayLike = function(a) {
  var b = goog.typeOf(a);
  return "array" == b || "object" == b && "number" == typeof a.length;
};
goog.isDateLike = function(a) {
  return goog.isObject(a) && "function" == typeof a.getFullYear;
};
goog.isString = function(a) {
  return "string" == typeof a;
};
goog.isBoolean = function(a) {
  return "boolean" == typeof a;
};
goog.isNumber = function(a) {
  return "number" == typeof a;
};
goog.isFunction = function(a) {
  return "function" == goog.typeOf(a);
};
goog.isObject = function(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
};
goog.getUid = function(a) {
  return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};
goog.removeUid = function(a) {
  "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
  try {
    delete a[goog.UID_PROPERTY_];
  } catch (b) {
  }
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.cloneObject(a[c]);
    }
    return b;
  }
  return a;
};
goog.bindNative_ = function(a, b, c) {
  return a.call.apply(a.bind, arguments);
};
goog.bindJs_ = function(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
};
goog.bind = function(a, b, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
  return goog.bind.apply(null, arguments);
};
goog.partial = function(a, b) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var b = Array.prototype.slice.call(arguments);
    b.unshift.apply(b, c);
    return a.apply(this, b);
  };
};
goog.mixin = function(a, b) {
  for (var c in b) {
    a[c] = b[c];
  }
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
  return+new Date;
};
goog.globalEval = function(a) {
  if (goog.global.execScript) {
    goog.global.execScript(a, "JavaScript");
  } else {
    if (goog.global.eval) {
      if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ \x3d 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) {
        goog.global.eval(a);
      } else {
        var b = goog.global.document, c = b.createElement("script");
        c.type = "text/javascript";
        c.defer = !1;
        c.appendChild(b.createTextNode(a));
        b.body.appendChild(c);
        b.body.removeChild(c);
      }
    } else {
      throw Error("goog.globalEval not available");
    }
  }
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
  var c = function(a) {
    return goog.cssNameMapping_[a] || a;
  }, d = function(a) {
    a = a.split("-");
    for (var b = [], d = 0;d < a.length;d++) {
      b.push(c(a[d]));
    }
    return b.join("-");
  }, d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
    return a;
  };
  return b ? a + "-" + d(b) : d(a);
};
goog.setCssNameMapping = function(a, b) {
  goog.cssNameMapping_ = a;
  goog.cssNameMappingStyle_ = b;
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
  var c = b || {}, d;
  for (d in c) {
    var e = ("" + c[d]).replace(/\$/g, "$$$$");
    a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e);
  }
  return a;
};
goog.getMsgWithFallback = function(a, b) {
  return a;
};
goog.exportSymbol = function(a, b, c) {
  goog.exportPath_(a, b, c);
};
goog.exportProperty = function(a, b, c) {
  a[b] = c;
};
goog.inherits = function(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.superClass_ = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
};
goog.base = function(a, b, c) {
  var d = arguments.callee.caller;
  if (d.superClass_) {
    return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
  }
  for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor;g;g = g.superClass_ && g.superClass_.constructor) {
    if (g.prototype[b] === d) {
      f = !0;
    } else {
      if (f) {
        return g.prototype[b].apply(a, e);
      }
    }
  }
  if (a[b] === d) {
    return a.constructor.prototype[b].apply(a, e);
  }
  throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
  a.call(goog.global);
};
goog.string = {};
goog.string.Unicode = {NBSP:"\u00a0"};
goog.string.startsWith = function(a, b) {
  return 0 == a.lastIndexOf(b, 0);
};
goog.string.endsWith = function(a, b) {
  var c = a.length - b.length;
  return 0 <= c && a.indexOf(b, c) == c;
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length));
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
  return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length));
};
goog.string.subs = function(a, b) {
  for (var c = 1;c < arguments.length;c++) {
    var d = String(arguments[c]).replace(/\$/g, "$$$$");
    a = a.replace(/\%s/, d);
  }
  return a;
};
goog.string.collapseWhitespace = function(a) {
  return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "");
};
goog.string.isEmpty = function(a) {
  return/^[\s\xa0]*$/.test(a);
};
goog.string.isEmptySafe = function(a) {
  return goog.string.isEmpty(goog.string.makeSafe(a));
};
goog.string.isBreakingWhitespace = function(a) {
  return!/[^\t\n\r ]/.test(a);
};
goog.string.isAlpha = function(a) {
  return!/[^a-zA-Z]/.test(a);
};
goog.string.isNumeric = function(a) {
  return!/[^0-9]/.test(a);
};
goog.string.isAlphaNumeric = function(a) {
  return!/[^a-zA-Z0-9]/.test(a);
};
goog.string.isSpace = function(a) {
  return " " == a;
};
goog.string.isUnicodeChar = function(a) {
  return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a;
};
goog.string.stripNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)+/g, " ");
};
goog.string.canonicalizeNewlines = function(a) {
  return a.replace(/(\r\n|\r|\n)/g, "\n");
};
goog.string.normalizeWhitespace = function(a) {
  return a.replace(/\xa0|\s/g, " ");
};
goog.string.normalizeSpaces = function(a) {
  return a.replace(/\xa0|[ \t]+/g, " ");
};
goog.string.collapseBreakingSpaces = function(a) {
  return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "");
};
goog.string.trim = function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
goog.string.trimLeft = function(a) {
  return a.replace(/^[\s\xa0]+/, "");
};
goog.string.trimRight = function(a) {
  return a.replace(/[\s\xa0]+$/, "");
};
goog.string.caseInsensitiveCompare = function(a, b) {
  var c = String(a).toLowerCase(), d = String(b).toLowerCase();
  return c < d ? -1 : c == d ? 0 : 1;
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
  if (a == b) {
    return 0;
  }
  if (!a) {
    return-1;
  }
  if (!b) {
    return 1;
  }
  for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0;f < e;f++) {
    var g = c[f], h = d[f];
    if (g != h) {
      return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1;
    }
  }
  return c.length != d.length ? c.length - d.length : a < b ? -1 : 1;
};
goog.string.urlEncode = function(a) {
  return encodeURIComponent(String(a));
};
goog.string.urlDecode = function(a) {
  return decodeURIComponent(a.replace(/\+/g, " "));
};
goog.string.newLineToBr = function(a, b) {
  return a.replace(/(\r\n|\r|\n)/g, b ? "\x3cbr /\x3e" : "\x3cbr\x3e");
};
goog.string.htmlEscape = function(a, b) {
  if (b) {
    return a.replace(goog.string.amperRe_, "\x26amp;").replace(goog.string.ltRe_, "\x26lt;").replace(goog.string.gtRe_, "\x26gt;").replace(goog.string.quotRe_, "\x26quot;");
  }
  if (!goog.string.allRe_.test(a)) {
    return a;
  }
  -1 != a.indexOf("\x26") && (a = a.replace(goog.string.amperRe_, "\x26amp;"));
  -1 != a.indexOf("\x3c") && (a = a.replace(goog.string.ltRe_, "\x26lt;"));
  -1 != a.indexOf("\x3e") && (a = a.replace(goog.string.gtRe_, "\x26gt;"));
  -1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "\x26quot;"));
  return a;
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
  return goog.string.contains(a, "\x26") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a;
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
  var b = {"\x26amp;":"\x26", "\x26lt;":"\x3c", "\x26gt;":"\x3e", "\x26quot;":'"'}, c = document.createElement("div");
  return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
    var f = b[a];
    if (f) {
      return f;
    }
    if ("#" == e.charAt(0)) {
      var g = Number("0" + e.substr(1));
      isNaN(g) || (f = String.fromCharCode(g));
    }
    f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
    return b[a] = f;
  });
};
goog.string.unescapePureXmlEntities_ = function(a) {
  return a.replace(/&([^;]+);/g, function(a, c) {
    switch(c) {
      case "amp":
        return "\x26";
      case "lt":
        return "\x3c";
      case "gt":
        return "\x3e";
      case "quot":
        return'"';
      default:
        if ("#" == c.charAt(0)) {
          var d = Number("0" + c.substr(1));
          if (!isNaN(d)) {
            return String.fromCharCode(d);
          }
        }
        return a;
    }
  });
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
  return goog.string.newLineToBr(a.replace(/  /g, " \x26#160;"), b);
};
goog.string.stripQuotes = function(a, b) {
  for (var c = b.length, d = 0;d < c;d++) {
    var e = 1 == c ? b : b.charAt(d);
    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) {
      return a.substring(1, a.length - 1);
    }
  }
  return a;
};
goog.string.truncate = function(a, b, c) {
  c && (a = goog.string.unescapeEntities(a));
  a.length > b && (a = a.substring(0, b - 3) + "...");
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.truncateMiddle = function(a, b, c, d) {
  c && (a = goog.string.unescapeEntities(a));
  if (d && a.length > b) {
    d > b && (d = b);
    var e = a.length - d;
    a = a.substring(0, b - d) + "..." + a.substring(e);
  } else {
    a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
  }
  c && (a = goog.string.htmlEscape(a));
  return a;
};
goog.string.specialEscapeChars_ = {"\x00":"\\0", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t", "\x0B":"\\x0B", '"':'\\"', "\\":"\\\\"};
goog.string.jsEscapeCache_ = {"'":"\\'"};
goog.string.quote = function(a) {
  a = String(a);
  if (a.quote) {
    return a.quote();
  }
  for (var b = ['"'], c = 0;c < a.length;c++) {
    var d = a.charAt(c), e = d.charCodeAt(0);
    b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d));
  }
  b.push('"');
  return b.join("");
};
goog.string.escapeString = function(a) {
  for (var b = [], c = 0;c < a.length;c++) {
    b[c] = goog.string.escapeChar(a.charAt(c));
  }
  return b.join("");
};
goog.string.escapeChar = function(a) {
  if (a in goog.string.jsEscapeCache_) {
    return goog.string.jsEscapeCache_[a];
  }
  if (a in goog.string.specialEscapeChars_) {
    return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
  }
  var b = a, c = a.charCodeAt(0);
  if (31 < c && 127 > c) {
    b = a;
  } else {
    if (256 > c) {
      if (b = "\\x", 16 > c || 256 < c) {
        b += "0";
      }
    } else {
      b = "\\u", 4096 > c && (b += "0");
    }
    b += c.toString(16).toUpperCase();
  }
  return goog.string.jsEscapeCache_[a] = b;
};
goog.string.toMap = function(a) {
  for (var b = {}, c = 0;c < a.length;c++) {
    b[a.charAt(c)] = !0;
  }
  return b;
};
goog.string.contains = function(a, b) {
  return-1 != a.indexOf(b);
};
goog.string.countOf = function(a, b) {
  return a && b ? a.split(b).length - 1 : 0;
};
goog.string.removeAt = function(a, b, c) {
  var d = a;
  0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
  return d;
};
goog.string.remove = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "");
  return a.replace(c, "");
};
goog.string.removeAll = function(a, b) {
  var c = RegExp(goog.string.regExpEscape(b), "g");
  return a.replace(c, "");
};
goog.string.regExpEscape = function(a) {
  return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08");
};
goog.string.repeat = function(a, b) {
  return Array(b + 1).join(a);
};
goog.string.padNumber = function(a, b, c) {
  a = goog.isDef(c) ? a.toFixed(c) : String(a);
  c = a.indexOf(".");
  -1 == c && (c = a.length);
  return goog.string.repeat("0", Math.max(0, b - c)) + a;
};
goog.string.makeSafe = function(a) {
  return null == a ? "" : String(a);
};
goog.string.buildString = function(a) {
  return Array.prototype.join.call(arguments, "");
};
goog.string.getRandomString = function() {
  return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36);
};
goog.string.compareVersions = function(a, b) {
  for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0;0 == c && g < f;g++) {
    var h = d[g] || "", k = e[g] || "", l = RegExp("(\\d*)(\\D*)", "g"), m = RegExp("(\\d*)(\\D*)", "g");
    do {
      var n = l.exec(h) || ["", "", ""], r = m.exec(k) || ["", "", ""];
      if (0 == n[0].length && 0 == r[0].length) {
        break;
      }
      var c = 0 == n[1].length ? 0 : parseInt(n[1], 10), p = 0 == r[1].length ? 0 : parseInt(r[1], 10), c = goog.string.compareElements_(c, p) || goog.string.compareElements_(0 == n[2].length, 0 == r[2].length) || goog.string.compareElements_(n[2], r[2]);
    } while (0 == c);
  }
  return c;
};
goog.string.compareElements_ = function(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
  for (var b = 0, c = 0;c < a.length;++c) {
    b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
  }
  return b;
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
  return "goog_" + goog.string.uniqueStringCounter_++;
};
goog.string.toNumber = function(a) {
  var b = Number(a);
  return 0 == b && goog.string.isEmpty(a) ? NaN : b;
};
goog.string.toCamelCase = function(a) {
  return String(a).replace(/\-([a-z])/g, function(a, c) {
    return c.toUpperCase();
  });
};
goog.string.toSelectorCase = function(a) {
  return String(a).replace(/([A-Z])/g, "-$1").toLowerCase();
};
goog.string.toTitleCase = function(a, b) {
  var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
  return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
    return b + c.toUpperCase();
  });
};
goog.string.parseInt = function(a) {
  isFinite(a) && (a = String(a));
  return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN;
};
goog.debug = {};
goog.debug.Error = function(a) {
  Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
  a && (this.message = String(a));
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
  b.unshift(a);
  goog.debug.Error.call(this, goog.string.subs.apply(null, b));
  b.shift();
  this.messagePattern = a;
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
  var e = "Assertion failed";
  if (c) {
    var e = e + (": " + c), f = d
  } else {
    a && (e += ": " + a, f = b);
  }
  throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.fail = function(a, b) {
  if (goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
  }
};
goog.asserts.assertNumber = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertString = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertFunction = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertObject = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertArray = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertBoolean = function(a, b, c) {
  goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
  return a;
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
  !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
  return a;
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
  return a[a.length - 1];
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c);
} : function(a, b, c) {
  c = null == c ? a.length - 1 : c;
  0 > c && (c = Math.max(0, a.length + c));
  if (goog.isString(a)) {
    return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
  }
  for (;0 <= c;c--) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return-1;
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    f in e && b.call(c, e[f], f, a);
  }
};
goog.array.forEachRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;--d) {
    d in e && b.call(c, e[d], d, a);
  }
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0;h < d;h++) {
    if (h in g) {
      var k = g[h];
      b.call(c, k, h, a) && (e[f++] = k);
    }
  }
  return e;
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0;g < d;g++) {
    g in f && (e[g] = b.call(c, f[g], g, a));
  }
  return e;
};
goog.array.reduce = function(a, b, c, d) {
  if (a.reduce) {
    return d ? a.reduce(goog.bind(b, d), c) : a.reduce(b, c);
  }
  var e = c;
  goog.array.forEach(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.reduceRight = function(a, b, c, d) {
  if (a.reduceRight) {
    return d ? a.reduceRight(goog.bind(b, d), c) : a.reduceRight(b, c);
  }
  var e = c;
  goog.array.forEachRight(a, function(c, g) {
    e = b.call(d, e, c, g, a);
  });
  return e;
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return!0;
    }
  }
  return!1;
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && !b.call(c, e[f], f, a)) {
      return!1;
    }
  }
  return!0;
};
goog.array.count = function(a, b, c) {
  var d = 0;
  goog.array.forEach(a, function(a, f, g) {
    b.call(c, a, f, g) && ++d;
  }, c);
  return d;
};
goog.array.find = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndex = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return f;
    }
  }
  return-1;
};
goog.array.findRight = function(a, b, c) {
  b = goog.array.findIndexRight(a, b, c);
  return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b];
};
goog.array.findIndexRight = function(a, b, c) {
  for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1;0 <= d;d--) {
    if (d in e && b.call(c, e[d], d, a)) {
      return d;
    }
  }
  return-1;
};
goog.array.contains = function(a, b) {
  return 0 <= goog.array.indexOf(a, b);
};
goog.array.isEmpty = function(a) {
  return 0 == a.length;
};
goog.array.clear = function(a) {
  if (!goog.isArray(a)) {
    for (var b = a.length - 1;0 <= b;b--) {
      delete a[b];
    }
  }
  a.length = 0;
};
goog.array.insert = function(a, b) {
  goog.array.contains(a, b) || a.push(b);
};
goog.array.insertAt = function(a, b, c) {
  goog.array.splice(a, c, 0, b);
};
goog.array.insertArrayAt = function(a, b, c) {
  goog.partial(goog.array.splice, a, c, 0).apply(null, b);
};
goog.array.insertBefore = function(a, b, c) {
  var d;
  2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d);
};
goog.array.remove = function(a, b) {
  var c = goog.array.indexOf(a, b), d;
  (d = 0 <= c) && goog.array.removeAt(a, c);
  return d;
};
goog.array.removeAt = function(a, b) {
  goog.asserts.assert(null != a.length);
  return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length;
};
goog.array.removeIf = function(a, b, c) {
  b = goog.array.findIndex(a, b, c);
  return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1;
};
goog.array.concat = function(a) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments);
};
goog.array.toArray = function(a) {
  var b = a.length;
  if (0 < b) {
    for (var c = Array(b), d = 0;d < b;d++) {
      c[d] = a[d];
    }
    return c;
  }
  return[];
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
  for (var c = 1;c < arguments.length;c++) {
    var d = arguments[c], e;
    if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) {
      a.push.apply(a, d);
    } else {
      if (e) {
        for (var f = a.length, g = d.length, h = 0;h < g;h++) {
          a[f + h] = d[h];
        }
      } else {
        a.push(d);
      }
    }
  }
};
goog.array.splice = function(a, b, c, d) {
  goog.asserts.assert(null != a.length);
  return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1));
};
goog.array.slice = function(a, b, c) {
  goog.asserts.assert(null != a.length);
  return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c);
};
goog.array.removeDuplicates = function(a, b) {
  for (var c = b || a, d = {}, e = 0, f = 0;f < a.length;) {
    var g = a[f++], h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
    Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g);
  }
  c.length = e;
};
goog.array.binarySearch = function(a, b, c) {
  return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b);
};
goog.array.binarySelect = function(a, b, c) {
  return goog.array.binarySearch_(a, b, !0, void 0, c);
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
  for (var f = 0, g = a.length, h;f < g;) {
    var k = f + g >> 1, l;
    l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
    0 < l ? f = k + 1 : (g = k, h = !l);
  }
  return h ? f : ~f;
};
goog.array.sort = function(a, b) {
  goog.asserts.assert(null != a.length);
  goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare);
};
goog.array.stableSort = function(a, b) {
  for (var c = 0;c < a.length;c++) {
    a[c] = {index:c, value:a[c]};
  }
  var d = b || goog.array.defaultCompare;
  goog.array.sort(a, function(a, b) {
    return d(a.value, b.value) || a.index - b.index;
  });
  for (c = 0;c < a.length;c++) {
    a[c] = a[c].value;
  }
};
goog.array.sortObjectsByKey = function(a, b, c) {
  var d = c || goog.array.defaultCompare;
  goog.array.sort(a, function(a, c) {
    return d(a[b], c[b]);
  });
};
goog.array.isSorted = function(a, b, c) {
  b = b || goog.array.defaultCompare;
  for (var d = 1;d < a.length;d++) {
    var e = b(a[d - 1], a[d]);
    if (0 < e || 0 == e && c) {
      return!1;
    }
  }
  return!0;
};
goog.array.equals = function(a, b, c) {
  if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) {
    return!1;
  }
  var d = a.length;
  c = c || goog.array.defaultCompareEquality;
  for (var e = 0;e < d;e++) {
    if (!c(a[e], b[e])) {
      return!1;
    }
  }
  return!0;
};
goog.array.compare = function(a, b, c) {
  return goog.array.equals(a, b, c);
};
goog.array.compare3 = function(a, b, c) {
  c = c || goog.array.defaultCompare;
  for (var d = Math.min(a.length, b.length), e = 0;e < d;e++) {
    var f = c(a[e], b[e]);
    if (0 != f) {
      return f;
    }
  }
  return goog.array.defaultCompare(a.length, b.length);
};
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
};
goog.array.binaryInsert = function(a, b, c) {
  c = goog.array.binarySearch(a, b, c);
  return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1;
};
goog.array.binaryRemove = function(a, b, c) {
  b = goog.array.binarySearch(a, b, c);
  return 0 <= b ? goog.array.removeAt(a, b) : !1;
};
goog.array.bucket = function(a, b) {
  for (var c = {}, d = 0;d < a.length;d++) {
    var e = a[d], f = b(e, d, a);
    goog.isDef(f) && (c[f] || (c[f] = [])).push(e);
  }
  return c;
};
goog.array.toObject = function(a, b, c) {
  var d = {};
  goog.array.forEach(a, function(e, f) {
    d[b.call(c, e, f, a)] = e;
  });
  return d;
};
goog.array.range = function(a, b, c) {
  var d = [], e = 0, f = a;
  c = c || 1;
  void 0 !== b && (e = a, f = b);
  if (0 > c * (f - e)) {
    return[];
  }
  if (0 < c) {
    for (a = e;a < f;a += c) {
      d.push(a);
    }
  } else {
    for (a = e;a > f;a += c) {
      d.push(a);
    }
  }
  return d;
};
goog.array.repeat = function(a, b) {
  for (var c = [], d = 0;d < b;d++) {
    c[d] = a;
  }
  return c;
};
goog.array.flatten = function(a) {
  for (var b = [], c = 0;c < arguments.length;c++) {
    var d = arguments[c];
    goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d);
  }
  return b;
};
goog.array.rotate = function(a, b) {
  goog.asserts.assert(null != a.length);
  a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
  return a;
};
goog.array.zip = function(a) {
  if (!arguments.length) {
    return[];
  }
  for (var b = [], c = 0;;c++) {
    for (var d = [], e = 0;e < arguments.length;e++) {
      var f = arguments[e];
      if (c >= f.length) {
        return b;
      }
      d.push(f[c]);
    }
    b.push(d);
  }
};
goog.array.shuffle = function(a, b) {
  for (var c = b || Math.random, d = a.length - 1;0 < d;d--) {
    var e = Math.floor(c() * (d + 1)), f = a[d];
    a[d] = a[e];
    a[e] = f;
  }
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
  for (var d in a) {
    b.call(c, a[d], d, a);
  }
};
goog.object.filter = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    b.call(c, a[e], e, a) && (d[e] = a[e]);
  }
  return d;
};
goog.object.map = function(a, b, c) {
  var d = {}, e;
  for (e in a) {
    d[e] = b.call(c, a[e], e, a);
  }
  return d;
};
goog.object.some = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return!0;
    }
  }
  return!1;
};
goog.object.every = function(a, b, c) {
  for (var d in a) {
    if (!b.call(c, a[d], d, a)) {
      return!1;
    }
  }
  return!0;
};
goog.object.getCount = function(a) {
  var b = 0, c;
  for (c in a) {
    b++;
  }
  return b;
};
goog.object.getAnyKey = function(a) {
  for (var b in a) {
    return b;
  }
};
goog.object.getAnyValue = function(a) {
  for (var b in a) {
    return a[b];
  }
};
goog.object.contains = function(a, b) {
  return goog.object.containsValue(a, b);
};
goog.object.getValues = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = a[d];
  }
  return b;
};
goog.object.getKeys = function(a) {
  var b = [], c = 0, d;
  for (d in a) {
    b[c++] = d;
  }
  return b;
};
goog.object.getValueByKeys = function(a, b) {
  for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1;c < d.length && (a = a[d[c]], goog.isDef(a));c++) {
  }
  return a;
};
goog.object.containsKey = function(a, b) {
  return b in a;
};
goog.object.containsValue = function(a, b) {
  for (var c in a) {
    if (a[c] == b) {
      return!0;
    }
  }
  return!1;
};
goog.object.findKey = function(a, b, c) {
  for (var d in a) {
    if (b.call(c, a[d], d, a)) {
      return d;
    }
  }
};
goog.object.findValue = function(a, b, c) {
  return(b = goog.object.findKey(a, b, c)) && a[b];
};
goog.object.isEmpty = function(a) {
  for (var b in a) {
    return!1;
  }
  return!0;
};
goog.object.clear = function(a) {
  for (var b in a) {
    delete a[b];
  }
};
goog.object.remove = function(a, b) {
  var c;
  (c = b in a) && delete a[b];
  return c;
};
goog.object.add = function(a, b, c) {
  if (b in a) {
    throw Error('The object already contains the key "' + b + '"');
  }
  goog.object.set(a, b, c);
};
goog.object.get = function(a, b, c) {
  return b in a ? a[b] : c;
};
goog.object.set = function(a, b, c) {
  a[b] = c;
};
goog.object.setIfUndefined = function(a, b, c) {
  return b in a ? a[b] : a[b] = c;
};
goog.object.clone = function(a) {
  var b = {}, c;
  for (c in a) {
    b[c] = a[c];
  }
  return b;
};
goog.object.unsafeClone = function(a) {
  var b = goog.typeOf(a);
  if ("object" == b || "array" == b) {
    if (a.clone) {
      return a.clone();
    }
    var b = "array" == b ? [] : {}, c;
    for (c in a) {
      b[c] = goog.object.unsafeClone(a[c]);
    }
    return b;
  }
  return a;
};
goog.object.transpose = function(a) {
  var b = {}, c;
  for (c in a) {
    b[a[c]] = c;
  }
  return b;
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < goog.object.PROTOTYPE_FIELDS_.length;f++) {
      c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
};
goog.object.create = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }
  if (b % 2) {
    throw Error("Uneven number of arguments");
  }
  for (var c = {}, d = 0;d < b;d += 2) {
    c[arguments[d]] = arguments[d + 1];
  }
  return c;
};
goog.object.createSet = function(a) {
  var b = arguments.length;
  if (1 == b && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }
  for (var c = {}, d = 0;d < b;d++) {
    c[arguments[d]] = !0;
  }
  return c;
};
goog.object.createImmutableView = function(a) {
  var b = a;
  Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
  return b;
};
goog.object.isImmutableView = function(a) {
  return!!Object.isFrozen && Object.isFrozen(a);
};
goog.string.StringBuffer = function(a, b) {
  null != a && this.append.apply(this, arguments);
};
goog.string.StringBuffer.prototype.buffer_ = "";
goog.string.StringBuffer.prototype.set = function(a) {
  this.buffer_ = "" + a;
};
goog.string.StringBuffer.prototype.append = function(a, b, c) {
  this.buffer_ += a;
  if (null != b) {
    for (var d = 1;d < arguments.length;d++) {
      this.buffer_ += arguments[d];
    }
  }
  return this;
};
goog.string.StringBuffer.prototype.clear = function() {
  this.buffer_ = "";
};
goog.string.StringBuffer.prototype.getLength = function() {
  return this.buffer_.length;
};
goog.string.StringBuffer.prototype.toString = function() {
  return this.buffer_;
};
var cljs = {core:{}};
cljs.core._STAR_clojurescript_version_STAR_ = "0.0-2156";
cljs.core._STAR_unchecked_if_STAR_ = !1;
cljs.core._STAR_print_fn_STAR_ = function(a) {
  throw Error("No *print-fn* fn set for evaluation environment");
};
cljs.core.set_print_fn_BANG_ = function(a) {
  return cljs.core._STAR_print_fn_STAR_ = a;
};
cljs.core._STAR_flush_on_newline_STAR_ = !0;
cljs.core._STAR_print_newline_STAR_ = !0;
cljs.core._STAR_print_readably_STAR_ = !0;
cljs.core._STAR_print_meta_STAR_ = !1;
cljs.core._STAR_print_dup_STAR_ = !1;
cljs.core._STAR_print_length_STAR_ = null;
cljs.core._STAR_print_level_STAR_ = null;
cljs.core.pr_opts = function() {
  return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", 4338025857), cljs.core._STAR_flush_on_newline_STAR_, new cljs.core.Keyword(null, "readably", "readably", 4441712502), cljs.core._STAR_print_readably_STAR_, new cljs.core.Keyword(null, "meta", "meta", 1017252215), cljs.core._STAR_print_meta_STAR_, new cljs.core.Keyword(null, "dup", "dup", 1014004081), cljs.core._STAR_print_dup_STAR_, new cljs.core.Keyword(null, "print-length", "print-length", 
  3960797560), cljs.core._STAR_print_length_STAR_], null);
};
cljs.core.enable_console_print_BANG_ = function() {
  cljs.core._STAR_print_newline_STAR_ = !1;
  return cljs.core._STAR_print_fn_STAR_ = function() {
    var a = function(a) {
      return console.log.apply(console, cljs.core.into_array.call(null, a));
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }();
};
cljs.core.truth_ = function(a) {
  return null != a && !1 !== a;
};
cljs.core.not_native = null;
cljs.core.identical_QMARK_ = function(a, b) {
  return a === b;
};
cljs.core.nil_QMARK_ = function(a) {
  return null == a;
};
cljs.core.array_QMARK_ = function(a) {
  return a instanceof Array;
};
cljs.core.number_QMARK_ = function(a) {
  return "number" === typeof a;
};
cljs.core.not = function(a) {
  return cljs.core.truth_(a) ? !1 : !0;
};
cljs.core.object_QMARK_ = function(a) {
  return null != a ? a.constructor === Object : !1;
};
cljs.core.string_QMARK_ = function(a) {
  return goog.isString(a);
};
cljs.core.native_satisfies_QMARK_ = function(a, b) {
  return a[goog.typeOf(null == b ? null : b)] ? !0 : a._ ? !0 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null;
};
cljs.core.is_proto_ = function(a) {
  return a.constructor.prototype === a;
};
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.type = function(a) {
  return null == a ? null : a.constructor;
};
cljs.core.missing_protocol = function(a, b) {
  var c = cljs.core.type.call(null, b), c = cljs.core.truth_(cljs.core.truth_(c) ? c.cljs$lang$type : c) ? c.cljs$lang$ctorStr : goog.typeOf(b);
  return Error(["No protocol method ", a, " defined for type ", c, ": ", b].join(""));
};
cljs.core.type__GT_str = function(a) {
  var b = a.cljs$lang$ctorStr;
  return cljs.core.truth_(b) ? b : "" + cljs.core.str(a);
};
cljs.core.make_array = function() {
  var a = null, b = function(b, d) {
    return a.call(null, d);
  }, a = function(a, d) {
    switch(arguments.length) {
      case 1:
        return Array(a);
      case 2:
        return b.call(this, a, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return Array(a);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  return a;
}();
cljs.core.aclone = function(a) {
  for (var b = a.length, c = Array(b), d = 0;;) {
    if (d < b) {
      c[d] = a[d], d += 1;
    } else {
      break;
    }
  }
  return c;
};
cljs.core.array = function(a) {
  return Array.prototype.slice.call(arguments);
};
cljs.core.aget = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.apply.call(null, a, a.call(null, b, c), d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 2:
        return a[d];
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a[b];
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.aset = function() {
  var a = null, b = function() {
    var b = function(b, c, d, h) {
      return cljs.core.apply.call(null, a, b[c], d, h);
    }, d = function(a, d, g, h) {
      var k = null;
      3 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, d, g, k);
    };
    d.cljs$lang$maxFixedArity = 3;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, h, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e, f) {
    switch(arguments.length) {
      case 3:
        return a[d] = e;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, e, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = function(a, b, e) {
    return a[b] = e;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.alength = function(a) {
  return a.length;
};
cljs.core.into_array = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b);
  }, c = function(a, b) {
    return cljs.core.reduce.call(null, function(a, b) {
      a.push(b);
      return a;
    }, [], b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.Fn = function() {
  return{};
}();
cljs.core.IFn = function() {
  return{};
}();
cljs.core._invoke = function() {
  var a = null, b = function(a) {
    if (a ? a.cljs$core$IFn$_invoke$arity$1 : a) {
      return a.cljs$core$IFn$_invoke$arity$1(a);
    }
    var b;
    b = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!b && (b = cljs.core._invoke._, !b)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return b.call(null, a);
  }, c = function(a, b) {
    if (a ? a.cljs$core$IFn$_invoke$arity$2 : a) {
      return a.cljs$core$IFn$_invoke$arity$2(a, b);
    }
    var c;
    c = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._invoke._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return c.call(null, a, b);
  }, d = function(a, b, c) {
    if (a ? a.cljs$core$IFn$_invoke$arity$3 : a) {
      return a.cljs$core$IFn$_invoke$arity$3(a, b, c);
    }
    var d;
    d = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!d && (d = cljs.core._invoke._, !d)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return d.call(null, a, b, c);
  }, e = function(a, b, c, d) {
    if (a ? a.cljs$core$IFn$_invoke$arity$4 : a) {
      return a.cljs$core$IFn$_invoke$arity$4(a, b, c, d);
    }
    var e;
    e = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!e && (e = cljs.core._invoke._, !e)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return e.call(null, a, b, c, d);
  }, f = function(a, b, c, d, e) {
    if (a ? a.cljs$core$IFn$_invoke$arity$5 : a) {
      return a.cljs$core$IFn$_invoke$arity$5(a, b, c, d, e);
    }
    var f;
    f = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!f && (f = cljs.core._invoke._, !f)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return f.call(null, a, b, c, d, e);
  }, g = function(a, b, c, d, e, f) {
    if (a ? a.cljs$core$IFn$_invoke$arity$6 : a) {
      return a.cljs$core$IFn$_invoke$arity$6(a, b, c, d, e, f);
    }
    var g;
    g = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._invoke._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return g.call(null, a, b, c, d, e, f);
  }, h = function(a, b, c, d, e, f, g) {
    if (a ? a.cljs$core$IFn$_invoke$arity$7 : a) {
      return a.cljs$core$IFn$_invoke$arity$7(a, b, c, d, e, f, g);
    }
    var h;
    h = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!h && (h = cljs.core._invoke._, !h)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return h.call(null, a, b, c, d, e, f, g);
  }, k = function(a, b, c, d, e, f, g, h) {
    if (a ? a.cljs$core$IFn$_invoke$arity$8 : a) {
      return a.cljs$core$IFn$_invoke$arity$8(a, b, c, d, e, f, g, h);
    }
    var k;
    k = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!k && (k = cljs.core._invoke._, !k)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return k.call(null, a, b, c, d, e, f, g, h);
  }, l = function(a, b, c, d, e, f, g, h, k) {
    if (a ? a.cljs$core$IFn$_invoke$arity$9 : a) {
      return a.cljs$core$IFn$_invoke$arity$9(a, b, c, d, e, f, g, h, k);
    }
    var s;
    s = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!s && (s = cljs.core._invoke._, !s)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return s.call(null, a, b, c, d, e, f, g, h, k);
  }, m = function(a, b, c, d, e, f, g, h, k, s) {
    if (a ? a.cljs$core$IFn$_invoke$arity$10 : a) {
      return a.cljs$core$IFn$_invoke$arity$10(a, b, c, d, e, f, g, h, k, s);
    }
    var l;
    l = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!l && (l = cljs.core._invoke._, !l)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return l.call(null, a, b, c, d, e, f, g, h, k, s);
  }, n = function(a, b, c, d, e, f, g, h, k, s, l) {
    if (a ? a.cljs$core$IFn$_invoke$arity$11 : a) {
      return a.cljs$core$IFn$_invoke$arity$11(a, b, c, d, e, f, g, h, k, s, l);
    }
    var m;
    m = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!m && (m = cljs.core._invoke._, !m)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return m.call(null, a, b, c, d, e, f, g, h, k, s, l);
  }, r = function(a, b, c, d, e, f, g, h, k, s, l, m) {
    if (a ? a.cljs$core$IFn$_invoke$arity$12 : a) {
      return a.cljs$core$IFn$_invoke$arity$12(a, b, c, d, e, f, g, h, k, s, l, m);
    }
    var p;
    p = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!p && (p = cljs.core._invoke._, !p)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return p.call(null, a, b, c, d, e, f, g, h, k, s, l, m);
  }, p = function(a, b, c, d, e, f, g, h, k, s, l, m, p) {
    if (a ? a.cljs$core$IFn$_invoke$arity$13 : a) {
      return a.cljs$core$IFn$_invoke$arity$13(a, b, c, d, e, f, g, h, k, s, l, m, p);
    }
    var q;
    q = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!q && (q = cljs.core._invoke._, !q)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return q.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p);
  }, s = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q) {
    if (a ? a.cljs$core$IFn$_invoke$arity$14 : a) {
      return a.cljs$core$IFn$_invoke$arity$14(a, b, c, d, e, f, g, h, k, s, l, m, p, q);
    }
    var t;
    t = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!t && (t = cljs.core._invoke._, !t)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return t.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q);
  }, q = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t) {
    if (a ? a.cljs$core$IFn$_invoke$arity$15 : a) {
      return a.cljs$core$IFn$_invoke$arity$15(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t);
    }
    var n;
    n = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!n && (n = cljs.core._invoke._, !n)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return n.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t);
  }, u = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n) {
    if (a ? a.cljs$core$IFn$_invoke$arity$16 : a) {
      return a.cljs$core$IFn$_invoke$arity$16(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n);
    }
    var r;
    r = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!r && (r = cljs.core._invoke._, !r)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return r.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n);
  }, x = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r) {
    if (a ? a.cljs$core$IFn$_invoke$arity$17 : a) {
      return a.cljs$core$IFn$_invoke$arity$17(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r);
    }
    var u;
    u = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!u && (u = cljs.core._invoke._, !u)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return u.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r);
  }, v = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u) {
    if (a ? a.cljs$core$IFn$_invoke$arity$18 : a) {
      return a.cljs$core$IFn$_invoke$arity$18(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u);
    }
    var w;
    w = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!w && (w = cljs.core._invoke._, !w)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return w.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u);
  }, t = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w) {
    if (a ? a.cljs$core$IFn$_invoke$arity$19 : a) {
      return a.cljs$core$IFn$_invoke$arity$19(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w);
    }
    var v;
    v = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!v && (v = cljs.core._invoke._, !v)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return v.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w);
  }, w = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v) {
    if (a ? a.cljs$core$IFn$_invoke$arity$20 : a) {
      return a.cljs$core$IFn$_invoke$arity$20(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v);
    }
    var x;
    x = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!x && (x = cljs.core._invoke._, !x)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return x.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v);
  }, B = function(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v, x) {
    if (a ? a.cljs$core$IFn$_invoke$arity$21 : a) {
      return a.cljs$core$IFn$_invoke$arity$21(a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v, x);
    }
    var B;
    B = cljs.core._invoke[goog.typeOf(null == a ? null : a)];
    if (!B && (B = cljs.core._invoke._, !B)) {
      throw cljs.core.missing_protocol.call(null, "IFn.-invoke", a);
    }
    return B.call(null, a, b, c, d, e, f, g, h, k, s, l, m, p, q, t, n, r, u, w, v, x);
  }, a = function(a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T, U, L, V, Y) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, I);
      case 3:
        return d.call(this, a, I, z);
      case 4:
        return e.call(this, a, I, z, C);
      case 5:
        return f.call(this, a, I, z, C, H);
      case 6:
        return g.call(this, a, I, z, C, H, K);
      case 7:
        return h.call(this, a, I, z, C, H, K, F);
      case 8:
        return k.call(this, a, I, z, C, H, K, F, G);
      case 9:
        return l.call(this, a, I, z, C, H, K, F, G, E);
      case 10:
        return m.call(this, a, I, z, C, H, K, F, G, E, J);
      case 11:
        return n.call(this, a, I, z, C, H, K, F, G, E, J, M);
      case 12:
        return r.call(this, a, I, z, C, H, K, F, G, E, J, M, O);
      case 13:
        return p.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N);
      case 14:
        return s.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R);
      case 15:
        return q.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S);
      case 16:
        return u.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q);
      case 17:
        return x.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T);
      case 18:
        return v.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T, U);
      case 19:
        return t.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T, U, L);
      case 20:
        return w.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T, U, L, V);
      case 21:
        return B.call(this, a, I, z, C, H, K, F, G, E, J, M, O, N, R, S, Q, T, U, L, V, Y);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$5 = f;
  a.cljs$core$IFn$_invoke$arity$6 = g;
  a.cljs$core$IFn$_invoke$arity$7 = h;
  a.cljs$core$IFn$_invoke$arity$8 = k;
  a.cljs$core$IFn$_invoke$arity$9 = l;
  a.cljs$core$IFn$_invoke$arity$10 = m;
  a.cljs$core$IFn$_invoke$arity$11 = n;
  a.cljs$core$IFn$_invoke$arity$12 = r;
  a.cljs$core$IFn$_invoke$arity$13 = p;
  a.cljs$core$IFn$_invoke$arity$14 = s;
  a.cljs$core$IFn$_invoke$arity$15 = q;
  a.cljs$core$IFn$_invoke$arity$16 = u;
  a.cljs$core$IFn$_invoke$arity$17 = x;
  a.cljs$core$IFn$_invoke$arity$18 = v;
  a.cljs$core$IFn$_invoke$arity$19 = t;
  a.cljs$core$IFn$_invoke$arity$20 = w;
  a.cljs$core$IFn$_invoke$arity$21 = B;
  return a;
}();
cljs.core.ICloneable = function() {
  return{};
}();
cljs.core._clone = function(a) {
  if (a ? a.cljs$core$ICloneable$_clone$arity$1 : a) {
    return a.cljs$core$ICloneable$_clone$arity$1(a);
  }
  var b;
  b = cljs.core._clone[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._clone._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICloneable.-clone", a);
  }
  return b.call(null, a);
};
cljs.core.ICounted = function() {
  return{};
}();
cljs.core._count = function(a) {
  if (a ? a.cljs$core$ICounted$_count$arity$1 : a) {
    return a.cljs$core$ICounted$_count$arity$1(a);
  }
  var b;
  b = cljs.core._count[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._count._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ICounted.-count", a);
  }
  return b.call(null, a);
};
cljs.core.IEmptyableCollection = function() {
  return{};
}();
cljs.core._empty = function(a) {
  if (a ? a.cljs$core$IEmptyableCollection$_empty$arity$1 : a) {
    return a.cljs$core$IEmptyableCollection$_empty$arity$1(a);
  }
  var b;
  b = cljs.core._empty[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._empty._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEmptyableCollection.-empty", a);
  }
  return b.call(null, a);
};
cljs.core.ICollection = function() {
  return{};
}();
cljs.core._conj = function(a, b) {
  if (a ? a.cljs$core$ICollection$_conj$arity$2 : a) {
    return a.cljs$core$ICollection$_conj$arity$2(a, b);
  }
  var c;
  c = cljs.core._conj[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._conj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ICollection.-conj", a);
  }
  return c.call(null, a, b);
};
cljs.core.IIndexed = function() {
  return{};
}();
cljs.core._nth = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$IIndexed$_nth$arity$2 : a) {
      return a.cljs$core$IIndexed$_nth$arity$2(a, b);
    }
    var c;
    c = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._nth._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$IIndexed$_nth$arity$3 : a) {
      return a.cljs$core$IIndexed$_nth$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._nth[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._nth._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IIndexed.-nth", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ASeq = function() {
  return{};
}();
cljs.core.ISeq = function() {
  return{};
}();
cljs.core._first = function(a) {
  if (a ? a.cljs$core$ISeq$_first$arity$1 : a) {
    return a.cljs$core$ISeq$_first$arity$1(a);
  }
  var b;
  b = cljs.core._first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-first", a);
  }
  return b.call(null, a);
};
cljs.core._rest = function(a) {
  if (a ? a.cljs$core$ISeq$_rest$arity$1 : a) {
    return a.cljs$core$ISeq$_rest$arity$1(a);
  }
  var b;
  b = cljs.core._rest[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeq.-rest", a);
  }
  return b.call(null, a);
};
cljs.core.INext = function() {
  return{};
}();
cljs.core._next = function(a) {
  if (a ? a.cljs$core$INext$_next$arity$1 : a) {
    return a.cljs$core$INext$_next$arity$1(a);
  }
  var b;
  b = cljs.core._next[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INext.-next", a);
  }
  return b.call(null, a);
};
cljs.core.ILookup = function() {
  return{};
}();
cljs.core._lookup = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$ILookup$_lookup$arity$2 : a) {
      return a.cljs$core$ILookup$_lookup$arity$2(a, b);
    }
    var c;
    c = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._lookup._, !c)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$ILookup$_lookup$arity$3 : a) {
      return a.cljs$core$ILookup$_lookup$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._lookup[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._lookup._, !g)) {
      throw cljs.core.missing_protocol.call(null, "ILookup.-lookup", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.IAssociative = function() {
  return{};
}();
cljs.core._contains_key_QMARK_ = function(a, b) {
  if (a ? a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 : a) {
    return a.cljs$core$IAssociative$_contains_key_QMARK_$arity$2(a, b);
  }
  var c;
  c = cljs.core._contains_key_QMARK_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._contains_key_QMARK_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-contains-key?", a);
  }
  return c.call(null, a, b);
};
cljs.core._assoc = function(a, b, c) {
  if (a ? a.cljs$core$IAssociative$_assoc$arity$3 : a) {
    return a.cljs$core$IAssociative$_assoc$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IAssociative.-assoc", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IMap = function() {
  return{};
}();
cljs.core._dissoc = function(a, b) {
  if (a ? a.cljs$core$IMap$_dissoc$arity$2 : a) {
    return a.cljs$core$IMap$_dissoc$arity$2(a, b);
  }
  var c;
  c = cljs.core._dissoc[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._dissoc._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMap.-dissoc", a);
  }
  return c.call(null, a, b);
};
cljs.core.IMapEntry = function() {
  return{};
}();
cljs.core._key = function(a) {
  if (a ? a.cljs$core$IMapEntry$_key$arity$1 : a) {
    return a.cljs$core$IMapEntry$_key$arity$1(a);
  }
  var b;
  b = cljs.core._key[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._key._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-key", a);
  }
  return b.call(null, a);
};
cljs.core._val = function(a) {
  if (a ? a.cljs$core$IMapEntry$_val$arity$1 : a) {
    return a.cljs$core$IMapEntry$_val$arity$1(a);
  }
  var b;
  b = cljs.core._val[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._val._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMapEntry.-val", a);
  }
  return b.call(null, a);
};
cljs.core.ISet = function() {
  return{};
}();
cljs.core._disjoin = function(a, b) {
  if (a ? a.cljs$core$ISet$_disjoin$arity$2 : a) {
    return a.cljs$core$ISet$_disjoin$arity$2(a, b);
  }
  var c;
  c = cljs.core._disjoin[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._disjoin._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISet.-disjoin", a);
  }
  return c.call(null, a, b);
};
cljs.core.IStack = function() {
  return{};
}();
cljs.core._peek = function(a) {
  if (a ? a.cljs$core$IStack$_peek$arity$1 : a) {
    return a.cljs$core$IStack$_peek$arity$1(a);
  }
  var b;
  b = cljs.core._peek[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._peek._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-peek", a);
  }
  return b.call(null, a);
};
cljs.core._pop = function(a) {
  if (a ? a.cljs$core$IStack$_pop$arity$1 : a) {
    return a.cljs$core$IStack$_pop$arity$1(a);
  }
  var b;
  b = cljs.core._pop[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._pop._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IStack.-pop", a);
  }
  return b.call(null, a);
};
cljs.core.IVector = function() {
  return{};
}();
cljs.core._assoc_n = function(a, b, c) {
  if (a ? a.cljs$core$IVector$_assoc_n$arity$3 : a) {
    return a.cljs$core$IVector$_assoc_n$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_n[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_n._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IVector.-assoc-n", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IDeref = function() {
  return{};
}();
cljs.core._deref = function(a) {
  if (a ? a.cljs$core$IDeref$_deref$arity$1 : a) {
    return a.cljs$core$IDeref$_deref$arity$1(a);
  }
  var b;
  b = cljs.core._deref[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._deref._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IDeref.-deref", a);
  }
  return b.call(null, a);
};
cljs.core.IDerefWithTimeout = function() {
  return{};
}();
cljs.core._deref_with_timeout = function(a, b, c) {
  if (a ? a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3 : a) {
    return a.cljs$core$IDerefWithTimeout$_deref_with_timeout$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._deref_with_timeout[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._deref_with_timeout._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IDerefWithTimeout.-deref-with-timeout", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IMeta = function() {
  return{};
}();
cljs.core._meta = function(a) {
  if (a ? a.cljs$core$IMeta$_meta$arity$1 : a) {
    return a.cljs$core$IMeta$_meta$arity$1(a);
  }
  var b;
  b = cljs.core._meta[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._meta._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMeta.-meta", a);
  }
  return b.call(null, a);
};
cljs.core.IWithMeta = function() {
  return{};
}();
cljs.core._with_meta = function(a, b) {
  if (a ? a.cljs$core$IWithMeta$_with_meta$arity$2 : a) {
    return a.cljs$core$IWithMeta$_with_meta$arity$2(a, b);
  }
  var c;
  c = cljs.core._with_meta[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._with_meta._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWithMeta.-with-meta", a);
  }
  return c.call(null, a, b);
};
cljs.core.IReduce = function() {
  return{};
}();
cljs.core._reduce = function() {
  var a = null, b = function(a, b) {
    if (a ? a.cljs$core$IReduce$_reduce$arity$2 : a) {
      return a.cljs$core$IReduce$_reduce$arity$2(a, b);
    }
    var c;
    c = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if (!c && (c = cljs.core._reduce._, !c)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return c.call(null, a, b);
  }, c = function(a, b, c) {
    if (a ? a.cljs$core$IReduce$_reduce$arity$3 : a) {
      return a.cljs$core$IReduce$_reduce$arity$3(a, b, c);
    }
    var g;
    g = cljs.core._reduce[goog.typeOf(null == a ? null : a)];
    if (!g && (g = cljs.core._reduce._, !g)) {
      throw cljs.core.missing_protocol.call(null, "IReduce.-reduce", a);
    }
    return g.call(null, a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.IKVReduce = function() {
  return{};
}();
cljs.core._kv_reduce = function(a, b, c) {
  if (a ? a.cljs$core$IKVReduce$_kv_reduce$arity$3 : a) {
    return a.cljs$core$IKVReduce$_kv_reduce$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._kv_reduce[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._kv_reduce._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IKVReduce.-kv-reduce", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IEquiv = function() {
  return{};
}();
cljs.core._equiv = function(a, b) {
  if (a ? a.cljs$core$IEquiv$_equiv$arity$2 : a) {
    return a.cljs$core$IEquiv$_equiv$arity$2(a, b);
  }
  var c;
  c = cljs.core._equiv[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._equiv._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEquiv.-equiv", a);
  }
  return c.call(null, a, b);
};
cljs.core.IHash = function() {
  return{};
}();
cljs.core._hash = function(a) {
  if (a ? a.cljs$core$IHash$_hash$arity$1 : a) {
    return a.cljs$core$IHash$_hash$arity$1(a);
  }
  var b;
  b = cljs.core._hash[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._hash._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IHash.-hash", a);
  }
  return b.call(null, a);
};
cljs.core.ISeqable = function() {
  return{};
}();
cljs.core._seq = function(a) {
  if (a ? a.cljs$core$ISeqable$_seq$arity$1 : a) {
    return a.cljs$core$ISeqable$_seq$arity$1(a);
  }
  var b;
  b = cljs.core._seq[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._seq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISeqable.-seq", a);
  }
  return b.call(null, a);
};
cljs.core.ISequential = function() {
  return{};
}();
cljs.core.IList = function() {
  return{};
}();
cljs.core.IRecord = function() {
  return{};
}();
cljs.core.IReversible = function() {
  return{};
}();
cljs.core._rseq = function(a) {
  if (a ? a.cljs$core$IReversible$_rseq$arity$1 : a) {
    return a.cljs$core$IReversible$_rseq$arity$1(a);
  }
  var b;
  b = cljs.core._rseq[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._rseq._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IReversible.-rseq", a);
  }
  return b.call(null, a);
};
cljs.core.ISorted = function() {
  return{};
}();
cljs.core._sorted_seq = function(a, b) {
  if (a ? a.cljs$core$ISorted$_sorted_seq$arity$2 : a) {
    return a.cljs$core$ISorted$_sorted_seq$arity$2(a, b);
  }
  var c;
  c = cljs.core._sorted_seq[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._sorted_seq._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq", a);
  }
  return c.call(null, a, b);
};
cljs.core._sorted_seq_from = function(a, b, c) {
  if (a ? a.cljs$core$ISorted$_sorted_seq_from$arity$3 : a) {
    return a.cljs$core$ISorted$_sorted_seq_from$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._sorted_seq_from[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._sorted_seq_from._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-sorted-seq-from", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._entry_key = function(a, b) {
  if (a ? a.cljs$core$ISorted$_entry_key$arity$2 : a) {
    return a.cljs$core$ISorted$_entry_key$arity$2(a, b);
  }
  var c;
  c = cljs.core._entry_key[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._entry_key._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-entry-key", a);
  }
  return c.call(null, a, b);
};
cljs.core._comparator = function(a) {
  if (a ? a.cljs$core$ISorted$_comparator$arity$1 : a) {
    return a.cljs$core$ISorted$_comparator$arity$1(a);
  }
  var b;
  b = cljs.core._comparator[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._comparator._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ISorted.-comparator", a);
  }
  return b.call(null, a);
};
cljs.core.IWriter = function() {
  return{};
}();
cljs.core._write = function(a, b) {
  if (a ? a.cljs$core$IWriter$_write$arity$2 : a) {
    return a.cljs$core$IWriter$_write$arity$2(a, b);
  }
  var c;
  c = cljs.core._write[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._write._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-write", a);
  }
  return c.call(null, a, b);
};
cljs.core._flush = function(a) {
  if (a ? a.cljs$core$IWriter$_flush$arity$1 : a) {
    return a.cljs$core$IWriter$_flush$arity$1(a);
  }
  var b;
  b = cljs.core._flush[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._flush._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IWriter.-flush", a);
  }
  return b.call(null, a);
};
cljs.core.IPrintWithWriter = function() {
  return{};
}();
cljs.core._pr_writer = function(a, b, c) {
  if (a ? a.cljs$core$IPrintWithWriter$_pr_writer$arity$3 : a) {
    return a.cljs$core$IPrintWithWriter$_pr_writer$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._pr_writer[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._pr_writer._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IPrintWithWriter.-pr-writer", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.IPending = function() {
  return{};
}();
cljs.core._realized_QMARK_ = function(a) {
  if (a ? a.cljs$core$IPending$_realized_QMARK_$arity$1 : a) {
    return a.cljs$core$IPending$_realized_QMARK_$arity$1(a);
  }
  var b;
  b = cljs.core._realized_QMARK_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._realized_QMARK_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IPending.-realized?", a);
  }
  return b.call(null, a);
};
cljs.core.IWatchable = function() {
  return{};
}();
cljs.core._notify_watches = function(a, b, c) {
  if (a ? a.cljs$core$IWatchable$_notify_watches$arity$3 : a) {
    return a.cljs$core$IWatchable$_notify_watches$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._notify_watches[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._notify_watches._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-notify-watches", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._add_watch = function(a, b, c) {
  if (a ? a.cljs$core$IWatchable$_add_watch$arity$3 : a) {
    return a.cljs$core$IWatchable$_add_watch$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._add_watch[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._add_watch._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-add-watch", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._remove_watch = function(a, b) {
  if (a ? a.cljs$core$IWatchable$_remove_watch$arity$2 : a) {
    return a.cljs$core$IWatchable$_remove_watch$arity$2(a, b);
  }
  var c;
  c = cljs.core._remove_watch[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._remove_watch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IWatchable.-remove-watch", a);
  }
  return c.call(null, a, b);
};
cljs.core.IEditableCollection = function() {
  return{};
}();
cljs.core._as_transient = function(a) {
  if (a ? a.cljs$core$IEditableCollection$_as_transient$arity$1 : a) {
    return a.cljs$core$IEditableCollection$_as_transient$arity$1(a);
  }
  var b;
  b = cljs.core._as_transient[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._as_transient._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEditableCollection.-as-transient", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientCollection = function() {
  return{};
}();
cljs.core._conj_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientCollection$_conj_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientCollection$_conj_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._conj_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._conj_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-conj!", a);
  }
  return c.call(null, a, b);
};
cljs.core._persistent_BANG_ = function(a) {
  if (a ? a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientCollection$_persistent_BANG_$arity$1(a);
  }
  var b;
  b = cljs.core._persistent_BANG_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._persistent_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientCollection.-persistent!", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientAssociative = function() {
  return{};
}();
cljs.core._assoc_BANG_ = function(a, b, c) {
  if (a ? a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientAssociative.-assoc!", a);
  }
  return d.call(null, a, b, c);
};
cljs.core.ITransientMap = function() {
  return{};
}();
cljs.core._dissoc_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientMap$_dissoc_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._dissoc_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._dissoc_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientMap.-dissoc!", a);
  }
  return c.call(null, a, b);
};
cljs.core.ITransientVector = function() {
  return{};
}();
cljs.core._assoc_n_BANG_ = function(a, b, c) {
  if (a ? a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 : a) {
    return a.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._assoc_n_BANG_[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._assoc_n_BANG_._, !d)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-assoc-n!", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._pop_BANG_ = function(a) {
  if (a ? a.cljs$core$ITransientVector$_pop_BANG_$arity$1 : a) {
    return a.cljs$core$ITransientVector$_pop_BANG_$arity$1(a);
  }
  var b;
  b = cljs.core._pop_BANG_[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._pop_BANG_._, !b)) {
    throw cljs.core.missing_protocol.call(null, "ITransientVector.-pop!", a);
  }
  return b.call(null, a);
};
cljs.core.ITransientSet = function() {
  return{};
}();
cljs.core._disjoin_BANG_ = function(a, b) {
  if (a ? a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 : a) {
    return a.cljs$core$ITransientSet$_disjoin_BANG_$arity$2(a, b);
  }
  var c;
  c = cljs.core._disjoin_BANG_[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._disjoin_BANG_._, !c)) {
    throw cljs.core.missing_protocol.call(null, "ITransientSet.-disjoin!", a);
  }
  return c.call(null, a, b);
};
cljs.core.IComparable = function() {
  return{};
}();
cljs.core._compare = function(a, b) {
  if (a ? a.cljs$core$IComparable$_compare$arity$2 : a) {
    return a.cljs$core$IComparable$_compare$arity$2(a, b);
  }
  var c;
  c = cljs.core._compare[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._compare._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IComparable.-compare", a);
  }
  return c.call(null, a, b);
};
cljs.core.IChunk = function() {
  return{};
}();
cljs.core._drop_first = function(a) {
  if (a ? a.cljs$core$IChunk$_drop_first$arity$1 : a) {
    return a.cljs$core$IChunk$_drop_first$arity$1(a);
  }
  var b;
  b = cljs.core._drop_first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._drop_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunk.-drop-first", a);
  }
  return b.call(null, a);
};
cljs.core.IChunkedSeq = function() {
  return{};
}();
cljs.core._chunked_first = function(a) {
  if (a ? a.cljs$core$IChunkedSeq$_chunked_first$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_first$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_first[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_first._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-first", a);
  }
  return b.call(null, a);
};
cljs.core._chunked_rest = function(a) {
  if (a ? a.cljs$core$IChunkedSeq$_chunked_rest$arity$1 : a) {
    return a.cljs$core$IChunkedSeq$_chunked_rest$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_rest[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_rest._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedSeq.-chunked-rest", a);
  }
  return b.call(null, a);
};
cljs.core.IChunkedNext = function() {
  return{};
}();
cljs.core._chunked_next = function(a) {
  if (a ? a.cljs$core$IChunkedNext$_chunked_next$arity$1 : a) {
    return a.cljs$core$IChunkedNext$_chunked_next$arity$1(a);
  }
  var b;
  b = cljs.core._chunked_next[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._chunked_next._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IChunkedNext.-chunked-next", a);
  }
  return b.call(null, a);
};
cljs.core.INamed = function() {
  return{};
}();
cljs.core._name = function(a) {
  if (a ? a.cljs$core$INamed$_name$arity$1 : a) {
    return a.cljs$core$INamed$_name$arity$1(a);
  }
  var b;
  b = cljs.core._name[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._name._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-name", a);
  }
  return b.call(null, a);
};
cljs.core._namespace = function(a) {
  if (a ? a.cljs$core$INamed$_namespace$arity$1 : a) {
    return a.cljs$core$INamed$_namespace$arity$1(a);
  }
  var b;
  b = cljs.core._namespace[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._namespace._, !b)) {
    throw cljs.core.missing_protocol.call(null, "INamed.-namespace", a);
  }
  return b.call(null, a);
};
cljs.core.StringBufferWriter = function(a) {
  this.sb = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 1073741824;
};
cljs.core.StringBufferWriter.cljs$lang$type = !0;
cljs.core.StringBufferWriter.cljs$lang$ctorStr = "cljs.core/StringBufferWriter";
cljs.core.StringBufferWriter.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/StringBufferWriter");
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_write$arity$2 = function(a, b) {
  return this.sb.append(b);
};
cljs.core.StringBufferWriter.prototype.cljs$core$IWriter$_flush$arity$1 = function(a) {
  return null;
};
cljs.core.__GT_StringBufferWriter = function(a) {
  return new cljs.core.StringBufferWriter(a);
};
cljs.core.pr_str_STAR_ = function(a) {
  var b = new goog.string.StringBuffer, c = new cljs.core.StringBufferWriter(b);
  cljs.core._pr_writer.call(null, a, c, cljs.core.pr_opts.call(null));
  cljs.core._flush.call(null, c);
  return "" + cljs.core.str(b);
};
cljs.core.instance_QMARK_ = function(a, b) {
  return b instanceof a;
};
cljs.core.symbol_QMARK_ = function(a) {
  return a instanceof cljs.core.Symbol;
};
cljs.core.hash_symbol = function(a) {
  return cljs.core.hash_combine.call(null, cljs.core.hash.call(null, a.ns), cljs.core.hash.call(null, a.name));
};
cljs.core.compare_symbols = function(a, b) {
  if (cljs.core.truth_(cljs.core._EQ_.call(null, a, b))) {
    return 0;
  }
  if (cljs.core.truth_(function() {
    var c = cljs.core.not.call(null, a.ns);
    return c ? b.ns : c;
  }())) {
    return-1;
  }
  if (cljs.core.truth_(a.ns)) {
    if (cljs.core.not.call(null, b.ns)) {
      return 1;
    }
    var c = cljs.core.compare.call(null, a.ns, b.ns);
    return 0 === c ? cljs.core.compare.call(null, a.name, b.name) : c;
  }
  return new cljs.core.Keyword(null, "default", "default", 2558708147) ? cljs.core.compare.call(null, a.name, b.name) : null;
};
cljs.core.Symbol = function(a, b, c, d, e) {
  this.ns = a;
  this.name = b;
  this.str = c;
  this._hash = d;
  this._meta = e;
  this.cljs$lang$protocol_mask$partition0$ = 2154168321;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Symbol.cljs$lang$type = !0;
cljs.core.Symbol.cljs$lang$ctorStr = "cljs.core/Symbol";
cljs.core.Symbol.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Symbol");
};
cljs.core.Symbol.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, this.str);
};
cljs.core.Symbol.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name;
};
cljs.core.Symbol.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns;
};
cljs.core.Symbol.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this._hash;
  return null != a ? a : this._hash = a = cljs.core.hash_symbol.call(null, this);
};
cljs.core.Symbol.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Symbol(this.ns, this.name, this.str, this._hash, b);
};
cljs.core.Symbol.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.Symbol.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core._lookup.call(null, c, this, null);
      case 3:
        return cljs.core._lookup.call(null, c, this, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.Symbol.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core._lookup.call(null, a, this, null);
};
cljs.core.Symbol.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, a, this, b);
};
cljs.core.Symbol.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Symbol ? this.str === b.str : !1;
};
cljs.core.Symbol.prototype.toString = function() {
  return this.str;
};
cljs.core.__GT_Symbol = function(a, b, c, d, e) {
  return new cljs.core.Symbol(a, b, c, d, e);
};
cljs.core.symbol = function() {
  var a = null, b = function(b) {
    return b instanceof cljs.core.Symbol ? b : a.call(null, null, b);
  }, c = function(a, b) {
    var c = null != a ? [cljs.core.str(a), cljs.core.str("/"), cljs.core.str(b)].join("") : b;
    return new cljs.core.Symbol(a, b, c, null, null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.clone = function(a) {
  return cljs.core._clone.call(null, a);
};
cljs.core.cloneable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition1$ & 8192 || a.cljs$core$ICloneable$ ? !0 : a.cljs$lang$protocol_mask$partition1$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICloneable, a);
};
cljs.core.seq = function(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.cljs$lang$protocol_mask$partition0$ & 8388608 || a.cljs$core$ISeqable$)) {
    return cljs.core._seq.call(null, a);
  }
  if (a instanceof Array || "string" === typeof a) {
    return 0 === a.length ? null : new cljs.core.IndexedSeq(a, 0);
  }
  if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a)) {
    return cljs.core._seq.call(null, a);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error([cljs.core.str(a), cljs.core.str("is not ISeqable")].join(""));
  }
  return null;
};
cljs.core.first = function(a) {
  if (null == a) {
    return null;
  }
  if (a && (a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$)) {
    return cljs.core._first.call(null, a);
  }
  a = cljs.core.seq.call(null, a);
  return null == a ? null : cljs.core._first.call(null, a);
};
cljs.core.rest = function(a) {
  return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$) ? cljs.core._rest.call(null, a) : (a = cljs.core.seq.call(null, a)) ? cljs.core._rest.call(null, a) : cljs.core.List.EMPTY : cljs.core.List.EMPTY;
};
cljs.core.next = function(a) {
  return null == a ? null : a && (a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$) ? cljs.core._next.call(null, a) : cljs.core.seq.call(null, cljs.core.rest.call(null, a));
};
cljs.core._EQ_ = function() {
  var a = null, b = function(a, b) {
    return null == a ? null == b : a === b || cljs.core._equiv.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (a.call(null, b, c)) {
          if (cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
          } else {
            return a.call(null, c, cljs.core.first.call(null, d));
          }
        } else {
          return!1;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.ICounted["null"] = !0;
cljs.core._count["null"] = function(a) {
  return 0;
};
Date.prototype.cljs$core$IEquiv$ = !0;
Date.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof Date && this.toString() === b.toString();
};
cljs.core.IEquiv.number = !0;
cljs.core._equiv.number = function(a, b) {
  return a === b;
};
cljs.core.IMeta["function"] = !0;
cljs.core._meta["function"] = function(a) {
  return null;
};
cljs.core.Fn["function"] = !0;
cljs.core.IHash._ = !0;
cljs.core._hash._ = function(a) {
  return goog.getUid(a);
};
cljs.core.inc = function(a) {
  return a + 1;
};
cljs.core.Reduced = function(a) {
  this.val = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Reduced.cljs$lang$type = !0;
cljs.core.Reduced.cljs$lang$ctorStr = "cljs.core/Reduced";
cljs.core.Reduced.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Reduced");
};
cljs.core.Reduced.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.val;
};
cljs.core.__GT_Reduced = function(a) {
  return new cljs.core.Reduced(a);
};
cljs.core.reduced = function(a) {
  return new cljs.core.Reduced(a);
};
cljs.core.reduced_QMARK_ = function(a) {
  return a instanceof cljs.core.Reduced;
};
cljs.core.ci_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core._count.call(null, a);
    if (0 === c) {
      return b.call(null);
    }
    for (var d = cljs.core._nth.call(null, a, 0), k = 1;;) {
      if (k < c) {
        d = b.call(null, d, cljs.core._nth.call(null, a, k));
        if (cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d);
        }
        k += 1;
      } else {
        return d;
      }
    }
  }, c = function(a, b, c) {
    for (var d = cljs.core._count.call(null, a), k = 0;;) {
      if (k < d) {
        c = b.call(null, c, cljs.core._nth.call(null, a, k));
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        k += 1;
      } else {
        return c;
      }
    }
  }, d = function(a, b, c, d) {
    for (var k = cljs.core._count.call(null, a);;) {
      if (d < k) {
        c = b.call(null, c, cljs.core._nth.call(null, a, d));
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        d += 1;
      } else {
        return c;
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.array_reduce = function() {
  var a = null, b = function(a, b) {
    var c = a.length;
    if (0 === a.length) {
      return b.call(null);
    }
    for (var d = a[0], k = 1;;) {
      if (k < c) {
        d = b.call(null, d, a[k]);
        if (cljs.core.reduced_QMARK_.call(null, d)) {
          return cljs.core.deref.call(null, d);
        }
        k += 1;
      } else {
        return d;
      }
    }
  }, c = function(a, b, c) {
    for (var d = a.length, k = 0;;) {
      if (k < d) {
        c = b.call(null, c, a[k]);
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        k += 1;
      } else {
        return c;
      }
    }
  }, d = function(a, b, c, d) {
    for (var k = a.length;;) {
      if (d < k) {
        c = b.call(null, c, a[d]);
        if (cljs.core.reduced_QMARK_.call(null, c)) {
          return cljs.core.deref.call(null, c);
        }
        d += 1;
      } else {
        return c;
      }
    }
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.counted_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 2 || a.cljs$core$ICounted$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a);
};
cljs.core.indexed_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a);
};
cljs.core.IndexedSeq = function(a, b) {
  this.arr = a;
  this.i = b;
  this.cljs$lang$protocol_mask$partition0$ = 166199550;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.IndexedSeq.cljs$lang$type = !0;
cljs.core.IndexedSeq.cljs$lang$ctorStr = "cljs.core/IndexedSeq";
cljs.core.IndexedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/IndexedSeq");
};
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, this);
};
cljs.core.IndexedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : null;
};
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.IndexedSeq.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  a = cljs.core._count.call(null, this);
  return 0 < a ? new cljs.core.RSeq(this, a - 1, null) : null;
};
cljs.core.IndexedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.i], this.i + 1);
};
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.arr.length - this.i;
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.arr[this.i];
};
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i + 1 < this.arr.length ? new cljs.core.IndexedSeq(this.arr, this.i + 1) : cljs.core.List.EMPTY;
};
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.IndexedSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.IndexedSeq(this.arr, this.i);
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  var c = b + this.i;
  return c < this.arr.length ? this.arr[c] : null;
};
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  a = b + this.i;
  return a < this.arr.length ? this.arr[a] : c;
};
cljs.core.IndexedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.__GT_IndexedSeq = function(a, b) {
  return new cljs.core.IndexedSeq(a, b);
};
cljs.core.prim_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0);
  }, c = function(a, b) {
    return b < a.length ? new cljs.core.IndexedSeq(a, b) : null;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.array_seq = function() {
  var a = null, b = function(a) {
    return cljs.core.prim_seq.call(null, a, 0);
  }, c = function(a, b) {
    return cljs.core.prim_seq.call(null, a, b);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.RSeq = function(a, b, c) {
  this.ci = a;
  this.i = b;
  this.meta = c;
  this.cljs$lang$protocol_mask$partition0$ = 32374862;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.RSeq.cljs$lang$type = !0;
cljs.core.RSeq.cljs$lang$ctorStr = "cljs.core/RSeq";
cljs.core.RSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RSeq");
};
cljs.core.RSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, this);
};
cljs.core.RSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.RSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.RSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.RSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.RSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.i + 1;
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.ci, this.i);
};
cljs.core.RSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 0 < this.i ? new cljs.core.RSeq(this.ci, this.i - 1, null) : null;
};
cljs.core.RSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.RSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.RSeq(this.ci, this.i, b);
};
cljs.core.RSeq.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.RSeq(this.ci, this.i, this.meta);
};
cljs.core.RSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.RSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_RSeq = function(a, b, c) {
  return new cljs.core.RSeq(a, b, c);
};
cljs.core.second = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a));
};
cljs.core.ffirst = function(a) {
  return cljs.core.first.call(null, cljs.core.first.call(null, a));
};
cljs.core.nfirst = function(a) {
  return cljs.core.next.call(null, cljs.core.first.call(null, a));
};
cljs.core.fnext = function(a) {
  return cljs.core.first.call(null, cljs.core.next.call(null, a));
};
cljs.core.nnext = function(a) {
  return cljs.core.next.call(null, cljs.core.next.call(null, a));
};
cljs.core.last = function(a) {
  for (;;) {
    var b = cljs.core.next.call(null, a);
    if (null != b) {
      a = b;
    } else {
      return cljs.core.first.call(null, a);
    }
  }
};
cljs.core.IEquiv._ = !0;
cljs.core._equiv._ = function(a, b) {
  return a === b;
};
cljs.core.conj = function() {
  var a = null, b = function(a, b) {
    return null != a ? cljs.core._conj.call(null, a, b) : cljs.core._conj.call(null, cljs.core.List.EMPTY, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (cljs.core.truth_(d)) {
          b = a.call(null, b, c), c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return a.call(null, b, c);
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.empty = function(a) {
  return null == a ? null : cljs.core._empty.call(null, a);
};
cljs.core.accumulating_seq_count = function(a) {
  a = cljs.core.seq.call(null, a);
  for (var b = 0;;) {
    if (cljs.core.counted_QMARK_.call(null, a)) {
      return b + cljs.core._count.call(null, a);
    }
    a = cljs.core.next.call(null, a);
    b += 1;
  }
};
cljs.core.count = function(a) {
  return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 2 || a.cljs$core$ICounted$) ? cljs.core._count.call(null, a) : a instanceof Array ? a.length : "string" === typeof a ? a.length : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICounted, a) ? cljs.core._count.call(null, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.accumulating_seq_count.call(null, a) : null : 0;
};
cljs.core.linear_traversal_nth = function() {
  var a = null, b = function(a, b) {
    for (;;) {
      if (null == a) {
        throw Error("Index out of bounds");
      }
      if (0 === b) {
        if (cljs.core.seq.call(null, a)) {
          return cljs.core.first.call(null, a);
        }
        throw Error("Index out of bounds");
      }
      if (cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b);
      }
      if (cljs.core.seq.call(null, a)) {
        var c = cljs.core.next.call(null, a), g = b - 1;
        a = c;
        b = g;
      } else {
        if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          throw Error("Index out of bounds");
        }
        return null;
      }
    }
  }, c = function(a, b, c) {
    for (;;) {
      if (null == a) {
        return c;
      }
      if (0 === b) {
        return cljs.core.seq.call(null, a) ? cljs.core.first.call(null, a) : c;
      }
      if (cljs.core.indexed_QMARK_.call(null, a)) {
        return cljs.core._nth.call(null, a, b, c);
      }
      if (cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a), b -= 1;
      } else {
        return new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.nth = function() {
  var a = null, b = function(a, b) {
    if (null == a) {
      return null;
    }
    if (a && (a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$)) {
      return cljs.core._nth.call(null, a, b);
    }
    if (a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : null;
    }
    if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a)) {
      return cljs.core._nth.call(null, a, b);
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      if (a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) {
        return cljs.core.linear_traversal_nth.call(null, a, b);
      }
      throw Error([cljs.core.str("nth not supported on this type "), cljs.core.str(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a)))].join(""));
    }
    return null;
  }, c = function(a, b, c) {
    if (null != a) {
      if (a && (a.cljs$lang$protocol_mask$partition0$ & 16 || a.cljs$core$IIndexed$)) {
        return cljs.core._nth.call(null, a, b, c);
      }
      if (a instanceof Array || "string" === typeof a) {
        return b < a.length ? a[b] : c;
      }
      if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IIndexed, a)) {
        return cljs.core._nth.call(null, a, b);
      }
      if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
        if (a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a)) {
          return cljs.core.linear_traversal_nth.call(null, a, b, c);
        }
        throw Error([cljs.core.str("nth not supported on this type "), cljs.core.str(cljs.core.type__GT_str.call(null, cljs.core.type.call(null, a)))].join(""));
      }
      return null;
    }
    return c;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.get = function() {
  var a = null, b = function(a, b) {
    if (null == a) {
      return null;
    }
    if (a && (a.cljs$lang$protocol_mask$partition0$ & 256 || a.cljs$core$ILookup$)) {
      return cljs.core._lookup.call(null, a, b);
    }
    if (a instanceof Array || "string" === typeof a) {
      return b < a.length ? a[b] : null;
    }
    if (cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, a)) {
      return cljs.core._lookup.call(null, a, b);
    }
    new cljs.core.Keyword(null, "else", "else", 1017020587);
    return null;
  }, c = function(a, b, c) {
    return null != a ? a && (a.cljs$lang$protocol_mask$partition0$ & 256 || a.cljs$core$ILookup$) ? cljs.core._lookup.call(null, a, b, c) : a instanceof Array ? b < a.length ? a[b] : c : "string" === typeof a ? b < a.length ? a[b] : c : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, a) ? cljs.core._lookup.call(null, a, b, c) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null : c;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.assoc = function() {
  var a = null, b = function(a, b, c) {
    return null != a ? cljs.core._assoc.call(null, a, b, c) : cljs.core.PersistentHashMap.fromArrays.call(null, [b], [c]);
  }, c = function() {
    var b = function(b, c, d, e) {
      for (;;) {
        if (b = a.call(null, b, c, d), cljs.core.truth_(e)) {
          c = cljs.core.first.call(null, e), d = cljs.core.second.call(null, e), e = cljs.core.nnext.call(null, e);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dissoc = function() {
  var a = null, b = function(a, b) {
    return null == a ? null : cljs.core._dissoc.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (null == b) {
          return null;
        }
        b = a.call(null, b, c);
        if (cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fn_QMARK_ = function(a) {
  var b = goog.isFunction(a);
  return b ? b : a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$Fn$) ? !0 : a.cljs$lang$protocol_mask$partition$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.Fn, a);
};
cljs.core.with_meta = function with_meta(b, c) {
  return cljs.core.fn_QMARK_.call(null, b) && !(b ? b.cljs$lang$protocol_mask$partition0$ & 262144 || b.cljs$core$IWithMeta$ || (b.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IWithMeta, b)) ? with_meta.call(null, function() {
    "undefined" === typeof cljs.core.t5169 && (cljs.core.t5169 = function(b, c, f, g) {
      this.meta = b;
      this.o = c;
      this.with_meta = f;
      this.meta5170 = g;
      this.cljs$lang$protocol_mask$partition1$ = 0;
      this.cljs$lang$protocol_mask$partition0$ = 393217;
    }, cljs.core.t5169.cljs$lang$type = !0, cljs.core.t5169.cljs$lang$ctorStr = "cljs.core/t5169", cljs.core.t5169.cljs$lang$ctorPrWriter = function(b, c, f) {
      return cljs.core._write.call(null, c, "cljs.core/t5169");
    }, cljs.core.t5169.prototype.call = function() {
      var b = function(b, c) {
        return cljs.core.apply.call(null, b.o, c);
      }, c = function(c, e) {
        c = this;
        var h = null;
        1 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
        return b.call(this, c, h);
      };
      c.cljs$lang$maxFixedArity = 1;
      c.cljs$lang$applyTo = function(c) {
        var e = cljs.core.first(c);
        c = cljs.core.rest(c);
        return b(e, c);
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c;
    }(), cljs.core.t5169.prototype.apply = function(b, c) {
      return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, c)));
    }, cljs.core.t5169.prototype.cljs$core$IFn$_invoke$arity$2 = function() {
      var b = function(b) {
        return cljs.core.apply.call(null, self__.o, b);
      }, c = function(c) {
        var e = null;
        0 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return b.call(this, e);
      };
      c.cljs$lang$maxFixedArity = 0;
      c.cljs$lang$applyTo = function(c) {
        c = cljs.core.seq(c);
        return b(c);
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c;
    }(), cljs.core.t5169.prototype.cljs$core$Fn$ = !0, cljs.core.t5169.prototype.cljs$core$IMeta$_meta$arity$1 = function(b) {
      return this.meta5170;
    }, cljs.core.t5169.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(b, c) {
      return new cljs.core.t5169(this.meta, this.o, this.with_meta, c);
    }, cljs.core.__GT_t5169 = function(b, c, f, g) {
      return new cljs.core.t5169(b, c, f, g);
    });
    return new cljs.core.t5169(c, b, with_meta, null);
  }(), c) : null == b ? null : cljs.core._with_meta.call(null, b, c);
};
cljs.core.meta = function(a) {
  var b;
  b = (b = null != a) ? a ? a.cljs$lang$protocol_mask$partition0$ & 131072 || a.cljs$core$IMeta$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, a) : b;
  return b ? cljs.core._meta.call(null, a) : null;
};
cljs.core.peek = function(a) {
  return null == a ? null : cljs.core._peek.call(null, a);
};
cljs.core.pop = function(a) {
  return null == a ? null : cljs.core._pop.call(null, a);
};
cljs.core.disj = function() {
  var a = null, b = function(a, b) {
    return null == a ? null : cljs.core._disjoin.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (null == b) {
          return null;
        }
        b = a.call(null, b, c);
        if (cljs.core.truth_(d)) {
          c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
        } else {
          return b;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.string_hash_cache = function() {
  return{};
}();
cljs.core.string_hash_cache_count = 0;
cljs.core.add_to_string_hash_cache = function(a) {
  var b = goog.string.hashCode(a);
  cljs.core.string_hash_cache[a] = b;
  cljs.core.string_hash_cache_count += 1;
  return b;
};
cljs.core.check_string_hash_cache = function(a) {
  255 < cljs.core.string_hash_cache_count && (cljs.core.string_hash_cache = {}, cljs.core.string_hash_cache_count = 0);
  var b = cljs.core.string_hash_cache[a];
  return "number" === typeof b ? b : cljs.core.add_to_string_hash_cache.call(null, a);
};
cljs.core.hash = function(a) {
  return a && (a.cljs$lang$protocol_mask$partition0$ & 4194304 || a.cljs$core$IHash$) ? cljs.core._hash.call(null, a) : "number" === typeof a ? Math.floor(a) % 2147483647 : !0 === a ? 1 : !1 === a ? 0 : "string" === typeof a ? cljs.core.check_string_hash_cache.call(null, a) : null == a ? 0 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core._hash.call(null, a) : null;
};
cljs.core.empty_QMARK_ = function(a) {
  return null == a || cljs.core.not.call(null, cljs.core.seq.call(null, a));
};
cljs.core.coll_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 8 || a.cljs$core$ICollection$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ICollection, a);
};
cljs.core.set_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 4096 || a.cljs$core$ISet$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISet, a);
};
cljs.core.associative_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 512 || a.cljs$core$IAssociative$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IAssociative, a);
};
cljs.core.sequential_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16777216 || a.cljs$core$ISequential$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISequential, a);
};
cljs.core.sorted_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 268435456 || a.cljs$core$ISorted$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISorted, a);
};
cljs.core.reduceable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 524288 || a.cljs$core$IReduce$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, a);
};
cljs.core.map_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 1024 || a.cljs$core$IMap$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMap, a);
};
cljs.core.vector_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 16384 || a.cljs$core$IVector$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IVector, a);
};
cljs.core.chunked_seq_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition1$ & 512 || a.cljs$core$IChunkedSeq$ ? !0 : !1 : !1;
};
cljs.core.js_obj = function() {
  var a = null, b = function() {
    var a = function(a) {
      return cljs.core.apply.call(null, goog.object.create, a);
    }, b = function(b) {
      var d = null;
      0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, d);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return{};
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return{};
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.js_keys = function(a) {
  var b = [];
  goog.object.forEach(a, function(a, d, e) {
    return b.push(d);
  });
  return b;
};
cljs.core.js_delete = function(a, b) {
  return delete a[b];
};
cljs.core.array_copy = function(a, b, c, d, e) {
  for (;;) {
    if (0 === e) {
      return c;
    }
    c[d] = a[b];
    d += 1;
    e -= 1;
    b += 1;
  }
};
cljs.core.array_copy_downward = function(a, b, c, d, e) {
  b += e - 1;
  for (d += e - 1;;) {
    if (0 === e) {
      return c;
    }
    c[d] = a[b];
    d -= 1;
    e -= 1;
    b -= 1;
  }
};
cljs.core.lookup_sentinel = function() {
  return{};
}();
cljs.core.false_QMARK_ = function(a) {
  return!1 === a;
};
cljs.core.true_QMARK_ = function(a) {
  return!0 === a;
};
cljs.core.undefined_QMARK_ = function(a) {
  return void 0 === a;
};
cljs.core.seq_QMARK_ = function(a) {
  return null == a ? !1 : a ? a.cljs$lang$protocol_mask$partition0$ & 64 || a.cljs$core$ISeq$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeq, a);
};
cljs.core.seqable_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 8388608 || a.cljs$core$ISeqable$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ISeqable, a);
};
cljs.core.boolean$ = function(a) {
  return cljs.core.truth_(a) ? !0 : !1;
};
cljs.core.ifn_QMARK_ = function(a) {
  var b = cljs.core.fn_QMARK_.call(null, a);
  return b ? b : a ? a.cljs$lang$protocol_mask$partition0$ & 1 || a.cljs$core$IFn$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IFn, a);
};
cljs.core.integer_QMARK_ = function(a) {
  return "number" === typeof a && !isNaN(a) && Infinity !== a && parseFloat(a) === parseInt(a, 10);
};
cljs.core.contains_QMARK_ = function(a, b) {
  return cljs.core.get.call(null, a, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? !1 : !0;
};
cljs.core.find = function(a, b) {
  return null != a && cljs.core.associative_QMARK_.call(null, a) && cljs.core.contains_QMARK_.call(null, a, b) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, cljs.core.get.call(null, a, b)], null) : null;
};
cljs.core.distinct_QMARK_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      if (cljs.core._EQ_.call(null, a, b)) {
        return!1;
      }
      a = cljs.core.PersistentHashSet.fromArray([b, a], !0);
      for (b = c;;) {
        var d = cljs.core.first.call(null, b);
        c = cljs.core.next.call(null, b);
        if (cljs.core.truth_(b)) {
          if (cljs.core.contains_QMARK_.call(null, a, d)) {
            return!1;
          }
          a = cljs.core.conj.call(null, a, d);
          b = c;
        } else {
          return!0;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.sequence = function(a) {
  return cljs.core.seq_QMARK_.call(null, a) ? a : (a = cljs.core.seq.call(null, a)) ? a : cljs.core.List.EMPTY;
};
cljs.core.compare = function(a, b) {
  if (a === b) {
    return 0;
  }
  if (null == a) {
    return-1;
  }
  if (null == b) {
    return 1;
  }
  if (cljs.core.type.call(null, a) === cljs.core.type.call(null, b)) {
    return a && (a.cljs$lang$protocol_mask$partition1$ & 2048 || a.cljs$core$IComparable$) ? cljs.core._compare.call(null, a, b) : goog.array.defaultCompare(a, b);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("compare on non-nil objects of different types");
  }
  return null;
};
cljs.core.compare_indexed = function() {
  var a = null, b = function(b, c) {
    var f = cljs.core.count.call(null, b), g = cljs.core.count.call(null, c);
    return f < g ? -1 : f > g ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a.call(null, b, c, f, 0) : null;
  }, c = function(a, b, c, g) {
    for (;;) {
      var h = cljs.core.compare.call(null, cljs.core.nth.call(null, a, g), cljs.core.nth.call(null, b, g));
      if (0 === h && g + 1 < c) {
        g += 1;
      } else {
        return h;
      }
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
cljs.core.fn__GT_comparator = function(a) {
  return cljs.core._EQ_.call(null, a, cljs.core.compare) ? cljs.core.compare : function(b, c) {
    var d = a.call(null, b, c);
    return "number" === typeof d ? d : cljs.core.truth_(d) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : 0;
  };
};
cljs.core.sort = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.compare, b);
  }, c = function(a, b) {
    if (cljs.core.seq.call(null, b)) {
      var c = cljs.core.to_array.call(null, b);
      goog.array.stableSort(c, cljs.core.fn__GT_comparator.call(null, a));
      return cljs.core.seq.call(null, c);
    }
    return cljs.core.List.EMPTY;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.sort_by = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, cljs.core.compare, c);
  }, c = function(a, b, c) {
    return cljs.core.sort.call(null, function(c, f) {
      return cljs.core.fn__GT_comparator.call(null, b).call(null, a.call(null, c), a.call(null, f));
    }, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.seq_reduce = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.reduce.call(null, a, cljs.core.first.call(null, c), cljs.core.next.call(null, c)) : a.call(null);
  }, c = function(a, b, c) {
    for (c = cljs.core.seq.call(null, c);;) {
      if (c) {
        b = a.call(null, b, cljs.core.first.call(null, c));
        if (cljs.core.reduced_QMARK_.call(null, b)) {
          return cljs.core.deref.call(null, b);
        }
        c = cljs.core.next.call(null, c);
      } else {
        return b;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.shuffle = function(a) {
  a = cljs.core.to_array.call(null, a);
  goog.array.shuffle(a);
  return cljs.core.vec.call(null, a);
};
cljs.core.reduce = function() {
  var a = null, b = function(a, b) {
    return b && (b.cljs$lang$protocol_mask$partition0$ & 524288 || b.cljs$core$IReduce$) ? cljs.core._reduce.call(null, b, a) : b instanceof Array ? cljs.core.array_reduce.call(null, b, a) : "string" === typeof b ? cljs.core.array_reduce.call(null, b, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, b) ? cljs.core._reduce.call(null, b, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.seq_reduce.call(null, a, b) : null;
  }, c = function(a, b, c) {
    return c && (c.cljs$lang$protocol_mask$partition0$ & 524288 || c.cljs$core$IReduce$) ? cljs.core._reduce.call(null, c, a, b) : c instanceof Array ? cljs.core.array_reduce.call(null, c, a, b) : "string" === typeof c ? cljs.core.array_reduce.call(null, c, a, b) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReduce, c) ? cljs.core._reduce.call(null, c, a, b) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.seq_reduce.call(null, a, b, c) : null;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.reduce_kv = function(a, b, c) {
  return null != c ? cljs.core._kv_reduce.call(null, c, a, b) : b;
};
cljs.core._PLUS_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._STAR_ = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._SLASH_ = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._LT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a < b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b < cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a < d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a < b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._LT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a <= b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b <= cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a <= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a <= b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._GT_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a > b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b > cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a > d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a > b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core._GT__EQ_ = function() {
  var a = null, b = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a >= b) {
          if (cljs.core.next.call(null, c)) {
            a = b, b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
          } else {
            return b >= cljs.core.first.call(null, c);
          }
        } else {
          return!1;
        }
      }
    }, b = function(b, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, d, h);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(d, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return a >= d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a >= b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dec = function(a) {
  return a - 1;
};
cljs.core.max = function() {
  var a = null, b = function(a, b) {
    return a > b ? a : b;
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b > c ? b : c, d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.min = function() {
  var a = null, b = function(a, b) {
    return a < b ? a : b;
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b < c ? b : c, d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.byte$ = function(a) {
  return a;
};
cljs.core.char$ = function(a) {
  if ("number" === typeof a) {
    return String.fromCharCode(a);
  }
  if ("string" === typeof a && 1 === a.length) {
    return a;
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("Argument to char must be a character or number");
  }
  return null;
};
cljs.core.short$ = function(a) {
  return a;
};
cljs.core.float$ = function(a) {
  return a;
};
cljs.core.double$ = function(a) {
  return a;
};
cljs.core.unchecked_byte = function(a) {
  return a;
};
cljs.core.unchecked_char = function(a) {
  return a;
};
cljs.core.unchecked_short = function(a) {
  return a;
};
cljs.core.unchecked_float = function(a) {
  return a;
};
cljs.core.unchecked_double = function(a) {
  return a;
};
cljs.core.unchecked_add = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_add_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b + c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 0;
      case 1:
        return a;
      case 2:
        return a + d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 0;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a + b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_dec = function(a) {
  return a - 1;
};
cljs.core.unchecked_dec_int = function(a) {
  return a - 1;
};
cljs.core.unchecked_divide_int = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return a / e;
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a / b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_inc = function(a) {
  return a + 1;
};
cljs.core.unchecked_inc_int = function(a) {
  return a + 1;
};
cljs.core.unchecked_multiply = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_multiply_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b * c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 0:
        return 1;
      case 1:
        return a;
      case 2:
        return a * d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return 1;
  };
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a * b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_negate = function(a) {
  return-a;
};
cljs.core.unchecked_negate_int = function(a) {
  return-a;
};
cljs.core.unchecked_remainder_int = function(a, b) {
  return cljs.core.mod.call(null, a, b);
};
cljs.core.unchecked_substract = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.unchecked_substract_int = function() {
  var a = null, b = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, b - c, d);
    }, d = function(a, d, g) {
      var h = null;
      2 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, d, h);
    };
    d.cljs$lang$maxFixedArity = 2;
    d.cljs$lang$applyTo = function(a) {
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(d, g, a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = b;
    return d;
  }(), a = function(a, d, e) {
    switch(arguments.length) {
      case 1:
        return-a;
      case 2:
        return a - d;
      default:
        return b.cljs$core$IFn$_invoke$arity$variadic(a, d, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = b.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return-a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return a - b;
  };
  a.cljs$core$IFn$_invoke$arity$variadic = b.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fix = function(a) {
  return 0 <= a ? Math.floor.call(null, a) : Math.ceil.call(null, a);
};
cljs.core.int$ = function(a) {
  return a | 0;
};
cljs.core.unchecked_int = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.long$ = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.unchecked_long = function(a) {
  return cljs.core.fix.call(null, a);
};
cljs.core.booleans = function(a) {
  return a;
};
cljs.core.bytes = function(a) {
  return a;
};
cljs.core.chars = function(a) {
  return a;
};
cljs.core.shorts = function(a) {
  return a;
};
cljs.core.ints = function(a) {
  return a;
};
cljs.core.floats = function(a) {
  return a;
};
cljs.core.doubles = function(a) {
  return a;
};
cljs.core.longs = function(a) {
  return a;
};
cljs.core.js_mod = function(a, b) {
  return a % b;
};
cljs.core.mod = function(a, b) {
  return(a % b + b) % b;
};
cljs.core.quot = function(a, b) {
  return cljs.core.fix.call(null, (a - a % b) / b);
};
cljs.core.rem = function(a, b) {
  var c = cljs.core.quot.call(null, a, b);
  return a - b * c;
};
cljs.core.rand = function() {
  var a = null, b = function() {
    return Math.random.call(null);
  }, c = function(b) {
    return b * a.call(null);
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.rand_int = function(a) {
  return cljs.core.fix.call(null, cljs.core.rand.call(null, a));
};
cljs.core.bit_xor = function(a, b) {
  return a ^ b;
};
cljs.core.bit_and = function(a, b) {
  return a & b;
};
cljs.core.bit_or = function(a, b) {
  return a | b;
};
cljs.core.bit_and_not = function(a, b) {
  return a & ~b;
};
cljs.core.bit_clear = function(a, b) {
  return a & ~(1 << b);
};
cljs.core.bit_flip = function(a, b) {
  return a ^ 1 << b;
};
cljs.core.bit_not = function(a) {
  return~a;
};
cljs.core.bit_set = function(a, b) {
  return a | 1 << b;
};
cljs.core.bit_test = function(a, b) {
  return 0 != (a & 1 << b);
};
cljs.core.bit_shift_left = function(a, b) {
  return a << b;
};
cljs.core.bit_shift_right = function(a, b) {
  return a >> b;
};
cljs.core.bit_shift_right_zero_fill = function(a, b) {
  return a >>> b;
};
cljs.core.unsigned_bit_shift_right = function(a, b) {
  return a >>> b;
};
cljs.core.bit_count = function(a) {
  a -= a >> 1 & 1431655765;
  a = (a & 858993459) + (a >> 2 & 858993459);
  return 16843009 * (a + (a >> 4) & 252645135) >> 24;
};
cljs.core._EQ__EQ_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._equiv.call(null, a, b);
  }, c = function() {
    var b = function(b, c, d) {
      for (;;) {
        if (a.call(null, b, c)) {
          if (cljs.core.next.call(null, d)) {
            b = c, c = cljs.core.first.call(null, d), d = cljs.core.next.call(null, d);
          } else {
            return a.call(null, c, cljs.core.first.call(null, d));
          }
        } else {
          return!1;
        }
      }
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!0;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!0;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.pos_QMARK_ = function(a) {
  return 0 < a;
};
cljs.core.zero_QMARK_ = function(a) {
  return 0 === a;
};
cljs.core.neg_QMARK_ = function(a) {
  return 0 > a;
};
cljs.core.nthnext = function(a, b) {
  for (var c = b, d = cljs.core.seq.call(null, a);;) {
    if (d && 0 < c) {
      c -= 1, d = cljs.core.next.call(null, d);
    } else {
      return d;
    }
  }
};
cljs.core.str = function() {
  var a = null, b = function(a) {
    return null == a ? "" : a.toString();
  }, c = function() {
    var b = function(b, c) {
      for (var d = new goog.string.StringBuffer(a.call(null, b)), e = c;;) {
        if (cljs.core.truth_(e)) {
          d = d.append(a.call(null, cljs.core.first.call(null, e))), e = cljs.core.next.call(null, e);
        } else {
          return d.toString();
        }
      }
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e);
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 0:
        return "";
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = function() {
    return "";
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.subs = function() {
  var a = null, a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return a.substring(c);
      case 3:
        return a.substring(c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = function(a, c) {
    return a.substring(c);
  };
  a.cljs$core$IFn$_invoke$arity$3 = function(a, c, d) {
    return a.substring(c, d);
  };
  return a;
}();
cljs.core.equiv_sequential = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.sequential_QMARK_.call(null, b) ? function() {
    for (var c = cljs.core.seq.call(null, a), d = cljs.core.seq.call(null, b);;) {
      if (null == c) {
        return null == d;
      }
      if (null == d) {
        return!1;
      }
      if (cljs.core._EQ_.call(null, cljs.core.first.call(null, c), cljs.core.first.call(null, d))) {
        c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d);
      } else {
        return new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null;
      }
    }
  }() : null);
};
cljs.core.hash_combine = function(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2);
};
cljs.core.hash_coll = function(a) {
  if (cljs.core.seq.call(null, a)) {
    var b = cljs.core.hash.call(null, cljs.core.first.call(null, a));
    for (a = cljs.core.next.call(null, a);;) {
      if (null == a) {
        return b;
      }
      b = cljs.core.hash_combine.call(null, b, cljs.core.hash.call(null, cljs.core.first.call(null, a)));
      a = cljs.core.next.call(null, a);
    }
  } else {
    return 0;
  }
};
cljs.core.hash_imap = function(a) {
  var b = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      var c = cljs.core.first.call(null, a), b = (b + (cljs.core.hash.call(null, cljs.core.key.call(null, c)) ^ cljs.core.hash.call(null, cljs.core.val.call(null, c)))) % 4503599627370496;
      a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.hash_iset = function(a) {
  var b = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      var c = cljs.core.first.call(null, a), b = (b + cljs.core.hash.call(null, c)) % 4503599627370496;
      a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.extend_object_BANG_ = function(a, b) {
  for (var c = cljs.core.seq.call(null, b), d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null), h = cljs.core.name.call(null, h);
      a[h] = g;
      f += 1;
    } else {
      if (c = cljs.core.seq.call(null, c)) {
        cljs.core.chunked_seq_QMARK_.call(null, c) ? (e = cljs.core.chunk_first.call(null, c), c = cljs.core.chunk_rest.call(null, c), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, c), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), d = cljs.core.name.call(null, d), a[d] = e, c = cljs.core.next.call(null, c), d = null, e = 0), f = 0;
      } else {
        break;
      }
    }
  }
  return a;
};
cljs.core.List = function(a, b, c, d, e) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 65937646;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.List.cljs$lang$type = !0;
cljs.core.List.cljs$lang$ctorStr = "cljs.core/List";
cljs.core.List.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/List");
};
cljs.core.List.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.List.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 1 === this.count ? null : this.rest;
};
cljs.core.List.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, this, this.count + 1, null);
};
cljs.core.List.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.List.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.List.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.List.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count;
};
cljs.core.List.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.first;
};
cljs.core.List.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core._rest.call(null, this);
};
cljs.core.List.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first;
};
cljs.core.List.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 === this.count ? cljs.core.List.EMPTY : this.rest;
};
cljs.core.List.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.List(b, this.first, this.rest, this.count, this.__hash);
};
cljs.core.List.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.List(this.meta, this.first, this.rest, this.count, this.__hash);
};
cljs.core.List.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.__GT_List = function(a, b, c, d, e) {
  return new cljs.core.List(a, b, c, d, e);
};
cljs.core.EmptyList = function(a) {
  this.meta = a;
  this.cljs$lang$protocol_mask$partition0$ = 65937614;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.EmptyList.cljs$lang$type = !0;
cljs.core.EmptyList.cljs$lang$ctorStr = "cljs.core/EmptyList";
cljs.core.EmptyList.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/EmptyList");
};
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.List(this.meta, b, null, 1, null);
};
cljs.core.EmptyList.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.EmptyList.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  throw Error("Can't pop empty list");
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null;
};
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.List.EMPTY;
};
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.EmptyList(b);
};
cljs.core.EmptyList.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.EmptyList(this.meta);
};
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return this;
};
cljs.core.__GT_EmptyList = function(a) {
  return new cljs.core.EmptyList(a);
};
cljs.core.List.EMPTY = new cljs.core.EmptyList(null);
cljs.core.reversible_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 134217728 || a.cljs$core$IReversible$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IReversible, a);
};
cljs.core.rseq = function(a) {
  return cljs.core._rseq.call(null, a);
};
cljs.core.reverse = function(a) {
  return cljs.core.reversible_QMARK_.call(null, a) ? cljs.core.rseq.call(null, a) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a);
};
cljs.core.list = function() {
  var a = function(a) {
    var b;
    if (a instanceof cljs.core.IndexedSeq && 0 === a.i) {
      b = a.arr;
    } else {
      a: {
        for (b = [];;) {
          if (null != a) {
            b.push(cljs.core._first.call(null, a)), a = cljs.core._next.call(null, a);
          } else {
            break a;
          }
        }
        b = void 0;
      }
    }
    a = b.length;
    for (var e = cljs.core.List.EMPTY;;) {
      if (0 < a) {
        var f = a - 1, e = cljs.core._conj.call(null, e, b[a - 1]);
        a = f;
      } else {
        return e;
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.Cons = function(a, b, c, d) {
  this.meta = a;
  this.first = b;
  this.rest = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 65929452;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Cons.cljs$lang$type = !0;
cljs.core.Cons.cljs$lang$ctorStr = "cljs.core/Cons";
cljs.core.Cons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Cons");
};
cljs.core.Cons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.Cons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return null == this.rest ? null : cljs.core.seq.call(null, this.rest);
};
cljs.core.Cons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.Cons(null, b, this, this.__hash);
};
cljs.core.Cons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.Cons.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.Cons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.first;
};
cljs.core.Cons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.rest ? cljs.core.List.EMPTY : this.rest;
};
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Cons(b, this.first, this.rest, this.__hash);
};
cljs.core.Cons.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Cons(this.meta, this.first, this.rest, this.__hash);
};
cljs.core.Cons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_Cons = function(a, b, c, d) {
  return new cljs.core.Cons(a, b, c, d);
};
cljs.core.cons = function(a, b) {
  var c;
  c = (c = null == b) ? c : b ? b.cljs$lang$protocol_mask$partition0$ & 64 || b.cljs$core$ISeq$ ? !0 : !1 : !1;
  return c ? new cljs.core.Cons(null, a, b, null) : new cljs.core.Cons(null, a, cljs.core.seq.call(null, b), null);
};
cljs.core.list_QMARK_ = function(a) {
  return a ? a.cljs$lang$protocol_mask$partition0$ & 33554432 || a.cljs$core$IList$ ? !0 : a.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, a) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IList, a);
};
cljs.core.Keyword = function(a, b, c, d) {
  this.ns = a;
  this.name = b;
  this.fqn = c;
  this._hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153775105;
  this.cljs$lang$protocol_mask$partition1$ = 4096;
};
cljs.core.Keyword.cljs$lang$type = !0;
cljs.core.Keyword.cljs$lang$ctorStr = "cljs.core/Keyword";
cljs.core.Keyword.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Keyword");
};
cljs.core.Keyword.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, [cljs.core.str(":"), cljs.core.str(this.fqn)].join(""));
};
cljs.core.Keyword.prototype.cljs$core$INamed$_name$arity$1 = function(a) {
  return this.name;
};
cljs.core.Keyword.prototype.cljs$core$INamed$_namespace$arity$1 = function(a) {
  return this.ns;
};
cljs.core.Keyword.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  null == this._hash && (this._hash = cljs.core.hash_combine.call(null, cljs.core.hash.call(null, this.ns), cljs.core.hash.call(null, this.name)) + 2654435769);
  return this._hash;
};
cljs.core.Keyword.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return cljs.core.get.call(null, c, this);
      case 3:
        return cljs.core.get.call(null, c, this, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.Keyword.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core.get.call(null, a, this);
};
cljs.core.Keyword.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core.get.call(null, a, this, b);
};
cljs.core.Keyword.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.Keyword ? this.fqn === b.fqn : !1;
};
cljs.core.Keyword.prototype.toString = function() {
  return[cljs.core.str(":"), cljs.core.str(this.fqn)].join("");
};
cljs.core.__GT_Keyword = function(a, b, c, d) {
  return new cljs.core.Keyword(a, b, c, d);
};
cljs.core.keyword_QMARK_ = function(a) {
  return a instanceof cljs.core.Keyword;
};
cljs.core.keyword_identical_QMARK_ = function(a, b) {
  return a === b ? !0 : a instanceof cljs.core.Keyword && b instanceof cljs.core.Keyword ? a.fqn === b.fqn : !1;
};
cljs.core.namespace = function(a) {
  if (a && (a.cljs$lang$protocol_mask$partition1$ & 4096 || a.cljs$core$INamed$)) {
    return cljs.core._namespace.call(null, a);
  }
  throw Error([cljs.core.str("Doesn't support namespace: "), cljs.core.str(a)].join(""));
};
cljs.core.keyword = function() {
  var a = null, b = function(a) {
    if (a instanceof cljs.core.Keyword) {
      return a;
    }
    if (a instanceof cljs.core.Symbol) {
      return new cljs.core.Keyword(cljs.core.namespace.call(null, a), cljs.core.name.call(null, a), a.str, null);
    }
    if ("string" === typeof a) {
      var b = a.split("/");
      return 2 === b.length ? new cljs.core.Keyword(b[0], b[1], a, null) : new cljs.core.Keyword(null, b[0], a, null);
    }
    return null;
  }, c = function(a, b) {
    return new cljs.core.Keyword(a, b, [cljs.core.str(cljs.core.truth_(a) ? [cljs.core.str(a), cljs.core.str("/")].join("") : null), cljs.core.str(b)].join(""), null);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.LazySeq = function(a, b, c, d) {
  this.meta = a;
  this.fn = b;
  this.s = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.LazySeq.cljs$lang$type = !0;
cljs.core.LazySeq.cljs$lang$ctorStr = "cljs.core/LazySeq";
cljs.core.LazySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/LazySeq");
};
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.LazySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null == this.s ? null : cljs.core.next.call(null, this.s);
};
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.LazySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.LazySeq.prototype.sval = function() {
  null != this.fn && (this.s = this.fn.call(null), this.fn = null);
  return this.s;
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.LazySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  this.sval();
  if (null == this.s) {
    return null;
  }
  for (a = this.s;;) {
    if (a instanceof cljs.core.LazySeq) {
      a = a.sval();
    } else {
      return this.s = a, cljs.core.seq.call(null, this.s);
    }
  }
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null == this.s ? null : cljs.core.first.call(null, this.s);
};
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  cljs.core._seq.call(null, this);
  return null != this.s ? cljs.core.rest.call(null, this.s) : cljs.core.List.EMPTY;
};
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.LazySeq(b, this.fn, this.s, this.__hash);
};
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_LazySeq = function(a, b, c, d) {
  return new cljs.core.LazySeq(a, b, c, d);
};
cljs.core.ChunkBuffer = function(a, b) {
  this.buf = a;
  this.end = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2;
};
cljs.core.ChunkBuffer.cljs$lang$type = !0;
cljs.core.ChunkBuffer.cljs$lang$ctorStr = "cljs.core/ChunkBuffer";
cljs.core.ChunkBuffer.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkBuffer");
};
cljs.core.ChunkBuffer.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end;
};
cljs.core.ChunkBuffer.prototype.add = function(a) {
  this.buf[this.end] = a;
  return this.end += 1;
};
cljs.core.ChunkBuffer.prototype.chunk = function(a) {
  a = new cljs.core.ArrayChunk(this.buf, 0, this.end);
  this.buf = null;
  return a;
};
cljs.core.__GT_ChunkBuffer = function(a, b) {
  return new cljs.core.ChunkBuffer(a, b);
};
cljs.core.chunk_buffer = function(a) {
  return new cljs.core.ChunkBuffer(Array(a), 0);
};
cljs.core.ArrayChunk = function(a, b, c) {
  this.arr = a;
  this.off = b;
  this.end = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 524306;
};
cljs.core.ArrayChunk.cljs$lang$type = !0;
cljs.core.ArrayChunk.cljs$lang$ctorStr = "cljs.core/ArrayChunk";
cljs.core.ArrayChunk.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayChunk");
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.array_reduce.call(null, this.arr, b, this.arr[this.off], this.off + 1);
};
cljs.core.ArrayChunk.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.array_reduce.call(null, this.arr, b, c, this.off);
};
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$ = !0;
cljs.core.ArrayChunk.prototype.cljs$core$IChunk$_drop_first$arity$1 = function(a) {
  if (this.off === this.end) {
    throw Error("-drop-first of empty chunk");
  }
  return new cljs.core.ArrayChunk(this.arr, this.off + 1, this.end);
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return this.arr[this.off + b];
};
cljs.core.ArrayChunk.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.end - this.off ? this.arr[this.off + b] : c;
};
cljs.core.ArrayChunk.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.off;
};
cljs.core.__GT_ArrayChunk = function(a, b, c) {
  return new cljs.core.ArrayChunk(a, b, c);
};
cljs.core.array_chunk = function() {
  var a = null, b = function(a) {
    return new cljs.core.ArrayChunk(a, 0, a.length);
  }, c = function(a, b) {
    return new cljs.core.ArrayChunk(a, b, a.length);
  }, d = function(a, b, c) {
    return new cljs.core.ArrayChunk(a, b, c);
  }, a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      case 3:
        return d.call(this, a, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  return a;
}();
cljs.core.ChunkedCons = function(a, b, c, d) {
  this.chunk = a;
  this.more = b;
  this.meta = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition0$ = 31850732;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedCons.cljs$lang$type = !0;
cljs.core.ChunkedCons.cljs$lang$ctorStr = "cljs.core/ChunkedCons";
cljs.core.ChunkedCons.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedCons");
};
cljs.core.ChunkedCons.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  if (1 < cljs.core._count.call(null, this.chunk)) {
    return new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null);
  }
  a = cljs.core._seq.call(null, this.more);
  return null == a ? null : a;
};
cljs.core.ChunkedCons.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ChunkedCons.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.chunk, 0);
};
cljs.core.ChunkedCons.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return 1 < cljs.core._count.call(null, this.chunk) ? new cljs.core.ChunkedCons(cljs.core._drop_first.call(null, this.chunk), this.more, this.meta, null) : null == this.more ? cljs.core.List.EMPTY : this.more;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  return null == this.more ? null : this.more;
};
cljs.core.ChunkedCons.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ChunkedCons.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ChunkedCons(this.chunk, this.more, b, this.__hash);
};
cljs.core.ChunkedCons.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ChunkedCons.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return this.chunk;
};
cljs.core.ChunkedCons.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  return null == this.more ? cljs.core.List.EMPTY : this.more;
};
cljs.core.__GT_ChunkedCons = function(a, b, c, d) {
  return new cljs.core.ChunkedCons(a, b, c, d);
};
cljs.core.chunk_cons = function(a, b) {
  return 0 === cljs.core._count.call(null, a) ? b : new cljs.core.ChunkedCons(a, b, null, null);
};
cljs.core.chunk_append = function(a, b) {
  return a.add(b);
};
cljs.core.chunk = function(a) {
  return a.chunk();
};
cljs.core.chunk_first = function(a) {
  return cljs.core._chunked_first.call(null, a);
};
cljs.core.chunk_rest = function(a) {
  return cljs.core._chunked_rest.call(null, a);
};
cljs.core.chunk_next = function(a) {
  return a && (a.cljs$lang$protocol_mask$partition1$ & 1024 || a.cljs$core$IChunkedNext$) ? cljs.core._chunked_next.call(null, a) : cljs.core.seq.call(null, cljs.core._chunked_rest.call(null, a));
};
cljs.core.to_array = function(a) {
  for (var b = [];;) {
    if (cljs.core.seq.call(null, a)) {
      b.push(cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a);
    } else {
      return b;
    }
  }
};
cljs.core.to_array_2d = function(a) {
  var b = Array(cljs.core.count.call(null, a)), c = 0;
  for (a = cljs.core.seq.call(null, a);;) {
    if (a) {
      b[c] = cljs.core.to_array.call(null, cljs.core.first.call(null, a)), c += 1, a = cljs.core.next.call(null, a);
    } else {
      break;
    }
  }
  return b;
};
cljs.core.int_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.long_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.double_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.object_array = function() {
  var a = null, b = function(b) {
    return "number" === typeof b ? a.call(null, b, null) : cljs.core.into_array.call(null, b);
  }, c = function(a, b) {
    var c = Array(a);
    if (cljs.core.seq_QMARK_.call(null, b)) {
      for (var g = 0, h = cljs.core.seq.call(null, b);;) {
        if (h && g < a) {
          c[g] = cljs.core.first.call(null, h), g += 1, h = cljs.core.next.call(null, h);
        } else {
          return c;
        }
      }
    } else {
      for (g = 0;;) {
        if (g < a) {
          c[g] = b, g += 1;
        } else {
          break;
        }
      }
      return c;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.bounded_count = function(a, b) {
  if (cljs.core.counted_QMARK_.call(null, a)) {
    return cljs.core.count.call(null, a);
  }
  for (var c = a, d = b, e = 0;;) {
    if (0 < d && cljs.core.seq.call(null, c)) {
      c = cljs.core.next.call(null, c), d -= 1, e += 1;
    } else {
      return e;
    }
  }
};
cljs.core.spread = function spread(b) {
  return null == b ? null : null == cljs.core.next.call(null, b) ? cljs.core.seq.call(null, cljs.core.first.call(null, b)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.cons.call(null, cljs.core.first.call(null, b), spread.call(null, cljs.core.next.call(null, b))) : null;
};
cljs.core.concat = function() {
  var a = null, b = function() {
    return new cljs.core.LazySeq(null, function() {
      return null;
    }, null, null);
  }, c = function(a) {
    return new cljs.core.LazySeq(null, function() {
      return a;
    }, null, null);
  }, d = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, b);
      return d ? cljs.core.chunked_seq_QMARK_.call(null, d) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, d), a.call(null, cljs.core.chunk_rest.call(null, d), c)) : cljs.core.cons.call(null, cljs.core.first.call(null, d), a.call(null, cljs.core.rest.call(null, d), c)) : c;
    }, null, null);
  }, e = function() {
    var b = function(b, c, d) {
      return function n(a, b) {
        return new cljs.core.LazySeq(null, function() {
          var c = cljs.core.seq.call(null, a);
          return c ? cljs.core.chunked_seq_QMARK_.call(null, c) ? cljs.core.chunk_cons.call(null, cljs.core.chunk_first.call(null, c), n.call(null, cljs.core.chunk_rest.call(null, c), b)) : cljs.core.cons.call(null, cljs.core.first.call(null, c), n.call(null, cljs.core.rest.call(null, c), b)) : cljs.core.truth_(b) ? n.call(null, cljs.core.first.call(null, b), cljs.core.next.call(null, b)) : null;
        }, null, null);
      }.call(null, a.call(null, b, c), d);
    }, c = function(a, c, d) {
      var e = null;
      2 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, e);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.list_STAR_ = function() {
  var a = null, b = function(a) {
    return cljs.core.seq.call(null, a);
  }, c = function(a, b) {
    return cljs.core.cons.call(null, a, b);
  }, d = function(a, b, c) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, c));
  }, e = function(a, b, c, d) {
    return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, d)));
  }, f = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.cons.call(null, a, cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.spread.call(null, e)))));
    }, b = function(b, c, d, e, f) {
      var h = null;
      4 < arguments.length && (h = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, h);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, h, k, l, m) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, h);
      case 3:
        return d.call(this, a, h, k);
      case 4:
        return e.call(this, a, h, k, l);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$4 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.transient$ = function(a) {
  return cljs.core._as_transient.call(null, a);
};
cljs.core.persistent_BANG_ = function(a) {
  return cljs.core._persistent_BANG_.call(null, a);
};
cljs.core.conj_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._conj_BANG_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._conj_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.assoc_BANG_ = function() {
  var a = null, b = function(a, b, c) {
    return cljs.core._assoc_BANG_.call(null, a, b, c);
  }, c = function() {
    var a = function(a, b, c, d) {
      for (;;) {
        if (a = cljs.core._assoc_BANG_.call(null, a, b, c), cljs.core.truth_(d)) {
          b = cljs.core.first.call(null, d), c = cljs.core.second.call(null, d), d = cljs.core.nnext.call(null, d);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, e, l);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var k = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, k, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dissoc_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._dissoc_BANG_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._dissoc_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.pop_BANG_ = function(a) {
  return cljs.core._pop_BANG_.call(null, a);
};
cljs.core.disj_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core._disjoin_BANG_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      for (;;) {
        if (a = cljs.core._disjoin_BANG_.call(null, a, b), cljs.core.truth_(c)) {
          b = cljs.core.first.call(null, c), c = cljs.core.next.call(null, c);
        } else {
          return a;
        }
      }
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.apply_to = function(a, b, c) {
  var d = cljs.core.seq.call(null, c);
  if (0 === b) {
    return a.call(null);
  }
  c = cljs.core._first.call(null, d);
  var e = cljs.core._rest.call(null, d);
  if (1 === b) {
    return a.cljs$core$IFn$_invoke$arity$1 ? a.cljs$core$IFn$_invoke$arity$1(c) : a.call(null, c);
  }
  var d = cljs.core._first.call(null, e), f = cljs.core._rest.call(null, e);
  if (2 === b) {
    return a.cljs$core$IFn$_invoke$arity$2 ? a.cljs$core$IFn$_invoke$arity$2(c, d) : a.call(null, c, d);
  }
  var e = cljs.core._first.call(null, f), g = cljs.core._rest.call(null, f);
  if (3 === b) {
    return a.cljs$core$IFn$_invoke$arity$3 ? a.cljs$core$IFn$_invoke$arity$3(c, d, e) : a.call(null, c, d, e);
  }
  var f = cljs.core._first.call(null, g), h = cljs.core._rest.call(null, g);
  if (4 === b) {
    return a.cljs$core$IFn$_invoke$arity$4 ? a.cljs$core$IFn$_invoke$arity$4(c, d, e, f) : a.call(null, c, d, e, f);
  }
  g = cljs.core._first.call(null, h);
  h = cljs.core._rest.call(null, h);
  if (5 === b) {
    return a.cljs$core$IFn$_invoke$arity$5 ? a.cljs$core$IFn$_invoke$arity$5(c, d, e, f, g) : a.call(null, c, d, e, f, g);
  }
  a = cljs.core._first.call(null, h);
  var k = cljs.core._rest.call(null, h);
  if (6 === b) {
    return a.cljs$core$IFn$_invoke$arity$6 ? a.cljs$core$IFn$_invoke$arity$6(c, d, e, f, g, a) : a.call(null, c, d, e, f, g, a);
  }
  var h = cljs.core._first.call(null, k), l = cljs.core._rest.call(null, k);
  if (7 === b) {
    return a.cljs$core$IFn$_invoke$arity$7 ? a.cljs$core$IFn$_invoke$arity$7(c, d, e, f, g, a, h) : a.call(null, c, d, e, f, g, a, h);
  }
  var k = cljs.core._first.call(null, l), m = cljs.core._rest.call(null, l);
  if (8 === b) {
    return a.cljs$core$IFn$_invoke$arity$8 ? a.cljs$core$IFn$_invoke$arity$8(c, d, e, f, g, a, h, k) : a.call(null, c, d, e, f, g, a, h, k);
  }
  var l = cljs.core._first.call(null, m), n = cljs.core._rest.call(null, m);
  if (9 === b) {
    return a.cljs$core$IFn$_invoke$arity$9 ? a.cljs$core$IFn$_invoke$arity$9(c, d, e, f, g, a, h, k, l) : a.call(null, c, d, e, f, g, a, h, k, l);
  }
  var m = cljs.core._first.call(null, n), r = cljs.core._rest.call(null, n);
  if (10 === b) {
    return a.cljs$core$IFn$_invoke$arity$10 ? a.cljs$core$IFn$_invoke$arity$10(c, d, e, f, g, a, h, k, l, m) : a.call(null, c, d, e, f, g, a, h, k, l, m);
  }
  var n = cljs.core._first.call(null, r), p = cljs.core._rest.call(null, r);
  if (11 === b) {
    return a.cljs$core$IFn$_invoke$arity$11 ? a.cljs$core$IFn$_invoke$arity$11(c, d, e, f, g, a, h, k, l, m, n) : a.call(null, c, d, e, f, g, a, h, k, l, m, n);
  }
  var r = cljs.core._first.call(null, p), s = cljs.core._rest.call(null, p);
  if (12 === b) {
    return a.cljs$core$IFn$_invoke$arity$12 ? a.cljs$core$IFn$_invoke$arity$12(c, d, e, f, g, a, h, k, l, m, n, r) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r);
  }
  var p = cljs.core._first.call(null, s), q = cljs.core._rest.call(null, s);
  if (13 === b) {
    return a.cljs$core$IFn$_invoke$arity$13 ? a.cljs$core$IFn$_invoke$arity$13(c, d, e, f, g, a, h, k, l, m, n, r, p) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p);
  }
  var s = cljs.core._first.call(null, q), u = cljs.core._rest.call(null, q);
  if (14 === b) {
    return a.cljs$core$IFn$_invoke$arity$14 ? a.cljs$core$IFn$_invoke$arity$14(c, d, e, f, g, a, h, k, l, m, n, r, p, s) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s);
  }
  var q = cljs.core._first.call(null, u), x = cljs.core._rest.call(null, u);
  if (15 === b) {
    return a.cljs$core$IFn$_invoke$arity$15 ? a.cljs$core$IFn$_invoke$arity$15(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q);
  }
  var u = cljs.core._first.call(null, x), v = cljs.core._rest.call(null, x);
  if (16 === b) {
    return a.cljs$core$IFn$_invoke$arity$16 ? a.cljs$core$IFn$_invoke$arity$16(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u);
  }
  var x = cljs.core._first.call(null, v), t = cljs.core._rest.call(null, v);
  if (17 === b) {
    return a.cljs$core$IFn$_invoke$arity$17 ? a.cljs$core$IFn$_invoke$arity$17(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x);
  }
  var v = cljs.core._first.call(null, t), w = cljs.core._rest.call(null, t);
  if (18 === b) {
    return a.cljs$core$IFn$_invoke$arity$18 ? a.cljs$core$IFn$_invoke$arity$18(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v);
  }
  t = cljs.core._first.call(null, w);
  w = cljs.core._rest.call(null, w);
  if (19 === b) {
    return a.cljs$core$IFn$_invoke$arity$19 ? a.cljs$core$IFn$_invoke$arity$19(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v, t) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v, t);
  }
  var B = cljs.core._first.call(null, w);
  cljs.core._rest.call(null, w);
  if (20 === b) {
    return a.cljs$core$IFn$_invoke$arity$20 ? a.cljs$core$IFn$_invoke$arity$20(c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v, t, B) : a.call(null, c, d, e, f, g, a, h, k, l, m, n, r, p, s, q, u, x, v, t, B);
  }
  throw Error("Only up to 20 arguments supported on functions");
};
cljs.core.apply = function() {
  var a = null, b = function(a, b) {
    var c = a.cljs$lang$maxFixedArity;
    if (a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b);
    }
    return a.apply(a, cljs.core.to_array.call(null, b));
  }, c = function(a, b, c) {
    b = cljs.core.list_STAR_.call(null, b, c);
    c = a.cljs$lang$maxFixedArity;
    if (a.cljs$lang$applyTo) {
      var d = cljs.core.bounded_count.call(null, b, c + 1);
      return d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b);
    }
    return a.apply(a, cljs.core.to_array.call(null, b));
  }, d = function(a, b, c, d) {
    b = cljs.core.list_STAR_.call(null, b, c, d);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
  }, e = function(a, b, c, d, e) {
    b = cljs.core.list_STAR_.call(null, b, c, d, e);
    c = a.cljs$lang$maxFixedArity;
    return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      b = cljs.core.cons.call(null, b, cljs.core.cons.call(null, c, cljs.core.cons.call(null, d, cljs.core.cons.call(null, e, cljs.core.spread.call(null, f)))));
      c = a.cljs$lang$maxFixedArity;
      return a.cljs$lang$applyTo ? (d = cljs.core.bounded_count.call(null, b, c + 1), d <= c ? cljs.core.apply_to.call(null, a, d, b) : a.cljs$lang$applyTo(b)) : a.apply(a, cljs.core.to_array.call(null, b));
    }, b = function(b, c, d, e, f, h) {
      var s = null;
      5 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, s);
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.vary_meta = function() {
  var a = null, b = function(a, b) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a)));
  }, c = function(a, b, c) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c));
  }, d = function(a, b, c, d) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d));
  }, e = function(a, b, c, d, e) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d, e));
  }, f = function(a, b, c, d, e, f) {
    return cljs.core.with_meta.call(null, a, b.call(null, cljs.core.meta.call(null, a), c, d, e, f));
  }, g = function() {
    var a = function(a, b, c, d, e, f, g) {
      return cljs.core.with_meta.call(null, a, cljs.core.apply.call(null, b, cljs.core.meta.call(null, a), c, d, e, f, g));
    }, b = function(b, c, d, e, f, g, k) {
      var u = null;
      6 < arguments.length && (u = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return a.call(this, b, c, d, e, f, g, u);
    };
    b.cljs$lang$maxFixedArity = 6;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.next(b);
      var k = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, g, k, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, k, l, m, n, r, p) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, k);
      case 3:
        return c.call(this, a, k, l);
      case 4:
        return d.call(this, a, k, l, m);
      case 5:
        return e.call(this, a, k, l, m, n);
      case 6:
        return f.call(this, a, k, l, m, n, r);
      default:
        return g.cljs$core$IFn$_invoke$arity$variadic(a, k, l, m, n, r, cljs.core.array_seq(arguments, 6));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = g.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$6 = f;
  a.cljs$core$IFn$_invoke$arity$variadic = g.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.not_EQ_ = function() {
  var a = null, b = function(a, b) {
    return!cljs.core._EQ_.call(null, a, b);
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.not.call(null, cljs.core.apply.call(null, cljs.core._EQ_, a, b, c));
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return!1;
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return!1;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.not_empty = function(a) {
  return cljs.core.seq.call(null, a) ? a : null;
};
cljs.core.every_QMARK_ = function(a, b) {
  for (;;) {
    if (null == cljs.core.seq.call(null, b)) {
      return!0;
    }
    if (cljs.core.truth_(a.call(null, cljs.core.first.call(null, b)))) {
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d;
    } else {
      return new cljs.core.Keyword(null, "else", "else", 1017020587) ? !1 : null;
    }
  }
};
cljs.core.not_every_QMARK_ = function(a, b) {
  return!cljs.core.every_QMARK_.call(null, a, b);
};
cljs.core.some = function(a, b) {
  for (;;) {
    if (cljs.core.seq.call(null, b)) {
      var c = a.call(null, cljs.core.first.call(null, b));
      if (cljs.core.truth_(c)) {
        return c;
      }
      var c = a, d = cljs.core.next.call(null, b);
      a = c;
      b = d;
    } else {
      return null;
    }
  }
};
cljs.core.not_any_QMARK_ = function(a, b) {
  return cljs.core.not.call(null, cljs.core.some.call(null, a, b));
};
cljs.core.even_QMARK_ = function(a) {
  if (cljs.core.integer_QMARK_.call(null, a)) {
    return 0 === (a & 1);
  }
  throw Error([cljs.core.str("Argument must be an integer: "), cljs.core.str(a)].join(""));
};
cljs.core.odd_QMARK_ = function(a) {
  return!cljs.core.even_QMARK_.call(null, a);
};
cljs.core.identity = function(a) {
  return a;
};
cljs.core.complement = function(a) {
  return function() {
    var b = null, c = function() {
      var b = function(b, c, d) {
        return cljs.core.not.call(null, cljs.core.apply.call(null, a, b, c, d));
      }, c = function(a, c, e) {
        var k = null;
        2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
        return b.call(this, a, c, k);
      };
      c.cljs$lang$maxFixedArity = 2;
      c.cljs$lang$applyTo = function(a) {
        var c = cljs.core.first(a);
        a = cljs.core.next(a);
        var e = cljs.core.first(a);
        a = cljs.core.rest(a);
        return b(c, e, a);
      };
      c.cljs$core$IFn$_invoke$arity$variadic = b;
      return c;
    }(), b = function(b, e, f) {
      switch(arguments.length) {
        case 0:
          return cljs.core.not.call(null, a.call(null));
        case 1:
          return cljs.core.not.call(null, a.call(null, b));
        case 2:
          return cljs.core.not.call(null, a.call(null, b, e));
        default:
          return c.cljs$core$IFn$_invoke$arity$variadic(b, e, cljs.core.array_seq(arguments, 2));
      }
      throw Error("Invalid arity: " + arguments.length);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = c.cljs$lang$applyTo;
    return b;
  }();
};
cljs.core.constantly = function(a) {
  return function() {
    var b = function(b) {
      0 < arguments.length && cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0);
      return a;
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      cljs.core.seq(b);
      return a;
    };
    b.cljs$core$IFn$_invoke$arity$variadic = function(b) {
      return a;
    };
    return b;
  }();
};
cljs.core.comp = function() {
  var a = null, b = function() {
    return cljs.core.identity;
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return a.call(null, cljs.core.apply.call(null, b, c, d, e, h));
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(c, e, h, r) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null));
          case 1:
            return a.call(null, b.call(null, c));
          case 2:
            return a.call(null, b.call(null, c, e));
          case 3:
            return a.call(null, b.call(null, c, e, h));
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, l) {
          return a.call(null, b.call(null, cljs.core.apply.call(null, c, d, e, k, l)));
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), d = function(d, k, r, p) {
        switch(arguments.length) {
          case 0:
            return a.call(null, b.call(null, c.call(null)));
          case 1:
            return a.call(null, b.call(null, c.call(null, d)));
          case 2:
            return a.call(null, b.call(null, c.call(null, d, k)));
          case 3:
            return a.call(null, b.call(null, c.call(null, d, k, r)));
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, r, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.reverse.call(null, cljs.core.list_STAR_.call(null, a, b, c, d));
      return function() {
        var a = function(a) {
          a = cljs.core.apply.call(null, cljs.core.first.call(null, e), a);
          for (var b = cljs.core.next.call(null, e);;) {
            if (b) {
              a = cljs.core.first.call(null, b).call(null, a), b = cljs.core.next.call(null, b);
            } else {
              return a;
            }
          }
        }, b = function(b) {
          var c = null;
          0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return a.call(this, c);
        };
        b.cljs$lang$maxFixedArity = 0;
        b.cljs$lang$applyTo = function(b) {
          b = cljs.core.seq(b);
          return a(b);
        };
        b.cljs$core$IFn$_invoke$arity$variadic = a;
        return b;
      }();
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return a;
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.partial = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = function(c) {
        return cljs.core.apply.call(null, a, b, c);
      }, d = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return c.call(this, b);
      };
      d.cljs$lang$maxFixedArity = 0;
      d.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return c(a);
      };
      d.cljs$core$IFn$_invoke$arity$variadic = c;
      return d;
    }();
  }, c = function(a, b, c) {
    return function() {
      var d = function(d) {
        return cljs.core.apply.call(null, a, b, c, d);
      }, e = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return d.call(this, b);
      };
      e.cljs$lang$maxFixedArity = 0;
      e.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return d(a);
      };
      e.cljs$core$IFn$_invoke$arity$variadic = d;
      return e;
    }();
  }, d = function(a, b, c, d) {
    return function() {
      var e = function(e) {
        return cljs.core.apply.call(null, a, b, c, d, e);
      }, m = function(a) {
        var b = null;
        0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
        return e.call(this, b);
      };
      m.cljs$lang$maxFixedArity = 0;
      m.cljs$lang$applyTo = function(a) {
        a = cljs.core.seq(a);
        return e(a);
      };
      m.cljs$core$IFn$_invoke$arity$variadic = e;
      return m;
    }();
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return function() {
        var f = function(f) {
          return cljs.core.apply.call(null, a, b, c, d, cljs.core.concat.call(null, e, f));
        }, g = function(a) {
          var b = null;
          0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
          return f.call(this, b);
        };
        g.cljs$lang$maxFixedArity = 0;
        g.cljs$lang$applyTo = function(a) {
          a = cljs.core.seq(a);
          return f(a);
        };
        g.cljs$core$IFn$_invoke$arity$variadic = f;
        return g;
      }();
    }, b = function(b, c, d, e, g) {
      var r = null;
      4 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, r);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 1:
        return a;
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = function(a) {
    return a;
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.fnil = function() {
  var a = null, b = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, g, h) {
          return cljs.core.apply.call(null, a, null == c ? b : c, d, g, h);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(c, g, m, n) {
        switch(arguments.length) {
          case 1:
            return a.call(null, null == c ? b : c);
          case 2:
            return a.call(null, null == c ? b : c, g);
          case 3:
            return a.call(null, null == c ? b : c, g, m);
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, g, m, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c;
    }();
  }, c = function(a, b, c) {
    return function() {
      var d = null, k = function() {
        var d = function(d, h, k, s) {
          return cljs.core.apply.call(null, a, null == d ? b : d, null == h ? c : h, k, s);
        }, h = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        h.cljs$lang$maxFixedArity = 3;
        h.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        h.cljs$core$IFn$_invoke$arity$variadic = d;
        return h;
      }(), d = function(d, h, n, r) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null == d ? b : d, null == h ? c : h);
          case 3:
            return a.call(null, null == d ? b : d, null == h ? c : h, n);
          default:
            return k.cljs$core$IFn$_invoke$arity$variadic(d, h, n, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = k.cljs$lang$applyTo;
      return d;
    }();
  }, d = function(a, b, c, d) {
    return function() {
      var k = null, l = function() {
        var k = function(k, l, s, q) {
          return cljs.core.apply.call(null, a, null == k ? b : k, null == l ? c : l, null == s ? d : s, q);
        }, l = function(a, b, c, d) {
          var e = null;
          3 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return k.call(this, a, b, c, e);
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return k(b, c, d, a);
        };
        l.cljs$core$IFn$_invoke$arity$variadic = k;
        return l;
      }(), k = function(k, n, r, p) {
        switch(arguments.length) {
          case 2:
            return a.call(null, null == k ? b : k, null == n ? c : n);
          case 3:
            return a.call(null, null == k ? b : k, null == n ? c : n, null == r ? d : r);
          default:
            return l.cljs$core$IFn$_invoke$arity$variadic(k, n, r, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      k.cljs$lang$maxFixedArity = 3;
      k.cljs$lang$applyTo = l.cljs$lang$applyTo;
      return k;
    }();
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.map_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      if (g) {
        if (cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for (var h = cljs.core.chunk_first.call(null, g), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k), m = 0;;) {
            if (m < k) {
              cljs.core.chunk_append.call(null, l, a.call(null, b + m, cljs.core._nth.call(null, h, m))), m += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), d.call(null, b + k, cljs.core.chunk_rest.call(null, g)));
        }
        return cljs.core.cons.call(null, a.call(null, b, cljs.core.first.call(null, g)), d.call(null, b + 1, cljs.core.rest.call(null, g)));
      }
      return null;
    }, null, null);
  }.call(null, 0, b);
};
cljs.core.keep = function keep(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if (d) {
      if (cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for (var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if (h < f) {
            var k = b.call(null, cljs.core._nth.call(null, e, h));
            null != k && cljs.core.chunk_append.call(null, g, k);
            h += 1;
          } else {
            break;
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), keep.call(null, b, cljs.core.chunk_rest.call(null, d)));
      }
      e = b.call(null, cljs.core.first.call(null, d));
      return null == e ? keep.call(null, b, cljs.core.rest.call(null, d)) : cljs.core.cons.call(null, e, keep.call(null, b, cljs.core.rest.call(null, d)));
    }
    return null;
  }, null, null);
};
cljs.core.keep_indexed = function(a, b) {
  return function d(b, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      if (g) {
        if (cljs.core.chunked_seq_QMARK_.call(null, g)) {
          for (var h = cljs.core.chunk_first.call(null, g), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k), m = 0;;) {
            if (m < k) {
              var n = a.call(null, b + m, cljs.core._nth.call(null, h, m));
              null != n && cljs.core.chunk_append.call(null, l, n);
              m += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), d.call(null, b + k, cljs.core.chunk_rest.call(null, g)));
        }
        h = a.call(null, b, cljs.core.first.call(null, g));
        return null == h ? d.call(null, b + 1, cljs.core.rest.call(null, g)) : cljs.core.cons.call(null, h, d.call(null, b + 1, cljs.core.rest.call(null, g)));
      }
      return null;
    }, null, null);
  }.call(null, 0, b);
};
cljs.core.every_pred = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return cljs.core.boolean$.call(null, a.call(null, b));
      }, d = function(b, c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, b);
          return cljs.core.truth_(d) ? a.call(null, c) : d;
        }());
      }, e = function(b, c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, b);
          return cljs.core.truth_(e) ? (e = a.call(null, c), cljs.core.truth_(e) ? a.call(null, d) : e) : e;
        }());
      }, m = function() {
        var c = function(c, d, e, h) {
          return cljs.core.boolean$.call(null, b.call(null, c, d, e) && cljs.core.every_QMARK_.call(null, a, h));
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        return cljs.core.boolean$.call(null, function() {
          var d = a.call(null, c);
          return cljs.core.truth_(d) ? b.call(null, c) : d;
        }());
      }, e = function(c, d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, c);
          return cljs.core.truth_(e) && (e = a.call(null, d), cljs.core.truth_(e)) ? (e = b.call(null, c), cljs.core.truth_(e) ? b.call(null, d) : e) : e;
        }());
      }, m = function(c, d, e) {
        return cljs.core.boolean$.call(null, function() {
          var h = a.call(null, c);
          return cljs.core.truth_(h) && (h = a.call(null, d), cljs.core.truth_(h) && (h = a.call(null, e), cljs.core.truth_(h) && (h = b.call(null, c), cljs.core.truth_(h)))) ? (h = b.call(null, d), cljs.core.truth_(h) ? b.call(null, e) : h) : h;
        }());
      }, n = function() {
        var d = function(d, e, k, l) {
          return cljs.core.boolean$.call(null, c.call(null, d, e, k) && cljs.core.every_QMARK_.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? b.call(null, c) : d;
          }, l));
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        return cljs.core.boolean$.call(null, function() {
          var e = a.call(null, d);
          return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e;
        }());
      }, m = function(d, e) {
        return cljs.core.boolean$.call(null, function() {
          var k = a.call(null, d);
          return cljs.core.truth_(k) && (k = b.call(null, d), cljs.core.truth_(k) && (k = c.call(null, d), cljs.core.truth_(k) && (k = a.call(null, e), cljs.core.truth_(k)))) ? (k = b.call(null, e), cljs.core.truth_(k) ? c.call(null, e) : k) : k;
        }());
      }, n = function(d, e, k) {
        return cljs.core.boolean$.call(null, function() {
          var l = a.call(null, d);
          return cljs.core.truth_(l) && (l = b.call(null, d), cljs.core.truth_(l) && (l = c.call(null, d), cljs.core.truth_(l) && (l = a.call(null, e), cljs.core.truth_(l) && (l = b.call(null, e), cljs.core.truth_(l) && (l = c.call(null, e), cljs.core.truth_(l) && (l = a.call(null, k), cljs.core.truth_(l))))))) ? (l = b.call(null, k), cljs.core.truth_(l) ? c.call(null, k) : l) : l;
        }());
      }, r = function() {
        var e = function(e, s, l, m) {
          return cljs.core.boolean$.call(null, d.call(null, e, s, l) && cljs.core.every_QMARK_.call(null, function(d) {
            var e = a.call(null, d);
            return cljs.core.truth_(e) ? (e = b.call(null, d), cljs.core.truth_(e) ? c.call(null, d) : e) : e;
          }, m));
        }, s = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f);
        };
        s.cljs$lang$maxFixedArity = 3;
        s.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a);
        };
        s.cljs$core$IFn$_invoke$arity$variadic = e;
        return s;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return!0;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return r.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = r.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return!0;
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = r.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.every_QMARK_.call(null, function(b) {
            return b.call(null, a);
          }, e);
        }, c = function(a, b) {
          return cljs.core.every_QMARK_.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? c.call(null, b) : d;
          }, e);
        }, d = function(a, b, c) {
          return cljs.core.every_QMARK_.call(null, function(d) {
            var e = d.call(null, a);
            return cljs.core.truth_(e) ? (e = d.call(null, b), cljs.core.truth_(e) ? d.call(null, c) : e) : e;
          }, e);
        }, f = function() {
          var b = function(b, c, d, f) {
            return cljs.core.boolean$.call(null, a.call(null, b, c, d) && cljs.core.every_QMARK_.call(null, function(a) {
              return cljs.core.every_QMARK_.call(null, a, f);
            }, e));
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f);
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a);
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c;
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return!0;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3));
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return!0;
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a;
      }();
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.some_fn = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function(b) {
        return a.call(null, b);
      }, d = function(b, c) {
        var d = a.call(null, b);
        return cljs.core.truth_(d) ? d : a.call(null, c);
      }, e = function(b, c, d) {
        b = a.call(null, b);
        if (cljs.core.truth_(b)) {
          return b;
        }
        c = a.call(null, c);
        return cljs.core.truth_(c) ? c : a.call(null, d);
      }, m = function() {
        var c = function(c, d, e, h) {
          c = b.call(null, c, d, e);
          return cljs.core.truth_(c) ? c : cljs.core.some.call(null, a, h);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), b = function(a, b, f, g) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return c.call(this, a);
          case 2:
            return d.call(this, a, b);
          case 3:
            return e.call(this, a, b, f);
          default:
            return m.cljs$core$IFn$_invoke$arity$variadic(a, b, f, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = m.cljs$lang$applyTo;
      b.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      b.cljs$core$IFn$_invoke$arity$1 = c;
      b.cljs$core$IFn$_invoke$arity$2 = d;
      b.cljs$core$IFn$_invoke$arity$3 = e;
      b.cljs$core$IFn$_invoke$arity$variadic = m.cljs$core$IFn$_invoke$arity$variadic;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function(c) {
        var d = a.call(null, c);
        return cljs.core.truth_(d) ? d : b.call(null, c);
      }, e = function(c, d) {
        var e = a.call(null, c);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = a.call(null, d);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, c);
        return cljs.core.truth_(e) ? e : b.call(null, d);
      }, m = function(c, d, e) {
        var h = a.call(null, c);
        if (cljs.core.truth_(h)) {
          return h;
        }
        h = a.call(null, d);
        if (cljs.core.truth_(h)) {
          return h;
        }
        h = a.call(null, e);
        if (cljs.core.truth_(h)) {
          return h;
        }
        c = b.call(null, c);
        if (cljs.core.truth_(c)) {
          return c;
        }
        d = b.call(null, d);
        return cljs.core.truth_(d) ? d : b.call(null, e);
      }, n = function() {
        var d = function(d, e, k, l) {
          d = c.call(null, d, e, k);
          return cljs.core.truth_(d) ? d : cljs.core.some.call(null, function(c) {
            var d = a.call(null, c);
            return cljs.core.truth_(d) ? d : b.call(null, c);
          }, l);
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), c = function(a, b, c, f) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return d.call(this, a);
          case 2:
            return e.call(this, a, b);
          case 3:
            return m.call(this, a, b, c);
          default:
            return n.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = n.cljs$lang$applyTo;
      c.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      c.cljs$core$IFn$_invoke$arity$1 = d;
      c.cljs$core$IFn$_invoke$arity$2 = e;
      c.cljs$core$IFn$_invoke$arity$3 = m;
      c.cljs$core$IFn$_invoke$arity$variadic = n.cljs$core$IFn$_invoke$arity$variadic;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function(d) {
        var e = a.call(null, d);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, d);
        return cljs.core.truth_(e) ? e : c.call(null, d);
      }, m = function(d, e) {
        var k = a.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = b.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = c.call(null, d);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = a.call(null, e);
        if (cljs.core.truth_(k)) {
          return k;
        }
        k = b.call(null, e);
        return cljs.core.truth_(k) ? k : c.call(null, e);
      }, n = function(d, e, k) {
        var l = a.call(null, d);
        if (cljs.core.truth_(l)) {
          return l;
        }
        l = b.call(null, d);
        if (cljs.core.truth_(l)) {
          return l;
        }
        d = c.call(null, d);
        if (cljs.core.truth_(d)) {
          return d;
        }
        d = a.call(null, e);
        if (cljs.core.truth_(d)) {
          return d;
        }
        d = b.call(null, e);
        if (cljs.core.truth_(d)) {
          return d;
        }
        e = c.call(null, e);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = a.call(null, k);
        if (cljs.core.truth_(e)) {
          return e;
        }
        e = b.call(null, k);
        return cljs.core.truth_(e) ? e : c.call(null, k);
      }, r = function() {
        var e = function(e, l, s, m) {
          e = d.call(null, e, l, s);
          return cljs.core.truth_(e) ? e : cljs.core.some.call(null, function(d) {
            var e = a.call(null, d);
            if (cljs.core.truth_(e)) {
              return e;
            }
            e = b.call(null, d);
            return cljs.core.truth_(e) ? e : c.call(null, d);
          }, m);
        }, l = function(a, b, c, d) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return e.call(this, a, b, c, f);
        };
        l.cljs$lang$maxFixedArity = 3;
        l.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.rest(a);
          return e(b, c, d, a);
        };
        l.cljs$core$IFn$_invoke$arity$variadic = e;
        return l;
      }(), d = function(a, b, c, d) {
        switch(arguments.length) {
          case 0:
            return null;
          case 1:
            return e.call(this, a);
          case 2:
            return m.call(this, a, b);
          case 3:
            return n.call(this, a, b, c);
          default:
            return r.cljs$core$IFn$_invoke$arity$variadic(a, b, c, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = r.cljs$lang$applyTo;
      d.cljs$core$IFn$_invoke$arity$0 = function() {
        return null;
      };
      d.cljs$core$IFn$_invoke$arity$1 = e;
      d.cljs$core$IFn$_invoke$arity$2 = m;
      d.cljs$core$IFn$_invoke$arity$3 = n;
      d.cljs$core$IFn$_invoke$arity$variadic = r.cljs$core$IFn$_invoke$arity$variadic;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function(a) {
          return cljs.core.some.call(null, function(b) {
            return b.call(null, a);
          }, e);
        }, c = function(a, b) {
          return cljs.core.some.call(null, function(c) {
            var d = c.call(null, a);
            return cljs.core.truth_(d) ? d : c.call(null, b);
          }, e);
        }, d = function(a, b, c) {
          return cljs.core.some.call(null, function(d) {
            var e = d.call(null, a);
            if (cljs.core.truth_(e)) {
              return e;
            }
            e = d.call(null, b);
            return cljs.core.truth_(e) ? e : d.call(null, c);
          }, e);
        }, f = function() {
          var b = function(b, c, d, f) {
            b = a.call(null, b, c, d);
            return cljs.core.truth_(b) ? b : cljs.core.some.call(null, function(a) {
              return cljs.core.some.call(null, a, f);
            }, e);
          }, c = function(a, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return b.call(this, a, c, d, f);
          };
          c.cljs$lang$maxFixedArity = 3;
          c.cljs$lang$applyTo = function(a) {
            var c = cljs.core.first(a);
            a = cljs.core.next(a);
            var d = cljs.core.first(a);
            a = cljs.core.next(a);
            var e = cljs.core.first(a);
            a = cljs.core.rest(a);
            return b(c, d, e, a);
          };
          c.cljs$core$IFn$_invoke$arity$variadic = b;
          return c;
        }(), a = function(a, e, g, h) {
          switch(arguments.length) {
            case 0:
              return null;
            case 1:
              return b.call(this, a);
            case 2:
              return c.call(this, a, e);
            case 3:
              return d.call(this, a, e, g);
            default:
              return f.cljs$core$IFn$_invoke$arity$variadic(a, e, g, cljs.core.array_seq(arguments, 3));
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = f.cljs$lang$applyTo;
        a.cljs$core$IFn$_invoke$arity$0 = function() {
          return null;
        };
        a.cljs$core$IFn$_invoke$arity$1 = b;
        a.cljs$core$IFn$_invoke$arity$2 = c;
        a.cljs$core$IFn$_invoke$arity$3 = d;
        a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
        return a;
      }();
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.map = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var d = cljs.core.seq.call(null, c);
      if (d) {
        if (cljs.core.chunked_seq_QMARK_.call(null, d)) {
          for (var e = cljs.core.chunk_first.call(null, d), l = cljs.core.count.call(null, e), m = cljs.core.chunk_buffer.call(null, l), n = 0;;) {
            if (n < l) {
              cljs.core.chunk_append.call(null, m, b.call(null, cljs.core._nth.call(null, e, n))), n += 1;
            } else {
              break;
            }
          }
          return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, m), a.call(null, b, cljs.core.chunk_rest.call(null, d)));
        }
        return cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, d)), a.call(null, b, cljs.core.rest.call(null, d)));
      }
      return null;
    }, null, null);
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var e = cljs.core.seq.call(null, c), l = cljs.core.seq.call(null, d);
      return e && l ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, e), cljs.core.first.call(null, l)), a.call(null, b, cljs.core.rest.call(null, e), cljs.core.rest.call(null, l))) : null;
    }, null, null);
  }, d = function(b, c, d, e) {
    return new cljs.core.LazySeq(null, function() {
      var l = cljs.core.seq.call(null, c), m = cljs.core.seq.call(null, d), n = cljs.core.seq.call(null, e);
      return l && m && n ? cljs.core.cons.call(null, b.call(null, cljs.core.first.call(null, l), cljs.core.first.call(null, m), cljs.core.first.call(null, n)), a.call(null, b, cljs.core.rest.call(null, l), cljs.core.rest.call(null, m), cljs.core.rest.call(null, n))) : null;
    }, null, null);
  }, e = function() {
    var b = function(b, c, d, e, f) {
      return a.call(null, function(a) {
        return cljs.core.apply.call(null, b, a);
      }, function p(b) {
        return new cljs.core.LazySeq(null, function() {
          var c = a.call(null, cljs.core.seq, b);
          return cljs.core.every_QMARK_.call(null, cljs.core.identity, c) ? cljs.core.cons.call(null, a.call(null, cljs.core.first, c), p.call(null, a.call(null, cljs.core.rest, c))) : null;
        }, null, null);
      }.call(null, cljs.core.conj.call(null, f, e, d, c)));
    }, c = function(a, c, d, e, g) {
      var r = null;
      4 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return b.call(this, a, c, d, e, r);
    };
    c.cljs$lang$maxFixedArity = 4;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var g = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, g, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.take = function take(b, c) {
  return new cljs.core.LazySeq(null, function() {
    if (0 < b) {
      var d = cljs.core.seq.call(null, c);
      return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take.call(null, b - 1, cljs.core.rest.call(null, d))) : null;
    }
    return null;
  }, null, null);
};
cljs.core.drop = function(a, b) {
  var c = function(a, b) {
    for (;;) {
      var c = cljs.core.seq.call(null, b);
      if (0 < a && c) {
        var g = a - 1, c = cljs.core.rest.call(null, c);
        a = g;
        b = c;
      } else {
        return c;
      }
    }
  };
  return new cljs.core.LazySeq(null, function() {
    return c.call(null, a, b);
  }, null, null);
};
cljs.core.drop_last = function() {
  var a = null, b = function(b) {
    return a.call(null, 1, b);
  }, c = function(a, b) {
    return cljs.core.map.call(null, function(a, b) {
      return a;
    }, b, cljs.core.drop.call(null, a, b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.take_last = function(a, b) {
  for (var c = cljs.core.seq.call(null, b), d = cljs.core.seq.call(null, cljs.core.drop.call(null, a, b));;) {
    if (d) {
      c = cljs.core.next.call(null, c), d = cljs.core.next.call(null, d);
    } else {
      return c;
    }
  }
};
cljs.core.drop_while = function(a, b) {
  var c = function(a, b) {
    for (;;) {
      var c = cljs.core.seq.call(null, b);
      if (cljs.core.truth_(function() {
        var b = c;
        return b ? a.call(null, cljs.core.first.call(null, c)) : b;
      }())) {
        var g = a, h = cljs.core.rest.call(null, c);
        a = g;
        b = h;
      } else {
        return c;
      }
    }
  };
  return new cljs.core.LazySeq(null, function() {
    return c.call(null, a, b);
  }, null, null);
};
cljs.core.cycle = function cycle(b) {
  return new cljs.core.LazySeq(null, function() {
    var c = cljs.core.seq.call(null, b);
    return c ? cljs.core.concat.call(null, c, cycle.call(null, c)) : null;
  }, null, null);
};
cljs.core.split_at = function(a, b) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take.call(null, a, b), cljs.core.drop.call(null, a, b)], null);
};
cljs.core.repeat = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b, a.call(null, b));
    }, null, null);
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.replicate = function(a, b) {
  return cljs.core.take.call(null, a, cljs.core.repeat.call(null, b));
};
cljs.core.repeatedly = function() {
  var a = null, b = function(b) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, b.call(null), a.call(null, b));
    }, null, null);
  }, c = function(b, c) {
    return cljs.core.take.call(null, b, a.call(null, c));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.iterate = function iterate(b, c) {
  return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
    return iterate.call(null, b, b.call(null, c));
  }, null, null));
};
cljs.core.interleave = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, b), g = cljs.core.seq.call(null, c);
      return f && g ? cljs.core.cons.call(null, cljs.core.first.call(null, f), cljs.core.cons.call(null, cljs.core.first.call(null, g), a.call(null, cljs.core.rest.call(null, f), cljs.core.rest.call(null, g)))) : null;
    }, null, null);
  }, c = function() {
    var b = function(b, c, d) {
      return new cljs.core.LazySeq(null, function() {
        var e = cljs.core.map.call(null, cljs.core.seq, cljs.core.conj.call(null, d, c, b));
        return cljs.core.every_QMARK_.call(null, cljs.core.identity, e) ? cljs.core.concat.call(null, cljs.core.map.call(null, cljs.core.first, e), cljs.core.apply.call(null, a, cljs.core.map.call(null, cljs.core.rest, e))) : null;
      }, null, null);
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.interpose = function(a, b) {
  return cljs.core.drop.call(null, 1, cljs.core.interleave.call(null, cljs.core.repeat.call(null, a), b));
};
cljs.core.flatten1 = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, a);
      return f ? cljs.core.cons.call(null, cljs.core.first.call(null, f), c.call(null, cljs.core.rest.call(null, f), e)) : cljs.core.seq.call(null, e) ? c.call(null, cljs.core.first.call(null, e), cljs.core.rest.call(null, e)) : null;
    }, null, null);
  }.call(null, null, a);
};
cljs.core.mapcat = function() {
  var a = null, b = function(a, b) {
    return cljs.core.flatten1.call(null, cljs.core.map.call(null, a, b));
  }, c = function() {
    var a = function(a, b, c) {
      return cljs.core.flatten1.call(null, cljs.core.apply.call(null, cljs.core.map, a, b, c));
    }, b = function(b, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return a.call(this, b, c, k);
    };
    b.cljs$lang$maxFixedArity = 2;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.filter = function filter(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if (d) {
      if (cljs.core.chunked_seq_QMARK_.call(null, d)) {
        for (var e = cljs.core.chunk_first.call(null, d), f = cljs.core.count.call(null, e), g = cljs.core.chunk_buffer.call(null, f), h = 0;;) {
          if (h < f) {
            cljs.core.truth_(b.call(null, cljs.core._nth.call(null, e, h))) && cljs.core.chunk_append.call(null, g, cljs.core._nth.call(null, e, h)), h += 1;
          } else {
            break;
          }
        }
        return cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), filter.call(null, b, cljs.core.chunk_rest.call(null, d)));
      }
      e = cljs.core.first.call(null, d);
      d = cljs.core.rest.call(null, d);
      return cljs.core.truth_(b.call(null, e)) ? cljs.core.cons.call(null, e, filter.call(null, b, d)) : filter.call(null, b, d);
    }
    return null;
  }, null, null);
};
cljs.core.remove = function(a, b) {
  return cljs.core.filter.call(null, cljs.core.complement.call(null, a), b);
};
cljs.core.tree_seq = function(a, b, c) {
  return function e(c) {
    return new cljs.core.LazySeq(null, function() {
      return cljs.core.cons.call(null, c, cljs.core.truth_(a.call(null, c)) ? cljs.core.mapcat.call(null, e, b.call(null, c)) : null);
    }, null, null);
  }.call(null, c);
};
cljs.core.flatten = function(a) {
  return cljs.core.filter.call(null, function(a) {
    return!cljs.core.sequential_QMARK_.call(null, a);
  }, cljs.core.rest.call(null, cljs.core.tree_seq.call(null, cljs.core.sequential_QMARK_, cljs.core.seq, a)));
};
cljs.core.into = function(a, b) {
  return null != a ? a && (a.cljs$lang$protocol_mask$partition1$ & 4 || a.cljs$core$IEditableCollection$) ? cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core.transient$.call(null, a), b)) : cljs.core.reduce.call(null, cljs.core._conj, a, b) : cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, b);
};
cljs.core.mapv = function() {
  var a = null, b = function(a, b) {
    return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, c) {
      return cljs.core.conj_BANG_.call(null, b, a.call(null, c));
    }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b));
  }, c = function(a, b, c) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c));
  }, d = function(a, b, c, d) {
    return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.map.call(null, a, b, c, d));
  }, e = function() {
    var a = function(a, b, c, d, e) {
      return cljs.core.into.call(null, cljs.core.PersistentVector.EMPTY, cljs.core.apply.call(null, cljs.core.map, a, b, c, d, e));
    }, b = function(b, c, d, e, g) {
      var r = null;
      4 < arguments.length && (r = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4), 0));
      return a.call(this, b, c, d, e, r);
    };
    b.cljs$lang$maxFixedArity = 4;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var g = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, g, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k, l) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, g);
      case 3:
        return c.call(this, a, g, h);
      case 4:
        return d.call(this, a, g, h, k);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, k, cljs.core.array_seq(arguments, 4));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 4;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.filterv = function(a, b) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(b, d) {
    return cljs.core.truth_(a.call(null, d)) ? cljs.core.conj_BANG_.call(null, b, d) : b;
  }, cljs.core.transient$.call(null, cljs.core.PersistentVector.EMPTY), b));
};
cljs.core.partition = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c);
  }, c = function(b, c, d) {
    return new cljs.core.LazySeq(null, function() {
      var h = cljs.core.seq.call(null, d);
      if (h) {
        var k = cljs.core.take.call(null, b, h);
        return b === cljs.core.count.call(null, k) ? cljs.core.cons.call(null, k, a.call(null, b, c, cljs.core.drop.call(null, c, h))) : null;
      }
      return null;
    }, null, null);
  }, d = function(b, c, d, h) {
    return new cljs.core.LazySeq(null, function() {
      var k = cljs.core.seq.call(null, h);
      if (k) {
        var l = cljs.core.take.call(null, b, k);
        return b === cljs.core.count.call(null, l) ? cljs.core.cons.call(null, l, a.call(null, b, c, d, cljs.core.drop.call(null, c, k))) : cljs.core._conj.call(null, cljs.core.List.EMPTY, cljs.core.take.call(null, b, cljs.core.concat.call(null, l, d)));
      }
      return null;
    }, null, null);
  }, a = function(a, f, g, h) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, f);
      case 3:
        return c.call(this, a, f, g);
      case 4:
        return d.call(this, a, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  return a;
}();
cljs.core.get_in = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, null);
  }, c = function(a, b, c) {
    var g = cljs.core.lookup_sentinel;
    for (b = cljs.core.seq.call(null, b);;) {
      if (b) {
        var h = a;
        if (h ? h.cljs$lang$protocol_mask$partition0$ & 256 || h.cljs$core$ILookup$ || (h.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, h)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.ILookup, h)) {
          a = cljs.core.get.call(null, a, cljs.core.first.call(null, b), g);
          if (g === a) {
            return c;
          }
          b = cljs.core.next.call(null, b);
        } else {
          return c;
        }
      } else {
        return a;
      }
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.assoc_in = function assoc_in(b, c, d) {
  var e = cljs.core.nth.call(null, c, 0, null);
  return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, e, assoc_in.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d);
};
cljs.core.update_in = function() {
  var a = null, b = function(b, c, d) {
    var e = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), c, d)) : cljs.core.assoc.call(null, b, e, d.call(null, cljs.core.get.call(null, b, e)));
  }, c = function(b, c, d, e) {
    var f = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, f, a.call(null, cljs.core.get.call(null, b, f), c, d, e)) : cljs.core.assoc.call(null, b, f, d.call(null, cljs.core.get.call(null, b, f), e));
  }, d = function(b, c, d, e, f) {
    var n = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, n, a.call(null, cljs.core.get.call(null, b, n), c, d, e, f)) : cljs.core.assoc.call(null, b, n, d.call(null, cljs.core.get.call(null, b, n), e, f));
  }, e = function(b, c, d, e, f, n) {
    var r = cljs.core.nth.call(null, c, 0, null);
    return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, r, a.call(null, cljs.core.get.call(null, b, r), c, d, e, f, n)) : cljs.core.assoc.call(null, b, r, d.call(null, cljs.core.get.call(null, b, r), e, f, n));
  }, f = function() {
    var b = function(b, c, d, e, f, g, h) {
      var q = cljs.core.nth.call(null, c, 0, null);
      return(c = cljs.core.nthnext.call(null, c, 1)) ? cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, a, cljs.core.get.call(null, b, q), c, d, e, f, g, h)) : cljs.core.assoc.call(null, b, q, cljs.core.apply.call(null, d, cljs.core.get.call(null, b, q), e, f, g, h));
    }, c = function(a, c, d, e, f, h, s) {
      var q = null;
      6 < arguments.length && (q = cljs.core.array_seq(Array.prototype.slice.call(arguments, 6), 0));
      return b.call(this, a, c, d, e, f, h, q);
    };
    c.cljs$lang$maxFixedArity = 6;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var f = cljs.core.first(a);
      a = cljs.core.next(a);
      var h = cljs.core.first(a);
      a = cljs.core.next(a);
      var s = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, e, f, h, s, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, h, k, l, m, n, r) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, h, k);
      case 4:
        return c.call(this, a, h, k, l);
      case 5:
        return d.call(this, a, h, k, l, m);
      case 6:
        return e.call(this, a, h, k, l, m, n);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, n, cljs.core.array_seq(arguments, 6));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 6;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  a.cljs$core$IFn$_invoke$arity$6 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.VectorNode = function(a, b) {
  this.edit = a;
  this.arr = b;
};
cljs.core.VectorNode.cljs$lang$type = !0;
cljs.core.VectorNode.cljs$lang$ctorStr = "cljs.core/VectorNode";
cljs.core.VectorNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/VectorNode");
};
cljs.core.__GT_VectorNode = function(a, b) {
  return new cljs.core.VectorNode(a, b);
};
cljs.core.pv_fresh_node = function(a) {
  return new cljs.core.VectorNode(a, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
};
cljs.core.pv_aget = function(a, b) {
  return a.arr[b];
};
cljs.core.pv_aset = function(a, b, c) {
  return a.arr[b] = c;
};
cljs.core.pv_clone_node = function(a) {
  return new cljs.core.VectorNode(a.edit, cljs.core.aclone.call(null, a.arr));
};
cljs.core.tail_off = function(a) {
  a = a.cnt;
  return 32 > a ? 0 : a - 1 >>> 5 << 5;
};
cljs.core.new_path = function(a, b, c) {
  for (;;) {
    if (0 === b) {
      return c;
    }
    var d = cljs.core.pv_fresh_node.call(null, a);
    cljs.core.pv_aset.call(null, d, 0, c);
    c = d;
    b -= 5;
  }
};
cljs.core.push_tail = function push_tail(b, c, d, e) {
  var f = cljs.core.pv_clone_node.call(null, d), g = b.cnt - 1 >>> c & 31;
  5 === c ? cljs.core.pv_aset.call(null, f, g, e) : (d = cljs.core.pv_aget.call(null, d, g), b = null != d ? push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, null, c - 5, e), cljs.core.pv_aset.call(null, f, g, b));
  return f;
};
cljs.core.vector_index_out_of_bounds = function(a, b) {
  throw Error([cljs.core.str("No item "), cljs.core.str(a), cljs.core.str(" in vector of length "), cljs.core.str(b)].join(""));
};
cljs.core.array_for = function(a, b) {
  if (0 <= b && b < a.cnt) {
    if (b >= cljs.core.tail_off.call(null, a)) {
      return a.tail;
    }
    for (var c = a.root, d = a.shift;;) {
      if (0 < d) {
        c = cljs.core.pv_aget.call(null, c, b >>> d & 31), d -= 5;
      } else {
        return c.arr;
      }
    }
  } else {
    return cljs.core.vector_index_out_of_bounds.call(null, b, a.cnt);
  }
};
cljs.core.do_assoc = function do_assoc(b, c, d, e, f) {
  var g = cljs.core.pv_clone_node.call(null, d);
  if (0 === c) {
    cljs.core.pv_aset.call(null, g, e & 31, f);
  } else {
    var h = e >>> c & 31;
    cljs.core.pv_aset.call(null, g, h, do_assoc.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, h), e, f));
  }
  return g;
};
cljs.core.pop_tail = function pop_tail(b, c, d) {
  var e = b.cnt - 2 >>> c & 31;
  if (5 < c) {
    b = pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    if (null == b && 0 === e) {
      return null;
    }
    d = cljs.core.pv_clone_node.call(null, d);
    cljs.core.pv_aset.call(null, d, e, b);
    return d;
  }
  return 0 === e ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (d = cljs.core.pv_clone_node.call(null, d), cljs.core.pv_aset.call(null, d, e, null), d) : null;
};
cljs.core.PersistentVector = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.shift = c;
  this.root = d;
  this.tail = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
  this.cljs$lang$protocol_mask$partition0$ = 167668511;
};
cljs.core.PersistentVector.cljs$lang$type = !0;
cljs.core.PersistentVector.cljs$lang$ctorStr = "cljs.core/PersistentVector";
cljs.core.PersistentVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentVector");
};
cljs.core.PersistentVector.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientVector(this.cnt, this.shift, cljs.core.tv_editable_root.call(null, this.root), cljs.core.tv_editable_tail.call(null, this.tail));
};
cljs.core.PersistentVector.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.PersistentVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.PersistentVector.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (0 <= b && b < this.cnt) {
    return cljs.core.tail_off.call(null, this) <= b ? (a = cljs.core.aclone.call(null, this.tail), a[b & 31] = c, new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, a, null)) : new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, cljs.core.do_assoc.call(null, this, this.shift, this.root, b, c), this.tail, null);
  }
  if (b === this.cnt) {
    return cljs.core._conj.call(null, this, c);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds  [0,"), cljs.core.str(this.cnt), cljs.core.str("]")].join(""));
  }
  return null;
};
cljs.core.PersistentVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(null, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentVector.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$IIndexed$_nth$arity$2(null, a);
};
cljs.core.PersistentVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$IIndexed$_nth$arity$3(null, a, b);
};
cljs.core.PersistentVector.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = [0, c];
  for (c = 0;;) {
    if (c < this.cnt) {
      var d = cljs.core.array_for.call(null, this, c), e = d.length;
      a: {
        for (var f = 0, g = a[1];;) {
          if (f < e) {
            if (g = b.call(null, g, f + c, d[f]), cljs.core.reduced_QMARK_.call(null, g)) {
              d = g;
              break a;
            } else {
              f += 1;
            }
          } else {
            a[0] = e;
            d = a[1] = g;
            break a;
          }
        }
        d = void 0;
      }
      if (cljs.core.reduced_QMARK_.call(null, d)) {
        return cljs.core.deref.call(null, d);
      }
      c += a[0];
    } else {
      return a[1];
    }
  }
};
cljs.core.PersistentVector.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  if (32 > this.cnt - cljs.core.tail_off.call(null, this)) {
    for (var c = this.tail.length, d = Array(c + 1), e = 0;;) {
      if (e < c) {
        d[e] = this.tail[e], e += 1;
      } else {
        break;
      }
    }
    d[c] = b;
    return new cljs.core.PersistentVector(this.meta, this.cnt + 1, this.shift, this.root, d, null);
  }
  c = (d = this.cnt >>> 5 > 1 << this.shift) ? this.shift + 5 : this.shift;
  d ? (d = cljs.core.pv_fresh_node.call(null, null), cljs.core.pv_aset.call(null, d, 0, this.root), cljs.core.pv_aset.call(null, d, 1, cljs.core.new_path.call(null, null, this.shift, new cljs.core.VectorNode(null, this.tail)))) : d = cljs.core.push_tail.call(null, this, this.shift, this.root, new cljs.core.VectorNode(null, this.tail));
  return new cljs.core.PersistentVector(this.meta, this.cnt + 1, c, d, [b], null);
};
cljs.core.PersistentVector.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? new cljs.core.RSeq(this, this.cnt - 1, null) : null;
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return cljs.core._nth.call(null, this, 0);
};
cljs.core.PersistentVector.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return cljs.core._nth.call(null, this, 1);
};
cljs.core.PersistentVector.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.PersistentVector.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.PersistentVector.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 === this.cnt ? null : 32 > this.cnt ? cljs.core.array_seq.call(null, this.tail) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.chunked_seq.call(null, this, 0, 0) : null;
};
cljs.core.PersistentVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core._nth.call(null, this, this.cnt - 1) : null;
};
cljs.core.PersistentVector.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if (0 === this.cnt) {
    throw Error("Can't pop empty vector");
  }
  if (1 === this.cnt) {
    return cljs.core._with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
  }
  if (1 < this.cnt - cljs.core.tail_off.call(null, this)) {
    return new cljs.core.PersistentVector(this.meta, this.cnt - 1, this.shift, this.root, this.tail.slice(0, -1), null);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    a = cljs.core.array_for.call(null, this, this.cnt - 2);
    var b = cljs.core.pop_tail.call(null, this, this.shift, this.root), b = null == b ? cljs.core.PersistentVector.EMPTY_NODE : b, c = this.cnt - 1;
    return 5 < this.shift && null == cljs.core.pv_aget.call(null, b, 1) ? new cljs.core.PersistentVector(this.meta, c, this.shift - 5, cljs.core.pv_aget.call(null, b, 0), a, null) : new cljs.core.PersistentVector(this.meta, c, this.shift, b, a, null);
  }
  return null;
};
cljs.core.PersistentVector.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc.call(null, this, b, c);
};
cljs.core.PersistentVector.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentVector.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(b, this.cnt, this.shift, this.root, this.tail, this.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentVector(this.meta, this.cnt, this.shift, this.root, this.tail, this.__hash);
};
cljs.core.PersistentVector.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return cljs.core.array_for.call(null, this, b)[b & 31];
};
cljs.core.PersistentVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.cnt ? cljs.core._nth.call(null, this, b) : c;
};
cljs.core.PersistentVector.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.__GT_PersistentVector = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentVector(a, b, c, d, e, f);
};
cljs.core.PersistentVector.EMPTY_NODE = new cljs.core.VectorNode(null, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
cljs.core.PersistentVector.EMPTY = new cljs.core.PersistentVector(null, 0, 5, cljs.core.PersistentVector.EMPTY_NODE, [], 0);
cljs.core.PersistentVector.fromArray = function(a, b) {
  var c = a.length, d = b ? a : cljs.core.aclone.call(null, a);
  if (32 > c) {
    return new cljs.core.PersistentVector(null, c, 5, cljs.core.PersistentVector.EMPTY_NODE, d, null);
  }
  for (var e = d.slice(0, 32), f = new cljs.core.PersistentVector(null, 32, 5, cljs.core.PersistentVector.EMPTY_NODE, e, null), e = 32, g = cljs.core._as_transient.call(null, f);;) {
    if (e < c) {
      f = e + 1, g = cljs.core.conj_BANG_.call(null, g, d[e]), e = f;
    } else {
      return cljs.core.persistent_BANG_.call(null, g);
    }
  }
};
cljs.core.vec = function(a) {
  return cljs.core._persistent_BANG_.call(null, cljs.core.reduce.call(null, cljs.core._conj_BANG_, cljs.core._as_transient.call(null, cljs.core.PersistentVector.EMPTY), a));
};
cljs.core.vector = function() {
  var a = function(a) {
    return a instanceof cljs.core.IndexedSeq && 0 === a.i ? cljs.core.PersistentVector.fromArray.call(null, a.arr, !0) : cljs.core.vec.call(null, a);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.ChunkedSeq = function(a, b, c, d, e, f) {
  this.vec = a;
  this.node = b;
  this.i = c;
  this.off = d;
  this.meta = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition0$ = 32243948;
  this.cljs$lang$protocol_mask$partition1$ = 1536;
};
cljs.core.ChunkedSeq.cljs$lang$type = !0;
cljs.core.ChunkedSeq.cljs$lang$ctorStr = "cljs.core/ChunkedSeq";
cljs.core.ChunkedSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ChunkedSeq");
};
cljs.core.ChunkedSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? null : a) : cljs.core._chunked_next.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ChunkedSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, cljs.core.subvec.call(null, this.vec, this.i + this.off, cljs.core.count.call(null, this.vec)), b, c);
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return this.node[this.off];
};
cljs.core.ChunkedSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.off + 1 < this.node.length ? (a = cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off + 1), null == a ? cljs.core.List.EMPTY : a) : cljs.core._chunked_rest.call(null, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedNext$_chunked_next$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? null : a;
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.chunked_seq.call(null, this.vec, this.node, this.i, this.off, b);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IWithMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ChunkedSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_first$arity$1 = function(a) {
  return cljs.core.array_chunk.call(null, this.node, this.off);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IChunkedSeq$_chunked_rest$arity$1 = function(a) {
  a = this.node.length;
  a = this.i + a < cljs.core._count.call(null, this.vec) ? cljs.core.chunked_seq.call(null, this.vec, this.i + a, 0) : null;
  return null == a ? cljs.core.List.EMPTY : a;
};
cljs.core.__GT_ChunkedSeq = function(a, b, c, d, e, f) {
  return new cljs.core.ChunkedSeq(a, b, c, d, e, f);
};
cljs.core.chunked_seq = function() {
  var a = null, b = function(a, b, c) {
    return new cljs.core.ChunkedSeq(a, cljs.core.array_for.call(null, a, b), b, c, null, null);
  }, c = function(a, b, c, d) {
    return new cljs.core.ChunkedSeq(a, b, c, d, null, null);
  }, d = function(a, b, c, d, k) {
    return new cljs.core.ChunkedSeq(a, b, c, d, k, null);
  }, a = function(a, f, g, h, k) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, f, g);
      case 4:
        return c.call(this, a, f, g, h);
      case 5:
        return d.call(this, a, f, g, h, k);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  a.cljs$core$IFn$_invoke$arity$5 = d;
  return a;
}();
cljs.core.Subvec = function(a, b, c, d, e) {
  this.meta = a;
  this.v = b;
  this.start = c;
  this.end = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 32400159;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Subvec.cljs$lang$type = !0;
cljs.core.Subvec.cljs$lang$ctorStr = "cljs.core/Subvec";
cljs.core.Subvec.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Subvec");
};
cljs.core.Subvec.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  var d = this, e = d.start + b;
  return cljs.core.build_subvec.call(null, d.meta, cljs.core.assoc.call(null, d.v, e, c), d.start, function() {
    var a = d.end, b = e + 1;
    return a > b ? a : b;
  }(), null);
};
cljs.core.Subvec.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$IIndexed$_nth$arity$2(null, c);
      case 3:
        return this.cljs$core$IIndexed$_nth$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.Subvec.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$IIndexed$_nth$arity$2(null, a);
};
cljs.core.Subvec.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$IIndexed$_nth$arity$3(null, a, b);
};
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, this.meta, cljs.core._assoc_n.call(null, this.v, this.end, b), this.start, this.end + 1, null);
};
cljs.core.Subvec.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return function d(a) {
    return a === b.end ? null : cljs.core.cons.call(null, cljs.core._nth.call(null, b.v, a), new cljs.core.LazySeq(null, function() {
      return d.call(null, a + 1);
    }, null, null));
  }.call(null, b.start);
};
cljs.core.Subvec.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.end - this.start;
};
cljs.core.Subvec.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core._nth.call(null, this.v, this.end - 1);
};
cljs.core.Subvec.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  if (this.start === this.end) {
    throw Error("Can't pop empty vector");
  }
  return cljs.core.build_subvec.call(null, this.meta, this.v, this.start, this.end - 1, null);
};
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return cljs.core._assoc.call(null, this, b, c);
};
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.build_subvec.call(null, b, this.v, this.start, this.end, this.__hash);
};
cljs.core.Subvec.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Subvec(this.meta, this.v, this.start, this.end, this.__hash);
};
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  return 0 > b || this.end <= this.start + b ? cljs.core.vector_index_out_of_bounds.call(null, b, this.end - this.start) : cljs.core._nth.call(null, this.v, this.start + b);
};
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 > b || this.end <= this.start + b ? c : cljs.core._nth.call(null, this.v, this.start + b, c);
};
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentVector.EMPTY, this.meta);
};
cljs.core.__GT_Subvec = function(a, b, c, d, e) {
  return new cljs.core.Subvec(a, b, c, d, e);
};
cljs.core.build_subvec = function(a, b, c, d, e) {
  for (;;) {
    if (b instanceof cljs.core.Subvec) {
      c = b.start + c, d = b.start + d, b = b.v;
    } else {
      var f = cljs.core.count.call(null, b);
      if (0 > c || 0 > d || c > f || d > f) {
        throw Error("Index out of bounds");
      }
      return new cljs.core.Subvec(a, b, c, d, e);
    }
  }
};
cljs.core.subvec = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, cljs.core.count.call(null, b));
  }, c = function(a, b, c) {
    return cljs.core.build_subvec.call(null, null, a, b, c, null);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.tv_ensure_editable = function(a, b) {
  return a === b.edit ? b : new cljs.core.VectorNode(a, cljs.core.aclone.call(null, b.arr));
};
cljs.core.tv_editable_root = function(a) {
  return new cljs.core.VectorNode({}, cljs.core.aclone.call(null, a.arr));
};
cljs.core.tv_editable_tail = function(a) {
  var b = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  cljs.core.array_copy.call(null, a, 0, b, 0, a.length);
  return b;
};
cljs.core.tv_push_tail = function tv_push_tail(b, c, d, e) {
  var f = cljs.core.tv_ensure_editable.call(null, b.root.edit, d), g = b.cnt - 1 >>> c & 31;
  cljs.core.pv_aset.call(null, f, g, 5 === c ? e : function() {
    var d = cljs.core.pv_aget.call(null, f, g);
    return null != d ? tv_push_tail.call(null, b, c - 5, d, e) : cljs.core.new_path.call(null, b.root.edit, c - 5, e);
  }());
  return f;
};
cljs.core.tv_pop_tail = function tv_pop_tail(b, c, d) {
  d = cljs.core.tv_ensure_editable.call(null, b.root.edit, d);
  var e = b.cnt - 2 >>> c & 31;
  if (5 < c) {
    b = tv_pop_tail.call(null, b, c - 5, cljs.core.pv_aget.call(null, d, e));
    if (null == b && 0 === e) {
      return null;
    }
    cljs.core.pv_aset.call(null, d, e, b);
    return d;
  }
  return 0 === e ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (cljs.core.pv_aset.call(null, d, e, null), d) : null;
};
cljs.core.editable_array_for = function(a, b) {
  if (0 <= b && b < a.cnt) {
    if (b >= cljs.core.tail_off.call(null, a)) {
      return a.tail;
    }
    for (var c = a.root, d = c, e = a.shift;;) {
      if (0 < e) {
        d = cljs.core.tv_ensure_editable.call(null, c.edit, cljs.core.pv_aget.call(null, d, b >>> e & 31)), e -= 5;
      } else {
        return d.arr;
      }
    }
  } else {
    throw Error([cljs.core.str("No item "), cljs.core.str(b), cljs.core.str(" in transient vector of length "), cljs.core.str(a.cnt)].join(""));
  }
};
cljs.core.TransientVector = function(a, b, c, d) {
  this.cnt = a;
  this.shift = b;
  this.root = c;
  this.tail = d;
  this.cljs$lang$protocol_mask$partition0$ = 275;
  this.cljs$lang$protocol_mask$partition1$ = 88;
};
cljs.core.TransientVector.cljs$lang$type = !0;
cljs.core.TransientVector.cljs$lang$ctorStr = "cljs.core/TransientVector";
cljs.core.TransientVector.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientVector");
};
cljs.core.TransientVector.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.TransientVector.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.TransientVector.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.TransientVector.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (this.root.edit) {
    return cljs.core.array_for.call(null, this, b)[b & 31];
  }
  throw Error("nth after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 <= b && b < this.cnt ? cljs.core._nth.call(null, this, b) : c;
};
cljs.core.TransientVector.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (this.root.edit) {
    return this.cnt;
  }
  throw Error("count after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_assoc_n_BANG_$arity$3 = function(a, b, c) {
  var d = this;
  if (d.root.edit) {
    if (0 <= b && b < d.cnt) {
      return cljs.core.tail_off.call(null, this) <= b ? d.tail[b & 31] = c : (a = function f(a, h) {
        var k = cljs.core.tv_ensure_editable.call(null, d.root.edit, h);
        if (0 === a) {
          cljs.core.pv_aset.call(null, k, b & 31, c);
        } else {
          var l = b >>> a & 31;
          cljs.core.pv_aset.call(null, k, l, f.call(null, a - 5, cljs.core.pv_aget.call(null, k, l)));
        }
        return k;
      }.call(null, d.shift, d.root), d.root = a), this;
    }
    if (b === d.cnt) {
      return cljs.core._conj_BANG_.call(null, this, c);
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      throw Error([cljs.core.str("Index "), cljs.core.str(b), cljs.core.str(" out of bounds for TransientVector of length"), cljs.core.str(d.cnt)].join(""));
    }
    return null;
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientVector$_pop_BANG_$arity$1 = function(a) {
  if (this.root.edit) {
    if (0 === this.cnt) {
      throw Error("Can't pop empty vector");
    }
    if (1 === this.cnt) {
      return this.cnt = 0, this;
    }
    if (0 < (this.cnt - 1 & 31)) {
      return this.cnt -= 1, this;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      a = cljs.core.editable_array_for.call(null, this, this.cnt - 2);
      var b;
      b = cljs.core.tv_pop_tail.call(null, this, this.shift, this.root);
      b = null != b ? b : new cljs.core.VectorNode(this.root.edit, [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]);
      5 < this.shift && null == cljs.core.pv_aget.call(null, b, 1) ? (this.root = cljs.core.tv_ensure_editable.call(null, this.root.edit, cljs.core.pv_aget.call(null, b, 0)), this.shift -= 5) : this.root = b;
      this.cnt -= 1;
      this.tail = a;
      return this;
    }
    return null;
  }
  throw Error("pop! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return cljs.core._assoc_n_BANG_.call(null, this, b, c);
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if (this.root.edit) {
    if (32 > this.cnt - cljs.core.tail_off.call(null, this)) {
      this.tail[this.cnt & 31] = b;
    } else {
      var c = new cljs.core.VectorNode(this.root.edit, this.tail), d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      d[0] = b;
      this.tail = d;
      if (this.cnt >>> 5 > 1 << this.shift) {
        var d = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null], e = this.shift + 5;
        d[0] = this.root;
        d[1] = cljs.core.new_path.call(null, this.root.edit, this.shift, c);
        this.root = new cljs.core.VectorNode(this.root.edit, d);
        this.shift = e;
      } else {
        this.root = cljs.core.tv_push_tail.call(null, this, this.shift, this.root, c);
      }
    }
    this.cnt += 1;
    return this;
  }
  throw Error("conj! after persistent!");
};
cljs.core.TransientVector.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if (this.root.edit) {
    this.root.edit = null;
    a = this.cnt - cljs.core.tail_off.call(null, this);
    var b = Array(a);
    cljs.core.array_copy.call(null, this.tail, 0, b, 0, a);
    return new cljs.core.PersistentVector(null, this.cnt, this.shift, this.root, b, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientVector = function(a, b, c, d) {
  return new cljs.core.TransientVector(a, b, c, d);
};
cljs.core.PersistentQueueSeq = function(a, b, c, d) {
  this.meta = a;
  this.front = b;
  this.rear = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 31850572;
};
cljs.core.PersistentQueueSeq.cljs$lang$type = !0;
cljs.core.PersistentQueueSeq.cljs$lang$ctorStr = "cljs.core/PersistentQueueSeq";
cljs.core.PersistentQueueSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueueSeq");
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.PersistentQueueSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return(a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueueSeq(this.meta, a, this.rear, null) : null == this.rear ? cljs.core._empty.call(null, this) : new cljs.core.PersistentQueueSeq(this.meta, this.rear, null, null);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueueSeq(b, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_PersistentQueueSeq = function(a, b, c, d) {
  return new cljs.core.PersistentQueueSeq(a, b, c, d);
};
cljs.core.PersistentQueue = function(a, b, c, d, e) {
  this.meta = a;
  this.count = b;
  this.front = c;
  this.rear = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 31858766;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentQueue.cljs$lang$type = !0;
cljs.core.PersistentQueue.cljs$lang$ctorStr = "cljs.core/PersistentQueue";
cljs.core.PersistentQueue.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentQueue");
};
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.truth_(c.front) ? new cljs.core.PersistentQueue(c.meta, c.count + 1, c.front, cljs.core.conj.call(null, function() {
    var a = c.rear;
    return cljs.core.truth_(a) ? a : cljs.core.PersistentVector.EMPTY;
  }(), b), null) : new cljs.core.PersistentQueue(c.meta, c.count + 1, cljs.core.conj.call(null, c.front, b), cljs.core.PersistentVector.EMPTY, null);
};
cljs.core.PersistentQueue.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this, c = cljs.core.seq.call(null, b.rear);
  return cljs.core.truth_(function() {
    var a = b.front;
    return cljs.core.truth_(a) ? a : c;
  }()) ? new cljs.core.PersistentQueueSeq(null, b.front, cljs.core.seq.call(null, c), null) : null;
};
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.count;
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return cljs.core.truth_(this.front) ? (a = cljs.core.next.call(null, this.front)) ? new cljs.core.PersistentQueue(this.meta, this.count - 1, a, this.rear, null) : new cljs.core.PersistentQueue(this.meta, this.count - 1, cljs.core.seq.call(null, this.rear), cljs.core.PersistentVector.EMPTY, null) : this;
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.front);
};
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.rest.call(null, cljs.core.seq.call(null, this));
};
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentQueue(b, this.count, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentQueue(this.meta, this.count, this.front, this.rear, this.__hash);
};
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentQueue.EMPTY;
};
cljs.core.__GT_PersistentQueue = function(a, b, c, d, e) {
  return new cljs.core.PersistentQueue(a, b, c, d, e);
};
cljs.core.PersistentQueue.EMPTY = new cljs.core.PersistentQueue(null, 0, null, cljs.core.PersistentVector.EMPTY, 0);
cljs.core.NeverEquiv = function() {
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2097152;
};
cljs.core.NeverEquiv.cljs$lang$type = !0;
cljs.core.NeverEquiv.cljs$lang$ctorStr = "cljs.core/NeverEquiv";
cljs.core.NeverEquiv.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NeverEquiv");
};
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return!1;
};
cljs.core.__GT_NeverEquiv = function() {
  return new cljs.core.NeverEquiv;
};
cljs.core.never_equiv = new cljs.core.NeverEquiv;
cljs.core.equiv_map = function(a, b) {
  return cljs.core.boolean$.call(null, cljs.core.map_QMARK_.call(null, b) ? cljs.core.count.call(null, a) === cljs.core.count.call(null, b) ? cljs.core.every_QMARK_.call(null, cljs.core.identity, cljs.core.map.call(null, function(a) {
    return cljs.core._EQ_.call(null, cljs.core.get.call(null, b, cljs.core.first.call(null, a), cljs.core.never_equiv), cljs.core.second.call(null, a));
  }, a)) : null : null);
};
cljs.core.scan_array = function(a, b, c) {
  for (var d = c.length, e = 0;;) {
    if (e < d) {
      if (b === c[e]) {
        return e;
      }
      e += a;
    } else {
      return null;
    }
  }
};
cljs.core.obj_map_compare_keys = function(a, b) {
  var c = cljs.core.hash.call(null, a), d = cljs.core.hash.call(null, b);
  return c < d ? -1 : c > d ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? 0 : null;
};
cljs.core.obj_map__GT_hash_map = function(a, b, c) {
  var d = a.keys, e = d.length, f = a.strobj;
  a = cljs.core.meta.call(null, a);
  for (var g = 0, h = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if (g < e) {
      var k = d[g], g = g + 1, h = cljs.core.assoc_BANG_.call(null, h, k, f[k])
    } else {
      return cljs.core.with_meta.call(null, cljs.core.persistent_BANG_.call(null, cljs.core.assoc_BANG_.call(null, h, b, c)), a);
    }
  }
};
cljs.core.obj_clone = function(a, b) {
  var c;
  c = {};
  for (var d = b.length, e = 0;;) {
    if (e < d) {
      var f = b[e];
      c[f] = a[f];
      e += 1;
    } else {
      break;
    }
  }
  return c;
};
cljs.core.ObjMap = function(a, b, c, d, e) {
  this.meta = a;
  this.keys = b;
  this.strobj = c;
  this.update_count = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 4;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
};
cljs.core.ObjMap.cljs$lang$type = !0;
cljs.core.ObjMap.cljs$lang$ctorStr = "cljs.core/ObjMap";
cljs.core.ObjMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ObjMap");
};
cljs.core.ObjMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return cljs.core.transient$.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, this));
};
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_imap.call(null, this);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys) ? this.strobj[b] : c;
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (goog.isString(b)) {
    if (this.update_count > cljs.core.ObjMap.HASHMAP_THRESHOLD || this.keys.length >= cljs.core.ObjMap.HASHMAP_THRESHOLD) {
      return cljs.core.obj_map__GT_hash_map.call(null, this, b, c);
    }
    if (null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
      return a = cljs.core.obj_clone.call(null, this.strobj, this.keys), a[b] = c, new cljs.core.ObjMap(this.meta, this.keys, a, this.update_count + 1, null);
    }
    a = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    var d = cljs.core.aclone.call(null, this.keys);
    a[b] = c;
    d.push(b);
    return new cljs.core.ObjMap(this.meta, d, a, this.update_count + 1, null);
  }
  return cljs.core.obj_map__GT_hash_map.call(null, this, b, c);
};
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys) ? !0 : !1;
};
cljs.core.ObjMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.ObjMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.ObjMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.ObjMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  for (a = this.keys.sort(cljs.core.obj_map_compare_keys);;) {
    if (cljs.core.seq.call(null, a)) {
      var d = cljs.core.first.call(null, a);
      c = b.call(null, c, d, this.strobj[d]);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      a = cljs.core.rest.call(null, a);
    } else {
      return c;
    }
  }
};
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, this, b);
};
cljs.core.ObjMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  var b = this;
  return 0 < b.keys.length ? cljs.core.map.call(null, function(a) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, b.strobj[a]], null);
  }, b.keys.sort(cljs.core.obj_map_compare_keys)) : null;
};
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.keys.length;
};
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ObjMap(b, this.keys, this.strobj, this.update_count, this.__hash);
};
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.ObjMap.EMPTY, this.meta);
};
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (goog.isString(b) && null != cljs.core.scan_array.call(null, 1, b, this.keys)) {
    var c = cljs.core.aclone.call(null, this.keys), d = cljs.core.obj_clone.call(null, this.strobj, this.keys);
    c.splice(cljs.core.scan_array.call(null, 1, b, c), 1);
    delete d[b];
    return new cljs.core.ObjMap(this.meta, c, d, this.update_count + 1, null);
  }
  return this;
};
cljs.core.__GT_ObjMap = function(a, b, c, d, e) {
  return new cljs.core.ObjMap(a, b, c, d, e);
};
cljs.core.ObjMap.EMPTY = new cljs.core.ObjMap(null, [], function() {
  return{};
}(), 0, 0);
cljs.core.ObjMap.HASHMAP_THRESHOLD = 8;
cljs.core.ObjMap.fromObject = function(a, b) {
  return new cljs.core.ObjMap(null, a, b, 0, null);
};
cljs.core.array_map_index_of_nil_QMARK_ = function(a, b, c) {
  b = a.length;
  for (c = 0;;) {
    if (b <= c) {
      return-1;
    }
    if (null == a[c]) {
      return c;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      c += 2;
    } else {
      return null;
    }
  }
};
cljs.core.array_map_index_of_keyword_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.fqn;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    var e = a[d];
    if (e instanceof cljs.core.Keyword && c === e.fqn) {
      return d;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2;
    } else {
      return null;
    }
  }
};
cljs.core.array_map_index_of_symbol_QMARK_ = function(a, b, c) {
  b = a.length;
  c = c.str;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    var e = a[d];
    if (e instanceof cljs.core.Symbol && c === e.str) {
      return d;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2;
    } else {
      return null;
    }
  }
};
cljs.core.array_map_index_of_identical_QMARK_ = function(a, b, c) {
  b = a.length;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    if (c === a[d]) {
      return d;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2;
    } else {
      return null;
    }
  }
};
cljs.core.array_map_index_of_equiv_QMARK_ = function(a, b, c) {
  b = a.length;
  for (var d = 0;;) {
    if (b <= d) {
      return-1;
    }
    if (cljs.core._EQ_.call(null, c, a[d])) {
      return d;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      d += 2;
    } else {
      return null;
    }
  }
};
cljs.core.array_map_index_of = function(a, b) {
  var c = a.arr;
  return b instanceof cljs.core.Keyword ? cljs.core.array_map_index_of_keyword_QMARK_.call(null, c, a, b) : goog.isString(b) || "number" === typeof b ? cljs.core.array_map_index_of_identical_QMARK_.call(null, c, a, b) : b instanceof cljs.core.Symbol ? cljs.core.array_map_index_of_symbol_QMARK_.call(null, c, a, b) : null == b ? cljs.core.array_map_index_of_nil_QMARK_.call(null, c, a, b) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.array_map_index_of_equiv_QMARK_.call(null, 
  c, a, b) : null;
};
cljs.core.array_map_extend_kv = function(a, b, c) {
  a = a.arr;
  for (var d = a.length, e = Array(d + 2), f = 0;;) {
    if (f < d) {
      e[f] = a[f], f += 1;
    } else {
      break;
    }
  }
  e[d] = b;
  e[d + 1] = c;
  return e;
};
cljs.core.PersistentArrayMapSeq = function(a, b, c) {
  this.arr = a;
  this.i = b;
  this._meta = c;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374990;
};
cljs.core.PersistentArrayMapSeq.cljs$lang$type = !0;
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentArrayMapSeq";
cljs.core.PersistentArrayMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMapSeq");
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : null;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.PersistentArrayMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return(this.arr.length - this.i) / 2;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.arr[this.i], this.arr[this.i + 1]], null);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return this.i < this.arr.length - 2 ? new cljs.core.PersistentArrayMapSeq(this.arr, this.i + 2, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMapSeq(this.arr, this.i, b);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.__GT_PersistentArrayMapSeq = function(a, b, c) {
  return new cljs.core.PersistentArrayMapSeq(a, b, c);
};
cljs.core.persistent_array_map_seq = function(a, b, c) {
  return b <= a.length - 2 ? new cljs.core.PersistentArrayMapSeq(a, b, c) : null;
};
cljs.core.PersistentArrayMap = function(a, b, c, d) {
  this.meta = a;
  this.cnt = b;
  this.arr = c;
  this.__hash = d;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
};
cljs.core.PersistentArrayMap.cljs$lang$type = !0;
cljs.core.PersistentArrayMap.cljs$lang$ctorStr = "cljs.core/PersistentArrayMap";
cljs.core.PersistentArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentArrayMap");
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientArrayMap({}, this.arr.length, cljs.core.aclone.call(null, this.arr));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_imap.call(null, this);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, this, b);
  return-1 === a ? c : this.arr[a + 1];
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = cljs.core.array_map_index_of.call(null, this, b);
  return-1 === a ? this.cnt < cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (c = cljs.core.array_map_extend_kv.call(null, this, b, c), new cljs.core.PersistentArrayMap(this.meta, this.cnt + 1, c, null)) : cljs.core._with_meta.call(null, cljs.core._assoc.call(null, cljs.core.into.call(null, cljs.core.PersistentHashMap.EMPTY, this), b, c), this.meta) : c === this.arr[a + 1] ? this : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (b = cljs.core.aclone.call(null, this.arr), b[a + 1] = c, 
  new cljs.core.PersistentArrayMap(this.meta, this.cnt, b, null)) : null;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return-1 !== cljs.core.array_map_index_of.call(null, this, b);
};
cljs.core.PersistentArrayMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentArrayMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.arr.length;
  for (var d = 0;;) {
    if (d < a) {
      c = b.call(null, c, this.arr[d], this.arr[d + 1]);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      d += 2;
    } else {
      return c;
    }
  }
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, this, b);
};
cljs.core.PersistentArrayMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.persistent_array_map_seq.call(null, this.arr, 0, null);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentArrayMap(b, this.cnt, this.arr, this.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentArrayMap(this.meta, this.cnt, this.arr, this.__hash);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentArrayMap.EMPTY, this.meta);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (0 <= cljs.core.array_map_index_of.call(null, this, b)) {
    var c = this.arr.length, d = c - 2;
    if (0 === d) {
      return cljs.core._empty.call(null, this);
    }
    for (var d = Array(d), e = 0, f = 0;;) {
      if (e >= c) {
        return new cljs.core.PersistentArrayMap(this.meta, this.cnt - 1, d, null);
      }
      if (cljs.core._EQ_.call(null, b, this.arr[e])) {
        e += 2;
      } else {
        if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          d[f] = this.arr[e], d[f + 1] = this.arr[e + 1], f += 2, e += 2;
        } else {
          return null;
        }
      }
    }
  } else {
    return this;
  }
};
cljs.core.__GT_PersistentArrayMap = function(a, b, c, d) {
  return new cljs.core.PersistentArrayMap(a, b, c, d);
};
cljs.core.PersistentArrayMap.EMPTY = new cljs.core.PersistentArrayMap(null, 0, [], null);
cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD = 8;
cljs.core.PersistentArrayMap.fromArray = function(a, b, c) {
  a = b ? a : cljs.core.aclone.call(null, a);
  if (c) {
    return new cljs.core.PersistentArrayMap(null, a.length / 2, a, null);
  }
  c = a.length;
  b = 0;
  for (var d = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);;) {
    if (b < c) {
      var e = b + 2, d = cljs.core._assoc_BANG_.call(null, d, a[b], a[b + 1]);
      b = e;
    } else {
      return cljs.core._persistent_BANG_.call(null, d);
    }
  }
};
cljs.core.TransientArrayMap = function(a, b, c) {
  this.editable_QMARK_ = a;
  this.len = b;
  this.arr = c;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientArrayMap.cljs$lang$type = !0;
cljs.core.TransientArrayMap.cljs$lang$ctorStr = "cljs.core/TransientArrayMap";
cljs.core.TransientArrayMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientArrayMap");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    var c = cljs.core.array_map_index_of.call(null, this, b);
    0 <= c && (this.arr[c] = this.arr[this.len - 2], this.arr[c + 1] = this.arr[this.len - 1], c = this.arr, c.pop(), c.pop(), this.len -= 2);
    return this;
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    a = cljs.core.array_map_index_of.call(null, this, b);
    if (-1 === a) {
      return this.len + 2 <= 2 * cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD ? (this.len += 2, this.arr.push(b), this.arr.push(c), this) : cljs.core.assoc_BANG_.call(null, cljs.core.array__GT_transient_hash_map.call(null, this.len, this.arr), b, c);
    }
    c !== this.arr[a + 1] && (this.arr[a + 1] = c);
    return this;
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    if (b ? b.cljs$lang$protocol_mask$partition0$ & 2048 || b.cljs$core$IMapEntry$ || (b.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, b)) {
      return cljs.core._assoc_BANG_.call(null, this, cljs.core.key.call(null, b), cljs.core.val.call(null, b));
    }
    for (var c = cljs.core.seq.call(null, b), d = this;;) {
      var e = cljs.core.first.call(null, c);
      if (cljs.core.truth_(e)) {
        c = cljs.core.next.call(null, c), d = cljs.core._assoc_BANG_.call(null, d, cljs.core.key.call(null, e), cljs.core.val.call(null, e));
      } else {
        return d;
      }
    }
  } else {
    throw Error("conj! after persistent!");
  }
};
cljs.core.TransientArrayMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return this.editable_QMARK_ = !1, new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, this.len, 2), this.arr, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.TransientArrayMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return a = cljs.core.array_map_index_of.call(null, this, b), -1 === a ? c : this.arr[a + 1];
  }
  throw Error("lookup after persistent!");
};
cljs.core.TransientArrayMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (cljs.core.truth_(this.editable_QMARK_)) {
    return cljs.core.quot.call(null, this.len, 2);
  }
  throw Error("count after persistent!");
};
cljs.core.__GT_TransientArrayMap = function(a, b, c) {
  return new cljs.core.TransientArrayMap(a, b, c);
};
cljs.core.array__GT_transient_hash_map = function(a, b) {
  for (var c = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY), d = 0;;) {
    if (d < a) {
      c = cljs.core.assoc_BANG_.call(null, c, b[d], b[d + 1]), d += 2;
    } else {
      return c;
    }
  }
};
cljs.core.Box = function(a) {
  this.val = a;
};
cljs.core.Box.cljs$lang$type = !0;
cljs.core.Box.cljs$lang$ctorStr = "cljs.core/Box";
cljs.core.Box.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Box");
};
cljs.core.__GT_Box = function(a) {
  return new cljs.core.Box(a);
};
cljs.core.key_test = function(a, b) {
  return a === b ? !0 : cljs.core.keyword_identical_QMARK_.call(null, a, b) ? !0 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core._EQ_.call(null, a, b) : null;
};
cljs.core.mask = function(a, b) {
  return a >>> b & 31;
};
cljs.core.clone_and_set = function() {
  var a = null, b = function(a, b, c) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    return a;
  }, c = function(a, b, c, g, h) {
    a = cljs.core.aclone.call(null, a);
    a[b] = c;
    a[g] = h;
    return a;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.remove_pair = function(a, b) {
  var c = Array(a.length - 2);
  cljs.core.array_copy.call(null, a, 0, c, 0, 2 * b);
  cljs.core.array_copy.call(null, a, 2 * (b + 1), c, 2 * b, c.length - 2 * b);
  return c;
};
cljs.core.bitmap_indexed_node_index = function(a, b) {
  return cljs.core.bit_count.call(null, a & b - 1);
};
cljs.core.bitpos = function(a, b) {
  return 1 << (a >>> b & 31);
};
cljs.core.edit_and_set = function() {
  var a = null, b = function(a, b, c, g) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    return a;
  }, c = function(a, b, c, g, h, k) {
    a = a.ensure_editable(b);
    a.arr[c] = g;
    a.arr[h] = k;
    return a;
  }, a = function(a, e, f, g, h, k) {
    switch(arguments.length) {
      case 4:
        return b.call(this, a, e, f, g);
      case 6:
        return c.call(this, a, e, f, g, h, k);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$4 = b;
  a.cljs$core$IFn$_invoke$arity$6 = c;
  return a;
}();
cljs.core.inode_kv_reduce = function(a, b, c) {
  for (var d = a.length, e = 0;;) {
    if (e < d) {
      var f = a[e];
      null != f ? c = b.call(null, c, f, a[e + 1]) : (f = a[e + 1], c = null != f ? f.kv_reduce(b, c) : c);
      if (cljs.core.reduced_QMARK_.call(null, c)) {
        return cljs.core.deref.call(null, c);
      }
      e += 2;
    } else {
      return c;
    }
  }
};
cljs.core.BitmapIndexedNode = function(a, b, c) {
  this.edit = a;
  this.bitmap = b;
  this.arr = c;
};
cljs.core.BitmapIndexedNode.cljs$lang$type = !0;
cljs.core.BitmapIndexedNode.cljs$lang$ctorStr = "cljs.core/BitmapIndexedNode";
cljs.core.BitmapIndexedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BitmapIndexedNode");
};
cljs.core.BitmapIndexedNode.prototype.edit_and_remove_pair = function(a, b, c) {
  if (this.bitmap === b) {
    return null;
  }
  a = this.ensure_editable(a);
  var d = a.arr, e = d.length;
  a.bitmap ^= b;
  cljs.core.array_copy.call(null, d, 2 * (c + 1), d, 2 * c, e - 2 * (c + 1));
  d[e - 2] = null;
  d[e - 1] = null;
  return a;
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = 1 << (c >>> b & 31), h = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, g);
  if (0 === (this.bitmap & g)) {
    var k = cljs.core.bit_count.call(null, this.bitmap);
    if (2 * k < this.arr.length) {
      return a = this.ensure_editable(a), b = a.arr, f.val = !0, cljs.core.array_copy_downward.call(null, b, 2 * h, b, 2 * (h + 1), 2 * (k - h)), b[2 * h] = d, b[2 * h + 1] = e, a.bitmap |= g, a;
    }
    if (16 <= k) {
      h = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      h[c >>> b & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f);
      for (e = d = 0;;) {
        if (32 > d) {
          0 !== (this.bitmap >>> d & 1) && (h[d] = null != this.arr[e] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, cljs.core.hash.call(null, this.arr[e]), this.arr[e], this.arr[e + 1], f) : this.arr[e + 1], e += 2), d += 1;
        } else {
          break;
        }
      }
      return new cljs.core.ArrayNode(a, k + 1, h);
    }
    return new cljs.core.Keyword(null, "else", "else", 1017020587) ? (b = Array(2 * (k + 4)), cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * h), b[2 * h] = d, b[2 * h + 1] = e, cljs.core.array_copy.call(null, this.arr, 2 * h, b, 2 * (h + 1), 2 * (k - h)), f.val = !0, a = this.ensure_editable(a), a.arr = b, a.bitmap |= g, a) : null;
  }
  k = this.arr[2 * h];
  g = this.arr[2 * h + 1];
  return null == k ? (k = g.inode_assoc_BANG_(a, b + 5, c, d, e, f), k === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, k)) : cljs.core.key_test.call(null, d, k) ? e === g ? this : cljs.core.edit_and_set.call(null, this, a, 2 * h + 1, e) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (f.val = !0, cljs.core.edit_and_set.call(null, this, a, 2 * h, null, 2 * h + 1, cljs.core.create_node.call(null, a, b + 5, k, g, c, d, e))) : null;
};
cljs.core.BitmapIndexedNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr);
};
cljs.core.BitmapIndexedNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = 1 << (c >>> b & 31);
  if (0 === (this.bitmap & f)) {
    return this;
  }
  var g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f), h = this.arr[2 * g], k = this.arr[2 * g + 1];
  return null == h ? (b = k.inode_without_BANG_(a, b + 5, c, d, e), b === k ? this : null != b ? cljs.core.edit_and_set.call(null, this, a, 2 * g + 1, b) : this.bitmap === f ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.edit_and_remove_pair(a, f, g) : null) : cljs.core.key_test.call(null, d, h) ? (e[0] = !0, this.edit_and_remove_pair(a, f, g)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this : null;
};
cljs.core.BitmapIndexedNode.prototype.ensure_editable = function(a) {
  if (a === this.edit) {
    return this;
  }
  var b = cljs.core.bit_count.call(null, this.bitmap), c = Array(0 > b ? 4 : 2 * (b + 1));
  cljs.core.array_copy.call(null, this.arr, 0, c, 0, 2 * b);
  return new cljs.core.BitmapIndexedNode(a, this.bitmap, c);
};
cljs.core.BitmapIndexedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b);
};
cljs.core.BitmapIndexedNode.prototype.inode_find = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & e)) {
    return d;
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_find(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [e, f], null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null;
};
cljs.core.BitmapIndexedNode.prototype.inode_without = function(a, b, c) {
  var d = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & d)) {
    return this;
  }
  var e = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, d), f = this.arr[2 * e], g = this.arr[2 * e + 1];
  return null == f ? (a = g.inode_without(a + 5, b, c), a === g ? this : null != a ? new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * e + 1, a)) : this.bitmap === d ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, this.arr, e)) : null) : cljs.core.key_test.call(null, c, f) ? new cljs.core.BitmapIndexedNode(null, this.bitmap ^ d, cljs.core.remove_pair.call(null, 
  this.arr, e)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this : null;
};
cljs.core.BitmapIndexedNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = 1 << (b >>> a & 31), g = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, f);
  if (0 === (this.bitmap & f)) {
    var h = cljs.core.bit_count.call(null, this.bitmap);
    if (16 <= h) {
      g = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null];
      g[b >>> a & 31] = cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e);
      for (d = c = 0;;) {
        if (32 > c) {
          0 !== (this.bitmap >>> c & 1) && (g[c] = null != this.arr[d] ? cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, cljs.core.hash.call(null, this.arr[d]), this.arr[d], this.arr[d + 1], e) : this.arr[d + 1], d += 2), c += 1;
        } else {
          break;
        }
      }
      return new cljs.core.ArrayNode(null, h + 1, g);
    }
    a = Array(2 * (h + 1));
    cljs.core.array_copy.call(null, this.arr, 0, a, 0, 2 * g);
    a[2 * g] = c;
    a[2 * g + 1] = d;
    cljs.core.array_copy.call(null, this.arr, 2 * g, a, 2 * (g + 1), 2 * (h - g));
    e.val = !0;
    return new cljs.core.BitmapIndexedNode(null, this.bitmap | f, a);
  }
  h = this.arr[2 * g];
  f = this.arr[2 * g + 1];
  return null == h ? (h = f.inode_assoc(a + 5, b, c, d, e), h === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, h))) : cljs.core.key_test.call(null, c, h) ? d === f ? this : new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, this.arr, 2 * g + 1, d)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (e.val = !0, new cljs.core.BitmapIndexedNode(null, this.bitmap, cljs.core.clone_and_set.call(null, 
  this.arr, 2 * g, null, 2 * g + 1, cljs.core.create_node.call(null, a + 5, h, f, b, c, d)))) : null;
};
cljs.core.BitmapIndexedNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = 1 << (b >>> a & 31);
  if (0 === (this.bitmap & e)) {
    return d;
  }
  var f = cljs.core.bitmap_indexed_node_index.call(null, this.bitmap, e), e = this.arr[2 * f], f = this.arr[2 * f + 1];
  return null == e ? f.inode_lookup(a + 5, b, c, d) : cljs.core.key_test.call(null, c, e) ? f : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null;
};
cljs.core.__GT_BitmapIndexedNode = function(a, b, c) {
  return new cljs.core.BitmapIndexedNode(a, b, c);
};
cljs.core.BitmapIndexedNode.EMPTY = new cljs.core.BitmapIndexedNode(null, 0, []);
cljs.core.pack_array_node = function(a, b, c) {
  var d = a.arr;
  a = 2 * (a.cnt - 1);
  for (var e = Array(a), f = 0, g = 1, h = 0;;) {
    if (f < a) {
      f !== c && null != d[f] && (e[g] = d[f], g += 2, h |= 1 << f), f += 1;
    } else {
      return new cljs.core.BitmapIndexedNode(b, h, e);
    }
  }
};
cljs.core.ArrayNode = function(a, b, c) {
  this.edit = a;
  this.cnt = b;
  this.arr = c;
};
cljs.core.ArrayNode.cljs$lang$type = !0;
cljs.core.ArrayNode.cljs$lang$ctorStr = "cljs.core/ArrayNode";
cljs.core.ArrayNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNode");
};
cljs.core.ArrayNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  var g = c >>> b & 31, h = this.arr[g];
  if (null == h) {
    return a = cljs.core.edit_and_set.call(null, this, a, g, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b + 5, c, d, e, f)), a.cnt += 1, a;
  }
  b = h.inode_assoc_BANG_(a, b + 5, c, d, e, f);
  return b === h ? this : cljs.core.edit_and_set.call(null, this, a, g, b);
};
cljs.core.ArrayNode.prototype.inode_seq = function() {
  return cljs.core.create_array_node_seq.call(null, this.arr);
};
cljs.core.ArrayNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  var f = c >>> b & 31, g = this.arr[f];
  if (null == g) {
    return this;
  }
  b = g.inode_without_BANG_(a, b + 5, c, d, e);
  if (b === g) {
    return this;
  }
  if (null == b) {
    if (8 >= this.cnt) {
      return cljs.core.pack_array_node.call(null, this, a, f);
    }
    a = cljs.core.edit_and_set.call(null, this, a, f, b);
    a.cnt -= 1;
    return a;
  }
  return new cljs.core.Keyword(null, "else", "else", 1017020587) ? cljs.core.edit_and_set.call(null, this, a, f, b) : null;
};
cljs.core.ArrayNode.prototype.ensure_editable = function(a) {
  return a === this.edit ? this : new cljs.core.ArrayNode(a, this.cnt, cljs.core.aclone.call(null, this.arr));
};
cljs.core.ArrayNode.prototype.kv_reduce = function(a, b) {
  for (var c = this.arr.length, d = 0, e = b;;) {
    if (d < c) {
      var f = this.arr[d];
      if (null != f && (e = f.kv_reduce(a, e), cljs.core.reduced_QMARK_.call(null, e))) {
        return cljs.core.deref.call(null, e);
      }
      d += 1;
    } else {
      return e;
    }
  }
};
cljs.core.ArrayNode.prototype.inode_find = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_find(a + 5, b, c, d) : d;
};
cljs.core.ArrayNode.prototype.inode_without = function(a, b, c) {
  var d = b >>> a & 31, e = this.arr[d];
  return null != e ? (a = e.inode_without(a + 5, b, c), a === e ? this : null == a ? 8 >= this.cnt ? cljs.core.pack_array_node.call(null, this, null, d) : new cljs.core.ArrayNode(null, this.cnt - 1, cljs.core.clone_and_set.call(null, this.arr, d, a)) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, d, a)) : null) : this;
};
cljs.core.ArrayNode.prototype.inode_assoc = function(a, b, c, d, e) {
  var f = b >>> a & 31, g = this.arr[f];
  if (null == g) {
    return new cljs.core.ArrayNode(null, this.cnt + 1, cljs.core.clone_and_set.call(null, this.arr, f, cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a + 5, b, c, d, e)));
  }
  a = g.inode_assoc(a + 5, b, c, d, e);
  return a === g ? this : new cljs.core.ArrayNode(null, this.cnt, cljs.core.clone_and_set.call(null, this.arr, f, a));
};
cljs.core.ArrayNode.prototype.inode_lookup = function(a, b, c, d) {
  var e = this.arr[b >>> a & 31];
  return null != e ? e.inode_lookup(a + 5, b, c, d) : d;
};
cljs.core.__GT_ArrayNode = function(a, b, c) {
  return new cljs.core.ArrayNode(a, b, c);
};
cljs.core.hash_collision_node_find_index = function(a, b, c) {
  b *= 2;
  for (var d = 0;;) {
    if (d < b) {
      if (cljs.core.key_test.call(null, c, a[d])) {
        return d;
      }
      d += 2;
    } else {
      return-1;
    }
  }
};
cljs.core.HashCollisionNode = function(a, b, c, d) {
  this.edit = a;
  this.collision_hash = b;
  this.cnt = c;
  this.arr = d;
};
cljs.core.HashCollisionNode.cljs$lang$type = !0;
cljs.core.HashCollisionNode.cljs$lang$ctorStr = "cljs.core/HashCollisionNode";
cljs.core.HashCollisionNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/HashCollisionNode");
};
cljs.core.HashCollisionNode.prototype.inode_assoc_BANG_ = function(a, b, c, d, e, f) {
  if (c === this.collision_hash) {
    b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
    if (-1 === b) {
      if (this.arr.length > 2 * this.cnt) {
        return a = cljs.core.edit_and_set.call(null, this, a, 2 * this.cnt, d, 2 * this.cnt + 1, e), f.val = !0, a.cnt += 1, a;
      }
      b = this.arr.length;
      c = Array(b + 2);
      cljs.core.array_copy.call(null, this.arr, 0, c, 0, b);
      c[b] = d;
      c[b + 1] = e;
      f.val = !0;
      return this.ensure_editable_array(a, this.cnt + 1, c);
    }
    return this.arr[b + 1] === e ? this : cljs.core.edit_and_set.call(null, this, a, b + 1, e);
  }
  return(new cljs.core.BitmapIndexedNode(a, 1 << (this.collision_hash >>> b & 31), [null, this, null, null])).inode_assoc_BANG_(a, b, c, d, e, f);
};
cljs.core.HashCollisionNode.prototype.inode_seq = function() {
  return cljs.core.create_inode_seq.call(null, this.arr);
};
cljs.core.HashCollisionNode.prototype.inode_without_BANG_ = function(a, b, c, d, e) {
  b = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, d);
  if (-1 === b) {
    return this;
  }
  e[0] = !0;
  if (1 === this.cnt) {
    return null;
  }
  a = this.ensure_editable(a);
  e = a.arr;
  e[b] = e[2 * this.cnt - 2];
  e[b + 1] = e[2 * this.cnt - 1];
  e[2 * this.cnt - 1] = null;
  e[2 * this.cnt - 2] = null;
  a.cnt -= 1;
  return a;
};
cljs.core.HashCollisionNode.prototype.ensure_editable = function(a) {
  if (a === this.edit) {
    return this;
  }
  var b = Array(2 * (this.cnt + 1));
  cljs.core.array_copy.call(null, this.arr, 0, b, 0, 2 * this.cnt);
  return new cljs.core.HashCollisionNode(a, this.collision_hash, this.cnt, b);
};
cljs.core.HashCollisionNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.inode_kv_reduce.call(null, this.arr, a, b);
};
cljs.core.HashCollisionNode.prototype.inode_find = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.arr[a], this.arr[a + 1]], null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null;
};
cljs.core.HashCollisionNode.prototype.inode_without = function(a, b, c) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return-1 === a ? this : 1 === this.cnt ? null : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt - 1, cljs.core.remove_pair.call(null, this.arr, cljs.core.quot.call(null, a, 2))) : null;
};
cljs.core.HashCollisionNode.prototype.inode_assoc = function(a, b, c, d, e) {
  return b === this.collision_hash ? (a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c), -1 === a ? (a = 2 * this.cnt, b = Array(a + 2), cljs.core.array_copy.call(null, this.arr, 0, b, 0, a), b[a] = c, b[a + 1] = d, e.val = !0, new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt + 1, b)) : cljs.core._EQ_.call(null, this.arr[a], d) ? this : new cljs.core.HashCollisionNode(null, this.collision_hash, this.cnt, cljs.core.clone_and_set.call(null, this.arr, 
  a + 1, d))) : (new cljs.core.BitmapIndexedNode(null, 1 << (this.collision_hash >>> a & 31), [null, this])).inode_assoc(a, b, c, d, e);
};
cljs.core.HashCollisionNode.prototype.inode_lookup = function(a, b, c, d) {
  a = cljs.core.hash_collision_node_find_index.call(null, this.arr, this.cnt, c);
  return 0 > a ? d : cljs.core.key_test.call(null, c, this.arr[a]) ? this.arr[a + 1] : new cljs.core.Keyword(null, "else", "else", 1017020587) ? d : null;
};
cljs.core.HashCollisionNode.prototype.ensure_editable_array = function(a, b, c) {
  return a === this.edit ? (this.arr = c, this.cnt = b, this) : new cljs.core.HashCollisionNode(this.edit, this.collision_hash, b, c);
};
cljs.core.__GT_HashCollisionNode = function(a, b, c, d) {
  return new cljs.core.HashCollisionNode(a, b, c, d);
};
cljs.core.create_node = function() {
  var a = null, b = function(a, b, c, g, h, k) {
    var l = cljs.core.hash.call(null, b);
    if (l === g) {
      return new cljs.core.HashCollisionNode(null, l, 2, [b, c, h, k]);
    }
    var m = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc(a, l, b, c, m).inode_assoc(a, g, h, k, m);
  }, c = function(a, b, c, g, h, k, l) {
    var m = cljs.core.hash.call(null, c);
    if (m === h) {
      return new cljs.core.HashCollisionNode(null, m, 2, [c, g, k, l]);
    }
    var n = new cljs.core.Box(!1);
    return cljs.core.BitmapIndexedNode.EMPTY.inode_assoc_BANG_(a, b, m, c, g, n).inode_assoc_BANG_(a, b, h, k, l, n);
  }, a = function(a, e, f, g, h, k, l) {
    switch(arguments.length) {
      case 6:
        return b.call(this, a, e, f, g, h, k);
      case 7:
        return c.call(this, a, e, f, g, h, k, l);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$6 = b;
  a.cljs$core$IFn$_invoke$arity$7 = c;
  return a;
}();
cljs.core.NodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.NodeSeq.cljs$lang$type = !0;
cljs.core.NodeSeq.cljs$lang$ctorStr = "cljs.core/NodeSeq";
cljs.core.NodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/NodeSeq");
};
cljs.core.NodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.NodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.NodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.NodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == this.s ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.nodes[this.i], this.nodes[this.i + 1]], null) : cljs.core.first.call(null, this.s);
};
cljs.core.NodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null == this.s ? cljs.core.create_inode_seq.call(null, this.nodes, this.i + 2, null) : cljs.core.create_inode_seq.call(null, this.nodes, this.i, cljs.core.next.call(null, this.s));
};
cljs.core.NodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.NodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.NodeSeq(b, this.nodes, this.i, this.s, this.__hash);
};
cljs.core.NodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.NodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_NodeSeq = function(a, b, c, d, e) {
  return new cljs.core.NodeSeq(a, b, c, d, e);
};
cljs.core.create_inode_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0, null);
  }, c = function(a, b, c) {
    if (null == c) {
      for (c = a.length;;) {
        if (b < c) {
          if (null != a[b]) {
            return new cljs.core.NodeSeq(null, a, b, null, null);
          }
          var g = a[b + 1];
          if (cljs.core.truth_(g) && (g = g.inode_seq(), cljs.core.truth_(g))) {
            return new cljs.core.NodeSeq(null, a, b + 2, g, null);
          }
          b += 2;
        } else {
          return null;
        }
      }
    } else {
      return new cljs.core.NodeSeq(null, a, b, c, null);
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ArrayNodeSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.nodes = b;
  this.i = c;
  this.s = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374860;
};
cljs.core.ArrayNodeSeq.cljs$lang$type = !0;
cljs.core.ArrayNodeSeq.cljs$lang$ctorStr = "cljs.core/ArrayNodeSeq";
cljs.core.ArrayNodeSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ArrayNodeSeq");
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ArrayNodeSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.first.call(null, this.s);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return cljs.core.create_array_node_seq.call(null, null, this.nodes, this.i, cljs.core.next.call(null, this.s));
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ArrayNodeSeq(b, this.nodes, this.i, this.s, this.__hash);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_ArrayNodeSeq = function(a, b, c, d, e) {
  return new cljs.core.ArrayNodeSeq(a, b, c, d, e);
};
cljs.core.create_array_node_seq = function() {
  var a = null, b = function(b) {
    return a.call(null, null, b, 0, null);
  }, c = function(a, b, c, g) {
    if (null == g) {
      for (g = b.length;;) {
        if (c < g) {
          var h = b[c];
          if (cljs.core.truth_(h) && (h = h.inode_seq(), cljs.core.truth_(h))) {
            return new cljs.core.ArrayNodeSeq(a, b, c + 1, h, null);
          }
          c += 1;
        } else {
          return null;
        }
      }
    } else {
      return new cljs.core.ArrayNodeSeq(a, b, c, g, null);
    }
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
cljs.core.PersistentHashMap = function(a, b, c, d, e, f) {
  this.meta = a;
  this.cnt = b;
  this.root = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.__hash = f;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
  this.cljs$lang$protocol_mask$partition0$ = 16123663;
};
cljs.core.PersistentHashMap.cljs$lang$type = !0;
cljs.core.PersistentHashMap.cljs$lang$ctorStr = "cljs.core/PersistentHashMap";
cljs.core.PersistentHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashMap");
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashMap({}, this.root, this.cnt, this.has_nil_QMARK_, this.nil_val);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_imap.call(null, this);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c) : null;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  if (null == b) {
    return this.has_nil_QMARK_ && c === this.nil_val ? this : new cljs.core.PersistentHashMap(this.meta, this.has_nil_QMARK_ ? this.cnt : this.cnt + 1, this.root, !0, c, null);
  }
  a = new cljs.core.Box(!1);
  b = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc(0, cljs.core.hash.call(null, b), b, c, a);
  return b === this.root ? this : new cljs.core.PersistentHashMap(this.meta, a.val ? this.cnt + 1 : this.cnt, b, this.has_nil_QMARK_, this.nil_val, null);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ : null == this.root ? !1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, cljs.core.lookup_sentinel) !== cljs.core.lookup_sentinel : null;
};
cljs.core.PersistentHashMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentHashMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  a = this.has_nil_QMARK_ ? b.call(null, c, null, this.nil_val) : c;
  return cljs.core.reduced_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : null != this.root ? this.root.kv_reduce(b, a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null;
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, this, b);
};
cljs.core.PersistentHashMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? (a = null != this.root ? this.root.inode_seq() : null, this.has_nil_QMARK_ ? cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, this.nil_val], null), a) : a) : null;
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashMap(b, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentHashMap(this.meta, this.cnt, this.root, this.has_nil_QMARK_, this.nil_val, this.__hash);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentHashMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core._with_meta.call(null, cljs.core.PersistentHashMap.EMPTY, this.meta);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  if (null == b) {
    return this.has_nil_QMARK_ ? new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, this.root, !1, null, null) : this;
  }
  if (null == this.root) {
    return this;
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    var c = this.root.inode_without(0, cljs.core.hash.call(null, b), b);
    return c === this.root ? this : new cljs.core.PersistentHashMap(this.meta, this.cnt - 1, c, this.has_nil_QMARK_, this.nil_val, null);
  }
  return null;
};
cljs.core.__GT_PersistentHashMap = function(a, b, c, d, e, f) {
  return new cljs.core.PersistentHashMap(a, b, c, d, e, f);
};
cljs.core.PersistentHashMap.EMPTY = new cljs.core.PersistentHashMap(null, 0, null, !1, null, 0);
cljs.core.PersistentHashMap.fromArrays = function(a, b) {
  for (var c = a.length, d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
    if (d < c) {
      var f = d + 1, e = cljs.core._assoc_BANG_.call(null, e, a[d], b[d]), d = f
    } else {
      return cljs.core.persistent_BANG_.call(null, e);
    }
  }
};
cljs.core.TransientHashMap = function(a, b, c, d, e) {
  this.edit = a;
  this.root = b;
  this.count = c;
  this.has_nil_QMARK_ = d;
  this.nil_val = e;
  this.cljs$lang$protocol_mask$partition1$ = 56;
  this.cljs$lang$protocol_mask$partition0$ = 258;
};
cljs.core.TransientHashMap.cljs$lang$type = !0;
cljs.core.TransientHashMap.cljs$lang$ctorStr = "cljs.core/TransientHashMap";
cljs.core.TransientHashMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashMap");
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientMap$_dissoc_BANG_$arity$2 = function(a, b) {
  return this.without_BANG_(b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientAssociative$_assoc_BANG_$arity$3 = function(a, b, c) {
  return this.assoc_BANG_(b, c);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  return this.conj_BANG_(b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return this.persistent_BANG_();
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : null : null == this.root ? null : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b);
};
cljs.core.TransientHashMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return null == b ? this.has_nil_QMARK_ ? this.nil_val : c : null == this.root ? c : this.root.inode_lookup(0, cljs.core.hash.call(null, b), b, c);
};
cljs.core.TransientHashMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  if (this.edit) {
    return this.count;
  }
  throw Error("count after persistent!");
};
cljs.core.TransientHashMap.prototype.conj_BANG_ = function(a) {
  if (this.edit) {
    if (a ? a.cljs$lang$protocol_mask$partition0$ & 2048 || a.cljs$core$IMapEntry$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMapEntry, a)) {
      return this.assoc_BANG_(cljs.core.key.call(null, a), cljs.core.val.call(null, a));
    }
    a = cljs.core.seq.call(null, a);
    for (var b = this;;) {
      var c = cljs.core.first.call(null, a);
      if (cljs.core.truth_(c)) {
        a = cljs.core.next.call(null, a), b = b.assoc_BANG_(cljs.core.key.call(null, c), cljs.core.val.call(null, c));
      } else {
        return b;
      }
    }
  } else {
    throw Error("conj! after persistent");
  }
};
cljs.core.TransientHashMap.prototype.assoc_BANG_ = function(a, b) {
  if (this.edit) {
    if (null == a) {
      this.nil_val !== b && (this.nil_val = b), this.has_nil_QMARK_ || (this.count += 1, this.has_nil_QMARK_ = !0);
    } else {
      var c = new cljs.core.Box(!1), d = (null == this.root ? cljs.core.BitmapIndexedNode.EMPTY : this.root).inode_assoc_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b, c);
      d !== this.root && (this.root = d);
      c.val && (this.count += 1);
    }
    return this;
  }
  throw Error("assoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.without_BANG_ = function(a) {
  if (this.edit) {
    if (null == a) {
      this.has_nil_QMARK_ && (this.has_nil_QMARK_ = !1, this.nil_val = null, this.count -= 1);
    } else {
      if (null != this.root) {
        var b = new cljs.core.Box(!1);
        a = this.root.inode_without_BANG_(this.edit, 0, cljs.core.hash.call(null, a), a, b);
        a !== this.root && (this.root = a);
        cljs.core.truth_(b[0]) && (this.count -= 1);
      }
    }
    return this;
  }
  throw Error("dissoc! after persistent!");
};
cljs.core.TransientHashMap.prototype.persistent_BANG_ = function() {
  if (this.edit) {
    return this.edit = null, new cljs.core.PersistentHashMap(null, this.count, this.root, this.has_nil_QMARK_, this.nil_val, null);
  }
  throw Error("persistent! called twice");
};
cljs.core.__GT_TransientHashMap = function(a, b, c, d, e) {
  return new cljs.core.TransientHashMap(a, b, c, d, e);
};
cljs.core.tree_map_seq_push = function(a, b, c) {
  for (var d = b;;) {
    if (null != a) {
      b = c ? a.left : a.right, d = cljs.core.conj.call(null, d, a), a = b;
    } else {
      return d;
    }
  }
};
cljs.core.PersistentTreeMapSeq = function(a, b, c, d, e) {
  this.meta = a;
  this.stack = b;
  this.ascending_QMARK_ = c;
  this.cnt = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374862;
};
cljs.core.PersistentTreeMapSeq.cljs$lang$type = !0;
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorStr = "cljs.core/PersistentTreeMapSeq";
cljs.core.PersistentTreeMapSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMapSeq");
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.PersistentTreeMapSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 0 > this.cnt ? cljs.core.count.call(null, cljs.core.next.call(null, this)) + 1 : this.cnt;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return cljs.core.peek.call(null, this.stack);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = cljs.core.first.call(null, this.stack);
  a = cljs.core.tree_map_seq_push.call(null, this.ascending_QMARK_ ? a.right : a.left, cljs.core.next.call(null, this.stack), this.ascending_QMARK_);
  return null != a ? new cljs.core.PersistentTreeMapSeq(null, a, this.ascending_QMARK_, this.cnt - 1, null) : cljs.core.List.EMPTY;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMapSeq(b, this.stack, this.ascending_QMARK_, this.cnt, this.__hash);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_PersistentTreeMapSeq = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMapSeq(a, b, c, d, e);
};
cljs.core.create_tree_map_seq = function(a, b, c) {
  return new cljs.core.PersistentTreeMapSeq(null, cljs.core.tree_map_seq_push.call(null, a, null, b), b, c, null);
};
cljs.core.balance_left = function(a, b, c, d) {
  return c instanceof cljs.core.RedNode ? c.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, c.left.blacken(), new cljs.core.BlackNode(a, b, c.right, d, null), null) : c.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.right.key, c.right.val, new cljs.core.BlackNode(c.key, c.val, c.left, c.right.left, null), new cljs.core.BlackNode(a, b, c.right.right, d, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a, b, c, d, 
  null) : null : new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.balance_right = function(a, b, c, d) {
  return d instanceof cljs.core.RedNode ? d.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(a, b, c, d.left, null), d.right.blacken(), null) : d.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), new cljs.core.BlackNode(d.key, d.val, d.left.right, d.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a, b, c, d, null) : 
  null : new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.balance_left_del = function(a, b, c, d) {
  if (c instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c.blacken(), d, null);
  }
  if (d instanceof cljs.core.BlackNode) {
    return cljs.core.balance_right.call(null, a, b, c, d.redden());
  }
  if (d instanceof cljs.core.RedNode && d.left instanceof cljs.core.BlackNode) {
    return new cljs.core.RedNode(d.left.key, d.left.val, new cljs.core.BlackNode(a, b, c, d.left.left, null), cljs.core.balance_right.call(null, d.key, d.val, d.left.right, d.right.redden()), null);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("red-black tree invariant violation");
  }
  return null;
};
cljs.core.balance_right_del = function(a, b, c, d) {
  if (d instanceof cljs.core.RedNode) {
    return new cljs.core.RedNode(a, b, c, d.blacken(), null);
  }
  if (c instanceof cljs.core.BlackNode) {
    return cljs.core.balance_left.call(null, a, b, c.redden(), d);
  }
  if (c instanceof cljs.core.RedNode && c.right instanceof cljs.core.BlackNode) {
    return new cljs.core.RedNode(c.right.key, c.right.val, cljs.core.balance_left.call(null, c.key, c.val, c.left.redden(), c.right.left), new cljs.core.BlackNode(a, b, c.right.right, d, null), null);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error("red-black tree invariant violation");
  }
  return null;
};
cljs.core.tree_map_kv_reduce = function tree_map_kv_reduce(b, c, d) {
  d = null != b.left ? tree_map_kv_reduce.call(null, b.left, c, d) : d;
  if (cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d);
  }
  d = c.call(null, d, b.key, b.val);
  if (cljs.core.reduced_QMARK_.call(null, d)) {
    return cljs.core.deref.call(null, d);
  }
  b = null != b.right ? tree_map_kv_reduce.call(null, b.right, c, d) : d;
  return cljs.core.reduced_QMARK_.call(null, b) ? cljs.core.deref.call(null, b) : b;
};
cljs.core.BlackNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.BlackNode.cljs$lang$type = !0;
cljs.core.BlackNode.cljs$lang$ctorStr = "cljs.core/BlackNode";
cljs.core.BlackNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/BlackNode");
};
cljs.core.BlackNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.BlackNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b, c);
};
cljs.core.BlackNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.BlackNode.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.BlackNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.BlackNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val, b], null);
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key;
};
cljs.core.BlackNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val;
};
cljs.core.BlackNode.prototype.add_right = function(a) {
  return a.balance_right(this);
};
cljs.core.BlackNode.prototype.redden = function() {
  return new cljs.core.RedNode(this.key, this.val, this.left, this.right, null);
};
cljs.core.BlackNode.prototype.remove_right = function(a) {
  return cljs.core.balance_right_del.call(null, this.key, this.val, this.left, a);
};
cljs.core.BlackNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.BlackNode(a, b, c, d, null);
};
cljs.core.BlackNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b);
};
cljs.core.BlackNode.prototype.remove_left = function(a) {
  return cljs.core.balance_left_del.call(null, this.key, this.val, a, this.right);
};
cljs.core.BlackNode.prototype.add_left = function(a) {
  return a.balance_left(this);
};
cljs.core.BlackNode.prototype.balance_left = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, this, a.right, null);
};
cljs.core.BlackNode.prototype.balance_right = function(a) {
  return new cljs.core.BlackNode(a.key, a.val, a.left, this, null);
};
cljs.core.BlackNode.prototype.blacken = function() {
  return this;
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.BlackNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, this.val), this.key);
};
cljs.core.BlackNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val;
};
cljs.core.BlackNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key], null);
};
cljs.core.BlackNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, b, c);
};
cljs.core.BlackNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.BlackNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b);
};
cljs.core.BlackNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null;
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (0 === b) {
    return this.key;
  }
  if (1 === b) {
    return this.val;
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null;
};
cljs.core.BlackNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null;
};
cljs.core.BlackNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.__GT_BlackNode = function(a, b, c, d, e) {
  return new cljs.core.BlackNode(a, b, c, d, e);
};
cljs.core.RedNode = function(a, b, c, d, e) {
  this.key = a;
  this.val = b;
  this.left = c;
  this.right = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32402207;
};
cljs.core.RedNode.cljs$lang$type = !0;
cljs.core.RedNode.cljs$lang$ctorStr = "cljs.core/RedNode";
cljs.core.RedNode.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/RedNode");
};
cljs.core.RedNode.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._nth.call(null, this, b, null);
};
cljs.core.RedNode.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._nth.call(null, this, b, c);
};
cljs.core.RedNode.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  return cljs.core.assoc.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b, c);
};
cljs.core.RedNode.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.RedNode.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.RedNode.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.RedNode.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val, b], null);
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_key$arity$1 = function(a) {
  return this.key;
};
cljs.core.RedNode.prototype.cljs$core$IMapEntry$_val$arity$1 = function(a) {
  return this.val;
};
cljs.core.RedNode.prototype.add_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null);
};
cljs.core.RedNode.prototype.redden = function() {
  throw Error("red-black tree invariant violation");
};
cljs.core.RedNode.prototype.remove_right = function(a) {
  return new cljs.core.RedNode(this.key, this.val, this.left, a, null);
};
cljs.core.RedNode.prototype.replace = function(a, b, c, d) {
  return new cljs.core.RedNode(a, b, c, d, null);
};
cljs.core.RedNode.prototype.kv_reduce = function(a, b) {
  return cljs.core.tree_map_kv_reduce.call(null, this, a, b);
};
cljs.core.RedNode.prototype.remove_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null);
};
cljs.core.RedNode.prototype.add_left = function(a) {
  return new cljs.core.RedNode(this.key, this.val, a, this.right, null);
};
cljs.core.RedNode.prototype.balance_left = function(a) {
  return this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, this.left.blacken(), new cljs.core.BlackNode(a.key, a.val, this.right, a.right, null), null) : this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.right.key, this.right.val, new cljs.core.BlackNode(this.key, this.val, this.left, this.right.left, null), new cljs.core.BlackNode(a.key, a.val, this.right.right, a.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a.key, 
  a.val, this, a.right, null) : null;
};
cljs.core.RedNode.prototype.balance_right = function(a) {
  return this.right instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.key, this.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left, null), this.right.blacken(), null) : this.left instanceof cljs.core.RedNode ? new cljs.core.RedNode(this.left.key, this.left.val, new cljs.core.BlackNode(a.key, a.val, a.left, this.left.left, null), new cljs.core.BlackNode(this.key, this.val, this.left.right, this.right, null), null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? new cljs.core.BlackNode(a.key, 
  a.val, a.left, this, null) : null;
};
cljs.core.RedNode.prototype.blacken = function() {
  return new cljs.core.BlackNode(this.key, this.val, this.left, this.right, null);
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.RedNode.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.RedNode.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core._conj.call(null, cljs.core._conj.call(null, cljs.core.List.EMPTY, this.val), this.key);
};
cljs.core.RedNode.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return 2;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_peek$arity$1 = function(a) {
  return this.val;
};
cljs.core.RedNode.prototype.cljs$core$IStack$_pop$arity$1 = function(a) {
  return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key], null);
};
cljs.core.RedNode.prototype.cljs$core$IVector$_assoc_n$arity$3 = function(a, b, c) {
  return(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null)).cljs$core$IVector$_assoc_n$arity$3(null, b, c);
};
cljs.core.RedNode.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.RedNode.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return cljs.core.with_meta.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [this.key, this.val], null), b);
};
cljs.core.RedNode.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return null;
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (0 === b) {
    return this.key;
  }
  if (1 === b) {
    return this.val;
  }
  new cljs.core.Keyword(null, "else", "else", 1017020587);
  return null;
};
cljs.core.RedNode.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return 0 === b ? this.key : 1 === b ? this.val : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c : null;
};
cljs.core.RedNode.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.PersistentVector.EMPTY;
};
cljs.core.__GT_RedNode = function(a, b, c, d, e) {
  return new cljs.core.RedNode(a, b, c, d, e);
};
cljs.core.tree_map_add = function tree_map_add(b, c, d, e, f) {
  if (null == c) {
    return new cljs.core.RedNode(d, e, null, null, null);
  }
  var g = b.call(null, d, c.key);
  return 0 === g ? (f[0] = c, null) : 0 > g ? (b = tree_map_add.call(null, b, c.left, d, e, f), null != b ? c.add_left(b) : null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (b = tree_map_add.call(null, b, c.right, d, e, f), null != b ? c.add_right(b) : null) : null;
};
cljs.core.tree_map_append = function tree_map_append(b, c) {
  if (null == b) {
    return c;
  }
  if (null == c) {
    return b;
  }
  if (b instanceof cljs.core.RedNode) {
    if (c instanceof cljs.core.RedNode) {
      var d = tree_map_append.call(null, b.right, c.left);
      return d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.RedNode(b.key, b.val, b.left, d.left, null), new cljs.core.RedNode(c.key, c.val, d.right, c.right, null), null) : new cljs.core.RedNode(b.key, b.val, b.left, new cljs.core.RedNode(c.key, c.val, d, c.right, null), null);
    }
    return new cljs.core.RedNode(b.key, b.val, b.left, tree_map_append.call(null, b.right, c), null);
  }
  return c instanceof cljs.core.RedNode ? new cljs.core.RedNode(c.key, c.val, tree_map_append.call(null, b, c.left), c.right, null) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? (d = tree_map_append.call(null, b.right, c.left), d instanceof cljs.core.RedNode ? new cljs.core.RedNode(d.key, d.val, new cljs.core.BlackNode(b.key, b.val, b.left, d.left, null), new cljs.core.BlackNode(c.key, c.val, d.right, c.right, null), null) : cljs.core.balance_left_del.call(null, b.key, b.val, b.left, 
  new cljs.core.BlackNode(c.key, c.val, d, c.right, null))) : null;
};
cljs.core.tree_map_remove = function tree_map_remove(b, c, d, e) {
  if (null != c) {
    var f = b.call(null, d, c.key);
    if (0 === f) {
      return e[0] = c, cljs.core.tree_map_append.call(null, c.left, c.right);
    }
    if (0 > f) {
      return b = tree_map_remove.call(null, b, c.left, d, e), null != b || null != e[0] ? c.left instanceof cljs.core.BlackNode ? cljs.core.balance_left_del.call(null, c.key, c.val, b, c.right) : new cljs.core.RedNode(c.key, c.val, b, c.right, null) : null;
    }
    if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
      return b = tree_map_remove.call(null, b, c.right, d, e), null != b || null != e[0] ? c.right instanceof cljs.core.BlackNode ? cljs.core.balance_right_del.call(null, c.key, c.val, c.left, b) : new cljs.core.RedNode(c.key, c.val, c.left, b, null) : null;
    }
  }
  return null;
};
cljs.core.tree_map_replace = function tree_map_replace(b, c, d, e) {
  var f = c.key, g = b.call(null, d, f);
  return 0 === g ? c.replace(f, e, c.left, c.right) : 0 > g ? c.replace(f, c.val, tree_map_replace.call(null, b, c.left, d, e), c.right) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? c.replace(f, c.val, c.left, tree_map_replace.call(null, b, c.right, d, e)) : null;
};
cljs.core.PersistentTreeMap = function(a, b, c, d, e) {
  this.comp = a;
  this.tree = b;
  this.cnt = c;
  this.meta = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 418776847;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeMap.cljs$lang$type = !0;
cljs.core.PersistentTreeMap.cljs$lang$ctorStr = "cljs.core/PersistentTreeMap";
cljs.core.PersistentTreeMap.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeMap");
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_imap.call(null, this);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.entry_at(b);
  return null != a ? a.val : c;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_assoc$arity$3 = function(a, b, c) {
  a = [null];
  var d = cljs.core.tree_map_add.call(null, this.comp, this.tree, b, c, a);
  return null == d ? (a = cljs.core.nth.call(null, a, 0), cljs.core._EQ_.call(null, c, a.val) ? this : new cljs.core.PersistentTreeMap(this.comp, cljs.core.tree_map_replace.call(null, this.comp, this.tree, b, c), this.cnt, this.meta, null)) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt + 1, this.meta, null);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = function(a, b) {
  return null != this.entry_at(b);
};
cljs.core.PersistentTreeMap.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentTreeMap.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = function(a, b, c) {
  return null != this.tree ? cljs.core.tree_map_kv_reduce.call(null, this.tree, b, c) : c;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.vector_QMARK_.call(null, b) ? cljs.core._assoc.call(null, this, cljs.core._nth.call(null, b, 0), cljs.core._nth.call(null, b, 1)) : cljs.core.reduce.call(null, cljs.core._conj, this, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !1, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeMap.prototype.entry_at = function(a) {
  for (var b = this.tree;;) {
    if (null != b) {
      var c = this.comp.call(null, a, b.key);
      if (0 === c) {
        return b;
      }
      if (0 > c) {
        b = b.left;
      } else {
        if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
          b = b.right;
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, b, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  if (0 < this.cnt) {
    a = null;
    for (var d = this.tree;;) {
      if (null != d) {
        var e = this.comp.call(null, b, d.key);
        if (0 === e) {
          return new cljs.core.PersistentTreeMapSeq(null, cljs.core.conj.call(null, a, d), c, -1, null);
        }
        if (cljs.core.truth_(c)) {
          0 > e ? (a = cljs.core.conj.call(null, a, d), d = d.left) : d = d.right;
        } else {
          if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
            0 < e ? (a = cljs.core.conj.call(null, a, d), d = d.right) : d = d.left;
          } else {
            return null;
          }
        }
      } else {
        return null == a ? null : new cljs.core.PersistentTreeMapSeq(null, a, c, -1, null);
      }
    }
  } else {
    return null;
  }
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return cljs.core.key.call(null, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return this.comp;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.cnt ? cljs.core.create_tree_map_seq.call(null, this.tree, !0, this.cnt) : null;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return this.cnt;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_map.call(null, this, b);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, b, this.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentTreeMap(this.comp, this.tree, this.cnt, this.meta, this.__hash);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeMap.EMPTY, this.meta);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IMap$_dissoc$arity$2 = function(a, b) {
  var c = [null], d = cljs.core.tree_map_remove.call(null, this.comp, this.tree, b, c);
  return null == d ? null == cljs.core.nth.call(null, c, 0) ? this : new cljs.core.PersistentTreeMap(this.comp, null, 0, this.meta, null) : new cljs.core.PersistentTreeMap(this.comp, d.blacken(), this.cnt - 1, this.meta, null);
};
cljs.core.__GT_PersistentTreeMap = function(a, b, c, d, e) {
  return new cljs.core.PersistentTreeMap(a, b, c, d, e);
};
cljs.core.PersistentTreeMap.EMPTY = new cljs.core.PersistentTreeMap(cljs.core.compare, null, 0, null, 0);
cljs.core.hash_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for (var b = cljs.core.transient$.call(null, cljs.core.PersistentHashMap.EMPTY);;) {
      if (a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc_BANG_.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e;
      } else {
        return cljs.core.persistent_BANG_.call(null, b);
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.array_map = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, cljs.core.quot.call(null, cljs.core.count.call(null, a), 2), cljs.core.apply.call(null, cljs.core.array, a), null);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.obj_map = function() {
  var a = function(a) {
    var b = [], e;
    e = {};
    for (a = cljs.core.seq.call(null, a);;) {
      if (a) {
        b.push(cljs.core.first.call(null, a)), e[cljs.core.first.call(null, a)] = cljs.core.second.call(null, a), a = cljs.core.nnext.call(null, a);
      } else {
        return cljs.core.ObjMap.fromObject.call(null, b, e);
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_map = function() {
  var a = function(a) {
    a = cljs.core.seq.call(null, a);
    for (var b = cljs.core.PersistentTreeMap.EMPTY;;) {
      if (a) {
        var e = cljs.core.nnext.call(null, a), b = cljs.core.assoc.call(null, b, cljs.core.first.call(null, a), cljs.core.second.call(null, a));
        a = e;
      } else {
        return b;
      }
    }
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_map_by = function() {
  var a = function(a, b) {
    for (var e = cljs.core.seq.call(null, b), f = new cljs.core.PersistentTreeMap(cljs.core.fn__GT_comparator.call(null, a), null, 0, null, 0);;) {
      if (e) {
        var g = cljs.core.nnext.call(null, e), f = cljs.core.assoc.call(null, f, cljs.core.first.call(null, e), cljs.core.second.call(null, e)), e = g
      } else {
        return f;
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.KeySeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.KeySeq.cljs$lang$type = !0;
cljs.core.KeySeq.cljs$lang$ctorStr = "cljs.core/KeySeq";
cljs.core.KeySeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/KeySeq");
};
cljs.core.KeySeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, this);
};
cljs.core.KeySeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.KeySeq(a, this._meta);
};
cljs.core.KeySeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.KeySeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.KeySeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.KeySeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._key.call(null, a);
};
cljs.core.KeySeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.KeySeq(a, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.KeySeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.KeySeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.KeySeq(this.mseq, b);
};
cljs.core.KeySeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.KeySeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.__GT_KeySeq = function(a, b) {
  return new cljs.core.KeySeq(a, b);
};
cljs.core.keys = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.KeySeq(a, null) : null;
};
cljs.core.key = function(a) {
  return cljs.core._key.call(null, a);
};
cljs.core.ValSeq = function(a, b) {
  this.mseq = a;
  this._meta = b;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 32374988;
};
cljs.core.ValSeq.cljs$lang$type = !0;
cljs.core.ValSeq.cljs$lang$ctorStr = "cljs.core/ValSeq";
cljs.core.ValSeq.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ValSeq");
};
cljs.core.ValSeq.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return cljs.core.hash_coll.call(null, this);
};
cljs.core.ValSeq.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null == a ? null : new cljs.core.ValSeq(a, this._meta);
};
cljs.core.ValSeq.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.ValSeq.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.seq_reduce.call(null, b, this);
};
cljs.core.ValSeq.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.seq_reduce.call(null, b, c, this);
};
cljs.core.ValSeq.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return this;
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  a = cljs.core._first.call(null, this.mseq);
  return cljs.core._val.call(null, a);
};
cljs.core.ValSeq.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  a = ((a = this.mseq) ? a.cljs$lang$protocol_mask$partition0$ & 128 || a.cljs$core$INext$ || (a.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.INext, a)) ? cljs.core._next.call(null, this.mseq) : cljs.core.next.call(null, this.mseq);
  return null != a ? new cljs.core.ValSeq(a, this._meta) : cljs.core.List.EMPTY;
};
cljs.core.ValSeq.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.ValSeq.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.ValSeq(this.mseq, b);
};
cljs.core.ValSeq.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this._meta;
};
cljs.core.ValSeq.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this._meta);
};
cljs.core.__GT_ValSeq = function(a, b) {
  return new cljs.core.ValSeq(a, b);
};
cljs.core.vals = function(a) {
  return(a = cljs.core.seq.call(null, a)) ? new cljs.core.ValSeq(a, null) : null;
};
cljs.core.val = function(a) {
  return cljs.core._val.call(null, a);
};
cljs.core.merge = function() {
  var a = function(a) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, a)) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.conj.call(null, cljs.core.truth_(a) ? a : cljs.core.PersistentArrayMap.EMPTY, b);
    }, a) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.merge_with = function() {
  var a = function(a, b) {
    if (cljs.core.truth_(cljs.core.some.call(null, cljs.core.identity, b))) {
      var e = function(a) {
        return function(b, c) {
          return cljs.core.reduce.call(null, a, cljs.core.truth_(b) ? b : cljs.core.PersistentArrayMap.EMPTY, cljs.core.seq.call(null, c));
        };
      }(function(b, d) {
        var e = cljs.core.first.call(null, d), k = cljs.core.second.call(null, d);
        return cljs.core.contains_QMARK_.call(null, b, e) ? cljs.core.assoc.call(null, b, e, a.call(null, cljs.core.get.call(null, b, e), k)) : cljs.core.assoc.call(null, b, e, k);
      });
      return cljs.core.reduce.call(null, e, b);
    }
    return null;
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.select_keys = function(a, b) {
  for (var c = cljs.core.PersistentArrayMap.EMPTY, d = cljs.core.seq.call(null, b);;) {
    if (d) {
      var e = cljs.core.first.call(null, d), f = cljs.core.get.call(null, a, e, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", 4155500789)), c = cljs.core.not_EQ_.call(null, f, new cljs.core.Keyword("cljs.core", "not-found", "cljs.core/not-found", 4155500789)) ? cljs.core.assoc.call(null, c, e, f) : c, d = cljs.core.next.call(null, d)
    } else {
      return c;
    }
  }
};
cljs.core.PersistentHashSet = function(a, b, c) {
  this.meta = a;
  this.hash_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition1$ = 8196;
  this.cljs$lang$protocol_mask$partition0$ = 15077647;
};
cljs.core.PersistentHashSet.cljs$lang$type = !0;
cljs.core.PersistentHashSet.cljs$lang$ctorStr = "cljs.core/PersistentHashSet";
cljs.core.PersistentHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentHashSet");
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEditableCollection$_as_transient$arity$1 = function(a) {
  return new cljs.core.TransientHashSet(cljs.core._as_transient.call(null, this.hash_map));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_iset.call(null, this);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._contains_key_QMARK_.call(null, this.hash_map, b) ? b : c;
};
cljs.core.PersistentHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentHashSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core.assoc.call(null, this.hash_map, b, null), null);
};
cljs.core.PersistentHashSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(this.meta, cljs.core._dissoc.call(null, this.hash_map, b), null);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core._count.call(null, this.hash_map);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.set_QMARK_.call(null, b) && cljs.core.count.call(null, c) === cljs.core.count.call(null, b) && cljs.core.every_QMARK_.call(null, function(a) {
    return cljs.core.contains_QMARK_.call(null, c, a);
  }, b);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentHashSet(b, this.hash_map, this.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(this.meta, this.hash_map, this.__hash);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentHashSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentHashSet.EMPTY, this.meta);
};
cljs.core.__GT_PersistentHashSet = function(a, b, c) {
  return new cljs.core.PersistentHashSet(a, b, c);
};
cljs.core.PersistentHashSet.EMPTY = new cljs.core.PersistentHashSet(null, cljs.core.PersistentArrayMap.EMPTY, 0);
cljs.core.PersistentHashSet.fromArray = function(a, b) {
  var c = a.length;
  if (c <= cljs.core.PersistentArrayMap.HASHMAP_THRESHOLD) {
    b || cljs.core.aclone.call(null, a);
    for (var d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY);;) {
      if (d < c) {
        var f = d + 1, e = cljs.core._assoc_BANG_.call(null, e, a[d], null), d = f
      } else {
        return new cljs.core.PersistentHashSet(null, cljs.core._persistent_BANG_.call(null, e), null);
      }
    }
  } else {
    for (d = 0, e = cljs.core.transient$.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if (d < c) {
        f = d + 1, e = cljs.core._conj_BANG_.call(null, e, a[d]), d = f;
      } else {
        return cljs.core._persistent_BANG_.call(null, e);
      }
    }
  }
};
cljs.core.TransientHashSet = function(a) {
  this.transient_map = a;
  this.cljs$lang$protocol_mask$partition0$ = 259;
  this.cljs$lang$protocol_mask$partition1$ = 136;
};
cljs.core.TransientHashSet.cljs$lang$type = !0;
cljs.core.TransientHashSet.cljs$lang$ctorStr = "cljs.core/TransientHashSet";
cljs.core.TransientHashSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/TransientHashSet");
};
cljs.core.TransientHashSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        var e;
        e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : c;
        return e;
      case 3:
        return e = cljs.core._lookup.call(null, this.transient_map, c, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? d : c, e;
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.TransientHashSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return cljs.core._lookup.call(null, this.transient_map, a, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? null : a;
};
cljs.core.TransientHashSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this.transient_map, a, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? b : a;
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.TransientHashSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  return cljs.core._lookup.call(null, this.transient_map, b, cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel ? c : b;
};
cljs.core.TransientHashSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.transient_map);
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientSet$_disjoin_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.dissoc_BANG_.call(null, this.transient_map, b);
  return this;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_conj_BANG_$arity$2 = function(a, b) {
  this.transient_map = cljs.core.assoc_BANG_.call(null, this.transient_map, b, null);
  return this;
};
cljs.core.TransientHashSet.prototype.cljs$core$ITransientCollection$_persistent_BANG_$arity$1 = function(a) {
  return new cljs.core.PersistentHashSet(null, cljs.core.persistent_BANG_.call(null, this.transient_map), null);
};
cljs.core.__GT_TransientHashSet = function(a) {
  return new cljs.core.TransientHashSet(a);
};
cljs.core.PersistentTreeSet = function(a, b, c) {
  this.meta = a;
  this.tree_map = b;
  this.__hash = c;
  this.cljs$lang$protocol_mask$partition0$ = 417730831;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.PersistentTreeSet.cljs$lang$type = !0;
cljs.core.PersistentTreeSet.cljs$lang$ctorStr = "cljs.core/PersistentTreeSet";
cljs.core.PersistentTreeSet.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/PersistentTreeSet");
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_iset.call(null, this);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$2 = function(a, b) {
  return cljs.core._lookup.call(null, this, b, null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ILookup$_lookup$arity$3 = function(a, b, c) {
  a = this.tree_map.entry_at(b);
  return null != a ? a.key : c;
};
cljs.core.PersistentTreeSet.prototype.call = function() {
  var a = null;
  return a = function(a, c, d) {
    switch(arguments.length) {
      case 2:
        return this.cljs$core$ILookup$_lookup$arity$2(null, c);
      case 3:
        return this.cljs$core$ILookup$_lookup$arity$3(null, c, d);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
}();
cljs.core.PersistentTreeSet.prototype.apply = function(a, b) {
  return this.call.apply(this, [this].concat(cljs.core.aclone.call(null, b)));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$1 = function(a) {
  return this.cljs$core$ILookup$_lookup$arity$2(null, a);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
  return this.cljs$core$ILookup$_lookup$arity$3(null, a, b);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.assoc.call(null, this.tree_map, b, null), null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IReversible$_rseq$arity$1 = function(a) {
  return 0 < cljs.core.count.call(null, this.tree_map) ? cljs.core.map.call(null, cljs.core.key, cljs.core.rseq.call(null, this.tree_map)) : null;
};
cljs.core.PersistentTreeSet.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq$arity$2 = function(a, b) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq.call(null, this.tree_map, b));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_sorted_seq_from$arity$3 = function(a, b, c) {
  return cljs.core.map.call(null, cljs.core.key, cljs.core._sorted_seq_from.call(null, this.tree_map, b, c));
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_entry_key$arity$2 = function(a, b) {
  return b;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISorted$_comparator$arity$1 = function(a) {
  return cljs.core._comparator.call(null, this.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return cljs.core.keys.call(null, this.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ISet$_disjoin$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(this.meta, cljs.core.dissoc.call(null, this.tree_map, b), null);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.count.call(null, this.tree_map);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  var c = this;
  return cljs.core.set_QMARK_.call(null, b) && cljs.core.count.call(null, c) === cljs.core.count.call(null, b) && cljs.core.every_QMARK_.call(null, function(a) {
    return cljs.core.contains_QMARK_.call(null, c, a);
  }, b);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.PersistentTreeSet(b, this.tree_map, this.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.PersistentTreeSet(this.meta, this.tree_map, this.__hash);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.PersistentTreeSet.EMPTY, this.meta);
};
cljs.core.__GT_PersistentTreeSet = function(a, b, c) {
  return new cljs.core.PersistentTreeSet(a, b, c);
};
cljs.core.PersistentTreeSet.EMPTY = new cljs.core.PersistentTreeSet(null, cljs.core.PersistentTreeMap.EMPTY, 0);
cljs.core.set_from_indexed_seq = function(a) {
  a = a.arr;
  a: {
    for (var b = 0, c = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if (b < a.length) {
        var d = b + 1, c = cljs.core._conj_BANG_.call(null, c, a[b]), b = d
      } else {
        a = c;
        break a;
      }
    }
    a = void 0;
  }
  return cljs.core._persistent_BANG_.call(null, a);
};
cljs.core.set = function(a) {
  a = cljs.core.seq.call(null, a);
  if (null == a) {
    return cljs.core.PersistentHashSet.EMPTY;
  }
  if (a instanceof cljs.core.IndexedSeq && 0 === a.i) {
    return cljs.core.set_from_indexed_seq.call(null, a);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    for (var b = cljs.core._as_transient.call(null, cljs.core.PersistentHashSet.EMPTY);;) {
      if (null != a) {
        var c = cljs.core._next.call(null, a), b = cljs.core._conj_BANG_.call(null, b, cljs.core._first.call(null, a));
        a = c;
      } else {
        return cljs.core._persistent_BANG_.call(null, b);
      }
    }
  } else {
    return null;
  }
};
cljs.core.hash_set = function() {
  var a = null, b = function() {
    return cljs.core.PersistentHashSet.EMPTY;
  }, c = function() {
    var a = function(a) {
      return cljs.core.set.call(null, a);
    }, b = function(b) {
      var c = null;
      0 < arguments.length && (c = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return a.call(this, c);
    };
    b.cljs$lang$maxFixedArity = 0;
    b.cljs$lang$applyTo = function(b) {
      b = cljs.core.seq(b);
      return a(b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(cljs.core.array_seq(arguments, 0));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 0;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.sorted_set = function() {
  var a = function(a) {
    return cljs.core.reduce.call(null, cljs.core._conj, cljs.core.PersistentTreeSet.EMPTY, a);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.sorted_set_by = function() {
  var a = function(a, b) {
    return cljs.core.reduce.call(null, cljs.core._conj, new cljs.core.PersistentTreeSet(null, cljs.core.sorted_map_by.call(null, a), 0), b);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.replace = function(a, b) {
  if (cljs.core.vector_QMARK_.call(null, b)) {
    var c = cljs.core.count.call(null, b);
    return cljs.core.reduce.call(null, function(b, c) {
      var f = cljs.core.find.call(null, a, cljs.core.nth.call(null, b, c));
      return cljs.core.truth_(f) ? cljs.core.assoc.call(null, b, c, cljs.core.second.call(null, f)) : b;
    }, b, cljs.core.take.call(null, c, cljs.core.iterate.call(null, cljs.core.inc, 0)));
  }
  return cljs.core.map.call(null, function(b) {
    var c = cljs.core.find.call(null, a, b);
    return cljs.core.truth_(c) ? cljs.core.second.call(null, c) : b;
  }, b);
};
cljs.core.distinct = function(a) {
  return function c(a, e) {
    return new cljs.core.LazySeq(null, function() {
      return function(a, d) {
        for (;;) {
          var e = a, k = cljs.core.nth.call(null, e, 0, null);
          if (e = cljs.core.seq.call(null, e)) {
            if (cljs.core.contains_QMARK_.call(null, d, k)) {
              k = cljs.core.rest.call(null, e), e = d, a = k, d = e;
            } else {
              return cljs.core.cons.call(null, k, c.call(null, cljs.core.rest.call(null, e), cljs.core.conj.call(null, d, k)));
            }
          } else {
            return null;
          }
        }
      }.call(null, a, e);
    }, null, null);
  }.call(null, a, cljs.core.PersistentHashSet.EMPTY);
};
cljs.core.butlast = function(a) {
  for (var b = cljs.core.PersistentVector.EMPTY;;) {
    if (cljs.core.next.call(null, a)) {
      b = cljs.core.conj.call(null, b, cljs.core.first.call(null, a)), a = cljs.core.next.call(null, a);
    } else {
      return cljs.core.seq.call(null, b);
    }
  }
};
cljs.core.name = function(a) {
  if (a && (a.cljs$lang$protocol_mask$partition1$ & 4096 || a.cljs$core$INamed$)) {
    return cljs.core._name.call(null, a);
  }
  if ("string" === typeof a) {
    return a;
  }
  throw Error([cljs.core.str("Doesn't support name: "), cljs.core.str(a)].join(""));
};
cljs.core.zipmap = function(a, b) {
  for (var c = cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), d = cljs.core.seq.call(null, a), e = cljs.core.seq.call(null, b);;) {
    if (d && e) {
      c = cljs.core.assoc_BANG_.call(null, c, cljs.core.first.call(null, d), cljs.core.first.call(null, e)), d = cljs.core.next.call(null, d), e = cljs.core.next.call(null, e);
    } else {
      return cljs.core.persistent_BANG_.call(null, c);
    }
  }
};
cljs.core.max_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) > a.call(null, c) ? b : c;
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d);
      }, a.call(null, b, c, d), e);
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b;
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.min_key = function() {
  var a = null, b = function(a, b, c) {
    return a.call(null, b) < a.call(null, c) ? b : c;
  }, c = function() {
    var b = function(b, c, d, e) {
      return cljs.core.reduce.call(null, function(c, d) {
        return a.call(null, b, c, d);
      }, a.call(null, b, c, d), e);
    }, c = function(a, c, e, k) {
      var l = null;
      3 < arguments.length && (l = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return b.call(this, a, c, e, l);
    };
    c.cljs$lang$maxFixedArity = 3;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.next(a);
      var k = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, k, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f, g) {
    switch(arguments.length) {
      case 2:
        return e;
      case 3:
        return b.call(this, a, e, f);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, f, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = function(a, b) {
    return b;
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.partition_all = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, b, c);
  }, c = function(b, c, f) {
    return new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? cljs.core.cons.call(null, cljs.core.take.call(null, b, g), a.call(null, b, c, cljs.core.drop.call(null, c, g))) : null;
    }, null, null);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.take_while = function take_while(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.truth_(b.call(null, cljs.core.first.call(null, d))) ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_while.call(null, b, cljs.core.rest.call(null, d))) : null : null;
  }, null, null);
};
cljs.core.mk_bound_fn = function(a, b, c) {
  return function(d) {
    var e = cljs.core._comparator.call(null, a);
    return b.call(null, e.call(null, cljs.core._entry_key.call(null, a, d), c), 0);
  };
};
cljs.core.subseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._GT_, cljs.core._GT__EQ_], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !0), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !0));
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, c, !0);
    if (cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, g, h), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, b, c).call(null, l)) ? k : cljs.core.next.call(null, k));
    }
    return null;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.rsubseq = function() {
  var a = null, b = function(a, b, c) {
    var g = cljs.core.mk_bound_fn.call(null, a, b, c);
    return cljs.core.truth_(cljs.core.PersistentHashSet.fromArray([cljs.core._LT_, cljs.core._LT__EQ_], !0).call(null, b)) ? (a = cljs.core._sorted_seq_from.call(null, a, c, !1), cljs.core.truth_(a) ? (b = cljs.core.nth.call(null, a, 0, null), cljs.core.truth_(g.call(null, b)) ? a : cljs.core.next.call(null, a)) : null) : cljs.core.take_while.call(null, g, cljs.core._sorted_seq.call(null, a, !1));
  }, c = function(a, b, c, g, h) {
    var k = cljs.core._sorted_seq_from.call(null, a, h, !1);
    if (cljs.core.truth_(k)) {
      var l = cljs.core.nth.call(null, k, 0, null);
      return cljs.core.take_while.call(null, cljs.core.mk_bound_fn.call(null, a, b, c), cljs.core.truth_(cljs.core.mk_bound_fn.call(null, a, g, h).call(null, l)) ? k : cljs.core.next.call(null, k));
    }
    return null;
  }, a = function(a, e, f, g, h) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 5:
        return c.call(this, a, e, f, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$5 = c;
  return a;
}();
cljs.core.Range = function(a, b, c, d, e) {
  this.meta = a;
  this.start = b;
  this.end = c;
  this.step = d;
  this.__hash = e;
  this.cljs$lang$protocol_mask$partition0$ = 32375006;
  this.cljs$lang$protocol_mask$partition1$ = 8192;
};
cljs.core.Range.cljs$lang$type = !0;
cljs.core.Range.cljs$lang$ctorStr = "cljs.core/Range";
cljs.core.Range.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Range");
};
cljs.core.Range.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  a = this.__hash;
  return null != a ? a : this.__hash = a = cljs.core.hash_coll.call(null, this);
};
cljs.core.Range.prototype.cljs$core$INext$_next$arity$1 = function(a) {
  return 0 < this.step ? this.start + this.step < this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null : this.start + this.step > this.end ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : null;
};
cljs.core.Range.prototype.cljs$core$ICollection$_conj$arity$2 = function(a, b) {
  return cljs.core.cons.call(null, b, this);
};
cljs.core.Range.prototype.toString = function() {
  return cljs.core.pr_str_STAR_.call(null, this);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$2 = function(a, b) {
  return cljs.core.ci_reduce.call(null, this, b);
};
cljs.core.Range.prototype.cljs$core$IReduce$_reduce$arity$3 = function(a, b, c) {
  return cljs.core.ci_reduce.call(null, this, b, c);
};
cljs.core.Range.prototype.cljs$core$ISeqable$_seq$arity$1 = function(a) {
  return 0 < this.step ? this.start < this.end ? this : null : this.start > this.end ? this : null;
};
cljs.core.Range.prototype.cljs$core$ICounted$_count$arity$1 = function(a) {
  return cljs.core.not.call(null, cljs.core._seq.call(null, this)) ? 0 : Math.ceil((this.end - this.start) / this.step);
};
cljs.core.Range.prototype.cljs$core$ISeq$_first$arity$1 = function(a) {
  return null == cljs.core._seq.call(null, this) ? null : this.start;
};
cljs.core.Range.prototype.cljs$core$ISeq$_rest$arity$1 = function(a) {
  return null != cljs.core._seq.call(null, this) ? new cljs.core.Range(this.meta, this.start + this.step, this.end, this.step, null) : cljs.core.List.EMPTY;
};
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return cljs.core.equiv_sequential.call(null, this, b);
};
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = function(a, b) {
  return new cljs.core.Range(b, this.start, this.end, this.step, this.__hash);
};
cljs.core.Range.prototype.cljs$core$ICloneable$_clone$arity$1 = function(a) {
  return new cljs.core.Range(this.meta, this.start, this.end, this.step, this.__hash);
};
cljs.core.Range.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$2 = function(a, b) {
  if (b < cljs.core._count.call(null, this)) {
    return this.start + b * this.step;
  }
  if (this.start > this.end && 0 === this.step) {
    return this.start;
  }
  throw Error("Index out of bounds");
};
cljs.core.Range.prototype.cljs$core$IIndexed$_nth$arity$3 = function(a, b, c) {
  return b < cljs.core._count.call(null, this) ? this.start + b * this.step : this.start > this.end && 0 === this.step ? this.start : c;
};
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty$arity$1 = function(a) {
  return cljs.core.with_meta.call(null, cljs.core.List.EMPTY, this.meta);
};
cljs.core.__GT_Range = function(a, b, c, d, e) {
  return new cljs.core.Range(a, b, c, d, e);
};
cljs.core.range = function() {
  var a = null, b = function() {
    return a.call(null, 0, Number.MAX_VALUE, 1);
  }, c = function(b) {
    return a.call(null, 0, b, 1);
  }, d = function(b, c) {
    return a.call(null, b, c, 1);
  }, e = function(a, b, c) {
    return new cljs.core.Range(null, a, b, c, null);
  }, a = function(a, g, h) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
      case 2:
        return d.call(this, a, g);
      case 3:
        return e.call(this, a, g, h);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  a.cljs$core$IFn$_invoke$arity$2 = d;
  a.cljs$core$IFn$_invoke$arity$3 = e;
  return a;
}();
cljs.core.take_nth = function take_nth(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    return d ? cljs.core.cons.call(null, cljs.core.first.call(null, d), take_nth.call(null, b, cljs.core.drop.call(null, b, d))) : null;
  }, null, null);
};
cljs.core.split_with = function(a, b) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.take_while.call(null, a, b), cljs.core.drop_while.call(null, a, b)], null);
};
cljs.core.partition_by = function partition_by(b, c) {
  return new cljs.core.LazySeq(null, function() {
    var d = cljs.core.seq.call(null, c);
    if (d) {
      var e = cljs.core.first.call(null, d), f = b.call(null, e), e = cljs.core.cons.call(null, e, cljs.core.take_while.call(null, function(c, d) {
        return function(c) {
          return cljs.core._EQ_.call(null, d, b.call(null, c));
        };
      }(e, f), cljs.core.next.call(null, d)));
      return cljs.core.cons.call(null, e, partition_by.call(null, b, cljs.core.seq.call(null, cljs.core.drop.call(null, cljs.core.count.call(null, e), d))));
    }
    return null;
  }, null, null);
};
cljs.core.frequencies = function(a) {
  return cljs.core.persistent_BANG_.call(null, cljs.core.reduce.call(null, function(a, c) {
    return cljs.core.assoc_BANG_.call(null, a, c, cljs.core.get.call(null, a, c, 0) + 1);
  }, cljs.core.transient$.call(null, cljs.core.PersistentArrayMap.EMPTY), a));
};
cljs.core.reductions = function() {
  var a = null, b = function(b, c) {
    return new cljs.core.LazySeq(null, function() {
      var f = cljs.core.seq.call(null, c);
      return f ? a.call(null, b, cljs.core.first.call(null, f), cljs.core.rest.call(null, f)) : cljs.core._conj.call(null, cljs.core.List.EMPTY, b.call(null));
    }, null, null);
  }, c = function(b, c, f) {
    return cljs.core.cons.call(null, c, new cljs.core.LazySeq(null, function() {
      var g = cljs.core.seq.call(null, f);
      return g ? a.call(null, b, b.call(null, c, cljs.core.first.call(null, g)), cljs.core.rest.call(null, g)) : null;
    }, null, null));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.juxt = function() {
  var a = null, b = function(a) {
    return function() {
      var b = null, c = function() {
        var b = function(b, c, d, e) {
          return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, b, c, d, e)], null);
        }, c = function(a, c, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return b.call(this, a, c, d, f);
        };
        c.cljs$lang$maxFixedArity = 3;
        c.cljs$lang$applyTo = function(a) {
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return b(c, d, e, a);
        };
        c.cljs$core$IFn$_invoke$arity$variadic = b;
        return c;
      }(), b = function(b, d, e, g) {
        switch(arguments.length) {
          case 0:
            return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null)], null);
          case 1:
            return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b)], null);
          case 2:
            return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b, d)], null);
          case 3:
            return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, b, d, e)], null);
          default:
            return c.cljs$core$IFn$_invoke$arity$variadic(b, d, e, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      b.cljs$lang$maxFixedArity = 3;
      b.cljs$lang$applyTo = c.cljs$lang$applyTo;
      return b;
    }();
  }, c = function(a, b) {
    return function() {
      var c = null, d = function() {
        var c = function(c, d, e, h) {
          return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, c, d, e, h), cljs.core.apply.call(null, b, c, d, e, h)], null);
        }, d = function(a, b, d, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return c.call(this, a, b, d, f);
        };
        d.cljs$lang$maxFixedArity = 3;
        d.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var d = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return c(b, d, e, a);
        };
        d.cljs$core$IFn$_invoke$arity$variadic = c;
        return d;
      }(), c = function(c, e, h, r) {
        switch(arguments.length) {
          case 0:
            return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null), b.call(null)], null);
          case 1:
            return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c), b.call(null, c)], null);
          case 2:
            return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c, e), b.call(null, c, e)], null);
          case 3:
            return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, c, e, h), b.call(null, c, e, h)], null);
          default:
            return d.cljs$core$IFn$_invoke$arity$variadic(c, e, h, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      c.cljs$lang$maxFixedArity = 3;
      c.cljs$lang$applyTo = d.cljs$lang$applyTo;
      return c;
    }();
  }, d = function(a, b, c) {
    return function() {
      var d = null, e = function() {
        var d = function(d, e, k, l) {
          return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.apply.call(null, a, d, e, k, l), cljs.core.apply.call(null, b, d, e, k, l), cljs.core.apply.call(null, c, d, e, k, l)], null);
        }, e = function(a, b, c, e) {
          var f = null;
          3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
          return d.call(this, a, b, c, f);
        };
        e.cljs$lang$maxFixedArity = 3;
        e.cljs$lang$applyTo = function(a) {
          var b = cljs.core.first(a);
          a = cljs.core.next(a);
          var c = cljs.core.first(a);
          a = cljs.core.next(a);
          var e = cljs.core.first(a);
          a = cljs.core.rest(a);
          return d(b, c, e, a);
        };
        e.cljs$core$IFn$_invoke$arity$variadic = d;
        return e;
      }(), d = function(d, k, r, p) {
        switch(arguments.length) {
          case 0:
            return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null), b.call(null), c.call(null)], null);
          case 1:
            return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d), b.call(null, d), c.call(null, d)], null);
          case 2:
            return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d, k), b.call(null, d, k), c.call(null, d, k)], null);
          case 3:
            return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [a.call(null, d, k, r), b.call(null, d, k, r), c.call(null, d, k, r)], null);
          default:
            return e.cljs$core$IFn$_invoke$arity$variadic(d, k, r, cljs.core.array_seq(arguments, 3));
        }
        throw Error("Invalid arity: " + arguments.length);
      };
      d.cljs$lang$maxFixedArity = 3;
      d.cljs$lang$applyTo = e.cljs$lang$applyTo;
      return d;
    }();
  }, e = function() {
    var a = function(a, b, c, d) {
      var e = cljs.core.list_STAR_.call(null, a, b, c, d);
      return function() {
        var a = null, b = function() {
          return cljs.core.reduce.call(null, function(a, b) {
            return cljs.core.conj.call(null, a, b.call(null));
          }, cljs.core.PersistentVector.EMPTY, e);
        }, c = function(a) {
          return cljs.core.reduce.call(null, function(b, c) {
            return cljs.core.conj.call(null, b, c.call(null, a));
          }, cljs.core.PersistentVector.EMPTY, e);
        }, d = function(a, b) {
          return cljs.core.reduce.call(null, function(c, d) {
            return cljs.core.conj.call(null, c, d.call(null, a, b));
          }, cljs.core.PersistentVector.EMPTY, e);
        }, f = function(a, b, c) {
          return cljs.core.reduce.call(null, function(d, e) {
            return cljs.core.conj.call(null, d, e.call(null, a, b, c));
          }, cljs.core.PersistentVector.EMPTY, e);
        }, g = function() {
          var a = function(a, b, c, d) {
            return cljs.core.reduce.call(null, function(e, f) {
              return cljs.core.conj.call(null, e, cljs.core.apply.call(null, f, a, b, c, d));
            }, cljs.core.PersistentVector.EMPTY, e);
          }, b = function(b, c, d, e) {
            var f = null;
            3 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
            return a.call(this, b, c, d, f);
          };
          b.cljs$lang$maxFixedArity = 3;
          b.cljs$lang$applyTo = function(b) {
            var c = cljs.core.first(b);
            b = cljs.core.next(b);
            var d = cljs.core.first(b);
            b = cljs.core.next(b);
            var e = cljs.core.first(b);
            b = cljs.core.rest(b);
            return a(c, d, e, b);
          };
          b.cljs$core$IFn$_invoke$arity$variadic = a;
          return b;
        }(), a = function(a, e, h, k) {
          switch(arguments.length) {
            case 0:
              return b.call(this);
            case 1:
              return c.call(this, a);
            case 2:
              return d.call(this, a, e);
            case 3:
              return f.call(this, a, e, h);
            default:
              return g.cljs$core$IFn$_invoke$arity$variadic(a, e, h, cljs.core.array_seq(arguments, 3));
          }
          throw Error("Invalid arity: " + arguments.length);
        };
        a.cljs$lang$maxFixedArity = 3;
        a.cljs$lang$applyTo = g.cljs$lang$applyTo;
        return a;
      }();
    }, b = function(b, c, d, e) {
      var g = null;
      3 < arguments.length && (g = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3), 0));
      return a.call(this, b, c, d, g);
    };
    b.cljs$lang$maxFixedArity = 3;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, g, h, k) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, g);
      case 3:
        return d.call(this, a, g, h);
      default:
        return e.cljs$core$IFn$_invoke$arity$variadic(a, g, h, cljs.core.array_seq(arguments, 3));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 3;
  a.cljs$lang$applyTo = e.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$3 = d;
  a.cljs$core$IFn$_invoke$arity$variadic = e.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.dorun = function() {
  var a = null, b = function(a) {
    for (;;) {
      if (cljs.core.seq.call(null, a)) {
        a = cljs.core.next.call(null, a);
      } else {
        return null;
      }
    }
  }, c = function(a, b) {
    for (;;) {
      if (cljs.core.seq.call(null, b) && 0 < a) {
        var c = a - 1, g = cljs.core.next.call(null, b);
        a = c;
        b = g;
      } else {
        return null;
      }
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.doall = function() {
  var a = null, b = function(a) {
    cljs.core.dorun.call(null, a);
    return a;
  }, c = function(a, b) {
    cljs.core.dorun.call(null, a, b);
    return b;
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.regexp_QMARK_ = function(a) {
  return a instanceof RegExp;
};
cljs.core.re_matches = function(a, b) {
  var c = a.exec(b);
  return cljs.core._EQ_.call(null, cljs.core.first.call(null, c), b) ? 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c) : null;
};
cljs.core.re_find = function(a, b) {
  var c = a.exec(b);
  return null == c ? null : 1 === cljs.core.count.call(null, c) ? cljs.core.first.call(null, c) : cljs.core.vec.call(null, c);
};
cljs.core.re_seq = function re_seq(b, c) {
  var d = cljs.core.re_find.call(null, b, c), e = c.search(b), f = cljs.core.coll_QMARK_.call(null, d) ? cljs.core.first.call(null, d) : d, g = cljs.core.subs.call(null, c, e + cljs.core.count.call(null, f));
  return cljs.core.truth_(d) ? new cljs.core.LazySeq(null, function() {
    return cljs.core.cons.call(null, d, cljs.core.seq.call(null, g) ? re_seq.call(null, b, g) : null);
  }, null, null) : null;
};
cljs.core.re_pattern = function(a) {
  var b = cljs.core.re_find.call(null, /^(?:\(\?([idmsux]*)\))?(.*)/, a);
  cljs.core.nth.call(null, b, 0, null);
  a = cljs.core.nth.call(null, b, 1, null);
  b = cljs.core.nth.call(null, b, 2, null);
  return RegExp(b, a);
};
cljs.core.pr_sequential_writer = function(a, b, c, d, e, f, g) {
  var h = cljs.core._STAR_print_level_STAR_;
  try {
    cljs.core._STAR_print_level_STAR_ = null == cljs.core._STAR_print_level_STAR_ ? null : cljs.core._STAR_print_level_STAR_ - 1;
    if (null != cljs.core._STAR_print_level_STAR_ && 0 > cljs.core._STAR_print_level_STAR_) {
      return cljs.core._write.call(null, a, "#");
    }
    cljs.core._write.call(null, a, c);
    cljs.core.seq.call(null, g) && b.call(null, cljs.core.first.call(null, g), a, f);
    for (var k = cljs.core.next.call(null, g), l = (new cljs.core.Keyword(null, "print-length", "print-length", 3960797560)).cljs$core$IFn$_invoke$arity$1(f);k && (null == l || 0 !== l);) {
      cljs.core._write.call(null, a, d);
      b.call(null, cljs.core.first.call(null, k), a, f);
      var m = cljs.core.next.call(null, k);
      c = l - 1;
      k = m;
      l = c;
    }
    cljs.core.truth_((new cljs.core.Keyword(null, "print-length", "print-length", 3960797560)).cljs$core$IFn$_invoke$arity$1(f)) && (cljs.core._write.call(null, a, d), b.call(null, "...", a, f));
    return cljs.core._write.call(null, a, e);
  } finally {
    cljs.core._STAR_print_level_STAR_ = h;
  }
};
cljs.core.write_all = function() {
  var a = function(a, b) {
    for (var e = cljs.core.seq.call(null, b), f = null, g = 0, h = 0;;) {
      if (h < g) {
        var k = cljs.core._nth.call(null, f, h);
        cljs.core._write.call(null, a, k);
        h += 1;
      } else {
        if (e = cljs.core.seq.call(null, e)) {
          f = e, cljs.core.chunked_seq_QMARK_.call(null, f) ? (e = cljs.core.chunk_first.call(null, f), g = cljs.core.chunk_rest.call(null, f), f = e, k = cljs.core.count.call(null, e), e = g, g = k) : (k = cljs.core.first.call(null, f), cljs.core._write.call(null, a, k), e = cljs.core.next.call(null, f), f = null, g = 0), h = 0;
        } else {
          return null;
        }
      }
    }
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.string_print = function(a) {
  cljs.core._STAR_print_fn_STAR_.call(null, a);
  return null;
};
cljs.core.flush = function() {
  return null;
};
cljs.core.char_escapes = function() {
  return{'"':'\\"', "\\":"\\\\", "\b":"\\b", "\f":"\\f", "\n":"\\n", "\r":"\\r", "\t":"\\t"};
}();
cljs.core.quote_string = function(a) {
  return[cljs.core.str('"'), cljs.core.str(a.replace(RegExp('[\\\\"\b\f\n\r\t]', "g"), function(a) {
    return cljs.core.char_escapes[a];
  })), cljs.core.str('"')].join("");
};
cljs.core.pr_writer = function pr_writer(b, c, d) {
  if (null == b) {
    return cljs.core._write.call(null, c, "nil");
  }
  if (void 0 === b) {
    return cljs.core._write.call(null, c, "#\x3cundefined\x3e");
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    cljs.core.truth_(function() {
      var c = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "meta", "meta", 1017252215));
      return cljs.core.truth_(c) ? (c = b ? b.cljs$lang$protocol_mask$partition0$ & 131072 || b.cljs$core$IMeta$ ? !0 : b.cljs$lang$protocol_mask$partition0$ ? !1 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, b) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IMeta, b)) ? cljs.core.meta.call(null, b) : c : c;
    }()) && (cljs.core._write.call(null, c, "^"), pr_writer.call(null, cljs.core.meta.call(null, b), c, d), cljs.core._write.call(null, c, " "));
    if (null == b) {
      return cljs.core._write.call(null, c, "nil");
    }
    if (b.cljs$lang$type) {
      return b.cljs$lang$ctorPrWriter(b, c, d);
    }
    if (b && (b.cljs$lang$protocol_mask$partition0$ & 2147483648 || b.cljs$core$IPrintWithWriter$)) {
      return cljs.core._pr_writer.call(null, b, c, d);
    }
    if (cljs.core.type.call(null, b) === Boolean || "number" === typeof b) {
      return cljs.core._write.call(null, c, "" + cljs.core.str(b));
    }
    if (cljs.core.object_QMARK_.call(null, b)) {
      return cljs.core._write.call(null, c, "#js "), cljs.core.print_map.call(null, cljs.core.map.call(null, function(c) {
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null, c), b[c]], null);
      }, cljs.core.js_keys.call(null, b)), pr_writer, c, d);
    }
    if (b instanceof Array) {
      return cljs.core.pr_sequential_writer.call(null, c, pr_writer, "#js [", " ", "]", d, b);
    }
    if (goog.isString(b)) {
      return cljs.core.truth_((new cljs.core.Keyword(null, "readably", "readably", 4441712502)).cljs$core$IFn$_invoke$arity$1(d)) ? cljs.core._write.call(null, c, cljs.core.quote_string.call(null, b)) : cljs.core._write.call(null, c, b);
    }
    if (cljs.core.fn_QMARK_.call(null, b)) {
      return cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str(b), "\x3e");
    }
    if (b instanceof Date) {
      var e = function(b, c) {
        for (var d = "" + cljs.core.str(b);;) {
          if (cljs.core.count.call(null, d) < c) {
            d = [cljs.core.str("0"), cljs.core.str(d)].join("");
          } else {
            return d;
          }
        }
      };
      return cljs.core.write_all.call(null, c, '#inst "', "" + cljs.core.str(b.getUTCFullYear()), "-", e.call(null, b.getUTCMonth() + 1, 2), "-", e.call(null, b.getUTCDate(), 2), "T", e.call(null, b.getUTCHours(), 2), ":", e.call(null, b.getUTCMinutes(), 2), ":", e.call(null, b.getUTCSeconds(), 2), ".", e.call(null, b.getUTCMilliseconds(), 3), "-", '00:00"');
    }
    return cljs.core.regexp_QMARK_.call(null, b) ? cljs.core.write_all.call(null, c, '#"', b.source, '"') : (b ? b.cljs$lang$protocol_mask$partition0$ & 2147483648 || b.cljs$core$IPrintWithWriter$ || (b.cljs$lang$protocol_mask$partition0$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IPrintWithWriter, b)) ? cljs.core._pr_writer.call(null, b, c, d) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? 
    cljs.core.write_all.call(null, c, "#\x3c", "" + cljs.core.str(b), "\x3e") : null;
  }
  return null;
};
cljs.core.pr_seq_writer = function(a, b, c) {
  cljs.core.pr_writer.call(null, cljs.core.first.call(null, a), b, c);
  a = cljs.core.seq.call(null, cljs.core.next.call(null, a));
  for (var d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f);
      cljs.core._write.call(null, b, " ");
      cljs.core.pr_writer.call(null, g, b, c);
      f += 1;
    } else {
      if (a = cljs.core.seq.call(null, a)) {
        d = a, cljs.core.chunked_seq_QMARK_.call(null, d) ? (a = cljs.core.chunk_first.call(null, d), e = cljs.core.chunk_rest.call(null, d), d = a, g = cljs.core.count.call(null, a), a = e, e = g) : (g = cljs.core.first.call(null, d), cljs.core._write.call(null, b, " "), cljs.core.pr_writer.call(null, g, b, c), a = cljs.core.next.call(null, d), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.pr_sb_with_opts = function(a, b) {
  var c = new goog.string.StringBuffer, d = new cljs.core.StringBufferWriter(c);
  cljs.core.pr_seq_writer.call(null, a, d, b);
  cljs.core._flush.call(null, d);
  return c;
};
cljs.core.pr_str_with_opts = function(a, b) {
  return cljs.core.empty_QMARK_.call(null, a) ? "" : "" + cljs.core.str(cljs.core.pr_sb_with_opts.call(null, a, b));
};
cljs.core.prn_str_with_opts = function(a, b) {
  if (cljs.core.empty_QMARK_.call(null, a)) {
    return "\n";
  }
  var c = cljs.core.pr_sb_with_opts.call(null, a, b);
  c.append("\n");
  return "" + cljs.core.str(c);
};
cljs.core.pr_with_opts = function(a, b) {
  return cljs.core.string_print.call(null, cljs.core.pr_str_with_opts.call(null, a, b));
};
cljs.core.newline = function(a) {
  cljs.core.string_print.call(null, "\n");
  return cljs.core.truth_(cljs.core.get.call(null, a, new cljs.core.Keyword(null, "flush-on-newline", "flush-on-newline", 4338025857))) ? cljs.core.flush.call(null) : null;
};
cljs.core.pr_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.prn_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.pr = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print = function() {
  var a = function(a) {
    return cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print_str = function() {
  var a = function(a) {
    return cljs.core.pr_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.println = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1));
    return cljs.core.truth_(cljs.core._STAR_print_newline_STAR_) ? cljs.core.newline.call(null, cljs.core.pr_opts.call(null)) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.println_str = function() {
  var a = function(a) {
    return cljs.core.prn_str_with_opts.call(null, a, cljs.core.assoc.call(null, cljs.core.pr_opts.call(null), new cljs.core.Keyword(null, "readably", "readably", 4441712502), !1));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.prn = function() {
  var a = function(a) {
    cljs.core.pr_with_opts.call(null, a, cljs.core.pr_opts.call(null));
    return cljs.core.truth_(cljs.core._STAR_print_newline_STAR_) ? cljs.core.newline.call(null, cljs.core.pr_opts.call(null)) : null;
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.print_map = function(a, b, c, d) {
  return cljs.core.pr_sequential_writer.call(null, c, function(a, c, d) {
    b.call(null, cljs.core.key.call(null, a), c, d);
    cljs.core._write.call(null, c, " ");
    return b.call(null, cljs.core.val.call(null, a), c, d);
  }, "{", ", ", "}", d, cljs.core.seq.call(null, a));
};
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.KeySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Subvec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedCons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentQueue.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#queue [", " ", "]", c, cljs.core.seq.call(null, this));
};
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.LazySeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, this);
};
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.NodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.RedNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ChunkedSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentHashSet.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "#{", " ", "}", c, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.List.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.List.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentArrayMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.EmptyList.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, "()");
};
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.BlackNode.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "[", " ", "]", c, this);
};
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Cons.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.Range.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ArrayNodeSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ValSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.ObjMap.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.print_map.call(null, this, cljs.core.pr_writer, b, c);
};
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$ = !0;
cljs.core.PersistentTreeMapSeq.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core.pr_sequential_writer.call(null, b, cljs.core.pr_writer, "(", " ", ")", c, this);
};
cljs.core.PersistentVector.prototype.cljs$core$IComparable$ = !0;
cljs.core.PersistentVector.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, this, b);
};
cljs.core.Subvec.prototype.cljs$core$IComparable$ = !0;
cljs.core.Subvec.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_indexed.call(null, this, b);
};
cljs.core.Keyword.prototype.cljs$core$IComparable$ = !0;
cljs.core.Keyword.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_symbols.call(null, this, b);
};
cljs.core.Symbol.prototype.cljs$core$IComparable$ = !0;
cljs.core.Symbol.prototype.cljs$core$IComparable$_compare$arity$2 = function(a, b) {
  return cljs.core.compare_symbols.call(null, this, b);
};
cljs.core.Atom = function(a, b, c, d) {
  this.state = a;
  this.meta = b;
  this.validator = c;
  this.watches = d;
  this.cljs$lang$protocol_mask$partition0$ = 2153938944;
  this.cljs$lang$protocol_mask$partition1$ = 2;
};
cljs.core.Atom.cljs$lang$type = !0;
cljs.core.Atom.cljs$lang$ctorStr = "cljs.core/Atom";
cljs.core.Atom.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Atom");
};
cljs.core.Atom.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(this);
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches$arity$3 = function(a, b, c) {
  a = cljs.core.seq.call(null, this.watches);
  for (var d = null, e = 0, f = 0;;) {
    if (f < e) {
      var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
      g.call(null, h, this, b, c);
      f += 1;
    } else {
      if (a = cljs.core.seq.call(null, a)) {
        cljs.core.chunked_seq_QMARK_.call(null, a) ? (d = cljs.core.chunk_first.call(null, a), a = cljs.core.chunk_rest.call(null, a), h = d, e = cljs.core.count.call(null, d), d = h) : (d = cljs.core.first.call(null, a), h = cljs.core.nth.call(null, d, 0, null), g = cljs.core.nth.call(null, d, 1, null), g.call(null, h, this, b, c), a = cljs.core.next.call(null, a), d = null, e = 0), f = 0;
      } else {
        return null;
      }
    }
  }
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch$arity$3 = function(a, b, c) {
  return this.watches = cljs.core.assoc.call(null, this.watches, b, c);
};
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch$arity$2 = function(a, b) {
  return this.watches = cljs.core.dissoc.call(null, this.watches, b);
};
cljs.core.Atom.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  cljs.core._write.call(null, b, "#\x3cAtom: ");
  cljs.core.pr_writer.call(null, this.state, b, c);
  return cljs.core._write.call(null, b, "\x3e");
};
cljs.core.Atom.prototype.cljs$core$IMeta$_meta$arity$1 = function(a) {
  return this.meta;
};
cljs.core.Atom.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  return this.state;
};
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return this === b;
};
cljs.core.__GT_Atom = function(a, b, c, d) {
  return new cljs.core.Atom(a, b, c, d);
};
cljs.core.atom = function() {
  var a = null, b = function(a) {
    return new cljs.core.Atom(a, null, null, null);
  }, c = function() {
    var a = function(a, b) {
      var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "validator", "validator", 4199087812)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "meta", "meta", 1017252215));
      return new cljs.core.Atom(a, c, d, null);
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e);
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.reset_BANG_ = function(a, b) {
  var c = a.validator;
  if (null != c && !cljs.core.truth_(c.call(null, b))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str("Validator rejected reference state"), cljs.core.str("\n"), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "validate", "validate", 1233162959, null), new cljs.core.Symbol(null, "new-value", "new-value", 972165309, null))))].join(""));
  }
  c = a.state;
  a.state = b;
  null != a.watches && cljs.core._notify_watches.call(null, a, c, b);
  return b;
};
cljs.core.swap_BANG_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state));
  }, c = function(a, b, c) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c));
  }, d = function(a, b, c, d) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d));
  }, e = function(a, b, c, d, e) {
    return cljs.core.reset_BANG_.call(null, a, b.call(null, a.state, c, d, e));
  }, f = function() {
    var a = function(a, b, c, d, e, f) {
      return cljs.core.reset_BANG_.call(null, a, cljs.core.apply.call(null, b, a.state, c, d, e, f));
    }, b = function(b, c, d, e, f, h) {
      var s = null;
      5 < arguments.length && (s = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5), 0));
      return a.call(this, b, c, d, e, f, s);
    };
    b.cljs$lang$maxFixedArity = 5;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.next(b);
      var d = cljs.core.first(b);
      b = cljs.core.next(b);
      var e = cljs.core.first(b);
      b = cljs.core.next(b);
      var f = cljs.core.first(b);
      b = cljs.core.next(b);
      var h = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, d, e, f, h, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, h, k, l, m, n) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, h);
      case 3:
        return c.call(this, a, h, k);
      case 4:
        return d.call(this, a, h, k, l);
      case 5:
        return e.call(this, a, h, k, l, m);
      default:
        return f.cljs$core$IFn$_invoke$arity$variadic(a, h, k, l, m, cljs.core.array_seq(arguments, 5));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 5;
  a.cljs$lang$applyTo = f.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  a.cljs$core$IFn$_invoke$arity$4 = d;
  a.cljs$core$IFn$_invoke$arity$5 = e;
  a.cljs$core$IFn$_invoke$arity$variadic = f.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.compare_and_set_BANG_ = function(a, b, c) {
  return cljs.core._EQ_.call(null, a.state, b) ? (cljs.core.reset_BANG_.call(null, a, c), !0) : !1;
};
cljs.core.deref = function(a) {
  return cljs.core._deref.call(null, a);
};
cljs.core.set_validator_BANG_ = function(a, b) {
  return a.validator = b;
};
cljs.core.get_validator = function(a) {
  return a.validator;
};
cljs.core.alter_meta_BANG_ = function() {
  var a = function(a, b, e) {
    return a.meta = cljs.core.apply.call(null, b, a.meta, e);
  }, b = function(b, d, e) {
    var f = null;
    2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
    return a.call(this, b, d, f);
  };
  b.cljs$lang$maxFixedArity = 2;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.next(b);
    var e = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, e, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.reset_meta_BANG_ = function(a, b) {
  return a.meta = b;
};
cljs.core.add_watch = function(a, b, c) {
  return cljs.core._add_watch.call(null, a, b, c);
};
cljs.core.remove_watch = function(a, b) {
  return cljs.core._remove_watch.call(null, a, b);
};
cljs.core.gensym_counter = null;
cljs.core.gensym = function() {
  var a = null, b = function() {
    return a.call(null, "G__");
  }, c = function(a) {
    null == cljs.core.gensym_counter && (cljs.core.gensym_counter = cljs.core.atom.call(null, 0));
    return cljs.core.symbol.call(null, [cljs.core.str(a), cljs.core.str(cljs.core.swap_BANG_.call(null, cljs.core.gensym_counter, cljs.core.inc))].join(""));
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;
cljs.core.Delay = function(a, b) {
  this.state = a;
  this.f = b;
  this.cljs$lang$protocol_mask$partition1$ = 1;
  this.cljs$lang$protocol_mask$partition0$ = 32768;
};
cljs.core.Delay.cljs$lang$type = !0;
cljs.core.Delay.cljs$lang$ctorStr = "cljs.core/Delay";
cljs.core.Delay.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/Delay");
};
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_$arity$1 = function(a) {
  return(new cljs.core.Keyword(null, "done", "done", 1016993524)).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null, this.state));
};
cljs.core.Delay.prototype.cljs$core$IDeref$_deref$arity$1 = function(a) {
  var b = this;
  return(new cljs.core.Keyword(null, "value", "value", 1125876963)).cljs$core$IFn$_invoke$arity$1(cljs.core.swap_BANG_.call(null, b.state, function(a) {
    a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
    var d = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "done", "done", 1016993524));
    return cljs.core.truth_(d) ? a : new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "done", "done", 1016993524), !0, new cljs.core.Keyword(null, "value", "value", 1125876963), b.f.call(null)], null);
  }));
};
cljs.core.__GT_Delay = function(a, b) {
  return new cljs.core.Delay(a, b);
};
cljs.core.delay_QMARK_ = function(a) {
  return a instanceof cljs.core.Delay;
};
cljs.core.force = function(a) {
  return cljs.core.delay_QMARK_.call(null, a) ? cljs.core.deref.call(null, a) : a;
};
cljs.core.realized_QMARK_ = function(a) {
  return cljs.core._realized_QMARK_.call(null, a);
};
cljs.core.IEncodeJS = function() {
  return{};
}();
cljs.core._clj__GT_js = function(a) {
  if (a ? a.cljs$core$IEncodeJS$_clj__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_clj__GT_js$arity$1(a);
  }
  var b;
  b = cljs.core._clj__GT_js[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._clj__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-clj-\x3ejs", a);
  }
  return b.call(null, a);
};
cljs.core._key__GT_js = function(a) {
  if (a ? a.cljs$core$IEncodeJS$_key__GT_js$arity$1 : a) {
    return a.cljs$core$IEncodeJS$_key__GT_js$arity$1(a);
  }
  var b;
  b = cljs.core._key__GT_js[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._key__GT_js._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeJS.-key-\x3ejs", a);
  }
  return b.call(null, a);
};
cljs.core.key__GT_js = function(a) {
  return(a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeJS$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, a)) ? cljs.core._clj__GT_js.call(null, a) : "string" === typeof a || "number" === typeof a || a instanceof cljs.core.Keyword || a instanceof cljs.core.Symbol ? cljs.core.clj__GT_js.call(null, a) : cljs.core.pr_str.call(null, a);
};
cljs.core.clj__GT_js = function clj__GT_js(b) {
  if (null == b) {
    return null;
  }
  if (b ? cljs.core.truth_(cljs.core.truth_(null) ? null : b.cljs$core$IEncodeJS$) || (b.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, b)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeJS, b)) {
    return cljs.core._clj__GT_js.call(null, b);
  }
  if (b instanceof cljs.core.Keyword) {
    return cljs.core.name.call(null, b);
  }
  if (b instanceof cljs.core.Symbol) {
    return "" + cljs.core.str(b);
  }
  if (cljs.core.map_QMARK_.call(null, b)) {
    var c = {};
    b = cljs.core.seq.call(null, b);
    for (var d = null, e = 0, f = 0;;) {
      if (f < e) {
        var g = cljs.core._nth.call(null, d, f), h = cljs.core.nth.call(null, g, 0, null), g = cljs.core.nth.call(null, g, 1, null);
        c[cljs.core.key__GT_js.call(null, h)] = clj__GT_js.call(null, g);
        f += 1;
      } else {
        if (b = cljs.core.seq.call(null, b)) {
          cljs.core.chunked_seq_QMARK_.call(null, b) ? (e = cljs.core.chunk_first.call(null, b), b = cljs.core.chunk_rest.call(null, b), d = e, e = cljs.core.count.call(null, e)) : (e = cljs.core.first.call(null, b), d = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), c[cljs.core.key__GT_js.call(null, d)] = clj__GT_js.call(null, e), b = cljs.core.next.call(null, b), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  if (cljs.core.coll_QMARK_.call(null, b)) {
    c = [];
    b = cljs.core.seq.call(null, cljs.core.map.call(null, clj__GT_js, b));
    d = null;
    for (f = e = 0;;) {
      if (f < e) {
        h = cljs.core._nth.call(null, d, f), c.push(h), f += 1;
      } else {
        if (b = cljs.core.seq.call(null, b)) {
          d = b, cljs.core.chunked_seq_QMARK_.call(null, d) ? (b = cljs.core.chunk_first.call(null, d), f = cljs.core.chunk_rest.call(null, d), d = b, e = cljs.core.count.call(null, b), b = f) : (b = cljs.core.first.call(null, d), c.push(b), b = cljs.core.next.call(null, d), d = null, e = 0), f = 0;
        } else {
          break;
        }
      }
    }
    return c;
  }
  return new cljs.core.Keyword(null, "else", "else", 1017020587) ? b : null;
};
cljs.core.IEncodeClojure = function() {
  return{};
}();
cljs.core._js__GT_clj = function(a, b) {
  if (a ? a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2 : a) {
    return a.cljs$core$IEncodeClojure$_js__GT_clj$arity$2(a, b);
  }
  var c;
  c = cljs.core._js__GT_clj[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._js__GT_clj._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IEncodeClojure.-js-\x3eclj", a);
  }
  return c.call(null, a, b);
};
cljs.core.js__GT_clj = function() {
  var a = null, b = function(b) {
    return a.call(null, b, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 4191781672), !1], null));
  }, c = function() {
    var a = function(a, b) {
      if (a ? cljs.core.truth_(cljs.core.truth_(null) ? null : a.cljs$core$IEncodeClojure$) || (a.cljs$lang$protocol_mask$partition$ ? 0 : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, a)) : cljs.core.native_satisfies_QMARK_.call(null, cljs.core.IEncodeClojure, a)) {
        return cljs.core._js__GT_clj.call(null, a, cljs.core.apply.call(null, cljs.core.array_map, b));
      }
      if (cljs.core.seq.call(null, b)) {
        var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "keywordize-keys", "keywordize-keys", 4191781672)), e = cljs.core.truth_(d) ? cljs.core.keyword : cljs.core.str;
        return function(a, b, c, d) {
          return function q(e) {
            return cljs.core.seq_QMARK_.call(null, e) ? cljs.core.doall.call(null, cljs.core.map.call(null, q, e)) : cljs.core.coll_QMARK_.call(null, e) ? cljs.core.into.call(null, cljs.core.empty.call(null, e), cljs.core.map.call(null, q, e)) : e instanceof Array ? cljs.core.vec.call(null, cljs.core.map.call(null, q, e)) : cljs.core.type.call(null, e) === Object ? cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, function() {
              return function(a, b, c, d) {
                return function A(f) {
                  return new cljs.core.LazySeq(null, function(a, b, c, d) {
                    return function() {
                      for (;;) {
                        var a = cljs.core.seq.call(null, f);
                        if (a) {
                          if (cljs.core.chunked_seq_QMARK_.call(null, a)) {
                            var b = cljs.core.chunk_first.call(null, a), c = cljs.core.count.call(null, b), g = cljs.core.chunk_buffer.call(null, c);
                            a: {
                              for (var h = 0;;) {
                                if (h < c) {
                                  var k = cljs.core._nth.call(null, b, h);
                                  cljs.core.chunk_append.call(null, g, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [d.call(null, k), q.call(null, e[k])], null));
                                  h += 1;
                                } else {
                                  b = !0;
                                  break a;
                                }
                              }
                              b = void 0;
                            }
                            return b ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), A.call(null, cljs.core.chunk_rest.call(null, a))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, g), null);
                          }
                          g = cljs.core.first.call(null, a);
                          return cljs.core.cons.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [d.call(null, g), q.call(null, e[g])], null), A.call(null, cljs.core.rest.call(null, a)));
                        }
                        return null;
                      }
                    };
                  }(a, b, c, d), null, null);
                };
              }(a, b, c, d).call(null, cljs.core.js_keys.call(null, e));
            }()) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? e : null;
          };
        }(b, c, d, e).call(null, a);
      }
      return null;
    }, b = function(b, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return a.call(this, b, e);
    };
    b.cljs$lang$maxFixedArity = 1;
    b.cljs$lang$applyTo = function(b) {
      var c = cljs.core.first(b);
      b = cljs.core.rest(b);
      return a(c, b);
    };
    b.cljs$core$IFn$_invoke$arity$variadic = a;
    return b;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.memoize = function(a) {
  var b = cljs.core.atom.call(null, cljs.core.PersistentArrayMap.EMPTY);
  return function() {
    var c = function(c) {
      var d = cljs.core.get.call(null, cljs.core.deref.call(null, b), c);
      if (cljs.core.truth_(d)) {
        return d;
      }
      d = cljs.core.apply.call(null, a, c);
      cljs.core.swap_BANG_.call(null, b, cljs.core.assoc, c, d);
      return d;
    }, d = function(a) {
      var b = null;
      0 < arguments.length && (b = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
      return c.call(this, b);
    };
    d.cljs$lang$maxFixedArity = 0;
    d.cljs$lang$applyTo = function(a) {
      a = cljs.core.seq(a);
      return c(a);
    };
    d.cljs$core$IFn$_invoke$arity$variadic = c;
    return d;
  }();
};
cljs.core.trampoline = function() {
  var a = null, b = function(a) {
    for (;;) {
      if (a = a.call(null), !cljs.core.fn_QMARK_.call(null, a)) {
        return a;
      }
    }
  }, c = function() {
    var b = function(b, c) {
      return a.call(null, function() {
        return cljs.core.apply.call(null, b, c);
      });
    }, c = function(a, c) {
      var e = null;
      1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, e);
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, cljs.core.array_seq(arguments, 1));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 1;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
cljs.core.rand = function() {
  var a = null, b = function() {
    return a.call(null, 1);
  }, c = function(a) {
    return Math.random.call(null) * a;
  }, a = function(a) {
    switch(arguments.length) {
      case 0:
        return b.call(this);
      case 1:
        return c.call(this, a);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$0 = b;
  a.cljs$core$IFn$_invoke$arity$1 = c;
  return a;
}();
cljs.core.rand_int = function(a) {
  return Math.floor.call(null, Math.random.call(null) * a);
};
cljs.core.rand_nth = function(a) {
  return cljs.core.nth.call(null, a, cljs.core.rand_int.call(null, cljs.core.count.call(null, a)));
};
cljs.core.group_by = function(a, b) {
  return cljs.core.reduce.call(null, function(b, d) {
    var e = a.call(null, d);
    return cljs.core.assoc.call(null, b, e, cljs.core.conj.call(null, cljs.core.get.call(null, b, e, cljs.core.PersistentVector.EMPTY), d));
  }, cljs.core.PersistentArrayMap.EMPTY, b);
};
cljs.core.make_hierarchy = function() {
  return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", 4515496059), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "descendants", "descendants", 768214664), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442), cljs.core.PersistentArrayMap.EMPTY], null);
};
cljs.core._global_hierarchy = null;
cljs.core.get_global_hierarchy = function() {
  null == cljs.core._global_hierarchy && (cljs.core._global_hierarchy = cljs.core.atom.call(null, cljs.core.make_hierarchy.call(null)));
  return cljs.core._global_hierarchy;
};
cljs.core.swap_global_hierarchy_BANG_ = function() {
  var a = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.swap_BANG_, cljs.core.get_global_hierarchy.call(null), a, b);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.isa_QMARK_ = function() {
  var a = null, b = function(b, c) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b, c);
  }, c = function(b, c, f) {
    var g = cljs.core._EQ_.call(null, c, f);
    if (!g && !(g = cljs.core.contains_QMARK_.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).cljs$core$IFn$_invoke$arity$1(b).call(null, c), f)) && (g = cljs.core.vector_QMARK_.call(null, f)) && (g = cljs.core.vector_QMARK_.call(null, c))) {
      if (g = cljs.core.count.call(null, f) === cljs.core.count.call(null, c)) {
        for (var g = !0, h = 0;;) {
          if (g && h !== cljs.core.count.call(null, f)) {
            g = a.call(null, b, c.call(null, h), f.call(null, h)), h += 1;
          } else {
            return g;
          }
        }
      } else {
        return g;
      }
    } else {
      return g;
    }
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.parents = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.ancestors = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.descendants = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.deref.call(null, cljs.core.get_global_hierarchy.call(null)), b);
  }, c = function(a, b) {
    return cljs.core.not_empty.call(null, cljs.core.get.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).cljs$core$IFn$_invoke$arity$1(a), b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
cljs.core.derive = function() {
  var a = null, b = function(b, c) {
    if (!cljs.core.truth_(cljs.core.namespace.call(null, c))) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "namespace", "namespace", -388313324, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))))].join(""));
    }
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null;
  }, c = function(a, b, c) {
    if (!cljs.core.not_EQ_.call(null, b, c)) {
      throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol(null, "not\x3d", "not\x3d", -1637144189, null), new cljs.core.Symbol(null, "tag", "tag", -1640416941, null), new cljs.core.Symbol(null, "parent", "parent", 1659011683, null))))].join(""));
    }
    var g = (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).cljs$core$IFn$_invoke$arity$1(a), h = (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).cljs$core$IFn$_invoke$arity$1(a), k = (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).cljs$core$IFn$_invoke$arity$1(a), l = function(a, b, c) {
      return function(d, e, f, g, h) {
        return cljs.core.reduce.call(null, function(a, b, c) {
          return function(a, b) {
            return cljs.core.assoc.call(null, a, b, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.get.call(null, h, b, cljs.core.PersistentHashSet.EMPTY), cljs.core.cons.call(null, g, h.call(null, g))));
          };
        }(a, b, c), d, cljs.core.cons.call(null, e, f.call(null, e)));
      };
    }(g, h, k);
    if (cljs.core.contains_QMARK_.call(null, g.call(null, b), c)) {
      b = null;
    } else {
      if (cljs.core.contains_QMARK_.call(null, k.call(null, b), c)) {
        throw Error([cljs.core.str(b), cljs.core.str("already has"), cljs.core.str(c), cljs.core.str("as ancestor")].join(""));
      }
      if (cljs.core.contains_QMARK_.call(null, k.call(null, c), b)) {
        throw Error([cljs.core.str("Cyclic derivation:"), cljs.core.str(c), cljs.core.str("has"), cljs.core.str(b), cljs.core.str("as ancestor")].join(""));
      }
      b = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "parents", "parents", 4515496059), cljs.core.assoc.call(null, (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).cljs$core$IFn$_invoke$arity$1(a), b, cljs.core.conj.call(null, cljs.core.get.call(null, g, b, cljs.core.PersistentHashSet.EMPTY), c)), new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442), l.call(null, (new cljs.core.Keyword(null, "ancestors", "ancestors", 889955442)).cljs$core$IFn$_invoke$arity$1(a), 
      b, h, c, k), new cljs.core.Keyword(null, "descendants", "descendants", 768214664), l.call(null, (new cljs.core.Keyword(null, "descendants", "descendants", 768214664)).cljs$core$IFn$_invoke$arity$1(a), c, k, b, h)], null);
    }
    return cljs.core.truth_(b) ? b : a;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.underive = function() {
  var a = null, b = function(b, c) {
    cljs.core.swap_global_hierarchy_BANG_.call(null, a, b, c);
    return null;
  }, c = function(a, b, c) {
    var g = (new cljs.core.Keyword(null, "parents", "parents", 4515496059)).cljs$core$IFn$_invoke$arity$1(a), h = cljs.core.truth_(g.call(null, b)) ? cljs.core.disj.call(null, g.call(null, b), c) : cljs.core.PersistentHashSet.EMPTY, k = cljs.core.truth_(cljs.core.not_empty.call(null, h)) ? cljs.core.assoc.call(null, g, b, h) : cljs.core.dissoc.call(null, g, b), h = cljs.core.flatten.call(null, cljs.core.map.call(null, function(a, b, c) {
      return function(a) {
        return cljs.core.cons.call(null, cljs.core.first.call(null, a), cljs.core.interpose.call(null, cljs.core.first.call(null, a), cljs.core.second.call(null, a)));
      };
    }(g, h, k), cljs.core.seq.call(null, k)));
    return cljs.core.contains_QMARK_.call(null, g.call(null, b), c) ? cljs.core.reduce.call(null, function(a, b) {
      return cljs.core.apply.call(null, cljs.core.derive, a, b);
    }, cljs.core.make_hierarchy.call(null), cljs.core.partition.call(null, 2, h)) : a;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.reset_cache = function(a, b, c, d) {
  cljs.core.swap_BANG_.call(null, a, function(a) {
    return cljs.core.deref.call(null, b);
  });
  return cljs.core.swap_BANG_.call(null, c, function(a) {
    return cljs.core.deref.call(null, d);
  });
};
cljs.core.prefers_STAR_ = function prefers_STAR_(b, c, d) {
  var e = cljs.core.deref.call(null, d).call(null, b), e = cljs.core.truth_(cljs.core.truth_(e) ? e.call(null, c) : e) ? !0 : null;
  if (cljs.core.truth_(e)) {
    return e;
  }
  e = function() {
    for (var e = cljs.core.parents.call(null, c);;) {
      if (0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, b, cljs.core.first.call(null, e), d)), e = cljs.core.rest.call(null, e);
      } else {
        return null;
      }
    }
  }();
  if (cljs.core.truth_(e)) {
    return e;
  }
  e = function() {
    for (var e = cljs.core.parents.call(null, b);;) {
      if (0 < cljs.core.count.call(null, e)) {
        cljs.core.truth_(prefers_STAR_.call(null, cljs.core.first.call(null, e), c, d)), e = cljs.core.rest.call(null, e);
      } else {
        return null;
      }
    }
  }();
  return cljs.core.truth_(e) ? e : !1;
};
cljs.core.dominates = function(a, b, c) {
  c = cljs.core.prefers_STAR_.call(null, a, b, c);
  return cljs.core.truth_(c) ? c : cljs.core.isa_QMARK_.call(null, a, b);
};
cljs.core.find_and_cache_best_method = function find_and_cache_best_method(b, c, d, e, f, g, h) {
  var k = cljs.core.reduce.call(null, function(e, g) {
    var h = cljs.core.nth.call(null, g, 0, null);
    cljs.core.nth.call(null, g, 1, null);
    if (cljs.core.isa_QMARK_.call(null, cljs.core.deref.call(null, d), c, h)) {
      var k = cljs.core.truth_(function() {
        var b = null == e;
        return b ? b : cljs.core.dominates.call(null, h, cljs.core.first.call(null, e), f);
      }()) ? g : e;
      if (!cljs.core.truth_(cljs.core.dominates.call(null, cljs.core.first.call(null, k), h, f))) {
        throw Error([cljs.core.str("Multiple methods in multimethod '"), cljs.core.str(b), cljs.core.str("' match dispatch value: "), cljs.core.str(c), cljs.core.str(" -\x3e "), cljs.core.str(h), cljs.core.str(" and "), cljs.core.str(cljs.core.first.call(null, k)), cljs.core.str(", and neither is preferred")].join(""));
      }
      return k;
    }
    return e;
  }, null, cljs.core.deref.call(null, e));
  if (cljs.core.truth_(k)) {
    if (cljs.core._EQ_.call(null, cljs.core.deref.call(null, h), cljs.core.deref.call(null, d))) {
      return cljs.core.swap_BANG_.call(null, g, cljs.core.assoc, c, cljs.core.second.call(null, k)), cljs.core.second.call(null, k);
    }
    cljs.core.reset_cache.call(null, g, e, h, d);
    return find_and_cache_best_method.call(null, b, c, d, e, f, g, h);
  }
  return null;
};
cljs.core.IMultiFn = function() {
  return{};
}();
cljs.core._reset = function(a) {
  if (a ? a.cljs$core$IMultiFn$_reset$arity$1 : a) {
    return a.cljs$core$IMultiFn$_reset$arity$1(a);
  }
  var b;
  b = cljs.core._reset[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._reset._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-reset", a);
  }
  return b.call(null, a);
};
cljs.core._add_method = function(a, b, c) {
  if (a ? a.cljs$core$IMultiFn$_add_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_add_method$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._add_method[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._add_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-add-method", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._remove_method = function(a, b) {
  if (a ? a.cljs$core$IMultiFn$_remove_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_remove_method$arity$2(a, b);
  }
  var c;
  c = cljs.core._remove_method[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._remove_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-remove-method", a);
  }
  return c.call(null, a, b);
};
cljs.core._prefer_method = function(a, b, c) {
  if (a ? a.cljs$core$IMultiFn$_prefer_method$arity$3 : a) {
    return a.cljs$core$IMultiFn$_prefer_method$arity$3(a, b, c);
  }
  var d;
  d = cljs.core._prefer_method[goog.typeOf(null == a ? null : a)];
  if (!d && (d = cljs.core._prefer_method._, !d)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefer-method", a);
  }
  return d.call(null, a, b, c);
};
cljs.core._get_method = function(a, b) {
  if (a ? a.cljs$core$IMultiFn$_get_method$arity$2 : a) {
    return a.cljs$core$IMultiFn$_get_method$arity$2(a, b);
  }
  var c;
  c = cljs.core._get_method[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._get_method._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-get-method", a);
  }
  return c.call(null, a, b);
};
cljs.core._methods = function(a) {
  if (a ? a.cljs$core$IMultiFn$_methods$arity$1 : a) {
    return a.cljs$core$IMultiFn$_methods$arity$1(a);
  }
  var b;
  b = cljs.core._methods[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._methods._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-methods", a);
  }
  return b.call(null, a);
};
cljs.core._prefers = function(a) {
  if (a ? a.cljs$core$IMultiFn$_prefers$arity$1 : a) {
    return a.cljs$core$IMultiFn$_prefers$arity$1(a);
  }
  var b;
  b = cljs.core._prefers[goog.typeOf(null == a ? null : a)];
  if (!b && (b = cljs.core._prefers._, !b)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-prefers", a);
  }
  return b.call(null, a);
};
cljs.core._dispatch = function(a, b) {
  if (a ? a.cljs$core$IMultiFn$_dispatch$arity$2 : a) {
    return a.cljs$core$IMultiFn$_dispatch$arity$2(a, b);
  }
  var c;
  c = cljs.core._dispatch[goog.typeOf(null == a ? null : a)];
  if (!c && (c = cljs.core._dispatch._, !c)) {
    throw cljs.core.missing_protocol.call(null, "IMultiFn.-dispatch", a);
  }
  return c.call(null, a, b);
};
cljs.core.do_dispatch = function(a, b, c, d) {
  c = cljs.core.apply.call(null, c, d);
  a = cljs.core._get_method.call(null, a, c);
  if (!cljs.core.truth_(a)) {
    throw Error([cljs.core.str("No method in multimethod '"), cljs.core.str(b), cljs.core.str("' for dispatch value: "), cljs.core.str(c)].join(""));
  }
  return cljs.core.apply.call(null, a, d);
};
cljs.core.MultiFn = function(a, b, c, d, e, f, g, h) {
  this.name = a;
  this.dispatch_fn = b;
  this.default_dispatch_val = c;
  this.hierarchy = d;
  this.method_table = e;
  this.prefer_table = f;
  this.method_cache = g;
  this.cached_hierarchy = h;
  this.cljs$lang$protocol_mask$partition0$ = 4194304;
  this.cljs$lang$protocol_mask$partition1$ = 256;
};
cljs.core.MultiFn.cljs$lang$type = !0;
cljs.core.MultiFn.cljs$lang$ctorStr = "cljs.core/MultiFn";
cljs.core.MultiFn.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/MultiFn");
};
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.getUid(this);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset$arity$1 = function(a) {
  cljs.core.swap_BANG_.call(null, this.method_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY;
  });
  cljs.core.swap_BANG_.call(null, this.method_cache, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY;
  });
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.PersistentArrayMap.EMPTY;
  });
  cljs.core.swap_BANG_.call(null, this.cached_hierarchy, function(a) {
    return null;
  });
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method$arity$3 = function(a, b, c) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.assoc, b, c);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method$arity$2 = function(a, b) {
  cljs.core.swap_BANG_.call(null, this.method_table, cljs.core.dissoc, b);
  cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  return this;
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method$arity$2 = function(a, b) {
  cljs.core._EQ_.call(null, cljs.core.deref.call(null, this.cached_hierarchy), cljs.core.deref.call(null, this.hierarchy)) || cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
  var c = cljs.core.deref.call(null, this.method_cache).call(null, b);
  if (cljs.core.truth_(c)) {
    return c;
  }
  c = cljs.core.find_and_cache_best_method.call(null, this.name, b, this.hierarchy, this.method_table, this.prefer_table, this.method_cache, this.cached_hierarchy);
  return cljs.core.truth_(c) ? c : cljs.core.deref.call(null, this.method_table).call(null, this.default_dispatch_val);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method$arity$3 = function(a, b, c) {
  if (cljs.core.truth_(cljs.core.prefers_STAR_.call(null, b, c, this.prefer_table))) {
    throw Error([cljs.core.str("Preference conflict in multimethod '"), cljs.core.str(this.name), cljs.core.str("': "), cljs.core.str(c), cljs.core.str(" is already preferred to "), cljs.core.str(b)].join(""));
  }
  cljs.core.swap_BANG_.call(null, this.prefer_table, function(a) {
    return cljs.core.assoc.call(null, a, b, cljs.core.conj.call(null, cljs.core.get.call(null, a, b, cljs.core.PersistentHashSet.EMPTY), c));
  });
  return cljs.core.reset_cache.call(null, this.method_cache, this.method_table, this.cached_hierarchy, this.hierarchy);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.method_table);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers$arity$1 = function(a) {
  return cljs.core.deref.call(null, this.prefer_table);
};
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch$arity$2 = function(a, b) {
  return cljs.core.do_dispatch.call(null, this, this.name, this.dispatch_fn, b);
};
cljs.core.__GT_MultiFn = function(a, b, c, d, e, f, g, h) {
  return new cljs.core.MultiFn(a, b, c, d, e, f, g, h);
};
cljs.core.MultiFn.prototype.call = function() {
  var a = function(a, b) {
    return cljs.core._dispatch.call(null, this, b);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
cljs.core.MultiFn.prototype.apply = function(a, b) {
  return cljs.core._dispatch.call(null, this, b);
};
cljs.core.remove_all_methods = function(a) {
  return cljs.core._reset.call(null, a);
};
cljs.core.remove_method = function(a, b) {
  return cljs.core._remove_method.call(null, a, b);
};
cljs.core.prefer_method = function(a, b, c) {
  return cljs.core._prefer_method.call(null, a, b, c);
};
cljs.core.methods$ = function(a) {
  return cljs.core._methods.call(null, a);
};
cljs.core.get_method = function(a, b) {
  return cljs.core._get_method.call(null, a, b);
};
cljs.core.prefers = function(a) {
  return cljs.core._prefers.call(null, a);
};
cljs.core.UUID = function(a) {
  this.uuid = a;
  this.cljs$lang$protocol_mask$partition1$ = 0;
  this.cljs$lang$protocol_mask$partition0$ = 2153775104;
};
cljs.core.UUID.cljs$lang$type = !0;
cljs.core.UUID.cljs$lang$ctorStr = "cljs.core/UUID";
cljs.core.UUID.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/UUID");
};
cljs.core.UUID.prototype.cljs$core$IHash$_hash$arity$1 = function(a) {
  return goog.string.hashCode(cljs.core.pr_str.call(null, this));
};
cljs.core.UUID.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = function(a, b, c) {
  return cljs.core._write.call(null, b, [cljs.core.str('#uuid "'), cljs.core.str(this.uuid), cljs.core.str('"')].join(""));
};
cljs.core.UUID.prototype.cljs$core$IEquiv$_equiv$arity$2 = function(a, b) {
  return b instanceof cljs.core.UUID && this.uuid === b.uuid;
};
cljs.core.__GT_UUID = function(a) {
  return new cljs.core.UUID(a);
};
cljs.core.ExceptionInfo = function(a, b, c) {
  this.message = a;
  this.data = b;
  this.cause = c;
};
cljs.core.ExceptionInfo.cljs$lang$type = !0;
cljs.core.ExceptionInfo.cljs$lang$ctorStr = "cljs.core/ExceptionInfo";
cljs.core.ExceptionInfo.cljs$lang$ctorPrWriter = function(a, b, c) {
  return cljs.core._write.call(null, b, "cljs.core/ExceptionInfo");
};
cljs.core.__GT_ExceptionInfo = function(a, b, c) {
  return new cljs.core.ExceptionInfo(a, b, c);
};
cljs.core.ExceptionInfo.prototype = Error();
cljs.core.ExceptionInfo.prototype.constructor = cljs.core.ExceptionInfo;
cljs.core.ex_info = function() {
  var a = null, b = function(a, b) {
    return new cljs.core.ExceptionInfo(a, b, null);
  }, c = function(a, b, c) {
    return new cljs.core.ExceptionInfo(a, b, c);
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
cljs.core.ex_data = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.data : null;
};
cljs.core.ex_message = function(a) {
  return a instanceof Error ? a.message : null;
};
cljs.core.ex_cause = function(a) {
  return a instanceof cljs.core.ExceptionInfo ? a.cause : null;
};
cljs.core.comparator = function(a) {
  return function(b, c) {
    return cljs.core.truth_(a.call(null, b, c)) ? -1 : cljs.core.truth_(a.call(null, c, b)) ? 1 : new cljs.core.Keyword(null, "else", "else", 1017020587) ? 0 : null;
  };
};
cljs.core.special_symbol_QMARK_ = function(a) {
  return cljs.core.contains_QMARK_.call(null, new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 19, [new cljs.core.Symbol(null, "deftype*", "deftype*", -978581244, null), null, new cljs.core.Symbol(null, "new", "new", -1640422567, null), null, new cljs.core.Symbol(null, "quote", "quote", -1532577739, null), null, new cljs.core.Symbol(null, "\x26", "\x26", -1640531489, null), null, new cljs.core.Symbol(null, "set!", "set!", -1637004872, null), null, new cljs.core.Symbol(null, 
  "recur", "recur", -1532142362, null), null, new cljs.core.Symbol(null, ".", ".", -1640531481, null), null, new cljs.core.Symbol(null, "ns", "ns", -1640528002, null), null, new cljs.core.Symbol(null, "do", "do", -1640528316, null), null, new cljs.core.Symbol(null, "fn*", "fn*", -1640430053, null), null, new cljs.core.Symbol(null, "throw", "throw", -1530191713, null), null, new cljs.core.Symbol(null, "letfn*", "letfn*", 1548249632, null), null, new cljs.core.Symbol(null, "js*", "js*", -1640426054, 
  null), null, new cljs.core.Symbol(null, "defrecord*", "defrecord*", 774272013, null), null, new cljs.core.Symbol(null, "let*", "let*", -1637213400, null), null, new cljs.core.Symbol(null, "loop*", "loop*", -1537374273, null), null, new cljs.core.Symbol(null, "try", "try", -1640416396, null), null, new cljs.core.Symbol(null, "if", "if", -1640528170, null), null, new cljs.core.Symbol(null, "def", "def", -1640432194, null), null], null), null), a);
};
var clojure = {walk:{}};
clojure.walk.walk = function(a, b, c) {
  return cljs.core.seq_QMARK_.call(null, c) ? b.call(null, cljs.core.doall.call(null, cljs.core.map.call(null, a, c))) : cljs.core.coll_QMARK_.call(null, c) ? b.call(null, cljs.core.into.call(null, cljs.core.empty.call(null, c), cljs.core.map.call(null, a, c))) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? b.call(null, c) : null;
};
clojure.walk.postwalk = function postwalk(b, c) {
  return clojure.walk.walk.call(null, cljs.core.partial.call(null, postwalk, b), b, c);
};
clojure.walk.prewalk = function prewalk(b, c) {
  return clojure.walk.walk.call(null, cljs.core.partial.call(null, prewalk, b), cljs.core.identity, b.call(null, c));
};
clojure.walk.keywordize_keys = function(a) {
  var b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null);
    a = cljs.core.nth.call(null, a, 1, null);
    return "string" === typeof b ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.call(null, b), a], null) : new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, a], null);
  };
  return clojure.walk.postwalk.call(null, function(a) {
    return cljs.core.map_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, cljs.core.map.call(null, b, a)) : a;
  }, a);
};
clojure.walk.stringify_keys = function(a) {
  var b = function(a) {
    var b = cljs.core.nth.call(null, a, 0, null);
    a = cljs.core.nth.call(null, a, 1, null);
    return b instanceof cljs.core.Keyword ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.name.call(null, b), a], null) : new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, a], null);
  };
  return clojure.walk.postwalk.call(null, function(a) {
    return cljs.core.map_QMARK_.call(null, a) ? cljs.core.into.call(null, cljs.core.PersistentArrayMap.EMPTY, cljs.core.map.call(null, b, a)) : a;
  }, a);
};
clojure.walk.prewalk_replace = function(a, b) {
  return clojure.walk.prewalk.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b) ? a.call(null, b) : b;
  }, b);
};
clojure.walk.postwalk_replace = function(a, b) {
  return clojure.walk.postwalk.call(null, function(b) {
    return cljs.core.contains_QMARK_.call(null, a, b) ? a.call(null, b) : b;
  }, b);
};
/*

 Copyright (C) 2013-2014 Jos de Jong <wjosdejong@gmail.com>

 Licensed under the Apache License, Version 2.0 (the "License"); you may not
 use this file except in compliance with the License. You may obtain a copy
 of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under
 the License.
*/
var math = {js:{}};
!function(a) {
  return function(b) {
    return function(c) {
      "object" == typeof exports && "object" == typeof module ? module.exports = b(c) : "function" == typeof define && define.amd ? define(function() {
        return b(c);
      }) : "object" == typeof exports ? exports.mathjs = b(c) : a.mathjs = b(c);
    };
  };
}(this)(function(a) {
  function b(e) {
    if (d[e]) {
      return d[e][c];
    }
    var f = d[e] = {exports:{}, id:e, loaded:!1};
    return a[e].call(f[c], f, f[c], b), f.loaded = !0, f[c];
  }
  var c = "exports", d = {};
  return b.modules = a, b.cache = d, b.p = "", b(0);
})([function(a, b, c) {
  a.exports = c(1);
}, function(a, b, c) {
  var d = c(2);
  a.exports = function(a) {
    if ("function" != typeof Object.create) {
      throw Error("ES5 not supported by this JavaScript engine. Please load the es5-shim and es5-sham library for compatibility.");
    }
    var b = {}, g = {matrix:"matrix", number:"number"};
    return b.config = function(a) {
      var b = c(220);
      if (a) {
        if (d.deepExtend(g, a), a.decimals && b.config({DECIMAL_PLACES:a.decimals}), a.number && a.number.defaultType) {
          throw Error("setting `number.defaultType` is deprecated. Use `number` instead.");
        }
        if (a.number && a.number.precision) {
          throw Error("setting `number.precision` is deprecated. Use `decimals` instead.");
        }
        if (a.matrix && a.matrix.defaultType) {
          throw Error("setting `matrix.defaultType` is deprecated. Use `matrix` instead.");
        }
        if (a.matrix && a.matrix["default"]) {
          throw Error("setting `matrix.default` is deprecated. Use `matrix` instead.");
        }
      }
      a = d.clone(g);
      return a.decimals = b.config().DECIMAL_PLACES, a;
    }, b.config(a), b.expression = {}, b.expression.node = c(3), b.expression.parse = c(4), b.expression.Scope = function() {
      throw Error("Scope is deprecated. Use a regular Object instead");
    }, b.expression.Parser = c(5), b.expression.docs = c(6), b.type = {}, b.type.BigNumber = c(220), b.type.Complex = c(7), b.type.Range = c(8), b.type.Index = c(9), b.type.Matrix = c(10), b.type.Unit = c(11), b.type.Help = c(12), b.collection = c(13), c(14)(b), c(15)(b, g), c(16)(b, g), c(17)(b, g), c(18)(b, g), c(19)(b, g), c(20)(b, g), c(21)(b, g), c(22)(b, g), c(23)(b, g), c(24)(b, g), c(25)(b, g), c(26)(b, g), c(27)(b, g), c(28)(b, g), c(29)(b, g), c(30)(b, g), c(31)(b, g), c(32)(b, g), c(33)(b, 
    g), c(34)(b, g), c(35)(b, g), c(36)(b, g), c(37)(b, g), c(38)(b, g), c(39)(b, g), c(40)(b, g), c(41)(b, g), c(42)(b, g), c(43)(b, g), c(44)(b, g), c(45)(b, g), c(46)(b, g), c(47)(b, g), c(48)(b, g), c(49)(b, g), c(50)(b, g), c(51)(b, g), c(52)(b, g), c(53)(b, g), c(54)(b, g), c(55)(b, g), c(56)(b, g), c(57)(b, g), c(58)(b, g), c(59)(b, g), c(60)(b, g), c(61)(b, g), c(62)(b, g), c(63)(b, g), c(64)(b, g), c(65)(b, g), c(66)(b, g), c(67)(b, g), c(68)(b, g), c(69)(b, g), c(70)(b, g), c(71)(b, g), 
    c(72)(b, g), c(73)(b, g), c(74)(b, g), c(75)(b, g), c(76)(b, g), c(77)(b, g), c(78)(b, g), c(79)(b, g), c(80)(b, g), c(81)(b, g), c(82)(b, g), c(83)(b, g), c(84)(b, g), c(85)(b, g), c(86)(b, g), c(87)(b, g), c(88)(b, g), c(89)(b, g), c(90)(b, g), c(91)(b, g), c(92)(b, g), c(93)(b, g), c(94)(b, g), c(95)(b, g), c(96)(b, g), c(97)(b, g), c(98)(b, g), c(99)(b, g), c(100)(b, g), c(101)(b, g), c(102)(b, g), b.chaining = {}, b.chaining.Selector = c(103)(b, g), b;
  };
}, function(a, b) {
  b.clone = function d(a) {
    var b = typeof a;
    if ("number" === b || "string" === b || "boolean" === b || null === a || void 0 === a) {
      return a;
    }
    if ("function" == typeof a.clone) {
      return a.clone();
    }
    if (Array.isArray(a)) {
      return a.map(function(a) {
        return d(a);
      });
    }
    if (a instanceof Object) {
      for (var g in a) {
        a.hasOwnProperty(g) && d(a[g]);
      }
      return a;
    }
    throw new TypeError("Cannot clone " + a);
  };
  b.extend = function(a, b) {
    for (var f in b) {
      b.hasOwnProperty(f) && (a[f] = b[f]);
    }
    return a;
  };
  b.deepExtend = function e(a, b) {
    for (var h in b) {
      b.hasOwnProperty(h) && (b[h] && b[h].constructor === Object ? (void 0 === a[h] && (a[h] = {}), a[h].constructor === Object ? e(a[h], b[h]) : a[h] = b[h]) : a[h] = b[h]);
    }
    return a;
  };
  b.deepEqual = function(a, f) {
    var g, h;
    if (Array.isArray(a)) {
      if (!Array.isArray(f) || a.length != f.length) {
        return!1;
      }
      g = 0;
      for (h = a.length;h > g;g++) {
        if (!b.deepEqual(a[g], f[g])) {
          return!1;
        }
      }
      return!0;
    }
    if (a instanceof Object) {
      if (Array.isArray(f) || !(f instanceof Object)) {
        return!1;
      }
      for (g in a) {
        if (a.hasOwnProperty(g) && !b.deepEqual(a[g], f[g])) {
          return!1;
        }
      }
      for (g in f) {
        if (f.hasOwnProperty(g) && !b.deepEqual(a[g], f[g])) {
          return!1;
        }
      }
      return!0;
    }
    return a == f;
  };
}, function(a, b, c) {
  b.ArrayNode = c(104);
  b.AssignmentNode = c(105);
  b.BlockNode = c(106);
  b.ConstantNode = c(107);
  b.IndexNode = c(108);
  b.FunctionNode = c(109);
  b.Node = c(110);
  b.OperatorNode = c(111);
  b.ParamsNode = c(112);
  b.RangeNode = c(113);
  b.SymbolNode = c(114);
  b.UnitNode = c(115);
  b.UpdateNode = c(116);
}, function(a, b, c) {
  function d() {
    W++;
    D = X.charAt(W);
  }
  function e() {
    P = L.NULL;
    for (y = "";" " == D || "\t" == D;) {
      d();
    }
    if ("#" == D) {
      for (;"\n" != D && "" != D;) {
        d();
      }
    }
    if ("" == D) {
      return void(P = L.DELIMITER);
    }
    var a = D + X.charAt(W + 1);
    if (V[a]) {
      return P = L.DELIMITER, y = a, d(), void d();
    }
    if (V[D]) {
      return P = L.DELIMITER, y = D, void d();
    }
    if (!("0" <= D && "9" >= D || "." == D)) {
      if (g(D)) {
        for (;g(D) || h(D);) {
          y += D, d();
        }
        return void(P = Y[y] ? L.DELIMITER : L.SYMBOL);
      }
      for (P = L.UNKNOWN;"" != D;) {
        y += D, d();
      }
      throw A('Syntax error in part "' + y + '"');
    }
    if (P = L.NUMBER, "." == D) {
      y += D, d(), h(D) || (P = L.UNKNOWN);
    } else {
      for (;h(D);) {
        y += D, d();
      }
      "." == D && (y += D, d());
    }
    for (;h(D);) {
      y += D, d();
    }
    if ("E" == D || "e" == D) {
      for (y += D, d(), "+" != D && "-" != D || (y += D, d()), h(D) || (P = L.UNKNOWN);h(D);) {
        y += D, d();
      }
    }
  }
  function f() {
    for (;"\n" == y;) {
      e();
    }
  }
  function g(a) {
    return "a" <= a && "z" >= a || "A" <= a && "Z" >= a || "_" == a;
  }
  function h(a) {
    return "0" <= a && "9" >= a;
  }
  function k() {
    W = 0;
    D = X.charAt(0);
    e();
    var a, b;
    if ("" == y) {
      b = new J("undefined", "undefined");
    } else {
      var c;
      for ("\n" != y && ";" != y && "" != y && (a = l());"\n" == y || ";" == y;) {
        b || (b = new E, a && (c = ";" != y, b.add(a, c))), e(), "\n" != y && ";" != y && "" != y && (a = l(), c = ";" != y, b.add(a, c));
      }
      b = b ? b : (a || (a = l()), a);
    }
    if (a = b, "" != y) {
      throw P == L.DELIMITER ? Error(B("Unknown operator " + y)) : A('Unexpected part "' + y + '"');
    }
    return a;
  }
  function l() {
    var a;
    if (P == L.SYMBOL && "function" == y) {
      throw Error('Deprecated keyword "function". Functions can now be assigned without it, like "f(x) \x3d x^2".');
    }
    a = m();
    return new G("ans", a);
  }
  function m() {
    var a, b, c, d = n();
    if ("\x3d" == y) {
      if (d instanceof Q) {
        return a = d.name, e(), c = m(), new G(a, c);
      }
      if (d instanceof O) {
        return e(), c = m(), new U(d, c);
      }
      if (d instanceof R) {
        var g = !0;
        if (b = [], d.object instanceof Q ? (a = d.object.name, d.params.forEach(function(a, c) {
          a instanceof Q ? b[c] = a.name : g = !1;
        })) : g = !1, g) {
          return e(), c = m(), new M(a, b, c);
        }
      }
      throw A("Invalid left hand side of assignment operator \x3d");
    }
    return d;
  }
  function n() {
    var a, b = [];
    if (a = ":" == y ? new J("number", "1") : r(), ":" == y) {
      for (b.push(a);":" == y;) {
        e(), b.push(")" == y || "]" == y || "," == y || "" == y ? new Q("end") : r());
      }
      b.length && (3 == b.length && (a = b[2], b[2] = b[1], b[1] = a), a = new S(b));
    }
    return a;
  }
  function r() {
    var a, b, c, d;
    a = p();
    for (b = {"\x3d\x3d":"equal", "!\x3d":"unequal", "\x3c":"smaller", "\x3e":"larger", "\x3c\x3d":"smallereq", "\x3e\x3d":"largereq"};y in b;) {
      c = y, d = b[c], e(), a = [a, p()], a = new N(c, d, a);
    }
    return a;
  }
  function p() {
    var a, b, c, d;
    a = s();
    for (b = {to:"to", "in":"to"};y in b;) {
      c = y, d = b[c], e(), a = [a, s()], a = new N(c, d, a);
    }
    return a;
  }
  function s() {
    var a, b, c, d;
    a = q();
    for (b = {"+":"add", "-":"subtract"};y in b;) {
      c = y, d = b[c], e(), a = [a, q()], a = new N(c, d, a);
    }
    return a;
  }
  function q() {
    var a, b, c, d;
    a = u();
    for (b = {"*":"multiply", ".*":"emultiply", "/":"divide", "./":"edivide", "%":"mod", mod:"mod"};y in b;) {
      c = y, d = b[c], e(), a = [a, u()], a = new N(c, d, a);
    }
    return a;
  }
  function u() {
    var a, b;
    return a = x(), (P == L.SYMBOL || "in" == y) && (b = y, e(), a = new T(a, b)), a;
  }
  function x() {
    var a, b, c;
    if ("-" == y) {
      c = (a = y, e(), b = [x()], new N(a, "unary", b));
    } else {
      var d, g, f;
      a = [v()];
      for (b = [];"^" == y || ".^" == y;) {
        b.push(y), e(), a.push(v());
      }
      for (d = a.pop();a.length;) {
        g = a.pop(), c = b.pop(), f = "^" == c ? "pow" : "epow", d = [g, d], d = new N(c, f, d);
      }
      c = d;
    }
    return c;
  }
  function v() {
    var a, b, c, g;
    if (P == L.SYMBOL && Z[y]) {
      if (b = Z[y], e(), "(" == y) {
        if (c = [], e(), ")" != y) {
          for (c.push(n());"," == y;) {
            e(), c.push(n());
          }
        }
        if (")" != y) {
          throw A("Parenthesis ) expected");
        }
        e();
      }
      b = new b(c);
    } else {
      if (P == L.SYMBOL || P == L.DELIMITER && y in Y) {
        c = (a = y, e(), g = new Q(a), t(g));
      } else {
        if ('"' == y) {
          for (g = c = "";"" != D && ('"' != D || "\\" == g);) {
            c += D, g = D, d();
          }
          if (e(), '"' != y) {
            throw A('End of string " expected');
          }
          c = (e(), b = new J("string", c), t(b));
        } else {
          if ("[" == y) {
            if (e(), f(), "]" != y) {
              if (c = w(), ";" == y) {
                b = 1;
                for (c = [c];";" == y;) {
                  e(), f(), c[b] = w(), b++, f();
                }
                if ("]" != y) {
                  throw A("End of matrix ] expected");
                }
                e();
                g = 0 < c.length ? c[0].length : 0;
                for (a = 1;b > a;a++) {
                  if (c[a].length != g) {
                    throw Error(B("Number of columns must match (" + c[a].length + " !\x3d " + g + ")"));
                  }
                }
                b = new F(c);
              } else {
                if ("]" != y) {
                  throw A("End of matrix ] expected");
                }
                e();
                b = c;
              }
            } else {
              e(), b = new F([]);
            }
            c = t(b);
          } else {
            var h, k;
            if (P == L.NUMBER) {
              b = (k = "." == y ? "0" : y, e(), "i" == y || "I" == y ? (e(), h = new J("complex", k)) : h = new J("number", k), t(h));
            } else {
              if ("(" == y) {
                if (e(), b = m(), ")" != y) {
                  throw A("Parenthesis ) expected");
                }
                b = (e(), t(b));
              } else {
                throw A("" == y ? "Unexpected end of expression" : "Value expected");
              }
            }
            c = b;
          }
        }
      }
      b = c;
    }
    a = b;
    for (b = {"!":"factorial", "'":"transpose"};y in b;) {
      c = y, g = b[c], e(), a = [a], a = new N(c, g, a);
    }
    return a;
  }
  function t(a) {
    for (var b, c;"(" == y || "[" == y;) {
      if (b = y, c = [], e(), ")" != y && "]" != y) {
        for (c.push(n());"," == y;) {
          e(), c.push(n());
        }
      }
      if ("(" == b && ")" != y) {
        throw A("Parenthesis ) expected");
      }
      if ("[" == b && "]" != y) {
        throw A("Parenthesis ] expected");
      }
      e();
      a = "(" == b ? new R(a, c) : new O(a, c);
    }
    return a;
  }
  function w() {
    for (var a = [m()], b = 1;"," == y;) {
      e(), f(), a[b] = m(), b++, f();
    }
    return new F(a);
  }
  function B(a) {
    var b = W - y.length + 1;
    return void 0 === b ? a : a + " (char " + b + ")";
  }
  function A(a) {
    return new SyntaxError(B(a));
  }
  b = c(117);
  var I = (b.number.toNumber, b.string.isString), z = Array.isArray, C = b.types.type, H = (c(7), c(10)), K = (c(11), c(13)), F = c(104), G = c(105), E = c(106), J = c(107), M = c(109), O = c(108), N = c(111), R = c(112), S = c(113), Q = c(114), T = c(115), U = c(116), L = {NULL:0, DELIMITER:1, NUMBER:2, SYMBOL:3, UNKNOWN:4}, V = {",":!0, "(":!0, ")":!0, "[":!0, "]":!0, '"':!0, "\n":!0, ";":!0, "+":!0, "-":!0, "*":!0, ".*":!0, "/":!0, "./":!0, "%":!0, "^":!0, ".^":!0, "!":!0, "'":!0, "\x3d":!0, ":":!0, 
  "\x3d\x3d":!0, "!\x3d":!0, "\x3c":!0, "\x3e":!0, "\x3c\x3d":!0, "\x3e\x3d":!0}, Y = {mod:!0, to:!0, "in":!0}, Z = {}, X = "", W = 0, D = "", y = "", P = L.NULL;
  a.exports = function(a, b) {
    if (1 != arguments.length && 2 != arguments.length) {
      throw new SyntaxError("Wrong number of arguments: 1 or 2 expected");
    }
    if (Z = "object" === C(b) ? b : {}, I(a)) {
      return X = a || "", k();
    }
    if (z(a) || a instanceof H) {
      return K.deepMap(a, function(a) {
        return X = a || "", k();
      });
    }
    throw new TypeError("String or matrix expected");
  };
}, function(a, b, c) {
  function d(a) {
    if (!(this instanceof d)) {
      throw new SyntaxError("Parser constructor must be called with the new operator");
    }
    if ("object" != typeof a) {
      throw new TypeError("Object expected as parameter math");
    }
    this.math = a;
    this.scope = {};
  }
  var e = c(4);
  d.prototype.parse = function(a) {
    return e(a);
  };
  d.prototype.compile = function(a) {
    return e(a).compile(this.math);
  };
  d.prototype.eval = function(a) {
    return e(a).compile(this.math).eval(this.scope);
  };
  d.prototype.get = function(a) {
    return this.scope[a];
  };
  d.prototype.set = function(a, b) {
    return this.scope[a] = b;
  };
  d.prototype.remove = function(a) {
    delete this.scope[a];
  };
  d.prototype.clear = function() {
    for (var a in this.scope) {
      this.scope.hasOwnProperty(a) && delete this.scope[a];
    }
  };
  a.exports = d;
}, function(a, b, c) {
  b.e = c(118);
  b.E = c(118);
  b["false"] = c(119);
  b.i = c(120);
  b.Infinity = c(121);
  b.LN2 = c(122);
  b.LN10 = c(123);
  b.LOG2E = c(124);
  b.LOG10E = c(125);
  b.NaN = c(126);
  b.pi = c(127);
  b.PI = c(127);
  b.SQRT1_2 = c(128);
  b.SQRT2 = c(129);
  b.tau = c(130);
  b["true"] = c(131);
  b.abs = c(132);
  b.add = c(133);
  b.ceil = c(134);
  b.cube = c(135);
  b.divide = c(136);
  b.edivide = c(137);
  b.emultiply = c(138);
  b.epow = c(139);
  b.equal = c(140);
  b.exp = c(141);
  b.fix = c(142);
  b.floor = c(143);
  b.gcd = c(144);
  b.larger = c(145);
  b.largereq = c(146);
  b.lcm = c(147);
  b.log = c(148);
  b.log10 = c(149);
  b.mod = c(150);
  b.multiply = c(151);
  b.pow = c(152);
  b.round = c(153);
  b.sign = c(154);
  b.smaller = c(155);
  b.smallereq = c(156);
  b.sqrt = c(157);
  b.square = c(158);
  b.subtract = c(159);
  b.unary = c(160);
  b.unequal = c(161);
  b.xgcd = c(162);
  b.arg = c(163);
  b.conj = c(164);
  b.re = c(165);
  b.im = c(166);
  b.bignumber = c(167);
  b["boolean"] = c(168);
  b.complex = c(169);
  b.index = c(170);
  b.matrix = c(171);
  b.number = c(172);
  b.string = c(173);
  b.unit = c(174);
  b.eval = c(175);
  b.help = c(176);
  b.concat = c(177);
  b.det = c(178);
  b.diag = c(179);
  b.eye = c(180);
  b.inv = c(181);
  b.ones = c(182);
  b.range = c(183);
  b.resize = c(184);
  b.size = c(185);
  b.squeeze = c(186);
  b.subset = c(187);
  b.transpose = c(188);
  b.zeros = c(189);
  b.combinations = c(190);
  b.distribution = c(191);
  b.factorial = c(192);
  b.permutations = c(193);
  b.pickRandom = c(194);
  b.random = c(195);
  b.randomInt = c(196);
  b.min = c(197);
  b.mean = c(198);
  b.max = c(199);
  b.acos = c(200);
  b.asin = c(201);
  b.atan = c(202);
  b.atan2 = c(203);
  b.cos = c(204);
  b.cot = c(205);
  b.csc = c(206);
  b.sec = c(207);
  b.sin = c(208);
  b.tan = c(209);
  b.to = c(210);
  b.clone = c(211);
  b.map = c(212);
  b.forEach = c(213);
  b.format = c(214);
  b["import"] = c(215);
  b["typeof"] = c(216);
}, function(a, b, c) {
  function d(a, b) {
    if (!(this instanceof d)) {
      throw new SyntaxError("Complex constructor must be called with the new operator");
    }
    switch(arguments.length) {
      case 0:
        this.im = this.re = 0;
        break;
      case 2:
        if (!n(a) || !n(b)) {
          throw new TypeError("Two numbers expected in Complex constructor");
        }
        this.re = a;
        this.im = b;
        break;
      default:
        if (0 != arguments.length && 2 != arguments.length) {
          throw new SyntaxError("Two or zero arguments expected in Complex constructor");
        }
      ;
    }
  }
  function e() {
    for (;" " == q || "\t" == q;) {
      g();
    }
  }
  function f(a) {
    return "0" <= a && "9" >= a;
  }
  function g() {
    s++;
    q = p.charAt(s);
  }
  function h(a) {
    s = a;
    q = p.charAt(s);
  }
  function k() {
    var a, b = "";
    if (a = s, "+" == q ? g() : "-" == q && (b += q, g()), !("0" <= q && "9" >= q || "." == q)) {
      return h(a), null;
    }
    if ("." == q) {
      if (b += q, g(), !f(q)) {
        return h(a), null;
      }
    } else {
      for (;f(q);) {
        b += q, g();
      }
      "." == q && (b += q, g());
    }
    for (;f(q);) {
      b += q, g();
    }
    if ("E" == q || "e" == q) {
      if (b += q, g(), ("+" == q || "-" == q) && (b += q, g()), !f(q)) {
        return h(a), null;
      }
      for (;f(q);) {
        b += q, g();
      }
    }
    return b;
  }
  function l() {
    var a = p.charAt(s + 1);
    return "I" == q || "i" == q ? (g(), "1") : "+" != q && "-" != q || "I" != a && "i" != a ? null : (a = "+" == q ? "1" : "-1", g(), g(), a);
  }
  c = c(117);
  var m = c.number, n = c.number.isNumber, r = c.string.isString;
  d.isComplex = function(a) {
    return a instanceof d;
  };
  var p, s, q;
  d.parse = function(a) {
    if (p = a, s = -1, q = "", !r(p)) {
      return null;
    }
    g();
    e();
    if (a = k()) {
      if ("I" == q || "i" == q) {
        return g(), e(), q ? null : new d(0, Number(a));
      }
      e();
      var b = q;
      if ("+" != b && "-" != b) {
        return e(), q ? null : new d(Number(a), 0);
      }
      g();
      e();
      var c = k();
      if (c) {
        if ("I" != q && "i" != q) {
          return null;
        }
        g();
      } else {
        if (c = l(), !c) {
          return null;
        }
      }
      return "-" == b && (c = "-" == c[0] ? "+" + c.substring(1) : "-" + c), g(), e(), q ? null : new d(Number(a), Number(c));
    }
    return(a = l()) ? (e(), q ? null : new d(0, Number(a))) : null;
  };
  d.prototype.clone = function() {
    return new d(this.re, this.im);
  };
  d.prototype.equals = function(a) {
    return this.re === a.re && this.im === a.im;
  };
  d.prototype.format = function(a) {
    var b = m.format(this.re, a);
    a = m.format(this.im, a);
    return 0 == this.im ? b : 0 == this.re ? 1 == this.im ? "i" : -1 == this.im ? "-i" : a + "i" : 0 < this.im ? 1 == this.im ? b + " + i" : b + " + " + a + "i" : -1 == this.im ? b + " - i" : b + " - " + a.substring(1) + "i";
  };
  d.prototype.toString = function() {
    return this.format();
  };
  a.exports = d;
  b.isComplex = d.isComplex;
  b.parse = d.parse;
}, function(a, b, c) {
  function d(a, b, c) {
    if (!(this instanceof d)) {
      throw new SyntaxError("Range constructor must be called with the new operator");
    }
    if (null != a && !e.isNumber(a)) {
      throw new TypeError("Parameter start must be a number");
    }
    if (null != b && !e.isNumber(b)) {
      throw new TypeError("Parameter end must be a number");
    }
    if (null != c && !e.isNumber(c)) {
      throw new TypeError("Parameter step must be a number");
    }
    this.start = null != a ? parseFloat(a) : 0;
    this.end = null != b ? parseFloat(b) : 0;
    this.step = null != c ? parseFloat(c) : 1;
  }
  c = c(117);
  var e = c.number, f = c.string;
  c.array;
  d.parse = function(a) {
    if (!f.isString(a)) {
      return null;
    }
    a = a.split(":").map(function(a) {
      return parseFloat(a);
    });
    if (a.some(function(a) {
      return isNaN(a);
    })) {
      return null;
    }
    switch(a.length) {
      case 2:
        return new d(a[0], a[1]);
      case 3:
        return new d(a[0], a[2], a[1]);
      default:
        return null;
    }
  };
  d.prototype.clone = function() {
    return new d(this.start, this.end, this.step);
  };
  d.isRange = function(a) {
    return a instanceof d;
  };
  d.prototype.size = function() {
    var a = 0, b = this.step, c = this.end - this.start;
    return e.sign(b) == e.sign(c) ? a = Math.ceil(c / b) : 0 == c && (a = 0), isNaN(a) && (a = 0), [a];
  };
  d.prototype.min = function() {
    var a = this.size()[0];
    return 0 < a ? 0 < this.step ? this.start : this.start + (a - 1) * this.step : void 0;
  };
  d.prototype.max = function() {
    var a = this.size()[0];
    return 0 < a ? 0 < this.step ? this.start + (a - 1) * this.step : this.start : void 0;
  };
  d.prototype.forEach = function(a) {
    var b = this.start, c = this.step, d = this.end, e = 0;
    if (0 < c) {
      for (;d > b;) {
        a(b, e, this), b += c, e++;
      }
    } else {
      if (0 > c) {
        for (;b > d;) {
          a(b, e, this), b += c, e++;
        }
      }
    }
  };
  d.prototype.map = function(a) {
    var b = [];
    return this.forEach(function(c, d, e) {
      b[d] = a(c, d, e);
    }), b;
  };
  d.prototype.toArray = function() {
    var a = [];
    return this.forEach(function(b, c) {
      a[c] = b;
    }), a;
  };
  d.prototype.valueOf = function() {
    return this.toArray();
  };
  d.prototype.format = function(a) {
    var b = e.format(this.start, a);
    return 1 != this.step && (b += ":" + e.format(this.step, a)), b + (":" + e.format(this.end, a));
  };
  d.prototype.toString = function() {
    return this.format();
  };
  a.exports = d;
  b.isRange = d.isRange;
  b.parse = d.parse;
}, function(a, b, c) {
  function d() {
    if (!(this instanceof d)) {
      throw new SyntaxError("Index constructor must be called with the new operator");
    }
    this._ranges = [];
    for (var a = 0, b = arguments.length;b > a;a++) {
      var c = arguments[a];
      if (c instanceof g) {
        this._ranges.push(c);
      } else {
        if (c && (c = c.valueOf()), m(c)) {
          this._ranges.push(e(c));
        } else {
          if (!k(c)) {
            throw new TypeError("Range expected as Array, Number, or String");
          }
          this._ranges.push(e([c, c + 1]));
        }
      }
    }
  }
  function e(a) {
    for (var b = a.length, c = 0;b > c;c++) {
      if (!k(a[c]) || !l(a[c])) {
        throw new TypeError("Index parameters must be integer numbers");
      }
    }
    switch(a.length) {
      case 2:
        return new g(a[0], a[1]);
      case 3:
        return new g(a[0], a[1], a[2]);
      default:
        throw new SyntaxError("Wrong number of arguments in Index (2 or 3 expected)");;
    }
  }
  var f = c(117), g = c(8), h = f.number, k = h.isNumber, l = h.isInteger, m = Array.isArray;
  f.array.validateIndex;
  d.prototype.clone = function() {
    var a = new d;
    return a._ranges = f.object.clone(this._ranges), a;
  };
  d.isIndex = function(a) {
    return a instanceof d;
  };
  d.create = function(a) {
    var b = new d;
    return d.apply(b, a), b;
  };
  d.prototype.size = function() {
    for (var a = [], b = 0, c = this._ranges.length;c > b;b++) {
      a[b] = this._ranges[b].size()[0];
    }
    return a;
  };
  d.prototype.max = function() {
    for (var a = [], b = 0, c = this._ranges.length;c > b;b++) {
      a[b] = this._ranges[b].max();
    }
    return a;
  };
  d.prototype.min = function() {
    for (var a = [], b = 0, c = this._ranges.length;c > b;b++) {
      a[b] = this._ranges[b].min();
    }
    return a;
  };
  d.prototype.forEach = function(a) {
    for (var b = 0, c = this._ranges.length;c > b;b++) {
      a(this._ranges[b], b, this);
    }
  };
  d.prototype.range = function(a) {
    return this._ranges[a];
  };
  d.prototype.isScalar = function() {
    for (var a = this.size(), b = 0, c = a.length;c > b;b++) {
      if (1 !== a[b]) {
        return!1;
      }
    }
    return!0;
  };
  d.prototype.toArray = function() {
    for (var a = [], b = 0, c = this._ranges.length;c > b;b++) {
      var d = this._ranges[b], e = [], f = d.start, g = d.end, d = d.step;
      if (0 < d) {
        for (;g > f;) {
          e.push(f), f += d;
        }
      } else {
        if (0 > d) {
          for (;f > g;) {
            e.push(f), f += d;
          }
        }
      }
      a.push(e);
    }
    return a;
  };
  d.prototype.valueOf = d.prototype.toArray;
  d.prototype.toString = function() {
    for (var a = [], b = 0, c = this._ranges.length;c > b;b++) {
      var d = this._ranges[b], e = h.format(d.start);
      1 != d.step && (e += ":" + h.format(d.step));
      e += ":" + h.format(d.end);
      a.push(e);
    }
    return "[" + a.join(",") + "]";
  };
  a.exports = d;
  b.isIndex = d.isIndex;
  b.create = d.create;
}, function(a, b, c) {
  function d(a) {
    if (!(this instanceof d)) {
      throw new SyntaxError("Matrix constructor must be called with the new operator");
    }
    if (a instanceof d) {
      this._data = a.clone()._data;
    } else {
      if (s(a)) {
        this._data = k(a);
      } else {
        if (null != a) {
          throw new TypeError("Unsupported type of data (" + l.types.type(a) + ")");
        }
        this._data = [];
      }
    }
    this._size = r.size(this._data);
  }
  function e(a, b, c, d) {
    var f = d == c - 1;
    return b.range(d).map(f ? function(b) {
      return q(b, a.length), a[b];
    } : function(f) {
      q(f, a.length);
      return e(a[f], b, c, d + 1);
    });
  }
  function f(a, b, c, e) {
    if (!(b instanceof m)) {
      throw new TypeError("Invalid index");
    }
    var f, k = b.size(), s = b.isScalar();
    if (c instanceof d ? (f = c.size(), c = c.valueOf()) : f = r.size(c), s) {
      if (0 != f.length) {
        throw new TypeError("Scalar value expected");
      }
      a.set(b.min(), c, e);
    } else {
      if (k.length < a._size.length) {
        throw new RangeError("Dimension mismatch (" + k.length + " \x3c " + a._size.length + ")");
      }
      for (var s = 0, l = k.length - f.length;l > s;s++) {
        c = [c], f.unshift(1);
      }
      if (!p.deepEqual(k, f)) {
        throw new RangeError("Dimensions mismatch (" + n.format(k) + " !\x3d " + n.format(f) + ")");
      }
      f = b.max().map(function(a) {
        return a + 1;
      });
      h(a, f, e);
      g(a._data, b, c, k.length, 0);
    }
    return a;
  }
  function g(a, b, c, d, e) {
    var f = e == d - 1;
    b.range(e).forEach(f ? function(b, d) {
      q(b);
      a[b] = c[d];
    } : function(f, h) {
      q(f);
      g(a[f], b, c[h], d, e + 1);
    });
  }
  function h(a, b, c) {
    if (!s(b)) {
      throw Error("Array expected");
    }
    for (var d = p.clone(a._size), e = !1;d.length < b.length;) {
      d.unshift(0), e = !0;
    }
    for (var f = 0, g = b.length;g > f;f++) {
      b[f] > d[f] && (d[f] = b[f], e = !0);
    }
    e && a.resize(d, c);
  }
  function k(a) {
    for (var b = 0, c = a.length;c > b;b++) {
      var e = a[b];
      s(e) ? a[b] = k(e) : e instanceof d && (a[b] = k(e._data));
    }
    return a;
  }
  var l = c(117), m = c(9), n = (l.number, l.string), r = l.array, p = l.object, s = Array.isArray, q = r.validateIndex;
  d.isMatrix = function(a) {
    return a instanceof d;
  };
  d.prototype.subset = function(a, b, c) {
    switch(arguments.length) {
      case 1:
        var g;
        if (!(a instanceof m)) {
          throw new TypeError("Invalid index");
        }
        if (a.isScalar()) {
          g = this.get(a.min());
        } else {
          g = a.size();
          if (g.length != this._size.length) {
            throw new RangeError("Dimension mismatch (" + g.length + " !\x3d " + this._size.length + ")");
          }
          for (g = new d(e(this._data, a, g.length, 0));s(g._data) && 1 == g._data.length;) {
            g._data = g._data[0], g._size.shift();
          }
        }
        return g;
      case 2:
      ;
      case 3:
        return f(this, a, b, c);
      default:
        throw new SyntaxError("Wrong number of arguments");;
    }
  };
  d.prototype.get = function(a) {
    if (!s(a)) {
      throw Error("Array expected");
    }
    if (a.length != this._size.length) {
      throw new RangeError("Dimension mismatch (" + a.length + " !\x3d " + this._size.length + ")");
    }
    for (var b = this._data, c = 0, d = a.length;d > c;c++) {
      var e = a[c];
      q(e, b.length);
      b = b[e];
    }
    return p.clone(b);
  };
  d.prototype.set = function(a, b, c) {
    var d;
    if (!s(a)) {
      throw Error("Array expected");
    }
    if (a.length < this._size.length) {
      throw new RangeError("Dimension mismatch (" + a.length + " \x3c " + this._size.length + ")");
    }
    d = a.map(function(a) {
      return a + 1;
    });
    h(this, d, c);
    var e = this._data;
    c = 0;
    for (d = a.length - 1;d > c;c++) {
      var f = a[c];
      q(f, e.length);
      e = e[f];
    }
    return f = a[a.length - 1], q(f, e.length), e[f] = b, this;
  };
  d.prototype.resize = function(a, b) {
    return this._size = p.clone(a), this._data = r.resize(this._data, this._size, b), this;
  };
  d.prototype.clone = function() {
    var a = new d;
    return a._data = p.clone(this._data), a._size = p.clone(this._size), a;
  };
  d.prototype.size = function() {
    return this._size;
  };
  d.prototype.map = function(a) {
    var b = this, c = new d, e = [], f = function(c, d) {
      return s(c) ? c.map(function(a, b) {
        return e[d] = b, f(a, d + 1);
      }) : a(c, e, b);
    };
    return c._data = f(this._data, 0), c._size = p.clone(this._size), c;
  };
  d.prototype.forEach = function(a) {
    var b = this, c = [], d = function(e, f) {
      s(e) ? e.forEach(function(a, b) {
        c[f] = b;
        d(a, f + 1);
      }) : a(e, c, b);
    };
    d(this._data, 0);
  };
  d.prototype.toArray = function() {
    return p.clone(this._data);
  };
  d.prototype.valueOf = function() {
    return this._data;
  };
  d.prototype.format = function(a) {
    return n.format(this._data, a);
  };
  d.prototype.toString = function() {
    return n.format(this._data);
  };
  a.exports = d;
  b.isMatrix = d.isMatrix;
}, function(a, b, c) {
  function d(a, b) {
    if (!(this instanceof d)) {
      throw Error("Unit constructor must be called with the new operator");
    }
    if (null != a && !u(a)) {
      throw new TypeError("First parameter in Unit constructor must be a number");
    }
    if (null != b && !x(b)) {
      throw new TypeError("Second parameter in Unit constructor must be a string");
    }
    if (null != b) {
      var c = m(b);
      if (!c) {
        throw new SyntaxError('Unknown unit "' + b + '"');
      }
      this.unit = c.unit;
      this.prefix = c.prefix;
    } else {
      this.unit = UNIT_NONE, this.prefix = v;
    }
    null != a ? (this.value = this._normalize(a), this.fixPrefix = !1) : (this.value = null, this.fixPrefix = !0);
  }
  function e() {
    for (;" " == p || "\t" == p;) {
      g();
    }
  }
  function f(a) {
    return "0" <= a && "9" >= a;
  }
  function g() {
    r++;
    p = n.charAt(r);
  }
  function h(a) {
    r = a;
    p = n.charAt(r);
  }
  function k() {
    var a, b = "";
    if (a = r, "+" == p ? g() : "-" == p && (b += p, g()), !("0" <= p && "9" >= p || "." == p)) {
      return h(a), null;
    }
    if ("." == p) {
      if (b += p, g(), !f(p)) {
        return h(a), null;
      }
    } else {
      for (;f(p);) {
        b += p, g();
      }
      "." == p && (b += p, g());
    }
    for (;f(p);) {
      b += p, g();
    }
    if ("E" == p || "e" == p) {
      if (b += p, g(), ("+" == p || "-" == p) && (b += p, g()), !f(p)) {
        return h(a), null;
      }
      for (;f(p);) {
        b += p, g();
      }
    }
    return b;
  }
  function l() {
    var a = "";
    for (e();p && " " != p && "\t" != p;) {
      a += p, g();
    }
    return a || null;
  }
  function m(a) {
    for (var b in w) {
      if (w.hasOwnProperty(b) && q.endsWith(a, b)) {
        var c = w[b], d = a.substring(0, a.length - b.length), d = c.prefixes[d];
        if (void 0 !== d) {
          return{unit:c, prefix:d};
        }
      }
    }
    return null;
  }
  var n, r, p;
  c = c(117);
  var s = c.number, q = c.string, u = c.number.isNumber, x = c.string.isString;
  d.parse = function(a) {
    if (n = a, r = -1, p = "", !x(n)) {
      return null;
    }
    g();
    e();
    var b;
    return(a = k()) ? (b = l(), g(), e(), p ? null : a && b ? new d(Number(a), b) : null) : (b = l(), g(), e(), p ? null : new d(null, b));
  };
  d.isUnit = function(a) {
    return a instanceof d;
  };
  d.prototype.clone = function() {
    var a = new d, b;
    for (b in this) {
      this.hasOwnProperty(b) && (a[b] = this[b]);
    }
    return a;
  };
  d.prototype._normalize = function(a) {
    return(a + this.unit.offset) * this.unit.value * this.prefix.value;
  };
  d.prototype._unnormalize = function(a, b) {
    return void 0 == b ? a / this.unit.value / this.prefix.value - this.unit.offset : a / this.unit.value / b - this.unit.offset;
  };
  d.isPlainUnit = function(a) {
    return null != m(a);
  };
  d.prototype.hasBase = function(a) {
    return void 0 === this.unit.base ? void 0 === a : this.unit.base === a;
  };
  d.prototype.equalBase = function(a) {
    return this.unit.base === a.unit.base;
  };
  d.prototype.equals = function(a) {
    return this.equalBase(a) && this.value == a.value;
  };
  d.prototype.to = function(a) {
    var b;
    if (x(a)) {
      if (b = new d(null, a), !this.equalBase(b)) {
        throw Error("Units do not match");
      }
      return b.value = this.value, b;
    }
    if (a instanceof d) {
      if (!this.equalBase(a)) {
        throw Error("Units do not match");
      }
      if (null != a.value) {
        throw Error("Cannot convert to a unit with a value");
      }
      if (null == a.unit) {
        throw Error("Unit expected on the right hand side of function in");
      }
      return b = a.clone(), b.value = this.value, b.fixPrefix = !0, b;
    }
    throw Error("String or Unit expected as parameter");
  };
  d.prototype.toNumber = function(a) {
    a = this.to(a);
    var b = this.fixPrefix ? a._bestPrefix() : a.prefix;
    return a._unnormalize(a.value, b.value);
  };
  d.prototype.toString = function() {
    return this.format();
  };
  d.prototype.format = function(a) {
    var b;
    if (this.fixPrefix) {
      b = this._unnormalize(this.value), a = null != this.value ? s.format(b, a) + " " : "", a += this.prefix.name + this.unit.name;
    } else {
      var c = this._bestPrefix();
      b = this._unnormalize(this.value, c.value);
      a = null != this.value ? s.format(b, a) + " " : "";
      a += c.name + this.unit.name;
    }
    return a;
  };
  d.prototype._bestPrefix = function() {
    var a = Math.abs(this.value / this.unit.value), b = v, c = Math.abs(Math.log(a / b.value) / Math.LN10 - 1.2), d = this.unit.prefixes, e;
    for (e in d) {
      if (d.hasOwnProperty(e)) {
        var f = d[e];
        if (f.scientific) {
          var g = Math.abs(Math.log(a / f.value) / Math.LN10 - 1.2);
          c > g && (b = f, c = g);
        }
      }
    }
    return b;
  };
  c = {NONE:{"":{name:"", value:1, scientific:!0}}, SHORT:{"":{name:"", value:1, scientific:!0}, da:{name:"da", value:10, scientific:!1}, h:{name:"h", value:100, scientific:!1}, k:{name:"k", value:1E3, scientific:!0}, M:{name:"M", value:1E6, scientific:!0}, G:{name:"G", value:1E9, scientific:!0}, T:{name:"T", value:1E12, scientific:!0}, P:{name:"P", value:1E15, scientific:!0}, E:{name:"E", value:1E18, scientific:!0}, Z:{name:"Z", value:1E21, scientific:!0}, Y:{name:"Y", value:1E24, scientific:!0}, 
  d:{name:"d", value:0.1, scientific:!1}, c:{name:"c", value:0.01, scientific:!1}, m:{name:"m", value:0.001, scientific:!0}, u:{name:"u", value:1E-6, scientific:!0}, n:{name:"n", value:1E-9, scientific:!0}, p:{name:"p", value:1E-12, scientific:!0}, f:{name:"f", value:1E-15, scientific:!0}, a:{name:"a", value:1E-18, scientific:!0}, z:{name:"z", value:1E-21, scientific:!0}, y:{name:"y", value:1E-24, scientific:!0}}, LONG:{"":{name:"", value:1, scientific:!0}, deca:{name:"deca", value:10, scientific:!1}, 
  hecto:{name:"hecto", value:100, scientific:!1}, kilo:{name:"kilo", value:1E3, scientific:!0}, mega:{name:"mega", value:1E6, scientific:!0}, giga:{name:"giga", value:1E9, scientific:!0}, tera:{name:"tera", value:1E12, scientific:!0}, peta:{name:"peta", value:1E15, scientific:!0}, exa:{name:"exa", value:1E18, scientific:!0}, zetta:{name:"zetta", value:1E21, scientific:!0}, yotta:{name:"yotta", value:1E24, scientific:!0}, deci:{name:"deci", value:0.1, scientific:!1}, centi:{name:"centi", value:0.01, 
  scientific:!1}, milli:{name:"milli", value:0.001, scientific:!0}, micro:{name:"micro", value:1E-6, scientific:!0}, nano:{name:"nano", value:1E-9, scientific:!0}, pico:{name:"pico", value:1E-12, scientific:!0}, femto:{name:"femto", value:1E-15, scientific:!0}, atto:{name:"atto", value:1E-18, scientific:!0}, zepto:{name:"zepto", value:1E-21, scientific:!0}, yocto:{name:"yocto", value:1E-24, scientific:!0}}, SQUARED:{"":{name:"", value:1, scientific:!0}, da:{name:"da", value:100, scientific:!1}, h:{name:"h", 
  value:1E4, scientific:!1}, k:{name:"k", value:1E6, scientific:!0}, M:{name:"M", value:1E12, scientific:!0}, G:{name:"G", value:1E18, scientific:!0}, T:{name:"T", value:1E24, scientific:!0}, P:{name:"P", value:1E30, scientific:!0}, E:{name:"E", value:1E36, scientific:!0}, Z:{name:"Z", value:1E42, scientific:!0}, Y:{name:"Y", value:1E48, scientific:!0}, d:{name:"d", value:0.01, scientific:!1}, c:{name:"c", value:1E-4, scientific:!1}, m:{name:"m", value:1E-6, scientific:!0}, u:{name:"u", value:1E-12, 
  scientific:!0}, n:{name:"n", value:1E-18, scientific:!0}, p:{name:"p", value:1E-24, scientific:!0}, f:{name:"f", value:1E-30, scientific:!0}, a:{name:"a", value:1E-36, scientific:!0}, z:{name:"z", value:1E-42, scientific:!0}, y:{name:"y", value:1E-42, scientific:!0}}, CUBIC:{"":{name:"", value:1, scientific:!0}, da:{name:"da", value:1E3, scientific:!1}, h:{name:"h", value:1E6, scientific:!1}, k:{name:"k", value:1E9, scientific:!0}, M:{name:"M", value:1E18, scientific:!0}, G:{name:"G", value:1E27, 
  scientific:!0}, T:{name:"T", value:1E36, scientific:!0}, P:{name:"P", value:1E45, scientific:!0}, E:{name:"E", value:1E54, scientific:!0}, Z:{name:"Z", value:1E63, scientific:!0}, Y:{name:"Y", value:1E72, scientific:!0}, d:{name:"d", value:0.001, scientific:!1}, c:{name:"c", value:1E-6, scientific:!1}, m:{name:"m", value:1E-9, scientific:!0}, u:{name:"u", value:1E-18, scientific:!0}, n:{name:"n", value:1E-27, scientific:!0}, p:{name:"p", value:1E-36, scientific:!0}, f:{name:"f", value:1E-45, scientific:!0}, 
  a:{name:"a", value:1E-54, scientific:!0}, z:{name:"z", value:1E-63, scientific:!0}, y:{name:"y", value:1E-72, scientific:!0}}, BINARY_SHORT:{"":{name:"", value:1, scientific:!0}, k:{name:"k", value:1024, scientific:!0}, M:{name:"M", value:Math.pow(1024, 2), scientific:!0}, G:{name:"G", value:Math.pow(1024, 3), scientific:!0}, T:{name:"T", value:Math.pow(1024, 4), scientific:!0}, P:{name:"P", value:Math.pow(1024, 5), scientific:!0}, E:{name:"E", value:Math.pow(1024, 6), scientific:!0}, Z:{name:"Z", 
  value:Math.pow(1024, 7), scientific:!0}, Y:{name:"Y", value:Math.pow(1024, 8), scientific:!0}, Ki:{name:"Ki", value:1024, scientific:!0}, Mi:{name:"Mi", value:Math.pow(1024, 2), scientific:!0}, Gi:{name:"Gi", value:Math.pow(1024, 3), scientific:!0}, Ti:{name:"Ti", value:Math.pow(1024, 4), scientific:!0}, Pi:{name:"Pi", value:Math.pow(1024, 5), scientific:!0}, Ei:{name:"Ei", value:Math.pow(1024, 6), scientific:!0}, Zi:{name:"Zi", value:Math.pow(1024, 7), scientific:!0}, Yi:{name:"Yi", value:Math.pow(1024, 
  8), scientific:!0}}, BINARY_LONG:{"":{name:"", value:1, scientific:!0}, kilo:{name:"kilo", value:1024, scientific:!0}, mega:{name:"mega", value:Math.pow(1024, 2), scientific:!0}, giga:{name:"giga", value:Math.pow(1024, 3), scientific:!0}, tera:{name:"tera", value:Math.pow(1024, 4), scientific:!0}, peta:{name:"peta", value:Math.pow(1024, 5), scientific:!0}, exa:{name:"exa", value:Math.pow(1024, 6), scientific:!0}, zetta:{name:"zetta", value:Math.pow(1024, 7), scientific:!0}, yotta:{name:"yotta", 
  value:Math.pow(1024, 8), scientific:!0}, kibi:{name:"kibi", value:1024, scientific:!0}, mebi:{name:"mebi", value:Math.pow(1024, 2), scientific:!0}, gibi:{name:"gibi", value:Math.pow(1024, 3), scientific:!0}, tebi:{name:"tebi", value:Math.pow(1024, 4), scientific:!0}, pebi:{name:"pebi", value:Math.pow(1024, 5), scientific:!0}, exi:{name:"exi", value:Math.pow(1024, 6), scientific:!0}, zebi:{name:"zebi", value:Math.pow(1024, 7), scientific:!0}, yobi:{name:"yobi", value:Math.pow(1024, 8), scientific:!0}}};
  var v = {name:"", value:1, scientific:!0}, t = {NONE:{}, LENGTH:{}, MASS:{}, TIME:{}, CURRENT:{}, TEMPERATURE:{}, LUMINOUS_INTENSITY:{}, AMOUNT_OF_SUBSTANCE:{}, FORCE:{}, SURFACE:{}, VOLUME:{}, ANGLE:{}, BIT:{}};
  BASE_UNIT_NONE = {};
  UNIT_NONE = {name:"", base:BASE_UNIT_NONE, value:1, offset:0};
  var w = {meter:{name:"meter", base:t.LENGTH, prefixes:c.LONG, value:1, offset:0}, inch:{name:"inch", base:t.LENGTH, prefixes:c.NONE, value:0.0254, offset:0}, foot:{name:"foot", base:t.LENGTH, prefixes:c.NONE, value:0.3048, offset:0}, yard:{name:"yard", base:t.LENGTH, prefixes:c.NONE, value:0.9144, offset:0}, mile:{name:"mile", base:t.LENGTH, prefixes:c.NONE, value:1609.344, offset:0}, link:{name:"link", base:t.LENGTH, prefixes:c.NONE, value:0.201168, offset:0}, rod:{name:"rod", base:t.LENGTH, prefixes:c.NONE, 
  value:5.02921, offset:0}, chain:{name:"chain", base:t.LENGTH, prefixes:c.NONE, value:20.1168, offset:0}, angstrom:{name:"angstrom", base:t.LENGTH, prefixes:c.NONE, value:1E-10, offset:0}, m:{name:"m", base:t.LENGTH, prefixes:c.SHORT, value:1, offset:0}, "in":{name:"in", base:t.LENGTH, prefixes:c.NONE, value:0.0254, offset:0}, ft:{name:"ft", base:t.LENGTH, prefixes:c.NONE, value:0.3048, offset:0}, yd:{name:"yd", base:t.LENGTH, prefixes:c.NONE, value:0.9144, offset:0}, mi:{name:"mi", base:t.LENGTH, 
  prefixes:c.NONE, value:1609.344, offset:0}, li:{name:"li", base:t.LENGTH, prefixes:c.NONE, value:0.201168, offset:0}, rd:{name:"rd", base:t.LENGTH, prefixes:c.NONE, value:5.02921, offset:0}, ch:{name:"ch", base:t.LENGTH, prefixes:c.NONE, value:20.1168, offset:0}, mil:{name:"mil", base:t.LENGTH, prefixes:c.NONE, value:2.54E-5, offset:0}, m2:{name:"m2", base:t.SURFACE, prefixes:c.SQUARED, value:1, offset:0}, sqin:{name:"sqin", base:t.SURFACE, prefixes:c.NONE, value:6.4516E-4, offset:0}, sqft:{name:"sqft", 
  base:t.SURFACE, prefixes:c.NONE, value:0.09290304, offset:0}, sqyd:{name:"sqyd", base:t.SURFACE, prefixes:c.NONE, value:0.83612736, offset:0}, sqmi:{name:"sqmi", base:t.SURFACE, prefixes:c.NONE, value:2589988.110336, offset:0}, sqrd:{name:"sqrd", base:t.SURFACE, prefixes:c.NONE, value:25.29295, offset:0}, sqch:{name:"sqch", base:t.SURFACE, prefixes:c.NONE, value:404.6873, offset:0}, sqmil:{name:"sqmil", base:t.SURFACE, prefixes:c.NONE, value:6.4516E-10, offset:0}, m3:{name:"m3", base:t.VOLUME, 
  prefixes:c.CUBIC, value:1, offset:0}, L:{name:"L", base:t.VOLUME, prefixes:c.SHORT, value:0.001, offset:0}, l:{name:"l", base:t.VOLUME, prefixes:c.SHORT, value:0.001, offset:0}, litre:{name:"litre", base:t.VOLUME, prefixes:c.LONG, value:0.001, offset:0}, cuin:{name:"cuin", base:t.VOLUME, prefixes:c.NONE, value:1.6387064E-5, offset:0}, cuft:{name:"cuft", base:t.VOLUME, prefixes:c.NONE, value:0.028316846592, offset:0}, cuyd:{name:"cuyd", base:t.VOLUME, prefixes:c.NONE, value:0.764554857984, offset:0}, 
  teaspoon:{name:"teaspoon", base:t.VOLUME, prefixes:c.NONE, value:5E-6, offset:0}, tablespoon:{name:"tablespoon", base:t.VOLUME, prefixes:c.NONE, value:1.5E-5, offset:0}, minim:{name:"minim", base:t.VOLUME, prefixes:c.NONE, value:6.161152E-8, offset:0}, fluiddram:{name:"fluiddram", base:t.VOLUME, prefixes:c.NONE, value:3.6966911E-6, offset:0}, fluidounce:{name:"fluidounce", base:t.VOLUME, prefixes:c.NONE, value:2.957353E-5, offset:0}, gill:{name:"gill", base:t.VOLUME, prefixes:c.NONE, value:1.182941E-4, 
  offset:0}, cc:{name:"cc", base:t.VOLUME, prefixes:c.NONE, value:1E-6, offset:0}, cup:{name:"cup", base:t.VOLUME, prefixes:c.NONE, value:2.365882E-4, offset:0}, pint:{name:"pint", base:t.VOLUME, prefixes:c.NONE, value:4.731765E-4, offset:0}, quart:{name:"quart", base:t.VOLUME, prefixes:c.NONE, value:9.463529E-4, offset:0}, gallon:{name:"gallon", base:t.VOLUME, prefixes:c.NONE, value:0.003785412, offset:0}, beerbarrel:{name:"beerbarrel", base:t.VOLUME, prefixes:c.NONE, value:0.1173478, offset:0}, 
  oilbarrel:{name:"oilbarrel", base:t.VOLUME, prefixes:c.NONE, value:0.1589873, offset:0}, hogshead:{name:"hogshead", base:t.VOLUME, prefixes:c.NONE, value:0.238481, offset:0}, fldr:{name:"fldr", base:t.VOLUME, prefixes:c.NONE, value:3.6966911E-6, offset:0}, floz:{name:"floz", base:t.VOLUME, prefixes:c.NONE, value:2.957353E-5, offset:0}, gi:{name:"gi", base:t.VOLUME, prefixes:c.NONE, value:1.182941E-4, offset:0}, cp:{name:"cp", base:t.VOLUME, prefixes:c.NONE, value:2.365882E-4, offset:0}, pt:{name:"pt", 
  base:t.VOLUME, prefixes:c.NONE, value:4.731765E-4, offset:0}, qt:{name:"qt", base:t.VOLUME, prefixes:c.NONE, value:9.463529E-4, offset:0}, gal:{name:"gal", base:t.VOLUME, prefixes:c.NONE, value:0.003785412, offset:0}, bbl:{name:"bbl", base:t.VOLUME, prefixes:c.NONE, value:0.1173478, offset:0}, obl:{name:"obl", base:t.VOLUME, prefixes:c.NONE, value:0.1589873, offset:0}, g:{name:"g", base:t.MASS, prefixes:c.SHORT, value:0.001, offset:0}, gram:{name:"gram", base:t.MASS, prefixes:c.LONG, value:0.001, 
  offset:0}, ton:{name:"ton", base:t.MASS, prefixes:c.SHORT, value:907.18474, offset:0}, tonne:{name:"tonne", base:t.MASS, prefixes:c.SHORT, value:1E3, offset:0}, grain:{name:"grain", base:t.MASS, prefixes:c.NONE, value:6.479891E-5, offset:0}, dram:{name:"dram", base:t.MASS, prefixes:c.NONE, value:0.0017718451953125, offset:0}, ounce:{name:"ounce", base:t.MASS, prefixes:c.NONE, value:0.028349523125, offset:0}, poundmass:{name:"poundmass", base:t.MASS, prefixes:c.NONE, value:0.45359237, offset:0}, 
  hundredweight:{name:"hundredweight", base:t.MASS, prefixes:c.NONE, value:45.359237, offset:0}, stick:{name:"stick", base:t.MASS, prefixes:c.NONE, value:0.115, offset:0}, gr:{name:"gr", base:t.MASS, prefixes:c.NONE, value:6.479891E-5, offset:0}, dr:{name:"dr", base:t.MASS, prefixes:c.NONE, value:0.0017718451953125, offset:0}, oz:{name:"oz", base:t.MASS, prefixes:c.NONE, value:0.028349523125, offset:0}, lbm:{name:"lbm", base:t.MASS, prefixes:c.NONE, value:0.45359237, offset:0}, cwt:{name:"cwt", base:t.MASS, 
  prefixes:c.NONE, value:45.359237, offset:0}, s:{name:"s", base:t.TIME, prefixes:c.SHORT, value:1, offset:0}, min:{name:"min", base:t.TIME, prefixes:c.NONE, value:60, offset:0}, h:{name:"h", base:t.TIME, prefixes:c.NONE, value:3600, offset:0}, second:{name:"second", base:t.TIME, prefixes:c.LONG, value:1, offset:0}, sec:{name:"sec", base:t.TIME, prefixes:c.LONG, value:1, offset:0}, minute:{name:"minute", base:t.TIME, prefixes:c.NONE, value:60, offset:0}, hour:{name:"hour", base:t.TIME, prefixes:c.NONE, 
  value:3600, offset:0}, day:{name:"day", base:t.TIME, prefixes:c.NONE, value:86400, offset:0}, rad:{name:"rad", base:t.ANGLE, prefixes:c.NONE, value:1, offset:0}, deg:{name:"deg", base:t.ANGLE, prefixes:c.NONE, value:0.017453292519943295, offset:0}, grad:{name:"grad", base:t.ANGLE, prefixes:c.NONE, value:0.015707963267948967, offset:0}, cycle:{name:"cycle", base:t.ANGLE, prefixes:c.NONE, value:6.283185307179586, offset:0}, A:{name:"A", base:t.CURRENT, prefixes:c.SHORT, value:1, offset:0}, ampere:{name:"ampere", 
  base:t.CURRENT, prefixes:c.LONG, value:1, offset:0}, K:{name:"K", base:t.TEMPERATURE, prefixes:c.NONE, value:1, offset:0}, degC:{name:"degC", base:t.TEMPERATURE, prefixes:c.NONE, value:1, offset:273.15}, degF:{name:"degF", base:t.TEMPERATURE, prefixes:c.NONE, value:1 / 1.8, offset:459.67}, degR:{name:"degR", base:t.TEMPERATURE, prefixes:c.NONE, value:1 / 1.8, offset:0}, kelvin:{name:"kelvin", base:t.TEMPERATURE, prefixes:c.NONE, value:1, offset:0}, celsius:{name:"celsius", base:t.TEMPERATURE, prefixes:c.NONE, 
  value:1, offset:273.15}, fahrenheit:{name:"fahrenheit", base:t.TEMPERATURE, prefixes:c.NONE, value:1 / 1.8, offset:459.67}, rankine:{name:"rankine", base:t.TEMPERATURE, prefixes:c.NONE, value:1 / 1.8, offset:0}, mol:{name:"mol", base:t.AMOUNT_OF_SUBSTANCE, prefixes:c.NONE, value:1, offset:0}, mole:{name:"mole", base:t.AMOUNT_OF_SUBSTANCE, prefixes:c.NONE, value:1, offset:0}, cd:{name:"cd", base:t.LUMINOUS_INTENSITY, prefixes:c.NONE, value:1, offset:0}, candela:{name:"candela", base:t.LUMINOUS_INTENSITY, 
  prefixes:c.NONE, value:1, offset:0}, N:{name:"N", base:t.FORCE, prefixes:c.SHORT, value:1, offset:0}, newton:{name:"newton", base:t.FORCE, prefixes:c.LONG, value:1, offset:0}, lbf:{name:"lbf", base:t.FORCE, prefixes:c.NONE, value:4.4482216152605, offset:0}, poundforce:{name:"poundforce", base:t.FORCE, prefixes:c.NONE, value:4.4482216152605, offset:0}, b:{name:"b", base:t.BIT, prefixes:c.BINARY_SHORT, value:1, offset:0}, bits:{name:"bits", base:t.BIT, prefixes:c.BINARY_LONG, value:1, offset:0}, 
  B:{name:"B", base:t.BIT, prefixes:c.BINARY_SHORT, value:8, offset:0}, bytes:{name:"bytes", base:t.BIT, prefixes:c.BINARY_LONG, value:8, offset:0}}, B = {meters:"meter", inches:"inch", feet:"foot", yards:"yard", miles:"mile", links:"link", rods:"rod", chains:"chain", angstroms:"angstrom", litres:"litre", teaspoons:"teaspoon", tablespoons:"tablespoon", minims:"minim", fluiddrams:"fluiddram", fluidounces:"fluidounce", gills:"gill", cups:"cup", pints:"pint", quarts:"quart", gallons:"gallon", beerbarrels:"beerbarrel", 
  oilbarrels:"oilbarrel", hogsheads:"hogshead", grams:"gram", tons:"ton", tonnes:"tonne", grains:"grain", drams:"dram", ounces:"ounce", poundmasses:"poundmass", hundredweights:"hundredweight", sticks:"stick", seconds:"second", minutes:"minute", hours:"hour", days:"day", radians:"rad", degrees:"deg", gradients:"grad", cycles:"cycle", amperes:"ampere", moles:"mole"}, A;
  for (A in B) {
    if (B.hasOwnProperty(A)) {
      var I = Object.create(w[B[A]]);
      I.name = A;
      w[A] = I;
    }
  }
  w.lt = w.l;
  w.liter = w.litre;
  w.liters = w.litres;
  w.lb = w.lbm;
  d.PREFIXES = c;
  d.BASE_UNITS = t;
  d.UNITS = w;
  a.exports = d;
  b.isUnit = d.isUnit;
  b.isPlainUnit = d.isPlainUnit;
  b.parse = d.parse;
}, function(a, b, c) {
  function d(a, b) {
    this.math = a;
    this.doc = b;
  }
  c = c(117);
  var e = c.object, f = c.string;
  d.isHelp = function(a) {
    return a instanceof d;
  };
  d.prototype.toString = function() {
    var a = this.doc || {}, b = "\n";
    if (a.name && (b += "Name: " + a.name + "\n\n"), a.category && (b += "Category: " + a.category + "\n\n"), a.description && (b += "Description:\n    " + a.description + "\n\n"), a.syntax && (b += "Syntax:\n    " + a.syntax.join("\n    ") + "\n\n"), a.examples) {
      for (var c = this.math.parser(), b = b + "Examples:\n", e = 0;e < a.examples.length;e++) {
        var m, n = a.examples[e];
        try {
          m = c.eval(n);
        } catch (r) {
          m = r;
        }
        b += "    " + n + "\n";
        !m || m instanceof d || (b += "        " + f.format(m) + "\n");
      }
      b += "\n";
    }
    return a.seealso && (b += "See also: " + a.seealso.join(", ") + "\n"), b;
  };
  d.prototype.toJSON = function() {
    return e.extend({}, this.doc);
  };
  a.exports = d;
  b.isHelp = d.isHelp;
}, function(a, b, c) {
  function d(a, b, c) {
    var e, m;
    if (0 >= b) {
      if (f(a[0])) {
        var n = a.length, r = a[0].length, p = [];
        for (m = 0;r > m;m++) {
          var s = [];
          for (e = 0;n > e;e++) {
            s.push(a[e][m]);
          }
          p.push(s);
        }
        m = [];
        for (e = 0;e < p.length;e++) {
          m[e] = d(p[e], b - 1, c);
        }
        return m;
      }
      b = a[0];
      for (e = 1;e < a.length;e++) {
        b = c(b, a[e]);
      }
      return b;
    }
    m = [];
    for (e = 0;e < a.length;e++) {
      m[e] = d(a[e], b - 1, c);
    }
    return m;
  }
  a = c(117);
  var e = c(10), f = a.array.isArray;
  a.string.isString;
  b.argsToArray = function(a) {
    var b;
    return 0 == a.length ? b = [] : 1 == a.length ? (b = a[0], b instanceof e && (b = b.valueOf()), f(b) || (b = [b])) : b = Array.prototype.slice.apply(a), b;
  };
  b.isCollection = function(a) {
    return f(a) || a instanceof e;
  };
  b.deepMap = function h(a, b) {
    return a && "function" == typeof a.map ? a.map(function(a) {
      return h(a, b);
    }) : b(a);
  };
  b.deepMap2 = function k(a, b, c) {
    var d, p, s;
    if (f(a)) {
      if (f(b)) {
        if (a.length != b.length) {
          throw new RangeError("Dimension mismatch (" + a.length + " !\x3d " + b.length + ")");
        }
        d = [];
        p = a.length;
        for (s = 0;p > s;s++) {
          d[s] = k(a[s], b[s], c);
        }
      } else {
        if (b instanceof e) {
          return d = k(a, b.valueOf(), c), new e(d);
        }
        d = [];
        p = a.length;
        for (s = 0;p > s;s++) {
          d[s] = k(a[s], b, c);
        }
      }
    } else {
      if (a instanceof e) {
        return b instanceof e ? (d = k(a.valueOf(), b.valueOf(), c), new e(d)) : (d = k(a.valueOf(), b, c), new e(d));
      }
      if (f(b)) {
        for (d = [], p = b.length, s = 0;p > s;s++) {
          d[s] = k(a, b[s], c);
        }
      } else {
        if (b instanceof e) {
          return d = k(a, b.valueOf(), c), new e(d);
        }
        d = c(a, b);
      }
    }
    return d;
  };
  b.reduce = function(a, b, c) {
    return a instanceof e ? new e(d(a.valueOf(), b, c)) : d(a, b, c);
  };
  b.deepForEach = function l(a, b) {
    a instanceof e && (a = a.valueOf());
    for (var c = 0, d = a.length;d > c;c++) {
      var s = a[c];
      f(s) ? l(s, b) : b(s);
    }
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = (c(217), {});
    a.error = b;
    b.UnsupportedTypeError = function(b, c) {
      if (2 == arguments.length) {
        var e = a["typeof"](c);
        this.message = "Function " + b + "(" + e + ") not supported";
      } else {
        2 < arguments.length ? (e = Array.prototype.splice.call(arguments, 1).map(function(b) {
          return a["typeof"](b);
        }), this.message = "Function " + b + "(" + e.join(", ") + ") not supported") : this.message = "Unsupported type of argument in function " + b;
      }
      this.stack = Error().stack;
    };
    b.UnsupportedTypeError.prototype = new TypeError;
    b.UnsupportedTypeError.prototype.constructor = TypeError;
    b.UnsupportedTypeError.prototype.name = "UnsupportedTypeError";
    b.ArgumentsError = function(a, b, c, d) {
      this.message = "Wrong number of arguments in function " + a + " (" + b + " provided, " + c + (void 0 != d ? "-" + d : "") + " expected)";
      this.stack = Error().stack;
    };
    b.ArgumentsError.prototype = Error();
    b.ArgumentsError.prototype.constructor = Error;
    b.ArgumentsError.prototype.name = "ArgumentError";
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(4), g = c(13), h = b.string.isString, k = g.isCollection;
    a.compile = function(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("compile", arguments.length, 1);
      }
      if (h(b)) {
        return f(b).compile(a);
      }
      if (k(b)) {
        return g.deepMap(b, function(b) {
          return f(b).compile(a);
        });
      }
      throw new TypeError("String, array, or matrix expected");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(4), g = c(13), h = b.string.isString, k = g.isCollection;
    a.eval = function(b, c) {
      if (1 != arguments.length && 2 != arguments.length) {
        throw new a.error.ArgumentsError("eval", arguments.length, 1, 2);
      }
      if (c = c || {}, h(b)) {
        return f(b).compile(a).eval(c);
      }
      if (k(b)) {
        return g.deepMap(b, function(b) {
          return f(b).compile(a).eval(c);
        });
      }
      throw new TypeError("String, array, or matrix expected");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(12);
    a.help = function(c) {
      if (1 != arguments.length) {
        throw new SyntaxError("Wrong number of arguments in function help (" + arguments.length + " provided, 1 expected)");
      }
      var g = null;
      if (c instanceof String || "string" == typeof c) {
        g = c;
      } else {
        for (var h in a) {
          if (a.hasOwnProperty(h) && c === a[h]) {
            g = h;
            break;
          }
        }
        if (!g) {
          for (h in a.type) {
            if (a.type.hasOwnProperty(h) && c === a.type[h]) {
              g = h;
              break;
            }
          }
        }
      }
      if (g) {
        h = a.expression.docs[g];
        if (!h) {
          throw Error('No documentation found on "' + g + '"');
        }
        return new b(a, h);
      }
      throw Error('Could not find search term "' + c + '"');
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(4);
    a.parse = function() {
      return b.apply(b, arguments);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = (c(10), c(13)), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.abs = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("abs", arguments.length, 1);
      }
      if (k(b)) {
        return Math.abs(b);
      }
      if (m(b)) {
        return Math.sqrt(b.re * b.re + b.im * b.im);
      }
      if (b instanceof f) {
        return b.abs();
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return Math.abs(b);
      }
      throw new a.error.UnsupportedTypeError("abs", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = (c(10), c(11)), k = c(13), l = b["boolean"].isBoolean, m = b.number.isNumber, n = b.number.toNumber, r = b.number.toBigNumber, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.add = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("add", arguments.length, 2);
      }
      if (m(b)) {
        if (m(c)) {
          return b + c;
        }
        if (s(c)) {
          return new g(b + c.re, c.im);
        }
      }
      if (s(b)) {
        if (s(c)) {
          return new g(b.re + c.re, b.im + c.im);
        }
        if (m(c)) {
          return new g(b.re + c, b.im);
        }
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Units do not match");
        }
        if (null == b.value) {
          throw Error("Unit on left hand side of operator + has an undefined value");
        }
        if (null == c.value) {
          throw Error("Unit on right hand side of operator + has an undefined value");
        }
        var e = b.clone();
        return e.value += c.value, e.fixPrefix = !1, e;
      }
      if (b instanceof f) {
        return m(c) ? c = r(c) : l(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.plus(c) : v(n(b), c);
      }
      if (c instanceof f) {
        return m(b) ? b = r(b) : l(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.plus(c) : v(b, n(c));
      }
      if (p(b) || p(c)) {
        return b + c;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (l(b)) {
        return v(+b, c);
      }
      if (l(c)) {
        return v(b, +c);
      }
      throw new a.error.UnsupportedTypeError("add", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = h.isCollection, n = g.isComplex;
    a.ceil = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("ceil", arguments.length, 1);
      }
      if (k(b)) {
        return Math.ceil(b);
      }
      if (n(b)) {
        return new g(Math.ceil(b.re), Math.ceil(b.im));
      }
      if (b instanceof f) {
        return b.ceil();
      }
      if (m(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return Math.ceil(b);
      }
      throw new a.error.UnsupportedTypeError("ceil", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.cube = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("cube", arguments.length, 1);
      }
      if (k(b)) {
        return b * b * b;
      }
      if (m(b)) {
        return a.multiply(a.multiply(b, b), b);
      }
      if (b instanceof f) {
        return b.times(b).times(b);
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return p(+b);
      }
      throw new a.error.UnsupportedTypeError("cube", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      var d = c.re * c.re + c.im * c.im;
      return 0 != d ? new h((a.re * c.re + a.im * c.im) / d, (a.im * c.re - a.re * c.im) / d) : new h(0 != a.re ? a.re / 0 : 0, 0 != a.im ? a.im / 0 : 0);
    }
    var f = c(117), g = c(220), h = c(7), k = (c(10), c(11)), l = c(13), m = f.number.isNumber, n = f.number.toNumber, r = f.number.toBigNumber, p = f["boolean"].isBoolean, s = h.isComplex, q = k.isUnit, u = l.isCollection;
    a.divide = function v(c, f) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("divide", arguments.length, 2);
      }
      if (m(c)) {
        if (m(f)) {
          return c / f;
        }
        if (s(f)) {
          return b(new h(c, 0), f);
        }
      }
      if (s(c)) {
        if (s(f)) {
          return b(c, f);
        }
        if (m(f)) {
          return b(c, new h(f, 0));
        }
      }
      if (c instanceof g) {
        return m(f) ? f = r(f) : p(f) && (f = new g(f ? 1 : 0)), f instanceof g ? c.div(f) : v(n(c), f);
      }
      if (f instanceof g) {
        return m(c) ? c = r(c) : p(c) && (c = new g(c ? 1 : 0)), c instanceof g ? c.div(f) : v(c, n(f));
      }
      if (q(c) && m(f)) {
        var k = c.clone();
        return k.value /= f, k;
      }
      if (u(c)) {
        return u(f) ? a.multiply(c, a.inv(f)) : l.deepMap2(c, f, v);
      }
      if (u(f)) {
        return a.multiply(c, a.inv(f));
      }
      if (p(c)) {
        return v(+c, f);
      }
      if (p(f)) {
        return v(c, +f);
      }
      throw new a.error.UnsupportedTypeError("divide", c, f);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(13);
    a.edivide = function(c, g) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("edivide", arguments.length, 2);
      }
      return b.deepMap2(c, g, a.divide);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(13);
    a.emultiply = function(c, g) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("emultiply", arguments.length, 2);
      }
      return b.deepMap2(c, g, a.multiply);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(13);
    a.epow = function(c, g) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("epow", arguments.length, 2);
      }
      return b.deepMap2(c, g, a.pow);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.equal = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("equal", arguments.length, 2);
      }
      if (l(b)) {
        if (l(c)) {
          return b == c;
        }
        if (s(c)) {
          return b == c.re && 0 == c.im;
        }
      }
      if (s(b)) {
        if (l(c)) {
          return b.re == c && 0 == b.im;
        }
        if (s(c)) {
          return b.re == c.re && b.im == c.im;
        }
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.eq(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.eq(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value == c.value;
      }
      if (p(b) || p(c)) {
        return b == c;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      throw new a.error.UnsupportedTypeError("equal", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = (c(10), c(13)), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.exp = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("exp", arguments.length, 1);
      }
      if (k(c)) {
        return Math.exp(c);
      }
      if (m(c)) {
        var q = Math.exp(c.re);
        return new g(q * Math.cos(c.im), q * Math.sin(c.im));
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      if (n(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return Math.exp(c);
      }
      throw new a.error.UnsupportedTypeError("exp", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.fix = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("fix", arguments.length, 1);
      }
      if (k(b)) {
        return 0 < b ? Math.floor(b) : Math.ceil(b);
      }
      if (m(b)) {
        return new g(0 < b.re ? Math.floor(b.re) : Math.ceil(b.re), 0 < b.im ? Math.floor(b.im) : Math.ceil(b.im));
      }
      if (b instanceof f) {
        return b.isNegative() ? b.ceil() : b.floor();
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return p(+b);
      }
      throw new a.error.UnsupportedTypeError("fix", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.floor = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("floor", arguments.length, 1);
      }
      if (k(b)) {
        return Math.floor(b);
      }
      if (m(b)) {
        return new g(Math.floor(b.re), Math.floor(b.im));
      }
      if (b instanceof f) {
        return b.floor();
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return p(+b);
      }
      throw new a.error.UnsupportedTypeError("floor", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = b.number.isNumber, k = b.number.toNumber, l = b["boolean"].isBoolean, m = b.number.isInteger, n = g.isCollection;
    a.gcd = function p() {
      var b, c = arguments[0], e = arguments[1];
      if (2 == arguments.length) {
        if (h(c) && h(e)) {
          if (!m(c) || !m(e)) {
            throw Error("Parameters in function gcd must be integer numbers");
          }
          for (;0 != e;) {
            b = c % e, c = e, e = b;
          }
          return 0 > c ? -c : c;
        }
        if (n(c) || n(e)) {
          return g.deepMap2(c, e, p);
        }
        if (c instanceof f) {
          return p(k(c), e);
        }
        if (e instanceof f) {
          return p(c, k(e));
        }
        if (l(c)) {
          return p(+c, e);
        }
        if (l(e)) {
          return p(c, +e);
        }
        throw new a.error.UnsupportedTypeError("gcd", c, e);
      }
      if (2 < arguments.length) {
        for (b = 1;b < arguments.length;b++) {
          c = p(c, arguments[b]);
        }
        return c;
      }
      throw new SyntaxError("Function gcd expects two or more arguments");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.larger = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("larger", arguments.length, 2);
      }
      if (l(b) && l(c)) {
        return b > c;
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.gt(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.gt(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value > c.value;
      }
      if (p(b) || p(c)) {
        return b > c;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      if (s(b) || s(c)) {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
      throw new a.error.UnsupportedTypeError("larger", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.largereq = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("largereq", arguments.length, 2);
      }
      if (l(b) && l(c)) {
        return b >= c;
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.gte(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.gte(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value >= c.value;
      }
      if (p(b) || p(c)) {
        return b >= c;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      if (s(b) || s(c)) {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
      throw new a.error.UnsupportedTypeError("largereq", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = b.number.isNumber, k = b.number.toNumber, l = b["boolean"].isBoolean, m = b.number.isInteger, n = g.isCollection;
    a.lcm = function p() {
      var b, c = arguments[0], e = arguments[1];
      if (2 == arguments.length) {
        if (h(c) && h(e)) {
          if (!m(c) || !m(e)) {
            throw Error("Parameters in function lcm must be integer numbers");
          }
          if (0 == c || 0 == e) {
            return 0;
          }
          for (var x = c * e;0 != e;) {
            b = e, e = c % b, c = b;
          }
          return Math.abs(x / c);
        }
        if (n(c) || n(e)) {
          return g.deepMap2(c, e, p);
        }
        if (l(c)) {
          return p(+c, e);
        }
        if (l(e)) {
          return p(c, +e);
        }
        if (c instanceof f) {
          return p(k(c), e);
        }
        if (e instanceof f) {
          return p(c, k(e));
        }
        throw new a.error.UnsupportedTypeError("lcm", c, e);
      }
      if (2 < arguments.length) {
        for (b = 1;b < arguments.length;b++) {
          c = p(c, arguments[b]);
        }
        return c;
      }
      throw new SyntaxError("Function lcm expects two or more arguments");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.log = function p(c, q) {
      if (1 == arguments.length) {
        if (k(c)) {
          return 0 <= c ? Math.log(c) : p(new g(c, 0));
        }
        if (m(c)) {
          return new g(Math.log(Math.sqrt(c.re * c.re + c.im * c.im)), Math.atan2(c.im, c.re));
        }
        if (c instanceof f) {
          return p(b.number.toNumber(c));
        }
        if (n(c)) {
          return h.deepMap(c, p);
        }
        if (l(c)) {
          return p(+c);
        }
        throw new a.error.UnsupportedTypeError("log", c);
      }
      if (2 == arguments.length) {
        return a.divide(p(c), p(q));
      }
      throw new a.error.ArgumentsError("log", arguments.length, 1, 2);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.log10 = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("log10", arguments.length, 1);
      }
      if (k(c)) {
        return 0 <= c ? Math.log(c) / Math.LN10 : p(new g(c, 0));
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      if (m(c)) {
        return new g(Math.log(Math.sqrt(c.re * c.re + c.im * c.im)) / Math.LN10, Math.atan2(c.im, c.re) / Math.LN10);
      }
      if (n(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return p(+c);
      }
      throw new a.error.UnsupportedTypeError("log10", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = b.number.isNumber, k = b.number.toNumber, l = b.number.toBigNumber, m = b["boolean"].isBoolean, n = g.isCollection;
    a.mod = function p(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("mod", arguments.length, 2);
      }
      if (h(b) && h(c)) {
        var e;
        if (0 < c) {
          e = 0 < b ? b % c : 0 == b ? 0 : b - c * Math.floor(b / c);
        } else {
          if (0 == c) {
            e = b;
          } else {
            throw Error("Cannot calculate mod for a negative divisor");
          }
        }
        return e;
      }
      if (b instanceof f) {
        return h(c) ? c = l(c) : m(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.mod(c) : p(k(b), c);
      }
      if (c instanceof f) {
        return h(b) ? b = l(b) : m(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.mod(c) : p(b, k(c));
      }
      if (n(b) || n(c)) {
        return g.deepMap2(b, c, p);
      }
      if (m(b)) {
        return p(+b, c);
      }
      if (m(c)) {
        return p(b, +c);
      }
      throw new a.error.UnsupportedTypeError("mod", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      return 0 == a.im ? 0 == c.im ? new h(a.re * c.re, 0) : 0 == c.re ? new h(0, a.re * c.im) : new h(a.re * c.re, a.re * c.im) : 0 == a.re ? 0 == c.im ? new h(0, a.im * c.re) : 0 == c.re ? new h(-a.im * c.im, 0) : new h(-a.im * c.im, a.im * c.re) : 0 == c.im ? new h(a.re * c.re, a.im * c.re) : 0 == c.re ? new h(-a.im * c.im, a.re * c.im) : new h(a.re * c.re - a.im * c.im, a.re * c.im + a.im * c.re);
    }
    var f = c(117), g = c(220), h = c(7), k = c(10), l = c(11), m = c(13), n = f.array, r = f.number.isNumber, p = f.number.toNumber, s = f.number.toBigNumber, q = f["boolean"].isBoolean, u = h.isComplex, x = Array.isArray, v = l.isUnit;
    a.multiply = function w(c, f) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("multiply", arguments.length, 2);
      }
      if (r(c)) {
        if (r(f)) {
          return c * f;
        }
        if (u(f)) {
          return b(new h(c, 0), f);
        }
        if (v(f)) {
          return res = f.clone(), res.value *= c, res;
        }
      }
      if (u(c)) {
        if (r(f)) {
          return b(c, new h(f, 0));
        }
        if (u(f)) {
          return b(c, f);
        }
      }
      if (c instanceof g) {
        return r(f) ? f = s(f) : q(f) && (f = new g(f ? 1 : 0)), f instanceof g ? c.times(f) : w(p(c), f);
      }
      if (f instanceof g) {
        return r(c) ? c = s(c) : q(c) && (c = new g(c ? 1 : 0)), c instanceof g ? c.times(f) : w(c, p(f));
      }
      if (v(c) && r(f)) {
        return res = c.clone(), res.value *= f, res;
      }
      if (x(c)) {
        if (x(f)) {
          var l = n.size(c), z = n.size(f);
          if (1 == l.length) {
            if (1 == z.length) {
              if (l[0] != z[0]) {
                throw new RangeError("Dimensions mismatch in multiplication. Length of A must match length of B (A is " + l[0] + ", B is " + z[0] + l[0] + " !\x3d " + z[0] + ")");
              }
              var l = c, z = f, C = null;
              if (l.length) {
                for (var H = C = 0, K = l.length;K > H;H++) {
                  C = a.add(C, a.multiply(l[H], z[H]));
                }
              }
              return C;
            }
            if (2 == z.length) {
              if (l[0] != z[0]) {
                throw new RangeError("Dimensions mismatch in multiplication. Length of A must match rows of B (A is " + l[0] + ", B is " + z[0] + "x" + z[1] + ", " + l[0] + " !\x3d " + z[0] + ")");
              }
              for (var l = c, z = f, C = [], H = z.length, K = z[0].length, F = 0;K > F;F++) {
                for (var G = null, E = 0;H > E;E++) {
                  var J = a.multiply(l[E], z[E][F]), G = 0 === E ? J : a.add(G, J)
                }
                C[F] = G;
              }
              return C;
            }
            throw Error("Can only multiply a 1 or 2 dimensional matrix (B has " + z.length + " dimensions)");
          }
          if (2 == l.length) {
            if (1 == z.length) {
              if (l[1] != z[0]) {
                throw new RangeError("Dimensions mismatch in multiplication. Columns of A must match length of B (A is " + l[0] + "x" + l[0] + ", B is " + z[0] + ", " + l[1] + " !\x3d " + z[0] + ")");
              }
              l = c;
              z = f;
              C = [];
              H = l.length;
              K = l[0].length;
              for (F = 0;H > F;F++) {
                G = null;
                for (E = 0;K > E;E++) {
                  J = a.multiply(l[F][E], z[E]), G = 0 === E ? J : a.add(G, J);
                }
                C[F] = G;
              }
              return C;
            }
            if (2 == z.length) {
              if (l[1] != z[0]) {
                throw new RangeError("Dimensions mismatch in multiplication. Columns of A must match rows of B (A is " + l[0] + "x" + l[1] + ", B is " + z[0] + "x" + z[1] + ", " + l[1] + " !\x3d " + z[0] + ")");
              }
              l = c;
              z = f;
              C = [];
              H = l.length;
              K = z[0].length;
              F = l[0].length;
              for (G = 0;H > G;G++) {
                for (C[G] = [], E = 0;K > E;E++) {
                  for (var J = null, M = 0;F > M;M++) {
                    var O = a.multiply(l[G][M], z[M][E]), J = null === J ? O : a.add(J, O)
                  }
                  C[G][E] = J;
                }
              }
              return C;
            }
            throw Error("Can only multiply a 1 or 2 dimensional matrix (B has " + z.length + " dimensions)");
          }
          throw Error("Can only multiply a 1 or 2 dimensional matrix (A has " + l.length + " dimensions)");
        }
        return f instanceof k ? new k(w(c, f.valueOf())) : m.deepMap2(c, f, w);
      }
      if (c instanceof k) {
        return new k(f instanceof k ? w(c.valueOf(), f.valueOf()) : w(c.valueOf(), f));
      }
      if (x(f)) {
        return m.deepMap2(c, f, w);
      }
      if (f instanceof k) {
        return new k(m.deepMap2(c, f.valueOf(), w));
      }
      if (q(c)) {
        return w(+c, f);
      }
      if (q(f)) {
        return w(c, +f);
      }
      throw new a.error.UnsupportedTypeError("multiply", c, f);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c, e) {
      var f = a.log(c), f = a.multiply(f, e);
      return a.exp(f);
    }
    var f = c(117), g = c(220), h = c(7), k = c(10), l = (c(13), f.array), m = f.number.isNumber, n = f.number.toNumber, r = f.number.toBigNumber, p = f["boolean"].isBoolean, s = Array.isArray, q = f.number.isInteger, u = h.isComplex;
    a.pow = function v(c, f) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("pow", arguments.length, 2);
      }
      if (m(c)) {
        if (m(f)) {
          return q(f) || 0 <= c ? Math.pow(c, f) : b(new h(c, 0), new h(f, 0));
        }
        if (u(f)) {
          return b(new h(c, 0), f);
        }
      }
      if (u(c)) {
        if (m(f)) {
          return b(c, new h(f, 0));
        }
        if (u(f)) {
          return b(c, f);
        }
      }
      if (c instanceof g) {
        return m(f) ? f = r(f) : p(f) && (f = new g(f ? 1 : 0)), f instanceof g ? c.pow(f) : v(n(c), f);
      }
      if (f instanceof g) {
        return m(c) ? c = r(c) : p(c) && (c = new g(c ? 1 : 0)), c instanceof g ? c.pow(f) : v(c, n(f));
      }
      if (s(c)) {
        if (!m(f) || !q(f) || 0 > f) {
          throw new TypeError("For A^b, b must be a positive integer (value is " + f + ")");
        }
        var B = l.size(c);
        if (2 != B.length) {
          throw Error("For A^b, A must be 2 dimensional (A has " + B.length + " dimensions)");
        }
        if (B[0] != B[1]) {
          throw Error("For A^b, A must be square (size is " + B[0] + "x" + B[1] + ")");
        }
        for (var B = a.eye(B[0]).valueOf(), A = c;1 <= f;) {
          1 == (1 & f) && (B = a.multiply(A, B)), f >>= 1, A = a.multiply(A, A);
        }
        return B;
      }
      if (c instanceof k) {
        return new k(v(c.valueOf(), f));
      }
      if (p(c)) {
        return v(+c, f);
      }
      if (p(f)) {
        return v(c, +f);
      }
      throw new a.error.UnsupportedTypeError("pow", c, f);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      if (c) {
        var d = Math.pow(10, c);
        return Math.round(a * d) / d;
      }
      return Math.round(a);
    }
    var f = c(117), g = c(220), h = c(7), k = c(13), l = f.number.isNumber, m = f.number.isInteger, n = f["boolean"].isBoolean, r = h.isComplex, p = k.isCollection;
    a.round = function q(c, f) {
      if (1 != arguments.length && 2 != arguments.length) {
        throw new a.error.ArgumentsError("round", arguments.length, 1, 2);
      }
      if (void 0 == f) {
        if (l(c)) {
          return Math.round(c);
        }
        if (r(c)) {
          return new h(Math.round(c.re), Math.round(c.im));
        }
        if (c instanceof g) {
          return c.round();
        }
        if (p(c)) {
          return k.deepMap(c, q);
        }
        if (n(c)) {
          return Math.round(c);
        }
        throw new a.error.UnsupportedTypeError("round", c);
      }
      if (f instanceof g && (f = parseFloat(f.valueOf())), !l(f) || !m(f)) {
        throw new TypeError("Number of decimals in function round must be an integer");
      }
      if (0 > f || 9 < f) {
        throw Error("Number of decimals in function round must be in te range of 0-9");
      }
      if (l(c)) {
        return b(c, f);
      }
      if (r(c)) {
        return new h(b(c.re, f), b(c.im, f));
      }
      if (c instanceof g && l(f)) {
        return c.round(f);
      }
      if (p(c) || p(f)) {
        return k.deepMap2(c, f, q);
      }
      if (n(c)) {
        return q(+c, f);
      }
      if (n(f)) {
        return q(c, +f);
      }
      throw new a.error.UnsupportedTypeError("round", c, f);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number, l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isCollection;
    a.sign = function s(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("sign", arguments.length, 1);
      }
      if (l(b)) {
        return k.sign(b);
      }
      if (n(b)) {
        var c = Math.sqrt(b.re * b.re + b.im * b.im);
        return new g(b.re / c, b.im / c);
      }
      if (b instanceof f) {
        return new f(b.cmp(0));
      }
      if (r(b)) {
        return h.deepMap(b, s);
      }
      if (m(b)) {
        return k.sign(b);
      }
      throw new a.error.UnsupportedTypeError("sign", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.smaller = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("smaller", arguments.length, 2);
      }
      if (l(b) && l(c)) {
        return c > b;
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.lt(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.lt(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value < c.value;
      }
      if (p(b) || p(c)) {
        return c > b;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      if (s(b) || s(c)) {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
      throw new a.error.UnsupportedTypeError("smaller", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.smallereq = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("smallereq", arguments.length, 2);
      }
      if (l(b) && l(c)) {
        return c >= b;
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.lte(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.lte(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value <= c.value;
      }
      if (p(b) || p(c)) {
        return c >= b;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      if (s(b) || s(c)) {
        throw new TypeError("No ordering relation is defined for complex numbers");
      }
      throw new a.error.UnsupportedTypeError("smallereq", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.sqrt = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("sqrt", arguments.length, 1);
      }
      if (k(b)) {
        return 0 <= b ? Math.sqrt(b) : p(new g(b, 0));
      }
      if (m(b)) {
        var c = Math.sqrt(b.re * b.re + b.im * b.im);
        return 0 <= b.im ? new g(0.5 * Math.sqrt(2 * (c + b.re)), 0.5 * Math.sqrt(2 * (c - b.re))) : new g(0.5 * Math.sqrt(2 * (c + b.re)), -0.5 * Math.sqrt(2 * (c - b.re)));
      }
      if (b instanceof f) {
        return b.sqrt();
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return p(+b);
      }
      throw new a.error.UnsupportedTypeError("sqrt", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.square = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("square", arguments.length, 1);
      }
      if (k(b)) {
        return b * b;
      }
      if (m(b)) {
        return a.multiply(b, b);
      }
      if (b instanceof f) {
        return b.times(b);
      }
      if (n(b)) {
        return h.deepMap(b, p);
      }
      if (l(b)) {
        return b * b;
      }
      throw new a.error.UnsupportedTypeError("square", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = (c(10), c(11)), k = c(13), l = b.number.toNumber, m = b.number.toBigNumber, n = b["boolean"].isBoolean, r = b.number.isNumber, p = g.isComplex, s = h.isUnit, q = k.isCollection;
    a.subtract = function x(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("subtract", arguments.length, 2);
      }
      if (r(b)) {
        if (r(c)) {
          return b - c;
        }
        if (p(c)) {
          return new g(b - c.re, -c.im);
        }
      } else {
        if (p(b)) {
          if (r(c)) {
            return new g(b.re - c, b.im);
          }
          if (p(c)) {
            return new g(b.re - c.re, b.im - c.im);
          }
        }
      }
      if (b instanceof f) {
        return r(c) ? c = m(c) : n(c) && (c = new f(c ? 1 : 0)), c instanceof f ? b.minus(c) : x(l(b), c);
      }
      if (c instanceof f) {
        return r(b) ? b = m(b) : n(b) && (b = new f(b ? 1 : 0)), b instanceof f ? b.minus(c) : x(b, l(c));
      }
      if (s(b) && s(c)) {
        if (!b.equalBase(c)) {
          throw Error("Units do not match");
        }
        if (null == b.value) {
          throw Error("Unit on left hand side of operator - has an undefined value");
        }
        if (null == c.value) {
          throw Error("Unit on right hand side of operator - has an undefined value");
        }
        var e = b.clone();
        return e.value -= c.value, e.fixPrefix = !1, e;
      }
      if (q(b) || q(c)) {
        return k.deepMap2(b, c, x);
      }
      if (n(b)) {
        return x(+b, c);
      }
      if (n(c)) {
        return x(b, +c);
      }
      throw new a.error.UnsupportedTypeError("subtract", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.unary = function q(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("unary", arguments.length, 1);
      }
      if (l(b)) {
        return-b;
      }
      if (n(b)) {
        return new g(-b.re, -b.im);
      }
      if (b instanceof f) {
        return b.neg();
      }
      if (r(b)) {
        var c = b.clone();
        return c.value = -b.value, c;
      }
      if (p(b)) {
        return k.deepMap(b, q);
      }
      if (m(b)) {
        return-b;
      }
      throw new a.error.UnsupportedTypeError("unary", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b.number.toNumber, n = b.number.toBigNumber, r = b["boolean"].isBoolean, p = b.string.isString, s = g.isComplex, q = h.isUnit, u = k.isCollection;
    a.unequal = function v(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("unequal", arguments.length, 2);
      }
      if (l(b)) {
        if (l(c)) {
          return b != c;
        }
        if (s(c)) {
          return b != c.re || 0 != c.im;
        }
      }
      if (s(b)) {
        if (l(c)) {
          return b.re != c || 0 != b.im;
        }
        if (s(c)) {
          return b.re != c.re || b.im != c.im;
        }
      }
      if (b instanceof f) {
        return l(c) ? c = n(c) : r(c) && (c = new f(c ? 1 : 0)), c instanceof f ? !b.eq(c) : v(m(b), c);
      }
      if (c instanceof f) {
        return l(b) ? b = n(b) : r(b) && (b = new f(b ? 1 : 0)), b instanceof f ? !b.eq(c) : v(b, m(c));
      }
      if (q(b) && q(c)) {
        if (!b.equalBase(c)) {
          throw Error("Cannot compare units with different base");
        }
        return b.value != c.value;
      }
      if (p(b) || p(c)) {
        return b != c;
      }
      if (u(b) || u(c)) {
        return k.deepMap2(b, c, v);
      }
      if (r(b)) {
        return v(+b, c);
      }
      if (r(c)) {
        return v(b, +c);
      }
      throw new a.error.UnsupportedTypeError("unequal", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = b.number.toNumber, h = b.number.isNumber, k = b["boolean"].isBoolean, l = b.number.isInteger;
    a.xgcd = function n(b, c) {
      if (2 == arguments.length) {
        if (h(b) && h(c)) {
          if (!l(b) || !l(c)) {
            throw Error("Parameters in function xgcd must be integer numbers");
          }
          for (var e = b, q = c, u, x, v = 0, t = 1, w = 1, B = 0;q;) {
            u = Math.floor(e / q), x = e % q, e = v, v = t - u * v, t = e, e = w, w = B - u * w, B = e, e = q, q = x;
          }
          return 0 > e ? [-e, e ? -t : 0, -B] : [e, e ? t : 0, B];
        }
        if (b instanceof f) {
          return n(g(b), c);
        }
        if (c instanceof f) {
          return n(b, g(c));
        }
        if (k(b)) {
          return n(+b, c);
        }
        if (k(c)) {
          return n(b, +c);
        }
        throw new a.error.UnsupportedTypeError("xgcd", b, c);
      }
      throw new SyntaxError("Function xgcd expects two arguments");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = h.isCollection, n = g.isComplex;
    a.arg = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("arg", arguments.length, 1);
      }
      if (k(c)) {
        return Math.atan2(0, c);
      }
      if (n(c)) {
        return Math.atan2(c.im, c.re);
      }
      if (m(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return p(+c);
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("arg", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.object, l = b.number.isNumber, m = b["boolean"].isBoolean, n = h.isCollection, r = g.isComplex;
    a.conj = function s(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("conj", arguments.length, 1);
      }
      return l(b) ? b : b instanceof f ? new f(b) : r(b) ? new g(b.re, -b.im) : n(b) ? h.deepMap(b, s) : m(b) ? +b : k.clone(b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.object, l = b.number.isNumber, m = b["boolean"].isBoolean, n = h.isCollection, r = g.isComplex;
    a.re = function s(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("re", arguments.length, 1);
      }
      return l(b) ? b : b instanceof f ? new f(b) : r(b) ? b.re : n(b) ? h.deepMap(b, s) : m(b) ? +b : k.clone(b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = h.isCollection, n = g.isComplex;
    a.im = function p(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("im", arguments.length, 1);
      }
      return k(b) ? 0 : b instanceof f ? new f(0) : n(b) ? b.im : m(b) ? h.deepMap(b, p) : (l(b), 0);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = g.isCollection, k = b.number.isNumber, l = b.string.isString, m = b["boolean"].isBoolean;
    "function" != typeof f.prototype.clone && (f.prototype.clone = function() {
      return new f(this);
    });
    a.bignumber = function r(b) {
      if (1 < arguments.length) {
        throw new a.error.ArgumentsError("bignumber", arguments.length, 0, 1);
      }
      if (b instanceof f || k(b) || l(b)) {
        return new f(b);
      }
      if (m(b)) {
        return new f(+b);
      }
      if (h(b)) {
        return g.deepMap(b, r);
      }
      if (0 == arguments.length) {
        return new f(0);
      }
      throw new a.error.UnsupportedTypeError("bignumber", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = g.isCollection, k = b.number.isNumber, l = b.string.isString;
    a["boolean"] = function n(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("boolean", arguments.length, 0, 1);
      }
      if ("true" === b || !0 === b) {
        return!0;
      }
      if ("false" === b || !1 === b) {
        return!1;
      }
      if (b instanceof Boolean) {
        return b ? !0 : !1;
      }
      if (k(b)) {
        return 0 !== b;
      }
      if (b instanceof f) {
        return!b.isZero();
      }
      if (l(b)) {
        var c = b.toLowerCase();
        if ("true" === c) {
          return!0;
        }
        if ("false" === c) {
          return!1;
        }
        c = Number(b);
        if ("" != b && !isNaN(c)) {
          return 0 !== c;
        }
      }
      if (h(b)) {
        return g.deepMap(b, n);
      }
      throw new SyntaxError(b.toString() + " is no valid boolean");
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = h.isCollection, l = b.number.isNumber, m = b.number.toNumber, n = b.string.isString, r = g.isComplex;
    a.complex = function s() {
      switch(arguments.length) {
        case 0:
          return new g(0, 0);
        case 1:
          var b = arguments[0];
          if (l(b)) {
            return new g(b, 0);
          }
          if (b instanceof f) {
            return new g(m(b), 0);
          }
          if (r(b)) {
            return b.clone();
          }
          if (n(b)) {
            var c = g.parse(b);
            if (c) {
              return c;
            }
            throw new SyntaxError('String "' + b + '" is no valid complex number');
          }
          if (k(b)) {
            return h.deepMap(b, s);
          }
          throw new TypeError("Two numbers or a single string expected in function complex");;
        case 2:
          b = arguments[0];
          c = arguments[1];
          if (b instanceof f && (b = m(b)), c instanceof f && (c = m(c)), l(b) && l(c)) {
            return new g(b, c);
          }
          throw new TypeError("Two numbers or a single string expected in function complex");;
        default:
          throw new a.error.ArgumentsError("complex", arguments.length, 0, 2);;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(9), h = b.number.toNumber;
    a.index = function() {
      var a = new g, b = Array.prototype.slice.apply(arguments).map(function(a) {
        return a instanceof f ? h(a) : Array.isArray(a) ? a.map(function(a) {
          return a instanceof f ? h(a) : a;
        }) : a;
      });
      return g.apply(a, b), a;
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(10);
    a.matrix = function(c) {
      if (1 < arguments.length) {
        throw new a.error.ArgumentsError("matrix", arguments.length, 0, 1);
      }
      return new b(c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = g.isCollection, k = b.number.toNumber, l = b.number.isNumber, m = b["boolean"].isBoolean, n = b.string.isString;
    a.number = function p(b) {
      switch(arguments.length) {
        case 0:
          return 0;
        case 1:
          if (h(b)) {
            return g.deepMap(b, p);
          }
          if (b instanceof f) {
            return k(b);
          }
          if (n(b)) {
            var c = Number(b);
            if (isNaN(c) && (c = Number(b.valueOf())), isNaN(c)) {
              throw new SyntaxError(b.toString() + " is no valid number");
            }
            return c;
          }
          if (m(b)) {
            return b + 0;
          }
          if (l(b)) {
            return b;
          }
          throw new a.error.UnsupportedTypeError("number", b);;
        default:
          throw new a.error.ArgumentsError("number", arguments.length, 0, 1);;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(5);
    a.parser = function() {
      return new b(a);
    };
  };
}, function(a) {
  a.exports = function(a) {
    a.select = function(c) {
      return new a.chaining.Selector(c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(13), g = b.number, h = b.number.isNumber, k = f.isCollection;
    a.string = function m(b) {
      switch(arguments.length) {
        case 0:
          return "";
        case 1:
          return h(b) ? g.format(b) : k(b) ? f.deepMap(b, m) : null === b ? "null" : b.toString();
        default:
          throw new a.error.ArgumentsError("string", arguments.length, 0, 1);;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(11), h = c(13), k = h.isCollection, l = b.number.toNumber, m = b.string.isString;
    a.unit = function r(b) {
      switch(arguments.length) {
        case 1:
          var c = arguments[0];
          if (c instanceof g) {
            return c.clone();
          }
          if (m(c)) {
            if (g.isPlainUnit(c)) {
              return new g(null, c);
            }
            var e = g.parse(c);
            if (e) {
              return e;
            }
            throw new SyntaxError('String "' + c + '" is no valid unit');
          }
          if (k(b)) {
            return h.deepMap(b, r);
          }
          throw new TypeError("A string or a number and string expected in function unit");;
        case 2:
          return arguments[0] instanceof f ? new g(l(arguments[0]), arguments[1]) : new g(arguments[0], arguments[1]);
        default:
          throw new a.error.ArgumentsError("unit", arguments.length, 1, 2);;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c, d, f) {
      if (d > f) {
        if (a.length != c.length) {
          throw Error("Dimensions mismatch (" + a.length + " !\x3d " + c.length + ")");
        }
        for (var g = [], h = 0;h < a.length;h++) {
          g[h] = b(a[h], c[h], d, f + 1);
        }
        return g;
      }
      return a.concat(c);
    }
    var f = c(117), g = c(10), h = c(13), k = f.object, l = f.array, m = f.number.isNumber, n = f.number.isInteger, r = h.isCollection;
    a.concat = function() {
      var c, f, h = arguments.length, u = -1, x = !1, v = [];
      for (c = 0;h > c;c++) {
        var t = arguments[c];
        if (t instanceof g && (x = !0), c == h - 1 && m(t)) {
          if (f = u, u = t, !n(u) || 0 > u) {
            throw new TypeError("Dimension number must be a positive integer (dim \x3d " + u + ")");
          }
          if (0 < c && u > f) {
            throw new RangeError("Dimension out of range (" + u + " \x3e " + f + ")");
          }
        } else {
          if (!r(t)) {
            throw new a.error.UnsupportedTypeError("concat", t);
          }
          var w = k.clone(t).valueOf(), t = l.size(t.valueOf());
          if (v[c] = w, f = u, u = t.length - 1, 0 < c && u != f) {
            throw new RangeError("Dimension mismatch (" + f + " !\x3d " + u + ")");
          }
        }
      }
      if (0 == v.length) {
        throw new SyntaxError("At least one matrix expected");
      }
      for (c = v.shift();v.length;) {
        c = b(c, v.shift(), u, 0);
      }
      return x ? new g(c) : c;
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(10), g = b.object, h = (b.array, b.string);
    a.det = function(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("det", arguments.length, 1);
      }
      if (!(b instanceof f)) {
        if (!(b instanceof Array)) {
          throw new TypeError("Determinant is only defined for Matrix or Array.");
        }
        b = new f(b);
      }
      var c = b.size();
      switch(c.length) {
        case 0:
          return g.clone(b);
        case 1:
          if (1 == c[0]) {
            return g.clone(b.valueOf()[0]);
          }
          throw new RangeError("Matrix must be square (size: " + h.format(c) + ")");;
        case 2:
          var e = c[0], n = c[1];
          if (e == n) {
            a: {
              if (c = b.clone().valueOf(), 1 == e) {
                e = c[0][0];
              } else {
                if (2 == e) {
                  e = a.subtract(a.multiply(c[0][0], c[1][1]), a.multiply(c[1][0], c[0][1]));
                } else {
                  for (var r = 1, p = 0, s = 0;e > s && !(p >= n);s++) {
                    for (var q = s;0 == c[q][p];) {
                      if (q++, q == e && (q = s, p++, p == n)) {
                        e = g.deepEqual(c, a.eye(e).valueOf()) ? a.round(r, 6) : 0;
                        break a;
                      }
                    }
                    if (q != s) {
                      for (var u = 0;n > u;u++) {
                        var x = c[q][u];
                        c[q][u] = c[s][u];
                        c[s][u] = x;
                      }
                      r *= -1;
                    }
                    q = c[s][p];
                    for (u = 0;n > u;u++) {
                      c[s][u] /= q;
                    }
                    r *= q;
                    for (q = 0;e > q;q++) {
                      if (q != s) {
                        for (x = c[q][p], u = 0;n > u;u++) {
                          c[q][u] -= c[s][u] * x;
                        }
                      }
                    }
                    p++;
                  }
                  e = g.deepEqual(c, a.eye(e).valueOf()) ? a.round(r, 6) : 0;
                }
              }
            }
            return e;
          }
          throw new RangeError("Matrix must be square (size: " + h.format(c) + ")");;
        default:
          throw new RangeError("Matrix must be two dimensional (size: " + h.format(c) + ")");;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(10), h = (c(13), f.object), k = f.array.isArray, l = f.number.isNumber, m = f.number.isInteger;
    a.diag = function(c, f) {
      var p, s, q, u;
      if (1 != arguments.length && 2 != arguments.length) {
        throw new a.error.ArgumentsError("diag", arguments.length, 1, 2);
      }
      if (f) {
        if (!l(f) || !m(f)) {
          throw new TypeError("Second parameter in function diag must be an integer");
        }
      } else {
        f = 0;
      }
      var x = 0 < f ? f : 0, v = 0 > f ? -f : 0;
      if (!(c instanceof g)) {
        if (!k(c)) {
          throw new TypeError("First parameter in function diag must be a Matrix or Array");
        }
        c = new g(c);
      }
      q = c.size();
      switch(q.length) {
        case 1:
          s = c.valueOf();
          var t = new g;
          t.resize([s.length + v, s.length + x], 0);
          p = t.valueOf();
          u = s.length;
          for (q = 0;u > q;q++) {
            p[q + v][q + x] = h.clone(s[q]);
          }
          return "array" === b.matrix ? t.valueOf() : t;
        case 2:
          s = [];
          p = c.valueOf();
          u = Math.min(q[0] - v, q[1] - x);
          for (q = 0;u > q;q++) {
            s[q] = h.clone(p[q + v][q + x]);
          }
          return "array" === b.matrix ? s : new g(s);
        default:
          throw new RangeError("Matrix for function diag must be 2 dimensional");;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(220), h = c(10), k = c(13), l = f.number.toNumber, m = f.number.isNumber, n = f.number.isInteger, r = Array.isArray;
    a.eye = function(c) {
      var f = k.argsToArray(arguments), q = c instanceof h ? !0 : r(c) ? !1 : "matrix" === b.matrix;
      if (0 == f.length) {
        return q ? new h : [];
      }
      if (1 == f.length) {
        f[1] = f[0];
      } else {
        if (2 < f.length) {
          throw new a.error.ArgumentsError("eye", f.length, 0, 2);
        }
      }
      var u = f[0] instanceof g, x = f[0], v = f[1];
      if (x instanceof g && (x = l(x)), v instanceof g && (v = l(v)), !m(x) || !n(x) || 1 > x) {
        throw Error("Parameters in function eye must be positive integers");
      }
      if (v && (!m(v) || !n(v) || 1 > v)) {
        throw Error("Parameters in function eye must be positive integers");
      }
      x = new h;
      v = u ? new g(1) : 1;
      u = u ? new g(0) : 0;
      x.resize(f.map(l), u);
      for (var f = a.min(f), u = x.valueOf(), t = 0;f > t;t++) {
        u[t][t] = v;
      }
      return q ? x : x.valueOf();
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c, e, f) {
      var g, n, r;
      if (1 == e) {
        if (g = c[0][0], 0 == g) {
          throw Error("Cannot calculate inverse, determinant is zero");
        }
        return[[a.divide(1, g)]];
      }
      if (2 == e) {
        e = a.det(c);
        if (0 == e) {
          throw Error("Cannot calculate inverse, determinant is zero");
        }
        return[[a.divide(c[1][1], e), a.divide(a.unary(c[0][1]), e)], [a.divide(a.unary(c[1][0]), e), a.divide(c[0][0], e)]];
      }
      var p = c.concat();
      for (c = 0;e > c;c++) {
        p[c] = p[c].concat();
      }
      for (var s = a.eye(e).valueOf(), q = 0;f > q;q++) {
        for (c = q;e > c && 0 == p[c][q];) {
          c++;
        }
        if (c == e || 0 == p[c][q]) {
          throw Error("Cannot calculate inverse, determinant is zero");
        }
        c != q && (r = p[q], p[q] = p[c], p[c] = r, r = s[q], s[q] = s[c], s[c] = r);
        var u = p[q], x = s[q];
        for (c = 0;e > c;c++) {
          var v = p[c], t = s[c];
          if (c != q) {
            if (0 != v[q]) {
              n = a.divide(a.unary(v[q]), u[q]);
              for (g = q;f > g;g++) {
                v[g] = a.add(v[g], a.multiply(n, u[g]));
              }
              for (g = 0;f > g;g++) {
                t[g] = a.add(t[g], a.multiply(n, x[g]));
              }
            }
          } else {
            n = u[q];
            for (g = q;f > g;g++) {
              v[g] = a.divide(v[g], n);
            }
            for (g = 0;f > g;g++) {
              t[g] = a.divide(t[g], n);
            }
          }
        }
      }
      return s;
    }
    var f = c(218), g = c(10);
    c(13);
    a.inv = function(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("inv", arguments.length, 1);
      }
      var k = a.size(c).valueOf();
      switch(k.length) {
        case 0:
          return a.divide(1, c);
        case 1:
          if (1 == k[0]) {
            return c instanceof g ? new g([a.divide(1, c.valueOf()[0])]) : [a.divide(1, c[0])];
          }
          throw new RangeError("Matrix must be square (size: " + f.format(k) + ")");;
        case 2:
          var l = k[0], m = k[1];
          if (l == m) {
            return c instanceof g ? new g(b(c.valueOf(), l, m)) : b(c, l, m);
          }
          throw new RangeError("Matrix must be square (size: " + f.format(k) + ")");;
        default:
          throw new RangeError("Matrix must be two dimensional (size: " + f.format(k) + ")");;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(220), h = c(10), k = c(13), l = f.array, m = f.number.toNumber, n = Array.isArray;
    a.ones = function(a) {
      var c = k.argsToArray(arguments), d = a instanceof h ? !0 : n(a) ? !1 : "matrix" === b.matrix;
      if (0 == c.length) {
        return d ? new h : [];
      }
      var f = [], u = c[0] instanceof g ? new g(1) : 1;
      return f = l.resize(f, c.map(m), u), d ? new h(f) : f;
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    function f(a, b, c) {
      var d = [];
      if (0 < c) {
        for (;b > a;) {
          d.push(a), a += c;
        }
      } else {
        if (0 > c) {
          for (;a > b;) {
            d.push(a), a += c;
          }
        }
      }
      return d;
    }
    function g(a, b, c) {
      var d = [];
      if (0 < c) {
        for (;b >= a;) {
          d.push(a), a += c;
        }
      } else {
        if (0 > c) {
          for (;a >= b;) {
            d.push(a), a += c;
          }
        }
      }
      return d;
    }
    function h(a, b, c) {
      var d = [];
      a = a.clone();
      var e = new n(0);
      if (c.gt(e)) {
        for (;a.lt(b);) {
          d.push(a), a = a.plus(c);
        }
      } else {
        if (c.lt(e)) {
          for (;a.gt(b);) {
            d.push(a), a = a.plus(c);
          }
        }
      }
      return d;
    }
    function k(a, b, c) {
      var d = [];
      a = a.clone();
      var e = new n(0);
      if (c.gt(e)) {
        for (;a.lte(b);) {
          d.push(a), a = a.plus(c);
        }
      } else {
        if (c.lt(e)) {
          for (;a.gte(b);) {
            d.push(a), a = a.plus(c);
          }
        }
      }
      return d;
    }
    function l(a) {
      a = a.split(":");
      var c = null;
      if ("bignumber" === b.number) {
        try {
          c = a.map(function(a) {
            return new n(a);
          });
        } catch (d) {
          return null;
        }
      } else {
        if (c = a.map(function(a) {
          return parseFloat(a);
        }), c.some(function(a) {
          return isNaN(a);
        })) {
          return null;
        }
      }
      switch(c.length) {
        case 2:
          return{start:c[0], end:c[1], step:1};
        case 3:
          return{start:c[0], end:c[2], step:c[1]};
        default:
          return null;
      }
    }
    var m = c(117), n = c(220), r = c(10), p = (c(13), m["boolean"].isBoolean), s = m.string.isString, q = m.number.isNumber, u = m.number.toNumber, x = m.number.toBigNumber;
    a.range = function() {
      var c, m, w;
      w = Array.prototype.slice.call(arguments);
      var B = !1;
      switch(p(w[w.length - 1]) && (B = w.pop() ? !0 : !1), w.length) {
        case 1:
          if (!s(w[0])) {
            throw new TypeError("Two or three numbers or a single string expected in function range");
          }
          w = l(w[0]);
          if (!w) {
            throw new SyntaxError('String "' + w + '" is no valid range');
          }
          c = w.start;
          m = w.end;
          w = w.step;
          break;
        case 2:
          c = w[0];
          m = w[1];
          w = 1;
          break;
        case 3:
          c = w[0];
          m = w[1];
          w = w[2];
          break;
        default:
          throw new a.error.ArgumentsError("range", arguments.length, 2, 4);;
      }
      if (!(q(c) || c instanceof n)) {
        throw new TypeError("Parameter start must be a number");
      }
      if (!(q(m) || m instanceof n)) {
        throw new TypeError("Parameter end must be a number");
      }
      if (!(q(w) || w instanceof n)) {
        throw new TypeError("Parameter step must be a number");
      }
      if (!p(B)) {
        throw new TypeError("Parameter includeEnd must be a boolean");
      }
      if (c instanceof n || m instanceof n || w instanceof n) {
        var A = !0;
        c instanceof n || (c = x(c));
        m instanceof n || (m = x(m));
        w instanceof n || (w = x(w));
        c instanceof n && m instanceof n && w instanceof n || (A = !1, c = u(c), m = u(m), w = u(w));
      }
      c = (A ? B ? k : h : B ? g : f)(c, m, w);
      return "array" === b.matrix ? c : new r(c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(220), h = c(10), k = f.array, l = f.object.clone, m = f.string.isString, n = f.number.toNumber, r = f.number.isNumber, p = f.number.isInteger, s = k.isArray;
    a.resize = function(c, f, x) {
      if (2 != arguments.length && 3 != arguments.length) {
        throw new a.error.ArgumentsError("resize", arguments.length, 2, 3);
      }
      var v = c instanceof h ? !0 : s(c) ? !1 : "array" !== b.matrix;
      if (c instanceof h && (c = c.valueOf()), f instanceof h && (f = f.valueOf()), f.length && f[0] instanceof g && (f = f.map(n)), m(c)) {
        var t = c, w = f, v = x;
        if (void 0 !== v) {
          if (!m(v) || 1 !== v.length) {
            throw new TypeError("Single character expected as defaultValue");
          }
        } else {
          v = " ";
        }
        if (1 !== w.length) {
          throw Error("Dimension mismatch: (" + w.length + " !\x3d 1)");
        }
        var B = w[0];
        if (!r(B) || !p(B)) {
          throw new TypeError("Size must contain numbers");
        }
        if (t.length > B) {
          v = t.substring(0, B);
        } else {
          if (t.length < B) {
            for (var w = t, A = 0, t = B - t.length;t > A;A++) {
              w += v;
            }
            v = w;
          } else {
            v = t;
          }
        }
        return v;
      }
      if (0 == f.length) {
        for (;s(c);) {
          c = c[0];
        }
        return l(c);
      }
      s(c) || (c = [c]);
      c = l(c);
      t = k.resize(c, f, x);
      return v ? new h(t) : t;
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(220), h = c(7), k = c(11), l = c(10), m = f.array, n = f.number.isNumber, r = f["boolean"].isBoolean, p = f.string.isString, s = h.isComplex, q = k.isUnit;
    a.size = function(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("size", arguments.length, 1);
      }
      var f = "array" === b.matrix;
      if (n(c) || s(c) || q(c) || r(c) || null == c || c instanceof g) {
        return f ? [] : new l([]);
      }
      if (p(c)) {
        return f ? [c.length] : new l([c.length]);
      }
      if (Array.isArray(c)) {
        return m.size(c);
      }
      if (c instanceof l) {
        return new l(c.size());
      }
      throw new a.error.UnsupportedTypeError("size", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(10), g = b.object, h = b.array, k = Array.isArray;
    a.squeeze = function(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("squeeze", arguments.length, 1);
      }
      if (k(b)) {
        return h.squeeze(g.clone(b));
      }
      if (b instanceof f) {
        var c = h.squeeze(b.toArray());
        return k(c) ? new f(c) : c;
      }
      return g.clone(b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      if (!(c instanceof k)) {
        throw new TypeError("Index expected");
      }
      if (1 != c.size().length) {
        throw new RangeError("Dimension mismatch (" + c.size().length + " !\x3d 1)");
      }
      var d = c.range(0), e = "", f = a.length;
      return d.forEach(function(b) {
        l.validateIndex(b, f);
        e += a.charAt(b);
      }), e;
    }
    function f(a, b, c, d) {
      if (!(b instanceof k)) {
        throw new TypeError("Index expected");
      }
      if (1 != b.size().length) {
        throw new RangeError("Dimension mismatch (" + b.size().length + " !\x3d 1)");
      }
      if (void 0 !== d) {
        if (!m(d) || 1 !== d.length) {
          throw new TypeError("Single character expected as defaultValue");
        }
      } else {
        d = " ";
      }
      b = b.range(0);
      var e = b.size()[0];
      if (e != c.length) {
        throw new RangeError("Dimension mismatch (" + b.size()[0] + " !\x3d " + c.length + ")");
      }
      for (var e = a.length, f = [], g = 0;e > g;g++) {
        f[g] = a.charAt(g);
      }
      if (b.forEach(function(a, b) {
        l.validateIndex(a);
        f[a] = c.charAt(b);
      }), f.length > e) {
        for (g = e - 1, e = f.length;e > g;g++) {
          f[g] || (f[g] = d);
        }
      }
      return f.join("");
    }
    var g = c(117), h = c(10), k = c(9), l = g.array, m = g.string.isString, n = Array.isArray;
    a.subset = function() {
      switch(arguments.length) {
        case 2:
          var c;
          c = arguments[0];
          var g = arguments[1], k, l;
          if (n(c)) {
            c = (k = new h(c), l = k.subset(g), l.valueOf());
          } else {
            if (c instanceof h) {
              c = c.subset(g);
            } else {
              if (m(c)) {
                c = b(c, g);
              } else {
                throw new a.error.UnsupportedTypeError("subset", c);
              }
            }
          }
          return c;
        case 3:
        ;
        case 4:
          k = arguments[0];
          l = arguments[1];
          var g = arguments[2], u = arguments[3];
          if (n(k)) {
            k = (c = new h(a.clone(k)), c.subset(l, g, u), c.valueOf());
          } else {
            if (k instanceof h) {
              k = k.clone().subset(l, g, u);
            } else {
              if (m(k)) {
                k = f(k, l, g, u);
              } else {
                throw new a.error.UnsupportedTypeError("subset", k);
              }
            }
          }
          return k;
        default:
          throw new a.error.ArgumentsError("subset", arguments.length, 2, 4);;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(10), g = (c(13), b.object), h = b.string;
    a.transpose = function(b) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("transpose", arguments.length, 1);
      }
      var c = a.size(b).valueOf();
      switch(c.length) {
        case 0:
          return g.clone(b);
        case 1:
          return g.clone(b);
        case 2:
          var e = c[1], n = c[0], r = b instanceof f, p = b.valueOf(), s = [], q = g.clone;
          if (0 === e) {
            throw new RangeError("Cannot transpose a 2D matrix with no rows(size: " + h.format(c) + ")");
          }
          for (var u = 0;e > u;u++) {
            for (var c = s[u] = [], x = 0;n > x;x++) {
              c[x] = q(p[x][u]);
            }
          }
          return 0 == n && (s[0] = []), r ? new f(s) : s;
        default:
          throw new RangeError("Matrix must be two dimensional (size: " + h.format(c) + ")");;
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(117), g = c(220), h = c(10), k = c(13), l = f.array, m = f.number.toNumber, n = Array.isArray;
    a.zeros = function(a) {
      var c = k.argsToArray(arguments), d = a instanceof h ? !0 : n(a) ? !1 : "matrix" === b.matrix;
      if (0 == c.length) {
        return d ? new h : [];
      }
      var f = [], u = c[0] instanceof g ? new g(0) : 0;
      return f = l.resize(f, c.map(m), u), d ? new h(f) : f;
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(13), h = b.number.isNumber, k = b["boolean"].isBoolean, l = b.number.isInteger, m = g.isCollection;
    a.factorial = function r(b) {
      var c, e;
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("factorial", arguments.length, 1);
      }
      if (h(b)) {
        if (!l(b) || 0 > b) {
          throw new TypeError("Positive integer value expected in function factorial");
        }
        c = b - 1;
        for (e = b;1 < c;) {
          e *= c, c--;
        }
        return 0 == e && (e = 1), e;
      }
      if (b instanceof f) {
        if (!b.round().equals(b) || !b.gte(0)) {
          throw new TypeError("Positive integer value expected in function factorial");
        }
        var u = new f(1);
        c = b.minus(u);
        for (e = b;c.gt(u);) {
          e = e.times(c), c = c.minus(u);
        }
        return e.equals(0) && (e = u), e;
      }
      if (k(b)) {
        return 1;
      }
      if (m(b)) {
        return g.deepMap(b, r);
      }
      throw new a.error.UnsupportedTypeError("factorial", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a, b) {
    var f = c(10), g = (c(13), {uniform:function() {
      return Math.random;
    }, normal:function() {
      return function() {
        var a, b;
        for (a = -1;0 > a || 1 < a;) {
          a = Math.random(), b = Math.random(), a = 1 / 6 * Math.pow(-2 * Math.log(a), 0.5) * Math.cos(2 * Math.PI * b) + 0.5;
        }
        return a;
      };
    }});
    a.distribution = function(c) {
      if (!g.hasOwnProperty(c)) {
        throw Error("unknown distribution " + c);
      }
      var h = Array.prototype.slice.call(arguments, 1);
      return function(c) {
        var g = function(a, b) {
          return a + c() * (b - a);
        }, h = function(a, b) {
          return Math.floor(a + c() * (b - a));
        }, k = function(a, b, c, d) {
          var e, f, g = [];
          if (a = a.slice(0), 1 < a.length) {
            for (f = 0, e = a.shift();e > f;f++) {
              g.push(k(a, b, c, d));
            }
          } else {
            for (f = 0, e = a.shift();e > f;f++) {
              g.push(d(b, c));
            }
          }
          return g;
        };
        return{random:function(c, h, l) {
          var m, r, t;
          if (3 < arguments.length) {
            throw new a.error.ArgumentsError("random", arguments.length, 0, 3);
          }
          return(1 === arguments.length ? Array.isArray(c) ? m = c : t = c : 2 === arguments.length ? Array.isArray(c) ? m = c : (r = c, t = h) : (m = c, r = h, t = l), void 0 === t && (t = 1), void 0 === r && (r = 0), void 0 !== m) ? (m = k(m, r, t, g), "array" === b.matrix ? m : new f(m)) : g(r, t);
        }, randomInt:function(c, g, l) {
          var m, n, t;
          if (3 < arguments.length || 1 > arguments.length) {
            throw new a.error.ArgumentsError("randomInt", arguments.length, 1, 3);
          }
          return(1 === arguments.length ? t = c : 2 === arguments.length ? "[object Array]" === Object.prototype.toString.call(c) ? m = c : (n = c, t = g) : (m = c, n = g, t = l), void 0 === n && (n = 0), void 0 !== m) ? (m = k(m, n, t, h), "array" === b.matrix ? m : new f(m)) : h(n, t);
        }, pickRandom:function(b) {
          if (1 !== arguments.length) {
            throw new a.error.ArgumentsError("pickRandom", arguments.length, 1);
          }
          if (!Array.isArray(b)) {
            throw new a.error.UnsupportedTypeError("pickRandom", b);
          }
          return b[Math.floor(Math.random() * b.length)];
        }};
      }(g[c].apply(this, h));
    };
    var h = a.distribution("uniform");
    a.random = h.random;
    a.randomInt = h.randomInt;
    a.pickRandom = h.pickRandom;
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = b.number.isNumber, h = b.number.isInteger, k = b.number.toBigNumber;
    a.permutations = function(b, c) {
      var e, p;
      e = arguments.length;
      if (2 < e) {
        throw new a.error.ArgumentsError("permutations", arguments.length, 2);
      }
      if (g(b)) {
        if (!h(b) || 0 > b) {
          throw new TypeError("Positive integer value expected in function permutations");
        }
        if (1 == e) {
          return a.factorial(b);
        }
        if (2 == e && g(c)) {
          if (!h(c) || 0 > c) {
            throw new TypeError("Positive integer value expected in function permutations");
          }
          if (c > b) {
            throw new TypeError("second argument k must be less than or equal to first argument n");
          }
          e = 1;
          for (p = b - c + 1;b >= p;p++) {
            e *= p;
          }
          return e;
        }
      }
      if (b instanceof f) {
        if (void 0 === c && l(b)) {
          return a.factorial(b);
        }
        if (c = k(c), !(c instanceof f && l(b) && l(c))) {
          throw new TypeError("Positive integer value expected in function permutations");
        }
        if (c.gt(b)) {
          throw new TypeError("second argument k must be less than or equal to first argument n");
        }
        e = new f(1);
        for (p = b.minus(c).plus(1);p.lte(b);p = p.plus(1)) {
          e = e.times(p);
        }
        return e;
      }
      throw new a.error.UnsupportedTypeError("permutations", b);
    };
    var l = function(a) {
      return a.round().equals(a) && a.gte(0);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = (c(13), b.number.isNumber), h = b.number.isInteger, k = b.number.toBigNumber;
    a.combinations = function(b, c) {
      var e, r, p, s;
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("combinations", arguments.length, 2);
      }
      if (g(b)) {
        if (!h(b) || 0 > b) {
          throw new TypeError("Positive integer value enpected in function combinations");
        }
        if (c > b) {
          throw new TypeError("k must be less than or equal to n");
        }
        e = Math.max(c, b - c);
        for (p = r = 1;b - e >= p;p++) {
          r = r * (e + p) / p;
        }
        return r;
      }
      if (b instanceof f) {
        if (c = k(c), !(c instanceof f && b.round().equals(b) && b.gte(0) && c.round().equals(c) && c.gte(0))) {
          throw new TypeError("Positive integer value expected in function combinations");
        }
        if (c.gt(b)) {
          throw new TypeError("k must be less than n in function combinations");
        }
        e = b.minus(c);
        c.lt(e) && (e = c);
        r = new f(1);
        p = new f(1);
        for (s = b.minus(e);p.lte(s);p = p.plus(1)) {
          r = r.times(e.plus(p)).dividedBy(p);
        }
        return r;
      }
      throw new a.error.UnsupportedTypeError("combinations", b);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c, e) {
      return a.smaller(c, e) ? c : e;
    }
    function f(b) {
      var c = null;
      if (g.deepForEach(b, function(b) {
        (null === c || a.smaller(b, c)) && (c = b);
      }), null === c) {
        throw Error("Cannot calculate min of an empty array");
      }
      return c;
    }
    var g = (c(10), c(13)), h = g.isCollection;
    a.min = function(a) {
      if (0 == arguments.length) {
        throw new SyntaxError("Function min requires one or more parameters (0 provided)");
      }
      if (h(a)) {
        if (1 == arguments.length) {
          return f(a);
        }
        if (2 == arguments.length) {
          return g.reduce(arguments[0], arguments[1], b);
        }
        throw new SyntaxError("Wrong number of parameters");
      }
      return f(arguments);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c, e) {
      return a.larger(c, e) ? c : e;
    }
    function f(b) {
      var c = null;
      if (g.deepForEach(b, function(b) {
        (null === c || a.larger(b, c)) && (c = b);
      }), null === c) {
        throw Error("Cannot calculate max of an empty array");
      }
      return c;
    }
    var g = (c(10), c(13)), h = g.isCollection;
    a.max = function(a) {
      if (0 == arguments.length) {
        throw new SyntaxError("Function max requires one or more parameters (0 provided)");
      }
      if (h(a)) {
        if (1 == arguments.length) {
          return f(a);
        }
        if (2 == arguments.length) {
          return g.reduce(arguments[0], arguments[1], b);
        }
        throw new SyntaxError("Wrong number of parameters");
      }
      return f(arguments);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c) {
      var e = 0, g = 0;
      if (f.deepForEach(c, function(b) {
        e = a.add(e, b);
        g++;
      }), 0 === g) {
        throw Error("Cannot calculate mean of an empty array");
      }
      return a.divide(e, g);
    }
    var f = (c(10), c(13)), g = f.isCollection;
    a.mean = function(c) {
      if (0 == arguments.length) {
        throw new SyntaxError("Function mean requires one or more parameters (0 provided)");
      }
      if (g(c)) {
        if (1 == arguments.length) {
          return b(c);
        }
        if (2 == arguments.length) {
          var k = arguments[0], l = arguments[1], m;
          return m = f.reduce(k, l, a.add), a.divide(m, size(k)[l]);
        }
        throw new SyntaxError("Wrong number of parameters");
      }
      return b(arguments);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.acos = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("acos", arguments.length, 1);
      }
      if (k(c)) {
        return-1 <= c && 1 >= c ? Math.acos(c) : p(new g(c, 0));
      }
      if (m(c)) {
        var q;
        q = new g(c.im * c.im - c.re * c.re + 1, -2 * c.re * c.im);
        q = a.sqrt(q);
        q = q instanceof g ? new g(q.re - c.im, q.im + c.re) : new g(q - c.im, c.re);
        q = a.log(q);
        return q instanceof g ? new g(1.5707963267948966 - q.im, q.re) : new g(1.5707963267948966, q);
      }
      if (n(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return Math.acos(c);
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("acos", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.asin = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("asin", arguments.length, 1);
      }
      if (k(c)) {
        return-1 <= c && 1 >= c ? Math.asin(c) : p(new g(c, 0));
      }
      if (m(c)) {
        var q;
        q = c.re;
        var u = c.im, x = new g(u * u - q * q + 1, -2 * q * u), x = a.sqrt(x);
        q = x instanceof g ? new g(x.re - u, x.im + q) : new g(x - u, q);
        q = a.log(q);
        return q instanceof g ? new g(q.im, -q.re) : new g(0, -q);
      }
      if (n(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return Math.asin(c);
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("asin", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.isNumber, l = b["boolean"].isBoolean, m = g.isComplex, n = h.isCollection;
    a.atan = function p(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("atan", arguments.length, 1);
      }
      if (k(c)) {
        return Math.atan(c);
      }
      if (m(c)) {
        var q = c.re, u = c.im, x = q * q + (1 - u) * (1 - u), q = new g((1 - u * u - q * q) / x, -2 * q / x), q = a.log(q);
        return q instanceof g ? new g(-0.5 * q.im, 0.5 * q.re) : new g(0, 0.5 * q);
      }
      if (n(c)) {
        return h.deepMap(c, p);
      }
      if (l(c)) {
        return Math.atan(c);
      }
      if (c instanceof f) {
        return p(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("atan", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(13), k = b.number.toNumber, l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isCollection;
    a.atan2 = function s(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("atan2", arguments.length, 2);
      }
      if (l(b)) {
        if (l(c)) {
          return Math.atan2(b, c);
        }
      } else {
        if (n(b) && l(c)) {
          return Math.atan2(b.re, c);
        }
      }
      if (r(b) || r(c)) {
        return h.deepMap2(b, c, s);
      }
      if (m(b)) {
        return s(+b, c);
      }
      if (m(c)) {
        return s(b, +c);
      }
      if (b instanceof f) {
        return s(k(b), c);
      }
      if (c instanceof f) {
        return s(b, k(c));
      }
      throw new a.error.UnsupportedTypeError("atan2", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.cos = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("cos", arguments.length, 1);
      }
      if (l(c)) {
        return Math.cos(c);
      }
      if (n(c)) {
        return new g(0.5 * Math.cos(c.re) * (Math.exp(-c.im) + Math.exp(c.im)), 0.5 * Math.sin(c.re) * (Math.exp(-c.im) - Math.exp(c.im)));
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function cos is no angle");
        }
        return Math.cos(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return Math.cos(c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("cos", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.cot = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("cot", arguments.length, 1);
      }
      if (l(c)) {
        return 1 / Math.tan(c);
      }
      if (n(c)) {
        var x = Math.exp(-4 * c.im) - 2 * Math.exp(-2 * c.im) * Math.cos(2 * c.re) + 1;
        return new g(2 * Math.exp(-2 * c.im) * Math.sin(2 * c.re) / x, (Math.exp(-4 * c.im) - 1) / x);
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function cot is no angle");
        }
        return 1 / Math.tan(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return q(+c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("cot", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.csc = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("csc", arguments.length, 1);
      }
      if (l(c)) {
        return 1 / Math.sin(c);
      }
      if (n(c)) {
        var x = 0.25 * (Math.exp(-2 * c.im) + Math.exp(2 * c.im)) - 0.5 * Math.cos(2 * c.re);
        return new g(0.5 * Math.sin(c.re) * (Math.exp(-c.im) + Math.exp(c.im)) / x, 0.5 * Math.cos(c.re) * (Math.exp(-c.im) - Math.exp(c.im)) / x);
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function csc is no angle");
        }
        return 1 / Math.sin(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return q(+c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("csc", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.sec = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("sec", arguments.length, 1);
      }
      if (l(c)) {
        return 1 / Math.cos(c);
      }
      if (n(c)) {
        var x = 0.25 * (Math.exp(-2 * c.im) + Math.exp(2 * c.im)) + 0.5 * Math.cos(2 * c.re);
        return new g(0.5 * Math.cos(c.re) * (Math.exp(-c.im) + Math.exp(c.im)) / x, 0.5 * Math.sin(c.re) * (Math.exp(c.im) - Math.exp(-c.im)) / x);
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function sec is no angle");
        }
        return 1 / Math.cos(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return q(+c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("sec", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.sin = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("sin", arguments.length, 1);
      }
      if (l(c)) {
        return Math.sin(c);
      }
      if (n(c)) {
        return new g(0.5 * Math.sin(c.re) * (Math.exp(-c.im) + Math.exp(c.im)), 0.5 * Math.cos(c.re) * (Math.exp(c.im) - Math.exp(-c.im)));
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function sin is no angle");
        }
        return Math.sin(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return Math.sin(c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("sin", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(220), g = c(7), h = c(11), k = c(13), l = b.number.isNumber, m = b["boolean"].isBoolean, n = g.isComplex, r = h.isUnit, p = k.isCollection;
    a.tan = function q(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("tan", arguments.length, 1);
      }
      if (l(c)) {
        return Math.tan(c);
      }
      if (n(c)) {
        var x = Math.exp(-4 * c.im) + 2 * Math.exp(-2 * c.im) * Math.cos(2 * c.re) + 1;
        return new g(2 * Math.exp(-2 * c.im) * Math.sin(2 * c.re) / x, (1 - Math.exp(-4 * c.im)) / x);
      }
      if (r(c)) {
        if (!c.hasBase(h.BASE_UNITS.ANGLE)) {
          throw new TypeError("Unit in function tan is no angle");
        }
        return Math.tan(c.value);
      }
      if (p(c)) {
        return k.deepMap(c, q);
      }
      if (m(c)) {
        return Math.tan(c);
      }
      if (c instanceof f) {
        return q(b.number.toNumber(c));
      }
      throw new a.error.UnsupportedTypeError("tan", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(117), f = c(11), g = c(13), h = b.string.isString, k = f.isUnit, l = g.isCollection;
    a.to = function n(b, c) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("to", arguments.length, 2);
      }
      if (k(b) && (k(c) || h(c))) {
        return b.to(c);
      }
      if (l(b) || l(c)) {
        return g.deepMap2(b, c, n);
      }
      throw new a.error.UnsupportedTypeError("to", b, c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(2);
    a.clone = function(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("clone", arguments.length, 1);
      }
      return b.clone(c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(218);
    a.format = function(c, g) {
      var h = arguments.length;
      if (1 !== h && 2 !== h) {
        throw new a.error.ArgumentsError("format", h, 1, 2);
      }
      return b.format(c, g);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(c, e, f) {
      (f.override || void 0 === a[c]) && (a[c] = f.wrap && "function" == typeof e ? function() {
        for (var b = [], c = 0, f = arguments.length;f > c;c++) {
          b[c] = arguments[c].valueOf();
        }
        return e.apply(a, b);
      } : e, a.chaining.Selector.createProxy(c, e));
    }
    function f(a) {
      return "function" == typeof a || l(a) || m(a) || n(a) || r(a);
    }
    var g = c(117), h = c(7), k = c(11), l = g.number.isNumber, m = g.string.isString, n = h.isComplex, r = k.isUnit;
    a["import"] = function s(h, k) {
      var l, n = {override:!1, wrap:!0};
      if (k && k instanceof Object && g.object.extend(n, k), m(h)) {
        l = c(219)(h), s(l);
      } else {
        if (f(h)) {
          if (l = h.name, !l) {
            throw Error("Cannot import an unnamed function or object");
          }
          (n.override || void 0 === a[l]) && b(l, h, n);
        } else {
          if (h instanceof Object) {
            for (l in h) {
              if (h.hasOwnProperty(l)) {
                var r = h[l];
                f(r) ? b(l, r, n) : s(r);
              }
            }
          }
        }
      }
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      var d = [], e = function(b, f) {
        return Array.isArray(b) ? b.map(function(a, b) {
          return d[f] = b, e(a, f + 1);
        }) : c(b, d, a);
      };
      return e(a, 0);
    }
    var f = c(10).isMatrix;
    a.map = function(c, h) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("map", arguments.length, 2);
      }
      if (Array.isArray(c)) {
        return b(c, h);
      }
      if (f(c)) {
        return c.map(h);
      }
      throw new a.error.UnsupportedTypeError("map", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(218).isString;
    a.print = function(c, g, h) {
      var k = arguments.length;
      if (2 != k && 3 != k) {
        throw new a.error.ArgumentsError("print", k, 2, 3);
      }
      if (!b(c)) {
        throw new TypeError("String expected as first parameter in function format");
      }
      if (!(g instanceof Object)) {
        throw new TypeError("Object expected as second parameter in function format");
      }
      return c.replace(/\$([\w\.]+)/g, function(c, f) {
        for (var k = f.split("."), r = g[k.shift()];k.length && void 0 !== r;) {
          var p = k.shift(), r = p ? r[p] : r + "."
        }
        return void 0 !== r ? b(r) ? r : a.format(r, h) : c;
      });
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(217), f = c(220), g = c(7), h = c(10), k = c(11), l = c(9), m = c(8), n = c(12);
    a["typeof"] = function(c) {
      if (1 != arguments.length) {
        throw new a.error.ArgumentsError("typeof", arguments.length, 1);
      }
      var p = b.type(c);
      if ("object" === p) {
        if (c instanceof g) {
          return "complex";
        }
        if (c instanceof f) {
          return "bignumber";
        }
        if (c instanceof h) {
          return "matrix";
        }
        if (c instanceof k) {
          return "unit";
        }
        if (c instanceof l) {
          return "index";
        }
        if (c instanceof m) {
          return "range";
        }
        if (c instanceof n) {
          return "matrix";
        }
        if (c instanceof a.chaining.Selector) {
          return "selector";
        }
      }
      return p;
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a, c) {
      var d = [], e = function(b, f) {
        Array.isArray(b) ? b.forEach(function(a, b) {
          d[f] = b;
          e(a, f + 1);
        }) : c(b, d, a);
      };
      e(a, 0);
    }
    var f = c(10).isMatrix;
    a.forEach = function(c, h) {
      if (2 != arguments.length) {
        throw new a.error.ArgumentsError("forEach", arguments.length, 2);
      }
      if (Array.isArray(c)) {
        return b(c, h);
      }
      if (f(c)) {
        return c.forEach(h);
      }
      throw new a.error.UnsupportedTypeError("forEach", c);
    };
  };
}, function(a, b, c) {
  a.exports = function(a) {
    var b = c(7);
    a.pi = Math.PI;
    a.e = Math.E;
    a.tau = 2 * Math.PI;
    a.i = new b(0, 1);
    a.Infinity = 1 / 0;
    a.NaN = 0 / 0;
    a["true"] = !0;
    a["false"] = !1;
    a.E = Math.E;
    a.LN2 = Math.LN2;
    a.LN10 = Math.LN10;
    a.LOG2E = Math.LOG2E;
    a.LOG10E = Math.LOG10E;
    a.PI = Math.PI;
    a.SQRT1_2 = Math.SQRT1_2;
    a.SQRT2 = Math.SQRT2;
  };
}, function(a, b, c) {
  a.exports = function(a) {
    function b(a) {
      if (!(this instanceof b)) {
        throw new SyntaxError("Selector constructor must be called with the new operator");
      }
      this.value = a instanceof b ? a.value : a;
    }
    function f(a, c) {
      var d = Array.prototype.slice;
      b.prototype[a] = "function" == typeof c ? function() {
        var a = [this.value].concat(d.call(arguments, 0));
        return new b(c.apply(this, a));
      } : new b(c);
    }
    var g = c(218);
    b.prototype.done = function() {
      return this.value;
    };
    b.prototype.valueOf = function() {
      return this.value;
    };
    b.prototype.toString = function() {
      return g.format(this.value);
    };
    b.createProxy = f;
    for (var h in a) {
      a.hasOwnProperty(h) && h && f(h, a[h]);
    }
    return b;
  };
}, function(a, b, c) {
  function d(a) {
    this.nodes = a || [];
  }
  b = c(110);
  var e = (c(2), c(218));
  c(13);
  c(10);
  d.prototype = new b;
  d.prototype._compile = function(a) {
    var b = "array" !== a.math.config().matrix, c = this.nodes.map(function(b) {
      return b._compile(a);
    });
    return(b ? "math.matrix([" : "[") + c.join(",") + (b ? "])" : "]");
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    for (var c = this.nodes, d = 0, e = c.length;e > d;d++) {
      for (var m = c[d], n = 0, r = m.length;r > n;n++) {
        b = b.concat(m[n].find(a));
      }
    }
    return b;
  };
  d.prototype.toString = function() {
    return e.format(this.nodes);
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    this.name = a;
    this.expr = b;
  }
  b = c(110);
  d.prototype = new b;
  d.prototype._compile = function(a) {
    return'scope["' + this.name + '"] \x3d ' + this.expr._compile(a);
  };
  d.prototype.find = function(a) {
    var b = [];
    return this.match(a) && b.push(this), this.expr && (b = b.concat(this.expr.find(a))), b;
  };
  d.prototype.toString = function() {
    return this.name + " \x3d " + this.expr.toString();
  };
  a.exports = d;
}, function(a, b, c) {
  function d() {
    this.params = [];
  }
  b = c(110);
  d.prototype = new b;
  d.prototype.add = function(a, b) {
    this.params[this.params.length] = {node:a, visible:void 0 != b ? b : !0};
  };
  d.prototype._compile = function(a) {
    return "(function () {var results \x3d [];" + this.params.map(function(b) {
      var c = b.node._compile(a);
      return b.visible ? "results.push(" + c + ");" : c + ";";
    }).join("") + "return results;})()";
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    var c = this.params;
    if (c) {
      for (var d = 0, k = c.length;k > d;d++) {
        b = b.concat(c[d].node.find(a));
      }
    }
    return b;
  };
  d.prototype.toString = function() {
    return this.params.map(function(a) {
      return a.node.toString() + (a.visible ? "" : ";");
    }).join("\n");
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    if (!e(a)) {
      throw new TypeError("Constant type must be a string");
    }
    if (!e(b)) {
      throw new TypeError("Constant value must be a string");
    }
    this.type = a;
    this.value = b;
  }
  b = c(110);
  var e = (c(7), c(220), c(218)).isString;
  d.prototype = new b;
  d.prototype._compile = function(a) {
    switch(this.type) {
      case "number":
        return "bignumber" === a.math.config().number ? 'math.bignumber("' + this.value + '")' : this.value.replace(/^(0*)[0-9]/, function(a, b) {
          return a.substring(b.length);
        });
      case "string":
        return'"' + this.value + '"';
      case "complex":
        return "math.complex(0, " + this.value + ")";
      case "boolean":
        return this.value;
      case "undefined":
        return this.value;
      case "null":
        return this.value;
      default:
        throw new TypeError('Unsupported type of constant "' + this.type + '"');;
    }
  };
  d.prototype.toString = function() {
    switch(this.type) {
      case "string":
        return'"' + this.value + '"';
      case "complex":
        return this.value + "i";
      default:
        return this.value;
    }
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    this.object = a;
    this.ranges = b;
  }
  b = c(221);
  var e = c(110), f = c(113), g = c(114);
  c(220);
  c(9);
  c(8);
  b.isNumber;
  b.toNumber;
  d.prototype = new e;
  d.prototype._compile = function(a) {
    return this.compileSubset(a);
  };
  d.prototype.compileSubset = function(a, b) {
    var c = {type:g, properties:{name:"end"}}, d = this.ranges.map(function(a) {
      return 0 < a.find(c).length;
    }), e = this.ranges.map(function(b, c) {
      var e = d[c];
      return b instanceof f ? e ? '(function (scope) {  scope \x3d Object.create(scope);   scope["end"] \x3d size[' + c + "];  var step \x3d " + (b.step ? b.step._compile(a) : "1") + ";  return [    " + b.start._compile(a) + " - 1,     " + b.end._compile(a) + " - (step \x3e 0 ? 0 : 2),     step  ];})(scope)" : "(function () {  var step \x3d " + (b.step ? b.step._compile(a) : "1") + ";  return [    " + b.start._compile(a) + " - 1,     " + b.end._compile(a) + " - (step \x3e 0 ? 0 : 2),     step  ];})()" : 
      e ? '(function (scope) {  scope \x3d Object.create(scope);   scope["end"] \x3d size[' + c + "];  return " + b._compile(a) + " - 1;})(scope)" : b._compile(a) + " - 1";
    });
    return e.some(function(a) {
      return a;
    }) ? "(function () {  var obj \x3d " + this.object._compile(a) + ";  var size \x3d math.size(obj).valueOf();  return math.subset(    obj,     math.index(" + e.join(", ") + ")    " + (b ? ", " + b : "") + "  );})()" : "math.subset(" + this.object._compile(a) + ",math.index(" + e.join(", ") + (b ? ", " + b : "") + ")";
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    this.object && (b = b.concat(this.object.find(a)));
    var c = this.ranges;
    if (c) {
      for (var d = 0, e = c.length;e > d;d++) {
        b = b.concat(c[d].find(a));
      }
    }
    return b;
  };
  d.prototype.objectName = function() {
    return this.object.name;
  };
  d.prototype.toString = function() {
    var a = this.object ? this.object.toString() : "";
    return this.ranges && (a += "[" + this.ranges.join(", ") + "]"), a;
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b, c) {
    this.name = a;
    this.args = b;
    this.expr = c;
  }
  b = c(110);
  d.prototype = new b;
  d.prototype._eval = function() {
    return this.scope.set(this.name, this.fn), this.fn;
  };
  d.prototype._compile = function(a) {
    return'scope["' + this.name + '"] \x3d   (function (scope) {    scope \x3d Object.create(scope);     var fn \x3d function ' + this.name + "(" + this.args.join(",") + ") {      if (arguments.length !\x3d " + this.args.length + ') {        throw new SyntaxError("Wrong number of arguments in function ' + this.name + ' (" + arguments.length + " provided, ' + this.args.length + ' expected)");      }' + this.args.map(function(a, b) {
      return'scope["' + a + '"] \x3d arguments[' + b + "];";
    }).join("") + "      return " + this.expr._compile(a) + '    };    fn.syntax \x3d "' + this.name + "(" + this.args.join(", ") + ')";    return fn;  })(scope);';
  };
  d.prototype.find = function(a) {
    var b = [];
    return this.match(a) && b.push(this), this.expr && (b = b.concat(this.expr.find(a))), b;
  };
  d.prototype.toString = function() {
    return "function " + this.name + "(" + this.args.join(", ") + ") \x3d " + this.expr.toString();
  };
  a.exports = d;
}, function(a) {
  function b() {
  }
  b.prototype.eval = function() {
    throw Error("Node.eval is deprecated. Use Node.compile(math).eval([scope]) instead.");
  };
  b.prototype.compile = function(a) {
    if ("object" != typeof a) {
      throw new TypeError("Object expected as parameter math");
    }
    a = {math:a};
    var b = this._compile(a), b = Object.keys(a).map(function(a) {
      return "    var " + a + ' \x3d defs["' + a + '"];';
    }).join(" ") + 'return {  "eval": function (scope) {    scope \x3d scope || {};    return ' + b + ";  }};";
    return(new Function("defs", b))(a);
  };
  b.prototype._compile = function() {
    throw Error("Cannot compile a Node interface");
  };
  b.prototype.find = function(a) {
    return this.match(a) ? [this] : [];
  };
  b.prototype.match = function(a) {
    var b = !0;
    if (a && (!a.type || this instanceof a.type || (b = !1), b && a.properties)) {
      for (var e in a.properties) {
        if (a.properties.hasOwnProperty(e) && this[e] != a.properties[e]) {
          b = !1;
          break;
        }
      }
    }
    return b;
  };
  b.prototype.toString = function() {
    return "";
  };
  a.exports = b;
}, function(a, b, c) {
  function d(a, b, c) {
    this.op = a;
    this.fn = b;
    this.params = c;
  }
  b = c(110);
  d.prototype = new b;
  d.prototype._compile = function(a) {
    if (!(this.fn in a.math)) {
      throw Error("Function " + this.fn + ' missing in provided namespace "math"');
    }
    var b = this.params.map(function(b) {
      return b._compile(a);
    });
    return "math." + this.fn + "(" + b.join(", ") + ")";
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    var c = this.params;
    if (c) {
      for (var d = 0, k = c.length;k > d;d++) {
        b = b.concat(c[d].find(a));
      }
    }
    return b;
  };
  d.prototype.toString = function() {
    var a = this.params;
    switch(a.length) {
      case 1:
        return "-" == this.op ? "-" + a[0].toString() : a[0].toString() + this.op;
      case 2:
        var b = a[0].toString();
        a[0] instanceof d && (b = "(" + b + ")");
        var c = a[1].toString();
        return a[1] instanceof d && (c = "(" + c + ")"), b + " " + this.op + " " + c;
      default:
        return this.op + "(" + this.params.join(", ") + ")";
    }
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    this.object = a;
    this.params = b;
  }
  b = c(221);
  var e = c(110);
  c(113);
  c(114);
  c(220);
  c(9);
  c(8);
  b.isNumber;
  b.toNumber;
  d.prototype = new e;
  d.prototype._compile = function(a) {
    var b = this.params.map(function(b) {
      return b._compile(a);
    });
    return this.object._compile(a) + "(" + b.join(", ") + ")";
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    this.object && (b = b.concat(this.object.find(a)));
    var c = this.params;
    if (c) {
      for (var d = 0, e = c.length;e > d;d++) {
        b = b.concat(c[d].find(a));
      }
    }
    return b;
  };
  d.prototype.toString = function() {
    var a = this.object ? this.object.toString() : "";
    return this.params && (a += "(" + this.params.join(", ") + ")"), a;
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a) {
    if (2 != a.length && 3 != a.length) {
      throw new SyntaxError("Wrong number of arguments. Expected [start, end] or [start, end, step]");
    }
    this.start = a[0];
    this.end = a[1];
    this.step = a[2];
  }
  b = c(221);
  var e = c(110);
  c(220);
  c(8);
  c(10);
  b.toNumber;
  d.prototype = new e;
  d.prototype._compile = function(a) {
    return "math.range(" + this.start._compile(a) + ", " + this.end._compile(a) + ", " + (this.step ? this.step._compile(a) + ", " : "") + "true)";
  };
  d.prototype.find = function(a) {
    var b = [];
    return this.match(a) && b.push(this), this.start && (b = b.concat(this.start.find(a))), this.step && (b = b.concat(this.step.find(a))), this.end && (b = b.concat(this.end.find(a))), b;
  };
  d.prototype.toString = function() {
    var a = this.start.toString();
    return this.step && (a += ":" + this.step.toString()), a + (":" + this.end.toString());
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a) {
    this.name = a;
  }
  function e(a) {
    throw Error("Undefined symbol " + a);
  }
  b = c(110);
  var f = c(11);
  d.prototype = new b;
  d.prototype._compile = function(a) {
    return a.undef = e, a.Unit = f, '(scope["' + this.name + '"] !\x3d\x3d undefined ? scope["' + this.name + '"] : math["' + this.name + '"] !\x3d\x3d undefined ? math["' + this.name + '"] : ' + (f.isPlainUnit(this.name) ? 'new Unit(null, "' + this.name + '")' : 'undef("' + this.name + '")') + ")";
  };
  d.prototype.toString = function() {
    return this.name;
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    this.value = a;
    this.unit = b;
  }
  b = c(110);
  c = (c(220), c(7), c(11), c(221));
  c.toNumber;
  d.prototype = new b;
  d.prototype._compile = function(a) {
    return "math.unit(" + this.value._compile(a) + ', "' + this.unit + '")';
  };
  d.prototype.find = function(a) {
    var b = [];
    return this.match(a) && b.push(this), b.concat(this.value.find(a));
  };
  d.prototype.toString = function() {
    return this.value + " " + this.unit;
  };
  a.exports = d;
}, function(a, b, c) {
  function d(a, b) {
    if (!(a instanceof f)) {
      throw new TypeError("index mus be an IndexNode");
    }
    this.index = a;
    this.expr = b;
  }
  b = c(221);
  var e = c(110), f = (c(113), c(108));
  c(114);
  c(220);
  c(9);
  c(8);
  b.isNumber;
  b.toNumber;
  d.prototype = new e;
  d.prototype._compile = function(a) {
    return'scope["' + this.index.objectName() + '"] \x3d ' + this.index.compileSubset(a, this.expr._compile(a));
  };
  d.prototype.find = function(a) {
    var b = [];
    this.match(a) && b.push(this);
    var c = this.ranges;
    if (c) {
      for (var d = 0, e = c.length;e > d;d++) {
        b = b.concat(c[d].find(a));
      }
    }
    return this.expr && (b = b.concat(this.expr.find(a))), b;
  };
  d.prototype.toString = function() {
    return this.index.toString() + " \x3d " + this.expr.toString();
  };
  a.exports = d;
}, function(a, b, c) {
  b.array = c(222);
  b["boolean"] = c(223);
  b.number = c(221);
  b.object = c(2);
  b.string = c(218);
  b.types = c(217);
}, function(a) {
  a.exports = {name:"e", category:"Constants", syntax:["e"], description:"Euler's number, the base of the natural logarithm. Approximately equal to 2.71828", examples:["e", "e ^ 2", "exp(2)", "log(e)"], seealso:["exp"]};
}, function(a) {
  a.exports = {name:"false", category:"Constants", syntax:["false"], description:"Boolean value false", examples:["false"], seealso:["true"]};
}, function(a) {
  a.exports = {name:"i", category:"Constants", syntax:["i"], description:"Imaginary unit, defined as i*i\x3d-1. A complex number is described as a + b*i, where a is the real part, and b is the imaginary part.", examples:["i", "i * i", "sqrt(-1)"], seealso:[]};
}, function(a) {
  a.exports = {name:"Infinity", category:"Constants", syntax:["Infinity"], description:"Infinity, a number which is larger than the maximum number that can be handled by a floating point number.", examples:["Infinity", "1 / 0"], seealso:[]};
}, function(a) {
  a.exports = {name:"LN2", category:"Constants", syntax:["LN2"], description:"Returns the natural logarithm of 2, approximately equal to 0.693", examples:["LN2", "log(2)"], seealso:[]};
}, function(a) {
  a.exports = {name:"LN10", category:"Constants", syntax:["LN10"], description:"Returns the natural logarithm of 10, approximately equal to 2.302", examples:["LN10", "log(10)"], seealso:[]};
}, function(a) {
  a.exports = {name:"LOG2E", category:"Constants", syntax:["LOG2E"], description:"Returns the base-2 logarithm of E, approximately equal to 1.442", examples:["LOG2E", "log(e, 2)"], seealso:[]};
}, function(a) {
  a.exports = {name:"LOG10E", category:"Constants", syntax:["LOG10E"], description:"Returns the base-10 logarithm of E, approximately equal to 0.434", examples:["LOG10E", "log(e, 10)"], seealso:[]};
}, function(a) {
  a.exports = {name:"NaN", category:"Constants", syntax:["NaN"], description:"Not a number", examples:["NaN", "0 / 0"], seealso:[]};
}, function(a) {
  a.exports = {name:"pi", category:"Constants", syntax:["pi"], description:"The number pi is a mathematical constant that is the ratio of a circle's circumference to its diameter, and is approximately equal to 3.14159", examples:["pi", "sin(pi/2)"], seealso:["tau"]};
}, function(a) {
  a.exports = {name:"SQRT1_2", category:"Constants", syntax:["SQRT1_2"], description:"Returns the square root of 1/2, approximately equal to 0.707", examples:["SQRT1_2", "sqrt(1/2)"], seealso:[]};
}, function(a) {
  a.exports = {name:"SQRT2", category:"Constants", syntax:["SQRT2"], description:"Returns the square root of 2, approximately equal to 1.414", examples:["SQRT2", "sqrt(2)"], seealso:[]};
}, function(a) {
  a.exports = {name:"tau", category:"Constants", syntax:["pi"], description:"Tau is the ratio constant of a circle's circumference to radius, equal to 2 * pi, approximately 6.2832.", examples:["tau", "2 * pi"], seealso:["pi"]};
}, function(a) {
  a.exports = {name:"true", category:"Constants", syntax:["true"], description:"Boolean value true", examples:["true"], seealso:["false"]};
}, function(a) {
  a.exports = {name:"abs", category:"Arithmetic", syntax:["abs(x)"], description:"Compute the absolute value.", examples:["abs(3.5)", "abs(-4.2)"], seealso:["sign"]};
}, function(a) {
  a.exports = {name:"add", category:"Operators", syntax:["x + y", "add(x, y)"], description:"Add two values.", examples:["2.1 + 3.6", "ans - 3.6", "3 + 2i", '"hello" + " world"', "3 cm + 2 inch"], seealso:["subtract"]};
}, function(a) {
  a.exports = {name:"ceil", category:"Arithmetic", syntax:["ceil(x)"], description:"Round a value towards plus infinity.If x is complex, both real and imaginary part are rounded towards plus infinity.", examples:["ceil(3.2)", "ceil(3.8)", "ceil(-4.2)"], seealso:["floor", "fix", "round"]};
}, function(a) {
  a.exports = {name:"cube", category:"Arithmetic", syntax:["cube(x)"], description:"Compute the cube of a value. The cube of x is x * x * x.", examples:["cube(2)", "2^3", "2 * 2 * 2"], seealso:["multiply", "square", "pow"]};
}, function(a) {
  a.exports = {name:"divide", category:"Operators", syntax:["x / y", "divide(x, y)"], description:"Divide two values.", examples:"2 / 3;ans * 3;4.5 / 2;3 + 4 / 2;(3 + 4) / 2;18 km / 4.5".split(";"), seealso:["multiply"]};
}, function(a) {
  a.exports = {name:"edivide", category:"Operators", syntax:["x ./ y", "edivide(x, y)"], description:"divide two values element wise.", examples:["a \x3d [1, 2, 3; 4, 5, 6]", "b \x3d [2, 1, 1; 3, 2, 5]", "a ./ b"], seealso:["multiply", "emultiply", "divide"]};
}, function(a) {
  a.exports = {name:"emultiply", category:"Operators", syntax:["x .* y", "emultiply(x, y)"], description:"multiply two values element wise.", examples:["a \x3d [1, 2, 3; 4, 5, 6]", "b \x3d [2, 1, 1; 3, 2, 5]", "a .* b"], seealso:["multiply", "divide", "edivide"]};
}, function(a) {
  a.exports = {name:"epow", category:"Operators", syntax:["x .^ y", "epow(x, y)"], description:"Calculates the power of x to y element wise.", examples:["a \x3d [1, 2, 3; 4, 5, 6]", "a .^ 2"], seealso:["pow"]};
}, function(a) {
  a.exports = {name:"equal", category:"Operators", syntax:["x \x3d\x3d y", "equal(x, y)"], description:"Check equality of two values. Returns 1 if the values are equal, and 0 if not.", examples:"2+2 \x3d\x3d 3;2+2 \x3d\x3d 4;a \x3d 3.2;b \x3d 6-2.8;a \x3d\x3d b;50cm \x3d\x3d 0.5m".split(";"), seealso:["unequal", "smaller", "larger", "smallereq", "largereq"]};
}, function(a) {
  a.exports = {name:"exp", category:"Arithmetic", syntax:["exp(x)"], description:"Calculate the exponent of a value.", examples:["exp(1.3)", "e ^ 1.3", "log(exp(1.3))", "x \x3d 2.4", "(exp(i*x) \x3d\x3d cos(x) + i*sin(x))   # Euler's formula"], seealso:["square", "multiply", "log"]};
}, function(a) {
  a.exports = {name:"fix", category:"Arithmetic", syntax:["fix(x)"], description:"Round a value towards zero.If x is complex, both real and imaginary part are rounded towards zero.", examples:["fix(3.2)", "fix(3.8)", "fix(-4.2)", "fix(-4.8)"], seealso:["ceil", "floor", "round"]};
}, function(a) {
  a.exports = {name:"floor", category:"Arithmetic", syntax:["floor(x)"], description:"Round a value towards minus infinity.If x is complex, both real and imaginary part are rounded towards minus infinity.", examples:["floor(3.2)", "floor(3.8)", "floor(-4.2)"], seealso:["ceil", "fix", "round"]};
}, function(a) {
  a.exports = {name:"gcd", category:"Arithmetic", syntax:["gcd(a, b)", "gcd(a, b, c, ...)"], description:"Compute the greatest common divisor.", examples:["gcd(8, 12)", "gcd(-4, 6)", "gcd(25, 15, -10)"], seealso:["lcm", "xgcd"]};
}, function(a) {
  a.exports = {name:"larger", category:"Operators", syntax:["x \x3e y", "larger(x, y)"], description:"Check if value x is larger than y. Returns 1 if x is larger than y, and 0 if not.", examples:"2 \x3e 3;5 \x3e 2*2;a \x3d 3.3;b \x3d 6-2.8;(a \x3e b);(b \x3c a);5 cm \x3e 2 inch".split(";"), seealso:["equal", "unequal", "smaller", "smallereq", "largereq"]};
}, function(a) {
  a.exports = {name:"largereq", category:"Operators", syntax:["x \x3e\x3d y", "largereq(x, y)"], description:"Check if value x is larger or equal to y. Returns 1 if x is larger or equal to y, and 0 if not.", examples:["2 \x3e 1+1", "2 \x3e\x3d 1+1", "a \x3d 3.2", "b \x3d 6-2.8", "(a \x3e b)"], seealso:["equal", "unequal", "smallereq", "smaller", "largereq"]};
}, function(a) {
  a.exports = {name:"lcm", category:"Arithmetic", syntax:["lcm(x, y)"], description:"Compute the least common multiple.", examples:["lcm(4, 6)", "lcm(6, 21)", "lcm(6, 21, 5)"], seealso:["gcd"]};
}, function(a) {
  a.exports = {name:"log", category:"Arithmetic", syntax:["log(x)", "log(x, base)"], description:"Compute the logarithm of a value. If no base is provided, the natural logarithm of x is calculated. If base if provided, the logarithm is calculated for the specified base. log(x, base) is defined as log(x) / log(base).", examples:"log(3.5);a \x3d log(2.4);exp(a);10 ^ 3;log(1000, 10);log(1000) / log(10);b \x3d logb(1024, 2);2 ^ b".split(";"), seealso:["exp", "log10"]};
}, function(a) {
  a.exports = {name:"log10", category:"Arithmetic", syntax:["log10(x)"], description:"Compute the 10-base logarithm of a value.", examples:["log10(1000)", "10 ^ 3", "log10(0.01)", "log(1000) / log(10)", "log(1000, 10)"], seealso:["exp", "log"]};
}, function(a) {
  a.exports = {name:"mod", category:"Operators", syntax:["x % y", "x mod y", "mod(x, y)"], description:"Calculates the modulus, the remainder of an integer division.", examples:"7 % 3;11 % 2;10 mod 4;function isOdd(x) \x3d x % 2;isOdd(2);isOdd(3)".split(";"), seealso:[]};
}, function(a) {
  a.exports = {name:"multiply", category:"Operators", syntax:["x * y", "multiply(x, y)"], description:"multiply two values.", examples:["2.1 * 3.6", "ans / 3.6", "2 * 3 + 4", "2 * (3 + 4)", "3 * 2.1 km"], seealso:["divide"]};
}, function(a) {
  a.exports = {name:"pow", category:"Operators", syntax:["x ^ y", "pow(x, y)"], description:"Calculates the power of x to y, x^y.", examples:["2^3 \x3d 8", "2*2*2", "1 + e ^ (pi * i)"], seealso:["unequal", "smaller", "larger", "smallereq", "largereq"]};
}, function(a) {
  a.exports = {name:"round", category:"Arithmetic", syntax:["round(x)", "round(x, n)"], description:"round a value towards the nearest integer.If x is complex, both real and imaginary part are rounded towards the nearest integer. When n is specified, the value is rounded to n decimals.", examples:"round(3.2);round(3.8);round(-4.2);round(-4.8);round(pi, 3);round(123.45678, 2)".split(";"), seealso:["ceil", "floor", "fix"]};
}, function(a) {
  a.exports = {name:"sign", category:"Arithmetic", syntax:["sign(x)"], description:"Compute the sign of a value. The sign of a value x is 1 when x\x3e1, -1 when x\x3c0, and 0 when x\x3d0.", examples:["sign(3.5)", "sign(-4.2)", "sign(0)"], seealso:["abs"]};
}, function(a) {
  a.exports = {name:"smaller", category:"Operators", syntax:["x \x3c y", "smaller(x, y)"], description:"Check if value x is smaller than value y. Returns 1 if x is smaller than y, and 0 if not.", examples:"2 \x3c 3;5 \x3c 2*2;a \x3d 3.3;b \x3d 6-2.8;(a \x3c b);5 cm \x3c 2 inch".split(";"), seealso:["equal", "unequal", "larger", "smallereq", "largereq"]};
}, function(a) {
  a.exports = {name:"smallereq", category:"Operators", syntax:["x \x3c\x3d y", "smallereq(x, y)"], description:"Check if value x is smaller or equal to value y. Returns 1 if x is smaller than y, and 0 if not.", examples:["2 \x3c 1+1", "2 \x3c\x3d 1+1", "a \x3d 3.2", "b \x3d 6-2.8", "(a \x3c b)"], seealso:["equal", "unequal", "larger", "smaller", "largereq"]};
}, function(a) {
  a.exports = {name:"sqrt", category:"Arithmetic", syntax:["sqrt(x)"], description:"Compute the square root value. If x \x3d y * y, then y is the square root of x.", examples:["sqrt(25)", "5 * 5", "sqrt(-1)"], seealso:["square", "multiply"]};
}, function(a) {
  a.exports = {name:"square", category:"Arithmetic", syntax:["square(x)"], description:"Compute the square of a value. The square of x is x * x.", examples:["square(3)", "sqrt(9)", "3^2", "3 * 3"], seealso:["multiply", "pow", "sqrt", "cube"]};
}, function(a) {
  a.exports = {name:"subtract", category:"Operators", syntax:["x - y", "subtract(x, y)"], description:"subtract two values.", examples:["5.3 - 2", "ans + 2", "2/3 - 1/6", "2 * 3 - 3", "2.1 km - 500m"], seealso:["add"]};
}, function(a) {
  a.exports = {name:"unary", category:"Operators", syntax:["-x", "unary(x)"], description:"Inverse the sign of a value.", examples:["-4.5", "-(-5.6)"], seealso:["add", "subtract"]};
}, function(a) {
  a.exports = {name:"unequal", category:"Operators", syntax:["x !\x3d y", "unequal(x, y)"], description:"Check unequality of two values. Returns 1 if the values are unequal, and 0 if they are equal.", examples:"2+2 !\x3d 3;2+2 !\x3d 4;a \x3d 3.2;b \x3d 6-2.8;a !\x3d b;50cm !\x3d 0.5m;5 cm !\x3d 2 inch".split(";"), seealso:["equal", "smaller", "larger", "smallereq", "largereq"]};
}, function(a) {
  a.exports = {name:"xgcd", category:"Arithmetic", syntax:["xgcd(a, b)"], description:"Calculate the extended greatest common divisor for two values", examples:["xgcd(8, 12)", "gcd(8, 12)", "xgcd(36163, 21199)"], seealso:["gcd", "lcm"]};
}, function(a) {
  a.exports = {name:"arg", category:"Complex", syntax:["arg(x)"], description:"Compute the argument of a complex value. If x \x3d a+bi, the argument is computed as atan2(b, a).", examples:["arg(2 + 2i)", "atan2(3, 2)", "arg(2 - 3i)"], seealso:["re", "im", "conj", "abs"]};
}, function(a) {
  a.exports = {name:"conj", category:"Complex", syntax:["conj(x)"], description:"Compute the complex conjugate of a complex value. If x \x3d a+bi, the complex conjugate is a-bi.", examples:["conj(2 + 3i)", "conj(2 - 3i)", "conj(-5.2i)"], seealso:["re", "im", "abs", "arg"]};
}, function(a) {
  a.exports = {name:"re", category:"Complex", syntax:["re(x)"], description:"Get the real part of a complex number.", examples:["re(2 + 3i)", "im(2 + 3i)", "re(-5.2i)", "re(2.4)"], seealso:["im", "conj", "abs", "arg"]};
}, function(a) {
  a.exports = {name:"im", category:"Complex", syntax:["im(x)"], description:"Get the imaginary part of a complex number.", examples:["im(2 + 3i)", "re(2 + 3i)", "im(-5.2i)", "im(2.4)"], seealso:["re", "conj", "abs", "arg"]};
}, function(a) {
  a.exports = {name:"bignumber", category:"Type", syntax:["bignumber(x)"], description:"Create a big number from a number or string.", examples:["0.1 + 0.2", "bignumber(0.1) + bignumber(0.2)", 'bignumber("7.2")', 'bignumber("7.2e500")', "bignumber([0.1, 0.2, 0.3])"], seealso:"boolean complex index matrix string unit".split(" ")};
}, function(a) {
  a.exports = {name:"boolean", category:"Type", syntax:["x", "boolean(x)"], description:"Convert a string or number into a boolean.", examples:'boolean(0);boolean(1);boolean(3);boolean("true");boolean("false");boolean([1, 0, 1, 1])'.split(";"), seealso:"bignumber complex index matrix number string unit".split(" ")};
}, function(a) {
  a.exports = {name:"complex", category:"Type", syntax:["complex()", "complex(re, im)", "complex(string)"], description:"Create a complex number.", examples:["complex()", "complex(2, 3)", 'complex("7 - 2i")'], seealso:"bignumber boolean index matrix number string unit".split(" ")};
}, function(a) {
  a.exports = {name:"index", category:"Type", syntax:"[start];[start:end];[start:step:end];[start1, start 2, ...];[start1:end1, start2:end2, ...];[start1:step1:end1, start2:step2:end2, ...]".split(";"), description:"Create an index to get or replace a subset of a matrix", examples:"[]{[1, 2, 3]{A \x3d [1, 2, 3; 4, 5, 6]{A[1, :]{A[1, 2] \x3d 50{A[0:2, 0:2] \x3d ones(2, 2)".split("{"), seealso:"bignumber boolean complex matrix, number range string unit".split(" ")};
}, function(a) {
  a.exports = {name:"matrix", category:"Type", syntax:["[]", "[a1, b1, ...; a2, b2, ...]", "matrix()", "matrix([...])"], description:"Create a matrix.", examples:["[]", "[1, 2, 3]", "[1, 2, 3; 4, 5, 6]", "matrix()", "matrix([3, 4])"], seealso:"bignumber boolean complex index number string unit".split(" ")};
}, function(a) {
  a.exports = {name:"number", category:"Type", syntax:["x", "number(x)"], description:"Create a number or convert a string or boolean into a number.", examples:'2;2e3;4.05;number(2);number("7.2");number(true);number([true, false, true, true])'.split(";"), seealso:"bignumber boolean complex index matrix string unit".split(" ")};
}, function(a) {
  a.exports = {name:"string", category:"Type", syntax:['"text"', "string(x)"], description:"Create a string or convert a value to a string", examples:['"Hello World!"', "string(4.2)", "string(3 + 2i)"], seealso:"bignumber boolean complex index matrix number unit".split(" ")};
}, function(a) {
  a.exports = {name:"unit", category:"Type", syntax:["value unit", "unit(value, unit)", "unit(string)"], description:"Create a unit.", examples:["5.5 mm", "3 inch", 'unit(7.1, "kilogram")', 'unit("23 deg")'], seealso:"bignumber boolean complex index matrix number string".split(" ")};
}, function(a) {
  a.exports = {name:"eval", category:"Expression", syntax:["eval(expression)", "eval([expr1, expr2, expr3, ...])"], description:"Evaluate an expression or an array with expressions.", examples:['eval("2 + 3")', 'eval("sqrt(" + 4 + ")")'], seealso:[]};
}, function(a) {
  a.exports = {name:"help", category:"Expression", syntax:["help(object)", "help(string)"], description:"Display documentation on a function or data type.", examples:["help(sqrt)", 'help("complex")'], seealso:[]};
}, function(a) {
  a.exports = {name:"concat", category:"Matrix", syntax:["concat(a, b, c, ...)", "concat(a, b, c, ..., dim)"], description:"Concatenate matrices. By default, the matrices are concatenated by the first dimension. The dimension on which to concatenate can be provided as last argument.", examples:"a \x3d [1, 2; 5, 6]{b \x3d [3, 4; 7, 8]{concat(a, b){[a, b]{concat(a, b, 2){[a; b]".split("{"), seealso:"det diag eye inv ones range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"det", category:"Matrix", syntax:["det(x)"], description:"Calculate the determinant of a matrix", examples:["det([1, 2; 3, 4])", "det([-2, 2, 3; -1, 1, 3; 2, 0, -1])"], seealso:"concat diag eye inv ones range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"diag", category:"Matrix", syntax:["diag(x)", "diag(x, k)"], description:"Create a diagonal matrix or retrieve the diagonal of a matrix. When x is a vector, a matrix with the vector values on the diagonal will be returned. When x is a matrix, a vector with the diagonal values of the matrix is returned.When k is provided, the k-th diagonal will be filled in or retrieved, if k is positive, the values are placed on the super diagonal. When k is negative, the values are placed on the sub diagonal.", 
  examples:["diag(1:3)", "diag(1:3, 1)", "a \x3d [1, 2, 3; 4, 5, 6; 7, 8, 9]", "diag(a)"], seealso:"concat det eye inv ones range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"eye", category:"Matrix", syntax:["eye(n)", "eye(m, n)", "eye([m, n])", "eye"], description:"Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.", examples:["eye(3)", "eye(3, 5)", "a \x3d [1, 2, 3; 4, 5, 6]", "eye(size(a))"], seealso:"concat det diag inv ones range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"inv", category:"Matrix", syntax:["inv(x)"], description:"Calculate the inverse of a matrix", examples:["inv([1, 2; 3, 4])", "inv(4)", "1 / 4"], seealso:"concat det diag eye ones range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"ones", category:"Matrix", syntax:"ones(m);ones(m, n);ones(m, n, p, ...);ones([m]);ones([m, n]);ones([m, n, p, ...]);ones".split(";"), description:"Create a matrix containing ones.", examples:["ones(3)", "ones(3, 5)", "ones([2,3]) * 4.5", "a \x3d [1, 2, 3; 4, 5, 6]", "ones(size(a))"], seealso:"concat det diag eye inv range size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"range", category:"Type", syntax:["start:end", "start:step:end", "range(start, end)", "range(start, end, step)", "range(string)"], description:"Create a range. Lower bound of the range is included, upper bound is excluded.", examples:'1:5{3:-1:-3{range(3, 7){range(0, 12, 2){range("4:10"){a \x3d [1, 2, 3, 4; 5, 6, 7, 8]{a[1:2, 1:2]'.split("{"), seealso:"concat det diag eye inv ones size squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"resize", category:"Matrix", syntax:["resize(x, size)", "resize(x, size, defaultValue)"], description:"Resize a matrix.", examples:["resize([1,2,3,4,5], [3])", "resize([1,2,3], [5], 0)", "resize(2, [2, 3], 0)", 'resize("hello", [8], "!")'], seealso:["size", "subset", "squeeze"]};
}, function(a) {
  a.exports = {name:"size", category:"Matrix", syntax:["size(x)"], description:"Calculate the size of a matrix.", examples:["size(2.3)", 'size("hello world")', "a \x3d [1, 2; 3, 4; 5, 6]", "size(a)", "size(1:6)"], seealso:"concat det diag eye inv ones range squeeze subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"squeeze", category:"Matrix", syntax:["squeeze(x)"], description:"Remove singleton dimensions from a matrix.", examples:["a \x3d zeros(1,3,2)", "size(squeeze(a))", "b \x3d zeros(3,1,1)", "size(squeeze(b))"], seealso:"concat det diag eye inv ones range size subset transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"subset", category:"Matrix", syntax:["value(index)", "value(index) \x3d replacement", "subset(value, [index])", "subset(value, [index], replacement)"], description:"Get or set a subset of a matrix or string. Indexes are one-based. Both the ranges lower-bound and upper-bound are included.", examples:"d \x3d [1, 2; 3, 4]{e \x3d []{e[1, 1:2] \x3d [5, 6]{e[2, :] \x3d [7, 8]{f \x3d d * e{f[2, 1]{f[:, 1]".split("{"), seealso:"concat det diag eye inv ones range size squeeze transpose zeros".split(" ")};
}, function(a) {
  a.exports = {name:"transpose", category:"Matrix", syntax:["x'", "transpose(x)"], description:"Transpose a matrix", examples:["a \x3d [1, 2, 3; 4, 5, 6]", "a'", "transpose(a)"], seealso:"concat det diag eye inv ones range size squeeze subset zeros".split(" ")};
}, function(a) {
  a.exports = {name:"zeros", category:"Matrix", syntax:"zeros(m);zeros(m, n);zeros(m, n, p, ...);zeros([m]);zeros([m, n]);zeros([m, n, p, ...]);zeros".split(";"), description:"Create a matrix containing zeros.", examples:["zeros(3)", "zeros(3, 5)", "a \x3d [1, 2, 3; 4, 5, 6]", "zeros(size(a))"], seealso:"concat det diag eye inv ones range size squeeze subset transpose".split(" ")};
}, function(a) {
  a.exports = {name:"combinations", category:"Probability", syntax:["combinations(n, k)"], description:"Compute the number of combinations of n items taken k at a time", examples:["combinations(7, 5)"], seealso:["permutations", "factorial"]};
}, function(a) {
  a.exports = {name:"distribution", category:"Probability", syntax:["distribution(name)", "distribution(name, arg1, arg2, ...)"], description:'Create a distribution object of a specific type. A distribution object contains functions `random([size,] [min,] [max])`, `randomInt([size,] [min,] [max])`, and `pickRandom(array)`. Available types of distributions: "uniform", "normal". Note that the function distribution is currently not available via the expression parser.', examples:[], seealso:["random", 
  "randomInt"]};
}, function(a) {
  a.exports = {name:"factorial", category:"Probability", syntax:["n!", "factorial(n)"], description:"Compute the factorial of a value", examples:["5!", "5*4*3*2*1", "3!"], seealso:[]};
}, function(a) {
  a.exports = {name:"permutations", category:"Probability", syntax:["permutations(n)", "permutations(n, k)"], description:"Compute the number of permutations of n items taken k at a time", examples:["permutations(5)", "permutations(5, 4)"], seealso:["combinations", "factorial"]};
}, function(a) {
  a.exports = {name:"pickRandom", category:"Probability", syntax:["pickRandom(array)"], description:"Pick a random entry from a given array.", examples:["pickRandom(0:10)", "pickRandom([1, 3, 1, 6])"], seealso:["distribution", "random", "randomInt"]};
}, function(a) {
  a.exports = {name:"random", category:"Probability", syntax:"random();random(max);random(min, max);random(size);random(size, max);random(size, min, max)".split(";"), description:"Return a random number.", examples:["random()", "random(10, 20)", "random([2, 3])"], seealso:["distribution", "pickRandom", "randomInt"]};
}, function(a) {
  a.exports = {name:"randInt", category:"Probability", syntax:"randInt();randInt(max);randInt(min, max);randInt(size);randInt(size, max);randInt(size, min, max)".split(";"), description:"Return a random integer number", examples:["randInt()", "randInt(10, 20)", "randInt([2, 3], 10)"], seealso:["distribution", "pickRandom", "random"]};
}, function(a) {
  a.exports = {name:"min", category:"Statistics", syntax:["min(a, b, c, ...)", "min(A)", "min(A, dim)"], description:"Compute the minimum value of a list of values.", examples:"min(2, 3, 4, 1){min([2, 3, 4, 1]){min([2, 5; 4, 3], 0){min([2, 5; 4, 3], 1){min(2.7, 7.1, -4.5, 2.0, 4.1){max(2.7, 7.1, -4.5, 2.0, 4.1)".split("{"), seealso:["max", "mean", "min"]};
}, function(a) {
  a.exports = {name:"mean", category:"Statistics", syntax:["mean(a, b, c, ...)", "mean(A)", "mean(A, dim)"], description:"Compute the arithmetic mean of a list of values.", examples:["mean(2, 3, 4, 1)", "mean([2, 3, 4, 1])", "mean([2, 5; 4, 3], 0)", "mean([2, 5; 4, 3], 1)", "mean([1.0, 2.7, 3.2, 4.0])"], seealso:["max", "min"]};
}, function(a) {
  a.exports = {name:"max", category:"Statistics", syntax:["max(a, b, c, ...)", "max(A)", "max(A, dim)"], description:"Compute the maximum value of a list of values.", examples:"max(2, 3, 4, 1){max([2, 3, 4, 1]){max([2, 5; 4, 3], 0){max([2, 5; 4, 3], 1){max(2.7, 7.1, -4.5, 2.0, 4.1){min(2.7, 7.1, -4.5, 2.0, 4.1)".split("{"), seealso:["mean", "min"]};
}, function(a) {
  a.exports = {name:"acos", category:"Trigonometry", syntax:["acos(x)"], description:"Compute the inverse cosine of a value in radians.", examples:["acos(0.5)", "acos(cos(2.3))"], seealso:["cos", "acos", "asin"]};
}, function(a) {
  a.exports = {name:"asin", category:"Trigonometry", syntax:["asin(x)"], description:"Compute the inverse sine of a value in radians.", examples:["asin(0.5)", "asin(sin(2.3))"], seealso:["sin", "acos", "asin"]};
}, function(a) {
  a.exports = {name:"atan", category:"Trigonometry", syntax:["atan(x)"], description:"Compute the inverse tangent of a value in radians.", examples:["atan(0.5)", "atan(tan(2.3))"], seealso:["tan", "acos", "asin"]};
}, function(a) {
  a.exports = {name:"atan2", category:"Trigonometry", syntax:["atan2(y, x)"], description:"Computes the principal value of the arc tangent of y/x in radians.", examples:["atan2(2, 2) / pi", "angle \x3d 60 deg in rad", "x \x3d cos(angle)", "y \x3d sin(angle)", "atan2(y, x)"], seealso:["sin", "cos", "tan"]};
}, function(a) {
  a.exports = {name:"cos", category:"Trigonometry", syntax:["cos(x)"], description:"Compute the cosine of x in radians.", examples:["cos(2)", "cos(pi / 4) ^ 2", "cos(180 deg)", "cos(60 deg)", "sin(0.2)^2 + cos(0.2)^2"], seealso:["acos", "sin", "tan"]};
}, function(a) {
  a.exports = {name:"cot", category:"Trigonometry", syntax:["cot(x)"], description:"Compute the cotangent of x in radians. Defined as 1/tan(x)", examples:["cot(2)", "1 / tan(2)"], seealso:["sec", "csc", "tan"]};
}, function(a) {
  a.exports = {name:"csc", category:"Trigonometry", syntax:["csc(x)"], description:"Compute the cosecant of x in radians. Defined as 1/sin(x)", examples:["csc(2)", "1 / sin(2)"], seealso:["sec", "cot", "sin"]};
}, function(a) {
  a.exports = {name:"sec", category:"Trigonometry", syntax:["sec(x)"], description:"Compute the secant of x in radians. Defined as 1/cos(x)", examples:["sec(2)", "1 / cos(2)"], seealso:["cot", "csc", "cos"]};
}, function(a) {
  a.exports = {name:"sin", category:"Trigonometry", syntax:["sin(x)"], description:"Compute the sine of x in radians.", examples:["sin(2)", "sin(pi / 4) ^ 2", "sin(90 deg)", "sin(30 deg)", "sin(0.2)^2 + cos(0.2)^2"], seealso:["asin", "cos", "tan"]};
}, function(a) {
  a.exports = {name:"tan", category:"Trigonometry", syntax:["tan(x)"], description:"Compute the tangent of x in radians.", examples:["tan(0.5)", "sin(0.5) / cos(0.5)", "tan(pi / 4)", "tan(45 deg)"], seealso:["atan", "sin", "cos"]};
}, function(a) {
  a.exports = {name:"to", category:"Units", syntax:["x to unit", "to(x, unit)"], description:"Change the unit of a value.", examples:["5 inch in cm", "3.2kg in g", "16 bytes in bits"], seealso:[]};
}, function(a) {
  a.exports = {name:"clone", category:"Utils", syntax:["clone(x)"], description:"Clone a variable. Creates a copy of primitive variables,and a deep copy of matrices", examples:["clone(3.5)", "clone(2 - 4i)", "clone(45 deg)", "clone([1, 2; 3, 4])", 'clone("hello world")'], seealso:[]};
}, function(a) {
  a.exports = {name:"map", category:"Utils", syntax:["map(x, callback)"], description:"Create a new matrix or array with the results of the callback function executed on each entry of the matrix/array.", examples:["map([1, 2, 3], function(val) { return math.max(val, 1.5) })"], seealso:[]};
}, function(a) {
  a.exports = {name:"forEach", category:"Utils", syntax:["forEach(x, callback)"], description:"Iterates over all elements of a matrix/array, and executes the given callback.", examples:["forEach([1, 2, 3], function(val) { console.log(val) })"], seealso:[]};
}, function(a) {
  a.exports = {name:"format", category:"Utils", syntax:["format(value)", "format(value, precision)"], description:"Format a value of any type as string.", examples:["format(2.3)", "format(3 - 4i)", "format([])", "format(pi, 3)"], seealso:["print"]};
}, function(a) {
  a.exports = {name:"import", category:"Utils", syntax:["import(string)"], description:"Import functions from a file.", examples:['import("numbers")', 'import("./mylib.js")'], seealso:[]};
}, function(a) {
  a.exports = {name:"typeof", category:"Utils", syntax:["typeof(x)"], description:"Get the type of a variable.", examples:["typeof(3.5)", "typeof(2 - 4i)", "typeof(45 deg)", 'typeof("hello world")'], seealso:[]};
}, function(a, b) {
  b.type = function(a) {
    var b = typeof a;
    if ("object" === b) {
      if (null === a) {
        return "null";
      }
      if (a instanceof Boolean) {
        return "boolean";
      }
      if (a instanceof Number) {
        return "number";
      }
      if (a instanceof String) {
        return "string";
      }
      if (Array.isArray(a)) {
        return "array";
      }
      if (a instanceof Date) {
        return "date";
      }
    }
    return b;
  };
}, function(a, b, c) {
  function d(a, c) {
    if (Array.isArray(a)) {
      for (var e = "[", f = a.length, m = 0;f > m;m++) {
        0 != m && (e += ", "), e += d(a[m], c);
      }
      return e + "]";
    }
    return b.format(a, c);
  }
  var e = c(221), f = c(220);
  b.isString = function(a) {
    return a instanceof String || "string" == typeof a;
  };
  b.endsWith = function(a, b) {
    return a.substring(a.length - b.length, a.length) === b;
  };
  b.format = function(a, c) {
    return e.isNumber(a) || a instanceof f ? e.format(a, c) : Array.isArray(a) ? d(a, c) : b.isString(a) ? '"' + a + '"' : "function" == typeof a ? a.syntax ? a.syntax + "" : "function" : a instanceof Object ? "function" == typeof a.format ? a.format(c) : a.toString() : String(a);
  };
}, function(a, b, c) {
  function d(a) {
    return c(e(a));
  }
  function e(a) {
    var b;
    if (!(b = f[a])) {
      throw Error("Cannot find module '" + a + "'.");
    }
    return b;
  }
  var f = {"./clone":95, "./clone.js":95, "./forEach":101, "./forEach.js":101, "./format":96, "./format.js":96, "./import":97, "./import.js":97, "./map":98, "./map.js":98, "./print":99, "./print.js":99, "./typeof":100, "./typeof.js":100};
  d.keys = function() {
    return Object.keys(f);
  };
  d.resolve = e;
  a.exports = d;
}, function(a, b, c) {
  var d;
  !function(e) {
    function f(a, b) {
      var c, d, e, k, l, m;
      if (!(this instanceof f)) {
        return new f(a, b);
      }
      if (a instanceof f) {
        if (A = 0, b === c) {
          return this.s = a.s, this.e = a.e, void(this.c = (a = a.c) ? a.slice() : a);
        }
        a += "";
      }
      if ("string" != typeof a && (a = (e = "number" == typeof a || "[object Number]" == Object.prototype.toString.call(a)) && 0 === a && 0 > 1 / a ? "-0" : a + ""), m = a, b === c && I.test(a)) {
        this.s = "-" == a.charAt(0) ? (a = a.slice(1), -1) : 1;
      } else {
        if (10 == b) {
          return n(a, p, s);
        }
        if (a = z.call(a).replace(/^\+(?!-)/, ""), this.s = "-" == a.charAt(0) ? (a = a.replace(/^-(?!-)/, ""), -1) : 1, null != b ? b != (0 | b) && t || (r = !(2 <= b && 65 > b)) ? (g(b, 2), l = I.test(a)) : (k = "[" + B.slice(0, b |= 0) + "]+", a = a.replace(/\.$/, "").replace(/^\./, "0."), (l = RegExp("^" + k + "(?:\\." + k + ")?$", 37 > b ? "i" : "").test(a)) ? (e && (15 < a.replace(/^0\.0*|\./, "").length && g(m, 0), e = !e), a = h(a, 10, b, this.s)) : "Infinity" != a && "NaN" != a && (g(m, 
        1, b), a = "NaN")) : l = I.test(a), !l) {
          return this.c = this.e = null, "Infinity" != a && ("NaN" != a && g(m, 3), this.s = null), void(A = 0);
        }
      }
      -1 < (c = a.indexOf(".")) && (a = a.replace(".", ""));
      0 < (d = a.search(/e/i)) ? (0 > c && (c = d), c += +a.slice(d + 1), a = a.substring(0, d)) : 0 > c && (c = a.length);
      for (d = 0;"0" == a.charAt(d);d++) {
      }
      if (b = a.length, e && 15 < b && 15 < a.slice(d).length && g(m, 0), A = 0, (c -= d + 1) > v) {
        this.c = this.e = null;
      } else {
        if (d == b || x > c) {
          this.c = [this.e = 0];
        } else {
          for (;"0" == a.charAt(--b);) {
          }
          this.e = c;
          this.c = [];
          for (c = 0;b >= d;this.c[c++] = +a.charAt(d++)) {
          }
        }
      }
    }
    function g(a, b, c, d, e, f) {
      if (t) {
        var g, h = "new BigNumber;cmp;div;eq;gt;gte;lt;lte;minus;mod;plus;times;toFr".split(";")[A ? 0 > A ? -A : A : 0 > 1 / A ? 1 : 0] + "()";
        e = r ? " out of range" : " not a" + (e ? " non-zero" : "n") + " integer";
        throw e = ([h + " number type has more than 15 significant digits", h + " not a base " + c + " number", h + " base" + e, h + " not a number"][b] || c + "() " + b + (f ? " not a boolean or binary digit" : e + (d ? " or not [" + (r ? " negative, positive" : " integer, integer") + " ]" : ""))) + ": " + a, r = A = 0, g = Error(e), g.name = "BigNumber Error", g;
      }
    }
    function h(a, b, c, d) {
      function e(a, d) {
        var f, g, h = 0, k = a.length, l = [0];
        for (d = d || c;k > h;h++) {
          g = l.length;
          for (f = 0;g > f;l[f] *= d, f++) {
          }
          l[0] += B.indexOf(a.charAt(h));
          for (f = 0;f < l.length;f++) {
            l[f] > b - 1 && (null == l[f + 1] && (l[f + 1] = 0), l[f + 1] += l[f] / b ^ 0, l[f] %= b);
          }
        }
        return l.reverse();
      }
      function g(a) {
        for (var b = 0, c = a.length, d = "";c > b;d += B.charAt(a[b++])) {
        }
        return d;
      }
      var h, l, m, n, p;
      if (37 > c && (a = a.toLowerCase()), -1 < (h = a.indexOf("."))) {
        if (h = a.length - h - 1, l = e((new f(c)).pow(h).toF(), 10), n = a.split("."), m = e(n[1]), n = e(n[0]), p = k(m, l, m.length - l.length, d, b, 1 & n[n.length - 1]), d = p.c, h = p.e) {
          for (;++h;d.unshift(0)) {
          }
          a = g(n) + "." + g(d);
        } else {
          d[0] ? n[h = n.length - 1] < b - 1 ? (++n[h], a = g(n)) : a = (new f(g(n), b)).plus(C).toS(b) : a = g(n);
        }
      } else {
        a = g(e(a));
      }
      return a;
    }
    function k(a, b, c, d, e, g) {
      var h, k, l, n, q = b.slice(), r = h = b.length, s = a.length, t = a.slice(0, h), u = t.length, w = new f(C), A = w.c = [], z = 0, B = p + (w.e = c) + 1;
      w.s = d;
      for (d = 0 > B ? 0 : B;u++ < h;t.push(0)) {
      }
      q.unshift(0);
      do {
        for (k = 0;e > k;k++) {
          if (h != (u = t.length)) {
            l = h > u ? 1 : -1;
          } else {
            for (n = -1, l = 0;++n < h;) {
              if (b[n] != t[n]) {
                l = b[n] > t[n] ? 1 : -1;
                break;
              }
            }
          }
          if (!(0 > l)) {
            break;
          }
          for (c = u == h ? b : q;u;) {
            if (t[--u] < c[u]) {
              for (n = u;n && !t[--n];t[n] = e - 1) {
              }
              --t[n];
              t[u] += e;
            }
            t[u] -= c[u];
          }
          for (;!t[0];t.shift()) {
          }
        }
        A[z++] = l ? k : ++k;
        t[0] && l ? t[u] = a[r] || 0 : t = [a[r]];
      } while ((r++ < s || null != t[0]) && d--);
      return A[0] || 1 == z || (--w.e, A.shift()), z > B && m(w, p, e, g, null != t[0]), w.e > v ? w.c = w.e = null : w.e < x && (w.c = [w.e = 0]), w;
    }
    function l(a, b, c) {
      var d = b - (a = new f(a)).e, e = a.c;
      if (!e) {
        return a.toS();
      }
      e.length > ++b && m(a, d, 10);
      for (d = 0 == e[0] ? d + 1 : c ? b : a.e + d + 1;e.length < d;e.push(0)) {
      }
      return d = a.e, 1 == c || 2 == c && (--b < d || q >= d) ? (0 > a.s && e[0] ? "-" : "") + (1 < e.length ? (e.splice(1, 0, "."), e.join("")) : e[0]) + (0 > d ? "e" : "e+") + d : a.toS();
    }
    function m(a, b, c, d, e) {
      var f = a.c, g = 0 > a.s, h = c / 2, k = a.e + b + 1, l = f[k];
      e = e || 0 > k || null != f[k + 1];
      if (e = 4 > s ? (null != l || e) && (0 == s || 2 == s && !g || 3 == s && g) : l > h || l == h && (4 == s || e || 6 == s && (1 & f[k - 1] || !b && d) || 7 == s && !g || 8 == s && g), 1 > k || !f[0]) {
        return f.length = 0, f.push(0), e ? (f[0] = 1, a.e = -b) : a.e = 0, a;
      }
      if (f.length = k--, e) {
        for (--c;++f[k] > c;) {
          f[k] = 0, k-- || (++a.e, f.unshift(1));
        }
      }
      for (k = f.length;!f[--k];f.pop()) {
      }
      return a;
    }
    function n(a, b, c) {
      var d = s;
      return s = c, a = new f(a), a.c && m(a, b, 10), s = d, a;
    }
    var r, p = 20, s = 4, q = -7, u = 21, x = -1E9, v = 1E9, t = !0, w = parseInt;
    e = f.prototype;
    var B = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_", A = 0, I = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i, z = String.prototype.trim || function() {
      return this.replace(/^\s+|\s+$/g, "");
    }, C = f(1);
    f.ROUND_UP = 0;
    f.ROUND_DOWN = 1;
    f.ROUND_CEIL = 2;
    f.ROUND_FLOOR = 3;
    f.ROUND_HALF_UP = 4;
    f.ROUND_HALF_DOWN = 5;
    f.ROUND_HALF_EVEN = 6;
    f.ROUND_HALF_CEIL = 7;
    f.ROUND_HALF_FLOOR = 8;
    f.config = function() {
      var a, b, c = 0, d = {}, e = arguments, f = e[0], h = function(a, b, c) {
        return!((r = b > a || a > c) || w(a) != a && 0 !== a);
      }, k = f && "object" == typeof f ? function() {
        return f.hasOwnProperty(b) ? null != (a = f[b]) : void 0;
      } : function() {
        return e.length > c ? null != (a = e[c++]) : void 0;
      };
      return k(b = "DECIMAL_PLACES") && (h(a, 0, 1E9) ? p = 0 | a : g(a, b, "config")), d[b] = p, k(b = "ROUNDING_MODE") && (h(a, 0, 8) ? s = 0 | a : g(a, b, "config")), d[b] = s, k(b = "EXPONENTIAL_AT") && (h(a, -1E9, 1E9) ? q = -(u = ~~(0 > a ? -a : +a)) : !r && a && h(a[0], -1E9, 0) && h(a[1], 0, 1E9) ? (q = ~~a[0], u = ~~a[1]) : g(a, b, "config", 1)), d[b] = [q, u], k(b = "RANGE") && (h(a, -1E9, 1E9) && ~~a ? x = -(v = ~~(0 > a ? -a : +a)) : !r && a && h(a[0], -1E9, -1) && h(a[1], 1, 1E9) ? (x = 
      ~~a[0], v = ~~a[1]) : g(a, b, "config", 1, 1)), d[b] = [x, v], k(b = "ERRORS") && (a === !!a || 1 === a || 0 === a ? (r = A = 0, w = (t = !!a) ? parseInt : parseFloat) : g(a, b, "config", 0, 0, 1)), d[b] = t, d;
    };
    e.abs = e.absoluteValue = function() {
      var a = new f(this);
      return 0 > a.s && (a.s = 1), a;
    };
    e.ceil = function() {
      return n(this, 0, 2);
    };
    e.comparedTo = e.cmp = function(a, b) {
      var c, d = this.c, e = (A = -A, a = new f(a, b)).c, g = this.s, h = a.s, k = this.e, l = a.e;
      if (!g || !h) {
        return null;
      }
      if (c = d && !d[0], b = e && !e[0], c || b) {
        return c ? b ? 0 : -h : g;
      }
      if (g != h) {
        return g;
      }
      if (c = 0 > g, b = k == l, !d || !e) {
        return b ? 0 : !d ^ c ? 1 : -1;
      }
      if (!b) {
        return k > l ^ c ? 1 : -1;
      }
      g = -1;
      for (h = (k = d.length) < (l = e.length) ? k : l;++g < h;) {
        if (d[g] != e[g]) {
          return d[g] > e[g] ^ c ? 1 : -1;
        }
      }
      return k == l ? 0 : k > l ^ c ? 1 : -1;
    };
    e.dividedBy = e.div = function(a, b) {
      var c = this.c, d = this.e, e = this.s, g = (A = 2, a = new f(a, b)).c, h = a.e, l = a.s, m = e == l ? 1 : -1;
      return(d || c && c[0]) && (h || g && g[0]) ? k(c, g, d - h, m, 10) : new f(e && l && (c ? !g || c[0] != g[0] : g) ? c && 0 == c[0] || !g ? 0 * m : m / 0 : 0 / 0);
    };
    e.equals = e.eq = function(a, b) {
      return A = 3, 0 === this.cmp(a, b);
    };
    e.floor = function() {
      return n(this, 0, 3);
    };
    e.greaterThan = e.gt = function(a, b) {
      return A = 4, 0 < this.cmp(a, b);
    };
    e.greaterThanOrEqualTo = e.gte = function(a, b) {
      return A = 5, 1 == (b = this.cmp(a, b)) || 0 === b;
    };
    e.isFinite = e.isF = function() {
      return!!this.c;
    };
    e.isNaN = function() {
      return!this.s;
    };
    e.isNegative = e.isNeg = function() {
      return 0 > this.s;
    };
    e.isZero = e.isZ = function() {
      return!!this.c && 0 == this.c[0];
    };
    e.lessThan = e.lt = function(a, b) {
      return A = 6, 0 > this.cmp(a, b);
    };
    e.lessThanOrEqualTo = e.lte = function(a, b) {
      return A = 7, -1 == (b = this.cmp(a, b)) || 0 === b;
    };
    e.minus = function(a, b) {
      var c, d, e, g = this.s;
      if (b = (A = 8, a = new f(a, b)).s, !g || !b) {
        return new f(0 / 0);
      }
      if (g != b) {
        return a.s = -b, this.plus(a);
      }
      var h = this.c;
      d = this.e;
      var k = a.c, l = a.e;
      if (!d || !l) {
        if (!h || !k) {
          return h ? (a.s = -b, a) : new f(k ? this : 0 / 0);
        }
        if (!h[0] || !k[0]) {
          return k[0] ? (a.s = -b, a) : new f(h[0] ? this : 3 == s ? -0 : 0);
        }
      }
      if (h = h.slice(), g = d - l) {
        c = (e = 0 > g) ? (g = -g, h) : (l = d, k);
        c.reverse();
        for (b = g;b--;c.push(0)) {
        }
        c.reverse();
      } else {
        for (d = ((e = h.length < k.length) ? h : k).length, g = b = 0;d > b;b++) {
          if (h[b] != k[b]) {
            e = h[b] < k[b];
            break;
          }
        }
      }
      if (e && (c = h, h = k, k = c, a.s = -a.s), 0 < (b = -((d = h.length) - k.length))) {
        for (;b--;h[d++] = 0) {
        }
      }
      for (b = k.length;b > g;) {
        if (h[--b] < k[b]) {
          for (c = b;c && !h[--c];h[c] = 9) {
          }
          --h[c];
          h[b] += 10;
        }
        h[b] -= k[b];
      }
      for (;0 == h[--d];h.pop()) {
      }
      for (;0 == h[0];h.shift(), --l) {
      }
      return(x > l || !h[0]) && (h[0] || (a.s = 3 == s ? -1 : 1), h = [l = 0]), a.c = h, a.e = l, a;
    };
    e.modulo = e.mod = function(a, b) {
      var c = this, d = c.c, e = (A = 9, a = new f(a, b)).c, g = c.s, h = a.s;
      return b = !g || !h || e && !e[0], b || d && !d[0] ? new f(b ? 0 / 0 : c) : (c.s = a.s = 1, b = 1 == a.cmp(c), c.s = g, a.s = h, b ? new f(c) : (g = p, h = s, p = 0, s = 1, c = c.div(a), p = g, s = h, this.minus(c.times(a))));
    };
    e.negated = e.neg = function() {
      var a = new f(this);
      return a.s = -a.s || null, a;
    };
    e.plus = function(a, b) {
      var c, d = this.s;
      if (b = (A = 10, a = new f(a, b)).s, !d || !b) {
        return new f(0 / 0);
      }
      if (d != b) {
        return a.s = -b, this.minus(a);
      }
      var e = this.e, g = this.c, h = a.e, k = a.c;
      if (!e || !h) {
        if (!g || !k) {
          return new f(d / 0);
        }
        if (!g[0] || !k[0]) {
          return k[0] ? a : new f(g[0] ? this : 0 * d);
        }
      }
      if (g = g.slice(), d = e - h) {
        c = 0 < d ? (h = e, k) : (d = -d, g);
        for (c.reverse();d--;c.push(0)) {
        }
        c.reverse();
      }
      0 > g.length - k.length && (c = k, k = g, g = c);
      d = k.length;
      for (b = 0;d;b = (g[--d] = g[d] + k[d] + b) / 10 ^ 0, g[d] %= 10) {
      }
      b && (g.unshift(b), ++h > v && (g = h = null));
      for (d = g.length;0 == g[--d];g.pop()) {
      }
      return a.c = g, a.e = h, a;
    };
    e.toPower = e.pow = function(a) {
      var b = 0 == 0 * a ? 0 | a : a, c = new f(this), d = new f(C);
      if (((r = -1E6 > a || 1E6 < a) && (b = 1 * a / 0) || w(a) != a && 0 !== a && !(b = 0 / 0)) && !g(a, "exponent", "pow") || !b) {
        return new f(Math.pow(c.toS(), b));
      }
      for (b = 0 > b ? -b : b;1 & b && (d = d.times(c)), b >>= 1, b;) {
        c = c.times(c);
      }
      return 0 > a ? C.div(d) : d;
    };
    e.round = function(a, b) {
      return a = null == a || ((r = 0 > a || 1E9 < a) || w(a) != a) && !g(a, "decimal places", "round") ? 0 : 0 | a, b = null == b || ((r = 0 > b || 8 < b) || w(b) != b && 0 !== b) && !g(b, "mode", "round") ? s : 0 | b, n(this, a, b);
    };
    e.squareRoot = e.sqrt = function() {
      var a, b, c, d, e = this.c, g = this.s, h = this.e, k = p, l = s, n = new f("0.5");
      if (1 !== g || !e || !e[0]) {
        return new f(!g || 0 > g && (!e || e[0]) ? 0 / 0 : e ? this : 1 / 0);
      }
      g = Math.sqrt(this.toS());
      s = 1;
      0 == g || g == 1 / 0 ? (a = e.join(""), a.length + h & 1 || (a += "0"), b = new f(Math.sqrt(a) + ""), b.c || (b.c = [1]), b.e = ((h + 1) / 2 | 0) - (0 > h || 1 & h)) : b = new f(a = g.toString());
      c = b.e;
      g = c + (p += 4);
      3 > g && (g = 0);
      for (h = g;;) {
        if (d = b, b = n.times(d.plus(this.div(d))), d.c.slice(0, g).join("") === b.c.slice(0, g).join("")) {
          if (e = b.c, g -= a && b.e < c, 9 != e[g] || 9 != e[g - 1] || 9 != e[g - 2] || !(9 == e[g - 3] || a && 4 == e[g - 3])) {
            if (!(e[h] || e[h - 1] || e[h - 2] || e[h - 3] && 5 != e[h - 3] || (e.length > h - 2 && (e.length = h - 2), b.times(b).eq(this)))) {
              for (;e.length < h - 3;) {
                e.push(0);
              }
              e[h - 3]++;
            }
            return s = l, m(b, p = k, 10), b;
          }
          if (a && 9 == e[g - 3] && (d = b.round(k, 0), d.times(d).eq(this))) {
            return s = l, p = k, d;
          }
          p += 4;
          g += 4;
          a = "";
        }
      }
    };
    e.times = function(a, b) {
      var c, d = this.c, e = (A = 11, a = new f(a, b)).c, g = this.e, h = a.e, k = this.s;
      if (a.s = k == (b = a.s) ? 1 : -1, !(g || d && d[0]) || !(h || e && e[0])) {
        return new f(!k || !b || d && !d[0] && !e || e && !e[0] && !d ? 0 / 0 : d && e ? 0 * a.s : a.s / 0);
      }
      a.e = g + h;
      (k = d.length) < (b = e.length) && (c = d, d = e, e = c, h = k, k = b, b = h);
      h = k + b;
      for (c = [];h--;c.push(0)) {
      }
      for (g = b - 1;-1 < g;g--) {
        b = 0;
        for (h = k + g;h > g;b = c[h] + e[g] * d[h - g - 1] + b, c[h--] = b % 10 | 0, b = b / 10 | 0) {
        }
        b && (c[h] = (c[h] + b) % 10);
      }
      b && ++a.e;
      !c[0] && c.shift();
      for (h = c.length;!c[--h];c.pop()) {
      }
      return a.c = a.e > v ? a.e = null : a.e < x ? [a.e = 0] : c, a;
    };
    e.toExponential = e.toE = function(a) {
      return l(this, (null == a || ((r = 0 > a || 1E9 < a) || w(a) != a && 0 !== a) && !g(a, "decimal places", "toE")) && this.c ? this.c.length - 1 : 0 | a, 1);
    };
    e.toFixed = e.toF = function(a) {
      var b, c, d;
      return null == a || ((r = 0 > a || 1E9 < a) || w(a) != a && 0 !== a) && !g(a, "decimal places", "toF") || (d = this.e + (0 | a)), b = q, a = u, q = -(u = 1 / 0), d == c ? c = this.toS() : (c = l(this, d), 0 > this.s && this.c && (this.c[0] ? 0 > c.indexOf("-") && (c = "-" + c) : c = c.replace(/^-/, ""))), q = b, u = a, c;
    };
    e.toFraction = e.toFr = function(a) {
      var b, c, d, e, h, k, l, m = e = new f(C), n = d = new f("0"), q = this.c, u = v, w = p, x = s, z = new f(C);
      if (!q) {
        return this.toS();
      }
      l = z.e = q.length - this.e - 1;
      (null == a || (!(A = 12, k = new f(a)).s || (r = 0 > k.cmp(m) || !k.c) || t && k.e < k.c.length - 1) && !g(a, "max denominator", "toFr") || 0 < (a = k).cmp(z)) && (a = 0 < l ? z : m);
      v = 1 / 0;
      k = new f(q.join(""));
      p = 0;
      for (s = 1;b = k.div(z), h = e.plus(b.times(n)), 1 != h.cmp(a);) {
        e = n, n = h, m = d.plus(b.times(h = m)), d = h, z = k.minus(b.times(h = z)), k = h;
      }
      return h = a.minus(e).div(n), d = d.plus(h.times(m)), e = e.plus(h.times(n)), d.s = m.s = this.s, p = 2 * l, s = x, c = 1 > m.div(n).minus(this).abs().cmp(d.div(e).minus(this).abs()) ? [m.toS(), n.toS()] : [d.toS(), e.toS()], v = u, p = w, c;
    };
    e.toPrecision = e.toP = function(a) {
      return null == a || ((r = 1 > a || 1E9 < a) || w(a) != a) && !g(a, "precision", "toP") ? this.toS() : l(this, 0 | --a, 2);
    };
    e.toString = e.toS = function(a) {
      var b, c, d, e = this.e;
      if (null === e) {
        c = this.s ? "Infinity" : "NaN";
      } else {
        if (a === b && (q >= e || e >= u)) {
          return l(this, this.c.length - 1, 1);
        }
        if (c = this.c.join(""), 0 > e) {
          for (;++e;c = "0" + c) {
          }
          c = "0." + c;
        } else {
          if (d = c.length, 0 < e) {
            if (++e > d) {
              for (e -= d;e--;c += "0") {
              }
            } else {
              d > e && (c = c.slice(0, e) + "." + c.slice(e));
            }
          } else {
            if (b = c.charAt(0), 1 < d) {
              c = b + "." + c.slice(1);
            } else {
              if ("0" == b) {
                return b;
              }
            }
          }
        }
        if (null != a) {
          if ((r = !(2 <= a && 65 > a)) || a != (0 | a) && t) {
            g(a, "base", "toS");
          } else {
            if (c = h(c, 0 | a, 10, this.s), "0" == c) {
              return c;
            }
          }
        }
      }
      return 0 > this.s ? "-" + c : c;
    };
    e.valueOf = function() {
      return this.toS();
    };
    "undefined" != typeof a && a.exports ? a.exports = f : (d = function() {
      return f;
    }.call(b, c, b, a), !(void 0 !== d && (a.exports = d)));
  }(this);
}, function(a, b, c) {
  function d(a, b, c) {
    var d;
    return a instanceof e ? (d = a.abs(), d.gte(b) && d.lt(c)) : (d = Math.abs(a), d >= b && c > d);
  }
  var e = c(220);
  b.isNumber = function(a) {
    return a instanceof Number || "number" == typeof a;
  };
  b.isInteger = function(a) {
    return a == Math.round(a);
  };
  b.sign = function(a) {
    return 0 < a ? 1 : 0 > a ? -1 : 0;
  };
  b.format = function(a, c) {
    if ("function" == typeof c) {
      return c(a);
    }
    if (1 / 0 === a) {
      return "Infinity";
    }
    if (a === -1 / 0) {
      return "-Infinity";
    }
    if (isNaN(a)) {
      return "NaN";
    }
    var h = "auto", k = void 0;
    switch(void 0 !== c && (c.notation && (h = c.notation), c && (b.isNumber(c) ? k = c : c.precision && (k = c.precision))), h) {
      case "fixed":
        return b.toFixed(a, k);
      case "scientific":
        throw Error('Format notation "scientific" is deprecated. Use "exponential" instead.');;
      case "exponential":
        return b.toExponential(a, k);
      case "auto":
        var l = 0.001, m = 1E5;
        if (c && c.exponential) {
          void 0 !== c.exponential.lower && (l = c.exponential.lower), void 0 !== c.exponential.upper && (m = c.exponential.upper);
        } else {
          if (c && c.scientific) {
            throw Error("options.scientific is deprecated, use options.exponential instead.");
          }
        }
        if (h = a instanceof e) {
          var n = e.config().EXPONENTIAL_AT;
          e.config({EXPONENTIAL_AT:[Math.round(Math.log(l) / Math.LN10), Math.round(Math.log(m) / Math.LN10)]});
        }
        if (a instanceof e ? a.isZero() : 0 === a) {
          return "0";
        }
        d(a, l, m) ? h ? k = (new e(a.toPrecision(k))).toString() : (k = k ? a.toPrecision(Math.min(k, 21)) : a.toPrecision(), k = parseFloat(k) + "") : k = b.toExponential(a, k);
        return h && e.config({EXPONENTIAL_AT:n}), k.replace(/((\.\d*?)(0+))($|e)/, function(a, b, c, d, e) {
          return "." !== c ? c + e : e;
        });
      default:
        throw Error('Unknown notation "' + h + '". Choose "auto", "exponential", or "fixed".');;
    }
  };
  b.toExponential = function(a, b) {
    return void 0 !== b ? a.toExponential(a instanceof e ? b - 1 : Math.min(b - 1, 20)) : a.toExponential();
  };
  b.toFixed = function(a, b) {
    return a.toFixed(a instanceof e ? b || 0 : Math.min(b, 20));
  };
  b.digits = function(a) {
    return a.toExponential().replace(/e[\+\-0-9]*$/, "").replace(/^0\.0*|\./, "").length;
  };
  b.toBigNumber = function(a) {
    return 15 < b.digits(a) ? a : new e(a);
  };
  b.toNumber = function(a) {
    return parseFloat(a.valueOf());
  };
}, function(a, b, c) {
  function d(a, b, c) {
    var e = a.length;
    if (e != b[c]) {
      throw new RangeError("Dimension mismatch (" + e + " !\x3d " + b[c] + ")");
    }
    if (c < b.length - 1) {
      var f = c + 1;
      for (c = 0;e > c;c++) {
        if (!k(a[c])) {
          throw new RangeError("Dimension mismatch (" + (b.length - 1) + " \x3c " + b.length + ")");
        }
        d(a[c], b, f);
      }
    } else {
      for (c = 0;e > c;c++) {
        if (k(a[c])) {
          throw new RangeError("Dimension mismatch (" + (b.length + 1) + " \x3e " + b.length + ")");
        }
      }
    }
  }
  function e(a, b, c, d) {
    if (!k(a)) {
      throw Error("Array expected");
    }
    var f;
    f = a.length;
    var g = b[c], q = Math.min(f, g);
    if (a.length = g, c < b.length - 1) {
      var u = c + 1;
      for (c = 0;q > c;c++) {
        f = a[c], e(f, b, u, d);
      }
      for (c = q;g > c;c++) {
        f = [], a[c] = f, e(f, b, u, d);
      }
    } else {
      if (void 0 !== d) {
        for (c = f;g > c;c++) {
          a[c] = h.clone(d);
        }
      }
    }
  }
  var f = c(221), g = c(218), h = c(2), k = (c(217), Array.isArray);
  b.size = function(a) {
    for (var c = a, d = [];k(c);) {
      d.push(c.length), c = c[0];
    }
    return b.validate(a, d), d;
  };
  b.validate = function(a, b) {
    if (0 == b.length) {
      if (k(a)) {
        throw new RangeError("Dimension mismatch (" + a.length + " !\x3d 0)");
      }
    } else {
      d(a, b, 0);
    }
  };
  b.validateIndex = function(a, b) {
    if (!f.isNumber(a) || !f.isInteger(a)) {
      throw new TypeError("Index must be an integer (value: " + a + ")");
    }
    if (0 > a) {
      throw new RangeError("Index out of range (" + a + " \x3c 0)");
    }
    if (void 0 !== b && a >= b) {
      throw new RangeError("Index out of range (" + a + " \x3e " + (b - 1) + ")");
    }
  };
  b.resize = function(a, b, c) {
    if (!k(a) || !k(b)) {
      throw new TypeError("Array expected");
    }
    if (0 === b.length) {
      throw Error("Resizing to scalar is not supported");
    }
    b.forEach(function(a) {
      if (!f.isNumber(a) || !f.isInteger(a) || 0 > a) {
        throw new TypeError("Invalid size, must contain positive integers (size: " + g.format(b) + ")");
      }
    });
    for (var d = 1, h = a[0];k(h);) {
      d++, h = h[0];
    }
    for (;d < b.length;) {
      a = [a], d++;
    }
    for (;d > b.length;) {
      a = a[0], d--;
    }
    return e(a, b, 0, c), a;
  };
  b.squeeze = function(a) {
    for (;k(a) && 1 === a.length;) {
      a = a[0];
    }
    return a;
  };
  b.unsqueeze = function(a, c) {
    for (var d = b.size(a), e = 0, d = c - d.length;d > e;e++) {
      a = [a];
    }
    return a;
  };
  b.isArray = k;
}, function(a, b) {
  b.isBoolean = function(a) {
    return a instanceof Boolean || "boolean" == typeof a;
  };
}]);
var qgame = {utils:{}};
qgame.utils.math = {};
qgame.utils.math.math = mathjs();
qgame.utils.math.to_matrix = function(a) {
  return cljs.core.sequential_QMARK_.call(null, a) ? new qgame.utils.math.math.matrix(cljs.core.to_array.call(null, a)) : a;
};
qgame.utils.math.nested_to_matrix = function(a) {
  return clojure.walk.postwalk.call(null, qgame.utils.math.to_matrix, a);
};
qgame.utils.math.to_vec = function(a) {
  return a instanceof Array ? cljs.core.vec.call(null, a) : cljs.core._EQ_.call(null, qgame.utils.math.math.typeof(a), "matrix") ? cljs.core.vec.call(null, a.toArray()) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null;
};
qgame.utils.math.nested_to_vec = function(a) {
  return clojure.walk.prewalk.call(null, qgame.utils.math.to_vec, a);
};
qgame.utils.math.matrix_safe = function() {
  var a = null, b = function(a, b) {
    return qgame.utils.math.nested_to_vec.call(null, a.call(null, qgame.utils.math.nested_to_matrix.call(null, b)));
  }, c = function(a, b, c) {
    b = qgame.utils.math.nested_to_matrix.call(null, b);
    c = qgame.utils.math.nested_to_matrix.call(null, c);
    return qgame.utils.math.nested_to_vec.call(null, a.call(null, b, c));
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
qgame.utils.math.pi = qgame.utils.math.math.pi;
qgame.utils.math.sqrt2 = qgame.utils.math.math.SQRT2;
qgame.utils.math.sqrt1_2 = qgame.utils.math.math.SQRT1_2;
qgame.utils.math.i = qgame.utils.math.math.i;
qgame.utils.math.abs = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.abs, a);
};
qgame.utils.math.round = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0);
  }, c = function(a, b) {
    return qgame.utils.math.matrix_safe.call(null, function(a) {
      return qgame.utils.math.math.round.call(null, a, b);
    }, a);
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
qgame.utils.math.add = function() {
  var a = null, b = function(b) {
    return a.call(null, b, 0);
  }, c = function(a, b) {
    return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.add, a, b);
  }, d = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, d) {
      var f = null;
      2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, f);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
qgame.utils.math.subtract = function() {
  var a = null, b = function(b) {
    return a.call(null, 0, b);
  }, c = function(a, b) {
    return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.subtract, a, b);
  }, d = function() {
    var b = function(b, c, d) {
      return cljs.core.reduce.call(null, a, a.call(null, b, c), d);
    }, c = function(a, c, d) {
      var f = null;
      2 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, f);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var d = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, d, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, f, g) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, f);
      default:
        return d.cljs$core$IFn$_invoke$arity$variadic(a, f, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = d.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  a.cljs$core$IFn$_invoke$arity$variadic = d.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
qgame.utils.math.multiply = function(a, b) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.multiply, a, b);
};
qgame.utils.math.divide = function(a, b) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.divide, a, b);
};
qgame.utils.math.sqrt = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.sqrt, a);
};
qgame.utils.math.cos = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.cos, a);
};
qgame.utils.math.sin = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.sin, a);
};
qgame.utils.math.exp_xi = function(a) {
  return qgame.utils.math.math.exp.call(null, new qgame.utils.math.math.complex(0, a));
};
qgame.utils.math.radians_to_degrees = function(a) {
  return qgame.utils.math.multiply.call(null, qgame.utils.math.divide.call(null, a, qgame.utils.math.math.tau), 360);
};
qgame.utils.math.to_phase = function(a) {
  return qgame.utils.math.matrix_safe.call(null, cljs.core.comp.call(null, qgame.utils.math.radians_to_degrees, qgame.utils.math.math.arg), a);
};
qgame.utils.math.det = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.det, a);
};
qgame.utils.math.rand_2D_complex = function() {
  var a = null, b = function(b, c, f) {
    return a.call(null, b, c, f, f);
  }, c = function(a, b, c, g) {
    var h = function(a) {
      return cljs.core.rand_int.call(null, 2 * a + 1 - a);
    }, k = function() {
      return new qgame.utils.math.math.complex(h.call(null, c), h.call(null, g));
    }, l = function(a) {
      return qgame.utils.math.to_matrix.call(null, cljs.core.repeatedly.call(null, a, k));
    };
    return qgame.utils.math.to_matrix.call(null, cljs.core.repeatedly.call(null, a, function() {
      return l.call(null, b);
    }));
  }, a = function(a, e, f, g) {
    switch(arguments.length) {
      case 3:
        return b.call(this, a, e, f);
      case 4:
        return c.call(this, a, e, f, g);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$3 = b;
  a.cljs$core$IFn$_invoke$arity$4 = c;
  return a;
}();
qgame.utils.math.mat_EQ__QMARK_ = function() {
  var a = null, b = function(a, b) {
    return cljs.core.truth_(cljs.core.some.call(null, cljs.core.false_QMARK_, qgame.utils.math.math.equal.call(null, a.size(), b.size()))) ? !1 : cljs.core.every_QMARK_.call(null, cljs.core.true_QMARK_, cljs.core.flatten.call(null, qgame.utils.math.nested_to_vec.call(null, qgame.utils.math.math.equal.call(null, a, b))));
  }, c = function() {
    var b = function(b, c, d) {
      return(b = a.call(null, b, c)) ? cljs.core.apply.call(null, a, c, d) : b;
    }, c = function(a, c, e) {
      var k = null;
      2 < arguments.length && (k = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2), 0));
      return b.call(this, a, c, k);
    };
    c.cljs$lang$maxFixedArity = 2;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.next(a);
      var e = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, e, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }(), a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      default:
        return c.cljs$core$IFn$_invoke$arity$variadic(a, e, cljs.core.array_seq(arguments, 2));
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$lang$maxFixedArity = 2;
  a.cljs$lang$applyTo = c.cljs$lang$applyTo;
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$variadic = c.cljs$core$IFn$_invoke$arity$variadic;
  return a;
}();
qgame.utils.math.square_QMARK_ = function(a) {
  var b = qgame.utils.math.nested_to_matrix.call(null, a).size();
  a = cljs.core.nth.call(null, b, 0, null);
  b = cljs.core.nth.call(null, b, 1, null);
  return cljs.core._EQ_.call(null, a, b);
};
qgame.utils.math.complex_conjugate = function(a) {
  return qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.conj, a);
};
qgame.utils.math.conjugate_transpose = function(a) {
  return qgame.utils.math.complex_conjugate.call(null, qgame.utils.math.matrix_safe.call(null, qgame.utils.math.math.transpose, a));
};
qgame.utils.math.unitary_QMARK_ = function(a) {
  a = qgame.utils.math.nested_to_matrix.call(null, a);
  var b = a.size(), c = cljs.core.nth.call(null, b, 0, null), b = cljs.core.nth.call(null, b, 1, null), c = qgame.utils.math.math.eye.call(null, c, b), b = qgame.utils.math.conjugate_transpose.call(null, a);
  return qgame.utils.math.mat_EQ__QMARK_.call(null, c, qgame.utils.math.nested_to_matrix.call(null, qgame.utils.math.round.call(null, qgame.utils.math.multiply.call(null, a, b), 5)), qgame.utils.math.nested_to_matrix.call(null, qgame.utils.math.round.call(null, qgame.utils.math.multiply.call(null, b, a), 5)));
};
qgame.utils.math.to_string = function(a) {
  return a.toString();
};
qgame.utils.math.eval_math_string = function(a) {
  return qgame.utils.math.round.call(null, qgame.utils.math.math.eval.call(null, a), 9);
};
qgame.utils.general = {};
qgame.utils.general.update_sub = function(a, b, c) {
  return cljs.core.reduce_kv.call(null, cljs.core.assoc, a, cljs.core.zipmap.call(null, c, b.call(null, cljs.core.map.call(null, cljs.core.partial.call(null, cljs.core.get, a), c))));
};
qgame.utils.general.itermap = function itermap(b, c, d) {
  var e = cljs.core.seq.call(null, d);
  return e ? itermap.call(null, b, cljs.core.concat.call(null, c, cljs.core.map.call(null, function(c) {
    return b.call(null, c, cljs.core.first.call(null, e));
  }, c)), cljs.core.rest.call(null, e)) : c;
};
qgame.utils.general.bit_size = function(a) {
  for (var b = 1;;) {
    if (a <= 1 << b) {
      return b;
    }
    b += 1;
  }
};
qgame.utils.general.anywhere_QMARK_ = function anywhere_QMARK_(b, c) {
  var d = b.call(null, c);
  return cljs.core.truth_(d) ? d : (d = cljs.core.coll_QMARK_.call(null, c)) ? cljs.core.some.call(null, cljs.core.partial.call(null, anywhere_QMARK_, b), c) : d;
};
qgame.utils.general.regex_join = function() {
  var a = function(a) {
    return cljs.core.re_pattern.call(null, cljs.core.apply.call(null, cljs.core.str, cljs.core.map.call(null, function(a) {
      var b = a.source;
      return cljs.core.truth_(b) ? b : a;
    }, a)));
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
qgame.utils.general.errant_QMARK_ = function(a) {
  return qgame.utils.general.anywhere_QMARK_.call(null, cljs.core.every_pred.call(null, cljs.core.map_QMARK_, new cljs.core.Keyword(null, "error", "error", 1110689146)), a);
};
clojure.string = {};
clojure.string.seq_reverse = function(a) {
  return cljs.core.reduce.call(null, cljs.core.conj, cljs.core.List.EMPTY, a);
};
clojure.string.reverse = function(a) {
  return a.split("").reverse().join("");
};
clojure.string.replace = function(a, b, c) {
  if ("string" === typeof b) {
    return a.replace(RegExp(goog.string.regExpEscape(b), "g"), c);
  }
  if (cljs.core.truth_(b.hasOwnProperty("source"))) {
    return a.replace(RegExp(b.source, "g"), c);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw[cljs.core.str("Invalid match arg: "), cljs.core.str(b)].join("");
  }
  return null;
};
clojure.string.replace_first = function(a, b, c) {
  return a.replace(b, c);
};
clojure.string.join = function() {
  var a = null, b = function(a) {
    return cljs.core.apply.call(null, cljs.core.str, a);
  }, c = function(a, b) {
    return cljs.core.apply.call(null, cljs.core.str, cljs.core.interpose.call(null, a, b));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
clojure.string.upper_case = function(a) {
  return a.toUpperCase();
};
clojure.string.lower_case = function(a) {
  return a.toLowerCase();
};
clojure.string.capitalize = function(a) {
  return 2 > cljs.core.count.call(null, a) ? clojure.string.upper_case.call(null, a) : [cljs.core.str(clojure.string.upper_case.call(null, cljs.core.subs.call(null, a, 0, 1))), cljs.core.str(clojure.string.lower_case.call(null, cljs.core.subs.call(null, a, 1)))].join("");
};
clojure.string.pop_last_while_empty = function(a) {
  for (;;) {
    if (cljs.core._EQ_.call(null, "", cljs.core.peek.call(null, a))) {
      a = cljs.core.pop.call(null, a);
    } else {
      return a;
    }
  }
};
clojure.string.discard_trailing_if_needed = function(a, b) {
  return cljs.core._EQ_.call(null, 0, a) ? clojure.string.pop_last_while_empty.call(null, b) : b;
};
clojure.string.split_with_empty_regex = function(a, b) {
  if (0 >= b || b >= 2 + cljs.core.count.call(null, a)) {
    return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a)))), "");
  }
  var c = cljs.core._EQ_;
  if (cljs.core.truth_(c.call(null, 1, b))) {
    return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [a], null);
  }
  if (cljs.core.truth_(c.call(null, 2, b))) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["", a], null);
  }
  c = b - 2;
  return cljs.core.conj.call(null, cljs.core.vec.call(null, cljs.core.cons.call(null, "", cljs.core.subvec.call(null, cljs.core.vec.call(null, cljs.core.map.call(null, cljs.core.str, cljs.core.seq.call(null, a))), 0, c))), cljs.core.subs.call(null, a, c));
};
clojure.string.split = function() {
  var a = null, b = function(b, c) {
    return a.call(null, b, c, 0);
  }, c = function(a, b, c) {
    return clojure.string.discard_trailing_if_needed.call(null, c, cljs.core._EQ_.call(null, "" + cljs.core.str(b), "/(?:)/") ? clojure.string.split_with_empty_regex.call(null, a, c) : 1 > c ? cljs.core.vec.call(null, ("" + cljs.core.str(a)).split(b)) : function() {
      for (var g = a, h = c, k = cljs.core.PersistentVector.EMPTY;;) {
        if (cljs.core._EQ_.call(null, h, 1)) {
          return cljs.core.conj.call(null, k, g);
        }
        var l = cljs.core.re_find.call(null, b, g);
        if (cljs.core.truth_(l)) {
          var m = l, l = g.indexOf(m), m = g.substring(l + cljs.core.count.call(null, m)), h = h - 1, k = cljs.core.conj.call(null, k, g.substring(0, l)), g = m
        } else {
          return cljs.core.conj.call(null, k, g);
        }
      }
    }());
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
clojure.string.split_lines = function(a) {
  return clojure.string.split.call(null, a, /\n|\r\n/);
};
clojure.string.trim = function(a) {
  return goog.string.trim(a);
};
clojure.string.triml = function(a) {
  return goog.string.trimLeft(a);
};
clojure.string.trimr = function(a) {
  return goog.string.trimRight(a);
};
clojure.string.trim_newline = function(a) {
  for (var b = a.length;;) {
    if (0 === b) {
      return "";
    }
    var c = cljs.core.get.call(null, a, b - 1);
    if (cljs.core._EQ_.call(null, c, "\n") || cljs.core._EQ_.call(null, c, "\r")) {
      b -= 1;
    } else {
      return a.substring(0, b);
    }
  }
};
clojure.string.blank_QMARK_ = function(a) {
  return goog.string.isEmptySafe(a);
};
clojure.string.escape = function(a, b) {
  for (var c = new goog.string.StringBuffer, d = a.length, e = 0;;) {
    if (cljs.core._EQ_.call(null, d, e)) {
      return c.toString();
    }
    var f = a.charAt(e), g = cljs.core.get.call(null, b, f);
    cljs.core.truth_(g) ? c.append("" + cljs.core.str(g)) : c.append(f);
    e += 1;
  }
};
qgame.utils.amplitudes = {};
qgame.utils.amplitudes.get_num_qubits = function(a) {
  return qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, a));
};
qgame.utils.amplitudes.amplitude_to_probability = function(a) {
  a = qgame.utils.math.abs.call(null, a);
  return qgame.utils.math.multiply.call(null, a, a);
};
qgame.utils.amplitudes.amplitudes_to_probability = function(a) {
  return cljs.core.reduce.call(null, cljs.core._PLUS_, cljs.core.map.call(null, qgame.utils.amplitudes.amplitude_to_probability, a));
};
qgame.utils.amplitudes.qubits_to_amplitude_indices = function(a, b) {
  var c = cljs.core.remove.call(null, cljs.core.reduce.call(null, cljs.core.conj, cljs.core.PersistentHashSet.EMPTY, a), cljs.core.range.call(null, b));
  return function e(b) {
    return new cljs.core.LazySeq(null, function() {
      for (;;) {
        var c = cljs.core.seq.call(null, b);
        if (c) {
          if (cljs.core.chunked_seq_QMARK_.call(null, c)) {
            var h = cljs.core.chunk_first.call(null, c), k = cljs.core.count.call(null, h), l = cljs.core.chunk_buffer.call(null, k);
            a: {
              for (var m = 0;;) {
                if (m < k) {
                  var n = cljs.core._nth.call(null, h, m);
                  cljs.core.chunk_append.call(null, l, qgame.utils.general.itermap.call(null, cljs.core.bit_flip, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [n], null), a));
                  m += 1;
                } else {
                  h = !0;
                  break a;
                }
              }
              h = void 0;
            }
            return h ? cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), e.call(null, cljs.core.chunk_rest.call(null, c))) : cljs.core.chunk_cons.call(null, cljs.core.chunk.call(null, l), null);
          }
          l = cljs.core.first.call(null, c);
          return cljs.core.cons.call(null, qgame.utils.general.itermap.call(null, cljs.core.bit_flip, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [l], null), a), e.call(null, cljs.core.rest.call(null, c)));
        }
        return null;
      }
    }, null, null);
  }.call(null, qgame.utils.general.itermap.call(null, cljs.core.bit_flip, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [0], null), c));
};
qgame.utils.amplitudes.qubit_state_amplitudes = function(a, b, c) {
  var d = cljs.core.remove.call(null, cljs.core.PersistentHashSet.fromArray([b], !0), cljs.core.range.call(null, qgame.utils.amplitudes.get_num_qubits.call(null, a)));
  b = qgame.utils.general.itermap.call(null, cljs.core.bit_flip, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c * (0 | 1 << b)], null), d);
  return cljs.core.map.call(null, cljs.core.partial.call(null, cljs.core.get, a), b);
};
qgame.utils.amplitudes.probability_of = function(a, b, c) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714));
  b = qgame.utils.amplitudes.qubit_state_amplitudes.call(null, a, b, c);
  return qgame.utils.amplitudes.amplitudes_to_probability.call(null, b);
};
qgame.utils.amplitudes.phase_of = function(a, b, c) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714));
  b = qgame.utils.amplitudes.qubit_state_amplitudes.call(null, a, b, c);
  b = cljs.core.reduce.call(null, qgame.utils.math.add, b);
  return qgame.utils.math.to_phase.call(null, b);
};
qgame.utils.amplitudes.substate_amplitudes = function(a, b) {
  var c = cljs.core.keys.call(null, b), d = cljs.core.remove.call(null, cljs.core.set.call(null, c), cljs.core.range.call(null, qgame.utils.amplitudes.get_num_qubits.call(null, a))), c = cljs.core.keep.call(null, function(a, b) {
    return function(a) {
      var b = cljs.core.nth.call(null, a, 0, null);
      return 0 === cljs.core.nth.call(null, a, 1, null) ? null : b;
    };
  }(c, d), b), c = cljs.core.reduce.call(null, cljs.core.bit_flip, 0, c), d = qgame.utils.general.itermap.call(null, cljs.core.bit_flip, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null), d);
  return cljs.core.map.call(null, cljs.core.partial.call(null, cljs.core.get, a), d);
};
qgame.utils.amplitudes.inner_amplitudes = function(a, b) {
  var c = cljs.core.zipmap.call(null, b, cljs.core.repeat.call(null, 0)), d = cljs.core.zipmap.call(null, b, cljs.core.repeat.call(null, 1)), c = qgame.utils.general.itermap.call(null, cljs.core.conj, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [c], null), d);
  return cljs.core.mapv.call(null, cljs.core.partial.call(null, qgame.utils.amplitudes.substate_amplitudes, a), c);
};
qgame.utils.amplitudes.self_conj_outer_prod = function(a) {
  a = cljs.core.mapv.call(null, cljs.core.vector, a);
  var b = qgame.utils.math.conjugate_transpose.call(null, a);
  return qgame.utils.math.multiply.call(null, a, b);
};
qgame.utils.amplitudes.density_matrix = function(a, b) {
  var c = qgame.utils.amplitudes.inner_amplitudes.call(null, a, b), c = cljs.core.mapv.call(null, qgame.utils.amplitudes.amplitudes_to_probability, c);
  return qgame.utils.amplitudes.self_conj_outer_prod.call(null, c);
};
qgame.utils.amplitudes.tangle_of = function(a, b, c) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714));
  c = qgame.utils.amplitudes.density_matrix.call(null, a, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, c], null));
  b = cljs.core.mapv.call(null, function(a) {
    return function(a) {
      return cljs.core.subvec.call(null, a, 0, 2);
    };
  }(c), cljs.core.subvec.call(null, c, 0, 2));
  c = cljs.core.mapv.call(null, function(a, b) {
    return function(a) {
      return cljs.core.subvec.call(null, a, 2);
    };
  }(c, b), cljs.core.subvec.call(null, c, 2));
  b = qgame.utils.math.add.call(null, b, c);
  return 4 * qgame.utils.math.det.call(null, b);
};
qgame.simulator = {};
qgame.simulator.flow = {};
qgame.simulator.flow.force_to = function(a, b, c) {
  a = cljs.core.assoc_in.call(null, cljs.core.update_in.call(null, a, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "measurement-history", "measurement-history", 2775390965)], null), cljs.core.conj, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, c], null)), new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "prior-probability", "prior-probability", 
  4421087524)], null), qgame.utils.amplitudes.probability_of.call(null, a, b, c));
  b = qgame.utils.amplitudes.qubits_to_amplitude_indices.call(null, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [b], null), qgame.utils.amplitudes.get_num_qubits.call(null, (new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714)).cljs$core$IFn$_invoke$arity$1(a)));
  b = cljs.core.map.call(null, function(a, b, f) {
    return function(a) {
      return cljs.core.nth.call(null, a, 1 - c);
    };
  }(0, a, b), b);
  return 0 < (new cljs.core.Keyword(null, "prior-probability", "prior-probability", 4421087524)).cljs$core$IFn$_invoke$arity$1(a) ? cljs.core.update_in.call(null, a, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714)], null), qgame.utils.general.update_sub, cljs.core.constantly.call(null, cljs.core.repeat.call(null, 0)), b) : null;
};
qgame.simulator.flow.force_and_split = function(a, b) {
  var c = cljs.core.nth.call(null, a, 0, null), d = cljs.core.nthnext.call(null, a, 1), e = cljs.core.keep.call(null, function(a) {
    return qgame.simulator.flow.force_to.call(null, a, b, 1);
  }, c), c = cljs.core.keep.call(null, function(a) {
    return function(a) {
      return qgame.simulator.flow.force_to.call(null, a, b, 0);
    };
  }(e), c);
  return cljs.core.into.call(null, d, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.not_empty.call(null, e), cljs.core.not_empty.call(null, c)], null));
};
qgame.simulator.flow.swap_first_two = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
  a = cljs.core.nthnext.call(null, a, 2);
  return cljs.core.into.call(null, a, cljs.core.take_while.call(null, cljs.core.identity, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [b, c], null)));
};
qgame.simulator.flow.concat_first_two = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null);
  a = cljs.core.nthnext.call(null, a, 2);
  return cljs.core.cons.call(null, cljs.core.into.call(null, c, b), a);
};
qgame.simulator.flow.measure = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "FlowControl", "FlowControl", 825984929), new cljs.core.Keyword(null, "name", "name", 1017277949), "measure"], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), qgame.simulator.flow.force_and_split, new cljs.core.Keyword(null, 
"num-qubits", "num-qubits", 1175408835), 1], null);
qgame.simulator.flow.else$ = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "FlowControl", "FlowControl", 825984929), new cljs.core.Keyword(null, "name", "name", 1017277949), "else"], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), qgame.simulator.flow.swap_first_two], null);
qgame.simulator.flow.end = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "FlowControl", "FlowControl", 825984929), new cljs.core.Keyword(null, "name", "name", 1017277949), "end"], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), qgame.simulator.flow.concat_first_two], null);
qgame.simulator.qgates = {};
qgame.simulator.qgates.apply_operator = function(a, b, c) {
  return cljs.core.reduce.call(null, b, a, qgame.utils.amplitudes.qubits_to_amplitude_indices.call(null, cljs.core.reverse.call(null, c), qgame.utils.amplitudes.get_num_qubits.call(null, a)));
};
qgame.simulator.qgates.to_operator = function(a) {
  if (!qgame.utils.math.square_QMARK_.call(null, a)) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol("m", "square?", "m/square?", 689332155, null), new cljs.core.Symbol(null, "matrix", "matrix", 1573196154, null))))].join(""));
  }
  if (!cljs.core.truth_(qgame.utils.math.unitary_QMARK_.call(null, a))) {
    throw Error([cljs.core.str("Assert failed: "), cljs.core.str(cljs.core.pr_str.call(null, cljs.core.list(new cljs.core.Symbol("m", "unitary?", "m/unitary?", -1932796158, null), new cljs.core.Symbol(null, "matrix", "matrix", 1573196154, null))))].join(""));
  }
  return function(b, c) {
    return qgame.utils.general.update_sub.call(null, b, cljs.core.partial.call(null, qgame.utils.math.multiply, a), c);
  };
};
qgame.simulator.qgates.binary_gate_matrix = function(a) {
  var b = 2 * cljs.core.count.call(null, a);
  return cljs.core.vec.call(null, cljs.core.map_indexed.call(null, function(a, d) {
    return cljs.core.assoc.call(null, cljs.core.vec.call(null, cljs.core.repeat.call(null, b, 0)), (cljs.core.even_QMARK_.call(null, a) ? cljs.core._PLUS_ : cljs.core._).call(null, a, d), 1);
  }, cljs.core.interleave.call(null, a, a)));
};
qgame.simulator.qgates.anonymous_qgate = function(a) {
  return function() {
    var b = function(b, c) {
      return qgame.simulator.qgates.apply_operator.call(null, b, qgame.simulator.qgates.to_operator.call(null, a), c);
    }, c = function(a, c) {
      var f = null;
      1 < arguments.length && (f = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
      return b.call(this, a, f);
    };
    c.cljs$lang$maxFixedArity = 1;
    c.cljs$lang$applyTo = function(a) {
      var c = cljs.core.first(a);
      a = cljs.core.rest(a);
      return b(c, a);
    };
    c.cljs$core$IFn$_invoke$arity$variadic = b;
    return c;
  }();
};
qgame.simulator.qgates.to_oracle = function() {
  var a = function(a) {
    return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Oracle", "Oracle", 3383876880), new cljs.core.Keyword(null, "name", "name", 1017277949), "oracle"], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), qgame.simulator.qgates.anonymous_qgate.call(null, qgame.simulator.qgates.binary_gate_matrix.call(null, 
    a)), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, a)) + 1, new cljs.core.Keyword(null, "tt-right-column", "tt-right-column", 1264893382), a], null);
  }, b = function(b) {
    var d = null;
    0 < arguments.length && (d = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0), 0));
    return a.call(this, d);
  };
  b.cljs$lang$maxFixedArity = 0;
  b.cljs$lang$applyTo = function(b) {
    b = cljs.core.seq(b);
    return a(b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}();
qgame.simulator.qgates.with_oracle = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "ParseTime", "ParseTime", 1184785266), new cljs.core.Keyword(null, "name", "name", 1017277949), "with_oracle"], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), qgame.simulator.qgates.to_oracle], null);
var dummy_matrix__4816__auto___6034 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0], null)], null), num_qubits__4817__auto___6035 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6034));
qgame.simulator.qgates.qnot = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6035, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "qnot", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6035], 
null);
var dummy_matrix__4816__auto___6040 = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, 1], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, 
[0, 0, 1, 0], null)], null), num_qubits__4817__auto___6041 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6040));
qgame.simulator.qgates.cnot = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, 
[0, 0, 0, 1], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6041, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, 1], null), 
    new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "cnot", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6041], 
null);
var dummy_matrix__4816__auto___6046 = qgame.utils.math.multiply.call(null, qgame.utils.math.divide.call(null, qgame.utils.math.sqrt2, 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null)], null)), num_qubits__4817__auto___6047 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, 
dummy_matrix__4816__auto___6046));
qgame.simulator.qgates.srn = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", "divide", "m/divide", 1322979808, null), new cljs.core.Symbol("m", "sqrt2", "m/sqrt2", -1530839989, null), 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 
5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null)], null)), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6047, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, qgame.utils.math.multiply.call(null, qgame.utils.math.divide.call(null, qgame.utils.math.sqrt2, 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null)], null))), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "srn", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6047], 
null);
var dummy_matrix__4816__auto___6052 = qgame.simulator.qgates.binary_gate_matrix.call(null, new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1, 1, 0], null)), num_qubits__4817__auto___6053 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6052));
qgame.simulator.qgates.nand = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), cljs.core.list(new cljs.core.Symbol(null, "binary-gate-matrix", "binary-gate-matrix", 1177512176, null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1, 1, 0], null)), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6053, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, qgame.simulator.qgates.binary_gate_matrix.call(null, new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1, 1, 0], null))), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "nand", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6053], 
null);
var dummy_matrix__4816__auto___6058 = qgame.utils.math.multiply.call(null, qgame.utils.math.divide.call(null, qgame.utils.math.sqrt.call(null, 2), 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null)], null)), num_qubits__4817__auto___6059 = qgame.utils.general.bit_size.call(null, 
cljs.core.count.call(null, dummy_matrix__4816__auto___6058));
qgame.simulator.qgates.hadamard = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", "divide", "m/divide", 1322979808, null), cljs.core.list(new cljs.core.Symbol("m", "sqrt", "m/sqrt", -1636986279, null), 2), 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 
2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null)], null)), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6059, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, qgame.utils.math.multiply.call(null, qgame.utils.math.divide.call(null, qgame.utils.math.sqrt.call(null, 2), 2), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 1], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, -1], null)], 
    null))), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "hadamard", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6059], 
null);
var dummy_matrix__4816__auto___6065 = function() {
  var a = cljs.core.repeat.call(null, 1), a = cljs.core.nth.call(null, a, 0, null);
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.cos.call(null, a), qgame.utils.math.sin.call(null, a)], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.subtract.call(null, qgame.utils.math.sin.call(null, a)), qgame.utils.math.cos.call(null, a)], null)], null);
}(), num_qubits__4817__auto___6066 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6065));
qgame.simulator.qgates.utheta = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.list(new cljs.core.Symbol("m", "cos", "m/cos", -1640425738, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null)), cljs.core.list(new cljs.core.Symbol("m", "sin", 
"m/sin", -1640410751, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null))], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), cljs.core.list(new cljs.core.Symbol("m", "sin", "m/sin", -1640410751, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null))), cljs.core.list(new cljs.core.Symbol("m", "cos", "m/cos", -1640425738, null), new cljs.core.Symbol(null, 
"theta", "theta", -1530204073, null))], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6066, b), f = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), e = cljs.core.nth.call(null, e, 0, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.cos.call(null, e), qgame.utils.math.sin.call(null, e)], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.subtract.call(null, qgame.utils.math.sin.call(null, 
    e)), qgame.utils.math.cos.call(null, e)], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null, "theta", "theta", -1530204073, null)], null), new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "utheta", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 
1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6066], null);
var dummy_matrix__4816__auto___6072 = function() {
  var a = cljs.core.repeat.call(null, 1), a = cljs.core.nth.call(null, a, 0, null);
  return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, qgame.utils.math.exp_xi.call(null, 
  a)], null)], null);
}(), num_qubits__4817__auto___6073 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6072));
qgame.simulator.qgates.cphase = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, 
[0, 0, 1, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, cljs.core.list(new cljs.core.Symbol("m", "exp-xi", "m/exp-xi", 1365225944, null), new cljs.core.Symbol(null, "alpha", "alpha", -1547621609, null))], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6073, b), f = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null), e = cljs.core.nth.call(null, e, 0, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null), 
    new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, qgame.utils.math.exp_xi.call(null, e)], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null, "alpha", "alpha", -1547621609, null)], null), new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "cphase", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 
1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6073], null);
var dummy_matrix__4816__auto___6079 = function() {
  var a = cljs.core.repeat.call(null, 1), b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nth.call(null, a, 1, null), d = cljs.core.nth.call(null, a, 2, null), a = cljs.core.nth.call(null, a, 3, null);
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.multiply.call(null, qgame.utils.math.cos.call(null, c), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, qgame.utils.math.subtract.call(null, b), qgame.utils.math.subtract.call(null, d), a))), qgame.utils.math.multiply.call(null, qgame.utils.math.sin.call(null, qgame.utils.math.subtract.call(null, 
  c)), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, qgame.utils.math.subtract.call(null, b), d, a)))], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.multiply.call(null, qgame.utils.math.sin.call(null, c), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, b, qgame.utils.math.subtract.call(null, d), a))), qgame.utils.math.multiply.call(null, qgame.utils.math.cos.call(null, c), qgame.utils.math.exp_xi.call(null, 
  qgame.utils.math.add.call(null, b, d, a)))], null)], null);
}(), num_qubits__4817__auto___6080 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6079));
qgame.simulator.qgates.u2 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", "cos", "m/cos", -1640425738, null), new cljs.core.Symbol(null, "theta", 
"theta", -1530204073, null)), cljs.core.list(new cljs.core.Symbol("m", "exp-xi", "m/exp-xi", 1365225944, null), cljs.core.list(new cljs.core.Symbol("m", "add", "m/add", -1640428072, null), cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), new cljs.core.Symbol(null, "phi", "phi", -1640420566, null)), cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), new cljs.core.Symbol(null, "psi", "psi", -1640420225, null)), new cljs.core.Symbol(null, 
"alpha", "alpha", -1547621609, null)))), cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", "sin", "m/sin", -1640410751, null), cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null))), cljs.core.list(new cljs.core.Symbol("m", "exp-xi", "m/exp-xi", 1365225944, null), cljs.core.list(new cljs.core.Symbol("m", "add", "m/add", -1640428072, 
null), cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), new cljs.core.Symbol(null, "phi", "phi", -1640420566, null)), new cljs.core.Symbol(null, "psi", "psi", -1640420225, null), new cljs.core.Symbol(null, "alpha", "alpha", -1547621609, null))))], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", 
"sin", "m/sin", -1640410751, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null)), cljs.core.list(new cljs.core.Symbol("m", "exp-xi", "m/exp-xi", 1365225944, null), cljs.core.list(new cljs.core.Symbol("m", "add", "m/add", -1640428072, null), new cljs.core.Symbol(null, "phi", "phi", -1640420566, null), cljs.core.list(new cljs.core.Symbol("m", "subtract", "m/subtract", 594194501, null), new cljs.core.Symbol(null, "psi", "psi", -1640420225, null)), new cljs.core.Symbol(null, "alpha", 
"alpha", -1547621609, null)))), cljs.core.list(new cljs.core.Symbol("m", "multiply", "m/multiply", -986694827, null), cljs.core.list(new cljs.core.Symbol("m", "cos", "m/cos", -1640425738, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null)), cljs.core.list(new cljs.core.Symbol("m", "exp-xi", "m/exp-xi", 1365225944, null), cljs.core.list(new cljs.core.Symbol("m", "add", "m/add", -1640428072, null), new cljs.core.Symbol(null, "phi", "phi", -1640420566, null), new cljs.core.Symbol(null, 
"psi", "psi", -1640420225, null), new cljs.core.Symbol(null, "alpha", "alpha", -1547621609, null))))], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6080, b), f = cljs.core.nth.call(null, e, 0, null), g = cljs.core.nth.call(null, e, 1, null), e = cljs.core.nth.call(null, g, 0, null), h = cljs.core.nth.call(null, g, 1, null), k = cljs.core.nth.call(null, g, 2, null), g = cljs.core.nth.call(null, g, 3, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.multiply.call(null, qgame.utils.math.cos.call(null, h), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, qgame.utils.math.subtract.call(null, e), qgame.utils.math.subtract.call(null, k), g))), 
    qgame.utils.math.multiply.call(null, qgame.utils.math.sin.call(null, qgame.utils.math.subtract.call(null, h)), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, qgame.utils.math.subtract.call(null, e), k, g)))], null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [qgame.utils.math.multiply.call(null, qgame.utils.math.sin.call(null, h), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, e, qgame.utils.math.subtract.call(null, 
    k), g))), qgame.utils.math.multiply.call(null, qgame.utils.math.cos.call(null, h), qgame.utils.math.exp_xi.call(null, qgame.utils.math.add.call(null, e, k, g)))], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null, "phi", "phi", -1640420566, null), new cljs.core.Symbol(null, "theta", "theta", -1530204073, null), new cljs.core.Symbol(null, "psi", "psi", -1640420225, null), new cljs.core.Symbol(null, "alpha", "alpha", -1547621609, null)], null), new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 
2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "u2", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6080], null);
var dummy_matrix__4816__auto___6085 = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, 
[0, 0, 0, 1], null)], null), num_qubits__4817__auto___6086 = qgame.utils.general.bit_size.call(null, cljs.core.count.call(null, dummy_matrix__4816__auto___6085));
qgame.simulator.qgates.swap = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null, "matrix-body", "matrix-body", 617047968), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, 
[0, 1, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, 1], null)], null), new cljs.core.Keyword(null, "caller", "caller", 3941096189), function() {
  var a = function(a, b) {
    var e = cljs.core.split_at.call(null, num_qubits__4817__auto___6086, b), f = cljs.core.nth.call(null, e, 0, null);
    cljs.core.nth.call(null, e, 1, null);
    return qgame.simulator.qgates.apply_operator.call(null, a, qgame.simulator.qgates.to_operator.call(null, new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [1, 0, 0, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 1, 0], null), new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 1, 0, 0], null), 
    new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [0, 0, 0, 1], null)], null)), f);
  }, b = function(b, d) {
    var e = null;
    1 < arguments.length && (e = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1), 0));
    return a.call(this, b, e);
  };
  b.cljs$lang$maxFixedArity = 1;
  b.cljs$lang$applyTo = function(b) {
    var d = cljs.core.first(b);
    b = cljs.core.rest(b);
    return a(d, b);
  };
  b.cljs$core$IFn$_invoke$arity$variadic = a;
  return b;
}(), new cljs.core.Keyword(null, "param-names", "param-names", 740923770), cljs.core.PersistentVector.EMPTY, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name", "name", 1017277949), "swap", new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "QGate", "QGate", 1090921518)], null), new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), num_qubits__4817__auto___6086], 
null);
qgame.simulator.shared = {};
qgame.simulator.shared.stage = cljs.core.atom.call(null, "Interpretation");
qgame.simulator.shared.current_qgame_fn = cljs.core.atom.call(null, null);
qgame.simulator.shared.canonical_functions = cljs.core.atom.call(null, cljs.core.PersistentHashMap.fromArrays("qnot nand utheta srn cnot swap with_oracle cphase else end hadamard u2 measure oracle".split(" "), [qgame.simulator.qgates.qnot, qgame.simulator.qgates.nand, qgame.simulator.qgates.utheta, qgame.simulator.qgates.srn, qgame.simulator.qgates.cnot, qgame.simulator.qgates.swap, qgame.simulator.qgates.with_oracle, qgame.simulator.qgates.cphase, qgame.simulator.flow.else$, qgame.simulator.flow.end, 
qgame.simulator.qgates.hadamard, qgame.simulator.qgates.u2, qgame.simulator.flow.measure, null]));
qgame.simulator.shared.on_error = cljs.core.atom.call(null, null);
qgame.simulator.parser = {};
qgame.simulator.parser.qubit_letter_to_index = function(a) {
  return "ABCDEFGHIJKLMNOPQRST".indexOf(a);
};
qgame.simulator.parser.match_only = function(a, b) {
  return cljs.core.re_find.call(null, qgame.utils.general.regex_join.call(null, "^", a, "$"), b);
};
qgame.simulator.parser.word_pattern = /\b[a-zA-Z_]\w*\b/;
qgame.simulator.parser.math_string_pattern = /(?:\w*[\-.+*\/^()]\w*)+/;
qgame.simulator.parser.parse_forget_rule = function(a, b) {
  var c = cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Rule", "Rule", 1016462990), new cljs.core.Keyword(null, "forget", "forget", 4040086879), !0, new cljs.core.Keyword(null, "name-target", "name-target", 4218974853), b), d = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.word_pattern, b);
  if (cljs.core.truth_(d)) {
    return c;
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Target is not a word", c);
};
qgame.simulator.parser.parse_name_rule = function(a, b, c) {
  var d = cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Rule", "Rule", 1016462990), new cljs.core.Keyword(null, "replace-name", "replace-name", 1428647286), b, new cljs.core.Keyword(null, "target", "target", 4427965699), c), e = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.word_pattern, b);
  if (cljs.core.truth_(e)) {
    return d;
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Name is not a word", d);
};
qgame.simulator.parser.parse_bite = function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "text", "text", 1017460895)), c = function(a) {
    return cljs.core._EQ_.call(null, cljs.core.count.call(null, a), 1);
  }.call(null, clojure.string.split.call(null, b, /:/, 2)) ? null : clojure.string.split.call(null, b, /:/, 2);
  return cljs.core.truth_(c) ? (b = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), cljs.core._EQ_.call(null, b, "forget") ? qgame.simulator.parser.parse_forget_rule.call(null, a, c) : qgame.simulator.parser.parse_name_rule.call(null, a, b, c)) : cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Token", "Token", 1094892875));
};
qgame.simulator.parser.replace_word = function(a, b, c) {
  b = qgame.utils.general.regex_join.call(null, "\\b", b, "\\b");
  return clojure.string.replace.call(null, a, b, c);
};
qgame.simulator.parser.replace_named = function(a, b) {
  return cljs.core.reduce_kv.call(null, qgame.simulator.parser.replace_word, b, a);
};
qgame.simulator.parser.safe_eval_math = function(a) {
  try {
    return qgame.utils.math.eval_math_string.call(null, a);
  } catch (b) {
    return null;
  }
};
qgame.simulator.parser.replace_math = function(a) {
  return clojure.string.replace.call(null, a, qgame.simulator.parser.math_string_pattern, qgame.simulator.parser.safe_eval_math);
};
qgame.simulator.parser.apply_rules = function(a, b) {
  var c = qgame.simulator.parser.replace_named.call(null, a, b), d = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.math_string_pattern, c);
  return cljs.core.truth_(d) ? qgame.simulator.parser.safe_eval_math.call(null, c) : c;
};
qgame.simulator.parser.parser_execute_token = function(a, b) {
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, function() {
    var c = qgame.simulator.parser.apply_rules.call(null, a, (new cljs.core.Keyword(null, "text", "text", 1017460895)).cljs$core$IFn$_invoke$arity$1(b));
    if (cljs.core.truth_(c)) {
      return cljs.core.assoc.call(null, b, new cljs.core.Keyword(null, "post-rules", "post-rules", 1543368956), c);
    }
    cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
    return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Math evaluation error", b);
  }()], null);
};
qgame.simulator.parser.parser_execute_rule = function(a, b) {
  if (cljs.core.truth_((new cljs.core.Keyword(null, "forget", "forget", 4040086879)).cljs$core$IFn$_invoke$arity$1(b))) {
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.dissoc.call(null, a, (new cljs.core.Keyword(null, "name-target", "name-target", 4218974853)).cljs$core$IFn$_invoke$arity$1(b)), b], null);
  }
  var c = qgame.simulator.parser.apply_rules.call(null, a, (new cljs.core.Keyword(null, "target", "target", 4427965699)).cljs$core$IFn$_invoke$arity$1(b));
  if (cljs.core.truth_(c)) {
    var c = cljs.core.assoc.call(null, b, new cljs.core.Keyword(null, "target", "target", 4427965699), c), d = cljs.core.juxt.call(null, new cljs.core.Keyword(null, "replace-name", "replace-name", 1428647286), new cljs.core.Keyword(null, "target", "target", 4427965699)).call(null, c);
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.call(null, a, d), c], null);
  }
  return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, function() {
    cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
    return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Math evaluation on name target error", b);
  }()], null);
};
qgame.simulator.parser.execute_parser_rules = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "new-bites", "new-bites", 3608376192)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "name-map", "name-map", 2853325452)), e = qgame.simulator.parser.parse_bite.call(null, b), e = cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "Token", "Token", 1094892875), (new cljs.core.Keyword(null, "type", "type", 1017479852)).cljs$core$IFn$_invoke$arity$1(e)) ? 
  qgame.simulator.parser.parser_execute_token.call(null, c, e) : qgame.simulator.parser.parser_execute_rule.call(null, c, e), c = cljs.core.nth.call(null, e, 0, null), e = cljs.core.nth.call(null, e, 1, null);
  return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name-map", "name-map", 2853325452), c, new cljs.core.Keyword(null, "new-bites", "new-bites", 3608376192), cljs.core.conj.call(null, d, e)], null);
};
qgame.simulator.parser.qubit_pattern = /\b(?:[A-T]|1?[0-9])\b/;
qgame.simulator.parser.parse_qubit = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "post-rules", "post-rules", 1543368956)), d = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.qubit_pattern, c);
  if (cljs.core.truth_(d)) {
    return c = cljs.core.truth_(isNaN(parseInt(c))) ? qgame.simulator.parser.qubit_letter_to_index.call(null, d) : parseInt(c), cljs.core.assoc.call(null, b, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Qubit", "Qubit", 1092292539), new cljs.core.Keyword(null, "value", "value", 1125876963), c);
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Qubit parse failure", b);
};
qgame.simulator.parser.param_pattern = /\b\d+\.?\d*\b/;
qgame.simulator.parser.parse_param = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "post-rules", "post-rules", 1543368956)), c = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.param_pattern, c);
  if (cljs.core.truth_(c)) {
    return cljs.core.assoc.call(null, b, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Param", "Param", 1090788319), new cljs.core.Keyword(null, "value", "value", 1125876963), parseFloat(c));
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Param parse failure", b);
};
qgame.simulator.parser.bit_pattern = /\b[01]\b/;
qgame.simulator.parser.parse_bit = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "post-rules", "post-rules", 1543368956)), c = qgame.simulator.parser.match_only.call(null, qgame.simulator.parser.bit_pattern, c);
  if (cljs.core.truth_(c)) {
    return cljs.core.assoc.call(null, b, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Bit", "Bit", 1013971039), new cljs.core.Keyword(null, "value", "value", 1125876963), cljs.core.get.call(null, new cljs.core.PersistentArrayMap(null, 2, ["0", 0, "1", 1], null), c));
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Bit parse failure", b);
};
qgame.simulator.parser.taste = function(a, b) {
  var c = function(a) {
    return cljs.core.not_EQ_.call(null, new cljs.core.Keyword(null, "Token", "Token", 1094892875), (new cljs.core.Keyword(null, "type", "type", 1017479852)).cljs$core$IFn$_invoke$arity$1(a));
  }.call(null, b) ? null : b;
  if (cljs.core.truth_(c)) {
    return a.call(null, c);
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Unrecognized argument", b);
};
qgame.simulator.parser.swallow = function() {
  var a = null, b = function(a, b) {
    var c = cljs.core.reduce.call(null, function(b, c) {
      var e = cljs.core.truth_((new cljs.core.Keyword(null, "error", "error", 1110689146)).cljs$core$IFn$_invoke$arity$1(qgame.simulator.parser.taste.call(null, a, c))) ? null : qgame.simulator.parser.taste.call(null, a, c);
      return cljs.core.truth_(e) ? cljs.core.conj.call(null, b, e) : cljs.core.reduced.call(null, b);
    }, cljs.core.PersistentVector.EMPTY, b);
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c, cljs.core.drop.call(null, cljs.core.count.call(null, c), b)], null);
  }, c = function(a, b, c) {
    return 0 === a ? new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.List.EMPTY, c], null) : a <= cljs.core.count.call(null, c) ? (c = cljs.core.split_at.call(null, a, c), a = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.map.call(null, cljs.core.partial.call(null, qgame.simulator.parser.taste, b), a), c], null)) : null;
  }, a = function(a, e, f) {
    switch(arguments.length) {
      case 2:
        return b.call(this, a, e);
      case 3:
        return c.call(this, a, e, f);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$2 = b;
  a.cljs$core$IFn$_invoke$arity$3 = c;
  return a;
}();
qgame.simulator.parser.package_parse_time = function(a, b) {
  if (cljs.core._EQ_.call(null, cljs.core.get_in.call(null, a, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.Keyword(null, "name", "name", 1017277949)], null)), "with_oracle")) {
    var c = qgame.simulator.parser.swallow.call(null, qgame.simulator.parser.parse_bit, b), d = cljs.core.nth.call(null, c, 0, null), c = cljs.core.nth.call(null, c, 1, null), d = cljs.core.apply.call(null, (new cljs.core.Keyword(null, "caller", "caller", 3941096189)).cljs$core$IFn$_invoke$arity$1(a), cljs.core.map.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), d));
    cljs.core.swap_BANG_.call(null, qgame.simulator.shared.canonical_functions, cljs.core.assoc, "oracle", d);
    return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [null, c], null);
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Uncrecognized parse time function", a);
};
qgame.simulator.parser.package_expression = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "param-names", "param-names", 740923770)), e = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835));
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "ParseTime", "ParseTime", 1184785266), cljs.core.get_in.call(null, c, new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516), new cljs.core.Keyword(null, "type", "type", 1017479852)], null)))) {
    return qgame.simulator.parser.package_parse_time.call(null, c, b);
  }
  var f = qgame.simulator.parser.swallow.call(null, e, qgame.simulator.parser.parse_qubit, b);
  if (cljs.core.truth_(f)) {
    e = cljs.core.nth.call(null, f, 0, null);
    f = cljs.core.nth.call(null, f, 1, null);
    f = qgame.simulator.parser.swallow.call(null, cljs.core.count.call(null, d), qgame.simulator.parser.parse_param, f);
    if (cljs.core.truth_(f)) {
      return d = cljs.core.nth.call(null, f, 0, null), f = cljs.core.nth.call(null, f, 1, null), c = cljs.core.assoc.call(null, c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Expression", "Expression", 1211916842), new cljs.core.Keyword(null, "qubits", "qubits", 4360074396), e, new cljs.core.Keyword(null, "params", "params", 4313443576), d), new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c, f], null);
    }
    cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
    return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Too few parameters", cljs.core.assoc.call(null, c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Expression", "Expression", 1211916842), new cljs.core.Keyword(null, "swallowed", "swallowed", 3934694966), b));
  }
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
  return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Too few parameters", cljs.core.assoc.call(null, c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Expression", "Expression", 1211916842), new cljs.core.Keyword(null, "swallowed", "swallowed", 3934694966), b));
};
qgame.simulator.parser.parse_expressions = function() {
  var a = null, b = function(b) {
    return a.call(null, cljs.core.PersistentVector.EMPTY, b);
  }, c = function(a, b) {
    for (;;) {
      var c = b, g = cljs.core.nth.call(null, c, 0, null), h = cljs.core.nthnext.call(null, c, 1);
      if (cljs.core.empty_QMARK_.call(null, c)) {
        return a;
      }
      var k = function() {
        var c = function(a, b) {
          return function(a) {
            return cljs.core.not_EQ_.call(null, new cljs.core.Keyword(null, "Token", "Token", 1094892875), (new cljs.core.Keyword(null, "type", "type", 1017479852)).cljs$core$IFn$_invoke$arity$1(a));
          };
        }(a, b).call(null, g) ? null : g;
        if (cljs.core.truth_(c)) {
          var f = cljs.core.get.call(null, cljs.core.deref.call(null, qgame.simulator.shared.canonical_functions), (new cljs.core.Keyword(null, "post-rules", "post-rules", 1543368956)).cljs$core$IFn$_invoke$arity$1(c));
          if (cljs.core.truth_(f)) {
            var f = cljs.core.merge.call(null, c, f), k = qgame.simulator.parser.package_expression.call(null, f, h), f = cljs.core.nth.call(null, k, 0, null), k = cljs.core.nth.call(null, k, 1, null);
            return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.call(null, a, f), k], null);
          }
          return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.conj.call(null, a, function() {
            cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
            return qgame.simulator.error.log_and_return_error_BANG_.call(null, "Lonely", c);
          }()), h], null);
        }
        return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [a, h], null);
      }(), c = cljs.core.nth.call(null, k, 0, null), k = cljs.core.nth.call(null, k, 1, null);
      a = c;
      b = k;
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
qgame.simulator.parser.wrap_up = function(a) {
  return cljs.core.remove.call(null, qgame.utils.general.errant_QMARK_, a);
};
qgame.simulator.parser.parse = function(a) {
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.stage, "Parsing");
  return qgame.simulator.parser.wrap_up.call(null, qgame.simulator.parser.parse_expressions.call(null, (new cljs.core.Keyword(null, "new-bites", "new-bites", 3608376192)).cljs$core$IFn$_invoke$arity$1(cljs.core.reduce.call(null, qgame.simulator.parser.execute_parser_rules, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "name-map", "name-map", 2853325452), cljs.core.PersistentArrayMap.EMPTY, new cljs.core.Keyword(null, "new-bites", "new-bites", 3608376192), cljs.core.PersistentVector.EMPTY], 
  null), a))));
};
qgame.simulator.reader = {};
qgame.simulator.reader.split_into_lines = function(a) {
  return cljs.core.keep_indexed.call(null, function(a, c) {
    return cljs.core.truth_(clojure.string.blank_QMARK_.call(null, c)) ? null : new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "line-number", "line-number", 4279856820), a, new cljs.core.Keyword(null, "line", "line", 1017226086), c], null);
  }, clojure.string.split_lines.call(null, a));
};
qgame.simulator.reader.comment_pattern = /\#.*/;
qgame.simulator.reader.whitespace_equivalent_pattern = /[^\-\w\.\:\+\*\\/\^\(\)]+/;
qgame.simulator.reader.ignore_pattern = qgame.utils.general.regex_join.call(null, "(?:", qgame.simulator.reader.comment_pattern, "|", qgame.simulator.reader.whitespace_equivalent_pattern, ")");
qgame.simulator.reader.chew = function() {
  var a = null, b = function(b) {
    return a.call(null, b, cljs.core.PersistentVector.EMPTY);
  }, c = function(a, b) {
    for (var c = clojure.string.replace_first.call(null, a, qgame.utils.general.regex_join.call(null, "^", qgame.simulator.reader.whitespace_equivalent_pattern), ""), g = b;;) {
      if (cljs.core.truth_(clojure.string.blank_QMARK_.call(null, c))) {
        return g;
      }
      var h = cljs.core.count.call(null, a) - cljs.core.count.call(null, c), k = clojure.string.split.call(null, c, qgame.simulator.reader.ignore_pattern, 2), c = cljs.core.nth.call(null, k, 0, null), k = cljs.core.nth.call(null, k, 1, null), h = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "text", "text", 1017460895), c, new cljs.core.Keyword(null, "character-position", "character-position", 2475872959), h], null), c = "" + cljs.core.str(k), g = cljs.core.conj.call(null, 
      g, h);
    }
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
qgame.simulator.reader.split_into_bites = function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "line-number", "line-number", 4279856820));
  a = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "line", "line", 1017226086));
  a = qgame.simulator.reader.chew.call(null, a);
  return cljs.core.map.call(null, function(a) {
    return cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "line-number", "line-number", 4279856820), b);
  }, a);
};
qgame.simulator.reader.read = function(a) {
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.stage, "Reading");
  return cljs.core.mapcat.call(null, qgame.simulator.reader.split_into_bites, qgame.simulator.reader.split_into_lines.call(null, a));
};
qgame.simulator.compiler = {};
qgame.simulator.compiler.revise_on_end = function(a) {
  var b = cljs.core.nth.call(null, a, 0, null), c = cljs.core.nthnext.call(null, a, 1);
  if (cljs.core.empty_QMARK_.call(null, a)) {
    return cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name), qgame.simulator.error.log_and_return_warning_BANG_.call(null, "Extra end", a);
  }
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "else-clause", "else-clause", 2613165045), b)) {
    return c;
  }
  if (cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "then-clause", "then-clause", 4549702289), b)) {
    return cljs.core.cons.call(null, new cljs.core.Keyword(null, "else-clause", "else-clause", 2613165045), c);
  }
  if (new cljs.core.Keyword(null, "else", "else", 1017020587)) {
    throw Error([cljs.core.str("No matching clause: "), cljs.core.str(b)].join(""));
  }
  return null;
};
qgame.simulator.compiler.revise = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516)), c = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "name", "name", 1017277949));
  return cljs.core._EQ_.call(null, "end", c) ? qgame.simulator.compiler.revise_on_end.call(null, a) : cljs.core._EQ_.call(null, "else", c) ? cljs.core.cons.call(null, new cljs.core.Keyword(null, "else-clause", "else-clause", 2613165045), cljs.core.rest.call(null, a)) : cljs.core._EQ_.call(null, "measure", c) ? cljs.core.cons.call(null, new cljs.core.Keyword(null, "then-clause", "then-clause", 4549702289), a) : new cljs.core.Keyword(null, "else", "else", 1017020587) ? a : null;
};
qgame.simulator.compiler.curry_caller = function(a) {
  a = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  var b = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "caller", "caller", 3941096189)), c = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "params", "params", 4313443576)), d = cljs.core.get.call(null, a, new cljs.core.Keyword(null, "qubits", "qubits", 4360074396)), c = function(a) {
    return function(c) {
      return cljs.core.apply.call(null, b, c, a);
    };
  }(cljs.core.concat.call(null, cljs.core.map.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), d), cljs.core.map.call(null, new cljs.core.Keyword(null, "value", "value", 1125876963), c)));
  return cljs.core.assoc.call(null, a, new cljs.core.Keyword(null, "curried", "curried", 2140847816), c);
};
qgame.simulator.compiler.compile_expression = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, d = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516)), d = cljs.core.seq_QMARK_.call(null, d) ? cljs.core.apply.call(null, cljs.core.hash_map, d) : d, d = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "name", "name", 1017277949)), e = cljs.core.nth.call(null, b, 0, null);
  return qgame.simulator.compiler.curry_caller.call(null, cljs.core.assoc.call(null, cljs.core._EQ_.call(null, "end", d) && cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "then-clause", "then-clause", 4549702289), e) ? cljs.core.merge.call(null, c, cljs.core.deref.call(null, qgame.simulator.shared.canonical_functions).call(null, "else")) : c, new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "Instruction", "Instruction", 2983299040)));
};
qgame.simulator.compiler.wrap_up = function(a, b, c) {
  for (var d = cljs.core.seq.call(null, a), e = null, f = 0, g = 0;;) {
    if (g < f) {
      var h = cljs.core._nth.call(null, e, g);
      cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name);
      qgame.simulator.error.log_and_return_warning_BANG_.call(null, "Lingering status", h);
      g += 1;
    } else {
      if (d = cljs.core.seq.call(null, d)) {
        e = d, cljs.core.chunked_seq_QMARK_.call(null, e) ? (d = cljs.core.chunk_first.call(null, e), g = cljs.core.chunk_rest.call(null, e), e = d, f = cljs.core.count.call(null, d), d = g) : (d = cljs.core.first.call(null, e), cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name), qgame.simulator.error.log_and_return_warning_BANG_.call(null, "Lingering status", d), d = cljs.core.next.call(null, e), e = null, f = 0), g = 0;
      } else {
        break;
      }
    }
  }
  return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null, "type", "type", 1017479852), new cljs.core.Keyword(null, "ExecutionSpecs", "ExecutionSpecs", 2825253746), new cljs.core.Keyword(null, "program", "program", 704516598), b, new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835), c], null);
};
qgame.simulator.compiler.compile = function(a) {
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.stage, "Compilation");
  var b = cljs.core.List.EMPTY, c = cljs.core.PersistentVector.EMPTY;
  cljs.core.nth.call(null, a, 0, null);
  cljs.core.nthnext.call(null, a, 1);
  for (var d = 0;;) {
    var e = a, f = cljs.core.nth.call(null, e, 0, null);
    a = cljs.core.nthnext.call(null, e, 1);
    if (cljs.core.empty_QMARK_.call(null, e)) {
      return qgame.simulator.compiler.wrap_up.call(null, b, c, d);
    }
    e = qgame.simulator.compiler.revise.call(null, b, f);
    d = cljs.core.apply.call(null, cljs.core.max, d, cljs.core.map.call(null, cljs.core.comp.call(null, cljs.core.inc, new cljs.core.Keyword(null, "value", "value", 1125876963)), (new cljs.core.Keyword(null, "qubits", "qubits", 4360074396)).cljs$core$IFn$_invoke$arity$1(f)));
    c = cljs.core.conj.call(null, c, qgame.simulator.compiler.compile_expression.call(null, f, b));
    b = e;
  }
};
qgame.simulator.executor = {};
qgame.simulator.executor.new_quantum_system = function(a) {
  a = 1 << a;
  return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714), cljs.core.into.call(null, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [1], null), cljs.core.repeat.call(null, a - 1, 0)), new cljs.core.Keyword(null, "prior-probability", "prior-probability", 4421087524), 1, new cljs.core.Keyword(null, "oracle-count", "oracle-count", 3403530098), 0, new cljs.core.Keyword(null, "measurement-history", "measurement-history", 
  2775390965), cljs.core.List.EMPTY], null);
};
qgame.simulator.executor.to_qsys_updater = function(a) {
  return function(b) {
    return cljs.core.update_in.call(null, b, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "amplitudes", "amplitudes", 1792075714)], null), a);
  };
};
qgame.simulator.executor.on_head_branch = function(a, b) {
  var c = cljs.core.nth.call(null, b, 0, null), d = cljs.core.nthnext.call(null, b, 1);
  return cljs.core.cons.call(null, cljs.core.map.call(null, a, c), d);
};
qgame.simulator.executor.execute_qgate = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "curried", "curried", 2140847816));
  return qgame.simulator.executor.on_head_branch.call(null, qgame.simulator.executor.to_qsys_updater.call(null, c), a);
};
qgame.simulator.executor.execute_oracle = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b, c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "curried", "curried", 2140847816)), c = cljs.core.comp.call(null, qgame.simulator.executor.to_qsys_updater.call(null, c), function(a) {
    return cljs.core.update_in.call(null, a, new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null, "oracle-count", "oracle-count", 3403530098)], null), cljs.core.inc);
  });
  return qgame.simulator.executor.on_head_branch.call(null, c, a);
};
qgame.simulator.executor.execute_flow_control = function(a, b) {
  var c = cljs.core.seq_QMARK_.call(null, b) ? cljs.core.apply.call(null, cljs.core.hash_map, b) : b;
  return cljs.core.get.call(null, c, new cljs.core.Keyword(null, "curried", "curried", 2140847816)).call(null, a);
};
qgame.simulator.executor.execute_instruction = function(a, b, c) {
  var d = cljs.core.seq_QMARK_.call(null, c) ? cljs.core.apply.call(null, cljs.core.hash_map, c) : c, e = cljs.core.get.call(null, d, new cljs.core.Keyword(null, "fn-meta", "fn-meta", 4539079516)), e = cljs.core.seq_QMARK_.call(null, e) ? cljs.core.apply.call(null, cljs.core.hash_map, e) : e;
  cljs.core.get.call(null, e, new cljs.core.Keyword(null, "name", "name", 1017277949));
  e = cljs.core.get.call(null, e, new cljs.core.Keyword(null, "type", "type", 1017479852));
  cljs.core.truth_(a) && a.call(null, b, d);
  return cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "FlowControl", "FlowControl", 825984929), e) ? qgame.simulator.executor.execute_flow_control.call(null, b, d) : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "Oracle", "Oracle", 3383876880), e) ? qgame.simulator.executor.execute_oracle.call(null, b, d) : cljs.core._EQ_.call(null, new cljs.core.Keyword(null, "QGate", "QGate", 1090921518), e) ? qgame.simulator.executor.execute_qgate.call(null, b, d) : new cljs.core.Keyword(null, 
  "else", "else", 1017020587) ? (cljs.core.reset_BANG_.call(null, qgame.simulator.shared.current_qgame_fn, arguments.callee.name), qgame.simulator.error.log_and_return_error_BANG_.call(null, "Unrecognized function type", d), b) : null;
};
qgame.simulator.executor.execute = function(a) {
  var b = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a;
  a = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "renderer", "renderer", 519058485));
  var c = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "num-qubits", "num-qubits", 1175408835)), b = cljs.core.get.call(null, b, new cljs.core.Keyword(null, "program", "program", 704516598));
  cljs.core.reset_BANG_.call(null, qgame.simulator.shared.stage, "Execution");
  c = qgame.simulator.executor.new_quantum_system.call(null, c);
  a = cljs.core.reduce.call(null, cljs.core.partial.call(null, qgame.simulator.executor.execute_instruction, a), cljs.core._conj.call(null, cljs.core.List.EMPTY, cljs.core._conj.call(null, cljs.core.List.EMPTY, c)), b);
  return cljs.core.apply.call(null, cljs.core.concat, a);
};
qgame.simulator.interpreter = {};
qgame.simulator.interpreter.interpret = function() {
  var a = null, b = function(a) {
    a = qgame.simulator.compiler.compile.call(null, qgame.simulator.parser.parse.call(null, qgame.simulator.reader.read.call(null, a)));
    return qgame.simulator.executor.execute.call(null, a);
  }, c = function(a, b) {
    var c = cljs.core.seq_QMARK_.call(null, a) ? cljs.core.apply.call(null, cljs.core.hash_map, a) : a, g = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "on-err", "on-err", 4294768617)), h = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "in-exec", "in-exec", 2906402731)), c = cljs.core.get.call(null, c, new cljs.core.Keyword(null, "pre-exec", "pre-exec", 3967568109));
    cljs.core.reset_BANG_.call(null, qgame.simulator.shared.on_error, g);
    g = qgame.simulator.compiler.compile.call(null, qgame.simulator.parser.parse.call(null, qgame.simulator.reader.read.call(null, b)));
    cljs.core.truth_(c) && c.call(null, g);
    return qgame.simulator.executor.execute.call(null, cljs.core.assoc.call(null, g, new cljs.core.Keyword(null, "renderer", "renderer", 519058485), h));
  }, a = function(a, e) {
    switch(arguments.length) {
      case 1:
        return b.call(this, a);
      case 2:
        return c.call(this, a, e);
    }
    throw Error("Invalid arity: " + arguments.length);
  };
  a.cljs$core$IFn$_invoke$arity$1 = b;
  a.cljs$core$IFn$_invoke$arity$2 = c;
  return a;
}();
var qromp = {evaluate:function(a, b, c) {
  b = cljs.core.first.call(null, qgame.simulator.interpreter.interpret.call(null, b));
  var d = cljs.core.map.call(null, function(a) {
    return function(b) {
      return qgame.utils.amplitudes.probability_of.call(null, a, b, 0);
    };
  }(b), cljs.core.range.call(null, a)), e = cljs.core.map.call(null, function(a, b) {
    return function(b) {
      return qgame.utils.amplitudes.phase_of.call(null, a, b, 0);
    };
  }(b, d), cljs.core.range.call(null, a));
  a = cljs.core.map.call(null, function(a, b, c) {
    return function(b) {
      return qgame.utils.amplitudes.phase_of.call(null, a, b, 1);
    };
  }(b, d, e), cljs.core.range.call(null, a));
  a = cljs.core.map.call(null, function(a, b, c, d) {
    return function(a, b, c) {
      return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "up", "up", 1013907981), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "prob", "prob", 1017353927), a, new cljs.core.Keyword(null, "phase", "phase", 1120533741), b], null), new cljs.core.Keyword(null, "down", "down", 1016993812), new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null, "prob", "prob", 1017353927), 1 - a, new cljs.core.Keyword(null, "phase", "phase", 1120533741), 
      c], null)], null);
    };
  }(b, d, e, a), d, e, a);
  return c.call(null, cljs.core.clj__GT_js.call(null, a));
}};
window.evaluate = qromp.evaluate;

});