const express = require('express');

const {handleErrors }= require('./middlewares');

const usersRepo = require('../../repositories/users');
const router = express.Router();
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {requireEmail,requirePassword,requirePasswordConfirmation,requireEmailExists,requireValidPasswordForUser} = require('./validators')
router.get("/signup",(req,res)=>{
    res.send(signupTemplate({req}));
});



router.post("/signup",[
    requireEmail,
    requirePassword,
    requirePasswordConfirmation,
    handleErrors(signupTemplate)
],async (req,res)=>{
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        res.send(signupTemplate({req,errors}));
    }
    const {email,password} = req.body;

    const user  = await usersRepo.create({email,password});
    req.session.userId = user.id;
    
    res.redirect('/admin/products');
});

router.get('/signout',(req,res)=>{
    req.session = null;
    res.send('You are logged out');
});

router.get('/signin',(req,res)=>{
    res.send(signinTemplate({}));
});

router.post("/signin",
    [requireValidPasswordForUser,requireEmailExists],
    handleErrors(signinTemplate),
    async (req,res)=>{
    const {email} = req.body;
    const user = await usersRepo.getOneBy({email});
    req.session.userId = user.id;
    return res.redirect('/admin/products');
});

module.exports = router;