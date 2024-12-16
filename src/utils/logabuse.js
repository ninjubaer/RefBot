require("dotenv").config();
const { WebhookClient } = require('discord.js');

module.exports = {
    async logabuse(message) {
        const webhook = new WebhookClient({ url: process.env.LOGABUSEWH });
        return await webhook.send(message);
    }
}