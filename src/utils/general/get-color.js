const colors = {
	bot: 'rgb(81, 120, 200);',
	success: 'rgb(144, 238, 144)',
	white: 'rgb(240, 240, 240)',
	edit: 'rgb(100, 149, 237)',
	warning: 'rgb(255, 214, 92)',
	persianRed: 'rgb(205, 92, 92)',
	crimson: 'rgb(197, 49, 56)',
	green: 'rgb(0, 169, 60)',
	emerald: 'rgb(0, 210, 121)',
	bittersweet: 'rgb(245, 96, 98)',
	raisinBlack: 'rgb(29, 30, 34)',
}

// Константы в varName формате
const rgbComponentsCount = 3
const hexBase = 16
const hexLength = 6
const baseTwo = 2
const redExp = 16
const greenExp = 8
const blueMultiplier = 1
const hexOffsetExp = 24

const redMultiplier = baseTwo ** redExp
const greenMultiplier = baseTwo ** greenExp
const hexOffset = baseTwo ** hexOffsetExp

const getColor = (name, format) => {
	const colorValue = colors[name]

	if (!colorValue) {
		return null
	}

	const rgbArray = colorValue.match(/\d+/gu)?.map(Number)

	if (!rgbArray || rgbArray.length !== rgbComponentsCount) {
		return null
	}

	const [redValue, greenValue, blueValue] = rgbArray

	switch (format) {
		case 'hex':
		case '#': {
			const hexNumber =
				hexOffset +
				redValue * redMultiplier +
				greenValue * greenMultiplier +
				blueValue * blueMultiplier

			return `#${hexNumber.toString(hexBase).slice(1).padStart(hexLength, '0')}`
		}
		case '0x': {
			const hexNumber =
				redValue * redMultiplier + greenValue * greenMultiplier + blueValue * blueMultiplier

			return hexNumber
		}
		case 'rgb':
		default:
			return colorValue
	}
}

export { getColor }
