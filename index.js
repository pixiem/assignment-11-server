const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f6666.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();  
        const database = client.db('tourist_spot');
       const productsCollection = database.collection('spot_list');
       
       const allorders = client.db('all_order');
        const singleorder = allorders.collection('single_order');

        app.get('/products',async(req,res)=>{
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/products/:id', async (req, res) =>  {
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const place = await productsCollection.findOne(query);
           res.json(place);

        })

        app.post("/myorder", async(req,res)=>{
            const order = req.body;
            const ordered = await singleorder.insertOne(order);

            res.json(ordered);
        });
        app.get('/myorder',async(req,res)=>{
            const cursor = singleorder.find({});
            const order = await cursor.toArray();
            res.send(order);
        });
        app.delete("/deleteOrder/:id", async (req, res) =>  {
            const id = req.params.id;
            const dele = await singleorder.deleteOne({_id:id});
            res.json(dele); 


         });
        

        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('emajohn server is running');

});
app.listen(port,()=>{
    console.log('Server is running',port);
})