const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("running server");
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bojeg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const fruitCollection = client.db("fooddb").collection("foods");
    //GET Data
    app.get("/food", async (req, res) => {
      const query = {};
      const cursor = fruitCollection.find(query);
      const foods = await cursor.toArray();
      res.send(foods);
    });
    //GET single Data

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const food = await fruitCollection.findOne(query);
      res.send(food);
    });

    //POST Data
    app.post("/food", async (req, res) => {
      const newFood = req.body;
      const result = await fruitCollection.insertOne(newFood);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);
