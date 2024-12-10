const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buymulti')
        .setDescription('Buy an XP multiplier'),
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({fetchReply: true})
        const dbfunctions = require('../../db/index')
        const user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
        const price = 5000 * user.boughtMulti
        if (user.xp < price) {
            return interaction.editReply({content: `You need ${price} xp to buy a multiplier!`})
        }
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Buy Multiplier')
                    .setDescription('Are you sure you want to buy a multiplier?')
                    .addFields(
                        {name: 'Price', value: price.toString()},
                        {name: 'Current Multiplier', value: user.boughtMulti.toString()},
                        {name: 'Your XP', value: user.xp.toString()}
                    )

            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('confirm-multi-buy:' + interaction.user.id)
                            .setLabel('Yes')
                            .setStyle(1),
                        new ButtonBuilder()
                            .setCustomId('cancel-multi-buy:' + interaction.user.id)
                            .setLabel('No')
                            .setStyle(4)
                    ),
            ]
        })
    }
}