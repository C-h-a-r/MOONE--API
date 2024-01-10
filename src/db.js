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

async function registerNewUser(steamid, db) {
    const user = await db.query(`
        CREATE user CONTENT {
            steamid: $steamid,
            credits: 0,
            created_at: time::now(),
        }
    `, { steamid: steamid });

    return user;
}

async function deleteUser(userid, db) {
    await db.query("DELETE user:$userid", { userid: userid });
}

async function giveCredits(userid, amount, db) {
    await db.query("UPDATE user:$userid SET credits += $amount", { userid: userid, amount: amount });
}

async function takeCredits(userid, amount, db) {
    await db.query("UPDATE user:$userid SET credits -= $amount", { userid: userid, amount: amount });
}

async function registerGame(playerids, bet, type, db) {
    // TODO use transaction to make sure this doesnt cause people to lose credits. might be able to do this whole thing with one query.
    playerids.forEach(async userid => {
        await takeCredits(userid, bet, db);
    });

    let pot = bet * playerids.length;
    const game = await db.query(`
        CREATE game CONTENT {
            pot: $pot,
            type: $type,
            players: $playerids,
            created_at: time::now(),
        }
    `, { pot: pot, type: type, playerids: playerids });

    return game;
}

async function finishGame(gameid, winnerid, db) {
    const pot = await db.query("SELECT pot FROM game:$gameid", { gameid: gameid })[0].pot;

    await giveCredits(winnerid, pot, db);

    await db.query("DELETE game:$gameid", { gameid: gameid });
}

async function rollbackGames(db) { // probably only want to do this manually, maybe on each server restart idk
    console.log("GAME CREDIT ROLLBACK INITIATED");
    const games = await db.select("game");

    games.forEach(async game => {
        let bet = game.pot / game.players.length;

        game.players.forEach(async playerid => {
            await db.query("UPDATE $playerid SET credits += $bet", { playerid: playerid, bet: bet });
        });
    });

    // mass delete the table since we're done using all the games and dont want to dupe money. not sure if this breaks the `DEFINE TABLE` rules though
    await db.delete("game");
}

module.exports = {
    loadDB,
    registerNewUser,
    deleteUser,
    giveCredits,
    takeCredits,
    registerGame,
    finishGame,
    rollbackGames,
};
