const pi = 3.141_592_653_589_793
const halfPi = 1.570_796_326_794_896_6
const oneAndHalfPi = 4.712_388_980_384_69
const twoPi = 6.283_185_307_179_586

const drawRoundedRect = ({ context, x, y, width, height, radius = 0 }) => {
	const startX = x + radius
	const startY = y + radius
	const endX = x + width - radius
	const endY = y + height - radius

	const topY = y
	const bottomY = y + height
	const leftX = x
	const rightX = x + width

	context.beginPath()
	context.moveTo(startX, topY)
	context.lineTo(endX, topY)
	context.arc(endX, startY, radius, oneAndHalfPi, twoPi)
	context.lineTo(rightX, endY)
	context.arc(endX, endY, radius, 0, halfPi)
	context.lineTo(startX, bottomY)
	context.arc(startX, endY, radius, halfPi, pi)
	context.lineTo(leftX, startY)
	context.arc(startX, startY, radius, pi, oneAndHalfPi)
	context.closePath()
}

export { drawRoundedRect }
