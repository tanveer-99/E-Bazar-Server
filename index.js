const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
console.log(process.env.DB_USER);
const app = express()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2gqn9.mongodb.net/ebazardatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(cors());





client.connect(err => {
  const productCollection = client.db("ebazardatabase").collection("ebazarcollection");
  
  
  app.get('/products', (req, res)=> {
    productCollection.find({})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.delete('/delete/:id', (req, res)=> {
    console.log(req.params.id);
    productCollection.deleteOne( { _id : ObjectId(req.params.id) } )
    .then( result => console.log(result) )
  })
  
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      console.log(result);
      res.send('data inserted')
    })
  })

  console.log("database connected to ebazarcollection");
});



client.connect(err => {
  const UserCollection = client.db("ebazardatabase").collection("userorder");
  
  app.post('/checkout', (req, res) => {
    const userInfo = req.body;
    UserCollection.insertOne(userInfo)
    .then(result => {
      console.log(result);
      res.send('data inserted')
    })
  })


  app.get('/orderedItem', (req, res) => {
    UserCollection.find({_id : req.query.id})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

 app.get('/orderedItems', (req, res) => {
    UserCollection.find({ email : req.query.email})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  console.log("database connected to userorder");
});











  app.get('/', function (req, res) {
    res.send("hello world")
  })


  

  
  


 
  
    



app.listen(5000)