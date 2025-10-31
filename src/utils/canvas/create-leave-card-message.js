import { GlobalFonts, createCanvas } from '@napi-rs/canvas'
import { AttachmentBuilder } from 'discord.js'
import { drawAvatar } from './helper/draw-avatar.js'
import { drawText } from './helper/draw-text.js'
import { fillRoundedRect } from './helper/fill-rounded-rectangle.js'
import { getColor } from '../general/get-color.js'

const fonts = {
	luckiestGuyRegular: {
		path: './assets/fonts/LUCKIESTGUY_REGULAR.ttf',
		family: 'Luckiest Guy',
	},
}

const createLeaveCardMessage = async member => {
	// Цвета
	const crimson = getColor('crimson', '#')
	const bittersweet = getColor('bittersweet', '#')
	const raisinBlack = getColor('raisinBlack', '#')
	const white = getColor('white', '#')

	// Шрифты
	const { luckiestGuyRegular } = fonts

	GlobalFonts.registerFromPath(luckiestGuyRegular.path, luckiestGuyRegular.family)

	// Размеры холста
	const canvasWidth = 1024
	const canvasHeight = 450
	const canvas = createCanvas(canvasWidth, canvasHeight)
	const context = canvas.getContext('2d')

	// Параметры карточек
	const cardPaddingX = 118.5
	const cardPaddingY = 21
	const cardRadius = 26

	const leftCardWidth = 393.5 // 1024 / 2 - 118.5
	const leftCardHeight = 321 // 450 * 0.75 - 21

	const rightCardX = 512 // 1024 / 2
	const rightCardWidth = 393.5 // 1024 - 118.5 - 512
	const rightCardHeight = 321 // 450 * 0.75 - 21
	const rightCardY = 109 // 450 - 321 - 20

	const innerCardX = 160 // 512 - 364
	const innerCardY = 46 // 225 - 179
	const innerCardWidth = 728
	const innerCardHeight = 358
	const innerCardRadius = 25

	// Аватар
	const avatarRadius = 100
	const avatarX = 512 // CanvasWidth / 2
	const avatarY = 180 // CanvasHeight - 270

	// текст
	const fontSizeHeader = 43
	const textX = 512
	const textY = 360

	// Рисуем карточки
	fillRoundedRect({
		context,
		rectInfo: {
			x: cardPaddingX,
			y: cardPaddingY,
			width: leftCardWidth,
			height: leftCardHeight,
			radius: cardRadius,
		},
		color: crimson,
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
		color: bittersweet,
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

	// Аватар
	await drawAvatar({
		context,
		avatarURL: member.user.displayAvatarURL({ extension: 'jpg' }),
		position: { x: avatarX, y: avatarY },
		radius: avatarRadius,
	})

	// Текст
	drawText({
		context,
		text: `Goodbye ${member.user.username}!`,
		position: { x: textX, y: textY },
		fontSize: fontSizeHeader,
		fontFamily: luckiestGuyRegular.family,
		color: white,
	})

	return new AttachmentBuilder(canvas.toBuffer('image/png'))
}

export { createLeaveCardMessage }
