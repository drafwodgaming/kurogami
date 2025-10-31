import { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } from 'discord.js'

const channelTypes = {
	text: ChannelType.GuildText,
	voice: ChannelType.GuildVoice,
	category: ChannelType.GuildCategory,
}

export const buildChannelSelector = ({ id, placeholder, channelType, disabled = false }) =>
	new ActionRowBuilder().addComponents(
		new ChannelSelectMenuBuilder()
			.setCustomId(id)
			.setPlaceholder(placeholder)
			.setChannelTypes(channelTypes[channelType])
			.setDisabled(disabled)
	)
