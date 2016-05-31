'use strict';

var _lib = require('../lib');

function example(argv) {
  var commandDescriptor = {
    name: 'act',
    description: 'act happy or sad',
    usage: 'act [options] [ <happy|sad> [options for happy or sad] ]',
    commands: [{
      name: 'happy',
      description: 'act happy',
      usage: 'happy [options]',
      options: [{
        name: 'gleeful',
        abbr: 'g',
        boolean: true,
        help: 'act really, REALLY happy'
      }]
    }, {
      name: 'sad',
      description: 'act sad',
      usage: 'sad [options]',
      options: [{
        name: 'miserable',
        abbr: 'm',
        boolean: true,
        help: 'act really, REALLY sad'
      }]
    }],
    options: [{
      name: 'be',
      abbr: 'b',
      boolean: true,
      help: "don't _act_, actually _be_"
    }]
  };

  var args = (0, _lib.parse)(commandDescriptor, argv);
  var usageMessage = (0, _lib.usage)(commandDescriptor, args);
  if (!usageMessage) {
    console.info('No usage printed since neither -h or --help was passed.');
    console.log('\nParsed args:', args);
  } else {
    console.info(usageMessage);
    console.log('\nParsed args:', args);
  }
}

if (!module.parent) {
  var argv = process.argv.slice(2);
  console.log({ argv: argv });
  example(process.argv.slice(2));
}

