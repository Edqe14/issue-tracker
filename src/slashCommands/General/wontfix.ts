import threads from '@/lib/database/models/threads';
import { HasPermission } from '@/lib/decorators/common';
import SlashCommand, { SlashCommandOptions } from '@/lib/structures/SlashCommandPiece';
import ThreadState from '@/types/ThreadState';
import getThreadStateIcon from '@/utils/getThreadStateIcon';
import replyInteraction from '@/utils/replyInteraction';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction, MessageEmbed, ThreadChannel } from 'discord.js';

@ApplyOptions<SlashCommandOptions>({
  guildOnly: true,
  commandData: {
    name: 'wontfix',
    description: 'Set the ticket as wont fix'
  }
})
export default class WontFixSlashCommand extends SlashCommand {
  @HasPermission(['MANAGE_CHANNELS', 'MANAGE_THREADS', 'MANAGE_GUILD'])
  async run(interaction: CommandInteraction) {
    if (!await threads.exists({ _id: interaction.channelId })) return;

    await threads.findByIdAndUpdate(interaction.channelId, {
      state: ThreadState.WontFix
    });

    await (interaction.channel as ThreadChannel).setName(`${getThreadStateIcon(ThreadState.WontFix)} ${(interaction.channel as ThreadChannel).name.slice(2)}`);

    replyInteraction(interaction, {
      embeds: [
        new MessageEmbed()
          .setTitle('Wont Fix')
          .setColor('#eabc31')
          .setDescription('Ticket closed. Thank you everyone!')
          .setTimestamp()
      ]
    });
  }
}
