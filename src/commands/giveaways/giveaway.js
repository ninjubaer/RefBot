const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { MongoClient } = require('mongodb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create a giveaway'),
    async execute(interaction) {
        interaction.reply({ content: 'not implemented yet', ephemeral: true });
    }
}


// database function for giveaways:
class giveawaydb {
    #collection; #mongoclient;
    constructor(mongoclient) {
        this.#mongoclient = mongoclient;
        this.#collection = this.#mongoclient.db("RefBot").collection("giveaways");
    }
    async createGiveaway(title, prize, duration, winners) {
        let out = await this.#collection.insertOne({
            title,
            prize,
            duration,
            winners,
            end: Date.now() + duration * 1000
        })
        this.giveaway = await this.#collection.findOne({ _id: out.insertedId });
        return this
    }
    async endGiveaway() {

    }
    async getGiveaway() {

    }
}

require("dotenv").config();
const mongoclient = new MongoClient(process.env.MONGODBTOKEN)
setTimeout(async () => {
    console.log('Connected to MongoDB');
}, 1000)
let myGiveaway = new giveawaydb(mongoclient);
myGiveaway.createGiveaway('test', 'test', 1, 1);


