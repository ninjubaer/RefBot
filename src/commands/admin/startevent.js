const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const { execute } = require('../gambling/doubleornothing')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startevent')
        .setDescription('Start an event')
        .addSubcommand(subcommand =>
            subcommand
                .setName('xp')
                .setDescription('Start an xp event')
                .addIntegerOption(option =>
                    option
                        .setName('multiplier')
                        .setDescription('The xp multiplier for the event')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('duration')
                        .setDescription('The duration of the event in minutes')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
        async execute(interaction, client, mongoclient) {
            await interaction.deferReply({ fetchReply: true })
            const users = mongoclient.db("RefBot").collection("users")
            switch (interaction.options.getSubcommand()) {
                case 'xp':
                    const multiplier = interaction.options.getInteger('multiplier')
                    const duration = interaction.options.getInteger('duration')
                    await users.updateMany({}, { $push: { boosts: { multiplier, end: Date.now() + duration * 60000 } } })
                    return interaction.editReply({ content: `Started an xp event with a ${multiplier}x multiplier for ${duration} minutes!` })
            }
        }
}