import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as database from '../utils/database';
import * as poster from '../utils/poster';
import * as imagehost from '../utils/image-host';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update-poster')
    .setDescription('Update your Pirate Poster image')
    .addAttachmentOption((option) =>
      option
        .setName('picture')
        .setDescription('The picture for the bounty poster')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const image = interaction.options.getAttachment('picture');
    const username = interaction.user.username;
    if (!image) {
      console.log(`updating poster`);
      console.log(`pirate name ${username}`);
      console.log(`image ${image}`);
      interaction.editReply('Unable to create poster');
      return;
    }

    const uploadedImageURL = await imagehost.uploadToImgHost(image.url);

    if (uploadedImageURL.length === 0) {
      console.log('cannot upload OG image');
      interaction.editReply('Unable to upload image');
      return;
    }

    const pirateName = await database.getPirateName(username);
    const bounty = await database.getBounty(username);

    if (!pirateName || !bounty) {
      interaction.editReply(`Could not update poster, please try again`);
      return;
    }

    const posterURL = await poster.generatePoster(
      pirateName,
      image.url,
      bounty
    );

    if (posterURL.length > 0) {
      await database.updatePoster(username, posterURL);
      await database.updateOGImage(username, uploadedImageURL);
      interaction.editReply(posterURL);
    } else {
      console.log('Upload unsuccessful');
      interaction.editReply(`Unable to update poster`);
    }
  }
};
