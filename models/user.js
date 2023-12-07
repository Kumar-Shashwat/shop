const db = require('../util/database');

module.exports = class User{

    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    
    }

    save() {

        return db.execute('INSERT INTO user (name, email, password) VALUES ( ?, ?, ?)',
            [this.name, this.email, this.password] 
        );

        // this.id = Math.random().toString();
        // products.push(this);
    }

    static findByEmail(email){
        return db.execute('SELECT * FROM user where email = ?;',[email]);
    }

    static updateDetails( {id, name, email, password  }){
        return db.execute('UPDATE  user SET password = ? WHERE email = ?',[password, email]);
    }
    
};