const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const dbfunctions = require('../../db/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('multiplier')
        .setDescription('add or remove a multiplier from a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('add a multiplier to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('the user to add the multiplier to')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('multiplier')
                        .setDescription('the multiplier to add')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('duration')
                        .setDescription('the duration of the multiplier')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('viewall')
                .setDescription('view all multipliers for a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('the user to view the multipliers for')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('remove a multiplier from a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('the user to remove the multiplier from')
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName('index')
                        .setDescription('the index of the multiplier to remove')
                        .setRequired(true)
                )
        ),
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })
        const user = interaction.options.getUser('user')
        const mongouser = await dbfunctions.fetchUser(mongoclient, user.id)
        switch (interaction.options.getSubcommand()) {
            case "add":
                const multiplier = interaction.options.getNumber('multiplier')
                const duration = interaction.options.getInteger('duration') || null
                require('../../utils/logabuse').logabuse(`${interaction.user.tag} used the multiplier command: ${multiplier}x multiplier to ${user.tag} for ${duration ? `${duration} minutes` : "forever"}`)
                mongouser.boosts.push({ multiplier, end: duration ? Date.now() + duration * 60000 : null})
                await mongoclient.db("RefBot").collection("users").updateOne({ id: user.id }, { $set: { boosts: mongouser.boosts}});
                return interaction.editReply({embeds: [{title: "Multiplier Added", description: `Added a ${multiplier}x multiplier to ${user.username} for ${duration ? `${duration} minutes` : "forever"}`}]})
                break;
            case "viewall":
                const boosts = mongouser.boosts.map((boost, index) => `${index}: ${boost.multiplier}x for ${boost.end ? `${(boost.end - Date.now()) / 60000} minutes` : "forever"}`)
                return interaction.editReply({embeds: [{title: "User Multipliers", description: boosts.join("\n")}]})
                break;
            case "remove":
                const index = interaction.options.getNumber('index')
                if (index < 0 || index >= mongouser.boosts.length) {
                    return interaction.editReply({embeds: [{title: "Invalid Index", description: "The index provided is not valid"}]})
                }
                mongouser.boosts.splice(index, 1)
                await mongoclient.db("RefBot").collection("users").updateOne({ id: user.id }, { $set: { boosts: mongouser.boosts}});
                return interaction.editReply({embeds: [{title: "Multiplier Removed", description: `Removed multiplier at index ${index} from ${user.username}`}]})
                break;
            default:
                return interaction.editReply({embeds: [{title: "Invalid Subcommand", description: "The subcommand provided is not valid"}]})
                break;
        }
    }
}