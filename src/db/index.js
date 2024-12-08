module.exports = {
    async fetchUser(mongoclient, username) {
        const user = await mongoclient.db("RefBot").collection("users").findOne({ username: username });
        if (!user) {
            await this.createUser(mongoclient, username);
            return await this.fetchUser(mongoclient, username);
        }
        return user;
    },
    async getLevel(mongoclient, username) {
        const xp = await this.fetchUser(mongoclient, username).xp || 0;

    },
    async createUser(mongoclient, username) {
        await mongoclient.db("RefBot").collection("users").insertOne({ username: username, xp: 0, fortnite: '', warthunder: '', valorant: '', name: '', lastxpmessage: 0});
    }
}