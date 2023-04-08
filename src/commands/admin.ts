import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Locale } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { locales } from "../locales/locales.js";
import localesModel from "../models/locales.js";

@Discord()
@SlashGroup({
  name: "admin",
  description: "Admin commands",
  nameLocalizations: {
    "en-US": locales({ language: "en-US" })!.admin.commands.group.title,
  },
  descriptionLocalizations: {
    "en-US": locales({ language: "en-US" })!.admin.commands.group.description,
  },
  dmPermission: false,
  defaultMemberPermissions: ["Administrator"]
})
@SlashGroup("admin")
export class Admin {
  @Slash({
    name: "locales",
    description: "Change the preferred language",
    nameLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.locales.title,
    },
    descriptionLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.locales.description,
    }
  })
  async locales(
    @SlashChoice({ name: "English", value: "en-US" })
    @SlashOption({
      name: "locale",
      description: "locale",
      nameLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.locales.options.locale.name,
      },
      descriptionLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.locales.options.locale.description,
      },
      required: false,
      type: ApplicationCommandOptionType.String
    })
    locale: Locale.EnglishUS | undefined,
    interaction: CommandInteraction
  ) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "what!?" });
    } else {
      await interaction.deferReply({ ephemeral: true });

      const getLocale = await localesModel.getLocale(interaction.guildId);

      if (!getLocale?.status) {
        switch (getLocale?.code) {
          case 0:
            await localesModel.addLocale(interaction.guildId, "en-US");
            if (locale === undefined) {
              //Returns an information about the currently installed language on the server
              let embedInfo = new EmbedBuilder({
                title: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.info.title,
                description: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.info.description.replace("$lang", locales({ locale: interaction.locale, guildLocale: "en-US" })!.locale)
              }).setColor("Green");
              await interaction.editReply({ embeds: [embedInfo] });
            } else if ("en-US" == locale) {
              //Returns an error if the requested language is already installed on the server
              let embedErrorAI = new EmbedBuilder({
                title: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.errorAI.title,
                description: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.errorAI.description
              }).setColor("Red");
              await interaction.editReply({ embeds: [embedErrorAI] });
            } else {
              const setLocale = await localesModel.setLocale(interaction.guildId, { locale: locale });

              if (!setLocale?.status) {
                switch (setLocale?.code) {
                  case 0:
                    //Returns an error if the desired language is already set
                    let embedErrorFC = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.errorFC.title,
                      description: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.errorFC.description
                    }).setColor("Red");
                    await interaction.editReply({ embeds: [embedErrorFC] });
                    break;
                  case 1:
                    //Returns an error in case of a database crash
                    let embedErrorCS = new EmbedBuilder({
                      title: locales({ locale: locale, guildLocale: interaction.locale })!.admin.responses.locale.errorSC.title,
                      description: locales({ locale: locale, guildLocale: interaction.locale })!.admin.responses.locale.errorSC.description
                    }).setColor("#000");
                    await interaction.editReply({ embeds: [embedErrorCS] });
                    break;
                }
              } else {
                //Returns a message about the successful language change
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.success.title,
                  description: locales({ locale: interaction.locale, guildLocale: "en-US" })!.admin.responses.locale.success.description.replace("$lang", locales({ language: locale })!.locale)
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
              }
            }
            break;
          case 1:
            //Returns an error in case of a database crash
            let embedErrorCS = new EmbedBuilder({
              title: locales({ locale: locale, guildLocale: interaction.locale, language: "en-US" })!.admin.responses.locale.errorSC.title,
              description: locales({ locale: locale, guildLocale: interaction.locale, language: "en-US" })!.admin.responses.locale.errorSC.description
            }).setColor("#000000");
            await interaction.editReply({ embeds: [embedErrorCS] });
            break;
        }
      } else {
        if (locale === undefined) {
          //Returns an information about the currently installed language on the server
          let embedInfo = new EmbedBuilder({
            title: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.info.title,
            description: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.info.description.replace("$lang", locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.locale)
          }).setColor("Green");
          await interaction.editReply({ embeds: [embedInfo] });
        } else if (getLocale.getLocale![0].locale == locale) {
          //Returns an error if the requested language is already installed on the server
          let embedErrorAI = new EmbedBuilder({
            title: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.errorAI.title,
            description: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.errorAI.description
          }).setColor("Red");
          await interaction.editReply({ embeds: [embedErrorAI] });
        } else {
          const setLocale = await localesModel.setLocale(interaction.guildId, { locale: locale });

          if (!setLocale?.status) {
            switch (setLocale?.code) {
              case 0:
                //Returns an error if the desired language is already set
                let embedErrorFC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.errorFC.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.errorFC.description
                }).setColor("Red");
                await interaction.editReply({ embeds: [embedErrorFC] });
                break;
              case 1:
                //Returns an error in case of a database crash
                let embedErrorCS = new EmbedBuilder({
                  title: locales({ locale: locale, guildLocale: interaction.locale })!.admin.responses.locale.errorSC.title,
                  description: locales({ locale: locale, guildLocale: interaction.locale })!.admin.responses.locale.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorCS] });
                break;
            }
          } else {
            //Returns a message about the successful language change
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.success.title,
              description: locales({ locale: interaction.locale, guildLocale: getLocale.getLocale![0].locale })!.admin.responses.locale.success.description.replace("$lang", locales({ language: locale })!.locale)
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        }
      }
    }
  }
}
