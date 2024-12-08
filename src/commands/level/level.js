const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { RankCardBuilder, Font } = require('canvacord');
const levelFunctions = require('../../utils/levels');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your level')
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(false)),
    async execute(interaction, client, mongoclient) {
        await interaction.deferReply({
            fetchReply: true
        });
        const target = interaction.options.getUser('user') || interaction.user;
        const user = await require('../../db/index').fetchUser(mongoclient, target.id);
        const level = levelFunctions.getLevel(user.xp);
        const rank = await levelFunctions.getRank(user.xp, mongoclient) + 1;
        const rankCard = new RankCardBuilder()
            .setDisplayName(target.globalName)
            .setUsername(target.username)
            .setAvatar(target.displayAvatarURL({ format: 'png', size: 512 }))
            .setLevel(level)
            .setRank(rank)
            .setCurrentXP(user.xp)
            .setRequiredXP(levelFunctions.xpForNextLevel(level))
        const font = await Font.fromFile('./src/assets/font/Roboto-Bold.ttf');
        const img = await rankCard.build({
            fonts: [font],
            format: 'png'
        })
        const attachment = new AttachmentBuilder(img, { name: 'levelcard.png' });
        await interaction.editReply({ files: [attachment] });
    }
}