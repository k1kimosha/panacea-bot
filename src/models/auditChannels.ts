import mysqlController from "../mysql.js";

class auditChannels {

    async getChannel(guildId: string) {
        const getChannel: { guildId: string, channelId: string }[] | number = await mysqlController.execute("SELECT * FROM `auditChannels` WHERE guildId = ?", [guildId]);

        if (getChannel === 404)
            return { status: false, code: 1 };

        if (typeof getChannel != "number") {
            if (!getChannel.length)
                return { status: false, code: 0 };

            return { status: true, getChannel };
        }
    }

    async addChannel(guildId: string, channelId: string) {
        const addChannel: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `auditChannel` (guildId, channelId) VALUES (?, ?)", [guildId, channelId]);

        if (addChannel === 404)
            return { status: false, code: 1 };

        if (typeof addChannel != "number") {
            if (!addChannel.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async setChannel(guildId: string, options: { channelId: string }) {
        const setChannel: { changedRows: number } | number = await mysqlController.execute("UPDATE `auditChannels` SET ? WHERE guildId = ?", [options, guildId]);

        if (setChannel === 404)
            return { status: false, code: 1 };

        if (typeof setChannel != "number") {
            if (!setChannel.changedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delChannel(guildId: string) {
        const delChannel: { affectedRows: number } | number = await mysqlController.execute("DELETE FROM `auditChannels` WHERE guildId = ?", [guildId]);

        if (delChannel === 404)
            return { status: false, code: 1 };

        if (typeof delChannel != "number") {
            if (!delChannel.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const auditChannelsModel = new auditChannels();
export default auditChannelsModel;