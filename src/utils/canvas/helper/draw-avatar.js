import { loadImage } from '@napi-rs/canvas'

const drawAvatar = async ({ context, avatarURL, position, radius }) => {
	const avatarImage = await loadImage(avatarURL)

	context.save()

	const ctx = context

	ctx.beginPath()
	ctx.lineWidth = 10
	ctx.strokeStyle = 'white'
	ctx.arc(position.x, position.y, radius, 0, Math.PI * 2, true)
	ctx.stroke()
	ctx.clip()
	context.drawImage(avatarImage, position.x - radius, position.y - radius, radius * 2, radius * 2)

	context.restore()
}

export { drawAvatar }
