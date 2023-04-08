import mysqlController from "../mysql.js";

class LocalesModel {

    async getLocale(guildId: string) {
        const getLocale: { guildId: string, locale: "en-US" }[] | number = await mysqlController.execute("SELECT * FROM `locales` WHERE guildId = ?", [guildId]);

        if (getLocale === 404)
            return { status: false, code: 1 };

        if (typeof getLocale != "number") {
            if (!getLocale.length)
                return { status: false, code: 0 };

            return { status: true, getLocale };
        }
    }

    async addLocale(guildId: string, locale: "en-US") {
        const addLocale: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `locales` (guildId, locale) VALUES (?, ?)", [guildId, locale]);

        if (addLocale === 404)
            return { status: false, code: 1 };

        if (typeof addLocale != "number") {
            if (!addLocale.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async setLocale(guildId: string, options: { locale: "en-US" }) {
        const setLocale: { changedRows: number } | number = await mysqlController.execute("UPDATE `locales` SET ? WHERE guildId = ?", [options, guildId]);

        if (setLocale === 404)
            return { status: false, code: 1 };

        if (typeof setLocale != "number") {
            if (!setLocale.changedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delLocale(guildId: string) {
        const delLocale: { affectedRows: string } | number = await mysqlController.execute("DELETE FROM `locales` WHERE guildId = ?", [guildId]);

        if (delLocale === 404)
            return { status: false, code: 1 };

        if (typeof delLocale != "number") {
            if (!delLocale.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const localesModel = new LocalesModel();
export default localesModel;