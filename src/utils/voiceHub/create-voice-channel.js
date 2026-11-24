import { ChannelType, OverwriteType, PermissionFlagsBits } from 'discord.js'

const createVoiceChannel = async (guild, member, parentCategory, savedSettings) => {
	const creatorPermissions = [
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.Stream,
		PermissionFlagsBits.MuteMembers,
		PermissionFlagsBits.DeafenMembers,
		PermissionFlagsBits.MoveMembers,
		PermissionFlagsBits.PrioritySpeaker,
		PermissionFlagsBits.UseVAD,
		PermissionFlagsBits.ViewChannel,
	]
	const everyonePermissions = [
		PermissionFlagsBits.Connect,
		PermissionFlagsBits.Speak,
		PermissionFlagsBits.Stream,
		PermissionFlagsBits.UseVAD,
		PermissionFlagsBits.ViewChannel,
	]
	const everyoneCanConnect = !savedSettings?.IsLocked
	const everyoneAllowedPermissions = everyoneCanConnect
		? everyonePermissions
		: everyonePermissions.filter(permission => permission !== PermissionFlagsBits.Connect)

	const permissionOverwrites = [
		{ id: member.id, allow: creatorPermissions },
		{
			id: guild.id,
			allow: everyoneAllowedPermissions,
			...(everyoneCanConnect ? {} : { deny: [PermissionFlagsBits.Connect] }),
		},
		...(savedSettings?.AllowedUsers ?? []).map(userId => ({
			id: userId,
			type: OverwriteType.Member,
			allow: [PermissionFlagsBits.Connect, PermissionFlagsBits.ViewChannel],
		})),
	]

	const channelOptions = {
		name: savedSettings?.ChannelName || `🔊 ${member.displayName}'s channel`,
		type: ChannelType.GuildVoice,
		parent: parentCategory,
		userLimit: savedSettings?.Limit ?? 0,
		permissionOverwrites,
	}

	return guild.channels.create(channelOptions)
}

export default createVoiceChannel
