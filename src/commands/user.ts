import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
    name: "user",
    description: "user",
    dmPermission: true
})
@SlashGroup("user")
export class User {
    @Slash({
        description: "ping"
    })
    async ping(
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ content: "pong!" });
    }
}