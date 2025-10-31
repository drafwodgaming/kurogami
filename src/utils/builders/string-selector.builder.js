import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js'

export const buildStringSelector = ({
	id,
	placeholder,
	options,
	disabled = false,
	minValues = 1,
	maxValues = 1,
}) =>
	new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId(id)
			.setPlaceholder(placeholder)
			.setOptions(options)
			.setDisabled(disabled)
			.setMinValues(minValues)
			.setMaxValues(maxValues)
	)
