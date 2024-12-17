const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
require('dotenv').config()
const dbfunctions = require('../../db/index')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('bitcoin')
        .setDescription('bitcoin price')
        .addSubcommand(subcommand =>
            subcommand
                .setName('price')
                .setDescription('bitcoin price')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('buy')
                .setDescription('buy n% of a bitcoin')
                .addIntegerOption(option =>
                    option.setName('percent')
                        .setDescription('percentage of bitcoin to buy')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sell')
                .setDescription('sell n% of a bitcoin')
                .addIntegerOption(option =>
                    option.setName('percent')
                        .setDescription('percentage of bitcoin to sell')
                        .setRequired(true)
                )
        ),
    async execute(interaction, client, mongoclient) {
        let user;
        const subcommand = interaction.options.getSubcommand()
        await interaction.deferReply({ fetchReply: true })
        switch (subcommand) {
            case "price":
                fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=' + process.env.TRADEAPIKEY).then(response => response.json()).then(data => {
                    interaction.editReply({embeds: [
                        new EmbedBuilder()
                            .setTitle('Bitcoin Price')
                            .setDescription('Current price of Bitcoin is $' + Math.round(data['Realtime Currency Exchange Rate']['5. Exchange Rate']))
                            .setColor(0x2b2d31)
                    ]})
                }).catch(err => {
                    console.error(err)
                    interaction.editReply('Error fetching data')
                })
                break;
            case "buy":
                user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=' + process.env.TRADEAPIKEY).then(response => response.json()).then(data => {
                    let price = Math.round(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
                    let amount = price * interaction.options.getInteger('percent') / 100
                    if (user.xp < amount) {
                        interaction.editReply({content: 'Insufficient balance', ephemeral: true})
                    } else {
                        mongoclient.db('RefBot').collection('users').updateOne({ id: interaction.user.id }, { $inc: { xp: -amount , bitcoin: amount / price } })
                        interaction.editReply({ embeds: [
                            new EmbedBuilder()
                                .setTitle('Bitcoin Purchase')
                                .setDescription('You have purchased ' + (amount / price) + ' Bitcoin')
                                .setColor(0x2b2d31)
                        ]})
                    }
                }).catch(err => {
                    console.error(err)
                    interaction.editReply('Error fetching data')
                })
                break;
            case "sell":
                user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                fetch('https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=' + process.env.TRADEAPIKEY).then(response => response.json()).then(data => {
                    let price = Math.round(data['Realtime Currency Exchange Rate']['5. Exchange Rate'])
                    let amount = interaction.options.getInteger('percent') / 100
                    if (user.bitcoin < amount) {
                        interaction.editReply({content: 'Insufficient balance', ephemeral: true})
                    } else {
                        mongoclient.db('RefBot').collection('users').updateOne({ id: interaction.user.id }, { $inc: { xp: amount * price , bitcoin: -amount } })
                        interaction.editReply({ embeds: [
                            new EmbedBuilder()
                                .setTitle('Bitcoin Sale')
                                .setDescription('You have sold ' + amount + ' Bitcoin')
                                .setColor(0x2b2d31)
                        ]})
                    }
                }).catch(err => {
                    console.error(err)
                    interaction.editReply('Error fetching data')
                })
        }
    }

}