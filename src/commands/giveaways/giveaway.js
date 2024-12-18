const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { ObjectId, MongoClient } = require('mongodb');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create a giveaway')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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
        this._id = out.insertedId;
        console.log(out);
        this.giveaway = await this.#collection.findOne({ _id: out.insertedId });
        return this
    }
    async endGiveaway() {

    }
    static async getGiveaway(mongoclient, _id) {
        let collection = await mongoclient.db("RefBot").collection("giveaways");
        let giveaway = new giveawaydb(mongoclient);
        giveaway.giveaway = await collection.findOne({ _id: new ObjectId(_id) });
        giveaway._id = _id;
        return giveaway;  
    }
}

require("dotenv").config();
const mongoclient = new MongoClient(process.env.MONGODBTOKEN)
mongoclient.connect().then(() => {
    console.log('Connected to MongoDB');
} ).catch((error) => {
    console.error(error);
})
let myGiveaway = new giveawaydb(mongoclient);
giveawaydb.getGiveaway(mongoclient, '676272627a1eb1fd82e00284').then((giveaway) => {
    console.log(giveaway.giveaway);
})
/* myGiveaway.createGiveaway('test', 'test', 1, 1).then(() => {
    console.log(myGiveaway._id.toString())
}) */

