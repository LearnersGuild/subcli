import {parse, usage} from '../lib'

function example(argv) {
  const commandDescriptor = {
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
      help: "don't _act_, actually _be_",
    }],
  }

  const args = parse(commandDescriptor, argv)
  const usageMessage = usage(commandDescriptor, args)
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
  console.log({argv})
  example(process.argv.slice(2))
}
