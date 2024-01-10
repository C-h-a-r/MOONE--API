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
    const [game] = await db.query("SELECT pot, players FROM game:$gameid", { gameid: gameid });
    let pot = game.pot;
    let bet = pot / game.players.length;

    await giveCredits(winnerid, pot, db);

    game.players.forEach(async playerid => {
        if(playerid == winnerid) return;

        await registerTransaction(playerid, winnerid, bet, "BET LOST");
    });
    
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

async function registerTransaction(from, to, amount, db, notes = null) {
    const transaction = await db.query(`
        CREATE transaction CONTENT {
            sender: $send,
            receiver: $recv,
            amount: $amount,
            additional_info: $notes,
            created_at: time::now(),
        }
    `, { send: from, recv: to, amount: amount, notes: notes });

    return transaction;
}

async function buyItem(userid, cost, name, db) {
    await takeCredits(userid, cost, db);

    const transaction = await registerTransaction(userid, null, cost, db, `BOUGHT ITEM: ${name}`);

    return transaction;
}

async function sellItem(userid, cost, name, db) {
    await giveCredits(userid, cost, db);

    const transaction = await registerTransaction(null, userid, cost, db, `SOLD ITEM: ${name}`);

    return transaction;
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
    registerTransaction,
    buyItem,
    sellItem,
};
