const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the bot\'s ping'),
    async execute(interaction) {
        await interaction.deferReply({
            fetchReply: true
        });
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pong! 🏓')
                    .setDescription(`API: \`${Date.now() - interaction.createdTimestamp}ms\`\nLatency: \`${interaction.client.ws.ping}ms\``)
                    .setColor(0x2b2d31)
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
            ]
        })
    }
}