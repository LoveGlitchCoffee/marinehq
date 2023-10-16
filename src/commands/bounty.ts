import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import * as database from '../utils/database';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bounty')
    .setDescription('Check a bounty')
    .addUserOption((option) =>
      option.setName('username').setDescription('Username of Pirate')
    )
    .addStringOption((option) =>
      option.setName('name').setDescription('Name of Pirate').setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const username = interaction.options.getUser('username');
    const piratename = interaction.options.getString('name');

    if (!username && !piratename) {
      interaction.editReply('Must provide username or Pirate Name');
      return;
    }

    let posterUrl = '';
    if (username) {
      const url = await database.getPoster(username.username, true);
      if (url) posterUrl = url;
    } else if (piratename) {
      const url = await database.getPoster(piratename, false);
      if (url) posterUrl = url;
    }

    if (posterUrl.length > 0) interaction.editReply(posterUrl);
    else interaction.editReply(`Unable to find pirate.`);
  }
};
