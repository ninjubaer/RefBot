const dbfunctions = require('../../db/index')
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client, mongoclient) {
        switch (interaction.isChatInputCommand()) {
            case true:
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return interaction.reply({
                    content: 'This command does not exist!',
                    ephemeral: true
                })

                try {
                    console.log(command.data.name);
                    await command.execute(interaction, client, mongoclient);
                }
                catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: 'There was an error while executing this command!',
                        ephemeral: true
                    });
                }

                break;
            case false:
                switch (interaction.customId.split(":")[0]) {
                    case "confirm-multi-buy":
                        const user = await dbfunctions.fetchUser(mongoclient, interaction.customId.split(":")[1])
                        const price = 5000 * user.boughtMulti
                        user.xp -= price
                        user.boughtMulti *= 1.1
                        await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.customId.split(":")[1] }, { $set: { xp: user.xp, boughtMulti: user.boughtMulti } });
                        await interaction.update({content: "Multiplier bought!", embeds: [], components: []})
                        break;
                    case "cancel-multi-buy":
                        await interaction.reply({
                            content: "Cancelled!",
                            components: []
                        })
                        break;
                    default:
                        break;
                }
                break;
        }
    }
}