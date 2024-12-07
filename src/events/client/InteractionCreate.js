module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        switch (interaction.isChatInputCommand()) {
            case true:
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return interaction.reply({
                    content: 'This command does not exist!',
                    ephemeral: true
                })

                try {
                    await command.execute(interaction);
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