const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message")
        .setDescription("Send a message")
        .addStringOption(option =>
            option
            .setName("data")
            .setDescription("The message you want to send")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
        async execute(interaction, client) {
            const message = interaction.options.getString("data");
            await interaction.reply(JSON.parse(message));
        }
}