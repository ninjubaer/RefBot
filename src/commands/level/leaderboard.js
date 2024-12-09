
const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require('canvas');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
levelFunctions = require('../../utils/levels');
const fs = require('fs');
const path = require('path');
registerFont(path.join(__dirname, './../../assets/font/Roboto-Bold.ttf'), { family: 'Roboto', weight: 'Bold' });
let background;
(async ()=>{background = loadImage(path.join(__dirname, './../../assets/images/leaderboardfield.png'))})();
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
            if (!duser) continue;
            players.push({
                avatar: duser.user.displayAvatarURL({ extension: 'png', size: 512 }),
                displayName: duser.displayName,
                level: levelFunctions.getLevel(user.xp),
                rank: leaderboard.indexOf(user) + 1,
            })
        }
        const img = await drawLeaderboard(players);
        const attachment = new AttachmentBuilder(img, { name: 'leaderboard.png' });
        interaction.editReply({
            files: [attachment]
        })
    }

}

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

async function drawLeaderboard(users) {
    const canva = createCanvas(400, 105 * users.length - 5);
    const ctx = canva.getContext('2d');
    background = await background;
    for (let i = 0; i < users.length; i++) {
        ctx.drawImage(background, 0, i * 105, canva.width, 100);
        let avatarImage = await loadImage(users[i].avatar);
        ctx.save();
        ctx.beginPath();
        ctx.arc(50, i * 105 + 50, 40, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, 10, i * 105 + 10, 80, 80);
        ctx.restore();
        ctx.font = 'Bold 26px "Roboto"';
        ctx.fillStyle = '#ffffff';
        let measure = ctx.measureText(users[i].displayName);
        let textX = 110;
        let textY = i * 105 + 50 + measure.actualBoundingBoxAscent / 2;
        ctx.fillText(users[i].displayName, textX, textY, 200);
        ctx.font = 'Bold 20px "Roboto"';
        textY = ctx.measureText('lvl: ' + users[i].level).actualBoundingBoxAscent / 2 + i * 105 + 50;
        ctx.fillText('lvl: ' + users[i].level, textX + 210, textY+20);

        ctx.fillStyle = '#aaaaaa';
        ctx.font = 'Bold 18px "Roboto"';
        ctx.fillText('#' + users[i].rank, textX + 210, textY - 30);
    }
    return canva.toBuffer('image/png');
}