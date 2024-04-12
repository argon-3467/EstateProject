import express from 'express';
// const Razorpay = require('razorpay');
import Razorpay from 'razorpay';
import crypto from 'crypto';
// import subscriptions from 'razorpay/dist/types/subscriptions';

//Middlewares which allows grouping of multiple route handlers into one.
const router = express.Router();

router.post('/orders', async(req, res) => {
      try {
        //Instantiate Razorpay instance
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET
        })

        const options = {
            amount: req.body.price,      // amount in the smallest currency unit(paise in INR)
            currency: "INR",
            receipt: "order_rcptid_11"
        }
        //Creating order for given options
        const order = await instance.orders.create(options);
        if(!order){
            res.status(500).send("Some error occured");
            console.log("Some error occured during creating order: ", order);
            return;
        }
        console.log("order received: ", order);
        res.json(order);
      } 
      catch (error) {
        res.status(500).send(error);
        console.log("Error occured: ", error);
      }
})

router.post('/success', async(req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", "GTrgWtNgYwXaqgCLhcPZNtRL");
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legitimate!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } 
    catch (error) {
        res.status(500).send(error);
        console.log("error occured while validating: ", error);
    }
})

export default router;