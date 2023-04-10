import { dirname, importx } from "@discordx/importer";
import type { Interaction, Message } from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import { Telegraf } from "telegraf";

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent
  ],

  silent: false,

  simpleCommand: {
    prefix: "!",
  },
});

if (!process.env.BOT_TOKEN_TELEGRAF)
  throw Error("Could not find BOT_TOKEN_TELEGRAF in your environment");

export const tgbot = new Telegraf(process.env.BOT_TOKEN_TELEGRAF);
tgbot.launch();

bot.once("ready", async () => {
  await bot.guilds.fetch();

  await bot.initApplicationCommands();

  console.log("Bot started");
});

bot.on("interactionCreate", (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on("messageCreate", (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN_DISCORD)
    throw Error("Could not find BOT_TOKEN_DISCORD in your environment");

  await bot.login(process.env.BOT_TOKEN_DISCORD);
}

export var aLock: { [uuid: string]: number };

run();
