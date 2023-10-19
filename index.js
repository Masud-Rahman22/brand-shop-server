const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aw2xu1p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const brandsCollection = client.db('brandsDB').collection('brands')
        const cartsCollection = client.db('cartsDB').collection('carts')

        app.post('/cards', async (req, res) => {
            const newCard = req.body;
            const result = await brandsCollection.insertOne(newCard);
            res.send(result);
        })

        // app.post('/carts/:id',async(req,res)=>{
        //     const newItem = req.body
        // })

        app.get('/cards', async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // app.get('/details', async (req, res) => {
        //     const cursor = brandsCollection.find();
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/cards/:brandName',async(req,res)=>{
            const brandName = req.params.brandName;
            const query = { brandName: brandName }
            const result = await brandsCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/details/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await brandsCollection.findOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running properly')
})

app.listen(port, (req, res) => {
    console.log(`server is running on port: ${port}`);
})