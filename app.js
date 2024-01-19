import express from "express";
const app = express();

import cors from "cors";
import dotenv from "dotenv";
dotenv.config({path:"config/.env"});

const corsOptions = {
    origin : `${process.env.FRONTENDURL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type' , 'auth-token' , 'Accept' , 'Code' , 'Origin', 'Authorization'],
    credentials: true
}

app.use(cors(corsOptions)); 

app.use(express.json());

//mongoose connection
import connectDatabase from "./config/database.js"
connectDatabase();


import Item from "./models/item.js";
app.get('/getAll', async (req, res) => {
    try{
        console.log("1")
        const items = await Item.find();
        res.status(201).json(items);
    }
    catch (err){
        console.error('Error fetching the items:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/create', async (req, res) => {
    try{
        const {firstName,lastName , urlImg} = req.body;

        const olditem = await Item.find({firstName:firstName,lastName:lastName});
        console.log("y",olditem)
        if(olditem.length)
        {
            res.status(401).json({msg:"Already there"});
            return ;
        }

        const newItem = new Item({
            firstName : firstName,
            lastName : lastName,
            url: urlImg
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    }
    catch (err){
        console.error('Error while adding new item:', err);
        res.status(501).json({ error: 'Internal Server Error' });
    }
});
app.delete('/delete', async (req, res) => {
    try{
        const {firstName,lastName} = req.body;

        await Item.findOneAndDelete({firstName:firstName,lastName:lastName});
        const items = await Item.find();
        res.status(201).json(items);
    }
    catch (err){
        console.error('Error while adding new item:', err);
        res.status(501).json({ error: 'Internal Server Error' });
    }
});


app.listen(process.env.PORT,(req,res,err)=>{
    if(err)
    {
        console.log("Error while starting the server");
    }
    else console.log(`Server Running on the port : ${process.env.PORT}`)
})