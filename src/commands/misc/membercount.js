const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Get the member count of the server'),
    async execute(interaction, client) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.memberCount + " Members", iconURL: interaction.guild.iconURL() })
                    .setColor(0x2b2d31)
                    .setTimestamp()
            ]
        })
    }
}