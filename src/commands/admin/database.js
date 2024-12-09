const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('database')
        .setDescription('Interact with the database')
        .addSubcommand(subcommand =>
            subcommand
                .setName('findone')
                .setDescription('Find one document')
                .addStringOption(option =>
                    option
                        .setName('userid')
                        .setDescription('The user ID to find')
                        .setRequired(true)
                )
        ).setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        ,
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({ fetchReply: true, ephemeral: true });
        const subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case 'findone':
                const userId = interaction.options.getString('userid');
                console.log(userId);
                const user = await require('../../db/index').fetchUser(mongoclient, userId);
                if (!user) return interaction.editReply({ content: 'User not found!' });
                const embed = new EmbedBuilder()
                    .setTitle('User')
                    .setDescription(`data for user <@${userId}>`)
                    .setColor(0x2b2d31);
                Object.keys(user).forEach(key => {
                    if (key === '_id') return;
                    embed.addFields({name: key, value: key == 'lastxpmessage' ? `<t:${Math.floor(user.lastxpmessage / 1000)}:R>` : user[key] + '' || 'null' });
                })
                interaction.editReply({ embeds: [embed] });
                break;
            default:
                await interaction.editReply({ content: 'This subcommand does not exist!', ephemeral: true });
                break;
        }
    }
}