const fs = require('fs');
const crypto = require('crypto');

class UsersRepository {
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

    async getAll(){
        return JSON.parse(await fs.promises.readFile(this.filename,{
            encoding:'utf-8'
        }));
 
    }

    async create(attrs){
        attrs.id = this.randomID();
        const records = await this.getAll();
        records.push(attrs);
        this.writeAll(records);
    }

    async writeAll(records){
        await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2));
    }

    randomID(){
        return crypto.randomBytes(4).toString('hex');
    }
}

const test = async () =>{
    const repo = new UsersRepository("users.json");

    await repo.create({email : "test@test.com" , password : 'password'});
    console.log(await repo.getAll());
};

test();
