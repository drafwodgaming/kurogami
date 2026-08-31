const interactionCreateEvent = {
	name: 'interactionCreate',

	async execute(interaction, context) {
		const { customId, commandName } = interaction
		const { commands, buttons, selectMenus, modals } = context

		if (interaction.isAutocomplete()) {
			return commands.get(commandName)?.autocomplete?.(interaction)
		}

		if (interaction.isChatInputCommand()) {
			return commands.get(commandName)?.actions(interaction)
		}

		if (interaction.isButton()) {
			return buttons.get(customId)?.execute(interaction)
		}

		if (interaction.isAnySelectMenu()) {
			return selectMenus.get(customId)?.execute(interaction, context)
		}

		if (interaction.isModalSubmit()) {
			return modals.get(customId)?.execute(interaction)
		}
	},
}

export default interactionCreateEvent
