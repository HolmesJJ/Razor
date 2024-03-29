/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.sensetime = (function() {
    
        /**
         * Namespace sensetime.
         * @exports sensetime
         * @namespace
         */
        var sensetime = {};
    
        sensetime.viper = (function() {
    
            /**
             * Namespace viper.
             * @memberof sensetime
             * @namespace
             */
            var viper = {};
    
            viper.video_process = (function() {
    
                /**
                 * Namespace video_process.
                 * @memberof sensetime.viper
                 * @namespace
                 */
                var video_process = {};
    
                video_process.preview_info = (function() {
    
                    /**
                     * Namespace preview_info.
                     * @memberof sensetime.viper.video_process
                     * @namespace
                     */
                    var preview_info = {};
    
                    preview_info.Vertex = (function() {
    
                        /**
                         * Properties of a Vertex.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface IVertex
                         * @property {number|null} [x] Vertex x
                         * @property {number|null} [y] Vertex y
                         */
    
                        /**
                         * Constructs a new Vertex.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a Vertex.
                         * @implements IVertex
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.IVertex=} [properties] Properties to set
                         */
                        function Vertex(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Vertex x.
                         * @member {number} x
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @instance
                         */
                        Vertex.prototype.x = 0;
    
                        /**
                         * Vertex y.
                         * @member {number} y
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @instance
                         */
                        Vertex.prototype.y = 0;
    
                        /**
                         * Creates a new Vertex instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IVertex=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.Vertex} Vertex instance
                         */
                        Vertex.create = function create(properties) {
                            return new Vertex(properties);
                        };
    
                        /**
                         * Encodes the specified Vertex message. Does not implicitly {@link sensetime.viper.video_process.preview_info.Vertex.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IVertex} message Vertex message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Vertex.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.x != null && message.hasOwnProperty("x"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.x);
                            if (message.y != null && message.hasOwnProperty("y"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.y);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Vertex message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.Vertex.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IVertex} message Vertex message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Vertex.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Vertex message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.Vertex} Vertex
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Vertex.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.Vertex();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.x = reader.int32();
                                    break;
                                case 2:
                                    message.y = reader.int32();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a Vertex message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.Vertex} Vertex
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Vertex.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Vertex message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Vertex.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.x != null && message.hasOwnProperty("x"))
                                if (!$util.isInteger(message.x))
                                    return "x: integer expected";
                            if (message.y != null && message.hasOwnProperty("y"))
                                if (!$util.isInteger(message.y))
                                    return "y: integer expected";
                            return null;
                        };
    
                        /**
                         * Creates a Vertex message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.Vertex} Vertex
                         */
                        Vertex.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.Vertex)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.Vertex();
                            if (object.x != null)
                                message.x = object.x | 0;
                            if (object.y != null)
                                message.y = object.y | 0;
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Vertex message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.Vertex} message Vertex
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Vertex.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.x = 0;
                                object.y = 0;
                            }
                            if (message.x != null && message.hasOwnProperty("x"))
                                object.x = message.x;
                            if (message.y != null && message.hasOwnProperty("y"))
                                object.y = message.y;
                            return object;
                        };
    
                        /**
                         * Converts this Vertex to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.Vertex
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Vertex.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Vertex;
                    })();
    
                    preview_info.BoundingPoly = (function() {
    
                        /**
                         * Properties of a BoundingPoly.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface IBoundingPoly
                         * @property {Array.<sensetime.viper.video_process.preview_info.IVertex>|null} [vertices] BoundingPoly vertices
                         */
    
                        /**
                         * Constructs a new BoundingPoly.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a BoundingPoly.
                         * @implements IBoundingPoly
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.IBoundingPoly=} [properties] Properties to set
                         */
                        function BoundingPoly(properties) {
                            this.vertices = [];
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * BoundingPoly vertices.
                         * @member {Array.<sensetime.viper.video_process.preview_info.IVertex>} vertices
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @instance
                         */
                        BoundingPoly.prototype.vertices = $util.emptyArray;
    
                        /**
                         * Creates a new BoundingPoly instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IBoundingPoly=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.BoundingPoly} BoundingPoly instance
                         */
                        BoundingPoly.create = function create(properties) {
                            return new BoundingPoly(properties);
                        };
    
                        /**
                         * Encodes the specified BoundingPoly message. Does not implicitly {@link sensetime.viper.video_process.preview_info.BoundingPoly.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IBoundingPoly} message BoundingPoly message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        BoundingPoly.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.vertices != null && message.vertices.length)
                                for (var i = 0; i < message.vertices.length; ++i)
                                    $root.sensetime.viper.video_process.preview_info.Vertex.encode(message.vertices[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified BoundingPoly message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.BoundingPoly.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IBoundingPoly} message BoundingPoly message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        BoundingPoly.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a BoundingPoly message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.BoundingPoly} BoundingPoly
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        BoundingPoly.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.BoundingPoly();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    if (!(message.vertices && message.vertices.length))
                                        message.vertices = [];
                                    message.vertices.push($root.sensetime.viper.video_process.preview_info.Vertex.decode(reader, reader.uint32()));
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a BoundingPoly message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.BoundingPoly} BoundingPoly
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        BoundingPoly.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a BoundingPoly message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        BoundingPoly.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.vertices != null && message.hasOwnProperty("vertices")) {
                                if (!Array.isArray(message.vertices))
                                    return "vertices: array expected";
                                for (var i = 0; i < message.vertices.length; ++i) {
                                    var error = $root.sensetime.viper.video_process.preview_info.Vertex.verify(message.vertices[i]);
                                    if (error)
                                        return "vertices." + error;
                                }
                            }
                            return null;
                        };
    
                        /**
                         * Creates a BoundingPoly message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.BoundingPoly} BoundingPoly
                         */
                        BoundingPoly.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.BoundingPoly)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.BoundingPoly();
                            if (object.vertices) {
                                if (!Array.isArray(object.vertices))
                                    throw TypeError(".sensetime.viper.video_process.preview_info.BoundingPoly.vertices: array expected");
                                message.vertices = [];
                                for (var i = 0; i < object.vertices.length; ++i) {
                                    if (typeof object.vertices[i] !== "object")
                                        throw TypeError(".sensetime.viper.video_process.preview_info.BoundingPoly.vertices: object expected");
                                    message.vertices[i] = $root.sensetime.viper.video_process.preview_info.Vertex.fromObject(object.vertices[i]);
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a BoundingPoly message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.BoundingPoly} message BoundingPoly
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        BoundingPoly.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.arrays || options.defaults)
                                object.vertices = [];
                            if (message.vertices && message.vertices.length) {
                                object.vertices = [];
                                for (var j = 0; j < message.vertices.length; ++j)
                                    object.vertices[j] = $root.sensetime.viper.video_process.preview_info.Vertex.toObject(message.vertices[j], options);
                            }
                            return object;
                        };
    
                        /**
                         * Converts this BoundingPoly to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.BoundingPoly
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        BoundingPoly.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return BoundingPoly;
                    })();
    
                    preview_info.Angle = (function() {
    
                        /**
                         * Properties of an Angle.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface IAngle
                         * @property {number|null} [yaw] Angle yaw
                         * @property {number|null} [pitch] Angle pitch
                         * @property {number|null} [roll] Angle roll
                         */
    
                        /**
                         * Constructs a new Angle.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents an Angle.
                         * @implements IAngle
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.IAngle=} [properties] Properties to set
                         */
                        function Angle(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Angle yaw.
                         * @member {number} yaw
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @instance
                         */
                        Angle.prototype.yaw = 0;
    
                        /**
                         * Angle pitch.
                         * @member {number} pitch
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @instance
                         */
                        Angle.prototype.pitch = 0;
    
                        /**
                         * Angle roll.
                         * @member {number} roll
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @instance
                         */
                        Angle.prototype.roll = 0;
    
                        /**
                         * Creates a new Angle instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IAngle=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.Angle} Angle instance
                         */
                        Angle.create = function create(properties) {
                            return new Angle(properties);
                        };
    
                        /**
                         * Encodes the specified Angle message. Does not implicitly {@link sensetime.viper.video_process.preview_info.Angle.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IAngle} message Angle message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Angle.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.yaw != null && message.hasOwnProperty("yaw"))
                                writer.uint32(/* id 1, wireType 5 =*/13).float(message.yaw);
                            if (message.pitch != null && message.hasOwnProperty("pitch"))
                                writer.uint32(/* id 2, wireType 5 =*/21).float(message.pitch);
                            if (message.roll != null && message.hasOwnProperty("roll"))
                                writer.uint32(/* id 3, wireType 5 =*/29).float(message.roll);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Angle message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.Angle.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IAngle} message Angle message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Angle.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes an Angle message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.Angle} Angle
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Angle.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.Angle();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.yaw = reader.float();
                                    break;
                                case 2:
                                    message.pitch = reader.float();
                                    break;
                                case 3:
                                    message.roll = reader.float();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes an Angle message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.Angle} Angle
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Angle.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies an Angle message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Angle.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.yaw != null && message.hasOwnProperty("yaw"))
                                if (typeof message.yaw !== "number")
                                    return "yaw: number expected";
                            if (message.pitch != null && message.hasOwnProperty("pitch"))
                                if (typeof message.pitch !== "number")
                                    return "pitch: number expected";
                            if (message.roll != null && message.hasOwnProperty("roll"))
                                if (typeof message.roll !== "number")
                                    return "roll: number expected";
                            return null;
                        };
    
                        /**
                         * Creates an Angle message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.Angle} Angle
                         */
                        Angle.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.Angle)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.Angle();
                            if (object.yaw != null)
                                message.yaw = Number(object.yaw);
                            if (object.pitch != null)
                                message.pitch = Number(object.pitch);
                            if (object.roll != null)
                                message.roll = Number(object.roll);
                            return message;
                        };
    
                        /**
                         * Creates a plain object from an Angle message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.Angle} message Angle
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Angle.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.yaw = 0;
                                object.pitch = 0;
                                object.roll = 0;
                            }
                            if (message.yaw != null && message.hasOwnProperty("yaw"))
                                object.yaw = options.json && !isFinite(message.yaw) ? String(message.yaw) : message.yaw;
                            if (message.pitch != null && message.hasOwnProperty("pitch"))
                                object.pitch = options.json && !isFinite(message.pitch) ? String(message.pitch) : message.pitch;
                            if (message.roll != null && message.hasOwnProperty("roll"))
                                object.roll = options.json && !isFinite(message.roll) ? String(message.roll) : message.roll;
                            return object;
                        };
    
                        /**
                         * Converts this Angle to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.Angle
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Angle.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Angle;
                    })();
    
                    preview_info.Size = (function() {
    
                        /**
                         * Properties of a Size.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface ISize
                         * @property {number|null} [width] Size width
                         * @property {number|null} [height] Size height
                         */
    
                        /**
                         * Constructs a new Size.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a Size.
                         * @implements ISize
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.ISize=} [properties] Properties to set
                         */
                        function Size(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * Size width.
                         * @member {number} width
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @instance
                         */
                        Size.prototype.width = 0;
    
                        /**
                         * Size height.
                         * @member {number} height
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @instance
                         */
                        Size.prototype.height = 0;
    
                        /**
                         * Creates a new Size instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ISize=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.Size} Size instance
                         */
                        Size.create = function create(properties) {
                            return new Size(properties);
                        };
    
                        /**
                         * Encodes the specified Size message. Does not implicitly {@link sensetime.viper.video_process.preview_info.Size.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ISize} message Size message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Size.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.width != null && message.hasOwnProperty("width"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.width);
                            if (message.height != null && message.hasOwnProperty("height"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.height);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified Size message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.Size.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ISize} message Size message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        Size.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a Size message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.Size} Size
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Size.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.Size();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.width = reader.int32();
                                    break;
                                case 2:
                                    message.height = reader.int32();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a Size message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.Size} Size
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        Size.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a Size message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        Size.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.width != null && message.hasOwnProperty("width"))
                                if (!$util.isInteger(message.width))
                                    return "width: integer expected";
                            if (message.height != null && message.hasOwnProperty("height"))
                                if (!$util.isInteger(message.height))
                                    return "height: integer expected";
                            return null;
                        };
    
                        /**
                         * Creates a Size message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.Size} Size
                         */
                        Size.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.Size)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.Size();
                            if (object.width != null)
                                message.width = object.width | 0;
                            if (object.height != null)
                                message.height = object.height | 0;
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a Size message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.Size} message Size
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        Size.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                object.width = 0;
                                object.height = 0;
                            }
                            if (message.width != null && message.hasOwnProperty("width"))
                                object.width = message.width;
                            if (message.height != null && message.hasOwnProperty("height"))
                                object.height = message.height;
                            return object;
                        };
    
                        /**
                         * Converts this Size to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.Size
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        Size.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return Size;
                    })();
    
                    /**
                     * ObjectType enum.
                     * @name sensetime.viper.video_process.preview_info.ObjectType
                     * @enum {string}
                     * @property {number} OBJECT_UNKNOWN=0 OBJECT_UNKNOWN value
                     * @property {number} OBJECT_FACE=1 OBJECT_FACE value
                     * @property {number} OBJECT_PEDESTRIAN=2 OBJECT_PEDESTRIAN value
                     * @property {number} OBJECT_AUTOMOBILE=3 OBJECT_AUTOMOBILE value
                     * @property {number} OBJECT_CYCLIST=4 OBJECT_CYCLIST value
                     * @property {number} OBJECT_HUMAN_POWERED_VEHICLE=5 OBJECT_HUMAN_POWERED_VEHICLE value
                     * @property {number} OBJECT_CROWD=6 OBJECT_CROWD value
                     */
                    preview_info.ObjectType = (function() {
                        var valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "OBJECT_UNKNOWN"] = 0;
                        values[valuesById[1] = "OBJECT_FACE"] = 1;
                        values[valuesById[2] = "OBJECT_PEDESTRIAN"] = 2;
                        values[valuesById[3] = "OBJECT_AUTOMOBILE"] = 3;
                        values[valuesById[4] = "OBJECT_CYCLIST"] = 4;
                        values[valuesById[5] = "OBJECT_HUMAN_POWERED_VEHICLE"] = 5;
                        values[valuesById[6] = "OBJECT_CROWD"] = 6;
                        return values;
                    })();
    
                    preview_info.PreviewObject = (function() {
    
                        /**
                         * Properties of a PreviewObject.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface IPreviewObject
                         * @property {sensetime.viper.video_process.preview_info.ObjectType|null} [objectType] PreviewObject objectType
                         * @property {number|Long|null} [trackId] PreviewObject trackId
                         * @property {sensetime.viper.video_process.preview_info.IBoundingPoly|null} [bounding] PreviewObject bounding
                         * @property {number|null} [quality] PreviewObject quality
                         * @property {sensetime.viper.video_process.preview_info.IAngle|null} [angle] PreviewObject angle
                         * @property {Object.<string,string>|null} [attributes] PreviewObject attributes
                         * @property {sensetime.viper.video_process.preview_info.ICrowdObject|null} [crowd] PreviewObject crowd
                         */
    
                        /**
                         * Constructs a new PreviewObject.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a PreviewObject.
                         * @implements IPreviewObject
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.IPreviewObject=} [properties] Properties to set
                         */
                        function PreviewObject(properties) {
                            this.attributes = {};
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * PreviewObject objectType.
                         * @member {sensetime.viper.video_process.preview_info.ObjectType} objectType
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.objectType = 0;
    
                        /**
                         * PreviewObject trackId.
                         * @member {number|Long} trackId
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.trackId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * PreviewObject bounding.
                         * @member {sensetime.viper.video_process.preview_info.IBoundingPoly|null|undefined} bounding
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.bounding = null;
    
                        /**
                         * PreviewObject quality.
                         * @member {number} quality
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.quality = 0;
    
                        /**
                         * PreviewObject angle.
                         * @member {sensetime.viper.video_process.preview_info.IAngle|null|undefined} angle
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.angle = null;
    
                        /**
                         * PreviewObject attributes.
                         * @member {Object.<string,string>} attributes
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.attributes = $util.emptyObject;
    
                        /**
                         * PreviewObject crowd.
                         * @member {sensetime.viper.video_process.preview_info.ICrowdObject|null|undefined} crowd
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         */
                        PreviewObject.prototype.crowd = null;
    
                        /**
                         * Creates a new PreviewObject instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewObject=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.PreviewObject} PreviewObject instance
                         */
                        PreviewObject.create = function create(properties) {
                            return new PreviewObject(properties);
                        };
    
                        /**
                         * Encodes the specified PreviewObject message. Does not implicitly {@link sensetime.viper.video_process.preview_info.PreviewObject.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewObject} message PreviewObject message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        PreviewObject.encode = function encode(message, writer) {
                            console.log(message,"encode");
                            
                            if (!writer)
                                writer = $Writer.create();
                            if (message.objectType != null && message.hasOwnProperty("objectType"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.objectType);
                            if (message.trackId != null && message.hasOwnProperty("trackId"))
                                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.trackId);
                            if (message.bounding != null && message.hasOwnProperty("bounding"))
                                $root.sensetime.viper.video_process.preview_info.BoundingPoly.encode(message.bounding, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                            if (message.quality != null && message.hasOwnProperty("quality"))
                                writer.uint32(/* id 4, wireType 5 =*/37).float(message.quality);
                            if (message.angle != null && message.hasOwnProperty("angle"))
                                $root.sensetime.viper.video_process.preview_info.Angle.encode(message.angle, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                            if (message.attributes != null && message.hasOwnProperty("attributes"))
                                for (var keys = Object.keys(message.attributes), i = 0; i < keys.length; ++i)
                                    writer.uint32(/* id 6, wireType 2 =*/50).fork().uint32(/* id 1, wireType 2 =*/10).string(keys[i]).uint32(/* id 2, wireType 2 =*/18).string(message.attributes[keys[i]]).ldelim();
                            if (message.crowd != null && message.hasOwnProperty("crowd"))
                                $root.sensetime.viper.video_process.preview_info.CrowdObject.encode(message.crowd, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified PreviewObject message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.PreviewObject.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewObject} message PreviewObject message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        PreviewObject.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a PreviewObject message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.PreviewObject} PreviewObject
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        PreviewObject.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.PreviewObject(), key;
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.objectType = reader.int32();
                                    break;
                                case 2:
                                    message.trackId = reader.int64();
                                    break;
                                case 3:
                                    message.bounding = $root.sensetime.viper.video_process.preview_info.BoundingPoly.decode(reader, reader.uint32());
                                    break;
                                case 4:
                                    message.quality = reader.float();
                                    break;
                                case 5:
                                    message.angle = $root.sensetime.viper.video_process.preview_info.Angle.decode(reader, reader.uint32());
                                    break;
                                case 6:
                                    reader.skip().pos++;
                                    if (message.attributes === $util.emptyObject)
                                        message.attributes = {};
                                    key = reader.string();
                                    reader.pos++;
                                    message.attributes[key] = reader.string();
                                    break;
                                case 20:
                                    message.crowd = $root.sensetime.viper.video_process.preview_info.CrowdObject.decode(reader, reader.uint32());
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a PreviewObject message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.PreviewObject} PreviewObject
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        PreviewObject.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a PreviewObject message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        PreviewObject.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.objectType != null && message.hasOwnProperty("objectType"))
                                switch (message.objectType) {
                                default:
                                    return "objectType: enum value expected";
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                    break;
                                }
                            if (message.trackId != null && message.hasOwnProperty("trackId"))
                                if (!$util.isInteger(message.trackId) && !(message.trackId && $util.isInteger(message.trackId.low) && $util.isInteger(message.trackId.high)))
                                    return "trackId: integer|Long expected";
                            if (message.bounding != null && message.hasOwnProperty("bounding")) {
                                var error = $root.sensetime.viper.video_process.preview_info.BoundingPoly.verify(message.bounding);
                                if (error)
                                    return "bounding." + error;
                            }
                            if (message.quality != null && message.hasOwnProperty("quality"))
                                if (typeof message.quality !== "number")
                                    return "quality: number expected";
                            if (message.angle != null && message.hasOwnProperty("angle")) {
                                var error = $root.sensetime.viper.video_process.preview_info.Angle.verify(message.angle);
                                if (error)
                                    return "angle." + error;
                            }
                            if (message.attributes != null && message.hasOwnProperty("attributes")) {
                                if (!$util.isObject(message.attributes))
                                    return "attributes: object expected";
                                var key = Object.keys(message.attributes);
                                for (var i = 0; i < key.length; ++i)
                                    if (!$util.isString(message.attributes[key[i]]))
                                        return "attributes: string{k:string} expected";
                            }
                            if (message.crowd != null && message.hasOwnProperty("crowd")) {
                                var error = $root.sensetime.viper.video_process.preview_info.CrowdObject.verify(message.crowd);
                                if (error)
                                    return "crowd." + error;
                            }
                            return null;
                        };
    
                        /**
                         * Creates a PreviewObject message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.PreviewObject} PreviewObject
                         */
                        PreviewObject.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.PreviewObject)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.PreviewObject();
                            switch (object.objectType) {
                            case "OBJECT_UNKNOWN":
                            case 0:
                                message.objectType = 0;
                                break;
                            case "OBJECT_FACE":
                            case 1:
                                message.objectType = 1;
                                break;
                            case "OBJECT_PEDESTRIAN":
                            case 2:
                                message.objectType = 2;
                                break;
                            case "OBJECT_AUTOMOBILE":
                            case 3:
                                message.objectType = 3;
                                break;
                            case "OBJECT_CYCLIST":
                            case 4:
                                message.objectType = 4;
                                break;
                            case "OBJECT_HUMAN_POWERED_VEHICLE":
                            case 5:
                                message.objectType = 5;
                                break;
                            case "OBJECT_CROWD":
                            case 6:
                                message.objectType = 6;
                                break;
                            }
                            if (object.trackId != null)
                                if ($util.Long)
                                    (message.trackId = $util.Long.fromValue(object.trackId)).unsigned = false;
                                else if (typeof object.trackId === "string")
                                    message.trackId = parseInt(object.trackId, 10);
                                else if (typeof object.trackId === "number")
                                    message.trackId = object.trackId;
                                else if (typeof object.trackId === "object")
                                    message.trackId = new $util.LongBits(object.trackId.low >>> 0, object.trackId.high >>> 0).toNumber();
                            if (object.bounding != null) {
                                if (typeof object.bounding !== "object")
                                    throw TypeError(".sensetime.viper.video_process.preview_info.PreviewObject.bounding: object expected");
                                message.bounding = $root.sensetime.viper.video_process.preview_info.BoundingPoly.fromObject(object.bounding);
                            }
                            if (object.quality != null)
                                message.quality = Number(object.quality);
                            if (object.angle != null) {
                                if (typeof object.angle !== "object")
                                    throw TypeError(".sensetime.viper.video_process.preview_info.PreviewObject.angle: object expected");
                                message.angle = $root.sensetime.viper.video_process.preview_info.Angle.fromObject(object.angle);
                            }
                            if (object.attributes) {
                                if (typeof object.attributes !== "object")
                                    throw TypeError(".sensetime.viper.video_process.preview_info.PreviewObject.attributes: object expected");
                                message.attributes = {};
                                for (var keys = Object.keys(object.attributes), i = 0; i < keys.length; ++i)
                                    message.attributes[keys[i]] = String(object.attributes[keys[i]]);
                            }
                            if (object.crowd != null) {
                                if (typeof object.crowd !== "object")
                                    throw TypeError(".sensetime.viper.video_process.preview_info.PreviewObject.crowd: object expected");
                                message.crowd = $root.sensetime.viper.video_process.preview_info.CrowdObject.fromObject(object.crowd);
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a PreviewObject message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.PreviewObject} message PreviewObject
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        PreviewObject.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.objects || options.defaults)
                                object.attributes = {};
                            if (options.defaults) {
                                object.objectType = options.enums === String ? "OBJECT_UNKNOWN" : 0;
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.trackId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.trackId = options.longs === String ? "0" : 0;
                                object.bounding = null;
                                object.quality = 0;
                                object.angle = null;
                                object.crowd = null;
                            }
                            if (message.objectType != null && message.hasOwnProperty("objectType"))
                                object.objectType = options.enums === String ? $root.sensetime.viper.video_process.preview_info.ObjectType[message.objectType] : message.objectType;
                            if (message.trackId != null && message.hasOwnProperty("trackId"))
                                if (typeof message.trackId === "number")
                                    object.trackId = options.longs === String ? String(message.trackId) : message.trackId;
                                else
                                    object.trackId = options.longs === String ? $util.Long.prototype.toString.call(message.trackId) : options.longs === Number ? new $util.LongBits(message.trackId.low >>> 0, message.trackId.high >>> 0).toNumber() : message.trackId;
                            if (message.bounding != null && message.hasOwnProperty("bounding"))
                                object.bounding = $root.sensetime.viper.video_process.preview_info.BoundingPoly.toObject(message.bounding, options);
                            if (message.quality != null && message.hasOwnProperty("quality"))
                                object.quality = options.json && !isFinite(message.quality) ? String(message.quality) : message.quality;
                            if (message.angle != null && message.hasOwnProperty("angle"))
                                object.angle = $root.sensetime.viper.video_process.preview_info.Angle.toObject(message.angle, options);
                            var keys2;
                            if (message.attributes && (keys2 = Object.keys(message.attributes)).length) {
                                object.attributes = {};
                                for (var j = 0; j < keys2.length; ++j)
                                    object.attributes[keys2[j]] = message.attributes[keys2[j]];
                            }
                            if (message.crowd != null && message.hasOwnProperty("crowd"))
                                object.crowd = $root.sensetime.viper.video_process.preview_info.CrowdObject.toObject(message.crowd, options);
                            return object;
                        };
    
                        /**
                         * Converts this PreviewObject to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.PreviewObject
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        PreviewObject.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return PreviewObject;
                    })();
    
                    preview_info.CrowdObject = (function() {
    
                        /**
                         * Properties of a CrowdObject.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface ICrowdObject
                         * @property {number|Long|null} [quantity] CrowdObject quantity
                         * @property {sensetime.viper.video_process.preview_info.ISize|null} [densitySize] CrowdObject densitySize
                         * @property {Uint8Array|null} [density] CrowdObject density
                         */
    
                        /**
                         * Constructs a new CrowdObject.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a CrowdObject.
                         * @implements ICrowdObject
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.ICrowdObject=} [properties] Properties to set
                         */
                        function CrowdObject(properties) {
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * CrowdObject quantity.
                         * @member {number|Long} quantity
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @instance
                         */
                        CrowdObject.prototype.quantity = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * CrowdObject densitySize.
                         * @member {sensetime.viper.video_process.preview_info.ISize|null|undefined} densitySize
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @instance
                         */
                        CrowdObject.prototype.densitySize = null;
    
                        /**
                         * CrowdObject density.
                         * @member {Uint8Array} density
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @instance
                         */
                        CrowdObject.prototype.density = $util.newBuffer([]);
    
                        /**
                         * Creates a new CrowdObject instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ICrowdObject=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.CrowdObject} CrowdObject instance
                         */
                        CrowdObject.create = function create(properties) {
                            return new CrowdObject(properties);
                        };
    
                        /**
                         * Encodes the specified CrowdObject message. Does not implicitly {@link sensetime.viper.video_process.preview_info.CrowdObject.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ICrowdObject} message CrowdObject message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        CrowdObject.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.quantity != null && message.hasOwnProperty("quantity"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.quantity);
                            if (message.densitySize != null && message.hasOwnProperty("densitySize"))
                                $root.sensetime.viper.video_process.preview_info.Size.encode(message.densitySize, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            if (message.density != null && message.hasOwnProperty("density"))
                                writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.density);
                            return writer;
                        };
    
                        /**
                         * Encodes the specified CrowdObject message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.CrowdObject.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.ICrowdObject} message CrowdObject message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        CrowdObject.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a CrowdObject message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.CrowdObject} CrowdObject
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        CrowdObject.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.CrowdObject();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.quantity = reader.int64();
                                    break;
                                case 2:
                                    message.densitySize = $root.sensetime.viper.video_process.preview_info.Size.decode(reader, reader.uint32());
                                    break;
                                case 3:
                                    message.density = reader.bytes();
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a CrowdObject message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.CrowdObject} CrowdObject
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        CrowdObject.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a CrowdObject message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        CrowdObject.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.quantity != null && message.hasOwnProperty("quantity"))
                                if (!$util.isInteger(message.quantity) && !(message.quantity && $util.isInteger(message.quantity.low) && $util.isInteger(message.quantity.high)))
                                    return "quantity: integer|Long expected";
                            if (message.densitySize != null && message.hasOwnProperty("densitySize")) {
                                var error = $root.sensetime.viper.video_process.preview_info.Size.verify(message.densitySize);
                                if (error)
                                    return "densitySize." + error;
                            }
                            if (message.density != null && message.hasOwnProperty("density"))
                                if (!(message.density && typeof message.density.length === "number" || $util.isString(message.density)))
                                    return "density: buffer expected";
                            return null;
                        };
    
                        /**
                         * Creates a CrowdObject message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.CrowdObject} CrowdObject
                         */
                        CrowdObject.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.CrowdObject)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.CrowdObject();
                            if (object.quantity != null)
                                if ($util.Long)
                                    (message.quantity = $util.Long.fromValue(object.quantity)).unsigned = false;
                                else if (typeof object.quantity === "string")
                                    message.quantity = parseInt(object.quantity, 10);
                                else if (typeof object.quantity === "number")
                                    message.quantity = object.quantity;
                                else if (typeof object.quantity === "object")
                                    message.quantity = new $util.LongBits(object.quantity.low >>> 0, object.quantity.high >>> 0).toNumber();
                            if (object.densitySize != null) {
                                if (typeof object.densitySize !== "object")
                                    throw TypeError(".sensetime.viper.video_process.preview_info.CrowdObject.densitySize: object expected");
                                message.densitySize = $root.sensetime.viper.video_process.preview_info.Size.fromObject(object.densitySize);
                            }
                            if (object.density != null)
                                if (typeof object.density === "string")
                                    $util.base64.decode(object.density, message.density = $util.newBuffer($util.base64.length(object.density)), 0);
                                else if (object.density.length)
                                    message.density = object.density;
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a CrowdObject message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.CrowdObject} message CrowdObject
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        CrowdObject.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.defaults) {
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.quantity = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.quantity = options.longs === String ? "0" : 0;
                                object.densitySize = null;
                                if (options.bytes === String)
                                    object.density = "";
                                else {
                                    object.density = [];
                                    if (options.bytes !== Array)
                                        object.density = $util.newBuffer(object.density);
                                }
                            }
                            if (message.quantity != null && message.hasOwnProperty("quantity"))
                                if (typeof message.quantity === "number")
                                    object.quantity = options.longs === String ? String(message.quantity) : message.quantity;
                                else
                                    object.quantity = options.longs === String ? $util.Long.prototype.toString.call(message.quantity) : options.longs === Number ? new $util.LongBits(message.quantity.low >>> 0, message.quantity.high >>> 0).toNumber() : message.quantity;
                            if (message.densitySize != null && message.hasOwnProperty("densitySize"))
                                object.densitySize = $root.sensetime.viper.video_process.preview_info.Size.toObject(message.densitySize, options);
                            if (message.density != null && message.hasOwnProperty("density"))
                                object.density = options.bytes === String ? $util.base64.encode(message.density, 0, message.density.length) : options.bytes === Array ? Array.prototype.slice.call(message.density) : message.density;
                            return object;
                        };
    
                        /**
                         * Converts this CrowdObject to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.CrowdObject
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        CrowdObject.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return CrowdObject;
                    })();
    
                    preview_info.PreviewInfo = (function() {
    
                        /**
                         * Properties of a PreviewInfo.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @interface IPreviewInfo
                         * @property {number|Long|null} [timestamp] PreviewInfo timestamp
                         * @property {Array.<sensetime.viper.video_process.preview_info.IPreviewObject>|null} [objects] PreviewInfo objects
                         */
    
                        /**
                         * Constructs a new PreviewInfo.
                         * @memberof sensetime.viper.video_process.preview_info
                         * @classdesc Represents a PreviewInfo.
                         * @implements IPreviewInfo
                         * @constructor
                         * @param {sensetime.viper.video_process.preview_info.IPreviewInfo=} [properties] Properties to set
                         */
                        function PreviewInfo(properties) {
                            this.objects = [];
                            if (properties)
                                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                    if (properties[keys[i]] != null)
                                        this[keys[i]] = properties[keys[i]];
                        }
    
                        /**
                         * PreviewInfo timestamp.
                         * @member {number|Long} timestamp
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @instance
                         */
                        PreviewInfo.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
    
                        /**
                         * PreviewInfo objects.
                         * @member {Array.<sensetime.viper.video_process.preview_info.IPreviewObject>} objects
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @instance
                         */
                        PreviewInfo.prototype.objects = $util.emptyArray;
    
                        /**
                         * Creates a new PreviewInfo instance using the specified properties.
                         * @function create
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewInfo=} [properties] Properties to set
                         * @returns {sensetime.viper.video_process.preview_info.PreviewInfo} PreviewInfo instance
                         */
                        PreviewInfo.create = function create(properties) {
                            return new PreviewInfo(properties);
                        };
    
                        /**
                         * Encodes the specified PreviewInfo message. Does not implicitly {@link sensetime.viper.video_process.preview_info.PreviewInfo.verify|verify} messages.
                         * @function encode
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewInfo} message PreviewInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        PreviewInfo.encode = function encode(message, writer) {
                            if (!writer)
                                writer = $Writer.create();
                            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.timestamp);
                            if (message.objects != null && message.objects.length)
                                for (var i = 0; i < message.objects.length; ++i)
                                    $root.sensetime.viper.video_process.preview_info.PreviewObject.encode(message.objects[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                            return writer;
                        };
    
                        /**
                         * Encodes the specified PreviewInfo message, length delimited. Does not implicitly {@link sensetime.viper.video_process.preview_info.PreviewInfo.verify|verify} messages.
                         * @function encodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.IPreviewInfo} message PreviewInfo message or plain object to encode
                         * @param {$protobuf.Writer} [writer] Writer to encode to
                         * @returns {$protobuf.Writer} Writer
                         */
                        PreviewInfo.encodeDelimited = function encodeDelimited(message, writer) {
                            return this.encode(message, writer).ldelim();
                        };
    
                        /**
                         * Decodes a PreviewInfo message from the specified reader or buffer.
                         * @function decode
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @param {number} [length] Message length if known beforehand
                         * @returns {sensetime.viper.video_process.preview_info.PreviewInfo} PreviewInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        PreviewInfo.decode = function decode(reader, length) {
                            if (!(reader instanceof $Reader))
                                reader = $Reader.create(reader);
                            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sensetime.viper.video_process.preview_info.PreviewInfo();
                            while (reader.pos < end) {
                                var tag = reader.uint32();
                                switch (tag >>> 3) {
                                case 1:
                                    message.timestamp = reader.int64();
                                    break;
                                case 2:
                                    if (!(message.objects && message.objects.length))
                                        message.objects = [];
                                    message.objects.push($root.sensetime.viper.video_process.preview_info.PreviewObject.decode(reader, reader.uint32()));
                                    break;
                                default:
                                    reader.skipType(tag & 7);
                                    break;
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Decodes a PreviewInfo message from the specified reader or buffer, length delimited.
                         * @function decodeDelimited
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                         * @returns {sensetime.viper.video_process.preview_info.PreviewInfo} PreviewInfo
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        PreviewInfo.decodeDelimited = function decodeDelimited(reader) {
                            if (!(reader instanceof $Reader))
                                reader = new $Reader(reader);
                            return this.decode(reader, reader.uint32());
                        };
    
                        /**
                         * Verifies a PreviewInfo message.
                         * @function verify
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {Object.<string,*>} message Plain object to verify
                         * @returns {string|null} `null` if valid, otherwise the reason why it is not
                         */
                        PreviewInfo.verify = function verify(message) {
                            if (typeof message !== "object" || message === null)
                                return "object expected";
                            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                                    return "timestamp: integer|Long expected";
                            if (message.objects != null && message.hasOwnProperty("objects")) {
                                if (!Array.isArray(message.objects))
                                    return "objects: array expected";
                                for (var i = 0; i < message.objects.length; ++i) {
                                    var error = $root.sensetime.viper.video_process.preview_info.PreviewObject.verify(message.objects[i]);
                                    if (error)
                                        return "objects." + error;
                                }
                            }
                            return null;
                        };
    
                        /**
                         * Creates a PreviewInfo message from a plain object. Also converts values to their respective internal types.
                         * @function fromObject
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {Object.<string,*>} object Plain object
                         * @returns {sensetime.viper.video_process.preview_info.PreviewInfo} PreviewInfo
                         */
                        PreviewInfo.fromObject = function fromObject(object) {
                            if (object instanceof $root.sensetime.viper.video_process.preview_info.PreviewInfo)
                                return object;
                            var message = new $root.sensetime.viper.video_process.preview_info.PreviewInfo();
                            if (object.timestamp != null)
                                if ($util.Long)
                                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = false;
                                else if (typeof object.timestamp === "string")
                                    message.timestamp = parseInt(object.timestamp, 10);
                                else if (typeof object.timestamp === "number")
                                    message.timestamp = object.timestamp;
                                else if (typeof object.timestamp === "object")
                                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber();
                            if (object.objects) {
                                if (!Array.isArray(object.objects))
                                    throw TypeError(".sensetime.viper.video_process.preview_info.PreviewInfo.objects: array expected");
                                message.objects = [];
                                for (var i = 0; i < object.objects.length; ++i) {
                                    if (typeof object.objects[i] !== "object")
                                        throw TypeError(".sensetime.viper.video_process.preview_info.PreviewInfo.objects: object expected");
                                    message.objects[i] = $root.sensetime.viper.video_process.preview_info.PreviewObject.fromObject(object.objects[i]);
                                }
                            }
                            return message;
                        };
    
                        /**
                         * Creates a plain object from a PreviewInfo message. Also converts values to other types if specified.
                         * @function toObject
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @static
                         * @param {sensetime.viper.video_process.preview_info.PreviewInfo} message PreviewInfo
                         * @param {$protobuf.IConversionOptions} [options] Conversion options
                         * @returns {Object.<string,*>} Plain object
                         */
                        PreviewInfo.toObject = function toObject(message, options) {
                            if (!options)
                                options = {};
                            var object = {};
                            if (options.arrays || options.defaults)
                                object.objects = [];
                            if (options.defaults)
                                if ($util.Long) {
                                    var long = new $util.Long(0, 0, false);
                                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                                } else
                                    object.timestamp = options.longs === String ? "0" : 0;
                            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                                if (typeof message.timestamp === "number")
                                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                                else
                                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber() : message.timestamp;
                            if (message.objects && message.objects.length) {
                                object.objects = [];
                                for (var j = 0; j < message.objects.length; ++j)
                                    object.objects[j] = $root.sensetime.viper.video_process.preview_info.PreviewObject.toObject(message.objects[j], options);
                            }
                            return object;
                        };
    
                        /**
                         * Converts this PreviewInfo to JSON.
                         * @function toJSON
                         * @memberof sensetime.viper.video_process.preview_info.PreviewInfo
                         * @instance
                         * @returns {Object.<string,*>} JSON object
                         */
                        PreviewInfo.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };
    
                        return PreviewInfo;
                    })();
    
                    return preview_info;
                })();
    
                return video_process;
            })();
    
            return viper;
        })();
    
        return sensetime;
    })();

    return $root;
})(protobuf);
