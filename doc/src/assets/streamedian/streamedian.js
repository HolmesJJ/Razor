(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  var slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  // ERROR=0, WARN=1, LOG=2, DEBUG=3
  var LogLevel = {
      Error: 0,
      Warn: 1,
      Log: 2,
      Debug: 3
  };

  var DEFAULT_LOG_LEVEL = LogLevel.Error;

  function setDefaultLogLevel(level) {
      DEFAULT_LOG_LEVEL = level;
  }
  var Logger = function () {
      function Logger() {
          var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_LOG_LEVEL;
          var tag = arguments[1];
          classCallCheck(this, Logger);

          this.tag = tag;
          this.setLevel(level);
      }

      createClass(Logger, [{
          key: 'setLevel',
          value: function setLevel(level) {
              this.level = level;
          }
      }, {
          key: '_log',
          value: function _log(lvl, args) {
              args = Array.prototype.slice.call(args);
              if (this.tag) {
                  args.unshift('[' + this.tag + ']');
              }
              if (this.level >= lvl) console[Logger.level_map[lvl]].apply(console, args);
          }
      }, {
          key: 'log',
          value: function log() {
              this._log(LogLevel.Log, arguments);
          }
      }, {
          key: 'debug',
          value: function debug() {
              this._log(LogLevel.Debug, arguments);
          }
      }, {
          key: 'error',
          value: function error() {
              this._log(LogLevel.Error, arguments);
          }
      }, {
          key: 'warn',
          value: function warn() {
              this._log(LogLevel.Warn, arguments);
          }
      }], [{
          key: 'level_map',
          get: function get() {
              var _ref;

              return _ref = {}, defineProperty(_ref, LogLevel.Debug, 'log'), defineProperty(_ref, LogLevel.Log, 'log'), defineProperty(_ref, LogLevel.Warn, 'warn'), defineProperty(_ref, LogLevel.Error, 'error'), _ref;
          }
      }]);
      return Logger;
  }();

  var taggedLoggers = new Map();
  function getTagged(tag) {
      if (!taggedLoggers.has(tag)) {
          taggedLoggers.set(tag, new Logger(DEFAULT_LOG_LEVEL, tag));
      }
      return taggedLoggers.get(tag);
  }
  var Log = new Logger();

  function __async(g) {
    return new Promise(function (s, j) {
      function c(a, x) {
        try {
          var r = g[x ? "throw" : "next"](a);
        } catch (e) {
          j(e);return;
        }r.done ? s(r.value) : Promise.resolve(r.value).then(c, d);
      }function d(e) {
        c(e, 1);
      }c();
    });
  }

  var Url = function () {
      function Url() {
          classCallCheck(this, Url);
      }

      createClass(Url, null, [{
          key: 'parse',
          value: function parse(url) {
              var ret = {};

              var regex = /^([^:]+):\/\/([^\/]+)(.*)$/; //protocol, login, urlpath
              var result = regex.exec(url);

              if (!result) {
                  throw new Error("bad url");
              }

              ret.full = url;
              ret.protocol = result[1];
              ret.urlpath = result[3];

              var parts = ret.urlpath.split('/');
              ret.basename = parts.pop().split(/\?|#/)[0];
              ret.basepath = parts.join('/');

              var loginSplit = result[2].split('@');
              var hostport = loginSplit[0].split(':');
              var userpass = [null, null];
              if (loginSplit.length === 2) {
                  userpass = loginSplit[0].split(':');
                  hostport = loginSplit[1].split(':');
              }

              ret.user = userpass[0];
              ret.pass = userpass[1];
              ret.host = hostport[0];
              ret.auth = ret.user && ret.pass ? ret.user + ':' + ret.pass : '';

              ret.port = null == hostport[1] ? Url.protocolDefaultPort(ret.protocol) : hostport[1];
              ret.portDefined = null != hostport[1];
              ret.location = ret.host + ':' + ret.port;

              if (ret.protocol == 'unix') {
                  ret.socket = ret.port;
                  ret.port = undefined;
              }

              return ret;
          }
      }, {
          key: 'full',
          value: function full(parsed) {
              return parsed.protocol + '://' + parsed.location + '/' + parsed.urlpath;
          }
      }, {
          key: 'isAbsolute',
          value: function isAbsolute(url) {
              return (/^[^:]+:\/\//.test(url)
              );
          }
      }, {
          key: 'protocolDefaultPort',
          value: function protocolDefaultPort(protocol) {
              switch (protocol) {
                  case 'rtsp':
                      return 554;
                  case 'http':
                      return 80;
                  case 'https':
                      return 443;
              }

              return 0;
          }
      }]);
      return Url;
  }();

  var listener = Symbol("event_listener");
  var listeners = Symbol("event_listeners");

  var DestructibleEventListener = function () {
      function DestructibleEventListener(eventListener) {
          classCallCheck(this, DestructibleEventListener);

          this[listener] = eventListener;
          this[listeners] = new Map();
      }

      createClass(DestructibleEventListener, [{
          key: "clear",
          value: function clear() {
              if (this[listeners]) {
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                      for (var _iterator = this[listeners][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var entry = _step.value;
                          var _iteratorNormalCompletion2 = true;
                          var _didIteratorError2 = false;
                          var _iteratorError2 = undefined;

                          try {
                              for (var _iterator2 = entry[1][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                  var fn = _step2.value;

                                  this[listener].removeEventListener(entry[0], fn);
                              }
                          } catch (err) {
                              _didIteratorError2 = true;
                              _iteratorError2 = err;
                          } finally {
                              try {
                                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                      _iterator2.return();
                                  }
                              } finally {
                                  if (_didIteratorError2) {
                                      throw _iteratorError2;
                                  }
                              }
                          }
                      }
                  } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                          }
                      } finally {
                          if (_didIteratorError) {
                              throw _iteratorError;
                          }
                      }
                  }
              }
              this[listeners].clear();
          }
      }, {
          key: "destroy",
          value: function destroy() {
              this.clear();
              this[listeners] = null;
          }
      }, {
          key: "on",
          value: function on(event, selector, fn) {
              if (fn == undefined) {
                  fn = selector;
                  selector = null;
              }
              if (selector) {
                  return this.addEventListener(event, function (e) {
                      if (e.target.matches(selector)) {
                          fn(e);
                      }
                  });
              } else {
                  return this.addEventListener(event, fn);
              }
          }
      }, {
          key: "addEventListener",
          value: function addEventListener(event, fn) {
              if (!this[listeners].has(event)) {
                  this[listeners].set(event, new Set());
              }
              this[listeners].get(event).add(fn);
              this[listener].addEventListener(event, fn, false);
              return fn;
          }
      }, {
          key: "removeEventListener",
          value: function removeEventListener(event, fn) {
              this[listener].removeEventListener(event, fn, false);
              if (this[listeners].has(event)) {
                  //this[listeners].set(event, new Set());
                  var ev = this[listeners].get(event);
                  ev.delete(fn);
                  if (!ev.size) {
                      this[listeners].delete(event);
                  }
              }
          }
      }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event) {
              if (this[listener]) {
                  this[listener].dispatchEvent(event);
              }
          }
      }]);
      return DestructibleEventListener;
  }();

  var EventEmitter = function () {
      function EventEmitter() {
          var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
          classCallCheck(this, EventEmitter);

          this[listener] = new DestructibleEventListener(element || document.createElement('div'));
      }

      createClass(EventEmitter, [{
          key: "clear",
          value: function clear() {
              if (this[listener]) {
                  this[listener].clear();
              }
          }
      }, {
          key: "destroy",
          value: function destroy() {
              if (this[listener]) {
                  this[listener].destroy();
                  this[listener] = null;
              }
          }
      }, {
          key: "on",
          value: function on(event, selector, fn) {
              if (this[listener]) {
                  return this[listener].on(event, selector, fn);
              }
              return null;
          }
      }, {
          key: "addEventListener",
          value: function addEventListener(event, fn) {
              if (this[listener]) {
                  return this[listener].addEventListener(event, fn, false);
              }
              return null;
          }
      }, {
          key: "removeEventListener",
          value: function removeEventListener(event, fn) {
              if (this[listener]) {
                  this[listener].removeEventListener(event, fn, false);
              }
          }
      }, {
          key: "dispatchEvent",
          value: function dispatchEvent(event, data) {
              if (this[listener]) {
                  this[listener].dispatchEvent(new CustomEvent(event, { detail: data }));
              }
          }
      }]);
      return EventEmitter;
  }();

  var EventSourceWrapper = function () {
      function EventSourceWrapper(eventSource) {
          classCallCheck(this, EventSourceWrapper);

          this.eventSource = eventSource;
          this[listeners] = new Map();
      }

      createClass(EventSourceWrapper, [{
          key: "on",
          value: function on(event, selector, fn) {
              if (!this[listeners].has(event)) {
                  this[listeners].set(event, new Set());
              }
              var listener = this.eventSource.on(event, selector, fn);
              if (listener) {
                  this[listeners].get(event).add(listener);
              }
          }
      }, {
          key: "off",
          value: function off(event, fn) {
              this.eventSource.removeEventListener(event, fn);
          }
      }, {
          key: "clear",
          value: function clear() {
              this.eventSource.clear();
              this[listeners].clear();
          }
      }, {
          key: "destroy",
          value: function destroy() {
              this.eventSource.clear();
              this[listeners] = null;
              this.eventSource = null;
          }
      }]);
      return EventSourceWrapper;
  }();

  function CircularBuffer(capacity) {
  	if (!(this instanceof CircularBuffer)) return new CircularBuffer(capacity);
  	if ((typeof capacity === "undefined" ? "undefined" : _typeof(capacity)) == "object" && Array.isArray(capacity["_buffer"]) && typeof capacity._capacity == "number" && typeof capacity._first == "number" && typeof capacity._size == "number") {
  		for (var prop in capacity) {
  			if (capacity.hasOwnProperty(prop)) this[prop] = capacity[prop];
  		}
  	} else {
  		if (typeof capacity != "number" || capacity % 1 != 0 || capacity < 1) throw new TypeError("Invalid capacity");
  		this._buffer = new Array(capacity);
  		this._capacity = capacity;
  		this._first = 0;
  		this._size = 0;
  	}
  }

  CircularBuffer.prototype = {
  	size: function size() {
  		return this._size;
  	},
  	capacity: function capacity() {
  		return this._capacity;
  	},
  	enq: function enq(value) {
  		if (this._first > 0) this._first--;else this._first = this._capacity - 1;
  		this._buffer[this._first] = value;
  		if (this._size < this._capacity) this._size++;
  	},
  	push: function push(value) {
  		if (this._size == this._capacity) {
  			this._buffer[this._first] = value;
  			this._first = (this._first + 1) % this._capacity;
  		} else {
  			this._buffer[(this._first + this._size) % this._capacity] = value;
  			this._size++;
  		}
  	},
  	deq: function deq() {
  		if (this._size == 0) throw new RangeError("dequeue on empty buffer");
  		var value = this._buffer[(this._first + this._size - 1) % this._capacity];
  		this._size--;
  		return value;
  	},
  	pop: function pop() {
  		return this.deq();
  	},
  	shift: function shift() {
  		if (this._size == 0) throw new RangeError("shift on empty buffer");
  		var value = this._buffer[this._first];
  		if (this._first == this._capacity - 1) this._first = 0;else this._first++;
  		this._size--;
  		return value;
  	},
  	get: function get(start, end) {
  		if (this._size == 0 && start == 0 && (end == undefined || end == 0)) return [];
  		if (typeof start != "number" || start % 1 != 0 || start < 0) throw new TypeError("Invalid start");
  		if (start >= this._size) throw new RangeError("Index past end of buffer: " + start);

  		if (end == undefined) return this._buffer[(this._first + start) % this._capacity];

  		if (typeof end != "number" || end % 1 != 0 || end < 0) throw new TypeError("Invalid end");
  		if (end >= this._size) throw new RangeError("Index past end of buffer: " + end);

  		if (this._first + start >= this._capacity) {
  			//make sure first+start and first+end are in a normal range
  			start -= this._capacity; //becomes a negative number
  			end -= this._capacity;
  		}
  		if (this._first + end < this._capacity) return this._buffer.slice(this._first + start, this._first + end + 1);else return this._buffer.slice(this._first + start, this._capacity).concat(this._buffer.slice(0, this._first + end + 1 - this._capacity));
  	},
  	toarray: function toarray() {
  		if (this._size == 0) return [];
  		return this.get(0, this._size - 1);
  	}
  };

  /**
   * Generate MP4 Box
   * got from: https://github.com/dailymotion/hls.js
   */

  var MP4 = function () {
      function MP4() {
          classCallCheck(this, MP4);
      }

      createClass(MP4, null, [{
          key: 'init',
          value: function init() {
              MP4.types = {
                  avc1: [], // codingname
                  avcC: [],
                  btrt: [],
                  dinf: [],
                  dref: [],
                  esds: [],
                  ftyp: [],
                  hdlr: [],
                  mdat: [],
                  mdhd: [],
                  mdia: [],
                  mfhd: [],
                  minf: [],
                  moof: [],
                  moov: [],
                  mp4a: [],
                  mvex: [],
                  mvhd: [],
                  sdtp: [],
                  stbl: [],
                  stco: [],
                  stsc: [],
                  stsd: [],
                  stsz: [],
                  stts: [],
                  tfdt: [],
                  tfhd: [],
                  traf: [],
                  trak: [],
                  trun: [],
                  trex: [],
                  tkhd: [],
                  vmhd: [],
                  smhd: []
              };

              var i;
              for (i in MP4.types) {
                  if (MP4.types.hasOwnProperty(i)) {
                      MP4.types[i] = [i.charCodeAt(0), i.charCodeAt(1), i.charCodeAt(2), i.charCodeAt(3)];
                  }
              }

              var videoHdlr = new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x00, // pre_defined
              0x76, 0x69, 0x64, 0x65, // handler_type: 'vide'
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x56, 0x69, 0x64, 0x65, 0x6f, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'VideoHandler'
              ]);

              var audioHdlr = new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x00, // pre_defined
              0x73, 0x6f, 0x75, 0x6e, // handler_type: 'soun'
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x53, 0x6f, 0x75, 0x6e, 0x64, 0x48, 0x61, 0x6e, 0x64, 0x6c, 0x65, 0x72, 0x00 // name: 'SoundHandler'
              ]);

              MP4.HDLR_TYPES = {
                  'video': videoHdlr,
                  'audio': audioHdlr
              };

              var dref = new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x01, // entry_count
              0x00, 0x00, 0x00, 0x0c, // entry_size
              0x75, 0x72, 0x6c, 0x20, // 'url' type
              0x00, // version 0
              0x00, 0x00, 0x01 // entry_flags
              ]);

              var stco = new Uint8Array([0x00, // version
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x00 // entry_count
              ]);

              MP4.STTS = MP4.STSC = MP4.STCO = stco;

              MP4.STSZ = new Uint8Array([0x00, // version
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x00, // sample_size
              0x00, 0x00, 0x00, 0x00]);
              MP4.VMHD = new Uint8Array([0x00, // version
              0x00, 0x00, 0x01, // flags
              0x00, 0x00, // graphicsmode
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00 // opcolor
              ]);
              MP4.SMHD = new Uint8Array([0x00, // version
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, // balance
              0x00, 0x00 // reserved
              ]);

              MP4.STSD = new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x01]); // entry_count

              var majorBrand = new Uint8Array([105, 115, 111, 109]); // isom
              var avc1Brand = new Uint8Array([97, 118, 99, 49]); // avc1
              var minorVersion = new Uint8Array([0, 0, 0, 1]);

              MP4.FTYP = MP4.box(MP4.types.ftyp, majorBrand, minorVersion, majorBrand, avc1Brand);
              MP4.DINF = MP4.box(MP4.types.dinf, MP4.box(MP4.types.dref, dref));
          }
      }, {
          key: 'box',
          value: function box(type) {
              for (var _len = arguments.length, payload = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                  payload[_key - 1] = arguments[_key];
              }

              var size = 8,
                  i = payload.length,
                  len = i,
                  result;
              // calculate the total size we need to allocate
              while (i--) {
                  size += payload[i].byteLength;
              }
              result = new Uint8Array(size);
              result[0] = size >> 24 & 0xff;
              result[1] = size >> 16 & 0xff;
              result[2] = size >> 8 & 0xff;
              result[3] = size & 0xff;
              result.set(type, 4);
              // copy the payload into the result
              for (i = 0, size = 8; i < len; ++i) {
                  // copy payload[i] array @ offset size
                  result.set(payload[i], size);
                  size += payload[i].byteLength;
              }
              return result;
          }
      }, {
          key: 'hdlr',
          value: function hdlr(type) {
              return MP4.box(MP4.types.hdlr, MP4.HDLR_TYPES[type]);
          }
      }, {
          key: 'mdat',
          value: function mdat(data) {
              return MP4.box(MP4.types.mdat, data);
          }
      }, {
          key: 'mdhd',
          value: function mdhd(timescale, duration) {
              return MP4.box(MP4.types.mdhd, new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x02, // creation_time
              0x00, 0x00, 0x00, 0x03, // modification_time
              timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
              duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
              0x55, 0xc4, // 'und' language (undetermined)
              0x00, 0x00]));
          }
      }, {
          key: 'mdia',
          value: function mdia(track) {
              return MP4.box(MP4.types.mdia, MP4.mdhd(track.timescale, track.duration), MP4.hdlr(track.type), MP4.minf(track));
          }
      }, {
          key: 'mfhd',
          value: function mfhd(sequenceNumber) {
              return MP4.box(MP4.types.mfhd, new Uint8Array([0x00, 0x00, 0x00, 0x00, // flags
              sequenceNumber >> 24, sequenceNumber >> 16 & 0xFF, sequenceNumber >> 8 & 0xFF, sequenceNumber & 0xFF]) // sequence_number
              );
          }
      }, {
          key: 'minf',
          value: function minf(track) {
              if (track.type === 'audio') {
                  return MP4.box(MP4.types.minf, MP4.box(MP4.types.smhd, MP4.SMHD), MP4.DINF, MP4.stbl(track));
              } else {
                  return MP4.box(MP4.types.minf, MP4.box(MP4.types.vmhd, MP4.VMHD), MP4.DINF, MP4.stbl(track));
              }
          }
      }, {
          key: 'moof',
          value: function moof(sn, baseMediaDecodeTime, track) {
              return MP4.box(MP4.types.moof, MP4.mfhd(sn), MP4.traf(track, baseMediaDecodeTime));
          }
          /**
           * @param tracks... (optional) {array} the tracks associated with this movie
           */

      }, {
          key: 'moov',
          value: function moov(tracks, duration, timescale) {
              var i = tracks.length,
                  boxes = [];

              while (i--) {
                  boxes[i] = MP4.trak(tracks[i]);
              }

              return MP4.box.apply(null, [MP4.types.moov, MP4.mvhd(timescale, duration)].concat(boxes).concat(MP4.mvex(tracks)));
          }
      }, {
          key: 'mvex',
          value: function mvex(tracks) {
              var i = tracks.length,
                  boxes = [];

              while (i--) {
                  boxes[i] = MP4.trex(tracks[i]);
              }
              return MP4.box.apply(null, [MP4.types.mvex].concat(boxes));
          }
      }, {
          key: 'mvhd',
          value: function mvhd(timescale, duration) {
              var bytes = new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              0x00, 0x00, 0x00, 0x01, // creation_time
              0x00, 0x00, 0x00, 0x02, // modification_time
              timescale >> 24 & 0xFF, timescale >> 16 & 0xFF, timescale >> 8 & 0xFF, timescale & 0xFF, // timescale
              duration >> 24 & 0xFF, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
              0x00, 0x01, 0x00, 0x00, // 1.0 rate
              0x01, 0x00, // 1.0 volume
              0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
              0xff, 0xff, 0xff, 0xff // next_track_ID
              ]);
              return MP4.box(MP4.types.mvhd, bytes);
          }
      }, {
          key: 'sdtp',
          value: function sdtp(track) {
              var samples = track.samples || [],
                  bytes = new Uint8Array(4 + samples.length),
                  flags,
                  i;
              // leave the full box header (4 bytes) all zero
              // write the sample table
              for (i = 0; i < samples.length; i++) {
                  flags = samples[i].flags;
                  bytes[i + 4] = flags.dependsOn << 4 | flags.isDependedOn << 2 | flags.hasRedundancy;
              }

              return MP4.box(MP4.types.sdtp, bytes);
          }
      }, {
          key: 'stbl',
          value: function stbl(track) {
              return MP4.box(MP4.types.stbl, MP4.stsd(track), MP4.box(MP4.types.stts, MP4.STTS), MP4.box(MP4.types.stsc, MP4.STSC), MP4.box(MP4.types.stsz, MP4.STSZ), MP4.box(MP4.types.stco, MP4.STCO));
          }
      }, {
          key: 'avc1',
          value: function avc1(track) {
              var sps = [],
                  pps = [],
                  i,
                  data,
                  len;
              // assemble the SPSs

              for (i = 0; i < track.sps.length; i++) {
                  data = track.sps[i];
                  len = data.byteLength;
                  sps.push(len >>> 8 & 0xFF);
                  sps.push(len & 0xFF);
                  sps = sps.concat(Array.prototype.slice.call(data)); // SPS
              }

              // assemble the PPSs
              for (i = 0; i < track.pps.length; i++) {
                  data = track.pps[i];
                  len = data.byteLength;
                  pps.push(len >>> 8 & 0xFF);
                  pps.push(len & 0xFF);
                  pps = pps.concat(Array.prototype.slice.call(data));
              }

              var avcc = MP4.box(MP4.types.avcC, new Uint8Array([0x01, // version
              sps[3], // profile
              sps[4], // profile compat
              sps[5], // level
              0xfc | 3, // lengthSizeMinusOne, hard-coded to 4 bytes
              0xE0 | track.sps.length // 3bit reserved (111) + numOfSequenceParameterSets
              ].concat(sps).concat([track.pps.length // numOfPictureParameterSets
              ]).concat(pps))),
                  // "PPS"
              width = track.width,
                  height = track.height;
              //console.log('avcc:' + Hex.hexDump(avcc));
              return MP4.box(MP4.types.avc1, new Uint8Array([0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, // reserved
              0x00, 0x01, // data_reference_index
              0x00, 0x00, // pre_defined
              0x00, 0x00, // reserved
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // pre_defined
              width >> 8 & 0xFF, width & 0xff, // width
              height >> 8 & 0xFF, height & 0xff, // height
              0x00, 0x48, 0x00, 0x00, // horizresolution
              0x00, 0x48, 0x00, 0x00, // vertresolution
              0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x01, // frame_count
              0x12, 0x62, 0x69, 0x6E, 0x65, //binelpro.ru
              0x6C, 0x70, 0x72, 0x6F, 0x2E, 0x72, 0x75, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // compressorname
              0x00, 0x18, // depth = 24
              0x11, 0x11]), // pre_defined = -1
              avcc, MP4.box(MP4.types.btrt, new Uint8Array([0x00, 0x1c, 0x9c, 0x80, // bufferSizeDB
              0x00, 0x2d, 0xc6, 0xc0, // maxBitrate
              0x00, 0x2d, 0xc6, 0xc0])) // avgBitrate
              );
          }
      }, {
          key: 'esds',
          value: function esds(track) {
              var configlen = track.config.byteLength;
              var data = new Uint8Array(26 + configlen + 3);
              data.set([0x00, // version 0
              0x00, 0x00, 0x00, // flags

              0x03, // descriptor_type
              0x17 + configlen, // length
              0x00, 0x01, //es_id
              0x00, // stream_priority

              0x04, // descriptor_type
              0x0f + configlen, // length
              0x40, //codec : mpeg4_audio
              0x15, // stream_type
              0x00, 0x00, 0x00, // buffer_size
              0x00, 0x00, 0x00, 0x00, // maxBitrate
              0x00, 0x00, 0x00, 0x00, // avgBitrate

              0x05, // descriptor_type
              configlen]);
              data.set(track.config, 26);
              data.set([0x06, 0x01, 0x02], 26 + configlen);
              // return new Uint8Array([
              //     0x00, // version 0
              //     0x00, 0x00, 0x00, // flags
              //
              //     0x03, // descriptor_type
              //     0x17+configlen, // length
              //     0x00, 0x01, //es_id
              //     0x00, // stream_priority
              //
              //     0x04, // descriptor_type
              //     0x0f+configlen, // length
              //     0x40, //codec : mpeg4_audio
              //     0x15, // stream_type
              //     0x00, 0x00, 0x00, // buffer_size
              //     0x00, 0x00, 0x00, 0x00, // maxBitrate
              //     0x00, 0x00, 0x00, 0x00, // avgBitrate
              //
              //     0x05 // descriptor_type
              // ].concat([configlen]).concat(track.config).concat([0x06, 0x01, 0x02])); // GASpecificConfig)); // length + audio config descriptor
              return data;
          }
      }, {
          key: 'mp4a',
          value: function mp4a(track) {
              var audiosamplerate = track.audiosamplerate;
              return MP4.box(MP4.types.mp4a, new Uint8Array([0x00, 0x00, 0x00, // reserved
              0x00, 0x00, 0x00, // reserved
              0x00, 0x01, // data_reference_index
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
              0x00, track.channelCount, // channelcount
              0x00, 0x10, // sampleSize:16bits
              0x00, 0x00, // pre_defined
              0x00, 0x00, // reserved2
              audiosamplerate >> 8 & 0xFF, audiosamplerate & 0xff, //
              0x00, 0x00]), MP4.box(MP4.types.esds, MP4.esds(track)));
          }
      }, {
          key: 'stsd',
          value: function stsd(track) {
              if (track.type === 'audio') {
                  return MP4.box(MP4.types.stsd, MP4.STSD, MP4.mp4a(track));
              } else {
                  return MP4.box(MP4.types.stsd, MP4.STSD, MP4.avc1(track));
              }
          }
      }, {
          key: 'tkhd',
          value: function tkhd(track) {
              var id = track.id,
                  duration = track.duration,
                  width = track.width,
                  height = track.height,
                  volume = track.volume;
              return MP4.box(MP4.types.tkhd, new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x07, // flags
              0x00, 0x00, 0x00, 0x00, // creation_time
              0x00, 0x00, 0x00, 0x00, // modification_time
              id >> 24 & 0xFF, id >> 16 & 0xFF, id >> 8 & 0xFF, id & 0xFF, // track_ID
              0x00, 0x00, 0x00, 0x00, // reserved
              duration >> 24, duration >> 16 & 0xFF, duration >> 8 & 0xFF, duration & 0xFF, // duration
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // reserved
              0x00, 0x00, // layer
              0x00, 0x00, // alternate_group
              volume >> 0 & 0xff, volume % 1 * 10 >> 0 & 0xff, // track volume // FIXME
              0x00, 0x00, // reserved
              0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x40, 0x00, 0x00, 0x00, // transformation: unity matrix
              width >> 8 & 0xFF, width & 0xFF, 0x00, 0x00, // width
              height >> 8 & 0xFF, height & 0xFF, 0x00, 0x00 // height
              ]));
          }
      }, {
          key: 'traf',
          value: function traf(track, baseMediaDecodeTime) {
              var sampleDependencyTable = MP4.sdtp(track),
                  id = track.id;
              return MP4.box(MP4.types.traf, MP4.box(MP4.types.tfhd, new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF]) // track_ID
              ), MP4.box(MP4.types.tfdt, new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              baseMediaDecodeTime >> 24, baseMediaDecodeTime >> 16 & 0XFF, baseMediaDecodeTime >> 8 & 0XFF, baseMediaDecodeTime & 0xFF]) // baseMediaDecodeTime
              ), MP4.trun(track, sampleDependencyTable.length + 16 + // tfhd
              16 + // tfdt
              8 + // traf header
              16 + // mfhd
              8 + // moof header
              8), // mdat header
              sampleDependencyTable);
          }

          /**
           * Generate a track box.
           * @param track {object} a track definition
           * @return {Uint8Array} the track box
           */

      }, {
          key: 'trak',
          value: function trak(track) {
              track.duration = track.duration || 0xffffffff;
              return MP4.box(MP4.types.trak, MP4.tkhd(track), MP4.mdia(track));
          }
      }, {
          key: 'trex',
          value: function trex(track) {
              var id = track.id;
              return MP4.box(MP4.types.trex, new Uint8Array([0x00, // version 0
              0x00, 0x00, 0x00, // flags
              id >> 24, id >> 16 & 0XFF, id >> 8 & 0XFF, id & 0xFF, // track_ID
              0x00, 0x00, 0x00, 0x01, // default_sample_description_index
              0x00, 0x00, 0x00, 0x00, // default_sample_duration
              0x00, 0x00, 0x00, 0x00, // default_sample_size
              0x00, 0x01, 0x00, 0x01 // default_sample_flags
              ]));
          }
      }, {
          key: 'trun',
          value: function trun(track, offset) {
              var samples = track.samples || [],
                  len = samples.length,
                  arraylen = 12 + 16 * len,
                  array = new Uint8Array(arraylen),
                  i,
                  sample,
                  duration,
                  size,
                  flags,
                  cts;
              offset += 8 + arraylen;
              array.set([0x00, // version 0
              0x00, 0x0f, 0x01, // flags
              len >>> 24 & 0xFF, len >>> 16 & 0xFF, len >>> 8 & 0xFF, len & 0xFF, // sample_count
              offset >>> 24 & 0xFF, offset >>> 16 & 0xFF, offset >>> 8 & 0xFF, offset & 0xFF // data_offset
              ], 0);
              for (i = 0; i < len; i++) {
                  sample = samples[i];
                  duration = sample.duration;
                  size = sample.size;
                  flags = sample.flags;
                  cts = sample.cts;
                  array.set([duration >>> 24 & 0xFF, duration >>> 16 & 0xFF, duration >>> 8 & 0xFF, duration & 0xFF, // sample_duration
                  size >>> 24 & 0xFF, size >>> 16 & 0xFF, size >>> 8 & 0xFF, size & 0xFF, // sample_size
                  flags.isLeading << 2 | flags.dependsOn, flags.isDependedOn << 6 | flags.hasRedundancy << 4 | flags.paddingValue << 1 | flags.isNonSync, flags.degradPrio & 0xF0 << 8, flags.degradPrio & 0x0F, // sample_flags
                  cts >>> 24 & 0xFF, cts >>> 16 & 0xFF, cts >>> 8 & 0xFF, cts & 0xFF // sample_composition_time_offset
                  ], 12 + 16 * i);
              }
              return MP4.box(MP4.types.trun, array);
          }
      }, {
          key: 'initSegment',
          value: function initSegment(tracks, duration, timescale) {
              if (!MP4.types) {
                  MP4.init();
              }
              var movie = MP4.moov(tracks, duration, timescale),
                  result;
              result = new Uint8Array(MP4.FTYP.byteLength + movie.byteLength);
              result.set(MP4.FTYP);
              result.set(movie, MP4.FTYP.byteLength);
              return result;
          }
      }]);
      return MP4;
  }();

  var DataView$1 = window.DataView;

  function PublicPromise() {
      var resolvePromise;
      var rejectPromise;
      // Promise.call causes an error.  It seems that inheriting from a native
      // Promise is not permitted by JavaScript interpreters.
      // The work-around is to construct a Promise object, modify it to look like
      // the compiler's picture of PublicPromise, then return it.  The caller of
      // new PublicPromise will receive |promise| instead of |this|, and the
      // compiler will be aware of the additional properties |resolve| and
      // |reject|.
      var promise = new Promise(function (resolve, reject) {
          resolvePromise = resolve;
          rejectPromise = reject;
      });
      promise.resolve = resolvePromise;
      promise.reject = rejectPromise;
      return promise;
  }

  var LOG_TAG = "mse";
  var Log$1 = getTagged(LOG_TAG);

  var MSEBuffer = function () {
      function MSEBuffer(parent, codec) {
          classCallCheck(this, MSEBuffer);

          this.mediaSource = parent.mediaSource;
          this.players = parent.players;
          this._parent = parent;
          this._queue = [];
          this.codec = codec;
          this._destroyed = false;
          this._lastClearEnd = 0;

          Log$1.debug('Use codec: ' + codec);

          this._sourceBuffer = this.mediaSource.addSourceBuffer(codec);
          this.eventSource = new EventEmitter(this._sourceBuffer);

          this.eventSource.addEventListener('updateend', this._onUpdateEnd.bind(this));
          this.eventSource.addEventListener('error', this._onError.bind(this));
      }

      createClass(MSEBuffer, [{
          key: 'destroy',
          value: function destroy() {
              var _this = this;

              this._destroyed = true;

              var cleanup = [];
              var noop = function noop(e) {};

              var q = this._queue;
              var inProgress = q[0];
              // Drop everything else out of the queue.
              this._queue = q.slice(0, 1);

              if (inProgress) {
                  cleanup.push(inProgress.p.catch(noop));
              }

              for (var i = 1; i < q.length; i++) {
                  q[i].p.catch(noop);
                  q[i].p.reject();
              }

              return Promise.all(cleanup).then(function () {
                  _this.eventSource.destroy();
                  _this.eventSource = null;
                  _this.mediaSource.removeSourceBuffer(_this._sourceBuffer);
                  _this._sourceBuffer = null;
                  _this._queue = {};
                  _this._lastClearEnd = 0;
              });
          }
      }, {
          key: 'setLive',
          value: function setLive(is_live) {
              this.is_live = is_live;
          }
      }, {
          key: 'appendBuffer',
          value: function appendBuffer(data) {
              return this._enqueueOperations(this._opAppend.bind(this, data));
          }
      }, {
          key: 'clear',
          value: function clear() {
              // Note that not all platforms allow clearing to Infinity.
              return this._enqueueOperations(this._opRemove.bind(this, 0, this.mediaSource.duration));
          }
      }, {
          key: 'remove',
          value: function remove(start, end) {
              return this._enqueueOperations(this._opRemove.bind(this, start, end));
          }
      }, {
          key: '_clearLiveBuffer',
          value: function _clearLiveBuffer() {
              if (!this.is_live) {
                  return;
              }
              var buffered = this._sourceBuffer.buffered;
              if (buffered.length == 0) {
                  return;
              }
              var start = buffered.start(0);
              var end = buffered.end(0);
              //console.log("buffered length: ", this.codec, buffered.length, start, end);
              var clearEnd = this.players[0].currentTime - MSEBuffer.LIVE_BUFFER_DURATION;
              if (end - start < MSEBuffer.LIVE_BUFFER_DURATION || start >= clearEnd || clearEnd - this._lastClearEnd < MSEBuffer.LIVE_BUFFER_DURATION) {
                  return;
              }
              this._lastClearEnd = clearEnd;
              this.remove(start, clearEnd);
          }

          // https://shaka-player-demo.appspot.com/docs/api/lib_media_media_source_engine.js.html

      }, {
          key: '_enqueueOperations',
          value: function _enqueueOperations(start) {
              if (this._destroyed) return Promise.reject();

              var op = {
                  start: start,
                  p: new PublicPromise()
              };
              this._queue.push(op);

              if (this._queue.length == 1) {
                  try {
                      op.start();
                  } catch (exception) {
                      op.p.reject(exception);
                      this._popFromQueue();
                  }
              }
          }
      }, {
          key: '_popFromQueue',
          value: function _popFromQueue() {
              this._queue.shift();
              var next = this._queue[0];
              if (next) {
                  try {
                      next.start();
                  } catch (exception) {
                      console.log("pop op: ", exception);
                      next.p.reject(exception);
                      this._popFromQueue();
                  }
              }
          }
      }, {
          key: '_onUpdateEnd',
          value: function _onUpdateEnd() {
              var op = this._queue[0];
              if (!op) {
                  console.log("Spurious updateend event!");
                  return;
              }
              if (this._sourceBuffer.updating) {
                  console.log("SourceBuffer should not be updating on updateend!");
                  return;
              }
              op.p.resolve();
              this._popFromQueue();
          }
      }, {
          key: '_onError',
          value: function _onError() {
              var op = this._queue[0];
              if (!op) {
                  console.log("Spurious updateend event!");
                  return;
              }
              if (this._sourceBuffer.updating) {
                  console.log("SourceBuffer should not be updating on updateend!");
                  return;
              }
              var code = this.mediaSource.error ? this.mediaSource.error.code : 0;
              op.p.reject(new Error('media source error: ' + code));
              // Do not pop from queue.  An 'updateend' event will fire next, and to avoid
              // synchronizing these two event handlers, we will allow that one to pop from
              // the queue as normal.  Note that because the operation has already been
              // rejected, the call to resolve() in the 'updateend' handler will have no
              // effect.
          }
      }, {
          key: '_adjustPlaySpeed',
          value: function _adjustPlaySpeed() {
              var buffered = this._sourceBuffer.buffered;
              if (buffered.length == 0) {
                  return;
              }

              var end = this._sourceBuffer.buffered.end(0);
              var currentTime = this.players[0].currentTime;

              if (this.mediaSource.playbackRate == 1) {
                  if (currentTime < end - MSEBuffer.FAST_FORWARD_BEGIN_DURATION) {
                      this.mediaSource.playbackRate = 1.5;
                      console.log("begin fast forward readyState: ", this.mediaSource.readyState, "currentTime: ", currentTime, "buffer end", end);
                  }
              } else if (this.mediaSource.playbackRate > 1) {
                  if (currentTime >= end - MSEBuffer.FAST_FORWARD_END_DURATION) {
                      this.mediaSource.playbackRate = 1;
                      console.log("end fast forward readyState: ", this.mediaSource.readyState, "currentTime: ", currentTime, "buffer end", end);
                  }
              }
          }
      }, {
          key: '_opAppend',
          value: function _opAppend(data) {
              // This will trigger an 'updateend' event.
              // console.log(data)
              this._adjustPlaySpeed();
              this._sourceBuffer.appendBuffer(data);
              this._clearLiveBuffer();
          }
      }, {
          key: '_opRemove',
          value: function _opRemove(start, end) {
              if (end <= start) {
                  // Ignore removal of inverted or empty ranges.
                  // Fake 'updateend' event to resolve the operation.
                  this.onUpdateEnd_();
                  return;
              }
              // This will trigger an 'updateend' event.
              Log$1.debug("cleaing streaming buffer: ", start, end);
              this._sourceBuffer.remove(start, end);
          }
      }, {
          key: '_opAbort',
          value: function _opAbort() {
              var appendWindowStart = this._sourceBuffer.appendWindowStart;
              var appendWindowEnd = this._sourceBuffer.appendWindowEnd;

              // This will not trigger an 'updateend' event, since nothing is happening.
              // This is only to reset MSE internals, not to abort an actual operation.
              this._sourceBuffer.abort();

              this._sourceBuffer.appendWindowStart = appendWindowStart;
              this._sourceBuffer.appendWindowEnd = appendWindowEnd;

              // Fake 'updateend' event to resolve the operation.
              this._onUpdateEnd();
          }

          /**
           * Nudge the playhead to force the media pipeline to be flushed.
           * This seems to be necessary on Chromecast to get new content to replace old
           * content.
           * @param {shaka.util.ManifestParserUtils.ContentType} contentType
           * @private
           */

      }, {
          key: '_opFlush',
          value: function _opFlush() {
              // Never use flush_ if there's data.  It causes a hiccup in playback.
              if (this.mediaSource.buffered.length != 0) {
                  throw new Error('flush_ should only be used after clearing all data!');
              }
              this.mediaSource.currentTime -= 0.001;

              // Fake 'updateend' event to resolve the operation.
              this._onUpdateEnd();
          }
      }], [{
          key: 'LIVE_BUFFER_DURATION',
          get: function get() {
              return 60;
          }
      }, {
          key: 'FAST_FORWARD_END_DURATION',
          get: function get() {
              return 3;
          }
      }, {
          key: 'FAST_FORWARD_BEGIN_DURATION',
          get: function get() {
              return 6;
          }
      }]);
      return MSEBuffer;
  }();

  var MSE = function () {
      createClass(MSE, null, [{
          key: 'isSupported',
          value: function isSupported(codecs) {
              return window.MediaSource && window.MediaSource.isTypeSupported('video/mp4; codecs="' + codecs.join(',') + '"');
          }
      }, {
          key: 'ErrorNotes',

          // static CODEC_AVC_BASELINE = "avc1.42E01E";
          // static CODEC_AVC_MAIN = "avc1.4D401E";
          // static CODEC_AVC_HIGH = "avc1.64001E";
          // static CODEC_VP8 = "vp8";
          // static CODEC_AAC = "mp4a.40.2";
          // static CODEC_VORBIS = "vorbis";
          // static CODEC_THEORA = "theora";

          get: function get() {
              var _ref;

              return _ref = {}, defineProperty(_ref, MediaError.MEDIA_ERR_ABORTED, 'fetching process aborted by user'), defineProperty(_ref, MediaError.MEDIA_ERR_NETWORK, 'error occurred when downloading'), defineProperty(_ref, MediaError.MEDIA_ERR_DECODE, 'error occurred when decoding'), defineProperty(_ref, MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED, 'audio/video not supported'), _ref;
          }
      }]);

      function MSE(players) {
          classCallCheck(this, MSE);

          this.players = players;
          var playing = this.players.map(function (video, idx) {
              video.onplaying = function () {
                  playing[idx] = true;
              };
              video.onpause = function () {
                  playing[idx] = false;
              };
              return !video.paused;
          });
          this.playing = playing;
          this.mediaSource = new MediaSource();
          this.eventSource = new EventEmitter(this.mediaSource);
          this._reset();
      }

      createClass(MSE, [{
          key: 'destroy',
          value: function destroy() {
              this._reset();
              this.eventSource.destroy();
              this.mediaSource = null;
              this.eventSource = null;
          }
      }, {
          key: 'play',
          value: function play() {
              var _this2 = this;

              this.players.forEach(function (video, idx) {
                  if (video.paused && !_this2.playing[idx]) {
                      var p = video.play();
                      if (p !== undefined) {
                          p.catch(function (error) {
                              // Auto-play was prevented
                              // Show a UI element to let the user manually start playback
                              console.log("auto play disabled by browser: ", error);
                          }).then(function () {
                              Log$1.debug('player ' + idx + ': play');
                              // Auto-play started
                          });
                      }
                  }
              });
          }
      }, {
          key: 'setLive',
          value: function setLive(is_live) {
              for (var idx in this.buffers) {
                  this.buffers[idx].setLive(is_live);
              }
              this.is_live = is_live;
          }
      }, {
          key: '_resetBuffers',
          value: function _resetBuffers() {
              var _this3 = this;

              this.players.forEach(function (video, idx) {
                  if (!video.paused && _this3.playing[idx]) {
                      video.pause();
                      video.currentTime = 0;
                  }
              });

              var promises = [];
              for (var idx in this.buffers) {
                  promises.push(this.buffers[idx].destroy());
              }
              if (promises.length == 0) {
                  return Promise.resolve();
              }
              this.buffers = {};
              return Promise.all(promises).then(function () {
                  if (_this3.mediaSource.readyState == 'open') {
                      _this3.mediaSource.duration = 0;
                      // this.mediaSource.clearLiveSeekableRange();
                      _this3.mediaSource.endOfStream();
                  }
              });
          }
      }, {
          key: 'attachMediaSource',
          value: function attachMediaSource() {
              var _this4 = this;

              return this._resetBuffers().then(function (e) {
                  Log$1.debug('source buffers reset.');
                  _this4._reset();
                  _this4.players.forEach(function (video) {
                      video.src = URL.createObjectURL(_this4.mediaSource);
                  });
                  return _this4._setupEvents();
              });
          }
      }, {
          key: '_setupEvents',
          value: function _setupEvents() {
              var _this5 = this;

              this.eventSource.clear();
              this.resolved = false;
              this.mediaReady = new Promise(function (resolve, reject) {
                  _this5._sourceOpen = function () {
                      Log$1.debug('Media source opened: ' + _this5.mediaSource.readyState);
                      if (!_this5.resolved) {
                          _this5.resolved = true;
                          resolve();
                      }
                  };
                  _this5._sourceEnded = function () {
                      Log$1.debug('Media source ended: ' + _this5.mediaSource.readyState);
                  };
                  _this5._sourceClose = function () {
                      Log$1.debug('Media source closed: ' + _this5.mediaSource.readyState);
                      if (_this5.resolved) {
                          _this5.eventSource.dispatchEvent('sourceclosed');
                      }
                  };
                  _this5.eventSource.addEventListener('sourceopen', _this5._sourceOpen);
                  _this5.eventSource.addEventListener('sourceended', _this5._sourceEnded);
                  _this5.eventSource.addEventListener('sourceclose', _this5._sourceClose);
              });
              return this.mediaReady;
          }
      }, {
          key: '_reset',
          value: function _reset() {
              this.ready = false;
              this.resolved = false;
              this.buffers = {};
              // this.players.forEach((video)=>{video.src = URL.createObjectURL(this.mediaSource)});
              // TODO: remove event listeners for existing media source
              // this.setupEvents();
              // this.clear();
          }
      }, {
          key: 'setCodec',
          value: function setCodec(track, mimeCodec) {
              var _this6 = this;

              return this.mediaReady.then(function () {
                  _this6.buffers[track] = new MSEBuffer(_this6, mimeCodec);
                  _this6.buffers[track].setLive(_this6.is_live);
              });
          }
      }, {
          key: 'feed',
          value: function feed(track, data) {
              var _this7 = this;

              if (!this.buffers[track]) {
                  return;
              }
              if (Array.isArray(data)) {
                  data.forEach(function (e) {
                      _this7.buffers[track].appendBuffer(e);
                  });
              } else {
                  this.buffers[track].appendBuffer(data);
              }
          }
      }]);
      return MSE;
  }();

  var Log$2 = getTagged('remuxer:base');
  var track_id = 1;
  var BaseRemuxer = function () {
      createClass(BaseRemuxer, null, [{
          key: 'getTrackID',


          // TODO: move to ts parser
          // static PTSNormalize(value, reference) {
          //
          //     let offset;
          //     if (reference === undefined) {
          //         return value;
          //     }
          //     if (reference < value) {
          //         // - 2^33
          //         offset = -8589934592;
          //     } else {
          //         // + 2^33
          //         offset = 8589934592;
          //     }
          //     /* PTS is 33bit (from 0 to 2^33 -1)
          //      if diff between value and reference is bigger than half of the amplitude (2^32) then it means that
          //      PTS looping occured. fill the gap */
          //     while (Math.abs(value - reference) > 4294967296) {
          //         value += offset;
          //     }
          //     return value;
          // }

          value: function getTrackID() {
              return track_id++;
          }
      }, {
          key: 'MP4_TIMESCALE',
          get: function get() {
              return 90000;
          }
      }]);

      function BaseRemuxer(timescale, scaleFactor, params) {
          classCallCheck(this, BaseRemuxer);

          this.timeOffset = 0;
          this.timescale = timescale;
          this.scaleFactor = scaleFactor;
          this.readyToDecode = false;
          this.samples = [];
          this.seq = 1;
          this.tsAlign = 1;
      }

      createClass(BaseRemuxer, [{
          key: 'scaled',
          value: function scaled(timestamp) {
              return timestamp / this.scaleFactor;
          }
      }, {
          key: 'unscaled',
          value: function unscaled(timestamp) {
              return timestamp * this.scaleFactor;
          }
      }, {
          key: 'remux',
          value: function remux(unit) {
              if (unit) {
                  this.samples.push({
                      unit: unit,
                      pts: unit.pts,
                      dts: unit.dts
                  });
                  return true;
              }
              return false;
          }
      }, {
          key: 'setConfig',
          value: function setConfig(config) {}
      }, {
          key: 'insertDscontinuity',
          value: function insertDscontinuity() {
              this.samples.push(null);
          }
      }, {
          key: 'init',
          value: function init(initPTS, initDTS) {
              var shouldInitialize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

              this.initPTS = Math.min(initPTS, this.samples[0].dts /*- this.unscaled(this.timeOffset)*/);
              this.initDTS = Math.min(initDTS, this.samples[0].dts /*- this.unscaled(this.timeOffset)*/);
              Log$2.debug('Initial pts=' + this.initPTS + ' dts=' + this.initDTS + ' offset=' + this.unscaled(this.timeOffset));
              this.initialized = shouldInitialize;
          }
      }, {
          key: 'flush',
          value: function flush() {
              this.seq++;
              this.mp4track.len = 0;
              this.mp4track.samples = [];
          }
      }, {
          key: 'getPayloadBase',
          value: function getPayloadBase(sampleFunction, setupSample) {
              if (!this.readyToDecode || !this.initialized || !this.samples.length) return null;
              this.samples.sort(BaseRemuxer.dtsSortFunc);
              return true;
              //
              // let payload = new Uint8Array(this.mp4track.len);
              // let offset = 0;
              // let samples=this.mp4track.samples;
              // let mp4Sample, lastDTS, pts, dts;
              //
              // while (this.samples.length) {
              //     let sample = this.samples.shift();
              //     if (sample === null) {
              //         // discontinuity
              //         this.nextDts = undefined;
              //         break;
              //     }
              //
              //     let unit = sample.unit;
              //
              //     pts = Math.round((sample.pts - this.initDTS)/this.tsAlign)*this.tsAlign;
              //     dts = Math.round((sample.dts - this.initDTS)/this.tsAlign)*this.tsAlign;
              //     // ensure DTS is not bigger than PTS
              //     dts = Math.min(pts, dts);
              //
              //     // sampleFunction(pts, dts);   // TODO:
              //
              //     // mp4Sample = setupSample(unit, pts, dts);    // TODO:
              //
              //     payload.set(unit.getData(), offset);
              //     offset += unit.getSize();
              //
              //     samples.push(mp4Sample);
              //     lastDTS = dts;
              // }
              // if (!samples.length) return null;
              //
              // // samplesPostFunction(samples); // TODO:
              //
              // return new Uint8Array(payload.buffer, 0, this.mp4track.len);
          }
      }, {
          key: 'setOOBDataHandler',
          value: function setOOBDataHandler(f) {
              this._oobHandler = f;
          }
      }, {
          key: 'sendOOBData',
          value: function sendOOBData(data) {
              if (this._oobHandler) {
                  this._oobHandler(data);
              }
          }
      }], [{
          key: 'toMS',
          value: function toMS(timestamp) {
              return timestamp / 90;
          }
      }, {
          key: 'dtsSortFunc',
          value: function dtsSortFunc(a, b) {
              return a.dts - b.dts;
          }
      }]);
      return BaseRemuxer;
  }();

  var Log$3 = getTagged("remuxer:aac");
  // TODO: asm.js
  var AACRemuxer = function (_BaseRemuxer) {
      inherits(AACRemuxer, _BaseRemuxer);

      function AACRemuxer(timescale) {
          var scaleFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          classCallCheck(this, AACRemuxer);

          var _this = possibleConstructorReturn(this, (AACRemuxer.__proto__ || Object.getPrototypeOf(AACRemuxer)).call(this, timescale, scaleFactor));

          _this.codecstring = MSE.CODEC_AAC;
          _this.units = [];
          _this.initDTS = undefined;
          _this.nextAacPts = undefined;
          _this.lastPts = 0;
          _this.firstDTS = 0;
          _this.firstPTS = 0;
          _this.duration = params.duration || 0;
          _this.initialized = false;

          _this.mp4track = {
              id: BaseRemuxer.getTrackID(),
              type: 'audio',
              fragmented: true,
              channelCount: 0,
              audiosamplerate: _this.timescale,
              duration: 0,
              timescale: _this.timescale,
              volume: 1,
              samples: [],
              config: '',
              len: 0
          };
          if (params.config) {
              _this.setConfig(params.config);
          }
          return _this;
      }

      createClass(AACRemuxer, [{
          key: 'setConfig',
          value: function setConfig(config) {
              this.mp4track.channelCount = config.channels;
              this.mp4track.audiosamplerate = config.samplerate;
              if (!this.mp4track.duration) {
                  this.mp4track.duration = (this.duration ? this.duration : 0) * config.samplerate;
              }
              this.mp4track.timescale = config.samplerate;
              this.mp4track.config = config.config;
              this.mp4track.codec = config.codec;
              this.timescale = config.samplerate;
              this.scaleFactor = BaseRemuxer.MP4_TIMESCALE / config.samplerate;
              this.expectedSampleDuration = 1024 * this.scaleFactor;
              this.readyToDecode = true;
          }
      }, {
          key: 'remux',
          value: function remux(aac) {
              if (get(AACRemuxer.prototype.__proto__ || Object.getPrototypeOf(AACRemuxer.prototype), 'remux', this).call(this, aac)) {
                  this.mp4track.len += aac.getSize();
              }
          }
      }, {
          key: 'getPayload',
          value: function getPayload() {
              if (!this.readyToDecode || !this.samples.length) return null;
              this.samples.sort(function (a, b) {
                  return a.dts - b.dts;
              });

              var payload = new Uint8Array(this.mp4track.len);
              var offset = 0;
              var samples = this.mp4track.samples;
              var mp4Sample = void 0,
                  lastDTS = void 0,
                  pts = void 0,
                  dts = void 0;

              while (this.samples.length) {
                  var sample = this.samples.shift();
                  if (sample === null) {
                      // discontinuity
                      this.nextDts = undefined;
                      break;
                  }
                  var unit = sample.unit;
                  pts = sample.pts - this.initDTS;
                  dts = sample.dts - this.initDTS;

                  if (lastDTS === undefined) {
                      if (this.nextDts) {
                          var delta = Math.round(this.scaled(pts - this.nextAacPts));
                          // if fragment are contiguous, or delta less than 600ms, ensure there is no overlap/hole between fragments
                          if ( /*contiguous || */Math.abs(delta) < 600) {
                              // log delta
                              if (delta) {
                                  if (delta > 0) {
                                      Log$3.log(delta + ' ms hole between AAC samples detected,filling it');
                                      // if we have frame overlap, overlapping for more than half a frame duraion
                                  } else if (delta < -12) {
                                      // drop overlapping audio frames... browser will deal with it
                                      Log$3.log(-delta + ' ms overlapping between AAC samples detected, drop frame');
                                      this.mp4track.len -= unit.getSize();
                                      continue;
                                  }
                                  // set DTS to next DTS
                                  pts = dts = this.nextAacPts;
                              }
                          }
                      }
                      // remember first PTS of our aacSamples, ensure value is positive
                      this.firstDTS = Math.max(0, dts);
                  }

                  mp4Sample = {
                      size: unit.getSize(),
                      cts: 0,
                      duration: 1024,
                      flags: {
                          isLeading: 0,
                          isDependedOn: 0,
                          hasRedundancy: 0,
                          degradPrio: 0,
                          dependsOn: 1
                      }
                  };

                  payload.set(unit.getData(), offset);
                  offset += unit.getSize();
                  samples.push(mp4Sample);
                  lastDTS = dts;
              }
              if (!samples.length) return null;
              this.nextDts = pts + this.expectedSampleDuration;
              return new Uint8Array(payload.buffer, 0, this.mp4track.len);
          }
      }]);
      return AACRemuxer;
  }(BaseRemuxer);

  /**
   * Parser for exponential Golomb codes, a variable-bitwidth number encoding scheme used by h264.
  */

  var ExpGolomb = function () {
    function ExpGolomb(data) {
      classCallCheck(this, ExpGolomb);

      this.data = data;
      // the number of bytes left to examine in this.data
      this.bytesAvailable = this.data.byteLength;
      // the current word being examined
      this.word = 0; // :uint
      // the number of bits left to examine in the current word
      this.bitsAvailable = 0; // :uint
    }

    // ():void


    createClass(ExpGolomb, [{
      key: 'loadWord',
      value: function loadWord() {
        var position = this.data.byteLength - this.bytesAvailable,
            workingBytes = new Uint8Array(4),
            availableBytes = Math.min(4, this.bytesAvailable);
        if (availableBytes === 0) {
          throw new Error('no bytes available');
        }
        workingBytes.set(this.data.subarray(position, position + availableBytes));
        this.word = new DataView(workingBytes.buffer, workingBytes.byteOffset, workingBytes.byteLength).getUint32(0);
        // track the amount of this.data that has been processed
        this.bitsAvailable = availableBytes * 8;
        this.bytesAvailable -= availableBytes;
      }

      // (count:int):void

    }, {
      key: 'skipBits',
      value: function skipBits(count) {
        var skipBytes; // :int
        if (this.bitsAvailable > count) {
          this.word <<= count;
          this.bitsAvailable -= count;
        } else {
          count -= this.bitsAvailable;
          skipBytes = count >> 3;
          count -= skipBytes << 3;
          this.bytesAvailable -= skipBytes;
          this.loadWord();
          this.word <<= count;
          this.bitsAvailable -= count;
        }
      }

      // (size:int):uint

    }, {
      key: 'readBits',
      value: function readBits(size) {
        var bits = Math.min(this.bitsAvailable, size),
            // :uint
        valu = this.word >>> 32 - bits; // :uint
        if (size > 32) {
          Log.error('Cannot read more than 32 bits at a time');
        }
        this.bitsAvailable -= bits;
        if (this.bitsAvailable > 0) {
          this.word <<= bits;
        } else {
          this.loadWord();
        }
        bits = size - bits;
        if (bits > 0) {
          return valu << bits | this.readBits(bits);
        } else {
          return valu;
        }
      }

      // ():uint

    }, {
      key: 'skipLZ',
      value: function skipLZ() {
        var leadingZeroCount; // :uint
        for (leadingZeroCount = 0; leadingZeroCount < this.bitsAvailable; ++leadingZeroCount) {
          if (0 !== (this.word & 0x80000000 >>> leadingZeroCount)) {
            // the first bit of working word is 1
            this.word <<= leadingZeroCount;
            this.bitsAvailable -= leadingZeroCount;
            return leadingZeroCount;
          }
        }
        // we exhausted word and still have not found a 1
        this.loadWord();
        return leadingZeroCount + this.skipLZ();
      }

      // ():void

    }, {
      key: 'skipUEG',
      value: function skipUEG() {
        this.skipBits(1 + this.skipLZ());
      }

      // ():void

    }, {
      key: 'skipEG',
      value: function skipEG() {
        this.skipBits(1 + this.skipLZ());
      }

      // ():uint

    }, {
      key: 'readUEG',
      value: function readUEG() {
        var clz = this.skipLZ(); // :uint
        return this.readBits(clz + 1) - 1;
      }

      // ():int

    }, {
      key: 'readEG',
      value: function readEG() {
        var valu = this.readUEG(); // :int
        if (0x01 & valu) {
          // the number is odd if the low order bit is set
          return 1 + valu >>> 1; // add 1 to make it even, and divide by 2
        } else {
          return -1 * (valu >>> 1); // divide by two then make it negative
        }
      }

      // Some convenience functions
      // :Boolean

    }, {
      key: 'readBoolean',
      value: function readBoolean() {
        return 1 === this.readBits(1);
      }

      // ():int

    }, {
      key: 'readUByte',
      value: function readUByte() {
        return this.readBits(8);
      }

      // ():int

    }, {
      key: 'readUShort',
      value: function readUShort() {
        return this.readBits(16);
      }
      // ():int

    }, {
      key: 'readUInt',
      value: function readUInt() {
        return this.readBits(32);
      }
    }]);
    return ExpGolomb;
  }();

  // TODO: asm.js

  function appendByteArray(buffer1, buffer2) {
      var tmp = new Uint8Array((buffer1.byteLength | 0) + (buffer2.byteLength | 0));
      tmp.set(buffer1, 0);
      tmp.set(buffer2, buffer1.byteLength | 0);
      return tmp;
  }
  function base64ToArrayBuffer(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes.buffer;
  }

  function hexToByteArray(hex) {
      var len = hex.length >> 1;
      var bufView = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bufView[i] = parseInt(hex.substr(i << 1, 2), 16);
      }
      return bufView;
  }

  function bitSlice(bytearray) {
      var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : bytearray.byteLength * 8;

      var byteLen = Math.ceil((end - start) / 8);
      var res = new Uint8Array(byteLen);
      var startByte = start >>> 3; // /8
      var endByte = (end >>> 3) - 1; // /8
      var bitOffset = start & 0x7; // %8
      var nBitOffset = 8 - bitOffset;
      var endOffset = 8 - end & 0x7; // %8
      for (var i = 0; i < byteLen; ++i) {
          var tail = 0;
          if (i < endByte) {
              tail = bytearray[startByte + i + 1] >> nBitOffset;
              if (i == endByte - 1 && endOffset < 8) {
                  tail >>= endOffset;
                  tail <<= endOffset;
              }
          }
          res[i] = bytearray[startByte + i] << bitOffset | tail;
      }
      return res;
  }

  var BitArray = function () {
      function BitArray(src) {
          classCallCheck(this, BitArray);

          this.src = new DataView(src.buffer, src.byteOffset, src.byteLength);
          this.bitpos = 0;
          this.byte = this.src.getUint8(0); /* This should really be undefined, uint wont allow it though */
          this.bytepos = 0;
      }

      createClass(BitArray, [{
          key: "readBits",
          value: function readBits(length) {
              if (32 < (length | 0) || 0 === (length | 0)) {
                  /* To big for an uint */
                  throw new Error("too big");
              }

              var result = 0;
              for (var i = length; i > 0; --i) {

                  /* Shift result one left to make room for another bit,
                   then add the next bit on the stream. */
                  result = (result | 0) << 1 | (this.byte | 0) >> 8 - ++this.bitpos & 0x01;
                  if ((this.bitpos | 0) >= 8) {
                      this.byte = this.src.getUint8(++this.bytepos);
                      this.bitpos &= 0x7;
                  }
              }

              return result;
          }
      }, {
          key: "skipBits",
          value: function skipBits(length) {
              this.bitpos += (length | 0) & 0x7; // %8
              this.bytepos += (length | 0) >>> 3; // *8
              if (this.bitpos > 7) {
                  this.bitpos &= 0x7;
                  ++this.bytepos;
              }

              if (!this.finished()) {
                  this.byte = this.src.getUint8(this.bytepos);
                  return 0;
              } else {
                  return this.bytepos - this.src.byteLength - this.src.bitpos;
              }
          }
      }, {
          key: "finished",
          value: function finished() {
              return this.bytepos >= this.src.byteLength;
          }
      }]);
      return BitArray;
  }();

  var NALU = function () {
      createClass(NALU, null, [{
          key: 'type',
          value: function type(nalu) {
              if (nalu.ntype in NALU.TYPES) {
                  return NALU.TYPES[nalu.ntype];
              } else {
                  return 'UNKNOWN';
              }
          }
      }, {
          key: 'NDR',
          get: function get() {
              return 1;
          }
      }, {
          key: 'IDR',
          get: function get() {
              return 5;
          }
      }, {
          key: 'SEI',
          get: function get() {
              return 6;
          }
      }, {
          key: 'SPS',
          get: function get() {
              return 7;
          }
      }, {
          key: 'PPS',
          get: function get() {
              return 8;
          }
      }, {
          key: 'STAP_A',
          get: function get() {
              return 24;
          }
      }, {
          key: 'STAP_B',
          get: function get() {
              return 25;
          }
      }, {
          key: 'FU_A',
          get: function get() {
              return 28;
          }
      }, {
          key: 'FU_B',
          get: function get() {
              return 29;
          }
      }, {
          key: 'TYPES',
          get: function get() {
              var _ref;

              return _ref = {}, defineProperty(_ref, NALU.IDR, 'IDR'), defineProperty(_ref, NALU.SEI, 'SEI'), defineProperty(_ref, NALU.SPS, 'SPS'), defineProperty(_ref, NALU.PPS, 'PPS'), defineProperty(_ref, NALU.NDR, 'NDR'), _ref;
          }
      }]);

      function NALU(ntype, nri, data, dts, pts) {
          classCallCheck(this, NALU);


          this.data = data;
          this.ntype = ntype;
          this.nri = nri;
          this.dts = dts;
          this.pts = pts ? pts : this.dts;
      }

      createClass(NALU, [{
          key: 'appendData',
          value: function appendData(idata) {
              this.data = appendByteArray(this.data, idata);
          }
      }, {
          key: 'toString',
          value: function toString() {
              return NALU.type(this) + '(' + this.data.byteLength + '): NRI: ' + this.getNri() + ', PTS: ' + this.pts + ', DTS: ' + this.dts;
          }
      }, {
          key: 'getNri',
          value: function getNri() {
              return this.nri >> 5;
          }
      }, {
          key: 'type',
          value: function type() {
              return this.ntype;
          }
      }, {
          key: 'isSpsPps',
          value: function isSpsPps() {
              return this.ntype == NALU.SPS || this.ntype == NALU.PPS;
          }
      }, {
          key: 'isKeyframe',
          value: function isKeyframe() {
              return this.ntype == NALU.IDR;
          }
      }, {
          key: 'isDataType',
          value: function isDataType() {
              return this.ntype == NALU.NDR || this.ntype == NALU.IDR || this.ntype == NALU.SEI;
              // return this.ntype == NALU.NDR || this.ntype == NALU.IDR;
          }
      }, {
          key: 'isSEI',
          value: function isSEI() {
              return this.ntype == NALU.SEI;
          }
      }, {
          key: 'getSize',
          value: function getSize() {
              return 4 + 1 + this.data.byteLength;
          }
      }, {
          key: 'getData',
          value: function getData() {
              var header = new Uint8Array(5 + this.data.byteLength);
              var view = new DataView(header.buffer);
              view.setUint32(0, this.data.byteLength + 1);
              view.setUint8(4, 0x0 & 0x80 | this.nri & 0x60 | this.ntype & 0x1F);
              header.set(this.data, 5);
              return header;
          }

          // from joy4

      }, {
          key: 'getRBSPData',
          value: function getRBSPData() {
              var length = this.data.byteLength;
              var src = this.data;
              var i = 0;
              for (; i + 1 < length; i += 2) {
                  if (src[i] != 0) {
                      continue;
                  }
                  if (i > 0 && src[i - 1] == 0) {
                      i--;
                  }
                  // STARTCODE_TEST
                  if (i + 2 < length && src[i + 1] == 0 && src[i + 2] <= 3) {
                      if (src[i + 2] != 3 && src[i + 2] != 0) {
                          // startcode, so we must be past the end
                          length = i;
                      }
                      break;
                  }
              }

              if (i >= length - 1) {
                  return this.data.slice(0, length);
              }
              var buf = new ArrayBuffer(length);
              var dst = new Uint8Array(buf);
              for (var t = 0; t < i; t++) {
                  dst[t] = src[t];
              }
              var si = i;
              var di = i;
              while (si + 2 < length) {
                  if (src[si + 2] > 3) {
                      dst[di++] = src[si++];
                      dst[di++] = src[si++];
                  } else if (src[si] == 0 && src[si + 1] == 0 && src[si + 2] != 0) {
                      if (src[si + 2] == 3) {
                          // escape
                          dst[di++] = 0;
                          dst[di++] = 0;
                          si += 3;
                          continue;
                      } else {
                          // next start code
                          return new Uint8Array(buf, 0, di);
                      }
                  }
                  dst[di++] = src[si++];
              }
              while (si < length) {
                  dst[di++] = src[si++];
              }
              return new Uint8Array(buf, 0, di);
          }
      }]);
      return NALU;
  }();

  var SEIMessage = function () {
      createClass(SEIMessage, null, [{
          key: 'SEI_TYPE_USER_DATA_UNREGISTERED',
          get: function get() {
              return 5;
          }
      }]);

      function SEIMessage(rbsp) {
          classCallCheck(this, SEIMessage);

          this._rbsp = rbsp;
          this._parse();
      }

      createClass(SEIMessage, [{
          key: '_parse',
          value: function _parse() {
              var decoder = new ExpGolomb(this._rbsp);
              this._payloadType = SEIMessage.readFFLongUint(decoder);
              this._payloadSize = SEIMessage.readFFLongUint(decoder);
              // read remaining
              this._payload = new Uint8Array(this._payloadSize);
              for (var i = 0; i < this._payloadSize; i++) {
                  this._payload[i] = decoder.readUByte();
              }
          }
      }, {
          key: 'payloadType',
          get: function get() {
              return this._payloadType;
          }
      }, {
          key: 'payload',
          get: function get() {
              return this._payload;
          }
      }, {
          key: 'rbsp',
          get: function get() {
              return this._rbsp;
          }
      }, {
          key: 'payloadSize',
          get: function get() {
              return this._payloadSize;
          }
      }], [{
          key: 'readFFLongUint',
          value: function readFFLongUint(r) {
              var v = 0;
              var b = 0;
              b = r.readUByte();
              while (b === 255) {
                  v += b;
                  b = r.readUByte();
              }
              v += b;
              return v;
          }
      }]);
      return SEIMessage;
  }();

  var H264Parser = function () {
      function H264Parser(remuxer) {
          classCallCheck(this, H264Parser);

          this.remuxer = remuxer;
          this.track = remuxer.mp4track;
          this.seenIDR = false;
          this.headerSPS = null;
          this.headerPPS = null;
      }

      createClass(H264Parser, [{
          key: 'msToScaled',
          value: function msToScaled(timestamp) {
              return (timestamp - this.remuxer.timeOffset) * this.remuxer.scaleFactor;
          }
      }, {
          key: 'setHeaderSPS',
          value: function setHeaderSPS(sps) {
              this.headerSPS = sps;
          }
      }, {
          key: 'setHeaderPPS',
          value: function setHeaderPPS(pps) {
              this.headerPPS = pps;
          }
      }, {
          key: 'parseSPS',
          value: function parseSPS(sps) {
              var config = H264Parser.readSPS(new Uint8Array(sps));

              this.track.width = config.width;
              this.track.height = config.height;
              this.track.sps = [new Uint8Array(sps)];
              // this.track.timescale = this.remuxer.timescale;
              // this.track.duration = this.remuxer.timescale; // TODO: extract duration for non-live client
              this.track.codec = 'avc1.';

              var codecarray = new DataView(sps.buffer, sps.byteOffset + 1, 4);
              for (var i = 0; i < 3; ++i) {
                  var h = codecarray.getUint8(i).toString(16);
                  if (h.length < 2) {
                      h = '0' + h;
                  }
                  this.track.codec += h;
              }
              // this.track.codec = 'avc1.64002a'
          }
      }, {
          key: 'parsePPS',
          value: function parsePPS(pps) {
              this.track.pps = [new Uint8Array(pps)];
          }
      }, {
          key: 'checkReady',
          value: function checkReady() {
              if (!this.remuxer.readyToDecode && this.track.pps && this.track.sps) {
                  this.remuxer.readyToDecode = true;
              }
          }
      }, {
          key: 'parseNAL',
          value: function parseNAL(unit) {
              if (!unit) return false;

              var push = false;
              var sprops = false;
              switch (unit.type()) {
                  case NALU.NDR:
                      push = this.seenIDR;
                      break;
                  case NALU.IDR:
                      // if no SPS/PPS before IDR, use SDP sprops
                      if (!this.track.pps && this.headerPPS) {
                          this.parsePPS(this.headerPPS);
                      }
                      if (!this.track.sps && this.headerSPS) {
                          this.parseSPS(this.headerSPS);
                      }
                      this.checkReady();

                      this.seenIDR = true;
                      push = true;
                      break;
                  case NALU.PPS:
                      if (!this.track.pps) {
                          this.parsePPS(unit.getData().subarray(4));
                          this.checkReady();
                      }
                      sprops = true;
                      break;
                  case NALU.SPS:
                      if (!this.track.sps) {
                          this.parseSPS(unit.getData().subarray(4));
                          this.checkReady();
                      }
                      sprops = true;
                      break;
                  case NALU.SEI:
                      break;
                  default:
              }
              // write SPS/PPS to MP4 is not allowed in chrome
              if (unit.getNri() > 0 && !sprops) {
                  push = true;
              }
              return push;
          }

          /**
           * Advance the ExpGolomb decoder past a scaling list. The scaling
           * list is optionally transmitted as part of a sequence parameter
           * set and is not relevant to transmuxing.
           * @param decoder {ExpGolomb} exp golomb decoder
           * @param count {number} the number of entries in this scaling list
           * @see Recommendation ITU-T H.264, Section 7.3.2.1.1.1
           */

      }], [{
          key: 'skipScalingList',
          value: function skipScalingList(decoder, count) {
              var lastScale = 8,
                  nextScale = 8,
                  deltaScale = void 0;
              for (var j = 0; j < count; j++) {
                  if (nextScale !== 0) {
                      deltaScale = decoder.readEG();
                      nextScale = (lastScale + deltaScale + 256) % 256;
                  }
                  lastScale = nextScale === 0 ? lastScale : nextScale;
              }
          }

          /**
           * Read a sequence parameter set and return some interesting video
           * properties. A sequence parameter set is the H264 metadata that
           * describes the properties of upcoming video frames.
           * @param data {Uint8Array} the bytes of a sequence parameter set
           * @return {object} an object with configuration parsed from the
           * sequence parameter set, including the dimensions of the
           * associated video frames.
           */

      }, {
          key: 'readSPS',
          value: function readSPS(data) {
              var decoder = new ExpGolomb(data);
              var frameCropLeftOffset = 0,
                  frameCropRightOffset = 0,
                  frameCropTopOffset = 0,
                  frameCropBottomOffset = 0,
                  sarScale = 1,
                  profileIdc = void 0,
                  profileCompat = void 0,
                  levelIdc = void 0,
                  numRefFramesInPicOrderCntCycle = void 0,
                  picWidthInMbsMinus1 = void 0,
                  picHeightInMapUnitsMinus1 = void 0,
                  frameMbsOnlyFlag = void 0,
                  scalingListCount = void 0;
              decoder.readUByte();
              profileIdc = decoder.readUByte(); // profile_idc
              profileCompat = decoder.readBits(5); // constraint_set[0-4]_flag, u(5)
              decoder.skipBits(3); // reserved_zero_3bits u(3),
              levelIdc = decoder.readUByte(); //level_idc u(8)
              decoder.skipUEG(); // seq_parameter_set_id
              // some profiles have more optional data we don't need
              if (profileIdc === 100 || profileIdc === 110 || profileIdc === 122 || profileIdc === 244 || profileIdc === 44 || profileIdc === 83 || profileIdc === 86 || profileIdc === 118 || profileIdc === 128) {
                  var chromaFormatIdc = decoder.readUEG();
                  if (chromaFormatIdc === 3) {
                      decoder.skipBits(1); // separate_colour_plane_flag
                  }
                  decoder.skipUEG(); // bit_depth_luma_minus8
                  decoder.skipUEG(); // bit_depth_chroma_minus8
                  decoder.skipBits(1); // qpprime_y_zero_transform_bypass_flag
                  if (decoder.readBoolean()) {
                      // seq_scaling_matrix_present_flag
                      scalingListCount = chromaFormatIdc !== 3 ? 8 : 12;
                      for (var i = 0; i < scalingListCount; ++i) {
                          if (decoder.readBoolean()) {
                              // seq_scaling_list_present_flag[ i ]
                              if (i < 6) {
                                  H264Parser.skipScalingList(decoder, 16);
                              } else {
                                  H264Parser.skipScalingList(decoder, 64);
                              }
                          }
                      }
                  }
              }
              decoder.skipUEG(); // log2_max_frame_num_minus4
              var picOrderCntType = decoder.readUEG();
              if (picOrderCntType === 0) {
                  decoder.readUEG(); //log2_max_pic_order_cnt_lsb_minus4
              } else if (picOrderCntType === 1) {
                  decoder.skipBits(1); // delta_pic_order_always_zero_flag
                  decoder.skipEG(); // offset_for_non_ref_pic
                  decoder.skipEG(); // offset_for_top_to_bottom_field
                  numRefFramesInPicOrderCntCycle = decoder.readUEG();
                  for (var _i = 0; _i < numRefFramesInPicOrderCntCycle; ++_i) {
                      decoder.skipEG(); // offset_for_ref_frame[ i ]
                  }
              }
              decoder.skipUEG(); // max_num_ref_frames
              decoder.skipBits(1); // gaps_in_frame_num_value_allowed_flag
              picWidthInMbsMinus1 = decoder.readUEG();
              picHeightInMapUnitsMinus1 = decoder.readUEG();
              frameMbsOnlyFlag = decoder.readBits(1);
              if (frameMbsOnlyFlag === 0) {
                  decoder.skipBits(1); // mb_adaptive_frame_field_flag
              }
              decoder.skipBits(1); // direct_8x8_inference_flag
              if (decoder.readBoolean()) {
                  // frame_cropping_flag
                  frameCropLeftOffset = decoder.readUEG();
                  frameCropRightOffset = decoder.readUEG();
                  frameCropTopOffset = decoder.readUEG();
                  frameCropBottomOffset = decoder.readUEG();
              }
              if (decoder.readBoolean()) {
                  // vui_parameters_present_flag
                  if (decoder.readBoolean()) {
                      // aspect_ratio_info_present_flag
                      var sarRatio = void 0;
                      var aspectRatioIdc = decoder.readUByte();
                      switch (aspectRatioIdc) {
                          case 1:
                              sarRatio = [1, 1];break;
                          case 2:
                              sarRatio = [12, 11];break;
                          case 3:
                              sarRatio = [10, 11];break;
                          case 4:
                              sarRatio = [16, 11];break;
                          case 5:
                              sarRatio = [40, 33];break;
                          case 6:
                              sarRatio = [24, 11];break;
                          case 7:
                              sarRatio = [20, 11];break;
                          case 8:
                              sarRatio = [32, 11];break;
                          case 9:
                              sarRatio = [80, 33];break;
                          case 10:
                              sarRatio = [18, 11];break;
                          case 11:
                              sarRatio = [15, 11];break;
                          case 12:
                              sarRatio = [64, 33];break;
                          case 13:
                              sarRatio = [160, 99];break;
                          case 14:
                              sarRatio = [4, 3];break;
                          case 15:
                              sarRatio = [3, 2];break;
                          case 16:
                              sarRatio = [2, 1];break;
                          case 255:
                              {
                                  sarRatio = [decoder.readUByte() << 8 | decoder.readUByte(), decoder.readUByte() << 8 | decoder.readUByte()];
                                  break;
                              }
                      }
                      if (sarRatio) {
                          sarScale = sarRatio[0] / sarRatio[1];
                      }
                  }
                  if (decoder.readBoolean()) {
                      decoder.skipBits(1);
                  }

                  if (decoder.readBoolean()) {
                      decoder.skipBits(4);
                      if (decoder.readBoolean()) {
                          decoder.skipBits(24);
                      }
                  }
                  if (decoder.readBoolean()) {
                      decoder.skipUEG();
                      decoder.skipUEG();
                  }
                  if (decoder.readBoolean()) {
                      var unitsInTick = decoder.readUInt();
                      var timeScale = decoder.readUInt();
                      var fixedFrameRate = decoder.readBoolean();
                      var frameDuration = timeScale / (2 * unitsInTick);
                      console.log('h264: timescale: ' + timeScale + '; unitsInTick: ' + unitsInTick + '; fixedFramerate: ' + fixedFrameRate + '; avgFrameDuration: ' + frameDuration);
                  }
              }
              return {
                  width: Math.ceil(((picWidthInMbsMinus1 + 1) * 16 - frameCropLeftOffset * 2 - frameCropRightOffset * 2) * sarScale),
                  height: (2 - frameMbsOnlyFlag) * (picHeightInMapUnitsMinus1 + 1) * 16 - (frameMbsOnlyFlag ? 2 : 4) * (frameCropTopOffset + frameCropBottomOffset)
              };
          }
      }, {
          key: 'readSliceType',
          value: function readSliceType(decoder) {
              // skip NALu type
              decoder.readUByte();
              // discard first_mb_in_slice
              decoder.readUEG();
              // return slice_type
              return decoder.readUEG();
          }
      }]);
      return H264Parser;
  }();

  var Log$4 = getTagged("remuxer:h264");
  // TODO: asm.js
  var H264Remuxer = function (_BaseRemuxer) {
      inherits(H264Remuxer, _BaseRemuxer);

      function H264Remuxer(timescale) {
          var scaleFactor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
          classCallCheck(this, H264Remuxer);

          var _this = possibleConstructorReturn(this, (H264Remuxer.__proto__ || Object.getPrototypeOf(H264Remuxer)).call(this, timescale, scaleFactor));

          _this.nextDts = undefined;
          _this.readyToDecode = false;
          _this.initialized = false;

          _this.firstDTS = 0;
          _this.firstPTS = 0;
          _this.lastDTS = undefined;
          _this.lastSampleDuration = 0;
          _this.lastDurations = [];
          // this.timescale = 90000;
          _this.tsAlign = Math.round(_this.timescale / 60);

          _this.mp4track = {
              id: BaseRemuxer.getTrackID(),
              type: 'video',
              len: 0,
              fragmented: true,
              sps: '',
              pps: '',
              width: 0,
              height: 0,
              timescale: timescale,
              duration: timescale,
              samples: []
          };
          _this.samples = [];
          _this.lastGopDTS = -99999999999999;
          _this.gop = [];
          _this.foundIDR = false;
          _this.offset = 0;

          _this.h264 = new H264Parser(_this);

          // check NAL type for buggy camera
          if (params.sps) {
              var arr = new Uint8Array(params.sps);
              if ((arr[0] & 0x1f) == 7) {
                  _this.setSPS(arr);
              } else {
                  console.log("bad SPS in SDP");
              }
          }
          if (params.pps) {
              var _arr = new Uint8Array(params.pps);
              if ((_arr[0] & 0x1f) == 8) {
                  _this.setPPS(_arr);
              } else {
                  console.log("bad PPS in SDP");
              }
          }

          if (_this.mp4track.pps && _this.mp4track.sps) {
              _this.readyToDecode = true;
          }
          return _this;
      }

      createClass(H264Remuxer, [{
          key: '_scaled',
          value: function _scaled(timestamp) {
              return timestamp >>> this.scaleFactor;
          }
      }, {
          key: '_unscaled',
          value: function _unscaled(timestamp) {
              return timestamp << this.scaleFactor;
          }
      }, {
          key: 'setSPS',
          value: function setSPS(sps) {
              this.h264.setHeaderSPS(sps);
          }
      }, {
          key: 'setPPS',
          value: function setPPS(pps) {
              this.h264.setHeaderPPS(pps);
          }
      }, {
          key: 'remuxSEI',
          value: function remuxSEI(nalu) {
              try {
                  var sei = new SEIMessage(nalu.getRBSPData());
                  // console.log(sei)
                  this.sendOOBData({
                      codec: "h264",
                      type: "sei",
                      subtype: sei.payloadType,
                      payload: sei.payload,
                      dts: nalu.dts,
                      pts: nalu.pts,
                      scaledPTS: nalu.pts / this.timescale,
                      foundIDR: this.foundIDR
                  });
              } catch (e) {
                  console.log('Bad SEI: ', nalu, e);
              }
          }
      }, {
          key: 'remuxNalu',
          value: function remuxNalu(nalu) {
              if (this.lastGopDTS < nalu.dts) {
                  this.gop.sort(BaseRemuxer.dtsSortFunc);
                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                      for (var _iterator = this.gop[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var unit = _step.value;

                          if (unit.ntype == NALU.IDR) {
                              this.foundIDR = true;
                          }
                          if (get(H264Remuxer.prototype.__proto__ || Object.getPrototypeOf(H264Remuxer.prototype), 'remux', this).call(this, unit)) {
                              this.mp4track.len += unit.getSize();
                          }
                          // console.log("push sample dts: ", nalu.dts, " pts: ", nalu.pts);
                      }
                  } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                          }
                      } finally {
                          if (_didIteratorError) {
                              throw _iteratorError;
                          }
                      }
                  }

                  this.gop = [];
                  this.lastGopDTS = nalu.dts;
              }

              if (this.h264.parseNAL(nalu)) {
                  this.gop.push(nalu);
              }
          }

          // ensure dts <= pts and dts >= last dts before this call

      }, {
          key: 'remux',
          value: function remux(nalu) {
              if (nalu.type() === NALU.SEI) {
                  this.remuxSEI(nalu);
              } else {
                  this.remuxNalu(nalu);
              }
          }
      }, {
          key: 'getPayload',
          value: function getPayload() {
              if (!this.getPayloadBase()) {
                  return null;
              }

              var payload = new Uint8Array(this.mp4track.len);
              var offset = 0;
              var samples = this.mp4track.samples;
              var mp4Sample = void 0,
                  lastDTS = void 0,
                  pts = void 0,
                  dts = void 0;

              // Log.debug(this.samples.map((e)=>{
              //     return Math.round((e.dts - this.initDTS));
              // }));

              // let minDuration = Number.MAX_SAFE_INTEGER;
              while (this.samples.length) {
                  var sample = this.samples.shift();
                  if (sample === null) {
                      // discontinuity
                      this.nextDts = undefined;
                      break;
                  }

                  var unit = sample.unit;

                  pts = sample.pts + this.offset;
                  dts = sample.dts + this.offset;
                  if (dts < lastDTS) {
                      this.offset = this.offset + lastDTS - dts;
                      pts = sample.pts + this.offset;
                      dts = sample.dts + this.offset;
                  }
                  // ensure DTS is not bigger than PTS
                  // dts = Math.min(pts, dts);
                  // if not first AVC sample of video track, normalize PTS/DTS with previous sample value
                  // and ensure that sample duration is positive
                  if (lastDTS !== undefined) {
                      var sampleDuration = this.scaled(dts - lastDTS);
                      // Log.debug(`Sample duration: ${sampleDuration}`);
                      if (sampleDuration < 0) {
                          Log$4.log('invalid AVC sample duration at PTS/DTS: ' + pts + '/' + dts + '|lastDTS: ' + lastDTS + ':' + sampleDuration);
                          this.mp4track.len -= unit.getSize();
                          continue;
                      }
                      // minDuration = Math.min(sampleDuration, minDuration);
                      this.lastDurations.push(sampleDuration);
                      if (this.lastDurations.length > 100) {
                          this.lastDurations.shift();
                      }
                      mp4Sample.duration = sampleDuration;
                  } else {
                      if (this.nextDts) {
                          var delta = dts - this.nextDts;
                          // if fragment are contiguous, or delta less than 600ms, ensure there is no overlap/hole between fragments
                          if ( /*contiguous ||*/Math.abs(Math.round(BaseRemuxer.toMS(delta))) < 600) {

                              if (delta) {
                                  // set DTS to next DTS
                                  // Log.debug(`Video/PTS/DTS adjusted: ${pts}->${Math.max(pts - delta, this.nextDts)}/${dts}->${this.nextDts},delta:${delta}`);
                                  dts = this.nextDts;
                                  // offset PTS as well, ensure that PTS is smaller or equal than new DTS
                                  pts = Math.max(pts - delta, dts);
                              }
                          } else {
                              if (delta < 0) {
                                  Log$4.log('skip frame from the past at DTS=' + dts + ' with expected DTS=' + this.nextDts);
                                  this.mp4track.len -= unit.getSize();
                                  continue;
                              }
                          }
                      }
                      // remember first DTS of our avcSamples, ensure value is positive
                      this.firstDTS = Math.max(0, dts);
                  }

                  mp4Sample = {
                      size: unit.getSize(),
                      duration: 0,
                      cts: this.scaled(pts - dts),
                      flags: {
                          isLeading: 0,
                          isDependedOn: 0,
                          hasRedundancy: 0,
                          degradPrio: 0
                      }
                  };
                  var flags = mp4Sample.flags;
                  if (sample.unit.isKeyframe() === true) {
                      // the current sample is a key frame
                      flags.dependsOn = 2;
                      flags.isNonSync = 0;
                  } else {
                      flags.dependsOn = 1;
                      flags.isNonSync = 1;
                  }

                  payload.set(unit.getData(), offset);
                  offset += unit.getSize();

                  samples.push(mp4Sample);
                  lastDTS = dts;
              }

              if (!samples.length) return null;

              var avgDuration = this.lastDurations.reduce(function (a, b) {
                  return (a | 0) + (b | 0);
              }, 0) / (this.lastDurations.length || 1) | 0;
              if (samples.length >= 2) {
                  this.lastSampleDuration = avgDuration;
                  mp4Sample.duration = avgDuration;
              } else {
                  mp4Sample.duration = this.lastSampleDuration;
              }

              if (samples.length && (!this.nextDts || navigator.userAgent.toLowerCase().indexOf('chrome') > -1)) {
                  var _flags = samples[0].flags;
                  // chrome workaround, mark first sample as being a Random Access Point to avoid sourcebuffer append issue
                  // https://code.google.com/p/chromium/issues/detail?id=229412
                  _flags.dependsOn = 2;
                  _flags.isNonSync = 0;
              }

              // next AVC sample DTS should be equal to last sample DTS + last sample duration
              this.nextDts = dts + this.unscaled(this.lastSampleDuration);
              // Log.debug(`next dts: ${this.nextDts}, last duration: ${this.lastSampleDuration}, last dts: ${dts}`);

              return new Uint8Array(payload.buffer, 0, this.mp4track.len);
          }
      }]);
      return H264Remuxer;
  }(BaseRemuxer);

  var StreamType = function () {
      function StreamType() {
          classCallCheck(this, StreamType);
      }

      createClass(StreamType, null, [{
          key: 'VIDEO',
          get: function get() {
              return 1;
          }
      }, {
          key: 'AUDIO',
          get: function get() {
              return 2;
          }
      }, {
          key: 'map',
          get: function get() {
              var _ref;

              return _ref = {}, defineProperty(_ref, StreamType.VIDEO, 'video'), defineProperty(_ref, StreamType.AUDIO, 'audio'), _ref;
          }
      }]);
      return StreamType;
  }();

  var PayloadType = function () {
      function PayloadType() {
          classCallCheck(this, PayloadType);
      }

      createClass(PayloadType, null, [{
          key: 'H264',
          get: function get() {
              return 1;
          }
      }, {
          key: 'AAC',
          get: function get() {
              return 2;
          }
      }, {
          key: 'map',
          get: function get() {
              var _ref2;

              return _ref2 = {}, defineProperty(_ref2, PayloadType.H264, 'video'), defineProperty(_ref2, PayloadType.AAC, 'audio'), _ref2;
          }
      }, {
          key: 'string_map',
          get: function get() {
              return {
                  H264: PayloadType.H264,
                  AAC: PayloadType.AAC,
                  'MP4A-LATM': PayloadType.AAC,
                  'MPEG4-GENERIC': PayloadType.AAC
              };
          }
      }]);
      return PayloadType;
  }();

  var AACParser = function () {
      function AACParser() {
          classCallCheck(this, AACParser);
      }

      createClass(AACParser, null, [{
          key: 'parseAudioSpecificConfig',


          // static Profile = [
          //     0: Null
          //     1: AAC Main
          //     2: AAC LC (Low Complexity)
          //     3: AAC SSR (Scalable Sample Rate)
          //     4: AAC LTP (Long Term Prediction)
          //     5: SBR (Spectral Band Replication)
          //     6: AAC Scalable
          // ]

          value: function parseAudioSpecificConfig(bytesOrBits) {
              var config = void 0;
              if (bytesOrBits.byteLength) {
                  // is byteArray
                  config = new BitArray(bytesOrBits);
              } else {
                  config = bytesOrBits;
              }

              var bitpos = config.bitpos + (config.src.byteOffset + config.bytepos) * 8;
              var prof = config.readBits(5);
              this.codec = 'mp4a.40.' + prof;
              var sfi = config.readBits(4);
              if (sfi == 0xf) config.skipBits(24);
              var channels = config.readBits(4);

              return {
                  config: bitSlice(new Uint8Array(config.src.buffer), bitpos, bitpos + 16),
                  codec: 'mp4a.40.' + prof,
                  samplerate: AACParser.SampleRates[sfi],
                  channels: channels
              };
          }
      }, {
          key: 'parseStreamMuxConfig',
          value: function parseStreamMuxConfig(bytes) {
              // ISO_IEC_14496-3 Part 3 Audio. StreamMuxConfig
              var config = new BitArray(bytes);

              if (!config.readBits(1)) {
                  config.skipBits(14);
                  return AACParser.parseAudioSpecificConfig(config);
              }
          }
      }, {
          key: 'SampleRates',
          get: function get() {
              return [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
          }
      }]);
      return AACParser;
  }();

  var AACFrame = function () {
      function AACFrame(data, dts, pts) {
          classCallCheck(this, AACFrame);

          this.dts = dts;
          this.pts = pts ? pts : this.dts;

          this.data = data; //.subarray(offset);
      }

      createClass(AACFrame, [{
          key: "getData",
          value: function getData() {
              return this.data;
          }
      }, {
          key: "getSize",
          value: function getSize() {
              return this.data.byteLength;
          }
      }]);
      return AACFrame;
  }();

  var LOG_TAG$1 = "remuxer";
  var Log$5 = getTagged(LOG_TAG$1);

  var _REMUXER_UNINITED = 0;
  var _REMUXER_INITILIZING = 1;
  var _REMUXER_RUNNING = 2;
  var _REMUXER_DESTROYED = 3;

  var Remuxer = function () {
      createClass(Remuxer, null, [{
          key: "TrackConverters",
          get: function get() {
              var _ref;

              return _ref = {}, defineProperty(_ref, PayloadType.H264, H264Remuxer), defineProperty(_ref, PayloadType.AAC, AACRemuxer), _ref;
          }
      }, {
          key: "TrackScaleFactor",
          get: function get() {
              var _ref2;

              return _ref2 = {}, defineProperty(_ref2, PayloadType.H264, 1), defineProperty(_ref2, PayloadType.AAC, 0), _ref2;
          }
      }, {
          key: "TrackTimescale",
          get: function get() {
              var _ref3;

              return _ref3 = {}, defineProperty(_ref3, PayloadType.H264, 90000), defineProperty(_ref3, PayloadType.AAC, 0), _ref3;
          }
      }]);

      function Remuxer(mediaElement) {
          var _this = this;

          classCallCheck(this, Remuxer);

          this.mse = new MSE([mediaElement]);
          this.eventSource = new EventEmitter();
          this.mseEventSource = new EventSourceWrapper(this.mse.eventSource);

          this._reset();

          this.errorListener = this._mseClose.bind(this);
          this.closeListener = this._mseClose.bind(this);

          this._initMSEHandlers();

          this._oobBuffer = new CircularBuffer(1000);
          this._oobHandler = function (data) {
              if (_this._oobBuffer.size() == _this._oobBuffer.capacity()) {
                  _this._oobBuffer.deq();
              }
              _this._oobBuffer.enq(data);
          };
      }

      createClass(Remuxer, [{
          key: "pullOOBData",
          value: function pullOOBData(curPTS) {
              var ev = [];
              while (this._oobBuffer.size()) {
                  var e = this._oobBuffer.get(this._oobBuffer.size() - 1);
                  if (curPTS < e.scaledPTS) {
                      // console.log("curPTS", curPTS, "scaledPTS", e.scaledPTS, this._oobBuffer.size());
                      break;
                  }
                  ev.push(this._oobBuffer.deq());
              }
              // console.log("_oobBuffer.size()", this._oobBuffer.size(), "ev.length ", ev.length);
              return ev;
          }
      }, {
          key: "_initMSEHandlers",
          value: function _initMSEHandlers() {
              this.mseEventSource.on('error', this.errorListener);
              this.mseEventSource.on('sourceclosed', this.closeListener);
          }
      }, {
          key: "_reset",
          value: function _reset() {
              this.tracks = {};
              this._status = _REMUXER_UNINITED;
              this.initSegments = {};
              this.codecs = [];
              this.streams = {};
              this.enabled = false;
              this._silentDts = 0;
              this._enableSilentAAC = false;
              Log$5.debug("reset remuxer");
              // await this.mse.clear();
          }
      }, {
          key: "destroy",
          value: function destroy() {
              Log$5.debug("destroy remuxer");
              this._status = _REMUXER_DESTROYED;

              this.mseEventSource.destroy();
              this.mse.destroy();
              this.mse = null;

              this.detachClient();

              this.eventSource.destroy();
          }
      }, {
          key: "_onTracks",
          value: function _onTracks(tracks) {
              Log$5.debug("tracks: ", tracks.detail);
              // store available track types
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = tracks.detail[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var track = _step.value;

                      this.tracks[track.type] = new Remuxer.TrackConverters[track.type](Remuxer.TrackTimescale[track.type], Remuxer.TrackScaleFactor[track.type], track.params);
                      if (track.offset) {
                          this.tracks[track.type].timeOffset = track.offset;
                      }
                      if (track.duration) {
                          this.tracks[track.type].mp4track.duration = track.duration * (this.tracks[track.type].timescale || Remuxer.TrackTimescale[track.type]);
                          this.tracks[track.type].duration = track.duration;
                      } else {
                          this.tracks[track.type].duration = 0;
                      }
                      if (track.type === PayloadType.H264) {
                          this.tracks[track.type].setOOBDataHandler(this._oobHandler);
                      }

                      // this.tracks[track.type].duration
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              this._setupSilentAAC();
              this.mse.setLive(!this.client.seekable);
          }
      }, {
          key: "setTimeOffset",
          value: function setTimeOffset(timeOffset, track) {
              if (this.tracks[track.type]) {
                  this.tracks[track.type].timeOffset = timeOffset; ///this.tracks[track.type].scaleFactor;
              }
          }

          // WORKAROUND: Background video track optimizations
          // https://developers.google.com/web/updates/2017/12/chrome-63-64-media-updates#background-video-track-optimizations
          // https://developers.google.com/web/updates/2017/07/chrome-61-media-updates#background-video-track-optimizations
          // But safari 11 will block autoplay of video with audio tracks, See: https://forums.adobe.com/thread/2387411
          //
          // Update:
          // Autoplay policy: https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/

      }, {
          key: "_setupSilentAAC",
          value: function _setupSilentAAC() {
              // if (navigator.userAgent.indexOf("Chrome") === -1){
              //     return;
              // }
              if (this.tracks[PayloadType.AAC]) {
                  return;
              }
              var config = AACParser.parseAudioSpecificConfig(new Uint8Array([0x12, 0x10]));
              var params = {
                  config: config
              };
              Log$5.debug("adding silent AAC track: ", params);
              this.tracks[PayloadType.AAC] = new AACRemuxer(0, 0, params);
              this._enableSilentAAC = true;
          }
      }, {
          key: "_init",
          value: function _init() {
              var _this2 = this;

              Log$5.debug("initializing remuxer");
              return this.mse.attachMediaSource().then(function () {
                  return _this2._initAllCodecs();
              });
          }
      }, {
          key: "_initAllCodecs",
          value: function _initAllCodecs() {
              var _this3 = this;

              Log$5.debug("initialize all codecs");
              var tracks = [];
              this.codecs = [];
              var initmse = [];
              var initPts = Infinity;
              var initDts = Infinity;
              for (var track_type in this.tracks) {
                  var track = this.tracks[track_type];
                  if (!MSE.isSupported([track.mp4track.codec])) {
                      throw new Error(track.mp4track.type + " codec " + track.mp4track.codec + " is not supported");
                  }
                  tracks.push(track.mp4track);
                  this.codecs.push(track.mp4track.codec);
                  track.init(initPts, initDts /*, false*/);
              }

              for (var _track_type in this.tracks) {
                  var _track = this.tracks[_track_type];
                  this.initSegments[_track_type] = MP4.initSegment([_track.mp4track], _track.duration * _track.timescale, _track.timescale);
                  initmse.push(this._initCodec(_track_type, _track.mp4track.codec));
              }
              return Promise.all(initmse).then(function () {
                  _this3.enabled = true;
                  _this3._status = _REMUXER_RUNNING;
              });
          }
      }, {
          key: "_initCodec",
          value: function _initCodec(track_type, codec) {
              var _this4 = this;

              if (MSE.isSupported(this.codecs)) {
                  return this.mse.setCodec(track_type, PayloadType.map[track_type] + "/mp4; codecs=\"" + codec + "\"").then(function () {
                      _this4.mse.feed(track_type, _this4.initSegments[track_type]);
                      // this.mse.play();
                      // this.enabled = true;
                  });
              } else {
                  throw new Error('Codecs are not supported');
              }
          }
      }, {
          key: "_mseClose",
          value: function _mseClose() {
              // this.mse.clear();
              this.client.stop();
              this.eventSource.dispatchEvent('stopped');
          }
      }, {
          key: "flush",
          value: function flush() {
              // console.log("on flush");
              switch (this._status) {
                  case _REMUXER_UNINITED:
                      this._onSamples();
                      if (Object.keys(this.tracks).length) {
                          for (var track_type in this.tracks) {
                              if (!this.tracks[track_type].readyToDecode || !this.tracks[track_type].samples.length) return;
                          }
                          this._status = _REMUXER_INITILIZING;
                          this._init();
                      }
                      return;
                  case _REMUXER_INITILIZING:
                      return;
                  case _REMUXER_RUNNING:
                      this._onSamples();
                      for (var _track_type2 in this.tracks) {
                          var track = this.tracks[_track_type2];
                          var pay = track.getPayload();
                          if (pay && pay.byteLength) {
                              // console.log(track_type, track.seq, track.firstDTS, pay.byteLength);
                              this.mse.feed(_track_type2, [MP4.moof(track.seq, track.scaled(track.firstDTS), track.mp4track), MP4.mdat(pay)]);
                              track.flush();
                          }
                      }
                      return;
                  case _REMUXER_DESTROYED:
                      return;
              }
          }
      }, {
          key: "_remuxSilentAAC",
          value: function _remuxSilentAAC(dts) {
              if (!this.tracks[PayloadType.AAC] || !this._enableSilentAAC) {
                  return;
              }
              var sampleDuration = this.tracks[PayloadType.AAC].expectedSampleDuration;
              // preload a little bit to avoid audio buffer drain
              while (this._silentDts < dts + 2 * sampleDuration) {
                  var silent = new Uint8Array([0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80]);
                  this.tracks[PayloadType.AAC].remux(new AACFrame(silent, this._silentDts));
                  this._silentDts += sampleDuration;
              }
          }
      }, {
          key: "_onSamples",
          value: function _onSamples(ev) {
              // TODO: check format
              // let data = ev.detail;
              // if (this.tracks[data.pay] && this.client.sampleQueues[data.pay].length) {
              // console.log(`video ${data.units[0].dts}`);
              for (var qidx in this.client.sampleQueues) {
                  var queue = this.client.sampleQueues[qidx];
                  while (queue.length) {
                      var units = queue.shift();
                      var _iteratorNormalCompletion2 = true;
                      var _didIteratorError2 = false;
                      var _iteratorError2 = undefined;

                      try {
                          for (var _iterator2 = units[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                              var chunk = _step2.value;

                              this.tracks[qidx].remux(chunk);
                              if (!chunk.isSEI()) {
                                  this._remuxSilentAAC(chunk.dts);
                              }
                          }
                      } catch (err) {
                          _didIteratorError2 = true;
                          _iteratorError2 = err;
                      } finally {
                          try {
                              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                  _iterator2.return();
                              }
                          } finally {
                              if (_didIteratorError2) {
                                  throw _iteratorError2;
                              }
                          }
                      }
                  }
              }
              // }
          }
      }, {
          key: "attachClient",
          value: function attachClient(client) {
              this.detachClient();
              this.client = client;
              this.clientEventSource = new EventSourceWrapper(this.client.eventSource);
              this.clientEventSource.on('tracks', this._onTracks.bind(this));
              this.clientEventSource.on('flush', this.flush.bind(this));
              this.clientEventSource.on('reconnected', this._reset.bind(this));
          }
      }, {
          key: "detachClient",
          value: function detachClient() {
              if (this.client) {
                  this.clientEventSource.destroy();
                  // this.client.eventSource.removeEventListener('samples', this.onSamples.bind(this));
                  // this.client.eventSource.removeEventListener('audio_config', this.onAudioConfig.bind(this));
                  // // TODO: clear other listeners
                  // this.client.eventSource.removeEventListener('clear', this._clearListener);
                  // this.client.eventSource.removeEventListener('tracks', this._tracksListener);
                  // this.client.eventSource.removeEventListener('flush', this._flushListener);
                  this.client = null;
              }
          }
      }]);
      return Remuxer;
  }();

  var State = function () {
      function State(name, stateMachine) {
          classCallCheck(this, State);

          this.stateMachine = stateMachine;
          this.transitions = new Set();
          this.name = name;
      }

      createClass(State, [{
          key: "activate",
          value: function activate() {
              return Promise.resolve(null);
          }
      }, {
          key: "finishTransition",
          value: function finishTransition() {}
      }, {
          key: "failHandler",
          value: function failHandler() {}
      }, {
          key: "deactivate",
          value: function deactivate() {
              return Promise.resolve(null);
          }
      }]);
      return State;
  }();

  var StateMachine = function () {
      function StateMachine() {
          classCallCheck(this, StateMachine);

          this.storage = {};
          this.currentState = null;
          this.states = new Map();
      }

      createClass(StateMachine, [{
          key: "addState",
          value: function addState(name, _ref) {
              var activate = _ref.activate,
                  finishTransition = _ref.finishTransition,
                  deactivate = _ref.deactivate;

              var state = new State(name, this);
              if (activate) state.activate = activate;
              if (finishTransition) state.finishTransition = finishTransition;
              if (deactivate) state.deactivate = deactivate;
              this.states.set(name, state);
              return this;
          }
      }, {
          key: "addTransition",
          value: function addTransition(fromName, toName) {
              if (!this.states.has(fromName)) {
                  throw ReferenceError("No such state: " + fromName + " while connecting to " + toName);
              }
              if (!this.states.has(toName)) {
                  throw ReferenceError("No such state: " + toName + " while connecting from " + fromName);
              }
              this.states.get(fromName).transitions.add(toName);
              return this;
          }
      }, {
          key: "_promisify",
          value: function _promisify(res) {
              var promise = void 0;
              try {
                  promise = res;
                  if (!promise.then) {
                      promise = Promise.resolve(promise);
                  }
              } catch (e) {
                  promise = Promise.reject(e);
              }
              return promise;
          }
      }, {
          key: "transitionTo",
          value: function transitionTo(stateName) {
              var _this = this;

              if (this.currentState == null) {
                  var state = this.states.get(stateName);
                  return this._promisify(state.activate.call(this)).then(function (data) {
                      _this.currentState = state;
                      return data;
                  }).then(state.finishTransition.bind(this)).catch(function (e) {
                      state.failHandler();
                      throw e;
                  });
              }
              if (this.currentState.name == stateName) return Promise.resolve();
              if (this.currentState.transitions.has(stateName)) {
                  var _state = this.states.get(stateName);
                  return this._promisify(_state.deactivate.call(this)).then(_state.activate.bind(this)).then(function (data) {
                      _this.currentState = _state;
                      return data;
                  }).then(_state.finishTransition.bind(this)).catch(function (e) {
                      _state.failHandler();
                      throw e;
                  });
              } else {
                  return Promise.reject("No such transition: " + this.currentState.name + " to " + stateName);
              }
          }
      }]);
      return StateMachine;
  }();

  var Log$6 = getTagged("parser:sdp");

  var SDPParser = function () {
      function SDPParser() {
          classCallCheck(this, SDPParser);

          this.version = -1;
          this.origin = null;
          this.sessionName = null;
          this.timing = null;
          this.sessionBlock = {};
          this.media = {};
          this.tracks = {};
          this.mediaMap = {};
      }

      createClass(SDPParser, [{
          key: 'parse',
          value: function parse(content) {
              var _this = this;

              Log$6.debug(content);
              return new Promise(function (resolve, reject) {
                  var dataString = content;
                  var success = true;
                  var currentMediaBlock = _this.sessionBlock;

                  // TODO: multiple audio/video tracks

                  var _iteratorNormalCompletion = true;
                  var _didIteratorError = false;
                  var _iteratorError = undefined;

                  try {
                      for (var _iterator = dataString.split("\n")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                          var line = _step.value;

                          line = line.replace(/\r/, '');
                          if (0 === line.length) {
                              /* Empty row (last row perhaps?), skip to next */
                              continue;
                          }

                          switch (line.charAt(0)) {
                              case 'v':
                                  if (-1 !== _this.version) {
                                      Log$6.log('Version present multiple times in SDP');
                                      reject();
                                      return false;
                                  }
                                  success = success && _this._parseVersion(line);
                                  break;

                              case 'o':
                                  if (null !== _this.origin) {
                                      Log$6.log('Origin present multiple times in SDP');
                                      reject();
                                      return false;
                                  }
                                  success = success && _this._parseOrigin(line);
                                  break;

                              case 's':
                                  if (null !== _this.sessionName) {
                                      Log$6.log('Session Name present multiple times in SDP');
                                      reject();
                                      return false;
                                  }
                                  success = success && _this._parseSessionName(line);
                                  break;

                              case 't':
                                  if (null !== _this.timing) {
                                      Log$6.log('Timing present multiple times in SDP');
                                      reject();
                                      return false;
                                  }
                                  success = success && _this._parseTiming(line);
                                  break;

                              case 'm':
                                  if (null !== currentMediaBlock && _this.sessionBlock !== currentMediaBlock) {
                                      /* Complete previous block and store it */
                                      _this.media[currentMediaBlock.type] = currentMediaBlock;
                                  }

                                  /* A wild media block appears */
                                  currentMediaBlock = {};
                                  currentMediaBlock.rtpmap = {};
                                  _this._parseMediaDescription(line, currentMediaBlock);
                                  break;

                              case 'a':
                                  SDPParser._parseAttribute(line, currentMediaBlock);
                                  break;

                              default:
                                  Log$6.log('Ignored unknown SDP directive: ' + line);
                                  break;
                          }

                          if (!success) {
                              reject();
                              return;
                          }
                      }
                  } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                  } finally {
                      try {
                          if (!_iteratorNormalCompletion && _iterator.return) {
                              _iterator.return();
                          }
                      } finally {
                          if (_didIteratorError) {
                              throw _iteratorError;
                          }
                      }
                  }

                  _this.media[currentMediaBlock.type] = currentMediaBlock;

                  success ? resolve() : reject();
              });
          }
      }, {
          key: '_parseVersion',
          value: function _parseVersion(line) {
              var matches = line.match(/^v=([0-9]+)$/);
              if (!matches || !matches.length) {
                  Log$6.log('\'v=\' (Version) formatted incorrectly: ' + line);
                  return false;
              }

              this.version = matches[1];
              if (0 != this.version) {
                  Log$6.log('Unsupported SDP version:' + this.version);
                  return false;
              }

              return true;
          }
      }, {
          key: '_parseOrigin',
          value: function _parseOrigin(line) {
              var matches = line.match(/^o=([^ ]+) (-?[0-9]+) (-?[0-9]+) (IN) (IP4|IP6) ([^ ]+)$/);
              if (!matches || !matches.length) {
                  Log$6.log('\'o=\' (Origin) formatted incorrectly: ' + line);
                  // Just skip bad Origin.
                  // Dahua bad line: o=RTSP Session 0 0 IN IP4 0.0.0.0
                  this.origin = {};
                  return true;
              }

              this.origin = {};
              this.origin.username = matches[1];
              this.origin.sessionid = matches[2];
              this.origin.sessionversion = matches[3];
              this.origin.nettype = matches[4];
              this.origin.addresstype = matches[5];
              this.origin.unicastaddress = matches[6];

              return true;
          }
      }, {
          key: '_parseSessionName',
          value: function _parseSessionName(line) {
              var matches = line.match(/^s=([^\r\n]+)$/);
              if (!matches || !matches.length) {
                  Log$6.log('\'s=\' (Session Name) formatted incorrectly: ' + line);
                  return false;
              }

              this.sessionName = matches[1];

              return true;
          }
      }, {
          key: '_parseTiming',
          value: function _parseTiming(line) {
              var matches = line.match(/^t=([0-9]+) ([0-9]+)$/);
              if (!matches || !matches.length) {
                  Log$6.log('\'t=\' (Timing) formatted incorrectly: ' + line);
                  return false;
              }

              this.timing = {};
              this.timing.start = matches[1];
              this.timing.stop = matches[2];

              return true;
          }
      }, {
          key: '_parseMediaDescription',
          value: function _parseMediaDescription(line, media) {
              var matches = line.match(/^m=([^ ]+) ([^ ]+) ([^ ]+)[ ]/);
              if (!matches || !matches.length) {
                  Log$6.log('\'m=\' (Media) formatted incorrectly: ' + line);
                  return false;
              }

              media.type = matches[1];
              media.port = matches[2];
              media.proto = matches[3];
              media.fmt = line.substr(matches[0].length).split(' ').map(function (fmt, index, array) {
                  return parseInt(fmt);
              });

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = media.fmt[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var fmt = _step2.value;

                      this.mediaMap[fmt] = media;
                  }
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }

              return true;
          }
      }, {
          key: 'getSessionBlock',
          value: function getSessionBlock() {
              return this.sessionBlock;
          }
      }, {
          key: 'hasMedia',
          value: function hasMedia(mediaType) {
              return this.media[mediaType] != undefined;
          }
      }, {
          key: 'getMediaBlock',
          value: function getMediaBlock(mediaType) {
              return this.media[mediaType];
          }
      }, {
          key: 'getMediaBlockByPayloadType',
          value: function getMediaBlockByPayloadType(pt) {
              // for (var m in this.media) {
              //     if (-1 !== this.media[m].fmt.indexOf(pt)) {
              //         return this.media[m];
              //     }
              // }
              return this.mediaMap[pt] || null;

              //ErrorManager.dispatchError(826, [pt], true);
              // Log.error(`failed to find media with payload type ${pt}`);
              //
              // return null;
          }
      }, {
          key: 'getMediaBlockList',
          value: function getMediaBlockList() {
              var res = [];
              for (var m in this.media) {
                  res.push(m);
              }

              return res;
          }
      }], [{
          key: '_parseAttribute',
          value: function _parseAttribute(line, media) {
              if (null === media) {
                  /* Not in a media block, can't be bothered parsing attributes for session */
                  return true;
              }

              var matches;
              /* Used for some cases of below switch-case */
              var separator = line.indexOf(':');
              var attribute = line.substr(0, -1 === separator ? 0x7FFFFFFF : separator);
              /* 0x7FF.. is default */

              switch (attribute) {
                  case 'a=recvonly':
                  case 'a=sendrecv':
                  case 'a=sendonly':
                  case 'a=inactive':
                      media.mode = line.substr('a='.length);
                      break;
                  case 'a=range':
                      matches = line.match(/^a=range:\s*([a-zA-Z-]+)=([0-9.]+|now)\s*-\s*([0-9.]*)$/);
                      media.range = [Number(matches[2] == "now" ? -1 : matches[2]), Number(matches[3]), matches[1]];
                      break;
                  case 'a=control':
                      media.control = line.substr('a=control:'.length);
                      break;

                  case 'a=rtpmap':
                      matches = line.match(/^a=rtpmap:(\d+) (.*)$/);
                      if (null === matches) {
                          Log$6.log('Could not parse \'rtpmap\' of \'a=\'');
                          return false;
                      }

                      var payload = parseInt(matches[1]);
                      media.rtpmap[payload] = {};

                      var attrs = matches[2].split('/');
                      media.rtpmap[payload].name = attrs[0].toUpperCase();
                      media.rtpmap[payload].clock = attrs[1];
                      if (undefined !== attrs[2]) {
                          media.rtpmap[payload].encparams = attrs[2];
                      }
                      var ptype = PayloadType.string_map[attrs[0].toUpperCase()];
                      if (ptype) {
                          media.ptype = ptype;
                      }
                      break;

                  case 'a=fmtp':
                      matches = line.match(/^a=fmtp:(\d+) (.*)$/);
                      if (0 === matches.length) {
                          Log$6.log('Could not parse \'fmtp\'  of \'a=\'');
                          return false;
                      }

                      media.fmtp = {};
                      var _iteratorNormalCompletion3 = true;
                      var _didIteratorError3 = false;
                      var _iteratorError3 = undefined;

                      try {
                          for (var _iterator3 = matches[2].split(';')[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                              var param = _step3.value;

                              var idx = param.indexOf('=');
                              media.fmtp[param.substr(0, idx).toLowerCase().trim()] = param.substr(idx + 1).trim();
                          }
                      } catch (err) {
                          _didIteratorError3 = true;
                          _iteratorError3 = err;
                      } finally {
                          try {
                              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                  _iterator3.return();
                              }
                          } finally {
                              if (_didIteratorError3) {
                                  throw _iteratorError3;
                              }
                          }
                      }

                      break;
              }

              return true;
          }
      }]);
      return SDPParser;
  }();

  /*
   * JavaScript MD5
   * https://github.com/blueimp/JavaScript-MD5
   *
   * Copyright 2011, Sebastian Tschan
   * https://blueimp.net
   *
   * Licensed under the MIT license:
   * https://opensource.org/licenses/MIT
   *
   * Based on
   * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
   * Digest Algorithm, as defined in RFC 1321.
   * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
   * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
   * Distributed under the BSD License
   * See http://pajhome.org.uk/crypt/md5 for more info.
   */

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return msw << 16 | lsw & 0xFFFF;
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft(num, cnt) {
      return num << cnt | num >>> 32 - cnt;
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn(q, a, b, x, s, t) {
      return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a, b, c, d, x, s, t) {
      return md5cmn(b & c | ~b & d, a, b, x, s, t);
  }
  function md5gg(a, b, c, d, x, s, t) {
      return md5cmn(b & d | c & ~d, a, b, x, s, t);
  }
  function md5hh(a, b, c, d, x, s, t) {
      return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a, b, c, d, x, s, t) {
      return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5(x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << len % 32;
      x[(len + 64 >>> 9 << 4) + 14] = len;

      var i;
      var olda;
      var oldb;
      var oldc;
      var oldd;
      var a = 1732584193;
      var b = -271733879;
      var c = -1732584194;
      var d = 271733878;

      for (i = 0; i < x.length; i += 16) {
          olda = a;
          oldb = b;
          oldc = c;
          oldd = d;

          a = md5ff(a, b, c, d, x[i], 7, -680876936);
          d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
          c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
          b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
          a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
          d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
          c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
          b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
          a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
          d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
          c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
          b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
          a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
          d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
          c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
          b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);

          a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
          d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
          c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
          b = md5gg(b, c, d, a, x[i], 20, -373897302);
          a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
          d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
          c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
          b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
          a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
          d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
          c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
          b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
          a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
          d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
          c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
          b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);

          a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
          d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
          c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
          b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
          a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
          d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
          c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
          b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
          a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
          d = md5hh(d, a, b, c, x[i], 11, -358537222);
          c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
          b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
          a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
          d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
          c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
          b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);

          a = md5ii(a, b, c, d, x[i], 6, -198630844);
          d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
          c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
          b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
          a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
          d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
          c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
          b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
          a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
          d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
          c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
          b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
          a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
          d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
          c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
          b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);

          a = safeAdd(a, olda);
          b = safeAdd(b, oldb);
          c = safeAdd(c, oldc);
          d = safeAdd(d, oldd);
      }
      return [a, b, c, d];
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr(input) {
      var i;
      var output = '';
      var length32 = input.length * 32;
      for (i = 0; i < length32; i += 8) {
          output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xFF);
      }
      return output;
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl(input) {
      var i;
      var output = [];
      output[(input.length >> 2) - 1] = undefined;
      for (i = 0; i < output.length; i += 1) {
          output[i] = 0;
      }
      var length8 = input.length * 8;
      for (i = 0; i < length8; i += 8) {
          output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << i % 32;
      }
      return output;
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5(s) {
      return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5(key, data) {
      var i;
      var bkey = rstr2binl(key);
      var ipad = [];
      var opad = [];
      var hash;
      ipad[15] = opad[15] = undefined;
      if (bkey.length > 16) {
          bkey = binlMD5(bkey, key.length * 8);
      }
      for (i = 0; i < 16; i += 1) {
          ipad[i] = bkey[i] ^ 0x36363636;
          opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binlMD5(opad.concat(hash), 512 + 128));
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex(input) {
      var hexTab = '0123456789abcdef';
      var output = '';
      var x;
      var i;
      for (i = 0; i < input.length; i += 1) {
          x = input.charCodeAt(i);
          output += hexTab.charAt(x >>> 4 & 0x0F) + hexTab.charAt(x & 0x0F);
      }
      return output;
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8(input) {
      return unescape(encodeURIComponent(input));
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5(s) {
      return rstrMD5(str2rstrUTF8(s));
  }
  function hexMD5(s) {
      return rstr2hex(rawMD5(s));
  }
  function rawHMACMD5(k, d) {
      return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d));
  }
  function hexHMACMD5(k, d) {
      return rstr2hex(rawHMACMD5(k, d));
  }

  function md5(string, key, raw) {
      if (!key) {
          if (!raw) {
              return hexMD5(string);
          }
          return rawMD5(string);
      }
      if (!raw) {
          return hexHMACMD5(key, string);
      }
      return rawHMACMD5(key, string);
  }

  // TODO: asm.js

  var RTP = function () {
      function RTP(pkt /*uint8array*/, sdp) {
          classCallCheck(this, RTP);

          var bytes = new DataView(pkt.buffer, pkt.byteOffset, pkt.byteLength);

          this.version = bytes.getUint8(0) >>> 6;
          this.padding = bytes.getUint8(0) & 0x20;
          this.has_extension = bytes.getUint8(0) & 0x10;
          this.csrc = bytes.getUint8(0) & 0x0F;
          this.marker = bytes.getUint8(1) >>> 7;
          this.pt = bytes.getUint8(1) & 0x7F;
          this.sequence = bytes.getUint16(2);
          this.timestamp = bytes.getUint32(4);
          this.ssrc = bytes.getUint32(8);
          this.csrcs = [];

          var pktIndex = 12;
          if (this.csrc > 0) {
              this.csrcs.push(bytes.getUint32(pktIndex));
              pktIndex += 4;
          }
          if (this.has_extension > 0) {
              this.extension = bytes.getUint16(pktIndex);
              this.ehl = 4 * bytes.getUint16(pktIndex + 2);
              pktIndex += 4;
              this.header_data = pkt.slice(pktIndex, this.ehl);
              pktIndex += this.ehl;
          }

          this.headerLength = pktIndex;
          var padLength = 0;
          if (this.padding > 0) {
              padLength = bytes.getUint8(pkt.byteLength - 1);
          }

          // this.bodyLength   = pkt.byteLength-this.headerLength-padLength;

          this.media = sdp.getMediaBlockByPayloadType(this.pt);
          if (null === this.media) {
              Log.log("Media description for payload type: " + this.pt + " not provided.");
          } else {
              this.type = this.media.ptype; //PayloadType.string_map[this.media.rtpmap[this.media.fmt[0]].name];
          }

          this.data = pkt.subarray(pktIndex);
          // this.timestamp = 1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
          // console.log(this);
      }

      createClass(RTP, [{
          key: "getPayload",
          value: function getPayload() {
              return this.data;
          }
      }, {
          key: "getTimestampMS",
          value: function getTimestampMS() {
              return this.timestamp; //1000 * (this.timestamp / this.media.rtpmap[this.pt].clock);
          }
      }, {
          key: "toString",
          value: function toString() {
              return "RTP(" + "version:" + this.version + ", " + "padding:" + this.padding + ", " + "has_extension:" + this.has_extension + ", " + "csrc:" + this.csrc + ", " + "marker:" + this.marker + ", " + "pt:" + this.pt + ", " + "sequence:" + this.sequence + ", " + "timestamp:" + this.timestamp + ", " + "ssrc:" + this.ssrc + ")";
          }
      }, {
          key: "isVideo",
          value: function isVideo() {
              return this.media.type == 'video';
          }
      }, {
          key: "isAudio",
          value: function isAudio() {
              return this.media.type == 'audio';
          }
      }]);
      return RTP;
  }();

  var RTSPMessage = function () {
      createClass(RTSPMessage, null, [{
          key: 'RTSP_1_0',
          get: function get() {
              return "RTSP/1.0";
          }
      }]);

      function RTSPMessage(_rtsp_version) {
          classCallCheck(this, RTSPMessage);

          this.version = _rtsp_version;
      }

      createClass(RTSPMessage, [{
          key: 'build',
          value: function build(_cmd, _host) {
              var _params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var _payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

              var requestString = _cmd + ' ' + _host + ' ' + this.version + '\r\n';
              for (var param in _params) {
                  requestString += param + ': ' + _params[param] + '\r\n';
              }
              // TODO: binary payload
              if (_payload) {
                  requestString += 'Content-Length: ' + _payload.length + '\r\n';
              }
              requestString += '\r\n';
              if (_payload) {
                  requestString += _payload;
              }
              return requestString;
          }
      }, {
          key: 'parse',
          value: function parse(_data) {
              var lines = _data.split('\r\n');
              var parsed = {
                  headers: {},
                  body: null,
                  code: 0,
                  statusLine: ''
              };

              var match = void 0;

              var _lines$0$match = lines[0].match(new RegExp(this.version + '[ ]+([0-9]{3})[ ]+(.*)'));

              var _lines$0$match2 = slicedToArray(_lines$0$match, 3);

              match = _lines$0$match2[0];
              parsed.code = _lines$0$match2[1];
              parsed.statusLine = _lines$0$match2[2];

              parsed.code = Number(parsed.code);
              var lineIdx = 1;

              while (lines[lineIdx]) {
                  var _lines$lineIdx$split = lines[lineIdx].split(/:(.+)/),
                      _lines$lineIdx$split2 = slicedToArray(_lines$lineIdx$split, 2),
                      k = _lines$lineIdx$split2[0],
                      v = _lines$lineIdx$split2[1];

                  parsed.headers[k.toLowerCase()] = v.trim();
                  lineIdx++;
              }

              parsed.body = lines.slice(lineIdx).join('\n\r');

              return parsed;
          }
      }]);
      return RTSPMessage;
  }();

  var MessageBuilder = new RTSPMessage(RTSPMessage.RTSP_1_0);

  // TODO: asm.js
  var NALUAsm = function () {
      function NALUAsm() {
          classCallCheck(this, NALUAsm);

          this.fragmented_nalu = null;
      }

      createClass(NALUAsm, [{
          key: 'parseSingleNALUPacket',
          value: function parseSingleNALUPacket(rawData, header, dts, pts) {
              /*
              // some video cause 'video decode error' in chrome
              if (header.type === 1) {
                  console.log("dropping NDR, size=", rawData.length)
                  return null;
              }
              */
              return new NALU(header.type, header.nri, rawData.subarray(0), dts, pts);
          }
      }, {
          key: 'parseAggregationPacket',
          value: function parseAggregationPacket(rawData, header, dts, pts) {
              var data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
              var nal_start_idx = 0;
              var don = null;
              if (NALU.STAP_B === header.type) {
                  don = data.getUint16(nal_start_idx);
                  nal_start_idx += 2;
              }
              var ret = [];
              while (nal_start_idx < data.byteLength) {
                  var size = data.getUint16(nal_start_idx);
                  nal_start_idx += 2;
                  var _header = NALUAsm.parseNALHeader(data.getInt8(nal_start_idx));
                  nal_start_idx++;
                  var nalu = this.parseSingleNALUPacket(rawData.subarray(nal_start_idx, nal_start_idx + size), _header, dts, pts);
                  if (nalu !== null) {
                      ret.push(nalu);
                  }
                  nal_start_idx += size;
              }
              return ret;
          }
      }, {
          key: 'parseFragmentationUnit',
          value: function parseFragmentationUnit(rawData, header, dts, pts) {
              var data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);
              var nal_start_idx = 0;
              var fu_header = data.getUint8(nal_start_idx);
              var is_start = (fu_header & 0x80) >>> 7;
              var is_end = (fu_header & 0x40) >>> 6;
              var payload_type = fu_header & 0x1F;
              var ret = null;

              nal_start_idx++;
              var don = 0;
              if (NALU.FU_B === header.type) {
                  don = data.getUint16(nal_start_idx);
                  nal_start_idx += 2;
              }

              if (is_start) {
                  this.fragmented_nalu = new NALU(payload_type, header.nri, rawData.subarray(nal_start_idx), dts, pts);
              }
              if (this.fragmented_nalu && this.fragmented_nalu.ntype === payload_type) {
                  if (!is_start) {
                      this.fragmented_nalu.appendData(rawData.subarray(nal_start_idx));
                  }

                  if (is_end) {
                      ret = this.fragmented_nalu;
                      this.fragmented_nalu = null;
                      return ret;
                  }
              }
              return null;
          }
      }, {
          key: 'onNALUFragment',
          value: function onNALUFragment(rawData, dts, pts) {

              var data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);

              var header = NALUAsm.parseNALHeader(data.getUint8(0));

              var nal_start_idx = 1;

              var unit = null;
              if (header.type > 0 && header.type < 24) {
                  unit = this.parseSingleNALUPacket(rawData.subarray(nal_start_idx), header, dts, pts);
              } else if (NALU.FU_A === header.type || NALU.FU_B === header.type) {
                  unit = this.parseFragmentationUnit(rawData.subarray(nal_start_idx), header, dts, pts);
              } else if (NALU.STAP_A === header.type || NALU.STAP_B === header.type) {
                  return this.parseAggregationPacket(rawData.subarray(nal_start_idx), header, dts, pts);
              } else {
                  /* 30 - 31 is undefined, ignore those (RFC3984). */
                  Log.log('Undefined NAL unit, type: ' + header.type);
                  return null;
              }
              if (unit) {
                  return [unit];
              }
              return null;
          }
      }], [{
          key: 'parseNALHeader',
          value: function parseNALHeader(hdr) {
              return {
                  nri: hdr & 0x60,
                  type: hdr & 0x1F
              };
          }
      }]);
      return NALUAsm;
  }();

  // import {AACParser} from "../parsers/aac.js";
  // TODO: asm.js
  var AACAsm = function () {
      function AACAsm() {
          classCallCheck(this, AACAsm);

          this.config = null;
      }

      createClass(AACAsm, [{
          key: 'onAACFragment',
          value: function onAACFragment(pkt) {
              var rawData = pkt.getPayload();
              if (!pkt.media) {
                  return null;
              }
              var data = new DataView(rawData.buffer, rawData.byteOffset, rawData.byteLength);

              var sizeLength = Number(pkt.media.fmtp['sizelength'] || 0);
              var indexLength = Number(pkt.media.fmtp['indexlength'] || 0);
              var indexDeltaLength = Number(pkt.media.fmtp['indexdeltalength'] || 0);
              var CTSDeltaLength = Number(pkt.media.fmtp['ctsdeltalength'] || 0);
              var DTSDeltaLength = Number(pkt.media.fmtp['dtsdeltalength'] || 0);
              var RandomAccessIndication = Number(pkt.media.fmtp['randomaccessindication'] || 0);
              var StreamStateIndication = Number(pkt.media.fmtp['streamstateindication'] || 0);
              var AuxiliaryDataSizeLength = Number(pkt.media.fmtp['auxiliarydatasizelength'] || 0);

              var configHeaderLength = sizeLength + Math.max(indexLength, indexDeltaLength) + CTSDeltaLength + DTSDeltaLength + RandomAccessIndication + StreamStateIndication + AuxiliaryDataSizeLength;

              var auHeadersLengthPadded = 0;
              var offset = 0;
              var ts = (Math.round(pkt.getTimestampMS() / 1024) << 10) * 90000 / this.config.samplerate;
              if (0 !== configHeaderLength) {
                  /* The AU header section is not empty, read it from payload */
                  var auHeadersLengthInBits = data.getUint16(0); // Always 2 octets, without padding
                  auHeadersLengthPadded = 2 + (auHeadersLengthInBits >>> 3) + (auHeadersLengthInBits & 0x7 ? 1 : 0); // Add padding

                  //this.config = AACParser.parseAudioSpecificConfig(new Uint8Array(rawData, 0 , auHeadersLengthPadded));
                  // TODO: parse config
                  var frames = [];
                  var frameOffset = 0;
                  var bits = new BitArray(rawData.subarray(2 + offset));
                  var cts = 0;
                  var dts = 0;
                  for (var _offset = 0; _offset < auHeadersLengthInBits;) {
                      var size = bits.readBits(sizeLength);
                      var idx = bits.readBits(_offset ? indexDeltaLength : indexLength);
                      _offset += sizeLength + (_offset ? indexDeltaLength : indexLength) /*+2*/;
                      if ( /*ctsPresent &&*/CTSDeltaLength) {
                          var ctsPresent = bits.readBits(1);
                          cts = bits.readBits(CTSDeltaLength);
                          _offset += CTSDeltaLength;
                      }
                      if ( /*dtsPresent && */DTSDeltaLength) {
                          var dtsPresent = bits.readBits(1);
                          dts = bits.readBits(DTSDeltaLength);
                          _offset += CTSDeltaLength;
                      }
                      if (RandomAccessIndication) {
                          bits.skipBits(1);
                          _offset += 1;
                      }
                      if (StreamStateIndication) {
                          bits.skipBits(StreamStateIndication);
                          _offset += StreamStateIndication;
                      }
                      frames.push(new AACFrame(rawData.subarray(auHeadersLengthPadded + frameOffset, auHeadersLengthPadded + frameOffset + size), ts + dts, ts + cts));
                      frameOffset += size;
                  }
                  return frames;
              } else {
                  var aacData = rawData.subarray(auHeadersLengthPadded);
                  while (true) {
                      if (aacData[offset] != 255) break;
                      ++offset;
                  }
                  ++offset;
                  return [new AACFrame(rawData.subarray(auHeadersLengthPadded + offset), ts)];
              }
          }
      }]);
      return AACAsm;
  }();

  var RTPPayloadParser = function () {
      function RTPPayloadParser() {
          classCallCheck(this, RTPPayloadParser);

          this.h264parser = new RTPH264Parser();
          this.aacparser = new RTPAACParser();
      }

      createClass(RTPPayloadParser, [{
          key: "parse",
          value: function parse(rtp) {
              if (rtp.media.type == 'video') {
                  return this.h264parser.parse(rtp);
              } else if (rtp.media.type == 'audio') {
                  return this.aacparser.parse(rtp);
              }
              return null;
          }
      }]);
      return RTPPayloadParser;
  }();

  var DtsGenerator = function () {
      function DtsGenerator() {
          classCallCheck(this, DtsGenerator);

          this.queue = [0, 0, 0, 0];
          this.last_pts = undefined;
          this.last_dts = undefined;
      }

      createClass(DtsGenerator, [{
          key: "getDtsWithPts",
          value: function getDtsWithPts(pts) {
              if (pts <= this.last_pts) {
                  return this.last_dts;
              }

              var index = 0;
              for (; index < this.queue.length; index++) {
                  var element = this.queue[index];
                  if (pts < element) {
                      break;
                  }
              }
              this.queue.splice(index, 0, pts);

              var dts = this.queue.shift();
              if (dts <= this.last_dts) {
                  dts = this.last_dts + 1;
              }
              if (dts > pts) {
                  pts = dts;
              }
              this.last_pts = pts;
              this.last_dts = dts;
              return dts;
          }
      }]);
      return DtsGenerator;
  }();

  var RtpTimestampHandler = function () {
      function RtpTimestampHandler() {
          classCallCheck(this, RtpTimestampHandler);

          this.offset = 0;
          this.last_timestamp = undefined;
          this.first_timestamp = undefined;
      }

      createClass(RtpTimestampHandler, [{
          key: "checkOverflow",
          value: function checkOverflow(timestamp) {
              if (this.last_timestamp === undefined) {
                  this.last_timestamp = timestamp;
              }
              if (Math.abs(timestamp - this.last_timestamp) > 0x7fffffff) {
                  this.offset += 0xffffffff;
                  console.log("check overflow, last_timestamp: ", this.last_timestamp, " timestamp: ", timestamp, " offset: ", this.offset);
              }
              this.last_timestamp = timestamp;
          }

          // grow from zero

      }, {
          key: "adjust",
          value: function adjust(timestamp) {
              timestamp = timestamp + this.offset;
              if (this.first_timestamp === undefined) {
                  this.first_timestamp = timestamp;
              }
              return timestamp - this.first_timestamp;
          }
      }]);
      return RtpTimestampHandler;
  }();

  var RTPH264Parser = function () {
      function RTPH264Parser() {
          classCallCheck(this, RTPH264Parser);

          this.naluasm = new NALUAsm();
          this.dtsGenerator = new DtsGenerator();
          this.rtpTimestampHandler = new RtpTimestampHandler();
      }

      createClass(RTPH264Parser, [{
          key: "parse",
          value: function parse(rtp) {
              var nalus = this.naluasm.onNALUFragment(rtp.getPayload(), 0, 0);
              if (!nalus) {
                  return null;
              }

              var isSEI = true;
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = nalus[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var nalu = _step.value;

                      if (!nalu.isSEI()) {
                          isSEI = false;
                      }
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              if (!isSEI) {
                  this.rtpTimestampHandler.checkOverflow(rtp.timestamp);
              }
              rtp.timestamp = this.rtpTimestampHandler.adjust(rtp.timestamp);
              var pts = rtp.getTimestampMS();
              var dts = pts;

              if (!isSEI) {
                  dts = this.dtsGenerator.getDtsWithPts(pts);
              }

              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = nalus[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var _nalu = _step2.value;

                      _nalu.dts = dts;
                      _nalu.pts = pts;
                  }
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }

              return nalus;
          }
      }]);
      return RTPH264Parser;
  }();

  var RTPAACParser = function () {
      function RTPAACParser() {
          classCallCheck(this, RTPAACParser);

          this.scale = 1;
          this.asm = new AACAsm();
          this.rtpTimestampHandler = new RtpTimestampHandler();
      }

      createClass(RTPAACParser, [{
          key: "setConfig",
          value: function setConfig(conf) {
              this.asm.config = conf;
          }
      }, {
          key: "parse",
          value: function parse(rtp) {
              this.rtpTimestampHandler.checkOverflow(rtp.timestamp);
              rtp.timestamp = this.rtpTimestampHandler.adjust(rtp.timestamp);
              return this.asm.onAACFragment(rtp);
          }
      }]);
      return RTPAACParser;
  }();

  var Log$7 = getTagged('client:base');

  var BaseClient = function () {
      function BaseClient() {
          var _this = this;

          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { flush: 100 };
          classCallCheck(this, BaseClient);

          this.options = options;
          this.eventSource = new EventEmitter();

          Object.defineProperties(this, {
              sourceUrl: { value: null, writable: true }, // TODO: getter with validator
              paused: { value: true, writable: true },
              seekable: { value: false, writable: true },
              connected: { value: false, writable: true }
          });

          this._onData = function () {
              if (_this.connected) {
                  while (_this.transport.dataQueue.length) {
                      _this.onData(_this.transport.dataQueue.pop());
                  }
              }
          };
          this._onConnect = this.onConnected.bind(this);
          this._onDisconnect = this.onDisconnected.bind(this);
          this._onError = options.onError || null;
          this._onReconnect = this.onReconnected.bind(this);
      }

      createClass(BaseClient, [{
          key: 'destroy',
          value: function destroy() {
              this.detachTransport();
              this.stopStreamFlush();
          }
      }, {
          key: 'attachTransport',
          value: function attachTransport(transport) {
              if (this.transport) {
                  this.detachTransport();
              }
              this.transport = transport;
              this.transport.eventSource.addEventListener('data', this._onData);
              this.transport.eventSource.addEventListener('connected', this._onConnect);
              this.transport.eventSource.addEventListener('disconnected', this._onDisconnect);
              this.transport.eventSource.addEventListener('reconnected', this._onReconnect);
          }
      }, {
          key: 'detachTransport',
          value: function detachTransport() {
              if (this.transport) {
                  this.transport.eventSource.removeEventListener('data', this._onData);
                  this.transport.eventSource.removeEventListener('connected', this._onConnect);
                  this.transport.eventSource.removeEventListener('disconnected', this._onDisconnect);
                  this.transport.eventSource.removeEventListener('reconnected', this._onReconnect);
                  this.transport = null;
              }
          }
      }, {
          key: 'reset',
          value: function reset() {}
      }, {
          key: 'start',
          value: function start() {
              Log$7.debug('Client started');
              this.paused = false;
              // this.startStreamFlush();
          }
      }, {
          key: 'stop',
          value: function stop() {
              Log$7.debug('Client paused');
              this.paused = true;
              // this.stopStreamFlush();
          }
      }, {
          key: 'seek',
          value: function seek(timeOffset) {}
      }, {
          key: 'setSource',
          value: function setSource(source) {
              this.stop();
              this.endpoint = source;
              this.sourceUrl = source.urlpath;
          }
      }, {
          key: 'startStreamFlush',
          value: function startStreamFlush() {
              var _this2 = this;

              this.flushInterval = setInterval(function () {
                  if (!_this2.paused) {
                      _this2.eventSource.dispatchEvent('flush');
                  }
              }, this.options.flush);
          }
      }, {
          key: 'stopStreamFlush',
          value: function stopStreamFlush() {
              clearInterval(this.flushInterval);
              Log$7.debug('stopped stream flush');
          }
      }, {
          key: 'onData',
          value: function onData(data) {}
      }, {
          key: 'onConnected',
          value: function onConnected() {
              if (!this.seekable) {
                  this.transport.dataQueue = [];
              }
              this.connected = true;
          }
      }, {
          key: 'onDisconnected',
          value: function onDisconnected() {
              this.connected = false;
              this.stopStreamFlush();
          }
      }, {
          key: 'onReconnected',
          value: function onReconnected() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                          switch (_context.prev = _context.next) {
                              case 0:
                                  _context.next = 2;
                                  return this.reset();

                              case 2:
                                  this.eventSource.dispatchEvent('reconnected');

                              case 3:
                              case 'end':
                                  return _context.stop();
                          }
                      }
                  }, _callee, this);
              }).call(this));
          }
      }, {
          key: 'queryCredentials',
          value: function queryCredentials() {
              return Promise.resolve();
          }
      }, {
          key: 'setCredentials',
          value: function setCredentials(user, password) {
              this.endpoint.user = user;
              this.endpoint.pass = password;
              this.endpoint.auth = user + ':' + password;
          }
      }], [{
          key: 'streamType',
          value: function streamType() {
              return null;
          }
      }]);
      return BaseClient;
  }();

  var ExtendableError = function ExtendableError(message) {
    classCallCheck(this, ExtendableError);

    this.message = message;
    this.name = this.constructor.name;
    this.stack = new Error().stack;
  };
  ExtendableError.prototype = Object.create(Error.prototype);

  var LOG_TAG$2 = "client:rtsp";
  var Log$8 = getTagged(LOG_TAG$2);

  var RTSPStream = function () {
      function RTSPStream(client, track) {
          classCallCheck(this, RTSPStream);

          this.state = null;
          this.client = client;
          this.track = track;
          this.rtpChannel = 1;

          this.stopKeepAlive();
          this.keepaliveInterval = null;
      }

      createClass(RTSPStream, [{
          key: 'reset',
          value: function reset() {
              this.stopKeepAlive();
              this.client.forgetRTPChannel(this.rtpChannel);
              this.client = null;
              this.track = null;
          }
      }, {
          key: 'start',
          value: function start() {
              return this.sendSetup().then(this.sendPlay.bind(this));
          }
      }, {
          key: 'stop',
          value: function stop() {
              return this.sendTeardown();
          }
      }, {
          key: 'getSetupURL',
          value: function getSetupURL(track) {
              var sessionBlock = this.client.sdp.getSessionBlock();
              if (Url.isAbsolute(track.control)) {
                  return track.control;
              } else if (Url.isAbsolute('' + sessionBlock.control + track.control)) {
                  return '' + sessionBlock.control + track.control;
              } else if (Url.isAbsolute('' + this.client.contentBase + track.control)) {
                  /* Should probably check session level control before this */
                  return '' + this.client.contentBase + track.control;
              } else {
                  //need return default
                  return track.control;
              }
              Log$8.error('Can\'t determine track URL from ' + 'block.control:' + track.control + ', ' + 'session.control:' + sessionBlock.control + ', and ' + 'content-base:' + this.client.contentBase);
          }
      }, {
          key: 'getControlURL',
          value: function getControlURL() {
              var ctrl = this.client.sdp.getSessionBlock().control;
              if (Url.isAbsolute(ctrl)) {
                  return ctrl;
              } else if (!ctrl || '*' === ctrl) {
                  return this.client.contentBase;
              } else {
                  return '' + this.client.contentBase + ctrl;
              }
          }
      }, {
          key: 'sendKeepalive',
          value: function sendKeepalive() {
              if (this.client.methods.includes('GET_PARAMETER') && !this.client.hacks["options_keepalive"]) {
                  return this.client.sendRequest('GET_PARAMETER', this.getSetupURL(this.track), {
                      'Session': this.session
                  });
              } else {
                  return this.client.sendRequest('OPTIONS', '*');
              }
              // return this.client.sendRequest('OPTIONS', '*');
          }
      }, {
          key: 'stopKeepAlive',
          value: function stopKeepAlive() {
              clearInterval(this.keepaliveInterval);
          }
      }, {
          key: 'startKeepAlive',
          value: function startKeepAlive() {
              var _this = this;

              this.keepaliveInterval = setInterval(function () {
                  _this.sendKeepalive().catch(function (e) {
                      Log$8.error(e);
                      if (e instanceof RTSPError) {
                          if (Number(e.data.parsed.code) == 501) {
                              return;
                          }
                      }
                      _this.client.reconnect();
                  });
              }, 30000);
          }
      }, {
          key: 'sendRequest',
          value: function sendRequest(_cmd) {
              var _params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

              var params = {};
              if (this.session) {
                  params['Session'] = this.session;
              }
              Object.assign(params, _params);
              return this.client.sendRequest(_cmd, this.getControlURL(), params);
          }
      }, {
          key: 'sendSetup',
          value: function sendSetup() {
              var _this2 = this;

              this.state = RTSPClient.STATE_SETUP;
              this.rtpChannel = this.client.interleaveChannelIndex;
              var interleavedChannels = this.client.interleaveChannelIndex++ + "-" + this.client.interleaveChannelIndex++;
              return this.client.sendRequest('SETUP', this.getSetupURL(this.track), {
                  'Transport': 'RTP/AVP/TCP;unicast;interleaved=' + interleavedChannels,
                  'Date': new Date().toUTCString()
              }).then(function (_data) {
                  _this2.session = _data.headers['session'].split(";")[0];
                  var transport = _data.headers['transport'];
                  if (transport) {
                      var interleaved = transport.match(/interleaved=([0-9]+)-([0-9]+)/)[1];
                      if (interleaved) {
                          _this2.rtpChannel = Number(interleaved);
                      }
                  }
                  /*if (!/RTP\/AVP\/TCP;unicast;interleaved=/.test(_data.headers["transport"])) {
                      // TODO: disconnect stream and notify client
                      throw new Error("Connection broken");
                  }*/
                  _this2.startKeepAlive();
              });
          }
      }, {
          key: 'sendPlay',
          value: function sendPlay() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var params, range, data;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                          switch (_context.prev = _context.next) {
                              case 0:
                                  this.state = RTSPStream.STATE_PLAY;
                                  params = {};
                                  range = this.client.sdp.sessionBlock.range;

                                  if (range) {
                                      // TODO: seekable
                                      if (range[0] == -1) {
                                          range[0] = 0; // Do not handle now at the moment
                                      }
                                      // params['Range'] = `${range[2]}=${range[0]}-`;
                                  }
                                  this.client.useRTPChannel(this.rtpChannel);
                                  _context.next = 7;
                                  return this.sendRequest('PLAY', params);

                              case 7:
                                  data = _context.sent;

                                  this.state = RTSPClient.STATE_PLAYING;
                                  return _context.abrupt('return', { track: this.track, data: data });

                              case 10:
                              case 'end':
                                  return _context.stop();
                          }
                      }
                  }, _callee, this);
              }).call(this));
          }
      }, {
          key: 'sendPause',
          value: function sendPause() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                      while (1) {
                          switch (_context2.prev = _context2.next) {
                              case 0:
                                  if (this.client.supports("PAUSE")) {
                                      _context2.next = 2;
                                      break;
                                  }

                                  return _context2.abrupt('return');

                              case 2:
                                  this.state = RTSPClient.STATE_PAUSE;
                                  _context2.next = 5;
                                  return this.sendRequest("PAUSE");

                              case 5:
                                  this.state = RTSPClient.STATE_PAUSED;

                              case 6:
                              case 'end':
                                  return _context2.stop();
                          }
                      }
                  }, _callee2, this);
              }).call(this));
          }
      }, {
          key: 'sendTeardown',
          value: function sendTeardown() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                          switch (_context3.prev = _context3.next) {
                              case 0:
                                  if (!(this.state != RTSPClient.STATE_TEARDOWN)) {
                                      _context3.next = 7;
                                      break;
                                  }

                                  this.client.forgetRTPChannel(this.rtpChannel);
                                  this.state = RTSPClient.STATE_TEARDOWN;
                                  this.stopKeepAlive();
                                  _context3.next = 6;
                                  return this.sendRequest("TEARDOWN");

                              case 6:
                                  Log$8.log('RTSPClient: STATE_TEARDOWN');
                                  ///this.client.connection.disconnect();
                                  // TODO: Notify client

                              case 7:
                              case 'end':
                                  return _context3.stop();
                          }
                      }
                  }, _callee3, this);
              }).call(this));
          }
      }]);
      return RTSPStream;
  }();

  var RTPError = function (_ExtendableError) {
      inherits(RTPError, _ExtendableError);

      function RTPError(message, file, line) {
          classCallCheck(this, RTPError);

          var _this3 = possibleConstructorReturn(this, (RTPError.__proto__ || Object.getPrototypeOf(RTPError)).call(this, message));

          _this3.file = file;
          _this3.line = line;
          //super(message, file, line);
          return _this3;
      }

      return RTPError;
  }(ExtendableError);

  var RTSPClient = function (_BaseClient) {
      inherits(RTSPClient, _BaseClient);

      function RTSPClient() {
          var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { flush: 200 };
          classCallCheck(this, RTSPClient);

          var _this4 = possibleConstructorReturn(this, (RTSPClient.__proto__ || Object.getPrototypeOf(RTSPClient)).call(this, options));

          _this4.clientSM = new RTSPClientSM(_this4);
          _this4.clientSM.ontracks = function (tracks) {
              _this4.eventSource.dispatchEvent('tracks', tracks);
              _this4.stopStreamFlush();
              _this4.startStreamFlush();
          };
          _this4.sampleQueues = {};
          return _this4;
      }

      createClass(RTSPClient, [{
          key: 'setSource',
          value: function setSource(url) {
              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'setSource', this).call(this, url);
              this.clientSM.setSource(url);
          }
      }, {
          key: 'attachTransport',
          value: function attachTransport(transport) {
              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'attachTransport', this).call(this, transport);
              this.clientSM.transport = transport;
          }
      }, {
          key: 'detachTransport',
          value: function detachTransport() {
              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'detachTransport', this).call(this);
              this.clientSM.transport = null;
          }
      }, {
          key: 'reset',
          value: function reset() {
              var _this5 = this;

              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee4($uper) {
                  return regeneratorRuntime.wrap(function _callee4$(_context4) {
                      while (1) {
                          switch (_context4.prev = _context4.next) {
                              case 0:
                                  $uper("reset").call(this);
                                  _context4.next = 3;
                                  return this.clientSM.reset();

                              case 3:
                                  this.sampleQueues = {};
                                  Log$8.debug("rtsp client reset");

                              case 5:
                              case 'end':
                                  return _context4.stop();
                          }
                      }
                  }, _callee4, this);
              }).call(this, function (p) {
                  return get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), p, _this5);
              }));
          }
      }, {
          key: 'destroy',
          value: function destroy() {
              this.clientSM.destroy();
              return get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'destroy', this).call(this);
          }
      }, {
          key: 'start',
          value: function start() {
              var _this6 = this;

              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'start', this).call(this);
              if (this.transport) {
                  return this.transport.ready().then(function () {
                      return _this6.clientSM.start();
                  }).catch(function (e) {
                      if (_this6._onError) {
                          _this6._onError(e);
                      } else {
                          throw e;
                      }
                  });
              } else {
                  return Promise.reject("no transport attached");
              }
          }
      }, {
          key: 'onData',
          value: function onData(data) {
              this.clientSM.onData(data);
          }
      }, {
          key: 'onConnected',
          value: function onConnected() {
              this.clientSM.onConnected();
              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'onConnected', this).call(this);
          }
      }, {
          key: 'onDisconnected',
          value: function onDisconnected() {
              get(RTSPClient.prototype.__proto__ || Object.getPrototypeOf(RTSPClient.prototype), 'onDisconnected', this).call(this);
              this.clientSM.onDisconnected();
          }
      }], [{
          key: 'streamType',
          value: function streamType() {
              return 'rtsp';
          }
      }]);
      return RTSPClient;
  }(BaseClient);

  var AuthError = function (_ExtendableError2) {
      inherits(AuthError, _ExtendableError2);

      function AuthError(msg) {
          classCallCheck(this, AuthError);
          return possibleConstructorReturn(this, (AuthError.__proto__ || Object.getPrototypeOf(AuthError)).call(this, msg));
      }

      return AuthError;
  }(ExtendableError);

  var RedirectError = function (_ExtendableError3) {
      inherits(RedirectError, _ExtendableError3);

      function RedirectError(msg) {
          classCallCheck(this, RedirectError);
          return possibleConstructorReturn(this, (RedirectError.__proto__ || Object.getPrototypeOf(RedirectError)).call(this, msg));
      }

      return RedirectError;
  }(ExtendableError);

  var RTSPError = function (_ExtendableError4) {
      inherits(RTSPError, _ExtendableError4);

      function RTSPError(data) {
          classCallCheck(this, RTSPError);

          var _this9 = possibleConstructorReturn(this, (RTSPError.__proto__ || Object.getPrototypeOf(RTSPError)).call(this, data.msg));

          _this9.data = data;
          return _this9;
      }

      return RTSPError;
  }(ExtendableError);

  var RTSPClientSM = function (_StateMachine) {
      inherits(RTSPClientSM, _StateMachine);
      createClass(RTSPClientSM, null, [{
          key: 'USER_AGENT',
          get: function get() {
              return 'SFRtsp 0.3';
          }
      }, {
          key: 'STATE_INITIAL',
          get: function get() {
              return 1 << 0;
          }
      }, {
          key: 'STATE_OPTIONS',
          get: function get() {
              return 1 << 1;
          }
      }, {
          key: 'STATE_DESCRIBE',
          get: function get() {
              return 1 << 2;
          }
      }, {
          key: 'STATE_SETUP',
          get: function get() {
              return 1 << 3;
          }
      }, {
          key: 'STATE_STREAMS',
          get: function get() {
              return 1 << 4;
          }
      }, {
          key: 'STATE_TEARDOWN',
          get: function get() {
              return 1 << 5;
          }
          // static STATE_PAUSED = 1 << 6;

      }]);

      function RTSPClientSM(parent) {
          classCallCheck(this, RTSPClientSM);

          var _this10 = possibleConstructorReturn(this, (RTSPClientSM.__proto__ || Object.getPrototypeOf(RTSPClientSM)).call(this));

          _this10.parent = parent;
          _this10.transport = null;
          _this10.payParser = new RTPPayloadParser();
          _this10.rtp_channels = new Set();
          _this10.ontracks = null;
          _this10.hacks = {};

          _this10.addState(RTSPClientSM.STATE_INITIAL, {}).addState(RTSPClientSM.STATE_OPTIONS, {
              activate: _this10.sendOptions,
              finishTransition: _this10.onOptions
          }).addState(RTSPClientSM.STATE_DESCRIBE, {
              activate: _this10.sendDescribe,
              finishTransition: _this10.onDescribe
          }).addState(RTSPClientSM.STATE_SETUP, {
              activate: _this10.sendSetup,
              finishTransition: _this10.onSetup
          }).addState(RTSPClientSM.STATE_STREAMS, {}).addState(RTSPClientSM.STATE_TEARDOWN, {
              activate: function activate() {
                  _this10.started = false;
              },
              finishTransition: function finishTransition() {
                  return _this10.transitionTo(RTSPClientSM.STATE_INITIAL);
              }
          }).addTransition(RTSPClientSM.STATE_INITIAL, RTSPClientSM.STATE_OPTIONS).addTransition(RTSPClientSM.STATE_INITIAL, RTSPClientSM.STATE_TEARDOWN).addTransition(RTSPClientSM.STATE_OPTIONS, RTSPClientSM.STATE_DESCRIBE).addTransition(RTSPClientSM.STATE_DESCRIBE, RTSPClientSM.STATE_SETUP).addTransition(RTSPClientSM.STATE_SETUP, RTSPClientSM.STATE_STREAMS).addTransition(RTSPClientSM.STATE_TEARDOWN, RTSPClientSM.STATE_INITIAL)
          // .addTransition(RTSPClientSM.STATE_STREAMS, RTSPClientSM.STATE_PAUSED)
          // .addTransition(RTSPClientSM.STATE_PAUSED, RTSPClientSM.STATE_STREAMS)
          .addTransition(RTSPClientSM.STATE_STREAMS, RTSPClientSM.STATE_TEARDOWN)
          // .addTransition(RTSPClientSM.STATE_PAUSED, RTSPClientSM.STATE_TEARDOWN)
          .addTransition(RTSPClientSM.STATE_SETUP, RTSPClientSM.STATE_TEARDOWN).addTransition(RTSPClientSM.STATE_DESCRIBE, RTSPClientSM.STATE_TEARDOWN).addTransition(RTSPClientSM.STATE_OPTIONS, RTSPClientSM.STATE_TEARDOWN);

          _this10.reset();

          _this10.shouldReconnect = false;

          // TODO: remove listeners
          // this.connection.eventSource.addEventListener('connected', ()=>{
          //     if (this.shouldReconnect) {
          //         this.reconnect();
          //     }
          // });
          // this.connection.eventSource.addEventListener('disconnected', ()=>{
          //     if (this.started) {
          //         this.shouldReconnect = true;
          //     }
          // });
          // this.connection.eventSource.addEventListener('data', (data)=>{
          //     let channel = new DataView(data).getUint8(1);
          //     if (this.rtp_channels.has(channel)) {
          //         this.onRTP({packet: new Uint8Array(data, 4), type: channel});
          //     }
          //
          // });
          return _this10;
      }

      createClass(RTSPClientSM, [{
          key: 'destroy',
          value: function destroy() {
              var track_types = Object.keys(this.streams);
              // stop keepalive when destroy
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = track_types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var track_type = _step.value;

                      if (track_type === 'audio' || track_type === 'video') {
                          this.streams[track_type].stopKeepAlive();
                          Log$8.debug('stopped keepalive ' + track_type);
                      }
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }

              this.parent = null;
          }
      }, {
          key: 'setSource',
          value: function setSource(url) {
              this.reset();
              this.endpoint = url;
              var full = url.protocol + '://' + url.location + url.urlpath;
              this.url = full;
          }
      }, {
          key: 'onConnected',
          value: function onConnected() {
              if (this.shouldReconnect) {
                  this.start();
                  this.shouldReconnect = false;
              }
          }
      }, {
          key: 'onDisconnected',
          value: function onDisconnected() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                  return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                          switch (_context5.prev = _context5.next) {
                              case 0:
                                  _context5.next = 2;
                                  return this.reset();

                              case 2:
                                  this.shouldReconnect = true;
                                  _context5.next = 5;
                                  return this.transitionTo(RTSPClientSM.STATE_TEARDOWN);

                              case 5:
                                  _context5.next = 7;
                                  return this.transitionTo(RTSPClientSM.STATE_INITIAL);

                              case 7:
                              case 'end':
                                  return _context5.stop();
                          }
                      }
                  }, _callee5, this);
              }).call(this));
          }
      }, {
          key: 'transitionTo',
          value: function transitionTo(s) {
              var _this11 = this;

              return get(RTSPClientSM.prototype.__proto__ || Object.getPrototypeOf(RTSPClientSM.prototype), 'transitionTo', this).call(this, s).catch(function (e) {
                  if (_this11.parent._onError) {
                      _this11.parent._onError(e);
                  } else {
                      throw e;
                  }
              });
          }
      }, {
          key: 'start',
          value: function start() {
              if (this.currentState.name !== RTSPClientSM.STATE_STREAMS) {
                  this.transitionTo(RTSPClientSM.STATE_OPTIONS);
              } else {
                  // TODO: seekable
                  return;
              }
          }
      }, {
          key: 'onData',
          value: function onData(data) {
              var channel = data[1];
              if (this.rtp_channels.has(channel)) {
                  this.onRTP({ packet: data.subarray(4), type: channel });
              }
          }
      }, {
          key: 'useRTPChannel',
          value: function useRTPChannel(channel) {
              this.rtp_channels.add(channel);
          }
      }, {
          key: 'forgetRTPChannel',
          value: function forgetRTPChannel(channel) {
              this.rtp_channels.delete(channel);
          }
      }, {
          key: 'stop',
          value: function stop() {
              this.shouldReconnect = false;
              // this.mse = null;
          }
      }, {
          key: 'reset',
          value: function reset() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                  var stream;
                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                      while (1) {
                          switch (_context6.prev = _context6.next) {
                              case 0:
                                  this.authenticator = '';
                                  this.methods = [];
                                  this.tracks = [];
                                  this.rtpBuffer = {};
                                  for (stream in this.streams) {
                                      this.streams[stream].reset();
                                  }
                                  this.streams = {};
                                  this.contentBase = "";

                                  if (!this.currentState) {
                                      _context6.next = 15;
                                      break;
                                  }

                                  if (!(this.currentState.name != RTSPClientSM.STATE_INITIAL)) {
                                      _context6.next = 13;
                                      break;
                                  }

                                  _context6.next = 11;
                                  return this.transitionTo(RTSPClientSM.STATE_TEARDOWN);

                              case 11:
                                  _context6.next = 13;
                                  return this.transitionTo(RTSPClientSM.STATE_INITIAL);

                              case 13:
                                  _context6.next = 17;
                                  break;

                              case 15:
                                  _context6.next = 17;
                                  return this.transitionTo(RTSPClientSM.STATE_INITIAL);

                              case 17:
                                  this.sdp = null;
                                  this.interleaveChannelIndex = 0;
                                  this.session = null;
                                  this.timeOffset = {};
                                  this.lastTimestamp = {};

                              case 22:
                              case 'end':
                                  return _context6.stop();
                          }
                      }
                  }, _callee6, this);
              }).call(this));
          }
      }, {
          key: 'reconnect',
          value: function reconnect() {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                  return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                          switch (_context7.prev = _context7.next) {
                              case 0:
                                  _context7.next = 2;
                                  return this.reset();

                              case 2:
                                  if (!(this.currentState.name != RTSPClientSM.STATE_INITIAL)) {
                                      _context7.next = 8;
                                      break;
                                  }

                                  _context7.next = 5;
                                  return this.transitionTo(RTSPClientSM.STATE_TEARDOWN);

                              case 5:
                                  return _context7.abrupt('return', this.transitionTo(RTSPClientSM.STATE_OPTIONS));

                              case 8:
                                  return _context7.abrupt('return', this.transitionTo(RTSPClientSM.STATE_OPTIONS));

                              case 9:
                              case 'end':
                                  return _context7.stop();
                          }
                      }
                  }, _callee7, this);
              }).call(this));
          }
      }, {
          key: 'supports',
          value: function supports(method) {
              return this.methods.includes(method);
          }
      }, {
          key: 'parse',
          value: function parse(_data) {
              Log$8.debug(_data.payload);
              var d = _data.payload.split('\r\n\r\n');
              var parsed = MessageBuilder.parse(d[0]);
              var len = Number(parsed.headers['content-length']);
              if (len) {
                  var _d = _data.payload.split('\r\n\r\n');
                  parsed.body = _d[1];
              } else {
                  parsed.body = "";
              }
              return parsed;
          }
      }, {
          key: 'sendRequest',
          value: function sendRequest(_cmd, _host) {
              var _this12 = this;

              var _params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

              var _payload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

              this.cSeq++;
              Object.assign(_params, {
                  CSeq: this.cSeq,
                  'User-Agent': RTSPClientSM.USER_AGENT
              });
              if (this.authenticator) {
                  _params['Authorization'] = this.authenticator(_cmd);
              }
              return this.send(MessageBuilder.build(_cmd, _host, _params, _payload), _cmd).catch(function (e) {
                  if (e instanceof AuthError && !_params['Authorization']) {
                      return _this12.sendRequest(_cmd, _host, _params, _payload);
                  } else if (e instanceof RedirectError) {
                      _this12.parent.options.setSourceOfPlay(e.message.parsed.headers.location, 'rtsp');
                  } else {
                      throw e;
                  }
              });
          }
      }, {
          key: 'send',
          value: function send(_data, _method) {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
                  var _this13 = this;

                  var response, parsed, auth, method, chunks, ep, parsedChunks, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, chunk, c, _c$split, _c$split2, k, v;

                  return regeneratorRuntime.wrap(function _callee8$(_context8) {
                      while (1) {
                          switch (_context8.prev = _context8.next) {
                              case 0:
                                  if (!this.transport) {
                                      _context8.next = 67;
                                      break;
                                  }

                                  _context8.prev = 1;
                                  _context8.next = 4;
                                  return this.transport.ready();

                              case 4:
                                  _context8.next = 10;
                                  break;

                              case 6:
                                  _context8.prev = 6;
                                  _context8.t0 = _context8['catch'](1);

                                  this.onDisconnected();
                                  throw _context8.t0;

                              case 10:
                                  Log$8.debug(_data);
                                  _context8.next = 13;
                                  return this.transport.send(_data);

                              case 13:
                                  response = _context8.sent;
                                  parsed = this.parse(response);
                                  // TODO: parse status codes

                                  if (!(parsed.code == 401 /*&& !this.authenticator */)) {
                                      _context8.next = 58;
                                      break;
                                  }

                                  Log$8.debug(parsed.headers['www-authenticate']);
                                  auth = parsed.headers['www-authenticate'];
                                  method = auth.substring(0, auth.indexOf(' '));

                                  auth = auth.substr(method.length + 1);
                                  chunks = auth.split(',');
                                  ep = this.parent.endpoint;

                                  if (!(!ep.user || !ep.pass)) {
                                      _context8.next = 31;
                                      break;
                                  }

                                  _context8.prev = 23;
                                  _context8.next = 26;
                                  return this.parent.queryCredentials.call(this.parent);

                              case 26:
                                  _context8.next = 31;
                                  break;

                              case 28:
                                  _context8.prev = 28;
                                  _context8.t1 = _context8['catch'](23);
                                  throw new AuthError();

                              case 31:
                                  if (!(method.toLowerCase() == 'digest')) {
                                      _context8.next = 56;
                                      break;
                                  }

                                  parsedChunks = {};
                                  _iteratorNormalCompletion2 = true;
                                  _didIteratorError2 = false;
                                  _iteratorError2 = undefined;
                                  _context8.prev = 36;

                                  for (_iterator2 = chunks[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                      chunk = _step2.value;
                                      c = chunk.trim();
                                      _c$split = c.split('='), _c$split2 = slicedToArray(_c$split, 2), k = _c$split2[0], v = _c$split2[1];

                                      parsedChunks[k] = v.substr(1, v.length - 2);
                                  }

                                  // HACK for 天地伟业
                                  _context8.next = 44;
                                  break;

                              case 40:
                                  _context8.prev = 40;
                                  _context8.t2 = _context8['catch'](36);
                                  _didIteratorError2 = true;
                                  _iteratorError2 = _context8.t2;

                              case 44:
                                  _context8.prev = 44;
                                  _context8.prev = 45;

                                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                      _iterator2.return();
                                  }

                              case 47:
                                  _context8.prev = 47;

                                  if (!_didIteratorError2) {
                                      _context8.next = 50;
                                      break;
                                  }

                                  throw _iteratorError2;

                              case 50:
                                  return _context8.finish(47);

                              case 51:
                                  return _context8.finish(44);

                              case 52:
                                  if (parsed.headers['server'] == 'RTSP Server' && parsedChunks.realm == 'RTSP SERVER') {
                                      Log$8.debug("set OPTIONS keepalive hack");
                                      this.hacks["options_keepalive"] = true;
                                  }

                                  this.authenticator = function (_method) {
                                      var ep = _this13.parent.endpoint;
                                      var ha1 = md5(ep.user + ':' + parsedChunks.realm + ':' + ep.pass);
                                      var ha2 = md5(_method + ':' + _this13.url);
                                      var response = md5(ha1 + ':' + parsedChunks.nonce + ':' + ha2);
                                      var tail = ''; // TODO: handle other params
                                      return 'Digest username="' + ep.user + '", realm="' + parsedChunks.realm + '", nonce="' + parsedChunks.nonce + '", uri="' + _this13.url + '", response="' + response + '"' + tail;
                                  };
                                  _context8.next = 57;
                                  break;

                              case 56:
                                  this.authenticator = function () {
                                      return 'Basic ' + btoa(_this13.parent.endpoint.auth);
                                  };

                              case 57:
                                  throw new AuthError(parsed);

                              case 58:
                                  if (!(parsed.code === 302 || parsed.code === 301)) {
                                      _context8.next = 61;
                                      break;
                                  }

                                  Log$8.error("RTSP error:", parsed.statusLine);
                                  throw new RedirectError({ msg: 'Redirect error: ' + parsed.code + ' ' + parsed.statusLine, parsed: parsed });

                              case 61:
                                  if (!(parsed.code >= 300)) {
                                      _context8.next = 64;
                                      break;
                                  }

                                  Log$8.error("RTSP error:", parsed.statusLine);
                                  throw new RTSPError({ msg: 'RTSP error: ' + parsed.code + ' ' + parsed.statusLine, parsed: parsed });

                              case 64:
                                  return _context8.abrupt('return', parsed);

                              case 67:
                                  return _context8.abrupt('return', Promise.reject("No transport attached"));

                              case 68:
                              case 'end':
                                  return _context8.stop();
                          }
                      }
                  }, _callee8, this, [[1, 6], [23, 28], [36, 40, 44, 52], [45,, 47, 51]]);
              }).call(this));
          }
      }, {
          key: 'sendOptions',
          value: function sendOptions() {
              this.reset();
              this.started = true;
              this.cSeq = 0;
              return this.sendRequest('OPTIONS', this.url, {});
          }
      }, {
          key: 'onOptions',
          value: function onOptions(data) {
              if (data.headers['public']) {
                  this.methods = data.headers['public'].split(',').map(function (e) {
                      return e.trim();
                  });
              } else {
                  this.methods = ['OPTIONS', 'DESCRIBE', 'TEARDOWN', 'PLAY'];
              }
              this.transitionTo(RTSPClientSM.STATE_DESCRIBE);
          }
      }, {
          key: 'sendDescribe',
          value: function sendDescribe() {
              var _this14 = this;

              return this.sendRequest('DESCRIBE', this.url, {
                  'Accept': 'application/sdp'
              }).then(function (data) {
                  _this14.sdp = new SDPParser();
                  return _this14.sdp.parse(data.body).catch(function () {
                      throw new Error("Failed to parse SDP");
                  }).then(function () {
                      return data;
                  });
              });
          }
      }, {
          key: 'onDescribe',
          value: function onDescribe(data) {
              this.contentBase = data.headers['content-base'] || this.url; // `${this.endpoint.protocol}://${this.endpoint.location}${this.endpoint.urlpath}/`;
              if (!this.contentBase.endsWith("/")) {
                  this.contentBase = this.contentBase + "/";
              }
              this.tracks = this.sdp.getMediaBlockList();

              Log$8.log('SDP contained ' + this.tracks.length + ' track(s). Calling SETUP for each.');

              if (data.headers['session']) {
                  this.session = data.headers['session'];
              }

              if (!this.tracks.length) {
                  throw new Error("No tracks in SDP");
              }

              this.transitionTo(RTSPClientSM.STATE_SETUP);
          }
      }, {
          key: 'sendSetup',
          value: function sendSetup() {
              var _this15 = this;

              var streams = [];

              // TODO: select first video and first audio tracks
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                  for (var _iterator3 = this.tracks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                      var track_type = _step3.value;

                      if (track_type != 'audio' && track_type != 'video') continue;
                      var track = this.sdp.getMediaBlock(track_type);
                      if (!track.rtpmap[track.fmt[0]]) continue;
                      if (!PayloadType.string_map[track.rtpmap[track.fmt[0]].name]) continue;
                      Log$8.log("setup track: " + track_type);

                      this.streams[track_type] = new RTSPStream(this, track);
                      var playPromise = this.streams[track_type].start();
                      this.parent.sampleQueues[PayloadType.string_map[track.rtpmap[track.fmt[0]].name]] = [];
                      this.rtpBuffer[track.fmt[0]] = [];
                      streams.push(playPromise.then(function (_ref) {
                          var track = _ref.track,
                              data = _ref.data;

                          var timeOffset = 0;
                          _this15.timeOffset[track.fmt[0]] = 0;
                          try {
                              var rtp_info = data.headers["rtp-info"].split(';');
                              var _iteratorNormalCompletion4 = true;
                              var _didIteratorError4 = false;
                              var _iteratorError4 = undefined;

                              try {
                                  for (var _iterator4 = rtp_info[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                      var chunk = _step4.value;

                                      var _chunk$split = chunk.split("="),
                                          _chunk$split2 = slicedToArray(_chunk$split, 2),
                                          key = _chunk$split2[0],
                                          val = _chunk$split2[1];

                                      if (key === "rtptime") {
                                          _this15.timeOffset[track.fmt[0]] = Number(val);
                                      }
                                  }
                              } catch (err) {
                                  _didIteratorError4 = true;
                                  _iteratorError4 = err;
                              } finally {
                                  try {
                                      if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                          _iterator4.return();
                                      }
                                  } finally {
                                      if (_didIteratorError4) {
                                          throw _iteratorError4;
                                      }
                                  }
                              }
                          } catch (e) {
                              // new Date().getTime();
                          }
                          var params = {
                              timescale: 0,
                              scaleFactor: 0
                          };
                          if (track.fmtp && track.fmtp['sprop-parameter-sets']) {
                              var sps_pps = track.fmtp['sprop-parameter-sets'].split(',');
                              params = {
                                  sps: base64ToArrayBuffer(sps_pps[0]),
                                  pps: base64ToArrayBuffer(sps_pps[1])
                              };
                          } else if (track.fmtp && track.fmtp['config']) {
                              var config = track.fmtp['config'];
                              _this15.has_config = track.fmtp['cpresent'] != '0';
                              var generic = track.rtpmap[track.fmt[0]].name == 'MPEG4-GENERIC';
                              if (generic) {
                                  params = { config: AACParser.parseAudioSpecificConfig(hexToByteArray(config))
                                  };
                                  _this15.payParser.aacparser.setConfig(params.config);
                              } else if (config) {
                                  // todo: parse audio specific config for mpeg4-generic
                                  params = { config: AACParser.parseStreamMuxConfig(hexToByteArray(config))
                                  };
                                  _this15.payParser.aacparser.setConfig(params.config);
                              }
                          }

                          params.duration = null;
                          _this15.parent.seekable = false;

                          if (_this15.sdp.sessionBlock.range) {
                              var range = _this15.sdp.sessionBlock.range[1] - _this15.sdp.sessionBlock.range[0];
                              if (range > 1) {
                                  Log$8.debug("set to seekable mode");
                                  _this15.parent.seekable = true;
                                  params.duration = range;
                              }
                          }

                          var res = {
                              track: track,
                              offset: _this15.timeOffset[track.fmt[0]],
                              type: PayloadType.string_map[track.rtpmap[track.fmt[0]].name],
                              params: params,
                              duration: params.duration
                          };
                          return res;
                      }));
                  }
              } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion3 && _iterator3.return) {
                          _iterator3.return();
                      }
                  } finally {
                      if (_didIteratorError3) {
                          throw _iteratorError3;
                      }
                  }
              }

              return Promise.all(streams).then(function (tracks) {
                  if (_this15.ontracks) {
                      _this15.ontracks(tracks);
                  }
              }).catch(function (e) {
                  Log$8.error("setup error: ", e);
                  _this15.stop();
                  return _this15.reset();
              });
          }
      }, {
          key: 'onSetup',
          value: function onSetup() {
              this.firstKeyframeFound = false;
              this.transitionTo(RTSPClientSM.STATE_STREAMS);
          }
      }, {
          key: 'onRTP',
          value: function onRTP(_data) {
              var rtp = new RTP(_data.packet, this.sdp);
              if (!rtp.type) {
                  return;
              }

              var queue = this.rtpBuffer[rtp.pt];
              queue.push(rtp);

              while (queue.length) {
                  var _rtp = queue.shift();
                  if (_rtp.media) {
                      var pay = this.payParser.parse(_rtp);
                      if (pay) {
                          if (_rtp.isVideo()) {
                              var _iteratorNormalCompletion5 = true;
                              var _didIteratorError5 = false;
                              var _iteratorError5 = undefined;

                              try {
                                  for (var _iterator5 = pay[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                      var nalu = _step5.value;

                                      if (nalu.isDataType()) {
                                          if (!this.firstKeyframeFound && nalu.isKeyframe()) {
                                              this.firstKeyframeFound = true;
                                          }
                                          if (this.firstKeyframeFound) {
                                              this.parent.sampleQueues[_rtp.type].push([nalu]);
                                          } else {
                                              console.log("drop broken nalu", nalu.toString());
                                          }
                                      }
                                      // console.log(nalu.toString());
                                  }
                              } catch (err) {
                                  _didIteratorError5 = true;
                                  _iteratorError5 = err;
                              } finally {
                                  try {
                                      if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                          _iterator5.return();
                                      }
                                  } finally {
                                      if (_didIteratorError5) {
                                          throw _iteratorError5;
                                      }
                                  }
                              }
                          } else {
                              this.parent.sampleQueues[_rtp.type].push(pay);
                          }
                      }
                  }
              }
              //end while
          }
      }]);
      return RTSPClientSM;
  }(StateMachine);

  // ASN.1 JavaScript decoder
  // Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>

  // Permission to use, copy, modify, and/or distribute this software for any
  // purpose with or without fee is hereby granted, provided that the above
  // copyright notice and this permission notice appear in all copies.
  // 
  // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
  /*global oids */

  var hardLimit = 100,
      ellipsis = "\u2026",
      DOM = {
      tag: function tag(tagName, className) {
          var t = document.createElement(tagName);
          t.className = className;
          return t;
      },
      text: function text(str) {
          return document.createTextNode(str);
      }
  };

  var Stream = function () {
      createClass(Stream, null, [{
          key: "hexDigits",
          get: function get() {
              return "0123456789ABCDEF";
          }
      }, {
          key: "reTime",
          get: function get() {
              return (/^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/
              );
          }
      }]);

      function Stream(enc, pos) {
          classCallCheck(this, Stream);

          if (enc instanceof Stream) {
              this.enc = enc.enc;
              this.pos = enc.pos;
          } else {
              this.enc = enc;
              this.pos = pos;
          }
      }

      createClass(Stream, [{
          key: "get",
          value: function get(pos) {
              if (pos === undefined) pos = this.pos++;
              if (pos >= this.enc.length) throw 'Requesting byte offset ' + pos + ' on a stream of length ' + this.enc.length;
              return this.enc[pos];
          }
      }, {
          key: "hexByte",
          value: function hexByte(b) {
              return Stream.hexDigits.charAt(b >> 4 & 0xF) + Stream.hexDigits.charAt(b & 0xF);
          }
      }, {
          key: "hexDump",
          value: function hexDump(start, end, raw) {
              var s = "";
              for (var i = start; i < end; ++i) {
                  s += this.hexByte(this.get(i));
                  if (raw !== true) switch (i & 0xF) {
                      case 0x7:
                          s += "  ";
                          break;
                      case 0xF:
                          s += "\n";
                          break;
                      default:
                          s += " ";
                  }
              }
              return s;
          }
      }, {
          key: "parseStringISO",
          value: function parseStringISO(start, end) {
              var s = "";
              for (var i = start; i < end; ++i) {
                  s += String.fromCharCode(this.get(i));
              }return s;
          }
      }, {
          key: "parseStringUTF",
          value: function parseStringUTF(start, end) {
              var s = "";
              for (var i = start; i < end;) {
                  var c = this.get(i++);
                  if (c < 128) s += String.fromCharCode(c);else if (c > 191 && c < 224) s += String.fromCharCode((c & 0x1F) << 6 | this.get(i++) & 0x3F);else s += String.fromCharCode((c & 0x0F) << 12 | (this.get(i++) & 0x3F) << 6 | this.get(i++) & 0x3F);
              }
              return s;
          }
      }, {
          key: "parseStringBMP",
          value: function parseStringBMP(start, end) {
              var str = "";
              for (var i = start; i < end; i += 2) {
                  var high_byte = this.get(i);
                  var low_byte = this.get(i + 1);
                  str += String.fromCharCode((high_byte << 8) + low_byte);
              }

              return str;
          }
      }, {
          key: "parseTime",
          value: function parseTime(start, end) {
              var s = this.parseStringISO(start, end),
                  m = Stream.reTime.exec(s);
              if (!m) return "Unrecognized time: " + s;
              s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
              if (m[5]) {
                  s += ":" + m[5];
                  if (m[6]) {
                      s += ":" + m[6];
                      if (m[7]) s += "." + m[7];
                  }
              }
              if (m[8]) {
                  s += " UTC";
                  if (m[8] != 'Z') {
                      s += m[8];
                      if (m[9]) s += ":" + m[9];
                  }
              }
              return s;
          }
      }, {
          key: "parseInteger",
          value: function parseInteger(start, end) {
              //TODO support negative numbers
              var len = end - start;
              if (len > 4) {
                  len <<= 3;
                  var s = this.get(start);
                  if (s === 0) len -= 8;else while (s < 128) {
                      s <<= 1;
                      --len;
                  }
                  return "(" + len + " bit)";
              }
              var n = 0;
              for (var i = start; i < end; ++i) {
                  n = n << 8 | this.get(i);
              }return n;
          }
      }, {
          key: "parseBitString",
          value: function parseBitString(start, end) {
              var unusedBit = this.get(start),
                  lenBit = (end - start - 1 << 3) - unusedBit,
                  s = "(" + lenBit + " bit)";
              if (lenBit <= 20) {
                  var skip = unusedBit;
                  s += " ";
                  for (var i = end - 1; i > start; --i) {
                      var b = this.get(i);
                      for (var j = skip; j < 8; ++j) {
                          s += b >> j & 1 ? "1" : "0";
                      }skip = 0;
                  }
              }
              return s;
          }
      }, {
          key: "parseOctetString",
          value: function parseOctetString(start, end) {
              var len = end - start,
                  s = "(" + len + " byte) ";
              if (len > hardLimit) end = start + hardLimit;
              for (var i = start; i < end; ++i) {
                  s += this.hexByte(this.get(i));
              } //TODO: also try Latin1?
              if (len > hardLimit) s += ellipsis;
              return s;
          }
      }, {
          key: "parseOID",
          value: function parseOID(start, end) {
              var s = '',
                  n = 0,
                  bits = 0;
              for (var i = start; i < end; ++i) {
                  var v = this.get(i);
                  n = n << 7 | v & 0x7F;
                  bits += 7;
                  if (!(v & 0x80)) {
                      // finished
                      if (s === '') {
                          var m = n < 80 ? n < 40 ? 0 : 1 : 2;
                          s = m + "." + (n - m * 40);
                      } else s += "." + (bits >= 31 ? "bigint" : n);
                      n = bits = 0;
                  }
              }
              return s;
          }
      }]);
      return Stream;
  }();

  var ASN1 = function () {
      createClass(ASN1, null, [{
          key: "reSeemsASCII",
          get: function get() {
              return (/^[ -~]+$/
              );
          }
      }]);

      function ASN1(stream, header, length, tag, sub) {
          classCallCheck(this, ASN1);

          this.stream = stream;
          this.header = header;
          this.length = length;
          this.tag = tag;
          this.sub = sub;
      }

      createClass(ASN1, [{
          key: "typeName",
          value: function typeName() {
              if (this.tag === undefined) return "unknown";
              var tagClass = this.tag >> 6,
                  tagConstructed = this.tag >> 5 & 1,
                  tagNumber = this.tag & 0x1F;
              switch (tagClass) {
                  case 0:
                      // universal
                      switch (tagNumber) {
                          case 0x00:
                              return "EOC";
                          case 0x01:
                              return "BOOLEAN";
                          case 0x02:
                              return "INTEGER";
                          case 0x03:
                              return "BIT_STRING";
                          case 0x04:
                              return "OCTET_STRING";
                          case 0x05:
                              return "NULL";
                          case 0x06:
                              return "OBJECT_IDENTIFIER";
                          case 0x07:
                              return "ObjectDescriptor";
                          case 0x08:
                              return "EXTERNAL";
                          case 0x09:
                              return "REAL";
                          case 0x0A:
                              return "ENUMERATED";
                          case 0x0B:
                              return "EMBEDDED_PDV";
                          case 0x0C:
                              return "UTF8String";
                          case 0x10:
                              return "SEQUENCE";
                          case 0x11:
                              return "SET";
                          case 0x12:
                              return "NumericString";
                          case 0x13:
                              return "PrintableString"; // ASCII subset
                          case 0x14:
                              return "TeletexString"; // aka T61String
                          case 0x15:
                              return "VideotexString";
                          case 0x16:
                              return "IA5String"; // ASCII
                          case 0x17:
                              return "UTCTime";
                          case 0x18:
                              return "GeneralizedTime";
                          case 0x19:
                              return "GraphicString";
                          case 0x1A:
                              return "VisibleString"; // ASCII subset
                          case 0x1B:
                              return "GeneralString";
                          case 0x1C:
                              return "UniversalString";
                          case 0x1E:
                              return "BMPString";
                          default:
                              return "Universal_" + tagNumber.toString(16);
                      }
                  case 1:
                      return "Application_" + tagNumber.toString(16);
                  case 2:
                      return "[" + tagNumber + "]"; // Context
                  case 3:
                      return "Private_" + tagNumber.toString(16);
              }
          }
      }, {
          key: "content",
          value: function content() {
              if (this.tag === undefined) return null;
              var tagClass = this.tag >> 6,
                  tagNumber = this.tag & 0x1F,
                  content = this.posContent(),
                  len = Math.abs(this.length);
              if (tagClass !== 0) {
                  // universal
                  if (this.sub !== null) return "(" + this.sub.length + " elem)";
                  //TODO: TRY TO PARSE ASCII STRING
                  var s = this.stream.parseStringISO(content, content + Math.min(len, hardLimit));
                  if (ASN1.reSeemsASCII.test(s)) return s.substring(0, 2 * hardLimit) + (s.length > 2 * hardLimit ? ellipsis : "");else return this.stream.parseOctetString(content, content + len);
              }
              switch (tagNumber) {
                  case 0x01:
                      // BOOLEAN
                      return this.stream.get(content) === 0 ? "false" : "true";
                  case 0x02:
                      // INTEGER
                      return this.stream.parseInteger(content, content + len);
                  case 0x03:
                      // BIT_STRING
                      return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(content, content + len);
                  case 0x04:
                      // OCTET_STRING
                      return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(content, content + len);
                  //case 0x05: // NULL
                  case 0x06:
                      // OBJECT_IDENTIFIER
                      return this.stream.parseOID(content, content + len);
                  //case 0x07: // ObjectDescriptor
                  //case 0x08: // EXTERNAL
                  //case 0x09: // REAL
                  //case 0x0A: // ENUMERATED
                  //case 0x0B: // EMBEDDED_PDV
                  case 0x10: // SEQUENCE
                  case 0x11:
                      // SET
                      return "(" + this.sub.length + " elem)";
                  case 0x0C:
                      // UTF8String
                      return this.stream.parseStringUTF(content, content + len);
                  case 0x12: // NumericString
                  case 0x13: // PrintableString
                  case 0x14: // TeletexString
                  case 0x15: // VideotexString
                  case 0x16: // IA5String
                  //case 0x19: // GraphicString
                  case 0x1A:
                      // VisibleString
                      //case 0x1B: // GeneralString
                      //case 0x1C: // UniversalString
                      return this.stream.parseStringISO(content, content + len);
                  case 0x1E:
                      // BMPString
                      return this.stream.parseStringBMP(content, content + len);
                  case 0x17: // UTCTime
                  case 0x18:
                      // GeneralizedTime
                      return this.stream.parseTime(content, content + len);
              }
              return null;
          }
      }, {
          key: "toString",
          value: function toString() {
              return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (this.sub === null ? 'null' : this.sub.length) + "]";
          }
      }, {
          key: "print",
          value: function print(indent) {
              if (indent === undefined) indent = '';
              document.writeln(indent + this);
              if (this.sub !== null) {
                  indent += '  ';
                  for (var i = 0, max = this.sub.length; i < max; ++i) {
                      this.sub[i].print(indent);
                  }
              }
          }
      }, {
          key: "toPrettyString",
          value: function toPrettyString(indent) {
              if (indent === undefined) indent = '';
              var s = indent + this.typeName() + " @" + this.stream.pos;
              if (this.length >= 0) s += "+";
              s += this.length;
              if (this.tag & 0x20) s += " (constructed)";else if ((this.tag == 0x03 || this.tag == 0x04) && this.sub !== null) s += " (encapsulates)";
              s += "\n";
              if (this.sub !== null) {
                  indent += '  ';
                  for (var i = 0, max = this.sub.length; i < max; ++i) {
                      s += this.sub[i].toPrettyString(indent);
                  }
              }
              return s;
          }
      }, {
          key: "toDOM",
          value: function toDOM() {
              var node = DOM.tag("div", "node");
              node.asn1 = this;
              var head = DOM.tag("div", "head");
              var s = this.typeName().replace(/_/g, " ");
              head.innerHTML = s;
              var content = this.content();
              if (content !== null) {
                  content = String(content).replace(/</g, "&lt;");
                  var preview = DOM.tag("span", "preview");
                  preview.appendChild(DOM.text(content));
                  head.appendChild(preview);
              }
              node.appendChild(head);
              this.node = node;
              this.head = head;
              var value = DOM.tag("div", "value");
              s = "Offset: " + this.stream.pos + "<br/>";
              s += "Length: " + this.header + "+";
              if (this.length >= 0) s += this.length;else s += -this.length + " (undefined)";
              if (this.tag & 0x20) s += "<br/>(constructed)";else if ((this.tag == 0x03 || this.tag == 0x04) && this.sub !== null) s += "<br/>(encapsulates)";
              //TODO if (this.tag == 0x03) s += "Unused bits: "
              if (content !== null) {
                  s += "<br/>Value:<br/><b>" + content + "</b>";
                  if ((typeof oids === "undefined" ? "undefined" : _typeof(oids)) === 'object' && this.tag == 0x06) {
                      var oid = oids[content];
                      if (oid) {
                          if (oid.d) s += "<br/>" + oid.d;
                          if (oid.c) s += "<br/>" + oid.c;
                          if (oid.w) s += "<br/>(warning!)";
                      }
                  }
              }
              value.innerHTML = s;
              node.appendChild(value);
              var sub = DOM.tag("div", "sub");
              if (this.sub !== null) {
                  for (var i = 0, max = this.sub.length; i < max; ++i) {
                      sub.appendChild(this.sub[i].toDOM());
                  }
              }
              node.appendChild(sub);
              head.onclick = function () {
                  node.className = node.className == "node collapsed" ? "node" : "node collapsed";
              };
              return node;
          }
      }, {
          key: "posStart",
          value: function posStart() {
              return this.stream.pos;
          }
      }, {
          key: "posContent",
          value: function posContent() {
              return this.stream.pos + this.header;
          }
      }, {
          key: "posEnd",
          value: function posEnd() {
              return this.stream.pos + this.header + Math.abs(this.length);
          }
      }, {
          key: "fakeHover",
          value: function fakeHover(current) {
              this.node.className += " hover";
              if (current) this.head.className += " hover";
          }
      }, {
          key: "fakeOut",
          value: function fakeOut(current) {
              var re = / ?hover/;
              this.node.className = this.node.className.replace(re, "");
              if (current) this.head.className = this.head.className.replace(re, "");
          }
      }, {
          key: "toHexDOM_sub",
          value: function toHexDOM_sub(node, className, stream, start, end) {
              if (start >= end) return;
              var sub = DOM.tag("span", className);
              sub.appendChild(DOM.text(stream.hexDump(start, end)));
              node.appendChild(sub);
          }
      }, {
          key: "toHexDOM",
          value: function toHexDOM(root) {
              var node = DOM.tag("span", "hex");
              if (root === undefined) root = node;
              this.head.hexNode = node;
              this.head.onmouseover = function () {
                  this.hexNode.className = "hexCurrent";
              };
              this.head.onmouseout = function () {
                  this.hexNode.className = "hex";
              };
              node.asn1 = this;
              node.onmouseover = function () {
                  var current = !root.selected;
                  if (current) {
                      root.selected = this.asn1;
                      this.className = "hexCurrent";
                  }
                  this.asn1.fakeHover(current);
              };
              node.onmouseout = function () {
                  var current = root.selected == this.asn1;
                  this.asn1.fakeOut(current);
                  if (current) {
                      root.selected = null;
                      this.className = "hex";
                  }
              };
              this.toHexDOM_sub(node, "tag", this.stream, this.posStart(), this.posStart() + 1);
              this.toHexDOM_sub(node, this.length >= 0 ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
              if (this.sub === null) node.appendChild(DOM.text(this.stream.hexDump(this.posContent(), this.posEnd())));else if (this.sub.length > 0) {
                  var first = this.sub[0];
                  var last = this.sub[this.sub.length - 1];
                  this.toHexDOM_sub(node, "intro", this.stream, this.posContent(), first.posStart());
                  for (var i = 0, max = this.sub.length; i < max; ++i) {
                      node.appendChild(this.sub[i].toHexDOM(root));
                  }this.toHexDOM_sub(node, "outro", this.stream, last.posEnd(), this.posEnd());
              }
              return node;
          }
      }, {
          key: "toHexString",
          value: function toHexString(root) {
              return this.stream.hexDump(this.posStart(), this.posEnd(), true);
          }
      }]);
      return ASN1;
  }();

  ASN1.decodeLength = function (stream) {
      var buf = stream.get(),
          len = buf & 0x7F;
      if (len == buf) return len;
      if (len > 3) throw "Length over 24 bits not supported at position " + (stream.pos - 1);
      if (len === 0) return -1; // undefined
      buf = 0;
      for (var i = 0; i < len; ++i) {
          buf = buf << 8 | stream.get();
      }return buf;
  };
  ASN1.hasContent = function (tag, len, stream) {
      if (tag & 0x20) // constructed
          return true;
      if (tag < 0x03 || tag > 0x04) return false;
      var p = new Stream(stream);
      if (tag == 0x03) p.get(); // BitString unused bits, must be in [0, 7]
      var subTag = p.get();
      if (subTag >> 6 & 0x01) // not (universal or context)
          return false;
      try {
          var subLength = ASN1.decodeLength(p);
          return p.pos - stream.pos + subLength == len;
      } catch (exception) {
          return false;
      }
  };
  ASN1.decode = function (stream) {
      if (!(stream instanceof Stream)) stream = new Stream(stream, 0);
      var streamStart = new Stream(stream),
          tag = stream.get(),
          len = ASN1.decodeLength(stream),
          header = stream.pos - streamStart.pos,
          sub = null;
      if (ASN1.hasContent(tag, len, stream)) {
          // it has content, so we decode it
          var start = stream.pos;
          if (tag == 0x03) stream.get(); // skip BitString unused bits, must be in [0, 7]
          sub = [];
          if (len >= 0) {
              // definite length
              var end = start + len;
              while (stream.pos < end) {
                  sub[sub.length] = ASN1.decode(stream);
              }if (stream.pos != end) throw "Content size is not correct for container starting at offset " + start;
          } else {
              // undefined length
              try {
                  for (;;) {
                      var s = ASN1.decode(stream);
                      if (s.tag === 0) break;
                      sub[sub.length] = s;
                  }
                  len = start - stream.pos;
              } catch (e) {
                  throw "Exception while decoding undefined length content: " + e;
              }
          }
      } else stream.pos += len; // skip content
      return new ASN1(streamStart, header, len, tag, sub);
  };
  ASN1.test = function () {
      var test = [{ value: [0x27], expected: 0x27 }, { value: [0x81, 0xC9], expected: 0xC9 }, { value: [0x83, 0xFE, 0xDC, 0xBA], expected: 0xFEDCBA }];
      for (var i = 0, max = test.length; i < max; ++i) {
          var stream = new Stream(test[i].value, 0),
              res = ASN1.decodeLength(stream);
          if (res != test[i].expected) document.write("In test[" + i + "] expected " + test[i].expected + " got " + res + "\n");
      }
  };

  // prng4.js - uses Arcfour as a PRNG

  var Arcfour = function Arcfour() {
    classCallCheck(this, Arcfour);

    this.i = 0;
    this.j = 0;
    this.S = [];
  };

  // Initialize arcfour context from key, an array of ints, each from [0..255]
  function ARC4init(key) {
    var i, j, t;
    for (i = 0; i < 256; ++i) {
      this.S[i] = i;
    }j = 0;
    for (i = 0; i < 256; ++i) {
      j = j + this.S[i] + key[i % key.length] & 255;
      t = this.S[i];
      this.S[i] = this.S[j];
      this.S[j] = t;
    }
    this.i = 0;
    this.j = 0;
  }

  function ARC4next() {
    var t;
    this.i = this.i + 1 & 255;
    this.j = this.j + this.S[this.i] & 255;
    t = this.S[this.i];
    this.S[this.i] = this.S[this.j];
    this.S[this.j] = t;
    return this.S[t + this.S[this.i] & 255];
  }

  Arcfour.prototype.init = ARC4init;
  Arcfour.prototype.next = ARC4next;

  // Plug in your RNG constructor here
  function prng_newstate() {
    return new Arcfour();
  }

  // Pool size must be a multiple of 4 and greater than 32.
  // An array of bytes the size of the pool will be passed to init()
  var rng_psize = 256;

  // Random number generator - requires a PRNG backend, e.g. prng4.js
  var rng_state;
  var rng_pool;
  var rng_pptr;

  // Initialize the pool with junk if needed.
  if (rng_pool == null) {
    rng_pool = new Array();
    rng_pptr = 0;
    var t;
    if (window.crypto && window.crypto.getRandomValues) {
      // Extract entropy (2048 bits) from RNG if available
      var z = new Uint32Array(256);
      window.crypto.getRandomValues(z);
      for (t = 0; t < z.length; ++t) {
        rng_pool[rng_pptr++] = z[t] & 255;
      }
    }

    // Use mouse events for entropy, if we do not have enough entropy by the time
    // we need it, entropy will be generated by Math.random.
    var onMouseMoveListener = function onMouseMoveListener(ev) {
      this.count = this.count || 0;
      if (this.count >= 256 || rng_pptr >= rng_psize) {
        if (window.removeEventListener) window.removeEventListener("mousemove", onMouseMoveListener, false);else if (window.detachEvent) window.detachEvent("onmousemove", onMouseMoveListener);
        return;
      }
      try {
        var mouseCoordinates = ev.x + ev.y;
        rng_pool[rng_pptr++] = mouseCoordinates & 255;
        this.count += 1;
      } catch (e) {
        // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
      }
    };
    if (window.addEventListener) window.addEventListener("mousemove", onMouseMoveListener, false);else if (window.attachEvent) window.attachEvent("onmousemove", onMouseMoveListener);
  }

  function rng_get_byte() {
    if (rng_state == null) {
      rng_state = prng_newstate();
      // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
      while (rng_pptr < rng_psize) {
        var random = Math.floor(65536 * Math.random());
        rng_pool[rng_pptr++] = random & 255;
      }
      rng_state.init(rng_pool);
      for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
        rng_pool[rng_pptr] = 0;
      }rng_pptr = 0;
    }
    // TODO: allow reseeding after first request
    return rng_state.next();
  }

  function rng_get_bytes(ba) {
    var i;
    for (i = 0; i < ba.length; ++i) {
      ba[i] = rng_get_byte();
    }
  }

  var SecureRandom = function SecureRandom() {
    classCallCheck(this, SecureRandom);
  };

  SecureRandom.prototype.nextBytes = rng_get_bytes;

  // Copyright (c) 2005  Tom Wu
  // All Rights Reserved.
  // See "LICENSE" for details.

  // Basic JavaScript BN library - subset useful for RSA encryption.

  // Bits per digit
  var dbits;

  // (public) Constructor
  var BigInteger = function BigInteger(a, b, c) {
    classCallCheck(this, BigInteger);

    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);else if (b == null && "string" != typeof a) this.fromString(a, 256);else this.fromString(a, b);
  };

  // return new, unset BigInteger
  function nbi() {
    return new BigInteger(null);
  }

  // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.

  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 0x4000000);
      w[j++] = v & 0x3ffffff;
    }
    return c;
  }
  // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
  function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
        xh = x >> 15;
    while (--n >= 0) {
      var l = this[i] & 0x7fff;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 0x3fffffff;
    }
    return c;
  }
  // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.
  function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
        xh = x >> 14;
    while (--n >= 0) {
      var l = this[i] & 0x3fff;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 0xfffffff;
    }
    return c;
  }
  if ( navigator.appName == "Microsoft Internet Explorer") {
    BigInteger.prototype.am = am2;
    dbits = 30;
  } else if ( navigator.appName != "Netscape") {
    BigInteger.prototype.am = am1;
    dbits = 26;
  } else {
    // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }

  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;

  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP;

  // Digit conversions
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = [];
  var rr, vv;
  rr = "0".charCodeAt(0);
  for (vv = 0; vv <= 9; ++vv) {
    BI_RC[rr++] = vv;
  }rr = "a".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
  }rr = "A".charCodeAt(0);
  for (vv = 10; vv < 36; ++vv) {
    BI_RC[rr++] = vv;
  }function int2char(n) {
    return BI_RM.charAt(n);
  }
  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  }

  // (protected) copy this to r
  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) {
      r[i] = this[i];
    }r.t = this.t;
    r.s = this.s;
  }

  // (protected) set from integer value x, -DV <= x < DV
  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0) this[0] = x;else if (x < -1) this[0] = x + this.DV;else this.t = 0;
  }

  // return bigint initialized to value
  function nbv(i) {
    var r = nbi();r.fromInt(i);return r;
  }

  // (protected) set from string and radix
  function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else {
        this.fromRadix(s, b);return;
      }
    this.t = 0;
    this.s = 0;
    var i = s.length,
        mi = false,
        sh = 0;
    while (--i >= 0) {
      var x = k == 8 ? s[i] & 0xff : intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-") mi = true;
        continue;
      }
      mi = false;
      if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this[this.t++] = x >> this.DB - sh;
      } else this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB) sh -= this.DB;
    }
    if (k == 8 && (s[0] & 0x80) != 0) {
      this.s = -1;
      if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }
    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
  }

  // (protected) clamp off excess high words
  function bnpClamp() {
    var c = this.s & this.DM;
    while (this.t > 0 && this[this.t - 1] == c) {
      --this.t;
    }
  }

  // (public) return string representation in given radix
  function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else return this.toRadix(b);
    var km = (1 << k) - 1,
        d,
        m = false,
        r = "",
        i = this.t;
    var p = this.DB - i * this.DB % k;
    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;r = int2char(d);
      }
      while (i >= 0) {
        if (p < k) {
          d = (this[i] & (1 << p) - 1) << k - p;
          d |= this[--i] >> (p += this.DB - k);
        } else {
          d = this[i] >> (p -= k) & km;
          if (p <= 0) {
            p += this.DB;--i;
          }
        }
        if (d > 0) m = true;
        if (m) r += int2char(d);
      }
    }
    return m ? r : "0";
  }

  // (public) -this
  function bnNegate() {
    var r = nbi();BigInteger.ZERO.subTo(this, r);return r;
  }

  // (public) |this|
  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  }

  // (public) return + if this > a, - if this < a, 0 if equal
  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return this.s < 0 ? -r : r;
    while (--i >= 0) {
      if ((r = this[i] - a[i]) != 0) return r;
    }return 0;
  }

  // returns bit length of the integer x
  function nbits(x) {
    var r = 1,
        t;
    if ((t = x >>> 16) != 0) {
      x = t;r += 16;
    }
    if ((t = x >> 8) != 0) {
      x = t;r += 8;
    }
    if ((t = x >> 4) != 0) {
      x = t;r += 4;
    }
    if ((t = x >> 2) != 0) {
      x = t;r += 2;
    }
    if ((t = x >> 1) != 0) {
      x = t;r += 1;
    }
    return r;
  }

  // (public) return the number of bits in "this"
  function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
  }

  // (protected) r = this << n*DB
  function bnpDLShiftTo(n, r) {
    var i;
    for (i = this.t - 1; i >= 0; --i) {
      r[i + n] = this[i];
    }for (i = n - 1; i >= 0; --i) {
      r[i] = 0;
    }r.t = this.t + n;
    r.s = this.s;
  }

  // (protected) r = this >> n*DB
  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) {
      r[i - n] = this[i];
    }r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  }

  // (protected) r = this << n
  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
        c = this.s << bs & this.DM,
        i;
    for (i = this.t - 1; i >= 0; --i) {
      r[i + ds + 1] = this[i] >> cbs | c;
      c = (this[i] & bm) << bs;
    }
    for (i = ds - 1; i >= 0; --i) {
      r[i] = 0;
    }r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  }

  // (protected) r = this >> n
  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);
    if (ds >= this.t) {
      r.t = 0;return;
    }
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;
    for (var i = ds + 1; i < this.t; ++i) {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }
    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  }

  // (protected) r = this - a
  function bnpSubTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);
    while (i < m) {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c -= a.s;
      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c -= a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  }

  // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.
  function bnpMultiplyTo(a, r) {
    var x = this.abs(),
        y = a.abs();
    var i = x.t;
    r.t = i + y.t;
    while (--i >= 0) {
      r[i] = 0;
    }for (i = 0; i < y.t; ++i) {
      r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
    }r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
  }

  // (protected) r = this^2, r != this (HAC 14.16)
  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;
    while (--i >= 0) {
      r[i] = 0;
    }for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);
      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }
    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  }

  // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.
  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();
    if (pt.t < pm.t) {
      if (q != null) q.fromInt(0);
      if (r != null) this.copyTo(r);
      return;
    }
    if (r == null) r = nbi();
    var y = nbi(),
        ts = this.s,
        ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
    if (nsh > 0) {
      pm.lShiftTo(nsh, y);pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);pt.copyTo(r);
    }
    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
        d2 = (1 << this.F1) / yt,
        e = 1 << this.F2;
    var i = r.t,
        j = i - ys,
        t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);
    if (r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t, r);
    }
    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later
    while (y.t < ys) {
      y[y.t++] = 0;
    }while (--j >= 0) {
      // Estimate quotient digit
      var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);
        while (r[i] < --qd) {
          r.subTo(t, r);
        }
      }
    }
    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }
    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
    if (ts < 0) BigInteger.ZERO.subTo(r, r);
  }

  // (public) this mod a
  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
  }

  // Modular reduction using "classic" algorithm
  var Classic = function Classic(m) {
    classCallCheck(this, Classic);

    this.m = m;
  };
  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);else return x;
  }
  function cRevert(x) {
    return x;
  }
  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }
  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);this.reduce(r);
  }
  function cSqrTo(x, r) {
    x.squareTo(r);this.reduce(r);
  }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo;

  // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.
  function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2
    y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4
    y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8
    y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
    y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV
    return y > 0 ? this.DV - y : -y;
  }

  // Montgomery reduction
  var Montgomery = function Montgomery(m) {
    classCallCheck(this, Montgomery);

    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  };

  // xR mod m
  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
  }

  // x/R mod m
  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  }

  // x = x/R mod m (HAC 14.32)
  function montReduce(x) {
    while (x.t <= this.mt2) {
      // pad x so am has enough room later
      x[x.t++] = 0;
    }for (var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i] & 0x7fff;
      var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM;
      // use am to combine the multiply-shift-add into one call
      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
      // propagate carry
      while (x[j] >= x.DV) {
        x[j] -= x.DV;x[++j]++;
      }
    }
    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  }

  // r = "x^2/R mod m"; x != r
  function montSqrTo(x, r) {
    x.squareTo(r);this.reduce(r);
  }

  // r = "xy/R mod m"; x,y != r
  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);this.reduce(r);
  }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo;

  // (protected) true iff this is even
  function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0;
  }

  // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
  function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
        r2 = nbi(),
        g = z.convert(this),
        i = nbits(e) - 1;
    g.copyTo(r);
    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0) z.mulTo(r2, g, r);else {
        var t = r;r = r2;r2 = t;
      }
    }
    return z.revert(r);
  }

  // (public) this^e % m, 0 <= e < 2^32
  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);else z = new Montgomery(m);
    return this.exp(e, z);
  }

  // protected
  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp;

  // public
  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt;

  // "constants"
  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1);

  // Copyright (c) 2005-2009  Tom Wu
  // (public)
  function bnClone() {
    var r = nbi();this.copyTo(r);return r;
  }

  // (public) return value as integer
  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1) return this[0] - this.DV;else if (this.t == 0) return -1;
    } else if (this.t == 1) return this[0];else if (this.t == 0) return 0;
    // assumes 16 < DB < 32
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  }

  // (public) return value as byte
  function bnByteValue() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  }

  // (public) return value as short (assumes DB>=16)
  function bnShortValue() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  }

  // (protected) return x s.t. r^x < DV
  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  }

  // (public) 0 if this == 0, 1 if this > 0
  function bnSigNum() {
    if (this.s < 0) return -1;else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;else return 1;
  }

  // (protected) convert to radix string
  function bnpToRadix(b) {
    if (b == null) b = 10;
    if (this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
        y = nbi(),
        z = nbi(),
        r = "";
    this.divRemTo(d, y, z);
    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }
    return z.intValue().toString(b) + r;
  }

  // (protected) convert from radix string
  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
        mi = false,
        j = 0,
        w = 0;
    for (var i = 0; i < s.length; ++i) {
      var x = intAt(s, i);
      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }
      w = b * w + x;
      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }
    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }
    if (mi) BigInteger.ZERO.subTo(this, this);
  }

  // (protected) alternate constructor
  function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
      // new BigInteger(int,int,RNG)
      if (a < 2) this.fromInt(1);else {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1)) // force MSB set
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven()) this.dAddOffset(1, 0); // force odd
        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      // new BigInteger(int,RNG)
      var x = [],
          t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0) x[0] &= (1 << t) - 1;else x[0] = 0;
      this.fromString(x, 256);
    }
  }

  // (public) convert to bigendian byte array
  function bnToByteArray() {
    var i = this.t,
        r = [];
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8,
        d,
        k = 0;
    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) r[k++] = d | this.s << this.DB - p;
      while (i >= 0) {
        if (p < 8) {
          d = (this[i] & (1 << p) - 1) << 8 - p;
          d |= this[--i] >> (p += this.DB - 8);
        } else {
          d = this[i] >> (p -= 8) & 0xff;
          if (p <= 0) {
            p += this.DB;--i;
          }
        }
        if ((d & 0x80) != 0) d |= -256;
        if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
        if (k > 0 || d != this.s) r[k++] = d;
      }
    }
    return r;
  }

  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }
  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }
  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  }

  // (protected) r = this op a (bitwise)
  function bnpBitwiseTo(a, op, r) {
    var i,
        f,
        m = Math.min(a.t, this.t);
    for (i = 0; i < m; ++i) {
      r[i] = op(this[i], a[i]);
    }if (a.t < this.t) {
      f = a.s & this.DM;
      for (i = m; i < this.t; ++i) {
        r[i] = op(this[i], f);
      }r.t = this.t;
    } else {
      f = this.s & this.DM;
      for (i = m; i < a.t; ++i) {
        r[i] = op(f, a[i]);
      }r.t = a.t;
    }
    r.s = op(this.s, a.s);
    r.clamp();
  }

  // (public) this & a
  function op_and(x, y) {
    return x & y;
  }
  function bnAnd(a) {
    var r = nbi();this.bitwiseTo(a, op_and, r);return r;
  }

  // (public) this | a
  function op_or(x, y) {
    return x | y;
  }
  function bnOr(a) {
    var r = nbi();this.bitwiseTo(a, op_or, r);return r;
  }

  // (public) this ^ a
  function op_xor(x, y) {
    return x ^ y;
  }
  function bnXor(a) {
    var r = nbi();this.bitwiseTo(a, op_xor, r);return r;
  }

  // (public) this & ~a
  function op_andnot(x, y) {
    return x & ~y;
  }
  function bnAndNot(a) {
    var r = nbi();this.bitwiseTo(a, op_andnot, r);return r;
  }

  // (public) ~this
  function bnNot() {
    var r = nbi();
    for (var i = 0; i < this.t; ++i) {
      r[i] = this.DM & ~this[i];
    }r.t = this.t;
    r.s = ~this.s;
    return r;
  }

  // (public) this << n
  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0) this.rShiftTo(-n, r);else this.lShiftTo(n, r);
    return r;
  }

  // (public) this >> n
  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0) this.lShiftTo(-n, r);else this.rShiftTo(n, r);
    return r;
  }

  // return index of lowest 1-bit in x, x < 2^31
  function lbit(x) {
    if (x == 0) return -1;
    var r = 0;
    if ((x & 0xffff) == 0) {
      x >>= 16;r += 16;
    }
    if ((x & 0xff) == 0) {
      x >>= 8;r += 8;
    }
    if ((x & 0xf) == 0) {
      x >>= 4;r += 4;
    }
    if ((x & 3) == 0) {
      x >>= 2;r += 2;
    }
    if ((x & 1) == 0) ++r;
    return r;
  }

  // (public) returns index of lowest 1-bit (or -1 if none)
  function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i) {
      if (this[i] != 0) return i * this.DB + lbit(this[i]);
    }if (this.s < 0) return this.t * this.DB;
    return -1;
  }

  // return number of 1 bits in x
  function cbit(x) {
    var r = 0;
    while (x != 0) {
      x &= x - 1;++r;
    }
    return r;
  }

  // (public) return number of set bits
  function bnBitCount() {
    var r = 0,
        x = this.s & this.DM;
    for (var i = 0; i < this.t; ++i) {
      r += cbit(this[i] ^ x);
    }return r;
  }

  // (public) true iff nth bit is set
  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t) return this.s != 0;
    return (this[j] & 1 << n % this.DB) != 0;
  }

  // (protected) this op (1<<n)
  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  }

  // (public) this | (1<<n)
  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  }

  // (public) this & ~(1<<n)
  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  }

  // (public) this ^ (1<<n)
  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  }

  // (protected) r = this + a
  function bnpAddTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);
    while (i < m) {
      c += this[i] + a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }
    if (a.t < this.t) {
      c += a.s;
      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += this.s;
    } else {
      c += this.s;
      while (i < a.t) {
        c += a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }
      c += a.s;
    }
    r.s = c < 0 ? -1 : 0;
    if (c > 0) r[i++] = c;else if (c < -1) r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  }

  // (public) this + a
  function bnAdd(a) {
    var r = nbi();this.addTo(a, r);return r;
  }

  // (public) this - a
  function bnSubtract(a) {
    var r = nbi();this.subTo(a, r);return r;
  }

  // (public) this * a
  function bnMultiply(a) {
    var r = nbi();this.multiplyTo(a, r);return r;
  }

  // (public) this^2
  function bnSquare() {
    var r = nbi();this.squareTo(r);return r;
  }

  // (public) this / a
  function bnDivide(a) {
    var r = nbi();this.divRemTo(a, r, null);return r;
  }

  // (public) this % a
  function bnRemainder(a) {
    var r = nbi();this.divRemTo(a, null, r);return r;
  }

  // (public) [this/a,this%a]
  function bnDivideAndRemainder(a) {
    var q = nbi(),
        r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  }

  // (protected) this *= n, this >= 0, 1 < n < DV
  function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  }

  // (protected) this += n << w words, this >= 0
  function bnpDAddOffset(n, w) {
    if (n == 0) return;
    while (this.t <= w) {
      this[this.t++] = 0;
    }this[w] += n;
    while (this[w] >= this.DV) {
      this[w] -= this.DV;
      if (++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  }

  // A "null" reducer
  function NullExp() {}
  function nNop(x) {
    return x;
  }
  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }
  function nSqrTo(x, r) {
    x.squareTo(r);
  }

  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo;

  // (public) this^e
  function bnPow(e) {
    return this.exp(e, new NullExp());
  }

  // (protected) r = lower n words of "this * a", a.t <= n
  // "this" should be the larger one if appropriate.
  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0; // assumes a,this >= 0
    r.t = i;
    while (i > 0) {
      r[--i] = 0;
    }var j;
    for (j = r.t - this.t; i < j; ++i) {
      r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
    }for (j = Math.min(a.t, n); i < j; ++i) {
      this.am(0, a[i], r, i, 0, n - i);
    }r.clamp();
  }

  // (protected) r = "this * a" without lower n words, n > 0
  // "this" should be the larger one if appropriate.
  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0; // assumes a,this >= 0
    while (--i >= 0) {
      r[i] = 0;
    }for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
      r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
    }r.clamp();
    r.drShiftTo(1, r);
  }

  // Barrett modular reduction
  function Barrett(m) {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }

  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);else if (x.compareTo(this.m) < 0) return x;else {
      var r = nbi();x.copyTo(r);this.reduce(r);return r;
    }
  }

  function barrettRevert(x) {
    return x;
  }

  // x = x mod m (HAC 14.42)
  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);
    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;x.clamp();
    }
    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
    while (x.compareTo(this.r2) < 0) {
      x.dAddOffset(1, this.m.t + 1);
    }x.subTo(this.r2, x);
    while (x.compareTo(this.m) >= 0) {
      x.subTo(this.m, x);
    }
  }

  // r = x^2 mod m; x != r
  function barrettSqrTo(x, r) {
    x.squareTo(r);this.reduce(r);
  }

  // r = x*y mod m; x,y != r
  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);this.reduce(r);
  }

  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo;

  // (public) this^e % m (HAC 14.85)
  function bnModPow(e, m) {
    var i = e.bitLength(),
        k,
        r = nbv(1),
        z;
    if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;
    if (i < 8) z = new Classic(m);else if (m.isEven()) z = new Barrett(m);else z = new Montgomery(m);

    // precomputation
    var g = [],
        n = 3,
        k1 = k - 1,
        km = (1 << k) - 1;
    g[1] = z.convert(this);
    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);
      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }

    var j = e.t - 1,
        w,
        is1 = true,
        r2 = nbi(),
        t;
    i = nbits(e[j]) - 1;
    while (j >= 0) {
      if (i >= k1) w = e[j] >> i - k1 & km;else {
        w = (e[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
      }

      n = k;
      while ((w & 1) == 0) {
        w >>= 1;--n;
      }
      if ((i -= n) < 0) {
        i += this.DB;--j;
      }
      if (is1) {
        // ret == 1, don't bother squaring or multiplying it
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);z.sqrTo(r2, r);n -= 2;
        }
        if (n > 0) z.sqrTo(r, r2);else {
          t = r;r = r2;r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }

      while (j >= 0 && (e[j] & 1 << i) == 0) {
        z.sqrTo(r, r2);t = r;r = r2;r2 = t;
        if (--i < 0) {
          i = this.DB - 1;--j;
        }
      }
    }
    return z.revert(r);
  }

  // (public) gcd(this,a) (HAC 14.54)
  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();
    if (x.compareTo(y) < 0) {
      var t = x;x = y;y = t;
    }
    var i = x.getLowestSetBit(),
        g = y.getLowestSetBit();
    if (g < 0) return x;
    if (i < g) g = i;
    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }
    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);
      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }
    if (g > 0) y.lShiftTo(g, y);
    return y;
  }

  // (protected) this % n, n < 2^26
  function bnpModInt(n) {
    if (n <= 0) return 0;
    var d = this.DV % n,
        r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0) if (d == 0) r = this[0] % n;else for (var i = this.t - 1; i >= 0; --i) {
      r = (d * r + this[i]) % n;
    }return r;
  }

  // (public) 1/this % m (HAC 14.61)
  function bnModInverse(m) {
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
    var u = m.clone(),
        v = this.clone();
    var a = nbv(1),
        b = nbv(0),
        c = nbv(0),
        d = nbv(1);
    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);
        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);b.subTo(m, b);
          }
          a.rShiftTo(1, a);
        } else if (!b.isEven()) b.subTo(m, b);
        b.rShiftTo(1, b);
      }
      while (v.isEven()) {
        v.rShiftTo(1, v);
        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);d.subTo(m, d);
          }
          c.rShiftTo(1, c);
        } else if (!d.isEven()) d.subTo(m, d);
        d.rShiftTo(1, d);
      }
      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac) a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac) c.subTo(a, c);
        d.subTo(b, d);
      }
    }
    if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (d.compareTo(m) >= 0) return d.subtract(m);
    if (d.signum() < 0) d.addTo(m, d);else return d;
    if (d.signum() < 0) return d.add(m);else return d;
  }

  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

  // (public) test primality with certainty >= 1-.5^t
  function bnIsProbablePrime(t) {
    var i,
        x = this.abs();
    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0; i < lowprimes.length; ++i) {
        if (x[0] == lowprimes[i]) return true;
      }return false;
    }
    if (x.isEven()) return false;
    i = 1;
    while (i < lowprimes.length) {
      var m = lowprimes[i],
          j = i + 1;
      while (j < lowprimes.length && m < lplim) {
        m *= lowprimes[j++];
      }m = x.modInt(m);
      while (i < j) {
        if (m % lowprimes[i++] == 0) return false;
      }
    }
    return x.millerRabin(t);
  }

  // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0) return false;
    var r = n1.shiftRight(k);
    t = t + 1 >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var a = nbi();
    for (var i = 0; i < t; ++i) {
      //Pick bases at random, instead of starting at 2
      a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
      var y = a.modPow(r, this);
      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;
        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0) return false;
        }
        if (y.compareTo(n1) != 0) return false;
      }
    }
    return true;
  }

  // protected
  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin;

  // public
  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

  // JSBN-specific extension
  BigInteger.prototype.square = bnSquare;

  // BigInteger interfaces not implemented in jsbn:

  // BigInteger(int signum, byte[] magnitude)
  // double doubleValue()
  // float floatValue()
  // int hashCode()
  // long longValue()
  // static BigInteger valueOf(long val)

  // Version 1.1: support utf-8 encoding in pkcs1pad2

  function parseBigInt(str, r) {
    return new BigInteger(str, r);
  }

  // PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
  function pkcs1pad2(s, n) {
    if (n < s.length + 11) {
      // TODO: fix for utf-8
      console.error("Message too long for RSA");
      return null;
    }
    var ba = [];
    var i = s.length - 1;
    while (i >= 0 && n > 0) {
      var c = s.charCodeAt(i--);
      if (c < 128) {
        // encode using utf-8
        ba[--n] = c;
      } else if (c > 127 && c < 2048) {
        ba[--n] = c & 63 | 128;
        ba[--n] = c >> 6 | 192;
      } else {
        ba[--n] = c & 63 | 128;
        ba[--n] = c >> 6 & 63 | 128;
        ba[--n] = c >> 12 | 224;
      }
    }
    ba[--n] = 0;
    var rng = new SecureRandom();
    var x = [];
    while (n > 2) {
      // random non-zero pad
      x[0] = 0;
      while (x[0] == 0) {
        rng.nextBytes(x);
      }ba[--n] = x[0];
    }
    ba[--n] = 2;
    ba[--n] = 0;
    return new BigInteger(ba);
  }

  // "empty" RSA key constructor
  var RSAKey = function RSAKey() {
    classCallCheck(this, RSAKey);

    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
  };

  // Set the public key fields N and e from hex strings
  function RSASetPublic(N, E) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = parseBigInt(N, 16);
      this.e = parseInt(E, 16);
    } else console.error("Invalid RSA public key");
  }

  // Perform raw public operation on "x": return x^e (mod n)
  function RSADoPublic(x) {
    return x.modPowInt(this.e, this.n);
  }

  // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
  function RSAEncrypt(text) {
    var m = pkcs1pad2(text, this.n.bitLength() + 7 >> 3);
    if (m == null) return null;
    var c = this.doPublic(m);
    if (c == null) return null;
    var h = c.toString(16);
    if ((h.length & 1) == 0) return h;else return "0" + h;
  }

  // Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
  //function RSAEncryptB64(text) {
  //  var h = this.encrypt(text);
  //  if(h) return hex2b64(h); else return null;
  //}

  // protected
  RSAKey.prototype.doPublic = RSADoPublic;

  // public
  RSAKey.prototype.setPublic = RSASetPublic;
  RSAKey.prototype.encrypt = RSAEncrypt;

  // Version 1.1: support utf-8 decoding in pkcs1unpad2

  function pkcs1unpad2(d, n) {
    var b = d.toByteArray();
    var i = 0;
    while (i < b.length && b[i] == 0) {
      ++i;
    }if (b.length - i != n - 1 || b[i] != 2) return null;
    ++i;
    while (b[i] != 0) {
      if (++i >= b.length) return null;
    }var ret = "";
    while (++i < b.length) {
      var c = b[i] & 255;
      if (c < 128) {
        // utf-8 decode
        ret += String.fromCharCode(c);
      } else if (c > 191 && c < 224) {
        ret += String.fromCharCode((c & 31) << 6 | b[i + 1] & 63);
        ++i;
      } else {
        ret += String.fromCharCode((c & 15) << 12 | (b[i + 1] & 63) << 6 | b[i + 2] & 63);
        i += 2;
      }
    }
    return ret;
  }

  // Set the private key fields N, e, and d from hex strings
  function RSASetPrivate(N, E, D) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = parseBigInt(N, 16);
      this.e = parseInt(E, 16);
      this.d = parseBigInt(D, 16);
    } else console.error("Invalid RSA private key");
  }

  // Set the private key fields N, e, d and CRT params from hex strings
  function RSASetPrivateEx(N, E, D, P, Q, DP, DQ, C) {
    if (N != null && E != null && N.length > 0 && E.length > 0) {
      this.n = parseBigInt(N, 16);
      this.e = parseInt(E, 16);
      this.d = parseBigInt(D, 16);
      this.p = parseBigInt(P, 16);
      this.q = parseBigInt(Q, 16);
      this.dmp1 = parseBigInt(DP, 16);
      this.dmq1 = parseBigInt(DQ, 16);
      this.coeff = parseBigInt(C, 16);
    } else console.error("Invalid RSA private key");
  }

  // Generate a new random private key B bits long, using public expt E
  function RSAGenerate(B, E) {
    var rng = new SecureRandom();
    var qs = B >> 1;
    this.e = parseInt(E, 16);
    var ee = new BigInteger(E, 16);
    for (;;) {
      for (;;) {
        this.p = new BigInteger(B - qs, 1, rng);
        if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
      }
      for (;;) {
        this.q = new BigInteger(qs, 1, rng);
        if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
      }
      if (this.p.compareTo(this.q) <= 0) {
        var t = this.p;
        this.p = this.q;
        this.q = t;
      }
      var p1 = this.p.subtract(BigInteger.ONE);
      var q1 = this.q.subtract(BigInteger.ONE);
      var phi = p1.multiply(q1);
      if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
        this.n = this.p.multiply(this.q);
        this.d = ee.modInverse(phi);
        this.dmp1 = this.d.mod(p1);
        this.dmq1 = this.d.mod(q1);
        this.coeff = this.q.modInverse(this.p);
        break;
      }
    }
  }

  // Perform raw private operation on "x": return x^d (mod n)
  function RSADoPrivate(x) {
    if (this.p == null || this.q == null) return x.modPow(this.d, this.n);

    // TODO: re-calculate any missing CRT params
    var xp = x.mod(this.p).modPow(this.dmp1, this.p);
    var xq = x.mod(this.q).modPow(this.dmq1, this.q);

    while (xp.compareTo(xq) < 0) {
      xp = xp.add(this.p);
    }return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq);
  }

  // Return the PKCS#1 RSA decryption of "ctext".
  // "ctext" is an even-length hex string and the output is a plain string.
  function RSADecrypt(ctext) {
    var c = parseBigInt(ctext, 16);
    var m = this.doPrivate(c);
    if (m == null) return null;
    return pkcs1unpad2(m, this.n.bitLength() + 7 >> 3);
  }

  // Return the PKCS#1 RSA decryption of "ctext".
  // "ctext" is a Base64-encoded string and the output is a plain string.
  //function RSAB64Decrypt(ctext) {
  //  var h = b64tohex(ctext);
  //  if(h) return this.decrypt(h); else return null;
  //}

  // protected
  RSAKey.prototype.doPrivate = RSADoPrivate;

  // public
  RSAKey.prototype.setPrivate = RSASetPrivate;
  RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
  RSAKey.prototype.generate = RSAGenerate;
  RSAKey.prototype.decrypt = RSADecrypt;
  //RSAKey.prototype.b64_decrypt = RSAB64Decrypt;

  // Base64 JavaScript decoder
  // Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>

  // Permission to use, copy, modify, and/or distribute this software for any
  // purpose with or without fee is hereby granted, provided that the above
  // copyright notice and this permission notice appear in all copies.
  // 
  // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */

  var Base64 = {};
  var decoder = void 0;

  Base64.decode = function (a) {
      var i;
      if (decoder === undefined) {
          var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
              ignore = "= \f\n\r\t\xA0\u2028\u2029";
          decoder = [];
          for (i = 0; i < 64; ++i) {
              decoder[b64.charAt(i)] = i;
          }for (i = 0; i < ignore.length; ++i) {
              decoder[ignore.charAt(i)] = -1;
          }
      }
      var out = [];
      var bits = 0,
          char_count = 0;
      for (i = 0; i < a.length; ++i) {
          var c = a.charAt(i);
          if (c == '=') break;
          c = decoder[c];
          if (c == -1) continue;
          if (c === undefined) throw 'Illegal character at offset ' + i;
          bits |= c;
          if (++char_count >= 4) {
              out[out.length] = bits >> 16;
              out[out.length] = bits >> 8 & 0xFF;
              out[out.length] = bits & 0xFF;
              bits = 0;
              char_count = 0;
          } else {
              bits <<= 6;
          }
      }
      switch (char_count) {
          case 1:
              throw "Base64 encoding incomplete: at least 2 bits missing";
          case 2:
              out[out.length] = bits >> 10;
              break;
          case 3:
              out[out.length] = bits >> 16;
              out[out.length] = bits >> 8 & 0xFF;
              break;
      }
      return out;
  };

  Base64.re = /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/;
  Base64.unarmor = function (a) {
      var m = Base64.re.exec(a);
      if (m) {
          if (m[1]) a = m[1];else if (m[2]) a = m[2];else throw "RegExp out of sync";
      }
      return Base64.decode(a);
  };

  // Hex JavaScript decoder
  // Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>

  // Permission to use, copy, modify, and/or distribute this software for any
  // purpose with or without fee is hereby granted, provided that the above
  // copyright notice and this permission notice appear in all copies.
  // 
  // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
  // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
  // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
  // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
  // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
  // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
  // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

  /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
  var Hex = {};
  var decoder$1 = void 0;

  Hex.decode = function (a) {
      var i;
      if (decoder$1 === undefined) {
          var hex = "0123456789ABCDEF",
              ignore = " \f\n\r\t\xA0\u2028\u2029";
          decoder$1 = [];
          for (i = 0; i < 16; ++i) {
              decoder$1[hex.charAt(i)] = i;
          }hex = hex.toLowerCase();
          for (i = 10; i < 16; ++i) {
              decoder$1[hex.charAt(i)] = i;
          }for (i = 0; i < ignore.length; ++i) {
              decoder$1[ignore.charAt(i)] = -1;
          }
      }
      var out = [],
          bits = 0,
          char_count = 0;
      for (i = 0; i < a.length; ++i) {
          var c = a.charAt(i);
          if (c == '=') break;
          c = decoder$1[c];
          if (c == -1) continue;
          if (c === undefined) throw 'Illegal character at offset ' + i;
          bits |= c;
          if (++char_count >= 2) {
              out[out.length] = bits;
              bits = 0;
              char_count = 0;
          } else {
              bits <<= 4;
          }
      }
      if (char_count) throw "Hex encoding incomplete: 4 bits missing";
      return out;
  };

  /*! asn1-1.0.2.js (c) 2013 Kenji Urushima | kjur.github.com/jsrsasign/license
   */

  var JSX = /*window.JSX || */{};
  JSX.env = JSX.env || {};

  var L = JSX,
      OP = Object.prototype,
      FUNCTION_TOSTRING = '[object Function]',
      ADD = ["toString", "valueOf"];

  JSX.env.parseUA = function (agent) {

      var numberify = function numberify(s) {
          var c = 0;
          return parseFloat(s.replace(/\./g, function () {
              return c++ == 1 ? '' : '.';
          }));
      },
          nav = navigator,
          o = {
          ie: 0,
          opera: 0,
          gecko: 0,
          webkit: 0,
          chrome: 0,
          mobile: null,
          air: 0,
          ipad: 0,
          iphone: 0,
          ipod: 0,
          ios: null,
          android: 0,
          webos: 0,
          caja: nav && nav.cajaVersion,
          secure: false,
          os: null

      },
          ua = agent || navigator && navigator.userAgent,
          loc = window && window.location,
          href = loc && loc.href,
          m;

      o.secure = href && href.toLowerCase().indexOf("https") === 0;

      if (ua) {

          if (/windows|win32/i.test(ua)) {
              o.os = 'windows';
          } else if (/macintosh/i.test(ua)) {
              o.os = 'macintosh';
          } else if (/rhino/i.test(ua)) {
              o.os = 'rhino';
          }
          if (/KHTML/.test(ua)) {
              o.webkit = 1;
          }
          m = ua.match(/AppleWebKit\/([^\s]*)/);
          if (m && m[1]) {
              o.webkit = numberify(m[1]);
              if (/ Mobile\//.test(ua)) {
                  o.mobile = 'Apple'; // iPhone or iPod Touch
                  m = ua.match(/OS ([^\s]*)/);
                  if (m && m[1]) {
                      m = numberify(m[1].replace('_', '.'));
                  }
                  o.ios = m;
                  o.ipad = o.ipod = o.iphone = 0;
                  m = ua.match(/iPad|iPod|iPhone/);
                  if (m && m[0]) {
                      o[m[0].toLowerCase()] = o.ios;
                  }
              } else {
                  m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                  if (m) {
                      o.mobile = m[0];
                  }
                  if (/webOS/.test(ua)) {
                      o.mobile = 'WebOS';
                      m = ua.match(/webOS\/([^\s]*);/);
                      if (m && m[1]) {
                          o.webos = numberify(m[1]);
                      }
                  }
                  if (/ Android/.test(ua)) {
                      o.mobile = 'Android';
                      m = ua.match(/Android ([^\s]*);/);
                      if (m && m[1]) {
                          o.android = numberify(m[1]);
                      }
                  }
              }
              m = ua.match(/Chrome\/([^\s]*)/);
              if (m && m[1]) {
                  o.chrome = numberify(m[1]); // Chrome
              } else {
                  m = ua.match(/AdobeAIR\/([^\s]*)/);
                  if (m) {
                      o.air = m[0]; // Adobe AIR 1.0 or better
                  }
              }
          }
          if (!o.webkit) {
              m = ua.match(/Opera[\s\/]([^\s]*)/);
              if (m && m[1]) {
                  o.opera = numberify(m[1]);
                  m = ua.match(/Version\/([^\s]*)/);
                  if (m && m[1]) {
                      o.opera = numberify(m[1]); // opera 10+
                  }
                  m = ua.match(/Opera Mini[^;]*/);
                  if (m) {
                      o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                  }
              } else {
                  // not opera or webkit
                  m = ua.match(/MSIE\s([^;]*)/);
                  if (m && m[1]) {
                      o.ie = numberify(m[1]);
                  } else {
                      // not opera, webkit, or ie
                      m = ua.match(/Gecko\/([^\s]*)/);
                      if (m) {
                          o.gecko = 1; // Gecko detected, look for revision
                          m = ua.match(/rv:([^\s\)]*)/);
                          if (m && m[1]) {
                              o.gecko = numberify(m[1]);
                          }
                      }
                  }
              }
          }
      }
      return o;
  };

  JSX.env.ua = JSX.env.parseUA();

  JSX.isFunction = function (o) {
      return typeof o === 'function' || OP.toString.apply(o) === FUNCTION_TOSTRING;
  };

  JSX._IEEnumFix = JSX.env.ua.ie ? function (r, s) {
      var i, fname, f;
      for (i = 0; i < ADD.length; i = i + 1) {

          fname = ADD[i];
          f = s[fname];

          if (L.isFunction(f) && f != OP[fname]) {
              r[fname] = f;
          }
      }
  } : function () {};

  JSX.extend = function (subc, superc, overrides) {
      if (!superc || !subc) {
          throw new Error("extend failed, please check that " + "all dependencies are included.");
      }
      var F = function F() {},
          i;
      F.prototype = superc.prototype;
      subc.prototype = new F();
      subc.prototype.constructor = subc;
      subc.superclass = superc.prototype;
      if (superc.prototype.constructor == OP.constructor) {
          superc.prototype.constructor = superc;
      }

      if (overrides) {
          for (i in overrides) {
              if (L.hasOwnProperty(overrides, i)) {
                  subc.prototype[i] = overrides[i];
              }
          }

          L._IEEnumFix(subc.prototype, overrides);
      }
  };

  /*
   * asn1.js - ASN.1 DER encoder classes
   *
   * Copyright (c) 2013 Kenji Urushima (kenji.urushima@gmail.com)
   *
   * This software is licensed under the terms of the MIT License.
   * http://kjur.github.com/jsrsasign/license
   *
   * The above copyright and license notice shall be 
   * included in all copies or substantial portions of the Software.
   */

  /**
   * @fileOverview
   * @name asn1-1.0.js
   * @author Kenji Urushima kenji.urushima@gmail.com
   * @version 1.0.2 (2013-May-30)
   * @since 2.1
   * @license <a href="http://kjur.github.io/jsrsasign/license/">MIT License</a>
   */

  /** 
   * kjur's class library name space
   * <p>
   * This name space provides following name spaces:
   * <ul>
   * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
   * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
   * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature 
   * class and utilities</li>
   * </ul>
   * </p> 
   * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
    * @name KJUR
   * @namespace kjur's class library name space
   */
  // if (typeof KJUR == "undefined" || !KJUR)
  var KJUR = {};

  /**
   * kjur's ASN.1 class library name space
   * <p>
   * This is ITU-T X.690 ASN.1 DER encoder class library and
   * class structure and methods is very similar to 
   * org.bouncycastle.asn1 package of 
   * well known BouncyCaslte Cryptography Library.
   *
   * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
   * Here are ASN.1 DER primitive classes.
   * <ul>
   * <li>{@link KJUR.asn1.DERBoolean}</li>
   * <li>{@link KJUR.asn1.DERInteger}</li>
   * <li>{@link KJUR.asn1.DERBitString}</li>
   * <li>{@link KJUR.asn1.DEROctetString}</li>
   * <li>{@link KJUR.asn1.DERNull}</li>
   * <li>{@link KJUR.asn1.DERObjectIdentifier}</li>
   * <li>{@link KJUR.asn1.DERUTF8String}</li>
   * <li>{@link KJUR.asn1.DERNumericString}</li>
   * <li>{@link KJUR.asn1.DERPrintableString}</li>
   * <li>{@link KJUR.asn1.DERTeletexString}</li>
   * <li>{@link KJUR.asn1.DERIA5String}</li>
   * <li>{@link KJUR.asn1.DERUTCTime}</li>
   * <li>{@link KJUR.asn1.DERGeneralizedTime}</li>
   * <li>{@link KJUR.asn1.DERSequence}</li>
   * <li>{@link KJUR.asn1.DERSet}</li>
   * </ul>
   *
   * <h4>OTHER ASN.1 CLASSES</h4>
   * <ul>
   * <li>{@link KJUR.asn1.ASN1Object}</li>
   * <li>{@link KJUR.asn1.DERAbstractString}</li>
   * <li>{@link KJUR.asn1.DERAbstractTime}</li>
   * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
   * <li>{@link KJUR.asn1.DERTaggedObject}</li>
   * </ul>
   * </p>
   * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
   * @name KJUR.asn1
   * @namespace
   */
  if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) KJUR.asn1 = {};

  /**
   * ASN1 utilities class
   * @name KJUR.asn1.ASN1Util
   * @classs ASN1 utilities class
   * @since asn1 1.0.2
   */
  KJUR.asn1.ASN1Util = new function () {
      this.integerToByteHex = function (i) {
          var h = i.toString(16);
          if (h.length % 2 == 1) h = '0' + h;
          return h;
      };
      this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
          var h = bigIntegerValue.toString(16);
          if (h.substr(0, 1) != '-') {
              if (h.length % 2 == 1) {
                  h = '0' + h;
              } else {
                  if (!h.match(/^[0-7]/)) {
                      h = '00' + h;
                  }
              }
          } else {
              var hPos = h.substr(1);
              var xorLen = hPos.length;
              if (xorLen % 2 == 1) {
                  xorLen += 1;
              } else {
                  if (!h.match(/^[0-7]/)) {
                      xorLen += 2;
                  }
              }
              var hMask = '';
              for (var i = 0; i < xorLen; i++) {
                  hMask += 'f';
              }
              var biMask = new BigInteger(hMask, 16);
              var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
              h = biNeg.toString(16).replace(/^-/, '');
          }
          return h;
      };
      /**
       * get PEM string from hexadecimal data and header string
       * @name getPEMStringFromHex
       * @memberOf KJUR.asn1.ASN1Util
       * @function
       * @param {String} dataHex hexadecimal string of PEM body
       * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
       * @return {String} PEM formatted string of input data
       * @description
       * @example
       * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
       * // value of pem will be:
       * -----BEGIN PRIVATE KEY-----
       * YWFh
       * -----END PRIVATE KEY-----
       */
      this.getPEMStringFromHex = function (dataHex, pemHeader) {
          var dataWA = CryptoJS.enc.Hex.parse(dataHex);
          var dataB64 = CryptoJS.enc.Base64.stringify(dataWA);
          var pemBody = dataB64.replace(/(.{64})/g, "$1\r\n");
          pemBody = pemBody.replace(/\r\n$/, '');
          return "-----BEGIN " + pemHeader + "-----\r\n" + pemBody + "\r\n-----END " + pemHeader + "-----\r\n";
      };
  }();

  // ********************************************************************
  //  Abstract ASN.1 Classes
  // ********************************************************************

  // ********************************************************************

  /**
   * base class for ASN.1 DER encoder object
   * @name KJUR.asn1.ASN1Object
   * @class base class for ASN.1 DER encoder object
   * @property {Boolean} isModified flag whether internal data was changed
   * @property {String} hTLV hexadecimal string of ASN.1 TLV
   * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
   * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
   * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
   * @description
   */
  KJUR.asn1.ASN1Object = function () {
      var hV = '';

      /**
       * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
       * @name getLengthHexFromValue
       * @memberOf KJUR.asn1.ASN1Object
       * @function
       * @return {String} hexadecimal string of ASN.1 TLV length(L)
       */
      this.getLengthHexFromValue = function () {
          if (typeof this.hV == "undefined" || this.hV == null) {
              throw "this.hV is null or undefined.";
          }
          if (this.hV.length % 2 == 1) {
              throw "value hex must be even length: n=" + hV.length + ",v=" + this.hV;
          }
          var n = this.hV.length / 2;
          var hN = n.toString(16);
          if (hN.length % 2 == 1) {
              hN = "0" + hN;
          }
          if (n < 128) {
              return hN;
          } else {
              var hNlen = hN.length / 2;
              if (hNlen > 15) {
                  throw "ASN.1 length too long to represent by 8x: n = " + n.toString(16);
              }
              var head = 128 + hNlen;
              return head.toString(16) + hN;
          }
      };

      /**
       * get hexadecimal string of ASN.1 TLV bytes
       * @name getEncodedHex
       * @memberOf KJUR.asn1.ASN1Object
       * @function
       * @return {String} hexadecimal string of ASN.1 TLV
       */
      this.getEncodedHex = function () {
          if (this.hTLV == null || this.isModified) {
              this.hV = this.getFreshValueHex();
              this.hL = this.getLengthHexFromValue();
              this.hTLV = this.hT + this.hL + this.hV;
              this.isModified = false;
              //console.error("first time: " + this.hTLV);
          }
          return this.hTLV;
      };

      /**
       * get hexadecimal string of ASN.1 TLV value(V) bytes
       * @name getValueHex
       * @memberOf KJUR.asn1.ASN1Object
       * @function
       * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
       */
      this.getValueHex = function () {
          this.getEncodedHex();
          return this.hV;
      };

      this.getFreshValueHex = function () {
          return '';
      };
  };

  // == BEGIN DERAbstractString ================================================
  /**
   * base class for ASN.1 DER string classes
   * @name KJUR.asn1.DERAbstractString
   * @class base class for ASN.1 DER string classes
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @property {String} s internal string of value
   * @extends KJUR.asn1.ASN1Object
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>str - specify initial ASN.1 value(V) by a string</li>
   * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERAbstractString = function (params) {
      KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

      /**
       * get string value of this string object
       * @name getString
       * @memberOf KJUR.asn1.DERAbstractString
       * @function
       * @return {String} string value of this string object
       */
      this.getString = function () {
          return this.s;
      };

      /**
       * set value by a string
       * @name setString
       * @memberOf KJUR.asn1.DERAbstractString
       * @function
       * @param {String} newS value by a string to set
       */
      this.setString = function (newS) {
          this.hTLV = null;
          this.isModified = true;
          this.s = newS;
          this.hV = stohex(this.s);
      };

      /**
       * set value by a hexadecimal string
       * @name setStringHex
       * @memberOf KJUR.asn1.DERAbstractString
       * @function
       * @param {String} newHexString value by a hexadecimal string to set
       */
      this.setStringHex = function (newHexString) {
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = newHexString;
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };

      if (typeof params != "undefined") {
          if (typeof params['str'] != "undefined") {
              this.setString(params['str']);
          } else if (typeof params['hex'] != "undefined") {
              this.setStringHex(params['hex']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
  // == END   DERAbstractString ================================================

  // == BEGIN DERAbstractTime ==================================================
  /**
   * base class for ASN.1 DER Generalized/UTCTime class
   * @name KJUR.asn1.DERAbstractTime
   * @class base class for ASN.1 DER Generalized/UTCTime class
   * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
   * @extends KJUR.asn1.ASN1Object
   * @description
   * @see KJUR.asn1.ASN1Object - superclass
   */
  KJUR.asn1.DERAbstractTime = function (params) {
      KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);

      // --- PRIVATE METHODS --------------------
      this.localDateToUTC = function (d) {
          utc = d.getTime() + d.getTimezoneOffset() * 60000;
          var utcDate = new Date(utc);
          return utcDate;
      };

      this.formatDate = function (dateObject, type) {
          var pad = this.zeroPadding;
          var d = this.localDateToUTC(dateObject);
          var year = String(d.getFullYear());
          if (type == 'utc') year = year.substr(2, 2);
          var month = pad(String(d.getMonth() + 1), 2);
          var day = pad(String(d.getDate()), 2);
          var hour = pad(String(d.getHours()), 2);
          var min = pad(String(d.getMinutes()), 2);
          var sec = pad(String(d.getSeconds()), 2);
          return year + month + day + hour + min + sec + 'Z';
      };

      this.zeroPadding = function (s, len) {
          if (s.length >= len) return s;
          return new Array(len - s.length + 1).join('0') + s;
      };

      // --- PUBLIC METHODS --------------------
      /**
       * get string value of this string object
       * @name getString
       * @memberOf KJUR.asn1.DERAbstractTime
       * @function
       * @return {String} string value of this time object
       */
      this.getString = function () {
          return this.s;
      };

      /**
       * set value by a string
       * @name setString
       * @memberOf KJUR.asn1.DERAbstractTime
       * @function
       * @param {String} newS value by a string to set such like "130430235959Z"
       */
      this.setString = function (newS) {
          this.hTLV = null;
          this.isModified = true;
          this.s = newS;
          this.hV = stohex(this.s);
      };

      /**
       * set value by a Date object
       * @name setByDateValue
       * @memberOf KJUR.asn1.DERAbstractTime
       * @function
       * @param {Integer} year year of date (ex. 2013)
       * @param {Integer} month month of date between 1 and 12 (ex. 12)
       * @param {Integer} day day of month
       * @param {Integer} hour hours of date
       * @param {Integer} min minutes of date
       * @param {Integer} sec seconds of date
       */
      this.setByDateValue = function (year, month, day, hour, min, sec) {
          var dateObject = new Date(Date.UTC(year, month - 1, day, hour, min, sec, 0));
          this.setByDate(dateObject);
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };
  };
  JSX.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
  // == END   DERAbstractTime ==================================================

  // == BEGIN DERAbstractStructured ============================================
  /**
   * base class for ASN.1 DER structured class
   * @name KJUR.asn1.DERAbstractStructured
   * @class base class for ASN.1 DER structured class
   * @property {Array} asn1Array internal array of ASN1Object
   * @extends KJUR.asn1.ASN1Object
   * @description
   * @see KJUR.asn1.ASN1Object - superclass
   */
  KJUR.asn1.DERAbstractStructured = function (params) {
      KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

      /**
       * set value by array of ASN1Object
       * @name setByASN1ObjectArray
       * @memberOf KJUR.asn1.DERAbstractStructured
       * @function
       * @param {array} asn1ObjectArray array of ASN1Object to set
       */
      this.setByASN1ObjectArray = function (asn1ObjectArray) {
          this.hTLV = null;
          this.isModified = true;
          this.asn1Array = asn1ObjectArray;
      };

      /**
       * append an ASN1Object to internal array
       * @name appendASN1Object
       * @memberOf KJUR.asn1.DERAbstractStructured
       * @function
       * @param {ASN1Object} asn1Object to add
       */
      this.appendASN1Object = function (asn1Object) {
          this.hTLV = null;
          this.isModified = true;
          this.asn1Array.push(asn1Object);
      };

      this.asn1Array = new Array();
      if (typeof params != "undefined") {
          if (typeof params['array'] != "undefined") {
              this.asn1Array = params['array'];
          }
      }
  };
  JSX.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);

  // ********************************************************************
  //  ASN.1 Object Classes
  // ********************************************************************

  // ********************************************************************
  /**
   * class for ASN.1 DER Boolean
   * @name KJUR.asn1.DERBoolean
   * @class class for ASN.1 DER Boolean
   * @extends KJUR.asn1.ASN1Object
   * @description
   * @see KJUR.asn1.ASN1Object - superclass
   */
  KJUR.asn1.DERBoolean = function () {
      KJUR.asn1.DERBoolean.superclass.constructor.call(this);
      this.hT = "01";
      this.hTLV = "0101ff";
  };
  JSX.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

  // ********************************************************************
  /**
   * class for ASN.1 DER Integer
   * @name KJUR.asn1.DERInteger
   * @class class for ASN.1 DER Integer
   * @extends KJUR.asn1.ASN1Object
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>int - specify initial ASN.1 value(V) by integer value</li>
   * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
   * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERInteger = function (params) {
      KJUR.asn1.DERInteger.superclass.constructor.call(this);
      this.hT = "02";

      /**
       * set value by Tom Wu's BigInteger object
       * @name setByBigInteger
       * @memberOf KJUR.asn1.DERInteger
       * @function
       * @param {BigInteger} bigIntegerValue to set
       */
      this.setByBigInteger = function (bigIntegerValue) {
          this.hTLV = null;
          this.isModified = true;
          this.hV = KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
      };

      /**
       * set value by integer value
       * @name setByInteger
       * @memberOf KJUR.asn1.DERInteger
       * @function
       * @param {Integer} integer value to set
       */
      this.setByInteger = function (intValue) {
          var bi = new BigInteger(String(intValue), 10);
          this.setByBigInteger(bi);
      };

      /**
       * set value by integer value
       * @name setValueHex
       * @memberOf KJUR.asn1.DERInteger
       * @function
       * @param {String} hexadecimal string of integer value
       * @description
       * <br/>
       * NOTE: Value shall be represented by minimum octet length of
       * two's complement representation.
       */
      this.setValueHex = function (newHexString) {
          this.hV = newHexString;
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };

      if (typeof params != "undefined") {
          if (typeof params['bigint'] != "undefined") {
              this.setByBigInteger(params['bigint']);
          } else if (typeof params['int'] != "undefined") {
              this.setByInteger(params['int']);
          } else if (typeof params['hex'] != "undefined") {
              this.setValueHex(params['hex']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

  // ********************************************************************
  /**
   * class for ASN.1 DER encoded BitString primitive
   * @name KJUR.asn1.DERBitString
   * @class class for ASN.1 DER encoded BitString primitive
   * @extends KJUR.asn1.ASN1Object
   * @description 
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>bin - specify binary string (ex. '10111')</li>
   * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
   * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERBitString = function (params) {
      KJUR.asn1.DERBitString.superclass.constructor.call(this);
      this.hT = "03";

      /**
       * set ASN.1 value(V) by a hexadecimal string including unused bits
       * @name setHexValueIncludingUnusedBits
       * @memberOf KJUR.asn1.DERBitString
       * @function
       * @param {String} newHexStringIncludingUnusedBits
       */
      this.setHexValueIncludingUnusedBits = function (newHexStringIncludingUnusedBits) {
          this.hTLV = null;
          this.isModified = true;
          this.hV = newHexStringIncludingUnusedBits;
      };

      /**
       * set ASN.1 value(V) by unused bit and hexadecimal string of value
       * @name setUnusedBitsAndHexValue
       * @memberOf KJUR.asn1.DERBitString
       * @function
       * @param {Integer} unusedBits
       * @param {String} hValue
       */
      this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
          if (unusedBits < 0 || 7 < unusedBits) {
              throw "unused bits shall be from 0 to 7: u = " + unusedBits;
          }
          var hUnusedBits = "0" + unusedBits;
          this.hTLV = null;
          this.isModified = true;
          this.hV = hUnusedBits + hValue;
      };

      /**
       * set ASN.1 DER BitString by binary string
       * @name setByBinaryString
       * @memberOf KJUR.asn1.DERBitString
       * @function
       * @param {String} binaryString binary value string (i.e. '10111')
       * @description
       * Its unused bits will be calculated automatically by length of 
       * 'binaryValue'. <br/>
       * NOTE: Trailing zeros '0' will be ignored.
       */
      this.setByBinaryString = function (binaryString) {
          binaryString = binaryString.replace(/0+$/, '');
          var unusedBits = 8 - binaryString.length % 8;
          if (unusedBits == 8) unusedBits = 0;
          for (var i = 0; i <= unusedBits; i++) {
              binaryString += '0';
          }
          var h = '';
          for (var i = 0; i < binaryString.length - 1; i += 8) {
              var b = binaryString.substr(i, 8);
              var x = parseInt(b, 2).toString(16);
              if (x.length == 1) x = '0' + x;
              h += x;
          }
          this.hTLV = null;
          this.isModified = true;
          this.hV = '0' + unusedBits + h;
      };

      /**
       * set ASN.1 TLV value(V) by an array of boolean
       * @name setByBooleanArray
       * @memberOf KJUR.asn1.DERBitString
       * @function
       * @param {array} booleanArray array of boolean (ex. [true, false, true])
       * @description
       * NOTE: Trailing falses will be ignored.
       */
      this.setByBooleanArray = function (booleanArray) {
          var s = '';
          for (var i = 0; i < booleanArray.length; i++) {
              if (booleanArray[i] == true) {
                  s += '1';
              } else {
                  s += '0';
              }
          }
          this.setByBinaryString(s);
      };

      /**
       * generate an array of false with specified length
       * @name newFalseArray
       * @memberOf KJUR.asn1.DERBitString
       * @function
       * @param {Integer} nLength length of array to generate
       * @return {array} array of boolean faluse
       * @description
       * This static method may be useful to initialize boolean array.
       */
      this.newFalseArray = function (nLength) {
          var a = new Array(nLength);
          for (var i = 0; i < nLength; i++) {
              a[i] = false;
          }
          return a;
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };

      if (typeof params != "undefined") {
          if (typeof params['hex'] != "undefined") {
              this.setHexValueIncludingUnusedBits(params['hex']);
          } else if (typeof params['bin'] != "undefined") {
              this.setByBinaryString(params['bin']);
          } else if (typeof params['array'] != "undefined") {
              this.setByBooleanArray(params['array']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

  // ********************************************************************
  /**
   * class for ASN.1 DER OctetString
   * @name KJUR.asn1.DEROctetString
   * @class class for ASN.1 DER OctetString
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DEROctetString = function (params) {
      KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
      this.hT = "04";
  };
  JSX.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER Null
   * @name KJUR.asn1.DERNull
   * @class class for ASN.1 DER Null
   * @extends KJUR.asn1.ASN1Object
   * @description
   * @see KJUR.asn1.ASN1Object - superclass
   */
  KJUR.asn1.DERNull = function () {
      KJUR.asn1.DERNull.superclass.constructor.call(this);
      this.hT = "05";
      this.hTLV = "0500";
  };
  JSX.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

  // ********************************************************************
  /**
   * class for ASN.1 DER ObjectIdentifier
   * @name KJUR.asn1.DERObjectIdentifier
   * @class class for ASN.1 DER ObjectIdentifier
   * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
   * @extends KJUR.asn1.ASN1Object
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
   * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERObjectIdentifier = function (params) {
      var itox = function itox(i) {
          var h = i.toString(16);
          if (h.length == 1) h = '0' + h;
          return h;
      };
      var roidtox = function roidtox(roid) {
          var h = '';
          var bi = new BigInteger(roid, 10);
          var b = bi.toString(2);
          var padLen = 7 - b.length % 7;
          if (padLen == 7) padLen = 0;
          var bPad = '';
          for (var i = 0; i < padLen; i++) {
              bPad += '0';
          }b = bPad + b;
          for (var i = 0; i < b.length - 1; i += 7) {
              var b8 = b.substr(i, 7);
              if (i != b.length - 7) b8 = '1' + b8;
              h += itox(parseInt(b8, 2));
          }
          return h;
      };

      KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
      this.hT = "06";

      /**
       * set value by a hexadecimal string
       * @name setValueHex
       * @memberOf KJUR.asn1.DERObjectIdentifier
       * @function
       * @param {String} newHexString hexadecimal value of OID bytes
       */
      this.setValueHex = function (newHexString) {
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = newHexString;
      };

      /**
       * set value by a OID string
       * @name setValueOidString
       * @memberOf KJUR.asn1.DERObjectIdentifier
       * @function
       * @param {String} oidString OID string (ex. 2.5.4.13)
       */
      this.setValueOidString = function (oidString) {
          if (!oidString.match(/^[0-9.]+$/)) {
              throw "malformed oid string: " + oidString;
          }
          var h = '';
          var a = oidString.split('.');
          var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
          h += itox(i0);
          a.splice(0, 2);
          for (var i = 0; i < a.length; i++) {
              h += roidtox(a[i]);
          }
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = h;
      };

      /**
       * set value by a OID name
       * @name setValueName
       * @memberOf KJUR.asn1.DERObjectIdentifier
       * @function
       * @param {String} oidName OID name (ex. 'serverAuth')
       * @since 1.0.1
       * @description
       * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
       * Otherwise raise error.
       */
      this.setValueName = function (oidName) {
          if (typeof KJUR.asn1.x509.OID.name2oidList[oidName] != "undefined") {
              var oid = KJUR.asn1.x509.OID.name2oidList[oidName];
              this.setValueOidString(oid);
          } else {
              throw "DERObjectIdentifier oidName undefined: " + oidName;
          }
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };

      if (typeof params != "undefined") {
          if (typeof params['oid'] != "undefined") {
              this.setValueOidString(params['oid']);
          } else if (typeof params['hex'] != "undefined") {
              this.setValueHex(params['hex']);
          } else if (typeof params['name'] != "undefined") {
              this.setValueName(params['name']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

  // ********************************************************************
  /**
   * class for ASN.1 DER UTF8String
   * @name KJUR.asn1.DERUTF8String
   * @class class for ASN.1 DER UTF8String
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DERUTF8String = function (params) {
      KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
      this.hT = "0c";
  };
  JSX.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER NumericString
   * @name KJUR.asn1.DERNumericString
   * @class class for ASN.1 DER NumericString
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DERNumericString = function (params) {
      KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
      this.hT = "12";
  };
  JSX.extend(KJUR.asn1.DERNumericString, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER PrintableString
   * @name KJUR.asn1.DERPrintableString
   * @class class for ASN.1 DER PrintableString
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DERPrintableString = function (params) {
      KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
      this.hT = "13";
  };
  JSX.extend(KJUR.asn1.DERPrintableString, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER TeletexString
   * @name KJUR.asn1.DERTeletexString
   * @class class for ASN.1 DER TeletexString
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DERTeletexString = function (params) {
      KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
      this.hT = "14";
  };
  JSX.extend(KJUR.asn1.DERTeletexString, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER IA5String
   * @name KJUR.asn1.DERIA5String
   * @class class for ASN.1 DER IA5String
   * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
   * @extends KJUR.asn1.DERAbstractString
   * @description
   * @see KJUR.asn1.DERAbstractString - superclass
   */
  KJUR.asn1.DERIA5String = function (params) {
      KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
      this.hT = "16";
  };
  JSX.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

  // ********************************************************************
  /**
   * class for ASN.1 DER UTCTime
   * @name KJUR.asn1.DERUTCTime
   * @class class for ASN.1 DER UTCTime
   * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
   * @extends KJUR.asn1.DERAbstractTime
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
   * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
   * <li>date - specify Date object.</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   * <h4>EXAMPLES</h4>
   * @example
   * var d1 = new KJUR.asn1.DERUTCTime();
   * d1.setString('130430125959Z');
   *
   * var d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
   *
   * var d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
   */
  KJUR.asn1.DERUTCTime = function (params) {
      KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
      this.hT = "17";

      /**
       * set value by a Date object
       * @name setByDate
       * @memberOf KJUR.asn1.DERUTCTime
       * @function
       * @param {Date} dateObject Date object to set ASN.1 value(V)
       */
      this.setByDate = function (dateObject) {
          this.hTLV = null;
          this.isModified = true;
          this.date = dateObject;
          this.s = this.formatDate(this.date, 'utc');
          this.hV = stohex(this.s);
      };

      if (typeof params != "undefined") {
          if (typeof params['str'] != "undefined") {
              this.setString(params['str']);
          } else if (typeof params['hex'] != "undefined") {
              this.setStringHex(params['hex']);
          } else if (typeof params['date'] != "undefined") {
              this.setByDate(params['date']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

  // ********************************************************************
  /**
   * class for ASN.1 DER GeneralizedTime
   * @name KJUR.asn1.DERGeneralizedTime
   * @class class for ASN.1 DER GeneralizedTime
   * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
   * @extends KJUR.asn1.DERAbstractTime
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
   * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
   * <li>date - specify Date object.</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERGeneralizedTime = function (params) {
      KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
      this.hT = "18";

      /**
       * set value by a Date object
       * @name setByDate
       * @memberOf KJUR.asn1.DERGeneralizedTime
       * @function
       * @param {Date} dateObject Date object to set ASN.1 value(V)
       * @example
       * When you specify UTC time, use 'Date.UTC' method like this:<br/>
       * var o = new DERUTCTime();
       * var date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
       * o.setByDate(date);
       */
      this.setByDate = function (dateObject) {
          this.hTLV = null;
          this.isModified = true;
          this.date = dateObject;
          this.s = this.formatDate(this.date, 'gen');
          this.hV = stohex(this.s);
      };

      if (typeof params != "undefined") {
          if (typeof params['str'] != "undefined") {
              this.setString(params['str']);
          } else if (typeof params['hex'] != "undefined") {
              this.setStringHex(params['hex']);
          } else if (typeof params['date'] != "undefined") {
              this.setByDate(params['date']);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERGeneralizedTime, KJUR.asn1.DERAbstractTime);

  // ********************************************************************
  /**
   * class for ASN.1 DER Sequence
   * @name KJUR.asn1.DERSequence
   * @class class for ASN.1 DER Sequence
   * @extends KJUR.asn1.DERAbstractStructured
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>array - specify array of ASN1Object to set elements of content</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERSequence = function (params) {
      KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
      this.hT = "30";
      this.getFreshValueHex = function () {
          var h = '';
          for (var i = 0; i < this.asn1Array.length; i++) {
              var asn1Obj = this.asn1Array[i];
              h += asn1Obj.getEncodedHex();
          }
          this.hV = h;
          return this.hV;
      };
  };
  JSX.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

  // ********************************************************************
  /**
   * class for ASN.1 DER Set
   * @name KJUR.asn1.DERSet
   * @class class for ASN.1 DER Set
   * @extends KJUR.asn1.DERAbstractStructured
   * @description
   * <br/>
   * As for argument 'params' for constructor, you can specify one of
   * following properties:
   * <ul>
   * <li>array - specify array of ASN1Object to set elements of content</li>
   * </ul>
   * NOTE: 'params' can be omitted.
   */
  KJUR.asn1.DERSet = function (params) {
      KJUR.asn1.DERSet.superclass.constructor.call(this, params);
      this.hT = "31";
      this.getFreshValueHex = function () {
          var a = new Array();
          for (var i = 0; i < this.asn1Array.length; i++) {
              var asn1Obj = this.asn1Array[i];
              a.push(asn1Obj.getEncodedHex());
          }
          a.sort();
          this.hV = a.join('');
          return this.hV;
      };
  };
  JSX.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

  // ********************************************************************
  /**
   * class for ASN.1 DER TaggedObject
   * @name KJUR.asn1.DERTaggedObject
   * @class class for ASN.1 DER TaggedObject
   * @extends KJUR.asn1.ASN1Object
   * @description
   * <br/>
   * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
   * For example, if you find '[1]' tag in a ASN.1 dump, 
   * 'tagNoHex' will be 'a1'.
   * <br/>
   * As for optional argument 'params' for constructor, you can specify *ANY* of
   * following properties:
   * <ul>
   * <li>explicit - specify true if this is explicit tag otherwise false 
   *     (default is 'true').</li>
   * <li>tag - specify tag (default is 'a0' which means [0])</li>
   * <li>obj - specify ASN1Object which is tagged</li>
   * </ul>
   * @example
   * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
   * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
   * hex = d2.getEncodedHex();
   */
  KJUR.asn1.DERTaggedObject = function (params) {
      KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
      this.hT = "a0";
      this.hV = '';
      this.isExplicit = true;
      this.asn1Object = null;

      /**
       * set value by an ASN1Object
       * @name setString
       * @memberOf KJUR.asn1.DERTaggedObject
       * @function
       * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
       * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
       * @param {ASN1Object} asn1Object ASN.1 to encapsulate
       */
      this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
          this.hT = tagNoHex;
          this.isExplicit = isExplicitFlag;
          this.asn1Object = asn1Object;
          if (this.isExplicit) {
              this.hV = this.asn1Object.getEncodedHex();
              this.hTLV = null;
              this.isModified = true;
          } else {
              this.hV = null;
              this.hTLV = asn1Object.getEncodedHex();
              this.hTLV = this.hTLV.replace(/^../, tagNoHex);
              this.isModified = false;
          }
      };

      this.getFreshValueHex = function () {
          return this.hV;
      };

      if (typeof params != "undefined") {
          if (typeof params['tag'] != "undefined") {
              this.hT = params['tag'];
          }
          if (typeof params['explicit'] != "undefined") {
              this.isExplicit = params['explicit'];
          }
          if (typeof params['obj'] != "undefined") {
              this.asn1Object = params['obj'];
              this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
          }
      }
  };
  JSX.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

  var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var b64pad = "=";

  function hex2b64(h) {
    var i;
    var c;
    var ret = "";
    for (i = 0; i + 3 <= h.length; i += 3) {
      c = parseInt(h.substring(i, i + 3), 16);
      ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    if (i + 1 == h.length) {
      c = parseInt(h.substring(i, i + 1), 16);
      ret += b64map.charAt(c << 2);
    } else if (i + 2 == h.length) {
      c = parseInt(h.substring(i, i + 2), 16);
      ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
      ret += b64pad;
    }return ret;
  }

  // convert a base64 string to hex
  function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // b64 state, 0-3
    var slop;
    for (i = 0; i < s.length; ++i) {
      if (s.charAt(i) == b64pad) break;
      var v = b64map.indexOf(s.charAt(i));
      if (v < 0) continue;
      if (k == 0) {
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 1;
      } else if (k == 1) {
        ret += int2char(slop << 2 | v >> 4);
        slop = v & 0xf;
        k = 2;
      } else if (k == 2) {
        ret += int2char(slop);
        ret += int2char(v >> 2);
        slop = v & 3;
        k = 3;
      } else {
        ret += int2char(slop << 2 | v >> 4);
        ret += int2char(v & 0xf);
        k = 0;
      }
    }
    if (k == 1) ret += int2char(slop << 2);
    return ret;
  }

  /**
   * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
   * @returns {string}
   * @public
   */
  ASN1.prototype.getHexStringValue = function () {
    var hexString = this.toHexString();
    var offset = this.header * 2;
    var length = this.length * 2;
    return hexString.substr(offset, length);
  };

  /**
   * Method to parse a pem encoded string containing both a public or private key.
   * The method will translate the pem encoded string in a der encoded string and
   * will parse private key and public key parameters. This method accepts public key
   * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
   *
   * @todo Check how many rsa formats use the same format of pkcs #1.
   *
   * The format is defined as:
   * PublicKeyInfo ::= SEQUENCE {
   *   algorithm       AlgorithmIdentifier,
   *   PublicKey       BIT STRING
   * }
   * Where AlgorithmIdentifier is:
   * AlgorithmIdentifier ::= SEQUENCE {
   *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
   *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
   * }
   * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
   * RSAPublicKey ::= SEQUENCE {
   *   modulus           INTEGER,  -- n
   *   publicExponent    INTEGER   -- e
   * }
   * it's possible to examine the structure of the keys obtained from openssl using
   * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
   * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
   * @private
   */
  RSAKey.prototype.parseKey = function (pem) {
    try {
      var modulus = 0;
      var public_exponent = 0;
      var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
      var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
      var asn1 = ASN1.decode(der);

      //Fixes a bug with OpenSSL 1.0+ private keys
      if (asn1.sub.length === 3) {
        asn1 = asn1.sub[2].sub[0];
      }
      if (asn1.sub.length === 9) {

        // Parse the private key.
        modulus = asn1.sub[1].getHexStringValue(); //bigint
        this.n = parseBigInt(modulus, 16);

        public_exponent = asn1.sub[2].getHexStringValue(); //int
        this.e = parseInt(public_exponent, 16);

        var private_exponent = asn1.sub[3].getHexStringValue(); //bigint
        this.d = parseBigInt(private_exponent, 16);

        var prime1 = asn1.sub[4].getHexStringValue(); //bigint
        this.p = parseBigInt(prime1, 16);

        var prime2 = asn1.sub[5].getHexStringValue(); //bigint
        this.q = parseBigInt(prime2, 16);

        var exponent1 = asn1.sub[6].getHexStringValue(); //bigint
        this.dmp1 = parseBigInt(exponent1, 16);

        var exponent2 = asn1.sub[7].getHexStringValue(); //bigint
        this.dmq1 = parseBigInt(exponent2, 16);

        var coefficient = asn1.sub[8].getHexStringValue(); //bigint
        this.coeff = parseBigInt(coefficient, 16);
      } else if (asn1.sub.length === 2) {

        // Parse the public key.
        var bit_string = asn1.sub[1];
        var sequence = bit_string.sub[0];

        modulus = sequence.sub[0].getHexStringValue();
        this.n = parseBigInt(modulus, 16);
        public_exponent = sequence.sub[1].getHexStringValue();
        this.e = parseInt(public_exponent, 16);
      } else {
        return false;
      }
      return true;
    } catch (ex) {
      return false;
    }
  };

  /**
   * Translate rsa parameters in a hex encoded string representing the rsa key.
   *
   * The translation follow the ASN.1 notation :
   * RSAPrivateKey ::= SEQUENCE {
   *   version           Version,
   *   modulus           INTEGER,  -- n
   *   publicExponent    INTEGER,  -- e
   *   privateExponent   INTEGER,  -- d
   *   prime1            INTEGER,  -- p
   *   prime2            INTEGER,  -- q
   *   exponent1         INTEGER,  -- d mod (p1)
   *   exponent2         INTEGER,  -- d mod (q-1)
   *   coefficient       INTEGER,  -- (inverse of q) mod p
   * }
   * @returns {string}  DER Encoded String representing the rsa private key
   * @private
   */
  RSAKey.prototype.getPrivateBaseKey = function () {
    var options = {
      'array': [new KJUR.asn1.DERInteger({ 'int': 0 }), new KJUR.asn1.DERInteger({ 'bigint': this.n }), new KJUR.asn1.DERInteger({ 'int': this.e }), new KJUR.asn1.DERInteger({ 'bigint': this.d }), new KJUR.asn1.DERInteger({ 'bigint': this.p }), new KJUR.asn1.DERInteger({ 'bigint': this.q }), new KJUR.asn1.DERInteger({ 'bigint': this.dmp1 }), new KJUR.asn1.DERInteger({ 'bigint': this.dmq1 }), new KJUR.asn1.DERInteger({ 'bigint': this.coeff })]
    };
    var seq = new KJUR.asn1.DERSequence(options);
    return seq.getEncodedHex();
  };

  /**
   * base64 (pem) encoded version of the DER encoded representation
   * @returns {string} pem encoded representation without header and footer
   * @public
   */
  RSAKey.prototype.getPrivateBaseKeyB64 = function () {
    return hex2b64(this.getPrivateBaseKey());
  };

  /**
   * Translate rsa parameters in a hex encoded string representing the rsa public key.
   * The representation follow the ASN.1 notation :
   * PublicKeyInfo ::= SEQUENCE {
   *   algorithm       AlgorithmIdentifier,
   *   PublicKey       BIT STRING
   * }
   * Where AlgorithmIdentifier is:
   * AlgorithmIdentifier ::= SEQUENCE {
   *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
   *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
   * }
   * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
   * RSAPublicKey ::= SEQUENCE {
   *   modulus           INTEGER,  -- n
   *   publicExponent    INTEGER   -- e
   * }
   * @returns {string} DER Encoded String representing the rsa public key
   * @private
   */
  RSAKey.prototype.getPublicBaseKey = function () {
    var options = {
      'array': [new KJUR.asn1.DERObjectIdentifier({ 'oid': '1.2.840.113549.1.1.1' }), //RSA Encryption pkcs #1 oid
      new KJUR.asn1.DERNull()]
    };
    var first_sequence = new KJUR.asn1.DERSequence(options);

    options = {
      'array': [new KJUR.asn1.DERInteger({ 'bigint': this.n }), new KJUR.asn1.DERInteger({ 'int': this.e })]
    };
    var second_sequence = new KJUR.asn1.DERSequence(options);

    options = {
      'hex': '00' + second_sequence.getEncodedHex()
    };
    var bit_string = new KJUR.asn1.DERBitString(options);

    options = {
      'array': [first_sequence, bit_string]
    };
    var seq = new KJUR.asn1.DERSequence(options);
    return seq.getEncodedHex();
  };

  /**
   * base64 (pem) encoded version of the DER encoded representation
   * @returns {string} pem encoded representation without header and footer
   * @public
   */
  RSAKey.prototype.getPublicBaseKeyB64 = function () {
    return hex2b64(this.getPublicBaseKey());
  };

  /**
   * wrap the string in block of width chars. The default value for rsa keys is 64
   * characters.
   * @param {string} str the pem encoded string without header and footer
   * @param {Number} [width=64] - the length the string has to be wrapped at
   * @returns {string}
   * @private
   */
  RSAKey.prototype.wordwrap = function (str, width) {
    width = width || 64;
    if (!str) {
      return str;
    }
    var regex = '(.{1,' + width + '})( +|$\n?)|(.{1,' + width + '})';
    return str.match(RegExp(regex, 'g')).join('\n');
  };

  /**
   * Retrieve the pem encoded private key
   * @returns {string} the pem encoded private key with header/footer
   * @public
   */
  RSAKey.prototype.getPrivateKey = function () {
    var key = "-----BEGIN RSA PRIVATE KEY-----\n";
    key += this.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
    key += "-----END RSA PRIVATE KEY-----";
    return key;
  };

  /**
   * Retrieve the pem encoded public key
   * @returns {string} the pem encoded public key with header/footer
   * @public
   */
  RSAKey.prototype.getPublicKey = function () {
    var key = "-----BEGIN PUBLIC KEY-----\n";
    key += this.wordwrap(this.getPublicBaseKeyB64()) + "\n";
    key += "-----END PUBLIC KEY-----";
    return key;
  };

  /**
   * Check if the object contains the necessary parameters to populate the rsa modulus
   * and public exponent parameters.
   * @param {Object} [obj={}] - An object that may contain the two public key
   * parameters
   * @returns {boolean} true if the object contains both the modulus and the public exponent
   * properties (n and e)
   * @todo check for types of n and e. N should be a parseable bigInt object, E should
   * be a parseable integer number
   * @private
   */
  RSAKey.prototype.hasPublicKeyProperty = function (obj) {
    obj = obj || {};
    return obj.hasOwnProperty('n') && obj.hasOwnProperty('e');
  };

  /**
   * Check if the object contains ALL the parameters of an RSA key.
   * @param {Object} [obj={}] - An object that may contain nine rsa key
   * parameters
   * @returns {boolean} true if the object contains all the parameters needed
   * @todo check for types of the parameters all the parameters but the public exponent
   * should be parseable bigint objects, the public exponent should be a parseable integer number
   * @private
   */
  RSAKey.prototype.hasPrivateKeyProperty = function (obj) {
    obj = obj || {};
    return obj.hasOwnProperty('n') && obj.hasOwnProperty('e') && obj.hasOwnProperty('d') && obj.hasOwnProperty('p') && obj.hasOwnProperty('q') && obj.hasOwnProperty('dmp1') && obj.hasOwnProperty('dmq1') && obj.hasOwnProperty('coeff');
  };

  /**
   * Parse the properties of obj in the current rsa object. Obj should AT LEAST
   * include the modulus and public exponent (n, e) parameters.
   * @param {Object} obj - the object containing rsa parameters
   * @private
   */
  RSAKey.prototype.parsePropertiesFrom = function (obj) {
    this.n = obj.n;
    this.e = obj.e;

    if (obj.hasOwnProperty('d')) {
      this.d = obj.d;
      this.p = obj.p;
      this.q = obj.q;
      this.dmp1 = obj.dmp1;
      this.dmq1 = obj.dmq1;
      this.coeff = obj.coeff;
    }
  };

  /**
   * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
   * This object is just a decorator for parsing the key parameter
   * @param {string|Object} key - The key in string format, or an object containing
   * the parameters needed to build a RSAKey object.
   * @constructor
   */

  var JSEncryptRSAKey = function (_RSAKey) {
    inherits(JSEncryptRSAKey, _RSAKey);

    function JSEncryptRSAKey(key) {
      classCallCheck(this, JSEncryptRSAKey);

      // If a key key was provided.
      var _this = possibleConstructorReturn(this, (JSEncryptRSAKey.__proto__ || Object.getPrototypeOf(JSEncryptRSAKey)).call(this));
      // Call the super constructor.


      if (key) {
        // If this is a string...
        if (typeof key === 'string') {
          _this.parseKey(key);
        } else if (_this.hasPrivateKeyProperty(key) || _this.hasPublicKeyProperty(key)) {
          // Set the values for the key.
          _this.parsePropertiesFrom(key);
        }
      }
      return _this;
    }

    return JSEncryptRSAKey;
  }(RSAKey);

  /**
   *
   * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
   * possible parameters are:
   * - default_key_size        {number}  default: 1024 the key size in bit
   * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
   * - log                     {boolean} default: false whether log warn/error or not
   * @constructor
   */


  var JSEncrypt = function JSEncrypt(options) {
    classCallCheck(this, JSEncrypt);

    options = options || {};
    this.default_key_size = parseInt(options.default_key_size) || 1024;
    this.default_public_exponent = options.default_public_exponent || '010001'; //65537 default openssl public exponent for rsa key type
    this.log = options.log || false;
    // The private and public key.
    this.key = null;
  };

  /**
   * Method to set the rsa key parameter (one method is enough to set both the public
   * and the private key, since the private key contains the public key paramenters)
   * Log a warning if logs are enabled
   * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
   * @public
   */
  JSEncrypt.prototype.setKey = function (key) {
    if (this.log && this.key) {
      console.warn('A key was already set, overriding existing.');
    }
    this.key = new JSEncryptRSAKey(key);
  };

  /**
   * Proxy method for setKey, for api compatibility
   * @see setKey
   * @public
   */
  JSEncrypt.prototype.setPrivateKey = function (privkey) {
    // Create the key.
    this.setKey(privkey);
  };

  /**
   * Proxy method for setKey, for api compatibility
   * @see setKey
   * @public
   */
  JSEncrypt.prototype.setPublicKey = function (pubkey) {
    // Sets the public key.
    this.setKey(pubkey);
  };

  /**
   * Proxy method for RSAKey object's decrypt, decrypt the string using the private
   * components of the rsa key object. Note that if the object was not set will be created
   * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
   * @param {string} string base64 encoded crypted string to decrypt
   * @return {string} the decrypted string
   * @public
   */
  JSEncrypt.prototype.decrypt = function (string) {
    // Return the decrypted string.
    try {
      return this.getKey().decrypt(b64tohex(string));
    } catch (ex) {
      return false;
    }
  };

  /**
   * Proxy method for RSAKey object's encrypt, encrypt the string using the public
   * components of the rsa key object. Note that if the object was not set will be created
   * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
   * @param {string} string the string to encrypt
   * @return {string} the encrypted string encoded in base64
   * @public
   */
  JSEncrypt.prototype.encrypt = function (string) {
    // Return the encrypted string.
    try {
      return hex2b64(this.getKey().encrypt(string));
    } catch (ex) {
      return false;
    }
  };

  /**
   * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
   * will be created and returned
   * @param {callback} [cb] the callback to be called if we want the key to be generated
   * in an async fashion
   * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
   * @public
   */
  JSEncrypt.prototype.getKey = function (cb) {
    // Only create new if it does not exist.
    if (!this.key) {
      // Get a new private key.
      this.key = new JSEncryptRSAKey();
      if (cb && {}.toString.call(cb) === '[object Function]') {
        this.key.generateAsync(this.default_key_size, this.default_public_exponent, cb);
        return;
      }
      // Generate the key.
      this.key.generate(this.default_key_size, this.default_public_exponent);
    }
    return this.key;
  };

  /**
   * Returns the pem encoded representation of the private key
   * If the key doesn't exists a new key will be created
   * @returns {string} pem encoded representation of the private key WITH header and footer
   * @public
   */
  JSEncrypt.prototype.getPrivateKey = function () {
    // Return the private representation of this key.
    return this.getKey().getPrivateKey();
  };

  /**
   * Returns the pem encoded representation of the private key
   * If the key doesn't exists a new key will be created
   * @returns {string} pem encoded representation of the private key WITHOUT header and footer
   * @public
   */
  JSEncrypt.prototype.getPrivateKeyB64 = function () {
    // Return the private representation of this key.
    return this.getKey().getPrivateBaseKeyB64();
  };

  /**
   * Returns the pem encoded representation of the public key
   * If the key doesn't exists a new key will be created
   * @returns {string} pem encoded representation of the public key WITH header and footer
   * @public
   */
  JSEncrypt.prototype.getPublicKey = function () {
    // Return the private representation of this key.
    return this.getKey().getPublicKey();
  };

  /**
   * Returns the pem encoded representation of the public key
   * If the key doesn't exists a new key will be created
   * @returns {string} pem encoded representation of the public key WITHOUT header and footer
   * @public
   */
  JSEncrypt.prototype.getPublicKeyB64 = function () {
    // Return the private representation of this key.
    return this.getKey().getPublicBaseKeyB64();
  };

  var BaseRequest = function () {
      function BaseRequest(data) {
          classCallCheck(this, BaseRequest);

          this.data = data;
          this.before = function (data) {
              return Promise.resolve(data);
          };
      }

      createClass(BaseRequest, [{
          key: "send",
          value: function send() {
              return this.before(this.data);
          }
      }, {
          key: "before",
          value: function before(fn) {
              return Promise.resolve;
          }
      }]);
      return BaseRequest;
  }();

  var BaseTransport = function () {
      function BaseTransport(endpoint, stream_type) {
          classCallCheck(this, BaseTransport);

          this.stream_type = stream_type;
          this.endpoint = endpoint;
          this.eventSource = new EventEmitter();
          this.dataQueue = [];
      }

      createClass(BaseTransport, [{
          key: "destroy",
          value: function destroy() {
              this.eventSource.destroy();
          }
      }, {
          key: "connect",
          value: function connect() {
              // TO be impemented
          }
      }, {
          key: "disconnect",
          value: function disconnect() {
              // TO be impemented
          }
      }, {
          key: "reconnect",
          value: function reconnect() {
              var _this = this;

              return this.disconnect().then(function () {
                  return _this.connect();
              });
          }
      }, {
          key: "ready",
          value: function ready() {}
      }, {
          key: "setEndpoint",
          value: function setEndpoint(endpoint) {
              this.endpoint = endpoint;
              return this.reconnect();
          }
      }, {
          key: "send",
          value: function send(data) {
              // TO be impemented
              // return this.prepare(data).send();
          }
      }, {
          key: "prepare",
          value: function prepare(data) {}
          // TO be impemented
          // return new Request(data);


          // onData(type, data) {
          //     this.eventSource.dispatchEvent(type, data);
          // }

      }], [{
          key: "canTransfer",
          value: function canTransfer(stream_type) {
              return BaseTransport.streamTypes().includes(stream_type);
          }
      }, {
          key: "streamTypes",
          value: function streamTypes() {
              return [];
          }
      }]);
      return BaseTransport;
  }();

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
   //navigator.hardwareConcurrency || 3;

  var LOG_TAG$3 = "transport:ws";
  var Log$9 = getTagged(LOG_TAG$3);

  var ProtocolError = function (_ExtendableError) {
      inherits(ProtocolError, _ExtendableError);

      function ProtocolError(ty) {
          classCallCheck(this, ProtocolError);
          return possibleConstructorReturn(this, (ProtocolError.__proto__ || Object.getPrototypeOf(ProtocolError)).call(this, 'failed to parse ' + ty + ' websocket protocol'));
      }

      return ProtocolError;
  }(ExtendableError);

  var WebsocketTransport = function (_BaseTransport) {
      inherits(WebsocketTransport, _BaseTransport);

      function WebsocketTransport(endpoint, stream_type) {
          var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
              socket: location.protocol.replace('http', 'ws') + '//' + location.host + '/ws/',
              workers: 1
          };
          classCallCheck(this, WebsocketTransport);

          var _this2 = possibleConstructorReturn(this, (WebsocketTransport.__proto__ || Object.getPrototypeOf(WebsocketTransport)).call(this, endpoint, stream_type));

          _this2.proxies = [];
          _this2.currentProxy = 0;
          _this2.workers = 1;
          _this2.socket_url = options.socket;
          _this2.reconnectHandler = options.reconnectHandler || _this2.defaultReconnectHandler;
          _this2._ready = _this2.connect();
          return _this2;
      }

      createClass(WebsocketTransport, [{
          key: 'destroy',
          value: function destroy() {
              var _this3 = this;

              this.disconnect().then(function () {
                  get(WebsocketTransport.prototype.__proto__ || Object.getPrototypeOf(WebsocketTransport.prototype), 'destroy', _this3).call(_this3);
                  Log$9.debug("WebsocketTransport destroy");
              });
          }
      }, {
          key: 'ready',
          value: function ready() {
              return this._ready;
          }
      }, {
          key: 'defaultReconnectHandler',
          value: function defaultReconnectHandler(e) {
              return new Promise(function (resolve, reject) {
                  if (confirm(e.code + ': ' + e.msg + '\nDo You Want To Reconnect ?')) {
                      resolve();
                  } else {
                      reject();
                  }
              });
          }
      }, {
          key: 'connect',
          value: function connect() {
              var _this4 = this;

              return this.disconnect().then(function () {
                  var promises = [];
                  // TODO: get mirror list
                  for (var i = 0; i < _this4.workers; ++i) {
                      var proxy = new WebSocketProxy(_this4.socket_url, _this4.endpoint, _this4.stream_type);
                      proxy.set_reconnect_handler(function (e) {
                          return _this4.reconnectHandler(e);
                      });
                      proxy.set_disconnect_handler(function (e) {
                          _this4.eventSource.dispatchEvent('disconnected', { code: e.code, reason: e.reason });
                          // TODO: only reconnect on demand
                          // code 0 for Manual reconnection
                          if ([0, 1000, 1006, 1013, 1011].includes(e.code)) {
                              setTimeout(function () {
                                  if (_this4._ready && _this4._ready.reject) {
                                      _this4._ready.reject();
                                  }
                                  _this4._ready = _this4.connect();
                                  _this4._ready.then(function () {
                                      _this4.eventSource.dispatchEvent('reconnected');
                                  });
                              }, 3000);
                          }
                      });
                      proxy.set_data_handler(function (data) {
                          _this4.dataQueue.push(new Uint8Array(data));
                          _this4.eventSource.dispatchEvent('data');
                      });

                      promises.push(proxy.connect().then(function () {
                          _this4.eventSource.dispatchEvent('connected');
                      }).catch(function (e) {
                          _this4.eventSource.dispatchEvent('error');
                          throw new Error(e);
                      }));
                      _this4.proxies.push(proxy);
                  }
                  return Promise.all(promises);
              });
          }
      }, {
          key: 'disconnect',
          value: function disconnect() {
              var promises = [];
              for (var i = 0; i < this.proxies.length; ++i) {
                  promises.push(this.proxies[i].close());
              }
              this.proxies = [];
              if (this.proxies.length) {
                  return Promise.all(promises);
              } else {
                  return Promise.resolve();
              }
          }
      }, {
          key: 'socket',
          value: function socket() {
              return this.proxies[this.currentProxy++ % this.proxies.length];
          }
      }, {
          key: 'send',
          value: function send(_data, fn) {
              var res = this.socket().send(_data);
              if (fn) {
                  fn(res.seq);
              }
              return res.promise;
          }
      }], [{
          key: 'canTransfer',
          value: function canTransfer(stream_type) {
              return WebsocketTransport.streamTypes().includes(stream_type);
          }
      }, {
          key: 'streamTypes',
          value: function streamTypes() {
              return ['hls', 'rtsp'];
          }
      }]);
      return WebsocketTransport;
  }(BaseTransport);

  var WSPProtocol = function () {
      createClass(WSPProtocol, null, [{
          key: 'PROTO',
          get: function get() {
              return 'WSP';
          }
      }, {
          key: 'V1_1',
          get: function get() {
              return '1.1';
          }
      }, {
          key: 'CMD_INIT',
          get: function get() {
              return 'INIT';
          }
      }, {
          key: 'CMD_JOIN',
          get: function get() {
              return 'JOIN';
          }
      }, {
          key: 'CMD_WRAP',
          get: function get() {
              return 'WRAP';
          }
      }]);

      function WSPProtocol(ver) {
          classCallCheck(this, WSPProtocol);

          this.ver = ver;
      }

      createClass(WSPProtocol, [{
          key: 'build',
          value: function build(cmd, data) {
              var payload = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

              var data_str = '';
              if (!data.seq) {
                  data.seq = ++WSPProtocol.seq;
              }
              for (var k in data) {
                  data_str += k + ': ' + data[k] + '\r\n';
              }
              return WSPProtocol.PROTO + '/' + this.ver + ' ' + cmd + '\r\n' + data_str + '\r\n' + payload;
          }
      }], [{
          key: 'parse',
          value: function parse(data) {
              var payIdx = data.indexOf('\r\n\r\n');
              var lines = data.substr(0, payIdx).split('\r\n');
              var hdr = lines.shift().match(new RegExp(WSPProtocol.PROTO + '/' + WSPProtocol.V1_1 + '\\s+(\\d+)\\s+(.+)'));
              if (hdr) {
                  var res = {
                      code: Number(hdr[1]),
                      msg: hdr[2],
                      data: {},
                      payload: ''
                  };
                  while (lines.length) {
                      var line = lines.shift();
                      if (line) {
                          var _line$split = line.split(':'),
                              _line$split2 = slicedToArray(_line$split, 2),
                              k = _line$split2[0],
                              v = _line$split2[1];

                          res.data[k.trim()] = v.trim();
                      } else {
                          break;
                      }
                  }
                  res.payload = data.substr(payIdx + 4);
                  return res;
              }
              return null;
          }
      }]);
      return WSPProtocol;
  }();

  WSPProtocol.seq = 0;

  var WebSocketProxy = function () {
      createClass(WebSocketProxy, null, [{
          key: 'CHN_CONTROL',
          get: function get() {
              return 'control';
          }
      }, {
          key: 'CHN_DATA',
          get: function get() {
              return 'data';
          }
      }]);

      function WebSocketProxy(wsurl, endpoint, stream_type) {
          classCallCheck(this, WebSocketProxy);

          this.url = wsurl;
          this.stream_type = stream_type;
          this.endpoint = endpoint;
          this.data_handler = function () {};
          this.disconnect_handler = function () {};
          this.reconnect_handler = function () {};
          this.builder = new WSPProtocol(WSPProtocol.V1_1);
          this.awaitingPromises = {};
          this.seq = 0;
          this.encryptor = new JSEncrypt();
      }

      createClass(WebSocketProxy, [{
          key: 'set_data_handler',
          value: function set_data_handler(handler) {
              this.data_handler = handler;
          }
      }, {
          key: 'set_disconnect_handler',
          value: function set_disconnect_handler(handler) {
              this.disconnect_handler = handler;
          }
      }, {
          key: 'set_reconnect_handler',
          value: function set_reconnect_handler(handler) {
              this.reconnect_handler = handler;
          }
      }, {
          key: 'close',
          value: function close() {
              var _this5 = this;

              Log$9.log('closing connection');
              return new Promise(function (resolve) {
                  _this5.ctrlChannel.onclose = function () {
                      if (_this5.dataChannel) {
                          _this5.dataChannel.onclose = function () {
                              Log$9.log('closed');
                              resolve();
                          };
                          _this5.dataChannel.close();
                      } else {
                          Log$9.log('closed');
                          resolve();
                      }
                  };
                  _this5.ctrlChannel.close();
              });
          }
      }, {
          key: 'onDisconnect',
          value: function onDisconnect(e) {
              this.ctrlChannel.onclose = null;
              this.ctrlChannel.close();
              if (this.dataChannel) {
                  this.dataChannel.onclose = null;
                  this.dataChannel.close();
              }
              this.disconnect_handler(e);
          }
      }, {
          key: 'initDataChannel',
          value: function initDataChannel(channel_id) {
              var _this6 = this;

              return new Promise(function (resolve, reject) {
                  _this6.dataChannel = new WebSocket(_this6.url, WebSocketProxy.CHN_DATA);
                  _this6.dataChannel.binaryType = 'arraybuffer';
                  _this6.dataChannel.onopen = function () {
                      var msg = _this6.builder.build(WSPProtocol.CMD_JOIN, {
                          channel: channel_id
                      });
                      Log$9.debug(msg);
                      _this6.dataChannel.send(msg);
                  };
                  _this6.dataChannel.onmessage = function (ev) {
                      Log$9.debug('[data]\r\n' + ev.data);
                      var res = WSPProtocol.parse(ev.data);
                      if (!res) {
                          return reject(new ProtocolError('data'));
                      }

                      _this6.dataChannel.onmessage = function (e) {
                          // Log.debug('got data');
                          if (_this6.data_handler) {
                              _this6.data_handler(e.data);
                          }
                      };
                      resolve();
                  };
                  _this6.dataChannel.onerror = function (e) {
                      Log$9.error('[data] ' + e.type + '. code: ' + e.code + ', reason: ' + (e.reason || 'unknown reason'));
                      _this6.dataChannel.close();
                  };
                  _this6.dataChannel.onclose = function (e) {
                      Log$9.error('[data] ' + e.type + '. code: ' + e.code + ', reason: ' + (e.reason || 'unknown reason'));
                      _this6.onDisconnect(e);
                  };
              });
          }
      }, {
          key: 'connect',
          value: function connect() {
              var _this7 = this;

              this.encryptionKey = null;
              return new Promise(function (resolve, reject) {
                  _this7.ctrlChannel = new WebSocket(_this7.url, WebSocketProxy.CHN_CONTROL);

                  _this7.connected = false;

                  _this7.ctrlChannel.onopen = function () {
                      var headers = {
                          proto: _this7.stream_type
                      };
                      if (_this7.endpoint.socket) {
                          headers.socket = _this7.endpoint.socket;
                      } else {
                          Object.assign(headers, {
                              host: _this7.endpoint.host,
                              port: _this7.endpoint.port
                          });
                      }
                      var msg = _this7.builder.build(WSPProtocol.CMD_INIT, headers);
                      Log$9.debug(msg);
                      _this7.ctrlChannel.send(msg);
                  };

                  _this7.ctrlChannel.onmessage = function (ev) {
                      Log$9.debug('[ctrl] onmessage\r\n' + ev.data);

                      var res = WSPProtocol.parse(ev.data);
                      if (!res) {
                          return reject(new ProtocolError('ctrl'));
                      }

                      if (res.code >= 300) {
                          Log$9.error('[ctrl]\r\n' + res.code + ': ' + res.msg);
                          _this7.reconnect_handler(res).then(function () {
                              _this7.disconnect_handler({ code: 0, reason: 'reconnect' });
                          });
                          return reject(new Error(res.msg));
                      }
                      _this7.ctrlChannel.onmessage = function (e) {
                          var res = WSPProtocol.parse(e.data);
                          Log$9.debug('[ctrl] onmessage1\r\n' + e.data);
                          if (res.data.seq in _this7.awaitingPromises) {
                              if (!res) {
                                  _this7.awaitingPromises[res.data.seq].reject(new ProtocolError('ctrl'));
                              }
                              if (res.code < 300) {
                                  _this7.awaitingPromises[res.data.seq].resolve(res);
                              } else {
                                  _this7.awaitingPromises[res.data.seq].reject(new Error(res.msg));
                              }
                              delete _this7.awaitingPromises[res.data.seq];
                          }
                      };
                      _this7.encryptionKey = res.data.pubkey || null;
                      if (_this7.encryptionKey) {
                          _this7.encryptor.setPublicKey(_this7.encryptionKey);
                          // TODO: check errors
                      }
                      _this7.initDataChannel(res.data.channel).then(resolve).catch(reject);
                  };

                  _this7.ctrlChannel.onerror = function (e) {
                      Log$9.error('[ctrl] ' + e.type + '. code: ' + e.code + ' ' + (e.reason || 'unknown reason'));
                      _this7.ctrlChannel.close(1011, 'onerror');
                  };
                  _this7.ctrlChannel.onclose = function (e) {
                      Log$9.error('[ctrl] ' + e.type + '. code: ' + e.code + ' ' + (e.reason || 'unknown reason'));
                      _this7.onDisconnect(e);
                  };
              });
          }
      }, {
          key: 'encrypt',
          value: function encrypt(msg) {
              if (this.encryptionKey) {
                  var crypted = this.encryptor.encrypt(msg);
                  if (crypted === false) {
                      throw new Error("Encryption failed. Stopping");
                  }
                  return crypted;
              }
              return msg;
          }
      }, {
          key: 'send',
          value: function send(payload) {
              var _this8 = this;

              if (this.ctrlChannel.readyState != WebSocket.OPEN) {
                  this.close();
                  // .then(this.connect.bind(this));
                  // return;
                  throw new Error('disconnected');
              }
              // Log.debug(payload);
              var data = {
                  contentLength: payload.length,
                  seq: ++WSPProtocol.seq
              };
              return {
                  seq: data.seq,
                  promise: new Promise(function (resolve, reject) {
                      _this8.awaitingPromises[data.seq] = { resolve: resolve, reject: reject };
                      var msg = _this8.builder.build(WSPProtocol.CMD_WRAP, data, payload);
                      Log$9.debug(msg);
                      _this8.ctrlChannel.send(_this8.encrypt(msg));
                  }) };
          }
      }]);
      return WebSocketProxy;
  }();

  var Log$a = getTagged('wsp');

  var StreamType$1 = function () {
      function StreamType() {
          classCallCheck(this, StreamType);
      }

      createClass(StreamType, null, [{
          key: 'isSupported',
          value: function isSupported(type) {
              return [StreamType.HLS, StreamType.RTSP].includes(type);
          }
      }, {
          key: 'fromUrl',
          value: function fromUrl(url) {
              var parsed = void 0;
              try {
                  parsed = Url.parse(url);
              } catch (e) {
                  return null;
              }
              switch (parsed.protocol) {
                  case 'rtsp':
                      return StreamType.RTSP;
                  case 'http':
                  case 'https':
                      if (url.indexOf('.m3u8') >= 0) {
                          return StreamType.HLS;
                      } else {
                          return null;
                      }
                  default:
                      return null;
              }
          }
      }, {
          key: 'fromMime',
          value: function fromMime(mime) {
              switch (mime) {
                  case 'application/x-rtsp':
                      return StreamType.RTSP;
                  case 'application/vnd.apple.mpegurl':
                  case 'application/x-mpegurl':
                      return StreamType.HLS;
                  default:
                      return null;
              }
          }
      }, {
          key: 'HLS',
          get: function get() {
              return 'hls';
          }
      }, {
          key: 'RTSP',
          get: function get() {
              return 'rtsp';
          }
      }]);
      return StreamType;
  }();

  var WSPlayer = function () {
      function WSPlayer(node, opts) {
          var _this = this;

          classCallCheck(this, WSPlayer);

          if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) == _typeof('')) {
              this.player = document.getElementById(node);
          } else {
              this.player = node;
          }

          var modules = opts.modules || {
              client: RTSPClient,
              transport: {
                  constructor: WebsocketTransport
              }
          };
          this.errorHandler = opts.errorHandler || null;
          this.queryCredentials = opts.queryCredentials || null;

          this.modules = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
              for (var _iterator = modules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  var module = _step.value;

                  var transport = module.transport || WebsocketTransport;
                  var client = module.client || RTSPClient;
                  if (transport.constructor.canTransfer(client.streamType())) {
                      this.modules[client.streamType()] = {
                          client: client,
                          transport: transport
                      };
                  } else {
                      Log$a.warn('Client stream type ' + client.streamType() + ' is incompatible with transport types [' + transport.streamTypes().join(', ') + ']. Skip');
                  }
              }
          } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
          } finally {
              try {
                  if (!_iteratorNormalCompletion && _iterator.return) {
                      _iterator.return();
                  }
              } finally {
                  if (_didIteratorError) {
                      throw _iteratorError;
                  }
              }
          }

          this.type = StreamType$1.RTSP;
          this.url = null;
          if (opts.url && opts.type) {
              this.url = opts.url;
              this.type = opts.type;
          } else {
              if (!this._checkSource(this.player)) {
                  for (var i = 0; i < this.player.children.length; ++i) {
                      if (this._checkSource(this.player.children[i])) {
                          break;
                      }
                  }
              }
              // if (!this.url) {
              //      throw new Error('No playable endpoint found');
              // }
          }

          if (this.url) {
              this.setSource(this.url, this.type);
          }

          this.player.addEventListener('play', function () {
              if (!_this.client) {
                  return;
              }
              if (!_this.isPlaying()) {
                  _this.client.start();
              }
          }, false);

          this.player.addEventListener('pause', function () {
              if (!_this.client) {
                  return;
              }
              _this.client.stop();
          }, false);
      }

      // TODO: check native support

      createClass(WSPlayer, [{
          key: 'isPlaying',
          value: function isPlaying() {
              return !(this.player.paused || this.client.paused);
          }
      }, {
          key: 'canPlayUrl',
          value: function canPlayUrl(src) {
              var type = StreamType$1.fromUrl(src);
              return type in this.modules;
          }
      }, {
          key: '_checkSource',
          value: function _checkSource(src) {
              if (!src.dataset['ignore'] && src.src && !this.player.canPlayType(src.type) && (StreamType$1.fromMime(src.type) || StreamType$1.fromUrl(src.src))) {
                  this.url = src.src;
                  this.type = src.type ? StreamType$1.fromMime(src.type) : StreamType$1.fromUrl(src.src);
                  return true;
              }
              return false;
          }
      }, {
          key: 'setSource',
          value: function setSource(url, type) {
              return __async( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                  var transport, lastType, client;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                      while (1) {
                          switch (_context.prev = _context.next) {
                              case 0:
                                  if (this.transport) {
                                      if (this.client) {
                                          this.client.detachTransport();
                                      }
                                      this.transport.destroy();
                                  }
                                  _context.prev = 1;

                                  this.endpoint = Url.parse(url);
                                  _context.next = 9;
                                  break;

                              case 5:
                                  _context.prev = 5;
                                  _context.t0 = _context['catch'](1);

                                  console.error("bad endpoint: ", _context.t0);
                                  return _context.abrupt('return');

                              case 9:
                                  this.url = url;
                                  transport = this.modules[type].transport;

                                  this.transport = new transport.constructor(this.endpoint, this.type, transport.options);

                                  lastType = this.type;

                                  this.type = (StreamType$1.isSupported(type) ? type : false) || StreamType$1.fromMime(type);

                                  if (this.type) {
                                      _context.next = 16;
                                      break;
                                  }

                                  throw new Error("Bad stream type");

                              case 16:
                                  if (!(lastType != this.type || !this.client)) {
                                      _context.next = 22;
                                      break;
                                  }

                                  if (this.client) {
                                      this.client.destroy();
                                  }
                                  client = this.modules[type].client;

                                  this.client = new client({ flush: 200, onError: this.errorHandler, setSourceOfPlay: this.setSource.bind(this) });
                                  _context.next = 24;
                                  break;

                              case 22:
                                  _context.next = 24;
                                  return this.client.reset();

                              case 24:

                                  if (this.queryCredentials) {
                                      this.client.queryCredentials = this.queryCredentials;
                                  }
                                  if (this.remuxer) {
                                      this.remuxer.destroy();
                                      this.remuxer = null;
                                  }
                                  this.remuxer = new Remuxer(this.player);
                                  this.remuxer.attachClient(this.client);

                                  this.client.attachTransport(this.transport);
                                  this.client.setSource(this.endpoint);

                                  if (this.player.autoplay) {
                                      this.start();
                                  }

                              case 31:
                              case 'end':
                                  return _context.stop();
                          }
                      }
                  }, _callee, this, [[1, 5]]);
              }).call(this));
          }
      }, {
          key: 'start',
          value: function start() {
              if (!this.transport || !this.client) {
                  return;
              }
              this.client.start();
          }
      }, {
          key: 'stop',
          value: function stop() {
              if (this.client) {
                  this.client.stop();
              }
          }
      }, {
          key: 'destroy',
          value: function destroy() {
              if (this.transport) {
                  if (this.client) {
                      this.client.detachTransport();
                  }
                  this.transport.destroy();
              }
              if (this.client) {
                  this.client.destroy();
              }
              if (this.remuxer) {
                  this.remuxer.destroy();
                  this.remuxer = null;
              }
          }

          // pts is presentation time in second (e.g. media.currentTime)

      }, {
          key: 'pullOOBData',
          value: function pullOOBData(pts) {
              if (this.remuxer) {
                  return this.remuxer.pullOOBData(pts);
              }
          }
      }], [{
          key: 'canPlayWithModules',
          value: function canPlayWithModules(mimeType, modules) {

              var filteredModules = {};
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                  for (var _iterator2 = modules[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var module = _step2.value;

                      var transport = module.transport || WebsocketTransport;
                      var client = module.client || RTSPClient;
                      if (transport.canTransfer(client.streamType())) {
                          filteredModules[client.streamType()] = true;
                      }
                  }
              } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                          _iterator2.return();
                      }
                  } finally {
                      if (_didIteratorError2) {
                          throw _iteratorError2;
                      }
                  }
              }

              for (var type in filteredModules) {
                  if (type == StreamType$1.fromMime(mimeType)) {
                      return true;
                  }
              }
              return false;
          }

          /// TODO: deprecate it?

      }, {
          key: 'canPlay',
          value: function canPlay(resource) {
              return StreamType$1.fromMime(resource.type) || StreamType$1.fromUrl(resource.src);
          }
      }]);
      return WSPlayer;
  }();

  var _defaultColormapConfi;
  var Log$b = getTagged('heatmap');

  // config data is from https://github.com/bpostlethwaite/colormap, MIT license
  var defaultColormapConfigs = (_defaultColormapConfi = {
      "jet": [{ "index": 0, "rgb": [0, 0, 131] }, { "index": 0.125, "rgb": [0, 60, 170] }, { "index": 0.375, "rgb": [5, 255, 255] }, { "index": 0.625, "rgb": [255, 255, 0] }, { "index": 0.875, "rgb": [250, 0, 0] }, { "index": 1, "rgb": [128, 0, 0] }],

      "hsv": [{ "index": 0, "rgb": [255, 0, 0] }, { "index": 0.169, "rgb": [253, 255, 2] }, { "index": 0.173, "rgb": [247, 255, 2] }, { "index": 0.337, "rgb": [0, 252, 4] }, { "index": 0.341, "rgb": [0, 252, 10] }, { "index": 0.506, "rgb": [1, 249, 255] }, { "index": 0.671, "rgb": [2, 0, 253] }, { "index": 0.675, "rgb": [8, 0, 253] }, { "index": 0.839, "rgb": [255, 0, 251] }, { "index": 0.843, "rgb": [255, 0, 245] }, { "index": 1, "rgb": [255, 0, 6] }],

      "hot": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.3, "rgb": [230, 0, 0] }, { "index": 0.6, "rgb": [255, 210, 0] }, { "index": 1, "rgb": [255, 255, 255] }],

      "cool": [{ "index": 0, "rgb": [0, 255, 255] }, { "index": 1, "rgb": [255, 0, 255] }],

      "spring": [{ "index": 0, "rgb": [255, 0, 255] }, { "index": 1, "rgb": [255, 255, 0] }],

      "summer": [{ "index": 0, "rgb": [0, 128, 102] }, { "index": 1, "rgb": [255, 255, 102] }],

      "autumn": [{ "index": 0, "rgb": [255, 0, 0] }, { "index": 1, "rgb": [255, 255, 0] }],

      "winter": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 1, "rgb": [0, 255, 128] }],

      "bone": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.376, "rgb": [84, 84, 116] }, { "index": 0.753, "rgb": [169, 200, 200] }, { "index": 1, "rgb": [255, 255, 255] }],

      "copper": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.804, "rgb": [255, 160, 102] }, { "index": 1, "rgb": [255, 199, 127] }],

      "greys": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 1, "rgb": [255, 255, 255] }],

      "yignbu": [{ "index": 0, "rgb": [8, 29, 88] }, { "index": 0.125, "rgb": [37, 52, 148] }, { "index": 0.25, "rgb": [34, 94, 168] }, { "index": 0.375, "rgb": [29, 145, 192] }, { "index": 0.5, "rgb": [65, 182, 196] }, { "index": 0.625, "rgb": [127, 205, 187] }, { "index": 0.75, "rgb": [199, 233, 180] }, { "index": 0.875, "rgb": [237, 248, 217] }, { "index": 1, "rgb": [255, 255, 217] }],

      "greens": [{ "index": 0, "rgb": [0, 68, 27] }, { "index": 0.125, "rgb": [0, 109, 44] }, { "index": 0.25, "rgb": [35, 139, 69] }, { "index": 0.375, "rgb": [65, 171, 93] }, { "index": 0.5, "rgb": [116, 196, 118] }, { "index": 0.625, "rgb": [161, 217, 155] }, { "index": 0.75, "rgb": [199, 233, 192] }, { "index": 0.875, "rgb": [229, 245, 224] }, { "index": 1, "rgb": [247, 252, 245] }],

      "yiorrd": [{ "index": 0, "rgb": [128, 0, 38] }, { "index": 0.125, "rgb": [189, 0, 38] }, { "index": 0.25, "rgb": [227, 26, 28] }, { "index": 0.375, "rgb": [252, 78, 42] }, { "index": 0.5, "rgb": [253, 141, 60] }, { "index": 0.625, "rgb": [254, 178, 76] }, { "index": 0.75, "rgb": [254, 217, 118] }, { "index": 0.875, "rgb": [255, 237, 160] }, { "index": 1, "rgb": [255, 255, 204] }],

      "bluered": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 1, "rgb": [255, 0, 0] }],

      "rdbu": [{ "index": 0, "rgb": [5, 10, 172] }, { "index": 0.35, "rgb": [106, 137, 247] }, { "index": 0.5, "rgb": [190, 190, 190] }, { "index": 0.6, "rgb": [220, 170, 132] }, { "index": 0.7, "rgb": [230, 145, 90] }, { "index": 1, "rgb": [178, 10, 28] }],

      "picnic": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 0.1, "rgb": [51, 153, 255] }, { "index": 0.2, "rgb": [102, 204, 255] }, { "index": 0.3, "rgb": [153, 204, 255] }, { "index": 0.4, "rgb": [204, 204, 255] }, { "index": 0.5, "rgb": [255, 255, 255] }, { "index": 0.6, "rgb": [255, 204, 255] }, { "index": 0.7, "rgb": [255, 153, 255] }, { "index": 0.8, "rgb": [255, 102, 204] }, { "index": 0.9, "rgb": [255, 102, 102] }, { "index": 1, "rgb": [255, 0, 0] }],

      "rainbow": [{ "index": 0, "rgb": [150, 0, 90] }, { "index": 0.125, "rgb": [0, 0, 200] }, { "index": 0.25, "rgb": [0, 25, 255] }, { "index": 0.375, "rgb": [0, 152, 255] }, { "index": 0.5, "rgb": [44, 255, 150] }, { "index": 0.625, "rgb": [151, 255, 0] }, { "index": 0.75, "rgb": [255, 234, 0] }, { "index": 0.875, "rgb": [255, 111, 0] }, { "index": 1, "rgb": [255, 0, 0] }],

      "portland": [{ "index": 0, "rgb": [12, 51, 131] }, { "index": 0.25, "rgb": [10, 136, 186] }, { "index": 0.5, "rgb": [242, 211, 56] }, { "index": 0.75, "rgb": [242, 143, 56] }, { "index": 1, "rgb": [217, 30, 30] }],

      "blackbody": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.2, "rgb": [230, 0, 0] }, { "index": 0.4, "rgb": [230, 210, 0] }, { "index": 0.7, "rgb": [255, 255, 255] }, { "index": 1, "rgb": [160, 200, 255] }],

      "earth": [{ "index": 0, "rgb": [0, 0, 130] }, { "index": 0.1, "rgb": [0, 180, 180] }, { "index": 0.2, "rgb": [40, 210, 40] }, { "index": 0.4, "rgb": [230, 230, 50] }, { "index": 0.6, "rgb": [120, 70, 20] }, { "index": 1, "rgb": [255, 255, 255] }],

      "electric": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.15, "rgb": [30, 0, 100] }, { "index": 0.4, "rgb": [120, 0, 100] }, { "index": 0.6, "rgb": [160, 90, 0] }, { "index": 0.8, "rgb": [230, 200, 0] }, { "index": 1, "rgb": [255, 250, 220] }],

      "alpha": [{ "index": 0, "rgb": [255, 255, 255, 0] }, { "index": 1, "rgb": [255, 255, 255, 1] }],

      "viridis": [{ "index": 0, "rgb": [68, 1, 84] }, { "index": 0.13, "rgb": [71, 44, 122] }, { "index": 0.25, "rgb": [59, 81, 139] }, { "index": 0.38, "rgb": [44, 113, 142] }, { "index": 0.5, "rgb": [33, 144, 141] }, { "index": 0.63, "rgb": [39, 173, 129] }, { "index": 0.75, "rgb": [92, 200, 99] }, { "index": 0.88, "rgb": [170, 220, 50] }, { "index": 1, "rgb": [253, 231, 37] }],

      "inferno": [{ "index": 0, "rgb": [0, 0, 4] }, { "index": 0.13, "rgb": [31, 12, 72] }, { "index": 0.25, "rgb": [85, 15, 109] }, { "index": 0.38, "rgb": [136, 34, 106] }, { "index": 0.5, "rgb": [186, 54, 85] }, { "index": 0.63, "rgb": [227, 89, 51] }, { "index": 0.75, "rgb": [249, 140, 10] }, { "index": 0.88, "rgb": [249, 201, 50] }, { "index": 1, "rgb": [252, 255, 164] }],

      "magma": [{ "index": 0, "rgb": [0, 0, 4] }, { "index": 0.13, "rgb": [28, 16, 68] }, { "index": 0.25, "rgb": [79, 18, 123] }, { "index": 0.38, "rgb": [129, 37, 129] }, { "index": 0.5, "rgb": [181, 54, 122] }, { "index": 0.63, "rgb": [229, 80, 100] }, { "index": 0.75, "rgb": [251, 135, 97] }, { "index": 0.88, "rgb": [254, 194, 135] }, { "index": 1, "rgb": [252, 253, 191] }],

      "plasma": [{ "index": 0, "rgb": [13, 8, 135] }, { "index": 0.13, "rgb": [75, 3, 161] }, { "index": 0.25, "rgb": [125, 3, 168] }, { "index": 0.38, "rgb": [168, 34, 150] }, { "index": 0.5, "rgb": [203, 70, 121] }, { "index": 0.63, "rgb": [229, 107, 93] }, { "index": 0.75, "rgb": [248, 148, 65] }, { "index": 0.88, "rgb": [253, 195, 40] }, { "index": 1, "rgb": [240, 249, 33] }],

      "warm": [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.13, "rgb": [172, 0, 187] }, { "index": 0.25, "rgb": [219, 0, 170] }, { "index": 0.38, "rgb": [255, 0, 130] }, { "index": 0.5, "rgb": [255, 63, 74] }, { "index": 0.63, "rgb": [255, 123, 0] }, { "index": 0.75, "rgb": [234, 176, 0] }, { "index": 0.88, "rgb": [190, 228, 0] }, { "index": 1, "rgb": [147, 255, 0] }]

  }, defineProperty(_defaultColormapConfi, 'cool', [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.13, "rgb": [116, 0, 218] }, { "index": 0.25, "rgb": [98, 74, 237] }, { "index": 0.38, "rgb": [68, 146, 231] }, { "index": 0.5, "rgb": [0, 204, 197] }, { "index": 0.63, "rgb": [0, 247, 146] }, { "index": 0.75, "rgb": [0, 255, 88] }, { "index": 0.88, "rgb": [40, 255, 8] }, { "index": 1, "rgb": [147, 255, 0] }]), defineProperty(_defaultColormapConfi, "rainbow-soft", [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.1, "rgb": [199, 0, 180] }, { "index": 0.2, "rgb": [255, 0, 121] }, { "index": 0.3, "rgb": [255, 108, 0] }, { "index": 0.4, "rgb": [222, 194, 0] }, { "index": 0.5, "rgb": [150, 255, 0] }, { "index": 0.6, "rgb": [0, 255, 55] }, { "index": 0.7, "rgb": [0, 246, 150] }, { "index": 0.8, "rgb": [50, 167, 222] }, { "index": 0.9, "rgb": [103, 51, 235] }, { "index": 1, "rgb": [124, 0, 186] }]), defineProperty(_defaultColormapConfi, "bathymetry", [{ "index": 0, "rgb": [40, 26, 44] }, { "index": 0.13, "rgb": [59, 49, 90] }, { "index": 0.25, "rgb": [64, 76, 139] }, { "index": 0.38, "rgb": [63, 110, 151] }, { "index": 0.5, "rgb": [72, 142, 158] }, { "index": 0.63, "rgb": [85, 174, 163] }, { "index": 0.75, "rgb": [120, 206, 163] }, { "index": 0.88, "rgb": [187, 230, 172] }, { "index": 1, "rgb": [253, 254, 204] }]), defineProperty(_defaultColormapConfi, "cdom", [{ "index": 0, "rgb": [47, 15, 62] }, { "index": 0.13, "rgb": [87, 23, 86] }, { "index": 0.25, "rgb": [130, 28, 99] }, { "index": 0.38, "rgb": [171, 41, 96] }, { "index": 0.5, "rgb": [206, 67, 86] }, { "index": 0.63, "rgb": [230, 106, 84] }, { "index": 0.75, "rgb": [242, 149, 103] }, { "index": 0.88, "rgb": [249, 193, 135] }, { "index": 1, "rgb": [254, 237, 176] }]), defineProperty(_defaultColormapConfi, "chlorophyll", [{ "index": 0, "rgb": [18, 36, 20] }, { "index": 0.13, "rgb": [25, 63, 41] }, { "index": 0.25, "rgb": [24, 91, 59] }, { "index": 0.38, "rgb": [13, 119, 72] }, { "index": 0.5, "rgb": [18, 148, 80] }, { "index": 0.63, "rgb": [80, 173, 89] }, { "index": 0.75, "rgb": [132, 196, 122] }, { "index": 0.88, "rgb": [175, 221, 162] }, { "index": 1, "rgb": [215, 249, 208] }]), defineProperty(_defaultColormapConfi, "density", [{ "index": 0, "rgb": [54, 14, 36] }, { "index": 0.13, "rgb": [89, 23, 80] }, { "index": 0.25, "rgb": [110, 45, 132] }, { "index": 0.38, "rgb": [120, 77, 178] }, { "index": 0.5, "rgb": [120, 113, 213] }, { "index": 0.63, "rgb": [115, 151, 228] }, { "index": 0.75, "rgb": [134, 185, 227] }, { "index": 0.88, "rgb": [177, 214, 227] }, { "index": 1, "rgb": [230, 241, 241] }]), defineProperty(_defaultColormapConfi, "freesurface-blue", [{ "index": 0, "rgb": [30, 4, 110] }, { "index": 0.13, "rgb": [47, 14, 176] }, { "index": 0.25, "rgb": [41, 45, 236] }, { "index": 0.38, "rgb": [25, 99, 212] }, { "index": 0.5, "rgb": [68, 131, 200] }, { "index": 0.63, "rgb": [114, 156, 197] }, { "index": 0.75, "rgb": [157, 181, 203] }, { "index": 0.88, "rgb": [200, 208, 216] }, { "index": 1, "rgb": [241, 237, 236] }]), defineProperty(_defaultColormapConfi, "freesurface-red", [{ "index": 0, "rgb": [60, 9, 18] }, { "index": 0.13, "rgb": [100, 17, 27] }, { "index": 0.25, "rgb": [142, 20, 29] }, { "index": 0.38, "rgb": [177, 43, 27] }, { "index": 0.5, "rgb": [192, 87, 63] }, { "index": 0.63, "rgb": [205, 125, 105] }, { "index": 0.75, "rgb": [216, 162, 148] }, { "index": 0.88, "rgb": [227, 199, 193] }, { "index": 1, "rgb": [241, 237, 236] }]), defineProperty(_defaultColormapConfi, "oxygen", [{ "index": 0, "rgb": [64, 5, 5] }, { "index": 0.13, "rgb": [106, 6, 15] }, { "index": 0.25, "rgb": [144, 26, 7] }, { "index": 0.38, "rgb": [168, 64, 3] }, { "index": 0.5, "rgb": [188, 100, 4] }, { "index": 0.63, "rgb": [206, 136, 11] }, { "index": 0.75, "rgb": [220, 174, 25] }, { "index": 0.88, "rgb": [231, 215, 44] }, { "index": 1, "rgb": [248, 254, 105] }]), defineProperty(_defaultColormapConfi, "par", [{ "index": 0, "rgb": [51, 20, 24] }, { "index": 0.13, "rgb": [90, 32, 35] }, { "index": 0.25, "rgb": [129, 44, 34] }, { "index": 0.38, "rgb": [159, 68, 25] }, { "index": 0.5, "rgb": [182, 99, 19] }, { "index": 0.63, "rgb": [199, 134, 22] }, { "index": 0.75, "rgb": [212, 171, 35] }, { "index": 0.88, "rgb": [221, 210, 54] }, { "index": 1, "rgb": [225, 253, 75] }]), defineProperty(_defaultColormapConfi, "phase", [{ "index": 0, "rgb": [145, 105, 18] }, { "index": 0.13, "rgb": [184, 71, 38] }, { "index": 0.25, "rgb": [186, 58, 115] }, { "index": 0.38, "rgb": [160, 71, 185] }, { "index": 0.5, "rgb": [110, 97, 218] }, { "index": 0.63, "rgb": [50, 123, 164] }, { "index": 0.75, "rgb": [31, 131, 110] }, { "index": 0.88, "rgb": [77, 129, 34] }, { "index": 1, "rgb": [145, 105, 18] }]), defineProperty(_defaultColormapConfi, "salinity", [{ "index": 0, "rgb": [42, 24, 108] }, { "index": 0.13, "rgb": [33, 50, 162] }, { "index": 0.25, "rgb": [15, 90, 145] }, { "index": 0.38, "rgb": [40, 118, 137] }, { "index": 0.5, "rgb": [59, 146, 135] }, { "index": 0.63, "rgb": [79, 175, 126] }, { "index": 0.75, "rgb": [120, 203, 104] }, { "index": 0.88, "rgb": [193, 221, 100] }, { "index": 1, "rgb": [253, 239, 154] }]), defineProperty(_defaultColormapConfi, "temperature", [{ "index": 0, "rgb": [4, 35, 51] }, { "index": 0.13, "rgb": [23, 51, 122] }, { "index": 0.25, "rgb": [85, 59, 157] }, { "index": 0.38, "rgb": [129, 79, 143] }, { "index": 0.5, "rgb": [175, 95, 130] }, { "index": 0.63, "rgb": [222, 112, 101] }, { "index": 0.75, "rgb": [249, 146, 66] }, { "index": 0.88, "rgb": [249, 196, 65] }, { "index": 1, "rgb": [232, 250, 91] }]), defineProperty(_defaultColormapConfi, "turbidity", [{ "index": 0, "rgb": [34, 31, 27] }, { "index": 0.13, "rgb": [65, 50, 41] }, { "index": 0.25, "rgb": [98, 69, 52] }, { "index": 0.38, "rgb": [131, 89, 57] }, { "index": 0.5, "rgb": [161, 112, 59] }, { "index": 0.63, "rgb": [185, 140, 66] }, { "index": 0.75, "rgb": [202, 174, 88] }, { "index": 0.88, "rgb": [216, 209, 126] }, { "index": 1, "rgb": [233, 246, 171] }]), defineProperty(_defaultColormapConfi, "velocity-blue", [{ "index": 0, "rgb": [17, 32, 64] }, { "index": 0.13, "rgb": [35, 52, 116] }, { "index": 0.25, "rgb": [29, 81, 156] }, { "index": 0.38, "rgb": [31, 113, 162] }, { "index": 0.5, "rgb": [50, 144, 169] }, { "index": 0.63, "rgb": [87, 173, 176] }, { "index": 0.75, "rgb": [149, 196, 189] }, { "index": 0.88, "rgb": [203, 221, 211] }, { "index": 1, "rgb": [254, 251, 230] }]), defineProperty(_defaultColormapConfi, "velocity-green", [{ "index": 0, "rgb": [23, 35, 19] }, { "index": 0.13, "rgb": [24, 64, 38] }, { "index": 0.25, "rgb": [11, 95, 45] }, { "index": 0.38, "rgb": [39, 123, 35] }, { "index": 0.5, "rgb": [95, 146, 12] }, { "index": 0.63, "rgb": [152, 165, 18] }, { "index": 0.75, "rgb": [201, 186, 69] }, { "index": 0.88, "rgb": [233, 216, 137] }, { "index": 1, "rgb": [255, 253, 205] }]), defineProperty(_defaultColormapConfi, "cubehelix", [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.07, "rgb": [22, 5, 59] }, { "index": 0.13, "rgb": [60, 4, 105] }, { "index": 0.2, "rgb": [109, 1, 135] }, { "index": 0.27, "rgb": [161, 0, 147] }, { "index": 0.33, "rgb": [210, 2, 142] }, { "index": 0.4, "rgb": [251, 11, 123] }, { "index": 0.47, "rgb": [255, 29, 97] }, { "index": 0.53, "rgb": [255, 54, 69] }, { "index": 0.6, "rgb": [255, 85, 46] }, { "index": 0.67, "rgb": [255, 120, 34] }, { "index": 0.73, "rgb": [255, 157, 37] }, { "index": 0.8, "rgb": [241, 191, 57] }, { "index": 0.87, "rgb": [224, 220, 93] }, { "index": 0.93, "rgb": [218, 241, 142] }, { "index": 1, "rgb": [227, 253, 198] }]), defineProperty(_defaultColormapConfi, "crowd", [{ "index": 0, "rgba": [0, 0, 131, 0] }, { "index": 0.125, "rgba": [0, 60, 170, 0.3] }, { "index": 0.3, "rgba": [5, 255, 255, 0.3] }, { "index": 0.4, "rgba": [255, 255, 0, 0.3] }, { "index": 0.5, "rgba": [250, 0, 0, 0.3] }, { "index": 1, "rgba": [128, 0, 0, 0.3] }]), _defaultColormapConfi);

  var defaultColormapConfig = defaultColormapConfigs["crowd"];

  var Colormap = function () {
      function Colormap(config) {
          classCallCheck(this, Colormap);

          this.updateConfig(config);
      }

      createClass(Colormap, [{
          key: '_configFromList',
          value: function _configFromList(l) {
              var config = {};
              var e;
              for (var i = 0; i < l.length; i++) {
                  e = l[i];
                  if (e["rgba"]) {
                      config[e["index"]] = "rgba(" + e["rgba"][0] + "," + e["rgba"][1] + "," + e["rgba"][2] + "," + e["rgba"][3] + ")";
                  } else {
                      config[e["index"]] = "rgb(" + e["rgb"][0] + "," + e["rgb"][1] + "," + e["rgb"][2] + ")";
                  }
              }
              return config;
          }
      }, {
          key: 'updateConfig',
          value: function updateConfig(config) {
              if (config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) == _typeof('')) {
                  config = defaultColormapConfigs[config];
              }
              if (config && (typeof config === 'undefined' ? 'undefined' : _typeof(config)) == _typeof([])) {
                  config = this._configFromList(config);
              }
              if (!config) {
                  Log$b.log("colormap config not set, use default");
                  config = this._configFromList(defaultColormapConfig);
              }

              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              canvas.width = 256;
              canvas.height = 1;
              var colors = ctx.createLinearGradient(0, 0, 256, 1);
              for (var key in config) {
                  // console.log(key, config[key]);
                  colors.addColorStop(key, config[key]);
              }

              ctx.fillStyle = colors;
              ctx.fillRect(0, 0, 256, 1);
              this.data = ctx.getImageData(0, 0, 256, 1).data;
          }
      }, {
          key: 'getColor',
          value: function getColor(gray) {
              if (gray < 0) {
                  gray = 0;
              } else if (gray > 255) {
                  gray = 255;
              }
              var idx = gray * 4;
              var r = this.data[idx];
              var g = this.data[idx + 1];
              var b = this.data[idx + 2];
              var a = this.data[idx + 3];
              return [r, g, b, a];
          }
      }]);
      return Colormap;
  }();

  var LOG_TAG$4 = "overlay";
  var Log$c = getTagged(LOG_TAG$4);

  var defaultStyle = {
      color: 'white',
      lineWidth: 1
  };

  var defaultOverlayConfig = {
      canvas: "#canvas",
      canvasWidth: 1920,
      canvasHeight: 1080
  };

  var TYPE = {
      OBJECT: 0,
      EVNET: 1,
      SCENARIO: 2
  };

  var OverlayRenderer = function () {
      function OverlayRenderer(config, colormapConfig) {
          classCallCheck(this, OverlayRenderer);

          //对象追踪
          this.tracklets = {};
          //事件规则
          this.eventrules = {};
          //长尾监测
          this.detections = [];
          this.colormap = new Colormap(colormapConfig);
          this.preframeTime = 0;
          this._initConfig(config);

          this.clearScenario = false;
      }

      createClass(OverlayRenderer, [{
          key: '_initConfig',
          value: function _initConfig(config) {
              config = config || defaultOverlayConfig;
              if (_typeof(config.canvas) == _typeof('')) {
                  this.canvas = document.getElementById(config.canvas);
              } else {
                  this.canvas = config.canvas;
              }
              this.ctx = this.canvas.getContext('2d');

              this.offlineCanvas = document.createElement('canvas');
              this.offlineCanvas.width = config.canvasWidth;
              this.offlineCanvas.height = config.canvasHeight;
              this.offlineCtx = this.offlineCanvas.getContext('2d');

              //专门绘制热力图的Canvas
              this.offlineHeatmapCanvas = document.createElement('canvas');
              this.offlineHeatmapCtx = this.offlineHeatmapCanvas.getContext('2d');
              this.offlineHeatmapCtx.show = false;

              this.canvasWidth = config.canvasWidth;
              this.canvasHeight = config.canvasHeight;

              this.deltime = 0;
          }
      }, {
          key: 'restart',
          value: function restart() {
              var _this = this;

              Object.keys(this.tracklets).forEach(function (k) {
                  delete _this.tracklets[k];
              });

              Object.keys(this.eventrules).forEach(function (k) {
                  delete _this.eventrules[k];
              });

              Object.keys(this.detections).forEach(function (k) {
                  delete _this.detections[k];
              });

              this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          }
      }, {
          key: 'getColormap',
          value: function getColormap() {
              return this.colormap;
          }
      }, {
          key: 'renderer',
          value: function renderer(currentTime, previewInfo, scale) {
              var _this2 = this;

              var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
              var ObjectID = arguments[4];


              this.deltime = currentTime - this.preframeTime;
              this.preframeTime = currentTime;

              this.offlineCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

              if (previewInfo) {

                  //处理结构化
                  if (type == TYPE.OBJECT) {
                      //对象信息处理
                      previewInfo.objects.forEach(function (target) {

                          //处理对象数据
                          if (!target.bounding) {
                              return;
                          }

                          var wordWidth = 0;
                          _this2.offlineCtx.font = TextStyle.textFont;
                          var items = [];

                          if (Console.isConsole && Console.consoleStructure) {
                              console.log(target);
                          }

                          if (PreviewInfoObjectMap[target.objectType]) {
                              if (target.attributes) {
                                  for (var i in PreviewInfoObjectMap[target.objectType].attrs) {
                                      var title = PreviewInfoObjectMap[target.objectType].attrs[i];
                                      var value = StructedFearureValue[target.attributes[i]] || target.attributes[i];
                                      if (value) {
                                          var content = "" + title + ": " + value;
                                          items.push(content);
                                          var itemWidth = _this2.offlineCtx.measureText(content).width;
                                          if (itemWidth > wordWidth) {
                                              wordWidth = itemWidth;
                                          }
                                      }
                                  }
                              }

                              var w = target.bounding.vertices[1].x - target.bounding.vertices[0].x;
                              var h = target.bounding.vertices[1].y - target.bounding.vertices[0].y;
                              var x = target.bounding.vertices[0].x;
                              var y = target.bounding.vertices[0].y;
                              w = w * scale;
                              h = h * scale;
                              x = x * scale;
                              y = y * scale;

                              _this2.tracklets[target.trackId] = {
                                  roi: _this2._rectToRoi(x, y, w, h),
                                  object: target.objectId || "",
                                  style: {
                                      color: PreviewInfoObjectMap[target.objectType].color || defaultStyle.color,
                                      lineWidth: PreviewInfoObjectMap[target.objectType].lineWidth || defaultStyle.lineWidth,
                                      opacity: PreviewInfoObjectMap[target.objectType].opacity || 0,
                                      frameWidth: wordWidth + 8
                                  },
                                  attr: {
                                      items: items
                                  },
                                  animation: {
                                      duration: 200,
                                      status: 0,
                                      opacity: 1
                                  },
                                  ts: currentTime
                              };
                          }
                      });
                  }
                  //处理长尾
                  else if (type == TYPE.SCENARIO) {

                          var detections = [];

                          //对象信息处理
                          previewInfo.objects.forEach(function (target) {

                              //处理对象数据
                              if (!target.bounding || !target.scenario) {
                                  return;
                              }

                              var wordWidth = 0;
                              _this2.offlineCtx.font = TextStyle.textFont;
                              var items = [];

                              if (Console.isConsole && Console.consoleScenario) {
                                  console.log(target);
                              }

                              var vertices = [];
                              target.bounding.vertices.forEach(function (data) {
                                  var vertice = {
                                      x: data.x * scale,
                                      y: data.y * scale
                                  };
                                  vertices.push(vertice);
                              });

                              if (PreviewInfoScenarioMap[target.scenario.type].tips) {
                                  var content = "" + PreviewInfoScenarioMap[target.scenario.type].tips;
                                  items.push(content);
                                  var itemWidth = _this2.offlineCtx.measureText(content).width;
                                  if (itemWidth > wordWidth) {
                                      wordWidth = itemWidth;
                                  }
                              }

                              var detection = {
                                  roi: vertices,
                                  ts: currentTime,
                                  style: {
                                      color: PreviewInfoScenarioMap[target.scenario.type].color || defaultStyle.color,
                                      lineWidth: PreviewInfoScenarioMap[target.scenario.type].lineWidth || defaultStyle.lineWidth,
                                      opacity: PreviewInfoScenarioMap[target.scenario.type].opacity || 0,
                                      frameWidth: wordWidth + 8
                                  },
                                  animation: {
                                      duration: 2000,
                                      status: 0,
                                      opacity: 1
                                  },
                                  attr: {
                                      items: items
                                  }
                              };
                              detections.push(detection);
                          });

                          if (detections.length > 0) {
                              this.detections = detections;
                          }
                      }
                      //处理事件
                      else if (type == TYPE.EVNET) {
                              //事件规则信息处理
                              previewInfo.rules.forEach(function (target) {

                                  if (Console.isConsole && Console.consoleEventRule) {
                                      console.log(target);
                                  }

                                  var vertices = [];
                                  target.roi.vertices.forEach(function (data) {
                                      var vertice = {
                                          x: data.x * scale,
                                          y: data.y * scale
                                      };
                                      vertices.push(vertice);
                                  });

                                  _this2.eventrules[target.ruleId] = {
                                      type: target.type,
                                      roi: vertices,
                                      duration: target.durationMs | 800 + 200,
                                      ts: 0,
                                      animation: {
                                          status: 0,
                                          opacity: 1
                                      }
                                  };
                              });

                              //对象信息处理
                              previewInfo.objects.forEach(function (target) {
                                  //绘制人群密度热力图
                                  if (target.objectType == 6 && target.crowd) {

                                      if (Console.isConsole && Console.consoleCrowd) {
                                          console.log(target);
                                      }

                                      _this2.offlineHeatmapCanvas.width = target.crowd.densitySize.width;
                                      _this2.offlineHeatmapCanvas.height = target.crowd.densitySize.height;

                                      var offlineHeatmapImg = _this2.offlineHeatmapCtx.getImageData(0, 0, target.crowd.densitySize.width, target.crowd.densitySize.height);
                                      var gray, idx, color;
                                      for (var i = 0; i < _this2.canvasHeight; i++) {
                                          for (var j = 0; j < target.crowd.densitySize.width; j++) {
                                              idx = i * target.crowd.densitySize.width + j;
                                              gray = target.crowd.density[idx];
                                              idx *= 4;
                                              color = _this2.colormap.getColor(gray);
                                              offlineHeatmapImg.data[idx] = color[0];
                                              offlineHeatmapImg.data[idx + 1] = color[1];
                                              offlineHeatmapImg.data[idx + 2] = color[2];
                                              offlineHeatmapImg.data[idx + 3] = color[3];
                                          }
                                      }
                                      _this2.offlineHeatmapCtx.putImageData(offlineHeatmapImg, 0, 0);
                                      _this2.offlineHeatmapCtx.show = true;
                                      _this2.offlineHeatmapCtx.content = HeatmapStyle.content + target.crowd.quantity;
                                  }

                                  //如果对象被追踪,更新绘制框
                                  if (_this2.tracklets[target.trackId]) {
                                      var w = target.bounding.vertices[1].x - target.bounding.vertices[0].x;
                                      var h = target.bounding.vertices[1].y - target.bounding.vertices[0].y;
                                      var x = target.bounding.vertices[0].x;
                                      var y = target.bounding.vertices[0].y;
                                      w = w * scale;
                                      h = h * scale;
                                      x = x * scale;
                                      y = y * scale;

                                      _this2.tracklets[target.trackId].roi = _this2._rectToRoi(x, y, w, h);
                                  }

                                  //如果对象有时间，则被追踪
                                  target.events.forEach(function (event) {

                                      if (Console.isConsole && Console.consoleEvent) {
                                          console.log(event);
                                      }

                                      if (_this2.eventrules[event.ruleId]) {
                                          var _type = _this2.eventrules[event.ruleId].type;

                                          //徘徊事件、逗留事件、违停事件绘制Object
                                          if (_type == 1 || _type == 2 || _type == 5) {

                                              //处理对象数据
                                              if (!target.bounding) {
                                                  return;
                                              }

                                              var wordWidth = 0;
                                              _this2.offlineCtx.font = TextStyle.textFont;
                                              var items = [];

                                              if (target.events && target.events.length > 0 && PreviewInfoEventMap[_type].tips) {
                                                  var content = "" + PreviewInfoEventMap[_type].tips;
                                                  items.push(content);
                                                  var itemWidth = _this2.offlineCtx.measureText(content).width;
                                                  if (itemWidth > wordWidth) {
                                                      wordWidth = itemWidth;
                                                  }
                                              }

                                              var _w = target.bounding.vertices[1].x - target.bounding.vertices[0].x;
                                              var _h = target.bounding.vertices[1].y - target.bounding.vertices[0].y;
                                              var _x2 = target.bounding.vertices[0].x;
                                              var _y = target.bounding.vertices[0].y;
                                              _w = _w * scale;
                                              _h = _h * scale;
                                              _x2 = _x2 * scale;
                                              _y = _y * scale;

                                              _this2.tracklets[target.trackId] = {
                                                  roi: _this2._rectToRoi(_x2, _y, _w, _h),
                                                  object: target.objectId || "",
                                                  style: {
                                                      color: PreviewInfoEventMap[_type].color || defaultStyle.color,
                                                      lineWidth: PreviewInfoEventMap[_type].lineWidth || defaultStyle.lineWidth,
                                                      opacity: PreviewInfoEventMap[_type].opacity || 0,
                                                      frameWidth: wordWidth + 8
                                                  },
                                                  attr: {
                                                      items: items
                                                  },
                                                  animation: {
                                                      duration: _this2.eventrules[event.ruleId].duration | 200,
                                                      status: 1,
                                                      opacity: 1
                                                  },
                                                  ts: currentTime
                                              };
                                          } else {
                                              if (event.status == 1 || event.status == 2) {
                                                  _this2.eventrules[event.ruleId].ts = _this2.eventrules[event.ruleId].duration;
                                                  _this2.eventrules[event.ruleId].animation.status = 1;
                                                  _this2.eventrules[event.ruleId].animation.opacity = 1;
                                              } else if (event.status == 3) {
                                                  _this2.eventrules[event.ruleId].ts += 0;
                                                  _this2.eventrules[event.ruleId].animation.status = 0;
                                                  _this2.eventrules[event.ruleId].animation.opacity = 1;
                                              }
                                          }
                                      }
                                  });
                              });
                          } else {
                              console.log("Parameter Error");
                          }
              }

              //绘制热度图
              if (this.offlineHeatmapCtx.show) {
                  this.offlineCtx.drawImage(this.offlineHeatmapCanvas, 0, 0, this.canvasWidth, this.canvasHeight);
                  this.offlineCtx.textAlign = "left";
                  this.offlineCtx.font = HeatmapStyle.textFont;
                  this.offlineCtx.fillStyle = HeatmapStyle.textColor;
                  this.offlineCtx.fillText(this.offlineHeatmapCtx.content, HeatmapStyle.left, HeatmapStyle.top, HeatmapStyle.textWidth, HeatmapStyle.textHeight);
              }

              //绘制追踪对象
              Object.keys(this.tracklets).forEach(function (k) {

                  if (ObjectID) {
                      if (ObjectID == _this2.tracklets[k].object) {
                          _this2._rendererTracklet(_this2.tracklets[k], _this2.offlineCtx);
                      }
                  } else {
                      _this2._rendererTracklet(_this2.tracklets[k], _this2.offlineCtx);
                  }

                  var lastTime = _this2.tracklets[k].ts;
                  // 200ms
                  if (currentTime - lastTime > _this2.tracklets[k].animation.duration) {
                      delete _this2.tracklets[k];
                  }
              });

              //绘制事件规则
              Object.keys(this.eventrules).forEach(function (k) {

                  _this2._rendererEventrule(_this2.eventrules[k], _this2.offlineCtx);

                  _this2.eventrules[k].ts -= _this2.deltime;
                  if (_this2.eventrules[k].ts < 0) {
                      _this2.eventrules[k].ts = 0;
                  }
              });

              //绘制长尾检测
              Object.keys(this.detections).forEach(function (index) {

                  _this2._rendererDetection(_this2.detections[index], _this2.offlineCtx);

                  /*
                  let lastTime = this.detections[index].ts;
                  // 200ms
                  if (currentTime - lastTime > this.detections[index].animation.duration) {
                      delete this.detections[index];
                  }
                  */
              });

              this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
              this.ctx.drawImage(this.offlineCanvas, 0, 0, this.canvasWidth, this.canvasHeight);
          }

          //绘制追踪对象

      }, {
          key: '_rendererTracklet',
          value: function _rendererTracklet(tracklet, offlineCtx) {

              //叠框
              this._rendererRoi(tracklet.roi, tracklet.style.color, tracklet.style.lineWidth, tracklet.animation, tracklet.style.opacity, offlineCtx);

              //绘制属性
              var items = tracklet.attr.items;
              if (items.length > 0) {
                  var x = 0,
                      y = 0;
                  x = tracklet.roi[0].x;
                  y = tracklet.roi[0].y;

                  for (var i = 1; i < tracklet.roi.length; i++) {
                      if (x < tracklet.roi[i].x) {
                          x = tracklet.roi[i].x;
                      }
                      if (y > tracklet.roi[i].y) {
                          y = tracklet.roi[i].y;
                      }
                  }

                  offlineCtx.font = TextStyle.textFont;
                  offlineCtx.textAlign = "start";

                  items.forEach(function (item, index) {
                      offlineCtx.fillStyle = TextStyle.textBackgroundColor;
                      offlineCtx.fillRect(x, y + TextStyle.lineSpace * index + TextStyle.textFrameInterval * index, tracklet.style.frameWidth, TextStyle.textFrameInterval);
                      offlineCtx.fillStyle = TextStyle.textColor;
                      offlineCtx.fillText(item, x + 4, y + TextStyle.lineSpace * index + TextStyle.textFrameInterval * (index + 1));
                  });
              }
          }

          //绘制事件规则

      }, {
          key: '_rendererEventrule',
          value: function _rendererEventrule(eventrule, offlineCtx) {
              var type = eventrule.type;

              var color = void 0;
              var isText = false;
              //越线事件、区域入侵、人群过密、人群滞留事件绘制
              if (type == 3 || type == 4 || type == 50 || type == 51) {

                  color = PreviewInfoEventMap[eventrule.type].color || defaultStyle.color;

                  if (eventrule.ts > 0) {
                      isText = true;
                  } else {
                      eventrule.animation.opacity = 1;
                      eventrule.animation.status = 0;
                  }

                  if (eventrule.roi.length > 0) {

                      this._rendererRoi(eventrule.roi, color, PreviewInfoEventMap[eventrule.type].lineWidth, eventrule.animation, PreviewInfoEventMap[eventrule.type].opacity, offlineCtx);

                      //事件文字
                      if (isText) {
                          var x = 0,
                              y = 0;

                          for (var i = 0; i < eventrule.roi.length; i++) {
                              x += eventrule.roi[i].x;
                              y += eventrule.roi[i].y;
                          }

                          x /= eventrule.roi.length;
                          y /= eventrule.roi.length;

                          offlineCtx.textAlign = "center";
                          offlineCtx.font = EventStyle.textFont;

                          var content = PreviewInfoEventMap[eventrule.type].tips;
                          var width = offlineCtx.measureText(content).width + 8;

                          offlineCtx.fillStyle = EventStyle.textBackgroundColor;
                          offlineCtx.fillRect(x - width / 2, y - EventStyle.textFrameInterval / 2, width, EventStyle.textFrameInterval);

                          offlineCtx.fillStyle = EventStyle.textColor;
                          offlineCtx.fillText(content, x, y - EventStyle.textFrameInterval / 2 + EventStyle.textFrameHeightPerLine, width, EventStyle.textFrameInterval);
                      }
                  }
              }
          }

          //绘制长尾检测

      }, {
          key: '_rendererDetection',
          value: function _rendererDetection(detection, offlineCtx) {
              //叠框
              this._rendererRoi(detection.roi, detection.style.color, detection.style.lineWidth, detection.animation, detection.style.opacity, offlineCtx);

              //绘制属性
              var items = detection.attr.items;
              if (items.length > 0) {
                  var x = 0,
                      y = 0;
                  x = detection.roi[0].x;
                  y = detection.roi[0].y;

                  for (var i = 1; i < detection.roi.length; i++) {
                      if (x < detection.roi[i].x) {
                          x = detection.roi[i].x;
                      }
                      if (y > detection.roi[i].y) {
                          y = detection.roi[i].y;
                      }
                  }

                  offlineCtx.font = TextStyle.textFont;
                  offlineCtx.textAlign = "start";

                  items.forEach(function (item, index) {
                      offlineCtx.fillStyle = TextStyle.textBackgroundColor;
                      offlineCtx.fillRect(x, y + TextStyle.lineSpace * index + TextStyle.textFrameInterval * index, detection.style.frameWidth, TextStyle.textFrameInterval);
                      offlineCtx.fillStyle = TextStyle.textColor;
                      offlineCtx.fillText(item, x + 4, y + TextStyle.lineSpace * index + TextStyle.textFrameInterval * (index + 1));
                  });
              }
          }

          //绘制框

      }, {
          key: '_rendererRoi',
          value: function _rendererRoi(roi, color, lineWidth, animation, fillOpacity, offlineCtx) {

              offlineCtx.beginPath();
              //闪烁效果
              if (animation.status != 0) {
                  offlineCtx.globalAlpha = animation.opacity;
                  if (animation.status == 1) {
                      animation.opacity -= EventStyle.opacitySpeed * this.deltime;
                      if (animation.opacity <= 0.5) {
                          animation.opacity = 0.5;
                          animation.status = 2;
                      }
                  } else {
                      animation.opacity += EventStyle.opacitySpeed * this.deltime;
                      if (animation.opacity >= 1) {
                          animation.opacity = 1;
                          animation.status = 1;
                      }
                  }
              }

              offlineCtx.lineWidth = lineWidth;
              offlineCtx.strokeStyle = color;

              offlineCtx.beginPath();
              offlineCtx.moveTo(roi[0].x, roi[0].y);

              for (var i = 1; i < roi.length; i++) {
                  offlineCtx.lineTo(roi[i].x, roi[i].y);
              }

              offlineCtx.closePath();
              offlineCtx.stroke();

              if (fillOpacity && fillOpacity > 0) {
                  offlineCtx.globalAlpha = fillOpacity * animation.opacity;
                  offlineCtx.fillStyle = color;
                  offlineCtx.fill();
              } else if (animation.status != 0) {
                  offlineCtx.globalAlpha = 0.3 * animation.opacity;
                  offlineCtx.fillStyle = color;
                  offlineCtx.fill();
              }

              offlineCtx.globalAlpha = 1;
          }

          //框坐标转换成ROI

      }, {
          key: '_rectToRoi',
          value: function _rectToRoi(x, y, w, h) {
              var vertices = [];
              var vertice1 = { x: x, y: y };
              vertices.push(vertice1);
              var vertice2 = { x: x + w, y: y };
              vertices.push(vertice2);
              var vertice3 = { x: x + w, y: y + h };
              vertices.push(vertice3);
              var vertice4 = { x: x, y: y + h };
              vertices.push(vertice4);

              return vertices;
          }
      }]);
      return OverlayRenderer;
  }();

  setDefaultLogLevel(LogLevel.Error);

  window.Streamedian = {
      logger: function logger(tag) {
          return getTagged(tag);
      },
      player: function player(node, opts) {
          if (!opts.socket) {
              throw new Error("socket parameter is not set");
          }
          var _options = {
              modules: [{
                  client: RTSPClient,
                  transport: {
                      constructor: WebsocketTransport,
                      options: {
                          socket: opts.socket,
                          reconnectHandler: opts.reconnectHandler || null
                      }
                  }
              }],
              errorHandler: function errorHandler(e) {
                  console.error(e);
                  if (e.data.parsed.code === 302 || e.data.parsed.code === 301) {
                      return;
                  }
                  alert('Failed to start player: ' + e.message);
              },
              queryCredentials: function queryCredentials(client) {
                  return new Promise(function (resolve, reject) {
                      var c = prompt('input credentials in format user:password');
                      if (c) {
                          client.setCredentials.apply(client, c.split(':'));
                          resolve();
                      } else {
                          reject();
                      }
                  });
              }
          };
          return new WSPlayer(node, _options);
      },
      overlayRenderer: function overlayRenderer(config) {
          return new OverlayRenderer(config);
      }
  };

}));
