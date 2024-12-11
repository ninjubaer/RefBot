const roulette = require('../../config.json').roulette;
class RouletteGame {
    #client; #mongoclient; #messageid;
    constructor(client, mongoclient) {
        this.#client = client;
        this.#mongoclient = mongoclient;
        this.#startGame();
        setTimeout(() => {
            console.log("No more bets!");
            this.#spinWheel();
        }, roulette.wait * 1000);
    }

    async #startGame() {
        let channel = this.#client.guilds.cache.get(roulette.guild).channels.cache.get(roulette.channelId);
        let embed = { ...roulette.embed };
        embed.title = "Roulette";
        embed.description = "Place your bets!";
        embed.fields = [{ name: "Bets", value: roulette.bet_list.join("\n") }];
        const message = await channel.send({ embeds: [embed], components: roulette.components });
        // bet object: { type: "straightup", amount: 100, value: 5, user: "1234567890" }
        this.#messageid = message.id;
        await this.#clearRouletteCollection();
            await this.#mongoclient.db("RefBot").collection("roulette").insertOne({ message: message.id, bets: [], timestamp: Date.now() });
    }
    async #clearRouletteCollection() {
        await this.#mongoclient.db("RefBot").collection("roulette").deleteMany({});
    }

    /**
     * @returns {number} the winning number:
     * 2: green
     * 1: black
     * 0: red
     */
    #isEven = (num) => num = 0 ? 2 : +!(num&1);
    async #spinWheel() {
        this.winningNumber = Math.floor(Math.random() * 37);
        this.winningColor = this.#isEven(this.winningNumber);
        const winners = [];
        let bets = await this.#mongoclient.db("RefBot").collection("roulette").findOne({ message: this.#messageid });
        for (const bet of bets.bets) {
            if (bet.type === "straightup" ) {
                if (bet.value === this.winningNumber) {
                    this.#mongoclient.db("RefBot").collection("users").updateOne({ id: bet.user }, { $inc: { xp: bet.amount + bet.amount * roulette.payouts.straightup } });
                    winners.push(`<@${bet.user}> won ${bet.amount + bet.amount * roulette.payouts.straightup}!`);
                }
            }
            if (bet.type === 'color') {
                if (bet.value === this.winningColor) {
                    this.#mongoclient.db("RefBot").collection("users").updateOne({ id: bet.user }, { $inc: { xp: bet.amount + bet.amount * roulette.payouts.color } });
                    winners.push(`<@${bet.user}> won ${bet.amount + bet.amount * roulette.payouts.color}!`);
                }
            }
            if (bet.type === 'highlow') {
                if (bet.value == 1 && this.winningNumber > 18 || bet.value == 0 && this.winningNumber < 19) {
                    this.#mongoclient.db("RefBot").collection("users").updateOne({ id: bet.user }, { $inc: { xp: bet.amount + bet.amount * roulette.payouts.highlow } });
                    winners.push(`<@${bet.user}> won ${bet.amount + bet.amount * roulette.payouts.highlow}!`);
                }
            }
        }
        
        let channel = await this.#client.guilds.cache.get(roulette.guild).channels.cache.get(roulette.channelId);
        let embed = { ...roulette.embed };
        embed.title = "Roulette Results";
        embed.description = `Faith has been decided! The winning number is ${this.winningNumber} (${this.winningColor === 2 ? 'green' : this.winningColor === 1 ? 'black' : 'red'})`;
        if (winners.length) {
            embed.fields = [{ name: "Winners", value: winners.join("\n") }];
        }
        channel.send({ embeds: [embed]})
    }
}

module.exports = { RouletteGame }