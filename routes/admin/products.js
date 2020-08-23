const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const router = express.Router();
const {requireTitle , requirePrice} = require('./validators');
const productsNewTemplate = require('../../views/admin/products/new');
const {handleErrors} = require('./middlewares');
const upload = multer({storage:multer.memoryStorage()});
router.get('/admin/products',(req,res)=>{

});


router.get('/admin/products/new',(req,res)=>{
    return res.send(productsNewTemplate({}));
});


//middleware order from left to right. Body must be parsed before validation  (multer deals with text now , instead  of body-parser)

router.post('/admin/products/new',
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsNewTemplate),
    async (req,res)=>{

    const image = req.file.buffer.toString('base64');
    const {title,price} = req.body;
    await productsRepo.create({title,price,image});
    
    return res.send('submitted');
});



module.exports  = router;