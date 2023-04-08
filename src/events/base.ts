import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import localesModel from "../models/locales.js";

@Discord()
export class Base {
  @On()
  async messageDelete([message]: ArgsOf<"messageDelete">, client: Client) {
    console.log("Message Deleted", client.user?.username, message.content);
  }

  @On()
  async guildCreate([guild]: ArgsOf<"guildCreate">) {
    const getLocale = await localesModel.getLocale(guild.id);

    if (!getLocale?.status) {
      switch (getLocale?.code) {
        case 0:
          await localesModel.addLocale(guild.id, "en-US");
          break;
        case 1:
          console.error("Database locales error!!!");
          break;
      }
    }
  }
}
