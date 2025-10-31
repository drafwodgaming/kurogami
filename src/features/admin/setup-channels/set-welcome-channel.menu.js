import { MessageFlags } from 'discord.js'
import { buildContainerComponent } from '../../../utils/builders/container-component.builder.js'
import { buildTextComponent } from '../../../utils/builders/text-component.builder.js'
import { getColor } from '../../../utils/general/get-color.js'
import { getLocalizedText } from '../../../utils/general/get-locale.js'
import welcomeChannelSchema from '../../../schemas/welcome-channel.schema.js'

export default class ChooseWelcomeChannelMenu {
	id = 'chooseWelcomeChannel'
	async execute(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const locale = await getLocalizedText(interaction)
		const colors = {
			warning: getColor('warning', '0x'),
			success: getColor('success', '0x'),
		}

		const { guild, values } = interaction
		const [channelId] = values

		const previousWelcomeConfig = await welcomeChannelSchema.findOneAndUpdate(
			{ Guild: guild.id },
			{ $set: { Channel: channelId } },
			{ upsert: true }
		)
		const succesMessage = buildTextComponent(
			locale(`components.menus.channelSetup.welcome.messages.success`, {
				channelId,
			})
		)
		const successContainer = buildContainerComponent({
			components: [succesMessage],
			accentColor: colors.success,
		})

		const warningMessage = buildTextComponent(
			locale(`components.menus.channelSetup.welcome.messages.alreadySet`)
		)
		const warningContainer = buildContainerComponent({
			components: [warningMessage],
			accentColor: colors.warning,
		})

		const replyContainer =
			previousWelcomeConfig && previousWelcomeConfig.Channel === channelId
				? warningContainer
				: successContainer

		return interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [replyContainer],
		})
	}
}
