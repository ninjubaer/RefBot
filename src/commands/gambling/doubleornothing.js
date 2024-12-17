const { SlashCommandBuilder } = require('discord.js')
const dbfunctions = require('../../db/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName("doubleornothing")
        .setDescription("Double or nothing!")
        .addIntegerOption(option=>
            option.setName("amount")
            .setDescription("The amount of xp to bet")
            .setRequired(true)
        )
        ,
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({fetchReply: true})
        const user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
        const amount = interaction.options.getInteger('amount')
        if (amount < 0) {
            return interaction.editReply({content: "You cannot bet negative xp!"})
        }
        if (amount > user.xp) {
            return interaction.editReply({content: "You do not have enough xp to bet that amount!"})
        }
        const result = Math.random() >= 0.55
        if (result) {
            user.xp += amount
            user.gamblediff += amount
            await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { xp: user.xp, gamblediff: user.gamblediff } });
            return interaction.editReply({content: `You won ${amount} xp!`})
        }
        else {
            user.xp -= amount
            user.gamblediff -= amount
            await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { xp: user.xp, gamblediff: user.gamblediff } });
            return interaction.editReply({content: `You lost ${amount} xp!`})
        }
    }
}