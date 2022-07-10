import { Listener } from '@sapphire/framework';
import Config from '@/config';
import type { CommandInteraction } from 'discord.js';
import replyInteraction from '@/utils/replyInteraction';

export class InteractionCreate extends Listener {
  public async run(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const cmd = this.container.stores.get('slashCommands').get(interaction.commandName);
    if (!cmd || !cmd.run) return;

    try {
      if (Config.autoDefer) {
        await interaction.deferReply({
          ephemeral: Config.autoEphemeral
        });
      }

      cmd.run(interaction);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fatal = (err: any) => this.container.logger.fatal(err);
      fatal(e);

      const body = {
        content: `There was a problem with your request.\n\`\`\`${e.message}\`\`\``,
        ephemeral: true
      };

      replyInteraction(interaction, body).catch(fatal);
    }
  }
}
