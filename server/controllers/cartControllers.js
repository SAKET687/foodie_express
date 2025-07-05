import userModel from "../models/userModel.js";

// add food items to user cart
const addToCart = async (req, res) => {
    try {

        // let userData = await userModel.findOne({ _id: req.body.userId });
        // let cartData = await userModel.findById({ _id: req.body.userId });

        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(userData._id, { cartData });
        res.json({ success: true, message: "Item's added to cart." })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Item isn't added, try again." })
    }
};


// remove food items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(userData._id, { cartData });
        res.json({ success: true, message: "Item's removed from cart." })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Item isn't removed, try again." })
    }
};


// get food items from user cart
const getCart = async (request, response) => {
    try {
        // let userData = await userModel.findOne({ _id: request.body.userId });
        // let userData = await userModel.findById(req.body.userId);
        // let cartData = await userData.cartData;

        let userData = await userModel.findById(request.body.userId);
        let cartData = await userData.cartData;

        response.json({ success: true,  cartData, message: "Cart items loaded successfully." })
    } catch (error) {
        console.error(error);
        response.json({ success: false, message: "Error to fetch cart details, try again." })
    }
};


export { addToCart, removeFromCart, getCart };




