import { ContainerBuilder } from 'discord.js'

export const buildContainerComponent = ({ components, accentColor, spoiler = false }) =>
	new ContainerBuilder({ components, accent_color: accentColor, spoiler })
