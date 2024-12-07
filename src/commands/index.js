const { readdirSync } = require('fs');
const { Routes } = require('discord-api-types/v10')
module.exports = {
    async init(client) {
        for (const folder of readdirSync('./src/commands').filter(folder => !folder.endsWith('.js'))) {
            for (const file of readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'))) {
                const command = require(`./${folder}/${file}`);
                if (!command.data) continue;
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON())
            }
        }
        client.rest.put(Routes.applicationCommands(client.user.id), { body: client.commandArray })
    }
}