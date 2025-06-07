import Order from "../models/order.js"
import Product from "../models/product.js"

export async function createOrder(req, res) {
    // //get user info
    if(req.user == null) {
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }

    const orderInfo = req.body
    
    //add current user name if not provided
    if (orderInfo.name == null) {
        orderInfo.name = req.user.firstname+" "+req.user.lastname
    }

    // // orderId generate
    let orderId = "CBC00001"

    const lastOrder = await Order.find().sort({createdAt : -1}).limit(1)

    if (lastOrder.length > 0) {
        const lastOrderId = lastOrder[0].orderId
        const lastOrderIdNumber = parseInt(lastOrderId.replace("CBC", ""))
        const neworderIdNumber = (parseInt(lastOrderIdNumber)+1)
        orderId = "CBC"+String(neworderIdNumber).padStart(4, '0')
    }

    try {

        let total = 0;
        let labelledTotal = 0;
        const products = []

        for (let i = 0; i < orderInfo.products.length; i++) {
            const productEntry = orderInfo.products[i];
            const productId = orderInfo.products[i].productInfo.productId;
            const quantity = orderInfo.products[i].productInfo.quantity;

            if (!productId || quantity == null) {
                res.status(400).json({
                    message: "Invalid product entry: missing productId or quantity"
                });
                return;
            }

            const item = await Product.findOne({ productId: productId });

            if (!item) {
                res.status(404).json({
                    message: `Product with id ${productId} not found`
                });
                return;
            }

            if (!item.isAvailable) {
                res.status(404).json({
                    message: `Product with id ${productId} is not available`
                });
                return;
            }

            products[i] = {
                productInfo: {
                    productId: item.productId,
                    name: item.name,
                    altNames: Array.isArray(item.altName) ? item.altName : [item.altName],
                    description: item.description,
                    images: Array.isArray(item.image) ? item.image : [item.image],
                    labelledPrice: item.labelledPrice,
                    price: item.price
                },
                quantity: quantity
            };


            total += item.price * quantity;
            labelledTotal += item.labelledPrice * quantity;
        }

        const order = new Order({
            orderId : orderId,
            email : req.user.email,
            name : orderInfo.name,
            address : orderInfo.address,
            phone : orderInfo.phone,
            total : total,
            labelledTotal : labelledTotal,
            products : products
        }) 

        const createdOrder = await order.save()

        res.json({
            message : "Order created successfully",
            order : createdOrder
        })
        
    
    } catch (error) {
        res.status(500).json({
            message : "Error creating order",
            error: error
        })
    }     
}

export async function getOrders(req, res) {

    if(req.user == null) {
        res.status(403).json({
            message : "Please login and try again"
        })
        return
    }
    try{
        if(req.user.role == "admin") {
            const orders = await Order.find()
            res.json(orders)
        }
        else {
            const orders = await Order.find({email : req.user.email})
            res.json(orders)
        }

    }
    catch(err){
        res.status(500).json({
            message : "Error getting orders",
            error: err
        })
    }
}   

// export async function updateOrderStatus(req, res) {
//     if(!isAdmin(req)) {
//         res.status(403).json({
//             message : "You are not authorized to update orders"
//         });
//         return;
//     }   
//     try{
//         const orderId = req.params.orderId
//         const status = req.params.status

//         await Order.updateOne(
//             {orderId : orderId},
//             {status : status}
//         )

//         res.json({
//             message : "Order status updated successfully"
//         })
//     }
//     catch(e){
//         res.status(500).json({
//             message : "Error updating order status",
//             error: e,
//         })
//         return;
//     }
// }

// Example Express controller
export async function updateOrderStatus(req, res) {
	const { orderId, status } = req.params;
	try {
		// Validate orderId and status
		if (!["pending", "delivered", "cancelled", "returned", "refunded"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const order = await Order.findOneAndUpdate(
			{ orderId },
			{ status },
			{ new: true }
		);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.json({ message: "Status updated", order });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Server error" });
	}
};
