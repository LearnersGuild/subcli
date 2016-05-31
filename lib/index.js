'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _addHelpOption = require('./addHelpOption');

Object.defineProperty(exports, 'addHelpOption', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_addHelpOption).default;
  }
});

var _findSubcommandDescriptor = require('./findSubcommandDescriptor');

Object.defineProperty(exports, 'findSubcommandDescriptor', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_findSubcommandDescriptor).default;
  }
});

var _parse = require('./parse');

Object.defineProperty(exports, 'parse', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_parse).default;
  }
});

var _usage = require('./usage');

Object.defineProperty(exports, 'usage', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_usage).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS = exports.DEFAULT_OPTIONS = {
  includeHelp: true
};