import Order from "../models/order.js"

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

        const order = new Order({
            orderId : orderId,
            email : req.user.email,
            name : orderInfo.name,
            address : orderInfo.address,
            phone : orderInfo.phone,
            total : 0,
            labelledTotal : 0,
            product : []
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