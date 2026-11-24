import createMemberCardMessage from './create-member-card-message.js'
import getColor from '../general/get-color.js'

const createWelcomeCardMessage = member =>
	createMemberCardMessage(member, {
		title: 'Welcome',
		innerCardX: 148,
		colors: {
			primary: getColor('green', '#'),
			secondary: getColor('emerald', '#'),
			background: getColor('raisinBlack', '#'),
			text: getColor('white', '#'),
		},
	})

export default createWelcomeCardMessage
