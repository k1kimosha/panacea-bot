import { tgbot } from "../main.js";
import { hash } from "../hash.js";
import tgConnectsModel from "../models/tgconnects.js";

tgbot.start((ctx) => {
    ctx.reply("For start use /connect");
})

tgbot.command("connect", async (ctx) => {
    let code = `${ctx.chat.id}:${hash(`${ctx.chat.id}:${ctx.chat.id}`)}`;
    const getConnect = await tgConnectsModel.getConnect(code);

    if (!getConnect?.status) {
        switch (getConnect?.code) {
            case 0:
                await tgConnectsModel.addConnect(code);
                ctx.reply(`Connection process started enter the ${code} in discord.`);
                break;
            case 404:
                ctx.reply("error");
                break;
        }
    } else {
        ctx.reply(`For connect use ${code} in discord.`);
    }
})