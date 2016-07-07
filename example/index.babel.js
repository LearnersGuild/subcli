import {parse, usage} from '../lib'

function example(argv) {
  const commandDescriptor = {
    name: 'act',
    description: 'act happy or sad',
    usage: 'act [options] [ <happy|sad> [options for happy or sad] ]',
    commands: [{
      name: 'happy',
      description: 'act happy, like you just cannot imagine anything at all in the world that could be better than right now',
      usage: 'happy [options]',
      options: [{
        name: 'gleeful',
        abbr: 'g',
        boolean: true,
        help: 'act really, REALLY happy',
      }],
    }, {
      name: 'sad',
      description: 'act sad',
      usage: 'sad [options]',
      options: [{
        name: 'miserable',
        abbr: 'm',
        boolean: true,
        help: 'act really, REALLY sad',
      }],
    }],
    options: [{
      name: 'be',
      abbr: 'b',
      boolean: true,
      help: "don't _act_, actually _be_; this means that it won't be pretending, it will be 100% completely and positively real",
    }],
    examples: [{
      example: 'act happy',
      description: 'pretend to be in a good mood',
    }, {
      example: 'act -b sad --miserable',
      description: 'be in an incredibly bad bood, like simply the absolutely positively worst blasted day you have ever had ... like ever, really',
    }],
  }

  const args = parse(commandDescriptor, argv)
  const usageMessage = usage(commandDescriptor, args, {commandPrefix: '/', maxWidth: 76})
  if (!usageMessage) {
    console.info('No usage printed since neither -h or --help was passed.')
    console.log('\nParsed args:', args)
  } else {
    console.info(usageMessage)
    console.log('\nParsed args:', args)
  }
}

if (!module.parent) {
  const argv = process.argv.slice(2)
  example(argv)
}
