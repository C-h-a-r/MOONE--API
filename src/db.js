const { Surreal } = require("surrealdb.node");

const DB_URL = "wss://moone.fly.dev/";

async function loadDB(dbname, user, pass) {
    const db = new Surreal();

    await db.connect(DB_URL);

    await db.signin({
        username: user,
        password: pass,
    });

    await db.use({ namespace: dbname, database: dbname });

    return db;
}

module.exports = { loadDB };