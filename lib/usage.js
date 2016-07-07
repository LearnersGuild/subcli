'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usageInfo = usageInfo;
exports.commandList = commandList;
exports.optionList = optionList;
exports.exampleList = exampleList;
exports.usageMessage = usageMessage;
exports.default = usage;

var _cliclopts = require('cliclopts');

var _cliclopts2 = _interopRequireDefault(_cliclopts);

var _wordwrap = require('wordwrap');

var _wordwrap2 = _interopRequireDefault(_wordwrap);

var _sprintfJs = require('sprintf-js');

var _addHelpOption = require('./addHelpOption');

var _addHelpOption2 = _interopRequireDefault(_addHelpOption);

var _findSubcommandDescriptor = require('./findSubcommandDescriptor');

var _findSubcommandDescriptor2 = _interopRequireDefault(_findSubcommandDescriptor);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usageInfo(usage) {
  var parentCommand = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var commandPrefix = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  if (!usage) {
    return '';
  }
  var usageString = parentCommand ? parentCommand + ' ' + usage : '' + commandPrefix + usage;

  return '\nUsage:\n    ' + usageString;
}

function commandList(commands) {
  var maxWidth = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_SAFE_INTEGER : arguments[1];

  if (!commands || commands.length === 0) {
    return '';
  }

  var maxCommandWidth = commands.reduce(function (maxWidth, currCmd) {
    return currCmd.name.length > maxWidth ? currCmd.name.length : maxWidth;
  }, 0);
  var wrap = (0, _wordwrap2.default)(7 + maxCommandWidth, maxWidth);
  var commandDescs = commands.map(function (cmd) {
    var desc = wrap(cmd.description).replace(/^\s+/, '') + '\n';
    return (0, _sprintfJs.sprintf)('    %-' + maxCommandWidth + 's - %s', cmd.name, desc);
  });
  return '\nCommands:\n' + commandDescs.join('\n');
}

function optionList(options) {
  var maxWidth = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_SAFE_INTEGER : arguments[1];

  if (!options || options.length === 0) {
    return '';
  }

  var wrap = (0, _wordwrap2.default)(26, maxWidth);
  var wrappedOptions = options.map(function (opt) {
    return Object.assign({}, opt, { help: wrap(opt.help).replace(/^\s+/, '') + '\n' });
  });

  var cliOpts = (0, _cliclopts2.default)(wrappedOptions);
  return '\nOptions:\n' + cliOpts.usage();
}

function exampleList(examples) {
  var maxWidth = arguments.length <= 1 || arguments[1] === undefined ? Number.MAX_SAFE_INTEGER : arguments[1];
  var commandPrefix = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  if (!examples || examples.length === 0) {
    return '';
  }

  var descPrefix = '    # ';
  var wrap = (0, _wordwrap2.default)(0, maxWidth - descPrefix.length);
  var exampleDescs = examples.map(function (expl) {
    var desc = wrap(expl.description).split('\n').join('\n' + descPrefix);
    return (0, _sprintfJs.sprintf)('%s%s\n    %s%s\n', descPrefix, desc, commandPrefix, expl.example);
  });
  return 'Examples:\n' + exampleDescs.join('\n');
}

function commandDescriptorIncludesDefaultHelp(commandDescriptor) {
  if (!commandDescriptor.options) {
    return false;
  }
  var defaultHelpOptions = commandDescriptor.options.filter(function (opt) {
    return opt.__DEFAULT_HELP_OPTION__;
  });
  return defaultHelpOptions.length > 0;
}

function usageMessage(commandDescriptor) {
  var parentCommand = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var commandPrefix = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];
  var maxWidth = arguments.length <= 3 || arguments[3] === undefined ? Number.MAX_SAFE_INTEGER : arguments[3];

  var prefix = parentCommand ? '' : commandPrefix;
  var fullCommandName = parentCommand ? parentCommand + ' ' + commandDescriptor.name : commandDescriptor.name;
  return '' + prefix + fullCommandName + ' - ' + commandDescriptor.description + '\n' + usageInfo(commandDescriptor.usage || commandDescriptor.name, parentCommand, prefix) + '\n' + commandList(commandDescriptor.commands, maxWidth) + '\n' + optionList(commandDescriptor.options, maxWidth) + '\n' + exampleList(commandDescriptor.examples, maxWidth, prefix);
}

function usage(cd) {
  var args = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = Object.assign({}, _index.DEFAULT_OPTIONS, opts);
  var commandDescriptor = options.includeHelp ? (0, _addHelpOption2.default)(cd) : cd;
  if (options.includeHelp) {
    if (!args || args.help && commandDescriptorIncludesDefaultHelp(commandDescriptor)) {
      return usageMessage(commandDescriptor, null, options.commandPrefix, options.maxWidth);
    }
    if (args.$) {
      var subcommand = Object.keys(args.$)[0];
      var subcommandDescriptor = (0, _findSubcommandDescriptor2.default)(commandDescriptor, subcommand);
      if (args.$[subcommand].help && commandDescriptorIncludesDefaultHelp(subcommandDescriptor)) {
        return usageMessage(subcommandDescriptor, commandDescriptor.name, null, options.maxWidth);
      }
    }
  }
}