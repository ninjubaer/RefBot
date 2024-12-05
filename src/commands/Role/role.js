const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Add a role to a user')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('The user to add the role to')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to add')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Remove a role from a user')
                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('The user to remove the role from')
                        .setRequired(true)
                )
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to remove')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a role')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the role')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName('color')
                        .setDescription('The color of the role')
                        .setRequired(true)
                )
                .addBooleanOption(option =>
                    option
                        .setName('hoist')
                        .setDescription('Whether the role should be hoisted')
                )
                .addBooleanOption(option =>
                    option
                        .setName('mentionable')
                        .setDescription('Whether the role should be mentionable')
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a role')
                .addRoleOption(option =>
                    option
                        .setName('role')
                        .setDescription('The role to delete')
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles),
        async execute(interaction) {
            const subcommand = interaction.options._subcommand;
            let command;
            console.log(subcommand);
            for (const file of fs.readdirSync('./src/commands/Role/rolesubcommands')) {
                if (file.startsWith(subcommand)) {
                    command = require(`./rolesubcommands/${file}`);
                    break;
                }
            }
            if (!command) {
                console.log('Invalid subcommand');
                return await interaction.reply({ content: 'Invalid subcommand', ephemeral: true });
            }
            return await command.execute(interaction);
        }

}