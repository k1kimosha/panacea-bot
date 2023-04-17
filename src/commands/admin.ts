import { ApplicationCommandOptionType, ChannelType, CommandInteraction, EmbedBuilder, GuildMember, GuildTextBasedChannel, Locale } from "discord.js";
import { Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import alocksModel from "../models/alocks.js";
import localesModel from "../models/locales.js";
import telegramChatsModel from "../models/telegramChats.js";
import telegramConnectsModel from "../models/telegramConnects.js";
import sendMessagetoTelegram from "../tg/contoller.js";
import { locales } from "../locales/locales.js";
import { aLock } from "../main.js";
import auditChannelsModel from "../models/auditChannels.js";

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

      if (!getLocale!.status) {
        switch (getLocale!.code) {
          case 0:
            await localesModel.addLocale(interaction.guildId, "en-US");
            if (locale === undefined) {
              //Returns an information about the currently installed language on the server
              let embedInfo = new EmbedBuilder({
                title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.info.title,
                description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.info.description.replace("$lang", locales({ locale: interaction.locale, language: "en-US" })!.locale)
              }).setColor("Green");
              await interaction.editReply({ embeds: [embedInfo] });
            } else if ("en-US" == locale) {
              //Returns an error if the requested language is already installed on the server
              let embedErrorAI = new EmbedBuilder({
                title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.errorAI.title,
                description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.errorAI.description
              }).setColor("Red");
              await interaction.editReply({ embeds: [embedErrorAI] });
            } else {
              const setLocale = await localesModel.setLocale(interaction.guildId, { locale: locale });

              if (!setLocale!.status) {
                switch (setLocale!.code) {
                  case 0:
                    //Returns an error if the desired language is already set
                    let embedErrorFC = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.errorFC.title,
                      description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.errorFC.description
                    }).setColor("Red");
                    await interaction.editReply({ embeds: [embedErrorFC] });
                    break;
                  case 1:
                    //Returns an error in case of a database crash
                    let embedErrorSC = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, language: locale })!.admin.responses.locales.errorSC.title,
                      description: locales({ locale: interaction.locale, language: locale })!.admin.responses.locales.errorSC.description
                    }).setColor("#000");
                    await interaction.editReply({ embeds: [embedErrorSC] });
                    break;
                }
              } else {
                //Returns a message about the successful language change
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.success.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.locales.success.description.replace("$lang", locales({ language: locale })!.locale)
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
              }
            }
            break;
          case 1:
            //Returns an error in case of a database crash
            let embedErrorSC = new EmbedBuilder({
              title: locales({ locale: locale, language: "en-US" })!.admin.responses.locales.errorSC.title,
              description: locales({ locale: locale, language: "en-US" })!.admin.responses.locales.errorSC.description
            }).setColor("#000000");
            await interaction.editReply({ embeds: [embedErrorSC] });
            break;
        }
      } else {
        if (locale === undefined) {
          //Returns an information about the currently installed language on the server
          let embedInfo = new EmbedBuilder({
            title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.info.title,
            description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.info.description.replace("$lang", locales({ guildLocale: getLocale!.getLocale![0].locale })!.locale)
          }).setColor("Green");
          await interaction.editReply({ embeds: [embedInfo] });
        } else if (getLocale!.getLocale![0].locale == locale) {
          //Returns an error if the requested language is already installed on the server
          let embedErrorAI = new EmbedBuilder({
            title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorAI.title,
            description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorAI.description
          }).setColor("Red");
          await interaction.editReply({ embeds: [embedErrorAI] });
        } else {
          const setLocale = await localesModel.setLocale(interaction.guildId, { locale: locale });

          if (!setLocale!.status) {
            switch (setLocale!.code) {
              case 0:
                //Returns an error if the desired language is already set
                let embedErrorFC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorFC.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorFC.description
                }).setColor("Red");
                await interaction.editReply({ embeds: [embedErrorFC] });
                break;
              case 1:
                //Returns an error in case of a database crash
                let embedErrorSC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorSC.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorSC] });
                break;
            }
          } else {
            //Returns a message about the successful language change
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.success.title,
              description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.locales.success.description.replace("$lang", locales({ language: locale })!.locale)
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        }
      }
    }
  }

  @Slash({
    name: "clearalock",
    description: "Remove moderator restrictions",
    nameLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.clearalock.title
    },
    descriptionLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.clearalock.description
    }
  })
  async clearalock(
    @SlashOption({
      name: "moderator",
      description: "Moderator from whom restrictions must be removed",
      nameLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.clearalock.options.admin.name
      },
      descriptionLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.clearalock.options.admin.description
      },
      required: true,
      type: ApplicationCommandOptionType.User
    })
    admin: GuildMember,
    interaction: CommandInteraction
  ) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "what!?" });
    } else {
      await interaction.deferReply({ ephemeral: true });

      const getLocale = await localesModel.getLocale(interaction.guildId);

      if (!getLocale!.status) {
        //What to do if the server localization is not configured
        if (aLock[admin.id]) {
          delete aLock[admin.id];
          const delALcoks = await alocksModel.delALock(admin.id);

          if (!delALcoks!.status) {
            switch (delALcoks!.code) {
              case 0:
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.success.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.success.description
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
                break;
              case 1:
                let embedErrorSC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.errorSC.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorSC] });
                break;
            }
          } else {
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.success.title,
              description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.success.description
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        } else {
          let embedErrorHR = new EmbedBuilder({
            title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.errorHR.title,
            description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.clearalock.errorHR.description
          }).setColor("Red");
          await interaction.editReply({ embeds: [embedErrorHR] });
        }
      } else {
        //What to do if the server localization is configured
        if (aLock[admin.id]) {
          delete aLock[admin.id];
          const delALcoks = await alocksModel.delALock(admin.id);

          if (!delALcoks!.status) {
            switch (delALcoks!.code) {
              case 0:
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.success.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.success.description
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
                break;
              case 1:
                let embedErrorSC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.errorSC.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorSC] });
                break;
            }
          } else {
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.success.title,
              description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.success.description
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        } else {
          let embedErrorHR = new EmbedBuilder({
            title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.errorHR.title,
            description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.clearalock.errorHR.description
          }).setColor("Red");
          await interaction.editReply({ embeds: [embedErrorHR] });
        }
      }
    }
  }

  @Slash({
    name: "telegramconnect",
    description: "Connect telegram bot",
    nameLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.telegramconnect.title
    },
    descriptionLocalizations: {
      "en-US": locales({ language: "en-US" })!.admin.commands.telegramconnect.description
    }
  })
  async telegramconnect(
    @SlashOption({
      name: "code",
      description: "code",
      nameLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.telegramconnect.options.code.name
      },
      descriptionLocalizations: {
        "en-US": locales({ language: "en-US" })!.admin.commands.telegramconnect.options.code.description
      },
      required: true,
      type: ApplicationCommandOptionType.String
    })
    code: string,
    interaction: CommandInteraction
  ) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "what!?" });
    } else {
      await interaction.deferReply({ ephemeral: true });
      const getChat = await telegramChatsModel.getChat(parseInt(code.split(":")[0]));
      const getConnect = await telegramConnectsModel.getConnect(interaction.guildId);
      const getLocale = await localesModel.getLocale(interaction.guildId);

      if (!getLocale!.status) {
        //What to do if the server localization is not configured
        if (!getChat!.status) {
          //What to do if the chat is not exist
          switch (getChat!.code) {
            case 0:
              let embedErrorDE = new EmbedBuilder({
                title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorDE.title,
                description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorDE.description
              }).setColor("Red");
              await interaction.editReply({ embeds: [embedErrorDE] });
              break;
            case 1:
              let embedErrorSC = new EmbedBuilder({
                title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.title,
                description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.description
              }).setColor("#000");
              await interaction.editReply({ embeds: [embedErrorSC] });
              break;
          }
        } else {
          //What to do if the chat is exist
          if (!getConnect!.status && getConnect!.code == 0) {
            //If the connection does not already exist
            const addConnect = await telegramConnectsModel.addConnect(interaction.guildId, code);

            if (!addConnect!.status) {
              switch (addConnect!.code) {
                case 0:
                  let embedErrorCA = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorCA.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorCA.description
                  }).setColor("Red");
                  await interaction.editReply({ embeds: [embedErrorCA] });
                  break;
                case 1:
                  let embedErrorSC = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.description
                  }).setColor("#000");
                  await interaction.editReply({ embeds: [embedErrorSC] });
                  break;
              }
            } else {
              sendMessagetoTelegram(getChat!.getChat![0].id, locales({ locale: interaction.locale, language: "en-US" })!.admin.telegram.connectMessage.replace("$server", interaction.guild!.name))
                .then(async () => {
                  let embedSuccess = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.success.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.success.description
                  }).setColor("Green");
                  await interaction.editReply({ embeds: [embedSuccess] });
                })
                .catch(async (reason) => {
                  let embedErrorTE = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorTE.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorTE.description.replace("$reason", reason)
                  }).setColor("Orange");
                  await interaction.editReply({ embeds: [embedErrorTE] });
                })
            }
          } else if (!getConnect!.status && getConnect!.code == 1) {
            //Error on check
            let embedErrorSC = new EmbedBuilder({
              title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.title,
              description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.description
            }).setColor("#000");
            await interaction.editReply({ embeds: [embedErrorSC] });
          } else {
            //If the connection already exist
            const setConnect = await telegramConnectsModel.setConnect(interaction.guildId, { code });

            if (!setConnect!.status) {
              switch (setConnect!.code) {
                case 0:
                  let embedErrorCA = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorAE.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorAE.description
                  }).setColor("Red");
                  await interaction.editReply({ embeds: [embedErrorCA] });
                  break;
                case 1:
                  let embedErrorSC = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorSC.description
                  }).setColor("#000");
                  await interaction.editReply({ embeds: [embedErrorSC] });
                  break;
              }
            } else {
              sendMessagetoTelegram(getChat!.getChat![0].id, locales({ locale: interaction.locale, language: "en-US" })!.admin.telegram.connectMessage.replace("$server", interaction.guild!.name))
                .then(async () => {
                  let embedSuccess = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.success.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.success.description
                  }).setColor("Green");
                  await interaction.editReply({ embeds: [embedSuccess] });
                })
                .catch(async (reason) => {
                  let embedErrorTE = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorTE.title,
                    description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.telegramconnect.errorTE.description.replace("$reason", reason)
                  }).setColor("Orange");
                  await interaction.editReply({ embeds: [embedErrorTE] });
                })
            }
          }
        }
      } else {
        //What to do if the server localization is configured
        if (!getChat!.status) {
          //What to do if the chat is not exist
          switch (getChat!.code) {
            case 0:
              let embedErrorDE = new EmbedBuilder({
                title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorDE.title,
                description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorDE.description
              }).setColor("Red");
              await interaction.editReply({ embeds: [embedErrorDE] });
              break;
            case 1:
              let embedErrorSC = new EmbedBuilder({
                title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.title,
                description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.description
              }).setColor("#000");
              await interaction.editReply({ embeds: [embedErrorSC] });
              break;
          }
        } else {
          //What to do if the chat is exist
          if (!getConnect!.status && getConnect!.code == 0) {
            //If the connection does not already exist
            const addConnect = await telegramConnectsModel.addConnect(interaction.guildId, code);

            if (!addConnect!.status) {
              switch (addConnect!.code) {
                case 0:
                  let embedErrorCA = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorCA.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorCA.description
                  }).setColor("Red");
                  await interaction.editReply({ embeds: [embedErrorCA] });
                  break;
                case 1:
                  let embedErrorSC = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.description
                  }).setColor("#000");
                  await interaction.editReply({ embeds: [embedErrorSC] });
                  break;
              }
            } else {
              sendMessagetoTelegram(getChat!.getChat![0].id, locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.telegram.connectMessage.replace("$server", interaction.guild!.name))
                .then(async () => {
                  let embedSuccess = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.success.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.success.description
                  }).setColor("Green");
                  await interaction.editReply({ embeds: [embedSuccess] });
                })
                .catch(async (reason) => {
                  let embedErrorTE = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorTE.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorTE.description.replace("$reason", reason)
                  }).setColor("Orange");
                  await interaction.editReply({ embeds: [embedErrorTE] });
                })
            }
          } else if (!getConnect!.status && getConnect!.code == 1) {
            //Error on check
            let embedErrorSC = new EmbedBuilder({
              title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.title,
              description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.description
            }).setColor("#000");
            await interaction.editReply({ embeds: [embedErrorSC] });
          } else {
            //If the connection already exist
            const setConnect = await telegramConnectsModel.setConnect(interaction.guildId, { code });

            if (!setConnect!.status) {
              switch (setConnect!.code) {
                case 0:
                  let embedErrorCA = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorAE.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorAE.description
                  }).setColor("Red");
                  await interaction.editReply({ embeds: [embedErrorCA] });
                  break;
                case 1:
                  let embedErrorSC = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorSC.description
                  }).setColor("#000");
                  await interaction.editReply({ embeds: [embedErrorSC] });
                  break;
              }
            } else {
              sendMessagetoTelegram(getChat!.getChat![0].id, locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.telegram.connectMessage.replace("$server", interaction.guild!.name))
                .then(async () => {
                  let embedSuccess = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.success.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.success.description
                  }).setColor("Green");
                  await interaction.editReply({ embeds: [embedSuccess] });
                })
                .catch(async (reason) => {
                  let embedErrorTE = new EmbedBuilder({
                    title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorTE.title,
                    description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.telegramconnect.errorTE.description.replace("$reason", reason)
                  }).setColor("Orange");
                  await interaction.editReply({ embeds: [embedErrorTE] });
                })
            }
          }
        }
      }
    }
  }

  @Slash({
    name: "audit",
    description: "audit"
  })
  async audit(
    @SlashOption({
      name: "channel",
      description: "channel",
      required: true,
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText]
    })
    channel: GuildTextBasedChannel,
    interaction: CommandInteraction
  ) {
    if (!interaction.inGuild()) {
      await interaction.reply({ content: "what!?" })
    } else {
      await interaction.deferReply({ ephemeral: true });
      const getChannel = await auditChannelsModel.getChannel(interaction.guildId);
      const getLocale = await localesModel.getLocale(interaction.guildId);

      if (!getLocale!.status) {
        //What to do if the server localization is not configured
        if (!getChannel!.status) {
          //What to do if the channel is not exist
          switch (getChannel!.code) {
            case 0:
              const addChannel = await auditChannelsModel.addChannel(interaction.guildId, channel.id);
              if (!addChannel!.status) {
                switch (addChannel!.code) {
                  case 0:
                    let embedErrorCA = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorCA.title,
                      description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorCA.description
                    }).setColor("Red");
                    await interaction.editReply({ embeds: [embedErrorCA] });
                    break;
                  case 1:
                    let embedErrorSC = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.title,
                      description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.description
                    }).setColor("#000");
                    await interaction.editReply({ embeds: [embedErrorSC] });
                    break;
                }
              } else {
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.success.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.success.description.replace("$channel", channel.name)
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
              }
              break;
            case 1:
              let embedErrorSC = new EmbedBuilder({
                title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.title,
                description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.description
              }).setColor("#000");
              await interaction.editReply({ embeds: [embedErrorSC] });
              break;
          }
        } else {
          const setChannel = await auditChannelsModel.setChannel(interaction.guildId, { channelId: channel.id });

          if (!setChannel!.status) {
            switch (setChannel!.code) {
              case 0:
                let embedErrorAE = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorAE.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorAE.description
                }).setColor("Red");
                await interaction.editReply({ embeds: [embedErrorAE] });
                break;
              case 1:
                let embedErrorSC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.title,
                  description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorSC] });
                break;
            }
          } else {
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.success.title,
              description: locales({ locale: interaction.locale, language: "en-US" })!.admin.responses.audit.success.description.replace("$channel", channel.name)
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        }
      } else {
        //What to do if the server localization is configured
        if (!getChannel!.status) {
          //What to do if the channel is exist
          switch (getChannel!.code) {
            case 0:
              const addChannel = await auditChannelsModel.addChannel(interaction.guildId, channel.id);
              if (!addChannel!.status) {
                switch (addChannel!.code) {
                  case 0:
                    let embedErrorCA = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorCA.title,
                      description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorCA.description
                    }).setColor("Red");
                    await interaction.editReply({ embeds: [embedErrorCA] });
                    break;
                  case 1:
                    let embedErrorSC = new EmbedBuilder({
                      title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.title,
                      description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.description
                    }).setColor("#000");
                    await interaction.editReply({ embeds: [embedErrorSC] });
                    break;
                }
              } else {
                let embedSuccess = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.success.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.success.description.replace("$channel", channel.name)
                }).setColor("Green");
                await interaction.editReply({ embeds: [embedSuccess] });
              }
              break;
            case 1:
              let embedErrorSC = new EmbedBuilder({
                title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.title,
                description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.description
              }).setColor("#000");
              await interaction.editReply({ embeds: [embedErrorSC] });
              break;
          }
        } else {
          const setChannel = await auditChannelsModel.setChannel(interaction.guildId, { channelId: channel.id });

          if (!setChannel!.status) {
            switch (setChannel!.code) {
              case 0:
                let embedErrorAE = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorAE.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorAE.description
                }).setColor("Red");
                await interaction.editReply({ embeds: [embedErrorAE] });
                break;
              case 1:
                let embedErrorSC = new EmbedBuilder({
                  title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.title,
                  description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.errorSC.description
                }).setColor("#000");
                await interaction.editReply({ embeds: [embedErrorSC] });
                break;
            }
          } else {
            let embedSuccess = new EmbedBuilder({
              title: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.success.title,
              description: locales({ locale: interaction.locale, guildLocale: getLocale!.getLocale![0].locale })!.admin.responses.audit.success.description.replace("$channel", channel.name)
            }).setColor("Green");
            await interaction.editReply({ embeds: [embedSuccess] });
          }
        }
      }
    }
  }
}