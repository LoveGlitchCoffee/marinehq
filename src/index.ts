import { GatewayIntentBits } from 'discord.js';
import { Bot } from './structs/bot';
import { ExtendedClient } from './structs/extended-client';

export const sultania = new Bot(
  new ExtendedClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  })
);
