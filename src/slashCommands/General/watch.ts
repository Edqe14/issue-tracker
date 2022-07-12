import channels from '@/lib/database/models/channels';
import { HasPermission } from '@/lib/decorators/common';
import SlashCommand, { SlashCommandOptions } from '@/lib/structures/SlashCommandPiece';
import replyInteraction from '@/utils/replyInteraction';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction, MessageEmbed } from 'discord.js';

@ApplyOptions<SlashCommandOptions>({
  guildOnly: true,
  commandData: {
    name: 'watch',
    description: 'Toggle or set watch for messages',
    options: [
      {
        name: 'enable',
        type: 'BOOLEAN',
        required: false,
        description: 'Explicitly set watch mode'
      }
    ]
  }
})
export default class WatchSlashCommand extends SlashCommand {
  @HasPermission(['MANAGE_CHANNELS', 'MANAGE_THREADS', 'MANAGE_GUILD'])
  async run(interaction: CommandInteraction) {
    const stored = await channels.findById(interaction.channelId);
    const value = interaction.options.getBoolean('enable', false) ?? (stored ? !stored.watch : true);

    await channels.findByIdAndUpdate(interaction.channelId, {
      watch: value,
      guild: interaction.guildId
    }, { upsert: true });

    return replyInteraction(interaction, {
      embeds: [
        new MessageEmbed()
          .setTitle('Success')
          .setColor('#43d81a')
          .setDescription(`Updated watch mode to \`${value}\``)
          .setTimestamp()
      ],
      ephemeral: true
    });
  }
}
