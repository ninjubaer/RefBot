const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("name")
        .addSubcommand(subcommand =>
            subcommand
                .setName("get")
                .setDescription("Get user's real name")
                .addUserOption(option =>
                    option
                    .setName("target")
                    .setDescription("The user's name you want to get")
                    .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("set")
                .setDescription("Set your real name")
                .addStringOption(option =>
                    option
                    .setName("name")
                    .setDescription("Your real name")
                    .setRequired(true)
                )
        )
        .setDescription("Get or set your real name"),
        async execute(interaction, client, mongoclient) {
            const db = await mongoclient.db('RefBot');
            const collection = await db.collection('users');
            let user
            switch (interaction.options._subcommand) {
                case "get":
                    const target = interaction.options.getUser("target");
                    user = await collection.findOne({ username: target.username });
                    if (!user) {
                        return interaction.reply({ content: "This user hasn't set their name yet", ephemeral: true });
                    }
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .addFields(
                                    { name: "Fornite", value: user.fortnite || "none" },
                                    { name: "Valorant", value: user.valorant || "none" },
                                    { name: "WarThunder", value: user.warthunder || "none" }
                                )
                                .setAuthor({ name: user.name || target.username, iconURL: target.displayAvatarURL() })
                                .setTimestamp()
                                .setFooter({
                                    text: "Requested by " + interaction.user.username,
                                    iconURL: interaction.user.displayAvatarURL()
                                })
                        ]
                    })
                case "set":
                    const name = interaction.options.getString("name");
                    user = await collection.findOne({ username: interaction.user.username });
                    if (!user) {
                        await collection.insertOne({
                            username: interaction.user.username,
                            fortnite: null,
                            valorant: null,
                            warthunder: null,
                            name: name
                        })
                    }
                    else {
                        await collection.updateOne({ username: interaction.user.username }, {
                            $set: {
                                name: name
                            }
                        })
                    }
                    return interaction.reply({ content: "Your name has been set!", ephemeral: true });
            }
        }
}