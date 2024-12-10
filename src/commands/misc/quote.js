const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Quote a message')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to quote')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('channel_id')
                .setDescription('The ID of the channel the message is in')
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        });
        const channel = interaction.guild.channels.cache.get(interaction.options.getString('channel_id'));
        const message = await channel.messages.fetch(interaction.options.getString('message_id'));
        const avatar = message.author.displayAvatarURL({ extension: 'png', size: 512 });
        const content = message.content;
        const author = message.author.tag;
        const date = message.createdAt;
        return await interaction.editReply({
            content: content,
            embeds: [
                {
                    "author": {
                        "name": author,
                        "icon_url": avatar
                    },
                    "description": content,
                    "timestamp": date
                }
            ]
        })
    }
}