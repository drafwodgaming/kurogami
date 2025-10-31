import { CommandHandler } from '../../handlers/command.handler.js'
import { ComponentHandler } from '../../handlers/component.handler.js'
import { EventHandler } from '../../handlers/event.handler.js'

export function createAllHandlers(client, logger) {
	return {
		commands: new CommandHandler(client, logger),
		components: new ComponentHandler(client, logger),
		events: new EventHandler(client, logger),
	}
}
