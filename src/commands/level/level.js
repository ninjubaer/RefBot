const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Check your level')
        .addUserOption(option => option.setName('user').setDescription('The user to check').setRequired(false)),
    async execute(interaction, client, mongoclient) {
        const levelFunctions = require('../../utils/levels');
        const target = interaction.options.getUser('user') || interaction.user;
        const user = await require('../../db/index').fetchUser(mongoclient, target.username);
        const level = levelFunctions.getLevel(user.xp);
        const rank = await levelFunctions.getRank(user.xp, mongoclient) + 1;
        const img = await createLevelcard(target.username, target.avatarURL({extension: "png"}), target.accentColor || 0x7289DA, level, user.xp, levelFunctions.xpForNextLevel(level),level ? levelFunctions.xpForNextLevel(level-1) : 0, rank);
        const attachment = new AttachmentBuilder(img, { name: 'levelcard.png' });
        await interaction.reply({ files: [attachment] });
    }
}

async function createLevelcard(user, avatarurl, usercolor, level, xp, xpneeded, xpPrev, rank) {
    const width = 800;
    const height = 300;
    const canva = createCanvas(width, height);
    const ctx = canva.getContext('2d');
    ctx.fillStyle = `#131416`;
    fillRoundedRect(ctx, 0, 0, width, height, 25);
    // progress bar
    ctx.fillStyle = '#ffffff';
    fillRoundedRect(ctx, 20, 200, 650, 50, 25);
    // draw xp
    ctx.font = '20px GeistMono Nerd Font';
    let xpString = `${xp}/${xpneeded} XP`;
    let xpwidth = ctx.measureText(xpString).width;
    let xpHeight = ctx.measureText(xpString).actualBoundingBoxAscent + ctx.measureText(xpString).actualBoundingBoxDescent;
    let xpX = 670 - xpwidth - 5;
    let xpY = 260 + xpHeight;
    ctx.fillText(xpString, xpX, xpY);
    //draw progress
    ctx.fillStyle =  `#${usercolor.toString(16)}`;
    fillRoundedRect(ctx, 19, 200, 1+650 * ((xp-xpPrev) / (xpneeded-xpPrev)), 50, 25);
    // draw user avatar
    const avatar = await loadImage(avatarurl);
    const avatarX = 20;
    const avatarY = 20;
    const avatarSize = 160;
    ctx.save()
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();
    // draw user name
    ctx.font = 'Superbold 50px GeistMono Nerd Font';
    let userheight = ctx.measureText(user).actualBoundingBoxAscent + ctx.measureText(user).actualBoundingBoxDescent;
    ctx.fillText(user, 210, avatarY + avatarSize / 2 + userheight / 2);
    // draw level
    let levelwidth = ctx.measureText(level).width;
    let levelheight = ctx.measureText(level).actualBoundingBoxAscent + ctx.measureText(level).actualBoundingBoxDescent;
    ctx.fillText(level, 670 + 130 / 2 - levelwidth / 2, 200 + 50 / 2 + levelheight / 2);

    // draw rank
    ctx.font = 'Bold 40px GeistMono Nerd Font'
    let rankString = (rank == 1) ? '1st' : (rank == 2) ? '2nd' : (rank == 3) ? '3rd' : rank + 'th';
    let rankwidth = ctx.measureText(rankString).width;
    let rankX = 780 - rankwidth;
    let rankY = 0 + 50 / 2 + levelheight / 2;
    ctx.fillText(rankString, rankX, rankY);
    return canva.toBuffer("image/png");
    function fillRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }
}