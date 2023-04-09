import mysqlController from "../mysql.js";

class aLock {

    async getALock(uuid: string) {
        const getALock: { uuid: string, actions: number }[] | number = await mysqlController.execute("SELECT * FROM `alocks` WHERE uuid = ?", [uuid]);

        if (getALock === 404)
            return { status: false, code: 404 };

        if (typeof getALock != "number") {
            if (!getALock.length)
                return { status: false, code: 0 };

            return { status: true, getALock };
        }
    }

    async addALock(uuid: string) {
        const addALock: { affectedRows: number } | number = await mysqlController.execute("INSERT INTO `alocks` (uuid, actions) VALUES (?, 1)", [uuid]);

        if (addALock === 404)
            return { status: false, code: 404 };

        if (typeof addALock != "number") {
            if (!addALock.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async setALock(uuid: string, options: { actions: number }) {
        const setALock: { changedRows: number } | number = await mysqlController.execute("UPDATE `alocks` SET ? WHERE uuid = ?", [options, uuid]);

        if (setALock === 404)
            return { status: false, code: 404 };

        if (typeof setALock != "number") {
            if (!setALock.changedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

    async delALock(uuid: string) {
        const delALock: { affectedRows: number } | number = await mysqlController.execute("DELETE FROM `alocks` WHERE uuid = ?", [uuid]);

        if (delALock === 404)
            return { status: false, code: 404 };

        if (typeof delALock != "number") {
            if (!delALock.affectedRows)
                return { status: false, code: 0 };

            return { status: true };
        }
    }

}

const alocksModel = new aLock();
export default alocksModel;