const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectID } = require('bson');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b12rw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const inventoryCollection = client.db('fruitAndVeg').collection('inventory');

        app.get('/inventory', async (req, res)=>{
            const query = {};
            const cursor = inventoryCollection.find(query);
            const inventory =await cursor.toArray();
            res.send(inventory);
        })

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const inventory = await inventoryCollection.findOne(query);
            res.send(inventory);
        })


        //update_Quantity
        app.put('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const updateQuantity = req.body;
            const filter = {_id:ObjectID(id)};
            const options = {upsert: true}
            const updatedDoc ={
                $set: {
                    quantity: updateQuantity.newQuantity
                }
            };
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);

        })

        //delivery_product

        app.get('/delivery', async (req, res) => {
            res.send('hello')
        })

        app.put('/delivery/:id', async (req, res) => {
            const id = req.params.id;
            const updateQuantity = req.body;
            const delivery = updateQuantity.quantity - 1;
            const filter = { _id: ObjectID(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    quantity: delivery
                }
            };
            const result = await inventoryCollection.updateOne(filter, updatedDoc, options);

        })

        //Add Product

        app.post('/inventory', async (req, res) => {
            const newProduct = req.body;
            const result = await inventoryCollection.insertOne(newProduct);
            res.send(result);
        })

        //delete product

        app.delete('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) };
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);

        })

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('running')
});

app.listen(port, ()=>{
    console.log('running');
})