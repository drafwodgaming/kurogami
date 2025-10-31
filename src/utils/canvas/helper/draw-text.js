const drawText = ({ context, text, position, fontSize, fontFamily, color }) => {
	const ctx = context

	ctx.textAlign = 'center'
	ctx.fillStyle = color
	ctx.font = `${fontSize}px ${fontFamily}`
	ctx.fillText(text, position.x, position.y)
}

export { drawText }
