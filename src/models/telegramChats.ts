import mysqlController from "../mysql.js";

class telegramChats {

    async getChat(id: number) {
        const getChat: { id: number, code: string }[] | number = await mysqlController.execute("SELECT * FROM `telegramChats` WHERE id = ?", [id]);

        if (getChat === 404)
            return { status: false, code: 1 };

        if (typeof getChat != "number") {
            if (!getChat.length)
                return { status: false, code: 0 };

            return { status: true, getChat };
        }
    }

    async addChat(id: number, code: string) {
        const addChat: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `telegramChats` (id, code) VALUES (?, ?)", [id, code]);

        if (addChat === 404)
            return { status: false, code: 1 };

        if (typeof addChat != "number") {
            if (!addChat.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delChat(id: number) {
        const delChat: { affectedRows: number } | number = await mysqlController.execute("DELETE FROM `telegramChats` WHERE id = ?", [id]);

        if (delChat === 404)
            return { status: false, code: 1 };

        if (typeof delChat != "number") {
            if (!delChat.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const telegramChatsModel = new telegramChats();
export default telegramChatsModel;