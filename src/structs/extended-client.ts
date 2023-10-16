import { Client, Collection } from 'discord.js';

export class ExtendedClient extends Client {
  public commands = new Collection<string, any>();
}
