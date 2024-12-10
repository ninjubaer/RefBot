module.exports = {
    async fetchUser(mongoclient, userid,) {
        const user = await mongoclient.db("RefBot").collection("users").findOne({ id: userid });
        if (!user) {
            await this.createUser(mongoclient, userid);
            return await this.fetchUser(mongoclient, userid);
        }
        return user;
    },
    async getLevel(mongoclient, username) {
        const xp = await this.fetchUser(mongoclient, username).xp || 0;

    },
    async createUser(mongoclient, userid) {
        await mongoclient.db("RefBot").collection("users").insertOne({ xp: 0, fortnite: '', warthunder: '', valorant: '', name: '', lastxpmessage: 0, id: userid, boosts: [], boughtMulti: 1 });
    }
}