const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Returns the bots ping'),
    async execute(interaction, client) {
        //console.log('ping command executed');
        const message = await interaction.deferReply({
            fetchReply: true
        });

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pong! 🏓')
                    .setDescription(`Latency: \`${client.ws.ping}ms\`\nAPI: \`${message.createdTimestamp - interaction.createdTimestamp}ms\``)
                    .setTimestamp()
                    .setColor(0x2b2d31)
                    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()})
            ]
        })

    }
}