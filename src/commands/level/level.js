const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { RankCardBuilder, Font } = require('canvacord');
const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require('canvas');
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < radius) width = radius * 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}
const path = require('path');
registerFont(path.join(__dirname, './../../assets/font/Roboto-Bold.ttf'), { family: 'Roboto', weight: 'Bold' });
let background;
(async ()=>{background = await loadImage(path.join(__dirname, './../../assets/images/levelcard.png'))})();
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
       /*  const rankCard = new RankCardBuilder()
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
        }) */
        const rankCard = await createRankCard(target.username, target.displayAvatarURL({ extension: 'png', size: 512}), level, rank, user.xp, levelFunctions.xpForNextLevel(level));
        const attachment = new AttachmentBuilder(rankCard, { name: 'levelcard.png' });
        await interaction.editReply({ files: [attachment] });
    }
}


async function createRankCard(username, avatar, level, rank, xp, requiredXP) {
    const canva = createCanvas(480, 607);
    const ctx = canva.getContext('2d');
    background = await background;
    ctx.drawImage(background, 0, 0, canva.width, canva.height);

    const avatarImage = await loadImage(avatar);

    // draw avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(240, 196, 118, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, 122, 78, 236, 236);
    ctx.restore();
    // draw username
    ctx.font = 'Bold 40px "Roboto"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(username, canva.width/2, 370, canva.width - 40);

    // draw level
    ctx.font = 'Bold 30px "Roboto"';
    ctx.fillText(level, 112, 509);

    // draw rank
    ctx.fillText('#' + rank, 370, 509);

    // draw xp
    ctx.font = 'Bold 20px "Roboto"';
    ctx.fillText(`${xp} / ${requiredXP}`, 240, 444, 360);

    // draw progress
    ctx.fillStyle = '#fe95fe';
    ctx.roundRect(60, 391, 360 / requiredXP * xp, 30, 15);
    ctx.fill();

    return canva.toBuffer("image/png");
}