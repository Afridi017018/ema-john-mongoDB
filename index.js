const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x606k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const app = express()

app.use(bodyParser.json())
app.use(cors());

const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  
 
  app.post('/addProduct', (req,res)=>{
    const products = req.body;
//console.log(product);

    productsCollection.insertMany(products)
    .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount)
    })
  })

app.get('/products',(req,res)=>{

    productsCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents);
    })

})

app.get('/product/:id',(req,res)=>{

    productsCollection.find({id: req.params.id})
    .toArray((err,documents)=>{
        res.send(documents[0]);
    })

})

app.post('/productByIds',(req,res)=>{
const productKeys = req.body;
    productsCollection.find({id: {$in: productKeys}})
    .toArray((err,documents)=>{
        res.send(documents);
    })

})


app.post('/addOrder', (req,res)=>{
    const order = req.body;
//console.log(product);

    ordersCollection.insertOne(order)
    .then(result=>{
        ///console.log(result.insertedCount);
        res.send(result.insertedCount>0)
    })
  })

});


app.listen(port)