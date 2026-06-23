import { GlobalFonts, createCanvas } from '@napi-rs/canvas'
import { AttachmentBuilder } from 'discord.js'
import drawAvatar from './helper/draw-avatar.js'
import drawText from './helper/draw-text.js'
import fillRoundedRect from './helper/fill-rounded-rectangle.js'
import getColor from '../general/get-color.js'

const fonts = {
	luckiestGuyRegular: {
		path: './assets/fonts/LUCKIESTGUY_REGULAR.ttf',
		family: 'Luckiest Guy',
	},
}

const createWelcomeCardMessage = async member => {
	const green = getColor('green', '#')
	const emerald = getColor('emerald', '#')
	const raisinBlack = getColor('raisinBlack', '#')
	const white = getColor('white', '#')

	const { luckiestGuyRegular } = fonts

	GlobalFonts.registerFromPath(luckiestGuyRegular.path, luckiestGuyRegular.family)

	const canvasWidth = 1024
	const canvasHeight = 450
	const canvas = createCanvas(canvasWidth, canvasHeight)
	const context = canvas.getContext('2d')

	const cardPaddingX = 118.5
	const cardPaddingY = 21
	const cardRadius = 26

	const leftCardWidth = 393.5
	const leftCardHeight = 321

	const rightCardX = 512
	const rightCardWidth = 393.5
	const rightCardHeight = 321
	const rightCardY = 109

	const innerCardX = 148
	const innerCardY = 46
	const innerCardWidth = 728
	const innerCardHeight = 358
	const innerCardRadius = 25

	const avatarRadius = 100
	const avatarX = 512
	const avatarY = 180

	const fontSizeHeader = 43
	const textX = 512
	const textY = 360

	fillRoundedRect({
		context,
		rectInfo: {
			x: cardPaddingX,
			y: cardPaddingY,
			width: leftCardWidth,
			height: leftCardHeight,
			radius: cardRadius,
		},
		color: green,
	})

	fillRoundedRect({
		context,
		rectInfo: {
			x: rightCardX,
			y: rightCardY,
			width: rightCardWidth,
			height: rightCardHeight,
			radius: cardRadius,
		},
		color: emerald,
	})

	fillRoundedRect({
		context,
		rectInfo: {
			x: innerCardX,
			y: innerCardY,
			width: innerCardWidth,
			height: innerCardHeight,
			radius: innerCardRadius,
		},
		color: raisinBlack,
	})

	await drawAvatar({
		context,
		avatarURL: member.user.displayAvatarURL({ extension: 'jpg' }),
		position: { x: avatarX, y: avatarY },
		radius: avatarRadius,
	})

	drawText({
		context,
		text: `Welcome ${member.user.username}!`,
		position: { x: textX, y: textY },
		fontSize: fontSizeHeader,
		fontFamily: luckiestGuyRegular.family,
		color: white,
	})

	return new AttachmentBuilder(canvas.toBuffer('image/png'))
}

export default createWelcomeCardMessage
