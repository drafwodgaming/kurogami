const interactionCreateEvent = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction, context) {
		const { customId, commandName } = interaction
		const { commands, buttons, selectMenus, modals } = context
		const command = commands.get(commandName)

		if (interaction.isAutocomplete()) {
			return command?.autocomplete?.(interaction)
		}
		if (interaction.isChatInputCommand()) {
			return command?.actions(interaction)
		}
		if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
			let component

			if (interaction.isButton()) {
				component = buttons.get(customId)
			} else if (interaction.isAnySelectMenu()) {
				component = selectMenus.get(customId)
			} else {
				component = modals.get(customId)
			}

			return component?.execute(interaction)
		}

		return null
	},
}

export default interactionCreateEvent
