const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');

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
                {name: "(1) Custom Role", "value": "10'000 xp", inline: false},
                {name: "(2) 2x XP 5 minutes", "value": "100 xp", inline: false},
            )
            .setColor(0x2b2d31)
        const actionrow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('buyitem1')
                    .setColor('PRIMARY')
                    .setLabel('Buy Custom Role'),
                new ButtonBuilder()
                    .setCustomId('buyitem2')
                    .setColor('PRIMARY')
                    .setLabel('Buy 2x XP 5 minutes')
            )
        return await interaction.editReply({embeds: [embed]});
    }
}