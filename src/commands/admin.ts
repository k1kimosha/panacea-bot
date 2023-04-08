import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashGroup } from "discordx";

@Discord()
@SlashGroup({
  name: "admin",
  description: "admin",
  dmPermission: false,
  defaultMemberPermissions: ["Administrator"]
})
@SlashGroup("admin")
export class Admin {
  @Slash({
    description: "ping"
  })
  async ping(
    interaction: CommandInteraction
  ) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "what!?" });
    } else {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({ content: "pong!" });
    }
  }
}
