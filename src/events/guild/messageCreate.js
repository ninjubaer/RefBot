const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const triggers = require('../../assets/triggers.json');
module.exports = {
    name: 'messageCreate',
    async execute(message, client, mongoclient) {
        if (message.author.bot) return;
        if (Object.keys(triggers).includes(message.content.toLowerCase())) {
            message.channel.send(triggers[message.content.toLowerCase()]);
        }
        const dbfunctions = require('../../db/index')
        const levelFunctions = require('../../utils/levels');
        const user = await dbfunctions.fetchUser(mongoclient, message.author.id);
        if (message.channel.id === '1315742548400148560') {
            await message.react('👍');
            await message.react('👎');
        }
        if (Date.now() - (user.lastxpmessage||0) < 60000) return;
        // 15-35 xp
        const xpForNextLevel = levelFunctions.xpForNextLevel(levelFunctions.getLevel(user.xp));
        let xpBoost = 1;
        // if server booster, 1.2x xp
        if (message.guild.premiumSubscriptionCount > 0) {
            xpBoost *= 1.2;
        }
        // if any xp boosts are active for the user, apply them
        if (user.boosts) {
            for (const boost of user.boosts) {
                if (boost.end > Date.now()) {
                    xpBoost *= boost.multiplier;
                }
                else {
                    await mongoclient.db("RefBot").collection("users").updateOne({ id: message.author.id }, { $pull: { boosts: boost } });
                }
            }
        }
        user.xp += (Math.floor(Math.random() * 21) + 15) * xpBoost;
        user.xp = Math.floor(user.xp);
        const roleRewards = await mongoclient.db("RefBot").collection("roles").find({}).toArray();
        let roleObj;
        if (roleObj = roleRewards.find(role => role.requirements <= levelFunctions.getLevel(user.xp) && ((role.limit > role.given) || role.limit == 0))) {
            let levelRole;
            if (roleObj.id) {
                levelRole = message.guild.roles.cache.get(roleObj.id);
            }
            else {
                // create role
                levelRole = await message.guild.roles.create({
                    name: `${roleObj.name}`,
                    color: 0,
                    permissions: [],
                    mentionable: false
                });
                await mongoclient.db("RefBot").collection("roles").updateOne({ _id: roleObj._id }, { $set: { id: levelRole.id } });
            }
            const member = message.guild.members.cache.get(message.author.id);
            if (member && levelRole) {
                await member.roles.add(levelRole);
                await mongoclient.db("RefBot").collection("roles").updateOne({ _id: roleObj._id }, { $set: { given: roleObj.given + 1 } });
            }
        }
        if (user.xp >= xpForNextLevel) {
            message.guild.channels.cache.find(channel => channel.name === 'level-ups').send(`Congratulations ${message.author}! You have leveled up to level ${levelFunctions.getLevel(user.xp)}!`);
        }
        await mongoclient.db("RefBot").collection("users").updateOne({ id: message.author.id }, { $set: { xp: user.xp, lastxpmessage: Date.now() } });
    }
}