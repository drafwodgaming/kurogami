export default class InteractionCreate {
	name = 'interactionCreate'
	once = false
	async execute(interaction) {
		const { client, customId, commandName } = interaction
		const command = client.commands.get(commandName)

		if (interaction.isAutocomplete()) {
			return command?.autocomplete?.(interaction)
		}
		if (interaction.isChatInputCommand()) {
			return command.actions(interaction)
		}
		if (interaction.isMessageComponent() || interaction.isModalSubmit()) {
			let component

			if (interaction.isButton()) {
				component = client.buttons.get(customId)
			} else if (interaction.isAnySelectMenu()) {
				component = client.selectMenus.get(customId)
			} else {
				component = client.modals.get(customId)
			}

			return component?.execute(interaction)
		}

		return null
	}
}
