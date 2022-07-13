import channels from '@/lib/database/models/channels';
import threads from '@/lib/database/models/threads';
import ThreadState from '@/types/ThreadState';
import ThreadType from '@/types/ThreadType';
import getThreadStateIcon from '@/utils/getThreadStateIcon';
import getThreadTypeString from '@/utils/getThreadTypeString';
import replyInteraction from '@/utils/replyInteraction';
import {
  Listener, ListenerOptions, PieceContext
} from '@sapphire/framework';
import { Message, MessageButton, MessageEmbed } from 'discord.js';

export default class MessageCreateListener extends Listener {
  constructor(context: PieceContext, options?: ListenerOptions) {
    super(context, {
      ...options,
      event: 'messageCreate'
    });
  }

  async run(message: Message) {
    if (message.author.id === this.container.client.user?.id) return;
    if (await channels.count({ guild: message.guildId, _id: message.channelId }) === 0) return;

    const stored = await channels.findById(message.channel.id);
    if (!stored || !stored.watch) return;

    const thread = await message.startThread({
      name: `${getThreadStateIcon(ThreadState.Open)} ${message.content}`
    });

    const confirm = await thread.send({
      embeds: [
        new MessageEmbed()
          .setTitle('Hello!')
          .setDescription('Please select the correct category for this ticket')
          .setColor('#0d3989')
          .setTimestamp()
      ],
      components: [
        {
          type: 'ACTION_ROW',
          components: [
            new MessageButton({
              customId: ThreadType.Support.toString(),
              label: 'Support',
              emoji: '⛑',
              style: 'SUCCESS'
            }),
            new MessageButton({
              customId: ThreadType.Feedback.toString(),
              label: 'Feedback',
              emoji: '💭',
              style: 'PRIMARY'
            }),
            new MessageButton({
              customId: ThreadType.Bug.toString(),
              label: 'Bug Report',
              emoji: '🐞',
              style: 'DANGER'
            })
          ]
        }
      ]
    });

    const selected = await confirm.awaitMessageComponent({ time: 5 * 60 * 1000 }).catch(() => null);
    const type = parseInt(selected?.customId ?? '0', 10);

    if (selected) {
      replyInteraction(selected, 'Changed');
    }

    await confirm.edit({
      embeds: [
        new MessageEmbed()
          .setTitle('Hello!')
          .setDescription(`\`${getThreadTypeString(type)}\` is selected for this ticket`)
          .setColor('#0d3989')
          .setTimestamp()
      ],
      components: []
    });

    await threads.findByIdAndUpdate(thread.id, {
      channel: message.channelId,
      guild: message.guildId,
      state: ThreadState.Open,
      user: message.author.id,
      type
    }, { upsert: true });
  }
}
