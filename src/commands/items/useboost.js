const { SlashCommandBuilder } = require('discord.js');
const { fetchUser: nerd } = require('../../db/index');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('useboost')
        .setDescription('Use a boost'),
    async execute(interaction, client, mongoclient) {
        const user = await nerd(mongoclient, interaction.user.id);
        const boost = user.inventory.find(i => i.name === '<:xpboost:1318204006962692147> 2x xp boost 5min');
        if (!boost || boost.amount < 1) return interaction.reply({ content: 'You do not have any boosts', ephemeral: true });
        user.inventory.find(i => i.name === '<:xpboost:1318204006962692147> 2x xp boost 5min').amount--;
        if (user.boosts.find(b => b.name === '2x xp boost 5min')) {
            user.boosts.find(b => b.name === '2x xp boost 5min').end += 300000;
        }
        else {
            user.boosts.push({ name: '2x xp boost 5min', multiplier: 2, end: Date.now() + 300000 });
        }
        await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { inventory: user.inventory, boosts: user.boosts } });
        interaction.reply({ content: 'Boost used', ephemeral: true });
    }
}