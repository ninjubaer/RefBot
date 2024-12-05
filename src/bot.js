require("dotenv").config();
const { Client, GatewayIntentBits, ActivityType, REST, Collection, EmbedBuilder, VoiceChannel, ChannelType } = require("discord.js");
const { Routes } = require("discord-api-types/v9");
const { MongoClient, ServerApiVersion } = require("mongodb");
//include chalk
const chalk = require("chalk");

const fs = require("fs");
const { mongo } = require("mongoose");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ]
});
const mongoclient = new MongoClient(process.env.MONGODBTOKEN, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

client.commands = new Collection();
client.commandArray = [];

const commandFolders = fs.readdirSync("./src/commands")

for (let folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
        console.log(chalk.green(`Loaded command ${command.data.name}`));
    }
}
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN); 
client.on("ready", ()=>{
    console.log(chalk.blue(chalk.bold("Bot is ready!")));
    client.user.setActivity('Your Feet 👀', { type: ActivityType.Watching });
    rest.put(Routes.applicationCommands(client.user.id), { body: client.commandArray });
})
client.on("interactionCreate", async interaction => {
    if (interaction.isChatInputCommand()) {
        console.log(interaction.commandName);
        const command = client.commands.get(interaction.commandName);
        if (!command) {
            interaction.reply({ content: "couldn't find the command " + interaction.commandName, ephemeral: true });
            return;
        }
        try {
            await command.execute(interaction, client, mongoclient);
        }
        catch (error) {
            console.error(error);
            interaction.reply({ content: "There was an error while executing this command", ephemeral: true });
        }
    }
    else {
        switch (interaction.customId) {
            case "linkaccount":
                const fnusername = interaction.components[0].components[0].value;
                const valorantusername = interaction.components[1].components[0].value;
                const wtusername = interaction.components[2].components[0].value;
                // save the usernames to the database
                const collection = await mongoclient.db('RefBot').collection('users')
                const user = await collection.find({ username: interaction.user.username }).toArray()
                if (user.length === 0) {
                    await collection.insertOne({
                        username: interaction.user.username,
                        fortnite: fnusername || null,
                        valorant: valorantusername || null,
                        warthunder: wtusername || null,
                        name: null
                    })
                }
                else {
                    await collection.updateOne({ username: interaction.user.username }, {
                        $set: {
                            fortnite: fnusername || null,
                            valorant: valorantusername || null,
                            warthunder: wtusername || null
                        }
                    })
                }
                interaction.reply({ ephemeral: true, embeds: [
                    new EmbedBuilder()
                        .setTitle("Success!")
                        .setDescription("Your accounts have been linked!")
                        .addFields(
                            { name: "Fortnite", value: fnusername || 'none'},
                            { name: "Valorant", value: valorantusername || 'none'},
                            { name: "WarThunder", value: wtusername || 'none'}
                        )
                ] });
                break;
        }
    }
})



client.login(process.env.TOKEN);
(async () => {
    try {
        console.log(chalk.yellow("Connecting to the database"));
        await mongoclient.connect();
        await mongoclient.db("admin").command({ ping: 1 });
        console.log("Connected to the database");
    }
    catch (e) {
        console.error(e);
    }
})();
