const { readdirSync } = require('fs');
const { Events } = require('discord.js');

module.exports = {
    async init(client) {
        for (const folder of readdirSync('./src/events').filter(folder => !folder.endsWith('.js'))) {
            for (const file of readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'))) {
                const event = require(`./${folder}/${file}`);
                client.on(event.name, event.execute);
            }
        }
    }
}