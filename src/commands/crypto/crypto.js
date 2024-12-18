const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dbfunctions = require('../../db/index')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('crypto')
        .setDescription('show crypto you own'),
    async execute(interaction, client, mongoclient) {
        const user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
        interaction.reply({embeds: [
            new EmbedBuilder()
                .setTitle('Crypto')
                .setDescription('You own ' + user.bitcoin + ' bitcoin and ' + user.ethereum + ' ethereum')
                .setColor(0x2b2d31)
        ]})
    }
}