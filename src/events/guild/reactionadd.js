module.exports = {
    name: 'raw',
    once: false,
    async execute(data, _, client) {
        const { t: event, d: payload } = data;
        if (event === 'MESSAGE_REACTION_ADD') {
            const { channel_id, message_id, user_id, emoji } = payload;
            const channel = await client.channels.fetch(channel_id);
            const message = await channel.messages.fetch(message_id);
            // check if emoji is a regional indicator
            if (isRegionalIndicator(getEmojiCode(emoji.name))) {
                // remove reaction
                message.reactions.cache.get(emoji.name).users.remove(user_id);
            }
            
        }
    }
}
function getEmojiCode(emoji) {
    return Array.from(emoji).map(char => char.codePointAt(0).toString(16)).join('-');
}
function isRegionalIndicator(emojiCode) {
    const regionalIndicatorRange = /^1f1e[6-9a-f]|1f1f[0-9a-f]$/;
    return regionalIndicatorRange.test(emojiCode);
}