import cliclopts from 'cliclopts'
import wordwrap from 'wordwrap'
import {sprintf} from 'sprintf-js'

import addHelpOption from './addHelpOption'
import findSubcommandDescriptor from './findSubcommandDescriptor'
import {DEFAULT_OPTIONS} from './index'

export function usageInfo(usage, parentCommand = null, commandPrefix = '') {
  if (!usage) {
    return ''
  }
  const usageString = parentCommand ? `${parentCommand} ${usage}` : `${commandPrefix}${usage}`

  return `\nUsage:\n    ${usageString}`
}

export function commandList(commands, maxWidth = Number.MAX_SAFE_INTEGER) {
  if (!commands || commands.length === 0) {
    return ''
  }

  const maxCommandWidth = commands.reduce((maxWidth, currCmd) => {
    return (currCmd.name.length > maxWidth) ? currCmd.name.length : maxWidth
  }, 0)
  const wrap = wordwrap(7 + maxCommandWidth, maxWidth)
  const commandDescs = commands.map(cmd => {
    const desc = `${wrap(cmd.description).replace(/^\s+/, '')}\n`
    return sprintf(`    %-${maxCommandWidth}s - %s`, cmd.name, desc)
  })
  return `\nCommands:\n${commandDescs.join('\n')}`
}

export function optionList(options, maxWidth = Number.MAX_SAFE_INTEGER) {
  if (!options || options.length === 0) {
    return ''
  }

  const wrap = wordwrap(26, maxWidth)
  const wrappedOptions = options.map(opt => {
    return Object.assign({}, opt, {help: `${wrap(opt.help).replace(/^\s+/, '')}\n`})
  })

  const cliOpts = cliclopts(wrappedOptions)
  return `\nOptions:\n${cliOpts.usage()}`
}

export function exampleList(examples, maxWidth = Number.MAX_SAFE_INTEGER) {
  if (!examples || examples.length === 0) {
    return ''
  }

  const descPrefix = '    # '
  const wrap = wordwrap(0, maxWidth - descPrefix.length)
  const exampleDescs = examples.map(expl => {
    const desc = wrap(expl.description).split('\n').join(`\n${descPrefix}`)
    return sprintf(`%s%s\n    %s\n`, descPrefix, desc, expl.example)
  })
  return `Examples:\n${exampleDescs.join('\n')}`
}

function commandDescriptorIncludesDefaultHelp(commandDescriptor) {
  if (!commandDescriptor.options) {
    return false
  }
  const defaultHelpOptions = commandDescriptor.options.filter(opt => opt.__DEFAULT_HELP_OPTION__)
  return defaultHelpOptions.length > 0
}

export function usageMessage(commandDescriptor, parentCommand = null, commandPrefix = '', maxWidth = Number.MAX_SAFE_INTEGER) {
  const prefix = parentCommand ? '' : commandPrefix
  const fullCommandName = parentCommand ? `${parentCommand} ${commandDescriptor.name}` : commandDescriptor.name
  return `${prefix}${fullCommandName} - ${commandDescriptor.description}
${usageInfo(commandDescriptor.usage || commandDescriptor.name, parentCommand, prefix)}
${commandList(commandDescriptor.commands, maxWidth)}
${optionList(commandDescriptor.options, maxWidth)}
${exampleList(commandDescriptor.examples, maxWidth)}`
}

export default function usage(cd, args = null, opts = {}) {
  const options = Object.assign({}, DEFAULT_OPTIONS, opts)
  const commandDescriptor = options.includeHelp ? addHelpOption(cd) : cd
  if (options.includeHelp) {
    if (!args || (args.help && commandDescriptorIncludesDefaultHelp(commandDescriptor))) {
      return usageMessage(commandDescriptor, null, options.commandPrefix, options.maxWidth)
    }
    if (args.$) {
      const subcommand = Object.keys(args.$)[0]
      const subcommandDescriptor = findSubcommandDescriptor(commandDescriptor, subcommand)
      if (args.$[subcommand].help && commandDescriptorIncludesDefaultHelp(subcommandDescriptor)) {
        return usageMessage(subcommandDescriptor, commandDescriptor.name, null, options.maxWidth)
      }
    }
  }
}
