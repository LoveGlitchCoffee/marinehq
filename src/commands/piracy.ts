import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import * as database from '../utils/database';
import * as poster from '../utils/poster';

const PiracyActs: string[] = [
  'kaido-drop',
  'emperor-slayer',
  'treasure-hunter',
  'happy-go-lucky',
  'two-year-training',
  'straw-hat',
  'conqeuror-haki',
  'true-nakama',
  'king'
];

const Bounties = new Map<string, number>([
  [PiracyActs[0], 5000],
  [PiracyActs[1], 3000],
  [PiracyActs[2], 1000],
  [PiracyActs[3], 1000],
  [PiracyActs[4], 3000],
  [PiracyActs[5], 5000],
  [PiracyActs[6], 5000],
  [PiracyActs[7], 3000],
  [PiracyActs[8], 1000]
]);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('piracy')
    .setDescription('Report an act of piracy')
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[0])
        .setDescription('Kill 7 Characters with 10-drop Kaido')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[1])
        .setDescription('Kill 10-drop Big Mom')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[2])
        .setDescription('Play 4 searchers')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[3])
        .setDescription('Play 4 triggers')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[4])
        .setDescription('Jet Pistol a Pacifista')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[5])
        .setDescription('Have 5 characters that is Straw Hat on the board')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[6])
        .setDescription(
          'Have 5 characters that canonically have Conquerors Haki'
        )
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[7])
        .setDescription('Block for your teammate in Buddy Battle')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(PiracyActs[8])
        .setDescription('Win a tournament')
        .addUserOption((option) =>
          option
            .setName('username')
            .setDescription('Username of Pirate')
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const commandUsed = interaction.options.getSubcommand();
    const bountyIncrease = Bounties.get(commandUsed);

    if (!bountyIncrease) {
      interaction.editReply('Something went wrong updating bounty');
      return;
    }
    const username = interaction.user.username;
    const newBounty = await database.updateBounty(username, bountyIncrease);
    const pirateName = await database.getPirateName(username);
    const image = await database.getImageUrl(username);

    if (!pirateName || !image || !newBounty) {
      console.log('Failure interacting with database');
      interaction.editReply('Something went wrong updating bounty');
      return;
    }

    const newPosterURL = await poster.generatePoster(
      pirateName,
      image,
      parseInt(newBounty)
    );

    if (newPosterURL.length === 0) {
      console.log('Was not able to generate poster');
      interaction.editReply('Something went wrong updating bounty');
      return;
    }

    await database.updatePoster(username, newPosterURL);
    interaction.editReply(newPosterURL);
  }
};
