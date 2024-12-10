const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { execute } = require('../../events/guild/messageCreate')
const dbfunctions = require('../../db/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('interact with xp system')
        .addSubcommand(subcommand =>
            subcommand
                .setName('send')
                .setDescription('send xp to a user')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('the user to send xp to')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('amount')
                        .setDescription('the amount of xp to send')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('multiplier')
                .setDescription('view your xp multiplier')
        ),
    async execute(interaction,client,mongoclient) {
        switch (interaction.options.getSubcommand()) {
            case "send":
                const user = interaction.options.getUser('user')
                const amount = interaction.options.getInteger('amount')
                const sender = interaction.user
                const senderUser = await dbfunctions.fetchUser(mongoclient, sender.id)
                if (senderUser.xp < amount) {
                    return interaction.reply({content: "You do not have enough xp to send that amount", ephemeral: true})
                }
                if (amount < 0) {
                    return interaction.reply({content: "You cannot send negative xp", ephemeral: true})
                }
                const receiverUser = await dbfunctions.fetchUser(mongoclient, user.id)
                receiverUser.xp += amount
                senderUser.xp -= amount
                await mongoclient.db("RefBot").collection("users").updateOne({ id: user.id }, { $set: { xp: receiverUser.xp } });
                await mongoclient.db("RefBot").collection("users").updateOne({ id: sender.id }, { $set: { xp: senderUser.xp } });
                return interaction.reply({embeds: [new EmbedBuilder().setTitle("XP Sent").setDescription(`Sent ${amount} xp to ${user.username}`).setAuthor({name: sender.username, iconURL: sender.displayAvatarURL()}).setColor(0x2b2d31)]})
                break;
            case "multiplier":
                const mongouser = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                let boost = 1;
                if (interaction.guild.premiumSubscriptionCount > 0) {
                    boost *= 1.2
                }
                for (const userboost of mongouser.boosts) {
                    if (userboost.end > Date.now()) {
                        boost *= userboost.multiplier
                    }
                    else {
                        await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $pull: { boosts: userboost } });
                    }
                }
                return interaction.reply({content: `Your current xp multiplier is ${boost}`, ephemeral: true})
                break;
            default:
                return interaction.reply({content: "Invalid subcommand", ephemeral: true})
                break;
        }
    }
}