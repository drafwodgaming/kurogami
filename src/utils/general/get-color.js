const colors = {
	bot: 0x5178c8,
	success: 0x90ee90,
	white: 0xf0f0f0,
	edit: 0x6495ed,
	warning: 0xffd65c,
	persianRed: 0xcd5c5c,
	crimson: 0xc53138,
	green: 0x00a93c,
	emerald: 0x00d279,
	bittersweet: 0xf56062,
	raisinBlack: 0x1d1e22,
}

const getColor = (name, format) => {
	const colorValue = colors[name]
	if (colorValue === undefined) return null

	switch (format) {
		case 'hex':
		case '#': {
			return `#${colorValue.toString(16).padStart(6, '0')}`
		}
		case '0x':
			return colorValue
		case 'rgb':
		default:
			return `rgb(${(colorValue >> 16) & 255}, ${(colorValue >> 8) & 255}, ${colorValue & 255})`
	}
}

export default getColor
