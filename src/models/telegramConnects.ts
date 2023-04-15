import mysqlController from "../mysql.js";

class telegramConnects {

    async getConnect(guildId: string) {
        const getConnect: { guildId: string, code: string }[] | number = await mysqlController.execute("SELECT * FROM `telegramConnects` WHERE guildId = ?", [guildId]);

        if (getConnect === 404)
            return { status: false, code: 1 };

        if (typeof getConnect != "number") {
            if (!getConnect.length)
                return { status: false, code: 0 };

            return { status: true, getConnect };
        }
    }

    async addConnect(guildId: string, code: string) {
        const addConnect: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `telegramConnects` (guildId, code) VALUES (?, ?)", [guildId, code]);

        if (addConnect === 404)
            return { status: false, code: 1 };

        if (typeof addConnect != "number") {
            if (!addConnect.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async setConnect(guildId: string, options: { code: string }) {
        const setConnect: { changedRows: number } | number = await mysqlController.execute("UPDATE `telegramConnects` SET ? WHERE guildId = ?", [options, guildId]);

        if (setConnect === 404)
            return { status: false, code: 1 };

        if (typeof setConnect != "number") {
            if (!setConnect.changedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delConnect(guildId: string) {
        const delConnect: { affectedRows: number } | number = await mysqlController.execute("DELETE FROM `telegramConnects` WHERE guildId = ?", [guildId]);

        if (delConnect === 404)
            return { status: false, code: 1 };

        if (typeof delConnect != "number") {
            if (!delConnect.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const telegramConnectsModel = new telegramConnects();
export default telegramConnectsModel;