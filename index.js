const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
    keys:["yichurandom123cookiekhatre"]
}))

// const bodyParser = (req,res,next) => {
//     if(req.method ==="POST"){
//         reqData = {};
//         req.on('data',data=>{
//         const parsed = data.toString('utf8').split('&');
//         for(let pair of parsed){
//             const [key,value] = pair.split('=');
//             reqData[key] = value
//         }
//         req.body = reqData;
//         next();
//     });
//     }else{
//         next();
//     }
// }


// app.use(bodyParser);


app.get("/signup",(req,res)=>{
    res.send(`
    <div>
    Your id is ${req.session.userId}
    <form method = "POST">
    <input name="email" placeholder="email">
    <input name = "password" placeholder ="pass">
    <input name = "passwordConfirmation" placeholder ="pass confirm">
    <button type  = "submit">Submit</button>
    </form>
    </div>
    
    `);
});



app.post("/signup",async (req,res)=>{
    //console.log(req.body);
    const {email,password,passwordConfirmation} = req.body;
    const existingUser = await usersRepo.getOneBy({email});
    if(existingUser){
        return res.send('Email in use');
    }

    if(password!==passwordConfirmation){
        return res.send("Passwords must match");
    }

    const user  = await usersRepo.create({email,password});

    //stores id of user in cookies
    req.session.userId = user.id;
    
    res.send("Account Created");
});

app.get('/signout',(req,res)=>{
    req.session = null;
    res.send('You are logged out');
});

app.get('/signin',(req,res)=>{
    res.send(`
    <div>
    <form method = "POST">
    <input name="email" placeholder="email">
    <input name = "password" placeholder ="pass">
    <button type  = "submit">Sign In</button>
    </form>
    </div>

    `);
});

app.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    const user = await usersRepo.getOneBy({email});
    if(!user){
        return res.send("Email not found");
    }

    if(user.password!==password){
        return res.send("Invalid Password");
    }

    req.session.userId = user.id;

    res.send("You are signed in");
});
app.listen(3000,()=>{
    console.log("Listening");
});