import threads from '@/lib/database/models/threads';
import { HasPermission } from '@/lib/decorators/common';
import SlashCommand, { SlashCommandOptions } from '@/lib/structures/SlashCommandPiece';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction } from 'discord.js';

@ApplyOptions<SlashCommandOptions>({
  guildOnly: true,
  commandData: {
    name: 'push',
    description: 'Push the ticket to Github Issues'
  }
})
export default class PushSlashCommand extends SlashCommand {
  @HasPermission(['MANAGE_CHANNELS', 'MANAGE_THREADS', 'MANAGE_GUILD'])
  async run(interaction: CommandInteraction) {
    // eslint-disable-next-line no-useless-return
    if (!await threads.exists({ _id: interaction.channelId })) return;

    // TODO: implementation
  }
}
