const db = require('../util/database');

const Token = class {
    static insertToken(email, token, expirationTime){
        return db.execute('INSERT INTO token (email, token, expirationTime) VALUES (?, ?, ?)',
            [email, token, expirationTime]
        );
    }

    static findTokenDetias(token){
        return db.execute('SELECT * FROM token WHERE token = ?',[token]);
    }

    static removeToken(token){
        return db.execute('DELETE FROM token WHERE token = ?',[token]);
    }

    static findTokenByEmail(email){
        return db.execute('SELECT * FROM token WHERE email = ?', [email]);
    }

    static updateToken(email, token, expirationTime) {
        return db.execute('UPDATE token SET token = ?, expirationTime = ? where email = ?;', [token, expirationTime, email]);
    }
};

module.exports = Token;