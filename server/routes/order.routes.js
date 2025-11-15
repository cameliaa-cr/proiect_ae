const { Order, OrderProduct, Product, User } = require("../database/models");
const express = require("express");

const { verifyToken } = require("../utils/token")

const router = express.Router();


router.post("/", async (req, res) => {
    try {
        //creare body Order
        const order = await Order.create({ 
            userId: req.body.userId, 
            status: req.body.status || "CONFIRMED" 
        });

        //mapare lista de Product
        //primeste in JSON  {products : [{"id": ..., "quantity": ...}, {"id": ..., "quantity": ...}, ...]}
        if (req.body.products && Array.isArray(req.body.products)) {

            const orderProductsData = req.body.products.map(item => ({
                orderId: order.id,
                productId: item.id,
                quantity: item.quantity,
            }));

            //adaugare randuri de legatura OrderProduct
            await OrderProduct.bulkCreate(orderProductsData);
        }

        //fetch Order cu tot cu produsele legate de el
        const createdOrder = await Order.findByPk(order.id, {
            include: { model: Product }
        });

        
        res.status(201).json({
            success: true,
            message: "Order successfully created",
            data: createdOrder
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating the order",
            data: error.message
        });
    }
});


//GET Order by id
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Order id is not valid",
                data: {}
            });
        }

        const order = await Order.findByPk(id, {
            include: { model: Product }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                data: {}
            });
        }

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving order",
            data: error.message
        });
    }
});

//editare status
router.put("/:id/status", async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Order id is not valid",
                data: {}
            });
        }

        //verific tip status
        const options = ["CONFIRMED", "CANCELED", "DELIVERED"];
        if (!options.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be either of the options: ${options.join(", ")}`,
                data: {}
            });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                data: {}
            });
        }

        //update
        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            data: {
                id: order.id,
                userId: order.userId,
                status: order.status,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            data: error.message
        });
    }
});

//GET All (pentru user admin)
router.get("/", verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"]
                },
                {
                    model: Product,
                    attributes: ["name"],
                    through: { attributes: ["quantity"] }
                }
            ],
            order: [["created_at", "DESC"]]
        });

        //formatare date de afisat
        const formattedOrders = orders.map(order => ({
            id: order.id,
            status: order.status,
            created_at: order.created_at,

            user: {
                id: order.User.id,
                name: order.User.name,
                email: order.User.email
            },

            products: order.Products.map(p => ({
                name: p.name,
                quantity: p.OrderProduct.quantity
            }))
        }));

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: formattedOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving orders",
            data: error.message
        });
    }
});

// DELETE /orders/:id
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Order id is not valid",
                data: {}
            });
        }

        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                data: {}
            });
        }

        //sterg lista de produse asociate
        await OrderProduct.destroy({ where: { orderId: id } });

        //sterg Order
        await order.destroy();

        res.status(200).json({
            success: true,
            message: "Order successfully deleted",
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting the order",
            data: error.message
        });
    }
});






module.exports = router;

