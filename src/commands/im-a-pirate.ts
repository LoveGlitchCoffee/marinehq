import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import * as database from '../utils/database';
import * as poster from '../utils/poster';
import * as imagehost from '../utils/image-host';

const startingBounty = 1000;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('im-a-pirate')
    .setDescription('Declare you are a pirate')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Chosen Pirate name')
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName('picture')
        .setDescription('The picture for the bounty poster')
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const pirateName = interaction.options.getString('name');
    const image = interaction.options.getAttachment('picture');

    if (!pirateName || !image) {
      console.log(`pirate name ${pirateName}`);
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

    const posterURL = await poster.generatePoster(
      pirateName,
      image.url,
      startingBounty
    );

    if (posterURL.length > 0) {
      await database.createPirate(
        pirateName,
        interaction.user.username,
        uploadedImageURL,
        posterURL
      );
      interaction.editReply(posterURL);
    } else {
      console.log('Upload unsuccessful');
      interaction.editReply(`Unable to create poster`);
    }
  }
};
