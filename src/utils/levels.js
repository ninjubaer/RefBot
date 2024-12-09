module.exports = {
    getLevel(xp) {
        let level = 0;
        while (xp >= this.xpForNextLevel(level)) {
            level++;
        }
        return level;
    },
    xpForNextLevel(level) {
        return 50*level**2 + 25 * level;
    },
    async getRank(xp, mongoclient) {
        const users = mongoclient.db("RefBot").collection("users");
        return await users.countDocuments({ xp: { $gt: xp } });
    },
    async getLeaderboard(mongoclient) {
        const users = mongoclient.db("RefBot").collection("users");
        return await users.find().sort({ xp: -1 }).limit(10).toArray();
    }
}
