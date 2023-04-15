import { tgbot } from "../main.js";


async function sendMessagetoTelegram(chat: number, message: string) {
    tgbot.telegram.sendMessage(chat, message)
        .then(() => { return 0 })
        .catch((reason) => { return reason });
}
export default sendMessagetoTelegram;