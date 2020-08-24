const express = require('express');
const cartsRepo  = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require("../views/carts/show");
const router = express.Router();

router.post('/cart/products',async(req,res)=>{
    //console.log(req.body.productId);

    let cart
    //check if cart exists
    if(!req.session.cartId){
        cart = await cartsRepo.create({items: []});
        req.session.cartId = cart.id;

    }else{
        //cart already exists
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    const existingItem = cart.items.find(item => item.id === req.body.productId);

    if(existingItem){
        //increment id
        existingItem.quantity++;
    }else{
        //create new
        cart.items.push({id:req.body.productId,quantity:1});
    }

    //update cart

    await cartsRepo.update(cart.id,{
        items:cart.items
    });

    res.send("Prod added");
})

router.get('/cart',async (req,res)=>{
    if(!req.session.cartId){
        return res.redirect('/');
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for(let item of cart.items){
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }

    res.send(cartShowTemplate({items:cart.items}));
});

module.exports = router;