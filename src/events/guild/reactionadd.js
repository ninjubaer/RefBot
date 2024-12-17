module.exports = {
    name: 'RAW',
    once: false,
    async execute(client, data) {
        const { t: event, d: payload } = data;
        if (event === 'MESSAGE_REACTION_ADD') {
            const { channel_id, message_id, user_id, emoji } = payload;
            const channel = await client.channels.fetch(channel_id);
            const message = await channel.messages.fetch(message_id);
            const user = await client.users.fetch(user_id);
            const member = await message.guild.members.fetch(user_id);
            client.emit('reactionAdd', message, member, emoji);
        }
    }
}