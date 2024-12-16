const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')
const { fetchUser } = require('../../db/index')
const nerd = require('../../utils/logabuse')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('give')
        .setDescription('give something to a user')
        .addSubcommand(sc =>
            sc
                .setName('xp')
                .setDescription('give xp to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('the user to give xp to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('the amount of xp to give')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        ,
    async execute(interaction, client, mongoclient) {
        switch (interaction.options.getSubcommand()) {
            case "xp":
                const user = interaction.options.getUser('user')
                const amount = interaction.options.getInteger('amount')
                nerd.logabuse(`${interaction.user.tag} used the give command: ${amount} xp to ${user.tag}`)
                const mongouser = await fetchUser(mongoclient, user.id)
                mongouser.xp += amount
                await mongoclient.db("RefBot").collection("users").updateOne({ id: user.id }, { $set: { xp: mongouser.xp } });
                interaction.reply({ content: `Gave ${amount} xp to ${user.username}`, ephemeral: true })
                break;
        }
    }
}