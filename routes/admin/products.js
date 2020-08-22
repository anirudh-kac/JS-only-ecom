const express = require('express');

const {validationResult} =  require('express-validator');
const productsRepo = require('../../repositories/products');
const router = express.Router();
const {requireTitle , requirePrice} = require('./validators');
const productsNewTemplate = require('../../views/admin/products/new');
router.get('/admin/products',(req,res)=>{

});


router.get('/admin/products/new',(req,res)=>{
    return res.send(productsNewTemplate({}));
});

router.post('/admin/products/new',[requireTitle,requirePrice],(req,res)=>{

    const errors = validationResult(req);
    console.log(errors);
    return res.send('submitted');
})



module.exports  = router;