const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

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
                {name: "(1) Custom Role", "value": "20'000 xp", inline: false},
                {name: "(2) 2x XP 5 minutes", "value": "100 xp", inline: false},
            )
            .setColor(0x2b2d31)
        const actionrow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('shopbutton:1')
                    .setLabel('Buy Custom Role')
                    .setStyle(1)
                    ,
                new ButtonBuilder()
                    .setCustomId('shopbutton:2')
                    .setStyle(1)
                    .setLabel('Buy 2x XP 5 minutes')
            )
        return await interaction.editReply({embeds: [embed], components: [actionrow]});
    }
}