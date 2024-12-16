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
            description += `${element.name} - ${element.amount}\n`
        });
        description = description.trim() || 'No items in your inventory'
        console.log(description)
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.username}'s Inventory`)
            .setDescription(`You have ${user.inventory.length} items in your inventory`)
    }
}