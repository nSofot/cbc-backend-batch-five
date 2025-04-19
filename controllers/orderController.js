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
        //const lastOrderIdNumber = lastOrderId.slice(3)
        const lastOrderIdNumber = parseInt(lastOrderId.replace("CBC", ""))
        const neworderIdNumber = (parseInt(lastOrderIdNumber)+1)
        orderId = "CBC"+String(neworderIdNumber).padStart(4, '0')
    }

    try {

        let total = 0;
        let labelledTotal = 0;
        const products = []

        for (let i = 0; i < orderInfo.products.length; i++) {

            const item = await Product.findOne({productId : orderInfo.products[i].productId})

            if (item == null) {
                res.status(404).json({
                    message : "Product with id "+orderInfo.products[i].productId+" not found"
                })
                return
            }

            if(!item.isAvailable) {
                res.status(404).json({
                    message : "Product with id "+orderInfo.products[i].productId+" is not available"
                })
                return
            }

            products[i] = {
                productInfo : {
                    productId : item.productId,
                    name : item.name,
                    price : item.price,
                    quantity : orderInfo.products[i].qty
                },

            }

            total += item.price * orderInfo.products[i].qty
            labelledTotal += item.labelledPrice * orderInfo.products[i].qty
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