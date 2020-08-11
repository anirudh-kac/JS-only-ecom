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

    async getOne(id){
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filterRecords = records.filter(record=> record.id!=id);
        this.writeAll(filterRecords);
    }

    async update(id ,attrs){
        const records = await this.getAll();
        const record = records.find(record => record.id=== id);
        
        if(!record){
            throw new Error("No entry with given record");
        }

        Object.assign(record,attrs); // copies entries from attrs and assigns to record
        await this.writeAll(records);
    }

    async getOneBy(filters){
        const records = await this.getAll();
        for (let record of records){
            let found = true;

            for (let key in filters){
                if(record[key]!==filters[key]){
                    found = false;
                }
            }

            if(found){
                return record;
            }
        }
    }
}

const test = async () =>{
    const repo = new UsersRepository("users.json");
    const user  = await repo.getOneBy({id:"1ab9c4f0"});
    console.log(user);
    //await repo.create({email : "test@test.com" , password : 'password'});
    //console.log(await repo.getAll());
};

test();
