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
    name: 'open',
    description: 'Set the ticket as opened'
  }
})
export default class OpenSlashCommand extends SlashCommand {
  async run(interaction: CommandInteraction) {
    if (!await threads.exists({ _id: interaction.channelId })) return;

    await threads.findByIdAndUpdate(interaction.channelId, {
      state: ThreadState.Open
    });

    await (interaction.channel as ThreadChannel).setName(`${getThreadStateIcon(ThreadState.Open)} ${(interaction.channel as ThreadChannel).name.slice(2)}`);

    replyInteraction(interaction, {
      embeds: [
        new MessageEmbed()
          .setTitle('Opened')
          .setColor('#eabc31')
          .setDescription('Ticket opened, good luck!')
          .setTimestamp()
      ]
    });
  }
}
