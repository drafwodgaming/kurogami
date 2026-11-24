import createMemberCardMessage from './create-member-card-message.js'
import getColor from '../general/get-color.js'

const createLeaveCardMessage = member =>
	createMemberCardMessage(member, {
		title: 'Goodbye',
		innerCardX: 160,
		colors: {
			primary: getColor('crimson', '#'),
			secondary: getColor('bittersweet', '#'),
			background: getColor('raisinBlack', '#'),
			text: getColor('white', '#'),
		},
	})

export default createLeaveCardMessage
