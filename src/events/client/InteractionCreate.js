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
                
                break;
        }
    }
}