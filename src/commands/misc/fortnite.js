const { createCanvas } = require('canvas');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('./ping');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fortnite')
        .setDescription('interact with the fortnite api')
        .addSubcommandGroup(group =>
            group
                .setName('get')
                .setDescription('Get stats for a player')
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('level')
                        .setDescription('Get the level of a player')
                        .addStringOption(option =>
                            option
                                .setName('name')
                                .setDescription('The name of the player')
                                .setRequired(true)
                        )
                )
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('stats')
                        .setDescription('Get the stats of a player')
                        .addStringOption(option=>
                            option
                                .setName('name')
                                .setDescription('The name of the player')
                                .setRequired(true)
                        )
                )
        ),
    async execute(interaction, client) {
        await interaction.deferReply({
            fetchReply: true
        });
        const playerName = interaction.options.getString('name');
        const url = `https://fortnite-api.com/v2/stats/br/v2?name=${playerName}&accountType=epic`
        const apiKey = process.env.FNAPIKEY;
        const headers = {
            "Authorization": apiKey,
            "User-Agent": "RefugeeBot by ninju"
        }
        const response = await fetch(url, {
            headers: headers
        }).then(response => response.json());
        if (response.status === 404) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Player not found")
                        .setColor(0xff0000)
                ],
                ephemeral: true
            });
        }
        if (response.status === 403) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("The requested account's stats are private")
                        .setColor(0xff0000)
                ],
                ephemeral: true
            });
        }
        if (!response) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("Player has not played this season")
                        .setColor(0xff0000)
                ],
                ephemeral: true
            });
        }
        switch (interaction.options._subcommand) {
            case "level":
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Level")
                            .setDescription(`The level of ${playerName} is ${response.data.battlePass.level}`)
                    ]
                });
                break;
            case "stats":
                console.log('hi');
            default:
                interaction.editReply({
                    content: "This should not happen",
                    ephemeral: true
                });
                console.log(interaction.options)
                break;
        }
    }
}