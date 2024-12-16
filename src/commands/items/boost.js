const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { fetchUser: nerd } = require('../../db/index');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('boost')
        .setDescription('Show your boosts')
        .addSubcommand(subcommand =>
            subcommand
                .setName('use')
                .setDescription('Use a boost')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('duration')
                .setDescription('Show the duration of your active boost')
        )
        ,
    async execute(interaction, client, mongoclient) {
        const user = await nerd(mongoclient, interaction.user.id);
        switch (interaction.options.getSubcommand()) {
            case "use":
                const invboost = user.inventory.find(i => i.name === '<:xpboost:1318204006962692147> 2x xp boost 5min');
                if (!invboost || invboost.amount < 1) return interaction.reply({ content: 'You do not have any boosts', ephemeral: true });
                user.inventory.find(i => i.name === '<:xpboost:1318204006962692147> 2x xp boost 5min').amount--;
                if (user.boosts.find(b => b.name === '2x xp boost 5min')) {
                    user.boosts.find(b => b.name === '2x xp boost 5min').end += 300000;
                }
                else {
                    user.boosts.push({ name: '2x xp boost 5min', multiplier: 2, end: Date.now() + 300000 });
                }
                await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { inventory: user.inventory, boosts: user.boosts } });
                interaction.reply({ content: 'Boost used', ephemeral: true });
                break;
            case "duration":
                const boost = user.boosts.find(b => b.name === '2x xp boost 5min');
                if (!boost) return interaction.reply({ content: 'You do not have an active boost', ephemeral: true });
                const timeleft = boost.end - Date.now();
                if (timeleft <= 0) {
                    await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $pull: { boosts: boost } });
                    return interaction.reply({ content: 'Boost expired', ephemeral: true });
                }
                const formattedtime = new Date(timeleft).toISOString().substring(11, 19);
                const embed = new EmbedBuilder()
                    .setTitle('2x xp boost 5min')
                    .setDescription(`Time left: \`${formattedtime}\``)
                interaction.reply({ embeds: [embed], ephemeral: true });
                break;
        }
    }
}