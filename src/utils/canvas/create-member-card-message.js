import { GlobalFonts, createCanvas } from '@napi-rs/canvas'
import { AttachmentBuilder } from 'discord.js'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import drawAvatar from './helper/draw-avatar.js'
import drawText from './helper/draw-text.js'
import fillRoundedRect from './helper/fill-rounded-rectangle.js'

const FONT_FAMILY = 'Luckiest Guy'
const FONT_PATH = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../../../assets/fonts/LUCKIESTGUY_REGULAR.ttf'
)

GlobalFonts.registerFromPath(FONT_PATH, FONT_FAMILY)

const createMemberCardMessage = async (member, { title, colors, innerCardX }) => {
	const canvas = createCanvas(1024, 450)
	const context = canvas.getContext('2d')

	fillRoundedRect({
		context,
		rectInfo: { x: 118.5, y: 21, width: 393.5, height: 321, radius: 26 },
		color: colors.primary,
	})
	fillRoundedRect({
		context,
		rectInfo: { x: 512, y: 109, width: 393.5, height: 321, radius: 26 },
		color: colors.secondary,
	})
	fillRoundedRect({
		context,
		rectInfo: { x: innerCardX, y: 46, width: 728, height: 358, radius: 25 },
		color: colors.background,
	})

	await drawAvatar({
		context,
		avatarURL: member.user.displayAvatarURL({ extension: 'jpg' }),
		position: { x: 512, y: 180 },
		radius: 100,
	})

	drawText({
		context,
		text: `${title} ${member.user.username}!`,
		position: { x: 512, y: 360 },
		fontSize: 43,
		fontFamily: FONT_FAMILY,
		color: colors.text,
	})

	return new AttachmentBuilder(canvas.toBuffer('image/png'))
}

export default createMemberCardMessage
