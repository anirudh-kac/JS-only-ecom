const express = require('express');
const multer = require('multer');

const productsRepo = require('../../repositories/products');
const router = express.Router();
const {requireTitle , requirePrice} = require('./validators');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');

const {handleErrors,requireAuth} = require('./middlewares');
const upload = multer({storage:multer.memoryStorage()});
router.get('/admin/products',requireAuth ,async (req,res)=>{

    const products = await productsRepo.getAll();
    return res.send(productsIndexTemplate({products}));

});


router.get('/admin/products/new',requireAuth,(req,res)=>{
    return res.send(productsNewTemplate({}));
});


//middleware order from left to right. Body must be parsed before validation  (multer deals with text now , instead  of body-parser)

router.post('/admin/products/new',
    requireAuth,
    upload.single('image'),
    [requireTitle,requirePrice],
    handleErrors(productsNewTemplate),
    async (req,res)=>{

    const image = req.file.buffer.toString('base64');
    const {title,price} = req.body;
    await productsRepo.create({title,price,image});

    res.redirect('/admin/products');
});



module.exports  = router;