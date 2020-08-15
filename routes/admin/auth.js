const express = require('express');
const usersRepo = require('../../repositories/users');
const router = express.Router();


router.get("/signup",(req,res)=>{
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



router.post("/signup",async (req,res)=>{
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

router.get('/signout',(req,res)=>{
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin',(req,res)=>{
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

router.post("/signin",async (req,res)=>{
    const {email,password} = req.body;
    const user = await usersRepo.getOneBy({email});
    if(!user){
        return res.send("Email not found");
    }

    const validPassword = await usersRepo.comparePasswords(
        user.password,password
    );

    if(!validPassword){
        return res.send('Invalid Password');
    }

    req.session.userId = user.id;

    res.send("You are signed in");
});

module.exports = router;