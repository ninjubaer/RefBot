const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { fetchUser } = require('../../db/index')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Show your inventory'),
    async execute(interaction, client, mongoclient) {
        const user = await fetchUser(mongoclient, interaction.user.id);
        let description = '';
        user.inventory.forEach(element => {
            element.amount && (description += `${element.name} - ${element.amount}\n`)
        });
        description = description.trim() || 'No items in your inventory'
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Inventory`)
            .setDescription(description)
        interaction.reply({ embeds: [embed], ephemeral: true})
    }
}