const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'add',
    async execute(interaction) {
        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        const member = await interaction.guild.members.fetch(target.id);
        if (member.roles.cache.has(role.id)) {
            return await interaction.reply({ content: 'This user already has this role', ephemeral: true });
        }
        try { await member.roles.add(role); }
        catch { return await interaction.reply({ content: 'I do not have permission to add this role', ephemeral: true }); }
        return await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: target.username,
                        iconURL: target.displayAvatarURL()
                    })
                    .setDescription(`+\`\`${role.name}\`\``)
            ]
        })
    }
}