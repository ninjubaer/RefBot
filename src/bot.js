require("dotenv").config();
const { Client, GatewayIntentBits, Collection, REST} = require("discord.js");

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
client.commands = new Collection();
client.commandArray = [];
client.rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
require('./events/index.js').init(client);


client.login(process.env.TOKEN);