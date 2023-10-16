import { Collection, Events, Message } from 'discord.js';
import { readdirSync } from 'fs';
import { discordToken } from '../config.json';
import { ExtendedClient } from './extended-client';
import { join } from 'path';

// generic name to replace
export class Bot {
  public constructor(public readonly client: ExtendedClient) {
    this.client.commands = new Collection<string, any>();

    this.client.on(Events.ClientReady, async () => {
      // do anything after client ready, such as fetching server emojis
      console.log(`${this.client.user!.username} ready!`);
    });
    this.client.on(Events.Warn, (info) => console.log(info));
    this.client.on(Events.Error, console.error);

    this.importCommands();
    this.onInteractionCreate();
    this.onMessageCreate();
    this.client.login(discordToken);
  }

  /**
   * Gets all the command files under '../commands' directory. Import them and
   * set them as commands for the Discord client. Then, set the callback for
   * interaction event
   */
  private async importCommands() {
    const commandFiles = readdirSync(
      join(__dirname, '..', '..', 'src', 'commands')
    );

    for (const file of commandFiles) {
      const jsFileName = file.substring(0, file.lastIndexOf('.')) + '.js'; // transpiled file name
      const command = await import(
        join(__dirname, '..', 'commands', jsFileName)
      );
      this.client.commands.set(command.data.name, command);
    }
  }

  private async onInteractionCreate() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      console.log(interaction.guild?.name);
      const command = this.client.commands.get(interaction.commandName);

      if (!command)
        console.error('No command matching ' + interaction.commandName);

      try {
        await command?.execute(interaction);
      } catch (error) {
        console.log(error);
      }
    });
  }

  /** Old style message interaction */
  private async onMessageCreate() {
    this.client.on(Events.MessageCreate, async (message: Message) => {
      if (message.author.bot || !message.guild) return;
      //console.log(message.guild?.name);
    });
  }
}
