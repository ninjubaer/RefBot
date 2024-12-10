const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('View the shop'),
    async execute(interaction) {
        await interaction.deferReply({ fetchReply: true});
        const embed = new EmbedBuilder()
            .setTitle("Shop")
            .setDescription("Buy items with your xp!")
            .addFields(
                {name: "Custom Role", "value": "10'000 xp", inline: true},
                {name: "1.5x XP 5 minutes", "value": "100 xp", inline: true},
            )
            .setColor(0x2b2d31)
        return await interaction.editReply({embeds: [embed]});
    }
}