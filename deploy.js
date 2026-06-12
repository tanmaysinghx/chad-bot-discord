const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('join')
        .setDescription('Tell Chad to join your voice channel'),
    new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song or link')
        .addStringOption(option => 
            option.setName('query')
                .setDescription('The song title or URL')
                .setRequired(true)),
    new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    new SlashCommandBuilder()
        .setName('queue')
        .setDescription('View the current music queue'),
    new SlashCommandBuilder()
        .setName('credits')
        .setDescription('View information about Chad\'s developer'),
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop playing music and clear the queue')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        
        // Using your exact application ID: 1515000097849475133
        await rest.put(
            Routes.applicationCommands('1515000097849475133'), 
            { body: commands }
        );
        
        console.log('Successfully registered commands!');
    } catch (error) {
        console.error(error);
    }
})();