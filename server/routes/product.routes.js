const { Product } = require("../database/models");
const express = require('express');
const { verifyToken } = require("../utils/token")

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        
        res.status(200).json({success: true, message: 'Products retrieved successfully', data: products});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error getting the products', data: error.message});
    }
})

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            res.status(400).json({success: false, message: 'Product id is not valid', data: {}});
        }

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({success: false, message: 'The product was not found', data: {}});
        }

        res.status(200).json({success: true, message: 'Product was found', data: product});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating the product', data: error.message});
    }
})

router.post('/', verifyToken, async (req, res) => {

    //verificare Role - creare permisa doar pentru ADMIN
    if (req.userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admins can create products',
            data: {}
        });
    }
    
    try {
        const product = await Product.create({
            ...req.body,
        })

        res.status(201).json({success: true, message: 'Product successfully created', data: product});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error creating the product', data: error.message})
    }
})

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            res.status(400).json({success: false, message: 'Product id is not valid', data: {}});
        }

        const product = await Product.findByPk(id);

        if (!product) {
             res.status(404).json({success: false, message: 'The product was not found', data: {}});
        }

        const updatedProduct = await product.update({
            ...req.body,
        })

        res.status(200).json({success: true, message: 'Product updated successfully', data: updatedProduct});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error updating the product', data: error.message});
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            res.status(400).json({success: false, message: 'Product id is not valid', data: {}});
        }

        const product = await Product.findByPk(id);

        if (!product) {
             res.status(404).json({success: false, message: 'The product was not found', data: {}});
        }

        await product.destroy();

        res.status(200).json({success: true, message: 'Product successfully deleted', data: {}});
    } catch (error) {
        res.status(500).json({success: false, message: 'Error deleting the product', data: error.message});
    }
})

module.exports = router;