const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('linkaccount')
        .setDescription('Link your account to the bot'),
    async execute(interaction, client) {
        const rows = [new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setLabel('Enter your Forntie username')
                    .setCustomId('fnusername')
                    .setStyle(1)
                    .setRequired(false)
            ),
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setLabel('Enter yur Valorant username')
                        .setCustomId('valorantusername')
                        .setStyle(1)
                        .setRequired(false)
                ),
            new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                        .setLabel('Enter your WarThunder username')
                        .setCustomId('wtusername')
                        .setStyle(1)
                        .setRequired(false)

                ),
        ]
        const modal = new ModalBuilder()
            .setTitle('Link your accounts')
            .setCustomId('linkaccount')
            .addComponents(rows[0], rows[1], rows[2])
        // send modal
        await interaction.showModal(modal)
    }
}
