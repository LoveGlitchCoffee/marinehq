import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import * as database from '../utils/database';
import * as poster from '../utils/poster';

const PiracyActs: string[] = [
  'kaido-drop',
  'emperor-slayer',
  'treasure-hunter',
  'admirals-orders',
  'two-year-training',
  'straw-hat',
  'conqeuror-haki',
  'true-nakama',
  'king',
  'hoensty-impact',
  'cat-burglar',
  'shogun'
];

const Bounties = new Map<string, number>([
  [PiracyActs[0], 5000],
  [PiracyActs[1], 3000],
  [PiracyActs[2], 1000],
  [PiracyActs[3], 3000],
  [PiracyActs[4], 3000],
  [PiracyActs[5], 5000],
  [PiracyActs[6], 5000],
  [PiracyActs[7], 3000],
  [PiracyActs[8], 3000],
  [PiracyActs[9], 15000],
  [PiracyActs[10], 2000],
  [PiracyActs[11], 3000]
]);

const BountiesDescription: string[] = [
  'Kill 7 Characters with Purple 10-drop Kaido',
  'Kill any of: 10 drop Big Mom, 10 drop Kaido, 9 drop Shanks, 9 drop Edward Newgate',
  'Play 4 searches',
  'Playing a Black deck, K.O. 5 characters through effect',
  'Jet Pistol a Pacifista',
  'Have 5 characters that are different Straw Hats on the board',
  'Have 5 different characters that canonically have Conquerors Haki',
  'Block for your teammate in Buddy Battle',
  'Win a tournament',
  'K.O. a Stage',
  'Win a game with OP03-040 Nami Leader secondary win con',
  'Have 5 different characters that are different Wano characters'
];

const PiracyCommand = new SlashCommandBuilder()
  .setName('piracy')
  .setDescription('Report an act of piracy');

for (let index = 0; index < PiracyActs.length; index++) {
  const act = PiracyActs[index];
  const description = BountiesDescription[index];

  PiracyCommand.addSubcommand((subcommand) =>
    subcommand
      .setName(act)
      .setDescription(description)
      .addUserOption((option) =>
        option
          .setName('username')
          .setDescription('Username of Pirate')
          .setRequired(true)
      )
  );
}

module.exports = {
  data: PiracyCommand,

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const commandUsed = interaction.options.getSubcommand();
    const bountyIncrease = Bounties.get(commandUsed);

    if (!bountyIncrease) {
      interaction.editReply('Something went wrong updating bounty');
      return;
    }
    const username = interaction.options.getUser('username')?.username;
    if (!username) {
      interaction.editReply(`No such user ${username}, please try again`);
      return;
    }
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
