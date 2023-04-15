import { Composer } from "telegraf";
import { hash } from "../hash.js";
import telegramChatsModel from "../models/telegramChats.js";

export const command = Composer.command("connect", async (ctx) => {
    let code = `${ctx.chat.id}:${hash(`${ctx.chat.id}:${ctx.chat.id}`)}`;
    const getChat = await telegramChatsModel.getChat(ctx.chat.id);

    if (!getChat?.status && getChat?.code == 1)
        ctx.reply("Sorry we had the problem");
    else if (!getChat?.status) {
        const addChat = await telegramChatsModel.addChat(ctx.chat.id, code);

        if (!addChat?.status && addChat?.code === 1)
            ctx.reply("Sorry we had the problem");
        else if (!addChat?.status)
            ctx.reply("Something error");
        else ctx.reply(`Use this in discord ${code}`);
    } else ctx.reply(`Use this in discord ${code}`);
})