import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

const styles = {
	link: ButtonStyle.Link,
	primary: ButtonStyle.Primary,
	secondary: ButtonStyle.Secondary,
	success: ButtonStyle.Success,
	danger: ButtonStyle.Danger,
}

export const buildButtonComponent = config => {
	// Гарантируем массив
	const items = Array.isArray(config) ? config : [config]

	const buttons = items.map(({ id, label, disabled = false, style, emoji, url }) => {
		const method = style === 'link' ? 'setURL' : 'setCustomId'

		const button = new ButtonBuilder()
			.setLabel(label)
			.setDisabled(disabled)
			.setStyle(styles[style])
			[method](style === 'link' ? url : id)

		return emoji ? button.setEmoji(emoji) : button
	})

	return new ActionRowBuilder().addComponents(...buttons)
}
