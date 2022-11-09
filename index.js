const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lla9vff.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('luckyLens').collection('services');
        const reviewCollection = client.db('luckyLens').collection('reviews');
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });
        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }
            sort = { '_id': -1 }
            const cursor = reviewCollection.find(query).sort(sort);
            const newReview = await cursor.toArray();
            res.send(newReview);
            
        });
        
    }
    finally {

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('API Running...');
})
app.listen(port, () => {
    console.log(`API running on: ${port}`)
})