require("dotenv").config();
const { Client, GatewayIntentBits, Collection, REST} = require("discord.js");
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates
    ]
})
const mongoclient = new MongoClient(process.env.MONGODBTOKEN, {
    serverApi: {
        version: ServerApiVersion.v1
    }
})
client.commands = new Collection();
client.commandArray = [];
client.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
require('./events/index.js').init(client, mongoclient);

levelFunctions = require('./utils/levels.js');

client.login(process.env.TOKEN);
mongoclient.connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
})

const roulette = require('./utils/roulette.js');

setInterval(() => {
    if (!client.isReady()) return;
    new roulette.RouletteGame(client, mongoclient);
}, require('../config.json').roulette.interval * 1000);
