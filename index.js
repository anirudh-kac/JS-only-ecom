const express = require('express');

const app = express();


app.get("/",(req,res)=>{
    res.send(`
    <div>
    <form method = "POST">
    <input name="name" placeholder="name">
    <input name = "password" placeholder ="pass">
    <button type  = "submit">Submit</button>
    </form>
    </div>
    
    `);
});

const bodyParser = (req,res,next) => {
    if(req.method ==="POST"){
        reqData = {};
        req.on('data',data=>{
        const parsed = data.toString('utf8').split('&');
        for(let pair of parsed){
            const [key,value] = pair.split('=');
            reqData[key] = value
        }
        req.body = reqData;
        next();
    });
    }else{
        next();
    }
}

app.post("/",bodyParser,(req,res)=>{
    console.log(req.body);
    res.send("Account Created");
});

app.listen(3000,()=>{
    console.log("Listening");
});