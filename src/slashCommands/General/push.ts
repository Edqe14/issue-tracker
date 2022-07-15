import CLIENT_CONFIG from '@/config';
import threads from '@/lib/database/models/threads';
import { HasPermission } from '@/lib/decorators/common';
import octokit from '@/lib/structures/Octokit';
import SlashCommand, { SlashCommandOptions } from '@/lib/structures/SlashCommandPiece';
import getThreadTypeString from '@/utils/getThreadTypeString';
import nonNullable from '@/utils/nonNullable';
import replyInteraction from '@/utils/replyInteraction';
import { ApplyOptions } from '@sapphire/decorators';
import { CommandInteraction, MessageEmbed, ThreadChannel } from 'discord.js';

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

    const thread = nonNullable(await threads.findById(interaction.channelId));
    const user = await this.container.client.users.fetch(thread?.user);
    const channel = interaction.channel as ThreadChannel;
    const starterMessage = await channel.fetchStarterMessage();
    const afterMessages = await channel.messages.fetch({
      after: starterMessage.id
    });

    const first = [starterMessage];

    // eslint-disable-next-line no-restricted-syntax
    for (const msg of afterMessages.reverse().values()) {
      // eslint-disable-next-line no-continue
      if (msg.author.id === this.container.client.user?.id) continue;
      if (msg.author.id !== starterMessage.author.id) break;

      first.push(msg);
    }

    const issue = await octokit.rest.issues.create({
      owner: CLIENT_CONFIG.github.owner,
      repo: CLIENT_CONFIG.github.repo,
      title: channel.name.slice(2),
      body: `⚠ Issue reported by **\`${user.tag} (${user.id})\`**\n[[Thread]](https://discord.com/channels/${interaction.guildId}/${interaction.channelId})\n\n> ${first.map((m) => `${m.cleanContent} ${m.attachments.size ? '📎 ' : ''}${m.attachments.map((v) => `[[${v.name}]](${v.url})`).join(' ')}`.trim()).join('\n> ')}\n\n<sup>*Opened by **\`${interaction.user.tag} (${interaction.user.id})\`** at **${interaction.createdAt.toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' })}***</sup>`,
      labels: [getThreadTypeString(thread.type).toLowerCase()]
    });

    replyInteraction(interaction, {
      embeds: [
        new MessageEmbed()
          .setTitle('Pushed to Github')
          .setColor('#f4f4f4')
          .setDescription(`Opened [#${issue.data.number}](${issue.data.html_url})`)
          .setTimestamp()
      ]
    });
  }
}
