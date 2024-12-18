const { SlashCommandBuilder } = require('discord.js');
const { createCanvas } = require('canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('color')
        .setDescription('Create a color image')
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color: #RRGGBB or a CSS color name')
                .setRequired(true)
        ),
    async execute(interaction) {
        const color = interaction.options.getString('color');
        const canvas = createColorCanvas(color);

        interaction.reply({ files: [canvas.toBuffer()] });
    }
}

function createColorCanvas(color) {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 100, 100);

    return canvas;
}