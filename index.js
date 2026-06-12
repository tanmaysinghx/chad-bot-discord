const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');

// Secure Token Loading: Checks Environment Variables first (for Docker/Jenkins),
// then falls back to your local config.json file (for local development).
let token;
try {
    const config = require('./config.json');
    token = config.token;
} catch (e) {
    token = process.env.DISCORD_TOKEN;
}

if (!token) {
    console.error("CRITICAL ERROR: No Discord token provided! Make sure config.json exists locally or DISCORD_TOKEN environment variable is set.");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const player = new Player(client);

// Setup extractors asynchronously
async function setupBot() {
    await player.extractors.loadMulti(DefaultExtractors);
    client.login(token); // Log in using the resolved token
}
setupBot();

// --- Event Listeners for Rich UI Feedback ---
player.events.on('playerStart', (queue, track) => {
    console.log(`Started playing: ${track.title}`);
    
    // Create an elegant layout for the now playing track
    const startEmbed = new EmbedBuilder()
        .setColor('#10B981') // Chad Green
        .setTitle('🎵 Now Playing')
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(track.thumbnail)
        .addFields(
            { name: 'Duration', value: `\`${track.duration}\``, inline: true },
            { name: 'Requested By', value: `${track.requestedBy}`, inline: true }
        )
        .setFooter({ text: 'Chad Audio Engine' });

    // Use metadata fallback safely to reply back to the text channel
    queue.metadata.followUp({ embeds: [startEmbed] }).catch(() => {});
});

player.events.on('error', (queue, error) => {
    console.log(`[Player Error] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`[Track Pipeline Error] ${error.message}`);
});

client.once('ready', (c) => {
    console.log(`Chad is online and ready to roll as ${c.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const channel = interaction.member.voice.channel;

    // Join Command
    if (interaction.commandName === 'join') {
        if (!channel) return await interaction.reply('You need to be in a voice channel first!');
        await interaction.reply('💪 Chad is in the house. Use `/play` to fire up the tracks.');
    }

    // Play Command
    if (interaction.commandName === 'play') {
        if (!channel) return await interaction.reply('You need to be in a voice channel first!');
        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            // player.play() handles joining the channel automatically
            const { track } = await player.play(channel, query, {
                nodeOptions: { metadata: interaction }
            });
            
            const addEmbed = new EmbedBuilder()
                .setColor('#3B82F6') // Chad Blue
                .setDescription(`✅ Added **[${track.title}](${track.url})** to the session queue.`);
                
            await interaction.followUp({ embeds: [addEmbed] });
        } catch (e) {
            console.error(e);
            await interaction.followUp('Something went wrong processing that audio track.');
        }
    }

    // Skip Command
    if (interaction.commandName === 'skip') {
        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply('Nothing is playing right now!');
        }
        
        queue.node.skip();
        await interaction.reply('⏭️ Skipped the current song!');
    }

    // Stop Command
    if (interaction.commandName === 'stop') {
        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply('Nothing is actively playing!');
        }
        
        queue.delete(); // Drops audio engine, clears queue array, and leaves vc
        await interaction.reply('🛑 Playback terminated and queue flushed.');
    }

    // Queue Command
    if (interaction.commandName === 'queue') {
        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.isPlaying()) {
            return await interaction.reply('The queue is empty right now!');
        }

        const currentTrack = queue.currentTrack;
        const tracks = queue.tracks.toArray(); // Converts internal structure to clean array

        const queueEmbed = new EmbedBuilder()
            .setColor('#F59E0B') // Chad Gold
            .setTitle('📋 Current Playback Lineup')
            .setDescription(`**Now Playing:** [${currentTrack.title}](${currentTrack.url})\n\n__Up Next:__`);

        if (tracks.length === 0) {
            queueEmbed.setDescription(`${queueEmbed.data.description}\nNo upcoming songs. Use \`/play\` to stack more tracks!`);
        } else {
            // Display top 10 items to prevent hitting raw Discord embed text limits
            const trackList = tracks.slice(0, 10).map((track, idx) => `**${idx + 1}.** [${track.title}](${track.url}) | \`${track.duration}\``).join('\n');
            queueEmbed.setDescription(`${queueEmbed.data.description}\n${trackList}${tracks.length > 10 ? `\n\n*...and ${tracks.length - 10} more tracks in queue*` : ''}`);
        }

        await interaction.reply({ embeds: [queueEmbed] });
    }

    // Author Credits Command
    if (interaction.commandName === 'credits') {
        const creditsEmbed = new EmbedBuilder()
            .setColor('#6EE7B7') // Seafoam Green
            .setTitle('⚡ Chad System Metadata')
            .setAuthor({ name: 'Chad Operations Core' })
            .setDescription('An optimized Discord audio processing framework engineered for zero packet lag and seamless playback stability.')
            .addFields(
                { name: '👨‍💻 Lead System Architect', value: 'Tanmay Singh', inline: true },
                { name: '✉️ Support Inquiry', value: 'tanmaysinghx@gmail.com', inline: true },
                { name: '📦 Engine Runtime', value: 'Node.js v20 & Docker Container', inline: false }
            )
            .setFooter({ text: 'Property of tanmaysinghx • All rights reserved.' });

        await interaction.reply({ embeds: [creditsEmbed] });
    }
});