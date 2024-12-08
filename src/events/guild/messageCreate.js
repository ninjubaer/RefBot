module.exports = {
    name: 'messageCreate',
    async execute(message, client, mongoclient) {
        if (message.author.bot) return;
        const dbfunctions = require('../../db/index')
        const levelFunctions = require('../../utils/levels');
        const user = await dbfunctions.fetchUser(mongoclient, message.author.username);
        if (Date.now() - (user.lastxpmessage||0) < 60000) return;
        // 15-35 xp
        const xpForNextLevel = levelFunctions.xpForNextLevel(levelFunctions.getLevel(user.xp));
        user.xp += Math.floor(Math.random() * 21) + 15
        if (user.xp >= xpForNextLevel) {
            message.guild.channels.cache.find(channel => channel.name === 'level-ups').send(`Congratulations ${message.author}! You have leveled up to level ${levelFunctions.getLevel(user.xp)}!`);
        }
        await mongoclient.db("RefBot").collection("users").updateOne({ username: message.author.username }, { $set: { xp: user.xp, lastxpmessage: Date.now() } });
    }
}