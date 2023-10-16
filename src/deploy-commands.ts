import { readdirSync } from 'fs';
import { REST, Routes } from 'discord.js';
import { testClientID, discordToken, clientID } from './config.json';
import { join } from 'path';

const commands: any = [];
const usingClientID = clientID;
const usingClientToken = discordToken;
const isBetaTest = usingClientID === testClientID;
// Grab all the command files from the commands directory you created earlier
const commandFiles = readdirSync(
  join(__dirname, '..', 'src', 'commands')
).filter((file) => file.endsWith('.ts'));

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(usingClientToken);

// and deploy your commands!
(async () => {
  // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
  for (const file of commandFiles) {
    const jsFileName = file.substring(0, file.lastIndexOf('.')) + '.js'; // transpiled file name
    const command = await import(join(__dirname, 'commands', jsFileName));
    commands.push(command.data.toJSON());
  }

  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(usingClientID), {
      body: commands
    });

    console.log(
      `Successfully reloaded ${(data as any).length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
