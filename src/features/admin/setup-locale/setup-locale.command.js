import {
	ContainerBuilder,
	InteractionContextType,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from 'discord.js'
import getColor from '../../../utils/general/get-color.js'
import getLanguageFlag from '../../../utils/general/get-lang-flag.js'
import getLanguageName from '../../../utils/general/get-lang-name.js'
import getLocalizedText from '../../../utils/general/get-locale.js'
import serverLocaleSchema from '../../../schemas/server-locale.schema.js'

const setupLocaleCommand = {
	data: new SlashCommandBuilder()
		.setName('locale')
		.setDescription('Set the language for the server')
		.setDescriptionLocalizations({
			ru: 'Установить язык для сервера',
			uk: 'Налаштувати мову для сервера',
		})
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand =>
			subcommand
				.setName('setup')
				.setDescription('Set the language for the server')
				.setDescriptionLocalizations({
					ru: 'Установить язык для сервера',
					uk: 'Налаштувати мову для сервера',
				})
				.addStringOption(option =>
					option
						.setName('language')
						.setDescription('Choose Language')
						.setDescriptionLocalizations({
							ru: 'Выбрать язык',
							uk: 'Вибрати мову',
						})
						.setRequired(true)
						.addChoices(
							{ name: 'English', value: 'en' },
							{ name: 'Русский', value: 'ru' },
							{ name: 'Українська', value: 'uk' }
						)
				)
		)
		.setContexts(InteractionContextType.Guild),

	async actions(interaction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral })

		const language = interaction.options.getString('language')

		await serverLocaleSchema.updateOne(
			{ Guild: interaction.guild.id },
			{ Language: language },
			{ upsert: true }
		)

		const locale = await getLocalizedText(interaction)

		const container = new ContainerBuilder()
			.addTextDisplayComponents(
				new TextDisplayBuilder().setContent(
					locale('commands.locale.messages.success', {
						flag: getLanguageFlag(language),
						language: getLanguageName(language),
					})
				)
			)
			.setAccentColor(getColor('bot', '0x'))

		return interaction.editReply({
			flags: MessageFlags.IsComponentsV2,
			components: [container],
		})
	},
}

export default setupLocaleCommand
