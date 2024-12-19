const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { BrawlStars } = require('../../utils/brawlstars')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('brawlstarsleaderboard')
        .setDescription('Get the leaderboard of our Brawl Stars club'),
    async execute(interaction) {
        interaction.deferReply({fetchReply: true})
        const club = await BrawlStars.getClub('2CULYL0CJ')
        const members = club.members.map(member => {
            return `${member.name} - ${member.trophies}`
        })
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(club.name)
                    .setDescription(members.join('\n'))
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setFooter('Brawl Stars Club Leaderboard')
            ]
        })
    }
}