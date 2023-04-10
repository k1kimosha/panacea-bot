import mysqlController from "../mysql.js";

class tgConnect {

    async getConnect(guildId?: string, code?: string) {
        const getConnect: { guildId?: string, code: string }[] | number = await mysqlController.execute("SELECT * FROM `tgConnects` WHERE guildId = ? OR code = ?", [guildId, code]);

        if (getConnect === 404)
            return { status: false, code: 404 };

        if (typeof getConnect != "number") {
            if (!getConnect.length)
                return { status: false, code: 0 };

            return { status: true, getConnect };
        }
    }

    async addConnect(code: string) {
        const addConnect: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `tgConnects` (code) VALUES (?)", [code]);

        if (addConnect === 404)
            return { status: false, code: 404 };

        if (typeof addConnect != "number") {
            if (!addConnect.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async setConnect(code: string, options: { guildId: string }) {
        const setConnect: { changedRows: number } | number = await mysqlController.execute("UPDATE `tgConnects` SET ? WHERE code = ?", [options, code]);

        if (setConnect === 404)
            return { status: false, code: 404 };

        if (typeof setConnect != "number") {
            if (!setConnect.changedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delConnect(guildId?: string, code?: string) {
        const delConnect: { affectedRows: number } | number = await mysqlController.execute("DELETE FROM `tgConnects` WHERE guildId = ? OR code = ?", [guildId, code]);

        if (delConnect === 404)
            return { status: false, code: 404 };

        if (typeof delConnect != "number") {
            if (!delConnect.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const tgConnectsModel = new tgConnect();
export default tgConnectsModel;