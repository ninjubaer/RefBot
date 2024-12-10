const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const dbfunctions = require('../../db/index');
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
                    case "shopbutton":
                        switch (interaction.customId.split(":")[1]) {
                            case "1":
                                let user = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                                let price = 20000
                                if (user.xp < price) return interaction.reply({content: `You need ${price} xp to buy this!`, ephemeral: true});
                                const modal = new ModalBuilder()
                                    .setTitle('Role Info')
                                    .setCustomId('roleinfomodal:' + price)
                                    .setComponents(
                                        new ActionRowBuilder().addComponents(
                                            new TextInputBuilder()
                                                .setPlaceholder('Role Name')
                                                .setCustomId('rolename')
                                                .setStyle(TextInputStyle.Short)
                                                .setLabel('Role Name')
                                        ),
                                        new ActionRowBuilder().addComponents(
                                            new TextInputBuilder()
                                                .setPlaceholder('#ffffff')
                                                .setCustomId('rolecolor')
                                                .setStyle(TextInputStyle.Short)
                                                .setLabel('Role Color')
                                        )
                                    )
                                    await interaction.showModal(modal)
                                break;
                            case "2":
                                let user2 = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                                let price2 = 100
                                if (user2.xp < price2) return interaction.reply({content: `You need ${price2} xp to buy this!`, ephemeral: true});
                                user2.xp -= price2
                                // extend the boost if existing
                                if (user2.boosts.find(boost => boost.multiplier == 2)) {
                                    const boost = user2.boosts.find(boost => boost.multiplier == 2)
                                    boost.end = boost.end + 300000
                                    await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { xp: user2.xp, boosts: user2.boosts } });
                                    return interaction.reply({content: "Boost extended!", ephemeral: true})
                                }
                                user2.boosts.push({multiplier: 2, end: Date.now() + 300000})
                                await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { xp: user2.xp, boosts: user2.boosts } });
                                await interaction.reply({content: "Boost bought!", ephemeral: true})
                                break;
                        }
                        break;
                    case "roleinfomodal":
                        await interaction.deferReply({ephemeral: true, fetchReply: true})
                        const mongouser = await dbfunctions.fetchUser(mongoclient, interaction.user.id)
                        const itemprice = parseInt(interaction.customId.split(":")[1])
                        console.log(interaction)
                        const rolename = interaction.components[0].components[0].value
                        const rolecolor = interaction.components[1].components[0].value
                        let regarr = rolecolor.match(/^(0x|#)?([0-9A-F]{6})$/i)
                        console.log(regarr)
                        if (!regarr) return interaction.editReply({content: "Invalid color!"});
                        if (interaction.guild.roles.cache.find(role => role.name === rolename)) return interaction.editReply({content: "Role already exists!"});
                        if (mongouser.xp < itemprice) return interaction.editReply({content: `You need ${itemprice} xp to buy this!`});
                        mongouser.xp -= itemprice
                        await mongoclient.db("RefBot").collection("users").updateOne({ id: interaction.user.id }, { $set: { xp: mongouser.xp } });
                        const role = await interaction.guild.roles.create({
                            name: rolename,
                            color: +('0x' + regarr[2]),
                            permissions: [],
                            mentionable: false
                        })
                        interaction.member.roles.add(role);
                        await interaction.editReply({content: "Role bought!", ephemeral: true})

                        break;
                    default:
                        break;
                }
                break;
        }
    }
}