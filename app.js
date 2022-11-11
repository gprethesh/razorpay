const express  = require("express")
require("dotenv").config()
const { v4: uuidv4 } = require('uuid');
const Razorpay = require('razorpay');



//Init
const app = express()
// Init or set EJS
app.set("view engine", "ejs")

// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))


app.get("/", (req, res)=> {
    res.status(201).send(`working`)
})

// PLACE A ORDER 
app.post("/orders", async(req, res)=> {

    try {
        const myAmount = req.body.amount
        const requiredamount = 400
        
        // try {
        //     let valx;
        //     if (myAmount < requiredamount) {
        //         return valx = res.status(403).json(`Error`)
        //         }
        // } catch (error) {
        //     console.log(error);
        // }

        console.log(`My Amount:`, myAmount);

        let instance = new Razorpay({ key_id: process.env.RAZORPAYKEY, key_secret: process.env.RAZORPAY_API_KEY })
        const myOrders = await instance.orders.create({
            amount: myAmount *100,
            currency: "INR",
            receipt:  uuidv4(),
        })

    
        res.status(200).json({
            success: true,
            myAmount,
            myOrders
        })
        console.log(`on success Amount`, myAmount, `My orders:`, myOrders);
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

// GET INFO BY ORDER ID
app.get("/order/:id", async (req, res)=>{
    try {
        
        const orderId = req.params.id
        console.log(orderId);
        let instance = new Razorpay({ key_id: process.env.RAZORPAYKEY, key_secret: process.env.RAZORPAY_API_KEY })

        const dataval = await instance.orders.fetch(orderId)

        console.log(dataval);
        res.status(200).json({
            success: true,
            dataval
        })
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
})

app.get("/payment", (req, res)=> {
    res.render("payment")
})

module.exports = app