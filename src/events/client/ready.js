module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        require('../../commands/index.js').init(client);
    }
}