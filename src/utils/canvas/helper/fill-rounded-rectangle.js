import { drawRoundedRect } from './draw-rounded-rectangle.js'

const zeroValue = 0
const hexBase = 16
const hexLength = 6

const fillRoundedRect = ({ context, rectInfo, color }) => {
	let fillColor = color

	if (typeof fillColor === 'number') {
		fillColor = `#${fillColor.toString(hexBase).padStart(hexLength, '0')}`
	}

	const ctx = context

	ctx.fillStyle = fillColor

	const { x } = rectInfo
	const { y } = rectInfo
	const { width } = rectInfo
	const { height } = rectInfo
	const radius = rectInfo.radius ?? zeroValue

	drawRoundedRect({
		context: ctx,
		x,
		y,
		width,
		height,
		radius,
	})

	ctx.fill()
}

export { fillRoundedRect }
