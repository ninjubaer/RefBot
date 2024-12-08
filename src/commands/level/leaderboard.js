
const { LeaderboardBuilder, Font } = require('canvacord');
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
levelFunctions = require('../../utils/levels');
Font.loadDefault()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard of the server.'),
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({
            fetchReply: true
        });
        const leaderboard = await levelFunctions.getLeaderboard(mongoclient);
        const players = [];
        const members = await interaction.guild.members.fetch();
        for (const user of leaderboard) {
            const duser = members.get(user.id);
            players.push({
                avatar: duser.user.displayAvatarURL({ extension: 'png', size: 512 }),
                displayName: duser.displayName,
                level: levelFunctions.getLevel(user.xp),
                rank: leaderboard.indexOf(user) + 1,
                username: duser.user.username,
                xp: user.xp

            })
        }
        const LB = new LeaderboardBuilder()
            .setPlayers(players)
            .setBackgroundColor('#2b2d31')
        const img = await LB.build({
            format: 'png'
        });
        const attachment = new AttachmentBuilder(img, { name: 'leaderboard.png' });
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Leaderboard')
                    .setColor(0x2b2d31)
                    .setImage('attachment://leaderboard.png')
            ],
            files: [attachment]
        })
    }

}