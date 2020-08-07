const fs = require('fs');

class Users {
    constructor(filename){
        if(!filename){
            throw new Error("No filename provided");
        }
        this.filename = filename;

        try{
            fs.accessSync(filename);
        }catch(err){
            fs.writeFileSync(filename,'[]');
        }

    }
}

const users = new Users("users.json");
