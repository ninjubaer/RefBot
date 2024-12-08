const { ActivityType } = require('discord.js');
module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setActivity({ name: 'supporting a dictatorship', type: ActivityType.Custom });
        require('../../commands/index.js').init(client);
    }
}