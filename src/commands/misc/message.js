const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { Routes } = require('discord-api-types/v10')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('send a message to a channel')
        .addStringOption(option =>
            option
                .setName('json')
                .setDescription('The json message to send')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('The channel to send the message to')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        ,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true, fetchReply: true });
        const json = interaction.options.getString('json');
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        try {
            const message = JSON.parse(json);
            await interaction.client.rest.post(`/channels/${channel.id}/messages`, { body: message });
            await interaction.editReply({ content: 'Message sent!', ephemeral: true });
        }
        catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}