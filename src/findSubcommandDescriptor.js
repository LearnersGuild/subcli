export default function findSubcommandDescriptor(commandDescriptor, subcommand) {
  const subcommandDescriptor = commandDescriptor.commands.filter(cmd => cmd.name === subcommand)[0]
  if (!subcommandDescriptor) {
    throw new Error(`No such subcommand '${subcommand}'`)
  }
  return subcommandDescriptor
}
