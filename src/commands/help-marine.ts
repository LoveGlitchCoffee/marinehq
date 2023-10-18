import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help-marine')
    .setDescription('Get help using MarineHQ'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(
      'https://spellboundgames.co.uk/pages/one-piece-bounty-board'
    );
  }
};
