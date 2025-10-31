import { SeparatorBuilder, SeparatorSpacingSize } from 'discord.js'

const sizes = {
	small: SeparatorSpacingSize.Small,
	large: SeparatorSpacingSize.Large,
}

export const buildSeparatorComponent = ({ size, divider = true }) =>
	new SeparatorBuilder({ spacing: sizes[size], divider })
