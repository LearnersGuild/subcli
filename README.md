# subcli

Helper utilities for creating command-line interfaces (CLIs) that support subcommands.

Right now, there is a `parse` function and a `usage` function.


## Getting Started

1. Install the module in your project

        $ npm install --save subcli


## How to Use

To use the library, you'll need to create a command descriptor. This is a simple javascript object that describes your command and all of its subcommands. This command descriptor then gets passed to both the `parse` and `usage` functions.

By default, every command and subcommand includes a `-h | --help` option, but this can be overridden by passing `{includeHelp: false}` when calling `parse` or `usage`.

The `parse` command returns a JavaScript object, where the `_` attributes stores the positional parameters. There may be a `$` attribute that contains a sub-object that represents the positional parameters and options for the subcommand. The remaining attributes are just the named options and their values (`true` / `false` if they are `boolean`, and otherwise, whatever string was passed as the value).

You can optionally pass the results from the `parse` function to the `usage` function as its second argument. If you do so, `subcli` will be smart enough to determine whether or not a `-h` or `--help` command was passed, either for the parent command or for the subcommand. If it was, the usage message will be returned (for either the parent command or the subcommand as appropriate). Otherwise, it will be `undefined`. If you _don't_ pass the return value from `parse`, then the usage message for the parent command will be returned.

For example:

```javascript
import {parse, usage} from 'subcli'

// set up our command descriptor
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

let args = parse(commandDescriptor, ['happy', '-g'])
// args =>
// { _: [ 'happy', '-e' ],
//   be: false,
//   b: false,
//   help: false,
//   h: false,
//   '$': { happy: { _: [], gleeful: true, g: true, help: false, h: false } } }

let usageMessage = usage(commandDescriptor, args)
// usageMessage => undefined
usageMessage = usage(commandDescriptor)
// usageMessage => the full help text for the act command

args = parse(commandDescriptor), ['-h', 'happy', '-g', '-h'])
// args =>
// { _: [ 'happy', '-g', '-h' ],
//   be: false,
//   b: false,
//   help: true,
//   h: true,
//   '$': { happy: { _: [], gleeful: true, g: true, help: true, h: true } } }
usageMessage = usage(commandDescriptor, args)
// usageMessage => the full help text for the act command

args = parse(commandDescriptor), ['happy', '-g', '-h'])
// args =>
// { _: [ 'happy', '-g', '-h' ],
//   be: false,
//   b: false,
//   help: false,
//   h: false,
//   '$': { happy: { _: [], gleeful: true, g: true, help: true, h: true } } }
usageMessage = usage(commandDescriptor, args)
// usageMessage => the full help text for the 'act happy' subcommand
```

See also [the provided example](/example/index.babel.js). Or, run it like so: `node example happy -g`


## Notes

It may help to look at [minimist][minimist] for more detail on how the argument parsing is handled. One thing to note is that, since our command parsing supports the notion of "subcommands", there may be an additional attribute named `$` that contains the positional parameters and options for the subcommand, e.g.:

```javascript
{
  _: [ 'happy' ],    // positional parameters for the parent command
  help: false,       // options for the parent command
  h: false,          // ...
  $: {               // subcommand
    happy: {
      _: [],         // positional parameters for the subcommand
      help: false,   // options for the subcommand
      h: false       // ...
    }
  }
}
```


## Contributing

Read the [instructions for contributing](./CONTRIBUTING.md).

1. Clone the repository.

2. Run the setup tasks:

        $ npm install
        $ npm test


## License

See the [LICENSE](./LICENSE) file.


[minimist]: https://github.com/substack/minimist
