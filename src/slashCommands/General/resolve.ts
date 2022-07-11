import threads from '@/lib/database/models/threads';
import SlashCommand, { SlashCommandOptions } from '@/lib/structures/SlashCommandPiece';
import ThreadState from '@/types/ThreadState';
import getThreadStateIcon from '@/utils/getThreadStateIcon';
import replyInteraction from '@/utils/replyInteraction';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction, MessageEmbed, ThreadChannel } from 'discord.js';

@ApplyOptions<SlashCommandOptions>({
  guildOnly: true,
  commandData: {
    name: 'resolve',
    description: 'Set the ticket as resolved'
  }
})
export default class WatchSlashCommand extends SlashCommand {
  async run(interaction: CommandInteraction) {
    if (!await threads.exists({ _id: interaction.channelId })) return;

    await threads.findByIdAndUpdate(interaction.channelId, {
      state: ThreadState.Resolved
    });

    await (interaction.channel as ThreadChannel).setName(`${getThreadStateIcon(ThreadState.Resolved)} ${(interaction.channel as ThreadChannel).name.slice(2)}`);

    replyInteraction(interaction, {
      embeds: [
        new MessageEmbed()
          .setTitle('Resolved')
          .setColor('#43d81a')
          .setDescription('Thank you everyone!')
          .setTimestamp()
      ]
    });
  }
}
